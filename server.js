import express from 'express';
import cors from 'cors';
import axios from 'axios';
import 'dotenv/config';
import { sendQuoteEmail, buildRentalQuoteEmailHtml, RENTAL_QUOTE_TO } from './server/lib/quoteMailer.js';
import { sendContactEmail, CONTACT_TO } from './server/lib/contactMailer.js';
import { enforceFormSecurity } from './server/lib/recaptcha.js';
import {
  buildAvailabilityMap,
  exceedsMaxRentalPeriod,
  rangesOverlap,
  toISODate,
} from './server/lib/rentalAvailability.js';

const app = express();
const PORT = 3001;

const allowedOrigins = [
  'https://sgsequipment.com',
  'https://www.sgsequipment.com',
  'https://sgs.rentals',
  'https://www.sgs.rentals',
  'http://localhost:5173',
  'http://localhost:8000',
  'http://localhost:3000',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        callback(null, true);
      } else {
        callback(new Error('Bloqueado por política CORS'));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

// Memoria caché para no pedir el Site ID en cada recarga (Optimización de velocidad)
let cachedSiteId = null;
let cachedBookingsSiteId = null;
let cachedBookingsListId = null;
let cachedBookingsColumns = null;

// ----------------------------------------------------
// LLAVES DE ACCESO (TOKENS)
// ----------------------------------------------------

// Única llave necesaria: Microsoft Graph (catálogo / lectura pública)
async function getGraphToken() {
  const response = await axios.post(
    `https://login.microsoftonline.com/${process.env.SP_TENANT_ID}/oauth2/v2.0/token`,
    new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_SP_CLIENT_ID,
      client_secret: process.env.SP_CLIENT_SECRET,
      grant_type: 'client_credentials',
      scope: 'https://graph.microsoft.com/.default',
    })
  );
  return response.data.access_token;
}

// App Registration aislada para escritura de reservas y Mail.Send
async function getRentalsAccessToken() {
  const tenantId = process.env.AZURE_RENTALS_TENANT_ID || process.env.AZURE_TENANT_ID || process.env.SP_TENANT_ID;
  const clientId = process.env.AZURE_RENTALS_CLIENT_ID;
  const clientSecret = process.env.AZURE_RENTALS_CLIENT_SECRET;

  if (!tenantId || !clientId || !clientSecret) {
    throw new Error(
      'Credenciales de Azure Rentals incompletas. Agrega AZURE_RENTALS_CLIENT_ID y AZURE_RENTALS_CLIENT_SECRET en .env'
    );
  }

  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    scope: 'https://graph.microsoft.com/.default',
    grant_type: 'client_credentials',
  });

  const response = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error_description || 'Error al obtener token de Rentals');
  return data.access_token;
}

function rentalSenderEmail() {
  return (
    process.env.AZURE_RENTALS_SENDER_EMAIL ||
    process.env.SENDER_EMAIL ||
    process.env.SMTP_FROM ||
    process.env.SMTP_USER ||
    ''
  );
}

function graphErrorBody(error) {
  return error.response?.data || error.message;
}

function logGraphFailure(label, url, payload, error) {
  console.error(`❌ ${label}`);
  if (url) console.error('URL:', url);
  if (payload) console.error('Payload:', JSON.stringify(payload, null, 2));
  console.error('Graph innerError:', JSON.stringify(error.response?.data?.error?.innerError || graphErrorBody(error), null, 2));
  console.error('Graph error completo:', JSON.stringify(graphErrorBody(error), null, 2));
}

