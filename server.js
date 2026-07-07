import express from 'express';
import cors from 'cors';
import axios from 'axios';
import 'dotenv/config';
import { sendQuoteEmail } from './server/lib/quoteMailer.js';
import { sendContactEmail, CONTACT_TO } from './server/lib/contactMailer.js';
import { verifyRecaptcha } from './server/lib/recaptcha.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Memoria caché para no pedir el Site ID en cada recarga (Optimización de velocidad)
let cachedSiteId = null;

// ----------------------------------------------------
// LLAVES DE ACCESO (TOKENS)
// ----------------------------------------------------

// Única llave necesaria: Microsoft Graph
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

    const items = listResponse.data.value.filter(item => {
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
app.get('/api/image/:wo', async (req, res) => {
  const { wo } = req.params;
  try {
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
        return res.redirect(downloadUrl);
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

// 4. RUTA COTIZACIÓN: Recibe formulario y envía correo a ventas
app.post('/api/quote', async (req, res) => {
  // Ajuste: Bypass automático si estamos en desarrollo local o con key de prueba
  const isDevelopment = process.env.NODE_ENV === 'development' || process.env.RECAPTCHA_SECRET_KEY === 'test';
  if (!isDevelopment) {
    if (!(await verifyRecaptcha(req, res))) return;
  } else {
    console.log('🚀 [reCAPTCHA] Bypass activado en ambiente de desarrollo para /api/quote');
  }

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

// 5. RUTA CONTACTO: Recibe formulario de contacto y envía correo
app.post('/api/contact', async (req, res) => {
  // Ajuste: Bypass automático si estamos en desarrollo local o con key de prueba
  const isDevelopment = process.env.NODE_ENV === 'development' || process.env.RECAPTCHA_SECRET_KEY === 'test';
  if (!isDevelopment) {
    if (!(await verifyRecaptcha(req, res))) return;
  } else {
    console.log('🚀 [reCAPTCHA] Bypass activado en ambiente de desarrollo para /api/contact');
  }

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