async function sendRentalQuoteNotification(accessToken, payload) {
  const sender = rentalSenderEmail();
  const recipient = payload.to || RENTAL_QUOTE_TO;

  if (!sender) {
    throw new Error(
      'AZURE_RENTALS_SENDER_EMAIL / SENDER_EMAIL no configurado. Debe ser un buzón con licencia de Exchange Online'
    );
  }

  const html = buildRentalQuoteEmailHtml(payload);
  const displayName =
    payload.equipment.displayName ||
    `${payload.equipment.manufacturer || ''} ${payload.equipment.model || ''}`.trim() ||
    payload.equipment.title;
  const orderLabel = payload.orderId ? `Rental Order #${payload.orderId} — ` : '';
  const subject = `${orderLabel}New Rental Request - ${displayName} (${payload.customer.startDate} to ${payload.customer.endDate})`;
  const mailPayload = {
    message: {
      subject,
      body: {
        contentType: 'HTML',
        content: html,
      },
      toRecipients: [{ emailAddress: { address: recipient } }],
    },
    saveToSentItems: false,
  };

  console.log('[rentals/quote] Graph sendMail', { from: sender, to: recipient, subject });
  return axios.post(
    `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(sender)}/sendMail`,
    mailPayload,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );
}

// Función auxiliar para obtener el Site ID optimizado
async function getSiteId(accessToken) {
  if (cachedSiteId) return cachedSiteId;
  const url = new URL(process.env.SP_SITE_URL);
  const siteIdResponse = await axios.get(
    `https://graph.microsoft.com/v1.0/sites/${url.hostname}:${url.pathname}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  cachedSiteId = siteIdResponse.data.id;
  return cachedSiteId;
}

function parseSharePointChoice(value) {
  if (value == null) return "";

  if (Array.isArray(value)) {
    return value
      .map((item) => parseSharePointChoice(item))
      .filter(Boolean)
      .join(", ");
  }

  if (typeof value === "object") {
    if (Array.isArray(value.results)) {
      return value.results
        .map((item) => parseSharePointChoice(item))
        .filter(Boolean)
        .join(", ");
    }
    for (const key of ["Label", "Value", "lookupValue", "DisplayName"]) {
      if (typeof value[key] === "string" && value[key].trim()) return value[key].trim();
    }
    return "";
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed.includes(";")) {
      return trimmed
        .split(";")
        .map((part) => part.trim())
        .filter(Boolean)
        .join(", ");
    }
    return trimmed;
  }

  if (typeof value === "number" || typeof value === "boolean") return String(value).trim();
  return "";
}

function getStatusRaw(fields) {
  if (fields.Status !== undefined) return fields.Status;
  for (const [key, value] of Object.entries(fields)) {
    if (key.toLowerCase() === "status") return value;
  }
  return null;
}

function isRentalEquipment(fields) {
  const value =
    fields.Rentals ??
    fields.rentals ??
    Object.entries(fields).find(([key]) => key.toLowerCase() === "rentals")?.[1];
  return value === true || value === 1 || value === "Yes";
}

function parseEquipmentReturnDate(fields) {
  return (
    toISODate(fields.ReturnDate) ||
    toISODate(fields.EstimatedReturnDate) ||
    toISODate(fields.EstimatedReturn) ||
    toISODate(fields.AvailableFrom) ||
    toISODate(fields.Return_x0020_Date) ||
    null
  );
}

function sanitizeText(value, maxLen) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLen);
}

function isValidISODate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function fetchAllGraphItems(url, accessToken) {
  const items = [];
  let nextUrl = url;

  while (nextUrl) {
    const response = await axios.get(nextUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    items.push(...(response.data.value || []));
    nextUrl = response.data['@odata.nextLink'] || null;
  }

  return items;
}

function bookingsListName() {
  return process.env.SP_BOOKINGS_LIST_NAME || process.env.SP_RENTALS_LIST_NAME || 'RentalBookings';
}

function siteUrlParts() {
  const siteUrl = process.env.SP_SITE_URL;
  if (!siteUrl) throw new Error('SP_SITE_URL no está definido en .env');
  const parsed = new URL(siteUrl);
  return {
    hostname: parsed.hostname,
    sitePath: parsed.pathname.replace(/\/$/, '') || '/',
  };
}

function graphAuthHeaders(accessToken) {
  return { Authorization: `Bearer ${accessToken}` };
}

function toBookingDateIso(dateStr, endOfDay = false) {
  const day = String(dateStr).split('T')[0];
  const time = endOfDay ? 'T23:59:59Z' : 'T00:00:00Z';
  const parsed = new Date(`${day}${time}`);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString();
}

function normalizeColumnKey(value) {
  return String(value || '').toLowerCase().replace(/[\s_]/g, '');
}

async function resolveBookingsSiteId(accessToken) {
  if (cachedBookingsSiteId) return cachedBookingsSiteId;
  if (cachedSiteId) {
    cachedBookingsSiteId = cachedSiteId;
    return cachedBookingsSiteId;
  }

  const { hostname, sitePath } = siteUrlParts();
  const url = `https://graph.microsoft.com/v1.0/sites/${hostname}:${sitePath}`;
  try {
    const response = await axios.get(url, { headers: graphAuthHeaders(accessToken) });
    cachedBookingsSiteId = response.data.id;
    cachedSiteId = cachedBookingsSiteId;
    console.log('[rentals] Site ID cacheado:', cachedBookingsSiteId);
    return cachedBookingsSiteId;
  } catch (error) {
    logGraphFailure('GET siteId', url, null, error);
    throw error;
  }
}

async function fetchBookingsListId(accessToken, siteId) {
  const listName = bookingsListName();
  const escapedName = listName.replace(/'/g, "''");
  const filterUrl = `https://graph.microsoft.com/v1.0/sites/${siteId}/lists?$filter=${encodeURIComponent(`displayName eq '${escapedName}'`)}`;

  try {
    const response = await axios.get(filterUrl, {
      headers: {
        ...graphAuthHeaders(accessToken),
        Prefer: 'HonorNonIndexedQueriesWarningMayFailRandomly',
      },
    });
    const match = response.data.value?.find(Boolean);
    if (match?.id) return match.id;
  } catch (error) {
    logGraphFailure('GET lists $filter displayName', filterUrl, null, error);
  }

  const byNameUrl = `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${encodeURIComponent(listName)}`;
  try {
    const response = await axios.get(byNameUrl, { headers: graphAuthHeaders(accessToken) });
    if (response.data?.id) return response.data.id;
  } catch (error) {
    logGraphFailure('GET list by name', byNameUrl, null, error);
  }

  return process.env.SHAREPOINT_RENTAL_LIST_ID || process.env.SP_BOOKINGS_LIST_ID || null;
}

async function resolveBookingsListId(accessToken, siteId) {
  if (cachedBookingsListId) return cachedBookingsListId;

  let listId = await fetchBookingsListId(accessToken, siteId);
  if (!listId) {
    console.warn('[rentals] Token Rentals no resolvió RentalBookings; reintento con token de catálogo (solo lectura)');
    const catalogToken = await getGraphToken();
    listId = await fetchBookingsListId(catalogToken, siteId);
  }

  if (!listId) {
    throw new Error(`No se encontró la lista ${bookingsListName()} en el sitio de SharePoint.`);
  }

  cachedBookingsListId = listId;
  console.log('[rentals] List ID cacheado (RentalBookings):', cachedBookingsListId);
  return cachedBookingsListId;
}

async function getBookingsContext(accessToken) {
  const siteId = await resolveBookingsSiteId(accessToken);
  const listId = await resolveBookingsListId(accessToken, siteId);
  return { siteId, listId };
}

async function getBookingsColumns(accessToken, siteId, listId) {
  if (cachedBookingsColumns) return cachedBookingsColumns;
  const url = `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/columns?$select=name,displayName`;
  try {
    const columns = await fetchAllGraphItems(url, accessToken);
    cachedBookingsColumns = columns;
    console.log(
      '[rentals] Columnas de RentalBookings:',
      columns.map((column) => `${column.displayName} [${column.name}]`)
    );
    return columns;
  } catch (error) {
    logGraphFailure('GET list columns', url, null, error);
    throw error;
  }
}

function resolveGraphFieldName(columns, desiredName) {
  const wanted = normalizeColumnKey(desiredName);
  const column = columns.find(
    (item) =>
      normalizeColumnKey(item.name) === wanted ||
      normalizeColumnKey(item.displayName) === wanted
  );
  return column?.name || null;
}

function formatContactMethod(email, phone) {
  return `Email: ${email} / Phone: ${phone}`;
}

function buildBookingFields(desiredFields, columns) {
  const coreKeys = new Set([
    'Title',
    'StartDate',
    'EndDate',
    'BookingStatus',
    'ClientName',
    'BookingAddress',
    'ContactMethod',
  ]);
  if (!columns?.length) {
    return Object.fromEntries(
      Object.entries(desiredFields).filter(([key]) => coreKeys.has(key))
    );
  }

  const fields = {};
  for (const [key, value] of Object.entries(desiredFields)) {
    const graphName = resolveGraphFieldName(columns, key);
    if (!graphName) {
      console.warn(`[rentals] Columna ausente en RentalBookings, se omite: ${key}`);
      continue;
    }
    fields[graphName] = value;
  }
  return fields;
}

let rentalOrderQueue = Promise.resolve();
let lastAssignedRentalOrder = 0;

function enqueueRentalOrderWrite(task) {
  const run = rentalOrderQueue.then(task, task);
  rentalOrderQueue = run.then(
    () => undefined,
    () => undefined
  );
  return run;
}

function formatRentalOrder(nextNumber) {
  return String(nextNumber).padStart(4, '0');
}

function fallbackRentalOrderNumber() {
  const fromTimestamp = Number(String(Date.now()).slice(-4));
  if (fromTimestamp >= 1 && fromTimestamp <= 9999) return fromTimestamp;
  return 1 + (Date.now() % 9999);
}

function withRentalOrder(fields, formattedOrderId) {
  return { ...fields, RentalOrder: formattedOrderId };
}

async function resolveNextRentalOrder(accessToken, siteId, listId) {
  const listUrl = `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/items?$expand=fields($select=id,RentalOrder)&$orderby=id desc&$top=1`;

  try {
    const response = await axios.get(listUrl, {
      headers: {
        ...graphAuthHeaders(accessToken),
        Prefer: 'HonorNonIndexedQueriesWarningMayFailRandomly',
      },
    });
    const lastItem = response.data?.value?.[0];
    const lastVal = lastItem?.fields?.RentalOrder;
    let nextNumber = lastVal ? parseInt(lastVal, 10) + 1 : 1;
    if (!Number.isFinite(nextNumber) || nextNumber < 1) nextNumber = 1;
    if (lastAssignedRentalOrder >= nextNumber) nextNumber = lastAssignedRentalOrder + 1;
    return formatRentalOrder(nextNumber);
  } catch (error) {
    logGraphFailure('GET último Rental Order', listUrl, null, error);
    const nextNumber = lastAssignedRentalOrder >= 1 ? lastAssignedRentalOrder + 1 : fallbackRentalOrderNumber();
    console.error('[rentals/quote] Fallback Rental Order de 4 dígitos:', formatRentalOrder(nextNumber));
    return formatRentalOrder(nextNumber);
  }
}

async function fetchRentalBookings(accessToken, siteId, listId) {
  const listKey = listId || encodeURIComponent(bookingsListName());
  const url = `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listKey}/items?$expand=fields&$top=200`;
  const items = await fetchAllGraphItems(url, accessToken);

  return items.map((item) => {
    const fields = item.fields || {};
    return {
      workOrder: String(fields.Title || '').trim(),
      startDate: fields.StartDate,
      endDate: fields.EndDate,
      bookingStatus: parseSharePointChoice(fields.BookingStatus),
    };
  });
}

function parseMfgYear(fields) {
  const raw =
    fields.MFGDate ||
    fields.MFG_x0020_Date ||
    fields.Year ||
    fields.MfgYear ||
    fields.ModelYear ||
    fields.Manufacturing_x0020_Year ||
    "";

  if (!raw) return "";

  if (typeof raw === "string" && raw.includes("T")) {
    const year = new Date(raw).getFullYear();
    return Number.isFinite(year) ? String(year) : "";
  }

  return String(raw).trim();
}

// ----------------------------------------------------
// RUTAS DEL BACKEND
// ----------------------------------------------------

// 1. RUTA PRINCIPAL: Datos del Catálogo
app.get('/api/equipment', async (req, res) => {
  try {
    const accessToken = await getGraphToken();
    const siteId = await getSiteId(accessToken);

    const listResponse = await axios.get(
      `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${process.env.SP_LIST_NAME}/items?expand=fields`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    const rawItems = listResponse.data.value;
    const items = rawItems.filter(item => {
      const f = item.fields;
      return f.AddedtoWebsite === true || f.AddedtoWebsite === "Yes" || f.Added_x0020_to_x0020_Website === true;
    }).map(item => {
      const f = item.fields;
      const rawCategory = f.AssetType || f.Equipmenttype || "";
      const workOrder = f.Title || ""; // El número de WO es la clave para la foto

      return {
        id: item.id,
        title: workOrder,
        manufacturer: f.Manufacturer || "",
        model: f.Model || "",
        mfgYear: parseMfgYear(f),
        status: parseSharePointChoice(getStatusRaw(f)),
        equipmentType: rawCategory,
        fuelType: f.FuelType || "",
        capacity: f.Capacity || "N/A",
        // Apuntamos a la nueva ruta pasándole el número de WO
        photoUrl: workOrder ? `/api/image/${workOrder}` : `https://via.placeholder.com/400x300/e2e8f0/475569?text=Sin+WO`,
        isFeatured: f.isFeatured === true || f.isFeatured === "Yes",
        isRental: isRentalEquipment(f),
        returnDate: parseEquipmentReturnDate(f),
        displayName: `${f.Manufacturer || ""}-${f.Model || ""} ${f.FuelType || ""} ${rawCategory} - ${workOrder}`,
        description: f.Description || f.description || "No description available for this equipment.",
      };
    });

    res.json(items);
  } catch (error) {
    console.error('Error in /api/equipment:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch equipment' });
  }
});

// 2. RUTA IMAGEN PRINCIPAL: Busca la primera foto en la carpeta WATERMARK
// Proxea bytes (no redirect) para que el PDF/canvas puedan embeber sin CORS.
app.get('/api/image/:wo', async (req, res) => {
  const { wo } = req.params;
  try {
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400');
    const accessToken = await getGraphToken();
    const siteId = await getSiteId(accessToken);

    const folderPath = `/General/Media/Fotos por Work Order/${wo}/WATERMARK`;
    const encodedPath = encodeURI(folderPath);

    const childrenResponse = await axios.get(
      `https://graph.microsoft.com/v1.0/sites/${siteId}/drive/root:${encodedPath}:/children?$top=1`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (childrenResponse.data.value && childrenResponse.data.value.length > 0) {
      const file = childrenResponse.data.value[0];
      const downloadUrl = file['@microsoft.graph.downloadUrl'];

      if (downloadUrl) {
        const imageResponse = await axios.get(downloadUrl, {
          responseType: 'arraybuffer',
          timeout: 30000,
        });
        const contentType = imageResponse.headers['content-type'] || 'image/jpeg';
        res.setHeader('Content-Type', contentType);
        return res.send(Buffer.from(imageResponse.data));
      }
    }

    res.redirect(`https://via.placeholder.com/400x300/e2e8f0/475569?text=Carpeta+Vacia+(${wo})`);

  } catch (error) {
    res.redirect(`https://via.placeholder.com/400x300/e2e8f0/475569?text=Sin+Foto+(${wo})`);
  }
});

// 3. RUTA GALERÍA: Trae todas las fotos de la carpeta WATERMARK para el carrusel
app.get('/api/gallery/:wo', async (req, res) => {
  const { wo } = req.params;
  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400');
  try {
    const accessToken = await getGraphToken();
    const siteId = await getSiteId(accessToken);

    const folderPath = `/General/Media/Fotos por Work Order/${wo}/WATERMARK`;
    const encodedPath = encodeURI(folderPath);

    const childrenResponse = await axios.get(
      `https://graph.microsoft.com/v1.0/sites/${siteId}/drive/root:${encodedPath}:/children`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (childrenResponse.data.value && childrenResponse.data.value.length > 0) {
      const imageUrls = childrenResponse.data.value
        .filter(file => file.file) // Asegurar que sean archivos y no subcarpetas
        .map(file => file['@microsoft.graph.downloadUrl']);
      
      return res.json(imageUrls);
    }
    
    res.json([]);

  } catch (error) {
    res.json([]);
  }
});

// 4. RUTA DISPONIBILIDAD RENTALS: Consulta RentalBookings en SharePoint
app.get('/api/rentals/availability', async (req, res) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
  res.setHeader("Pragma", "no-cache");

  try {
    const accessToken = await getGraphToken();
    const { siteId, listId } = await getBookingsContext(accessToken);
    const bookings = await fetchRentalBookings(accessToken, siteId, listId);
    res.json(buildAvailabilityMap(bookings));
  } catch (error) {
    console.error('Error in /api/rentals/availability:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch rental availability' });
  }
});

// 5. RUTA COTIZACIÓN RENTALS: Valida rango vs SharePoint y envía correo
app.post('/api/rentals/quote', async (req, res) => {
  const security = await enforceFormSecurity(req, res);
  if (security !== 'ok') return;

  const { customer, equipment } = req.body ?? {};

  const fullName = sanitizeText(customer?.fullName, 120);
  const email = sanitizeText(customer?.email, 254);
  const phone = sanitizeText(customer?.phone, 40);
  const company = sanitizeText(customer?.company, 120);
  const comments = sanitizeText(customer?.comments, 2000);
  const address = sanitizeText(customer?.address, 300);
  const startDate = sanitizeText(customer?.startDate, 10);
  const endDate = sanitizeText(customer?.endDate, 10);

  if (!fullName || !email || !phone || !company || !address || !startDate || !endDate) {
    return res.status(400).json({ error: 'Missing required rental quote fields' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  if (!isValidISODate(startDate) || !isValidISODate(endDate) || endDate < startDate) {
    return res.status(400).json({ error: 'Invalid rental date range' });
  }

  if (exceedsMaxRentalPeriod(startDate, endDate)) {
    return res.status(400).json({
      error:
        'El periodo máximo de renta continua es de 6 meses. Para contratos más extensos, contáctenos directamente.',
    });
  }

  if (!equipment?.id || !sanitizeText(equipment?.title, 80)) {
    return res.status(400).json({ error: 'Equipment work order is required' });
  }

  const workOrder = sanitizeText(equipment.title, 80);
  const startIso = toBookingDateIso(startDate, false);
  const endIso = toBookingDateIso(endDate, true);
  if (!startIso || !endIso) {
    return res.status(400).json({ error: 'Invalid rental date range' });
  }

  const estimatedDays = Math.round(
    (Date.parse(`${endDate}T00:00:00Z`) - Date.parse(`${startDate}T00:00:00Z`)) / 86400000
  ) + 1;
  const manufacturer = sanitizeText(equipment.manufacturer, 80);
  const model = sanitizeText(equipment.model, 80);
  const displayName =
    sanitizeText(equipment.displayName, 200) ||
    `${manufacturer} ${model}`.trim() ||
    workOrder;

  let accessToken;
  let nextOrder;

  try {
    console.log('--- Creando registro en SharePoint (RentalBookings) ---');
    accessToken = await getRentalsAccessToken();
    console.log('[rentals/quote] Token de Rentals obtenido');

    const { siteId, listId } = await getBookingsContext(accessToken);
    const itemsUrl = `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/items?$expand=fields&$top=200`;
    console.log('[rentals/quote] Validando overlap en RentalBookings:', itemsUrl);

    const existingItems = await fetchAllGraphItems(itemsUrl, accessToken);
    const bookings = existingItems.map((item) => {
      const fields = item.fields || {};
      return {
        workOrder: String(fields.Title || '').trim(),
        startDate: fields.StartDate,
        endDate: fields.EndDate,
        bookingStatus: parseSharePointChoice(fields.BookingStatus),
      };
    });
    const availability = buildAvailabilityMap(bookings)[workOrder];
    const requestedRange = { from: startDate, to: endDate };
    const blocked = availability?.disabledRanges?.some((range) => rangesOverlap(requestedRange, range));
    if (blocked) {
      console.log('[rentals/quote] Rango bloqueado por reserva existente', { workOrder, startDate, endDate });
      return res.status(409).json({ error: 'Selected dates overlap an existing booking' });
    }

    const desiredFields = {
      Title: workOrder,
      StartDate: startIso,
      EndDate: endIso,
      BookingStatus: 'Pendiente',
      ClientName: fullName,
      BookingAddress: address,
      ContactMethod: formatContactMethod(email, phone),
      ClientEmail: email,
      Phone: phone,
      Company: company,
      EquipmentId: String(equipment.id),
      Comments: comments || '',
    };

    let columns = [];
    try {
      columns = await getBookingsColumns(accessToken, siteId, listId);
    } catch (columnsError) {
      console.warn('[rentals/quote] No se pudieron leer columnas; se enviarán los campos canónicos');
    }

    const createUrl = `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/items`;
    const coreKeys = new Set([
      'Title',
      'StartDate',
      'EndDate',
      'BookingStatus',
      'ClientName',
      'BookingAddress',
      'ContactMethod',
    ]);

    const created = await enqueueRentalOrderWrite(async () => {
      const formattedOrderId = await resolveNextRentalOrder(accessToken, siteId, listId);
      const mappedFields = withRentalOrder(buildBookingFields(desiredFields, columns), formattedOrderId);
      mappedFields.ContactMethod = desiredFields.ContactMethod;
      const itemPayload = { fields: mappedFields };

      console.log('📤 Enviando item a RentalBookings:', createUrl, JSON.stringify(itemPayload));

      try {
        const spRes = await axios.post(createUrl, itemPayload, {
          headers: {
            ...graphAuthHeaders(accessToken),
            'Content-Type': 'application/json',
          },
        });
        lastAssignedRentalOrder = parseInt(formattedOrderId, 10);
        return { spRes, order: formattedOrderId };
      } catch (createError) {
        logGraphFailure('POST RentalBookings (campos mapeados)', createUrl, itemPayload, createError);
        cachedBookingsColumns = null;
        try {
          columns = await getBookingsColumns(accessToken, siteId, listId);
        } catch {
          // already logged
        }

        const coreDesired = Object.fromEntries(
          Object.entries(desiredFields).filter(([key]) => coreKeys.has(key))
        );
        const corePayload = {
          fields: withRentalOrder(buildBookingFields(coreDesired, columns), formattedOrderId),
        };
        corePayload.fields.ContactMethod = desiredFields.ContactMethod;
        console.log('📤 Reintento con campos canónicos:', JSON.stringify(corePayload));
        const spRes = await axios.post(createUrl, corePayload, {
          headers: {
            ...graphAuthHeaders(accessToken),
            'Content-Type': 'application/json',
          },
        });
        lastAssignedRentalOrder = parseInt(formattedOrderId, 10);
        return { spRes, order: formattedOrderId };
      }
    });

    nextOrder = created.order;
    console.log('✅ Item creado con éxito en SharePoint! ID:', created.spRes.data?.id, 'Rental Order:', nextOrder);
  } catch (spError) {
    logGraphFailure('SharePoint RentalBookings', null, null, spError);
    return res.status(500).json({
      step: 'sharepoint',
      error: graphErrorBody(spError),
    });
  }

  try {
    console.log('--- Enviando notificación por correo ---');
    await sendRentalQuoteNotification(accessToken, {
      customer: {
        fullName,
        email,
        phone,
        company,
        address,
        comments,
        startDate,
        endDate,
      },
      equipment: {
        id: equipment.id,
        title: workOrder,
        manufacturer,
        model,
        equipmentType: sanitizeText(equipment.equipmentType, 80),
        displayName,
      },
      receivedAt: new Date().toISOString(),
      estimatedDays,
      orderId: nextOrder,
      to: RENTAL_QUOTE_TO,
    });
    console.log('✅ Correo enviado con éxito');
  } catch (mailError) {
    console.error('❌ Error en Email:', JSON.stringify(graphErrorBody(mailError), null, 2));
    return res.status(200).json({
      success: true,
      orderId: nextOrder,
      message: 'Quote submitted successfully',
      warning: 'Guardado en SharePoint pero falló el envío de correo',
    });
  }

  return res.status(200).json({
    success: true,
    orderId: nextOrder,
    message: 'Quote submitted successfully',
  });
});

// 6. RUTA COTIZACIÓN: Recibe formulario y envía correo a ventas
app.post('/api/quote', async (req, res) => {
  const security = await enforceFormSecurity(req, res);
  if (security !== 'ok') return;

  const { customer, equipment } = req.body ?? {};

  if (
    !customer?.fullName?.trim() ||
    !customer?.email?.trim() ||
    !customer?.phone?.trim() ||
    !customer?.requestedDate ||
    !customer?.interestType
  ) {
    return res.status(400).json({ error: 'Missing required customer fields' });
  }

  if (!['rent', 'buy'].includes(customer.interestType)) {
    return res.status(400).json({ error: 'Invalid interest type' });
  }

  if (!Array.isArray(equipment) || equipment.length === 0) {
    return res.status(400).json({ error: 'At least one equipment item is required' });
  }

  const receivedAt = new Date().toISOString();
  const normalizedCustomer = {
    fullName: customer.fullName.trim(),
    email: customer.email.trim(),
    phone: customer.phone.trim(),
    interestType: customer.interestType,
    requestedDate: customer.requestedDate,
  };

  const normalizedEquipment = equipment.map((item) => ({
    id: item.id,
    title: item.title,
    manufacturer: item.manufacturer || '',
    model: item.model || '',
    equipmentType: item.equipmentType || '',
    displayName: item.displayName || '',
    photoUrl: item.photoUrl || '',
  }));

  try {
    await sendQuoteEmail({
      customer: normalizedCustomer,
      equipment: normalizedEquipment,
      receivedAt,
    });

    console.log('[quote] Email sent to sales@sgsequipment.com for', normalizedCustomer.email);
    res.status(201).json({ ok: true, message: 'Quote received and email sent successfully' });
  } catch (error) {
    console.error('[quote] Failed to send email:', error.message);
    res.status(500).json({
      error: 'Failed to send quote email. Please try again or contact sales directly.',
    });
  }
});

// 7. RUTA CONTACTO: Recibe formulario de contacto y envía correo
app.post('/api/contact', async (req, res) => {
  const security = await enforceFormSecurity(req, res);
  if (security !== 'ok') return;

  const { firstName, lastName, companyName, email, reason, message } = req.body ?? {};

  if (
    !firstName?.trim() ||
    !lastName?.trim() ||
    !companyName?.trim() ||
    !email?.trim() ||
    !reason?.trim() ||
    !message?.trim()
  ) {
    return res.status(400).json({ error: 'Missing required contact fields' });
  }

  const validReasons = [
    'Equipment Purchase',
    'Equipment Rental',
    'Repair Services',
    'Technical Support',
  ];

  if (!validReasons.includes(reason)) {
    return res.status(400).json({ error: 'Invalid reason' });
  }

  const receivedAt = new Date().toISOString();
  const normalizedContact = {
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    companyName: companyName.trim(),
    email: email.trim(),
    reason: reason.trim(),
    message: message.trim(),
  };

  try {
    await sendContactEmail({ contact: normalizedContact, receivedAt });

    // Ajuste: Fallback seguro para evitar el ReferenceError si CONTACT_TO es undefined
    const safeContactTo = typeof CONTACT_TO !== 'undefined' ? CONTACT_TO : 'sales@sgsequipment.com';
    console.log('[contact] Email sent to', safeContactTo, 'for', normalizedContact.email);
    res.status(201).json({ ok: true, message: 'Contact message sent successfully' });
  } catch (error) {
    console.error('[contact] Failed to send email:', error.message);
    res.status(500).json({
      error: 'Failed to send your message. Please try again or call us directly.',
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});


export default app;