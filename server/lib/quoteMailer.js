import nodemailer from 'nodemailer';

const QUOTE_TO = process.env.QUOTE_TO || 'sales@sgsequipment.com';

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function interestLabel(interestType) {
  if (interestType === 'buy') return 'Compra / Buy';
  return 'Renta / Rent';
}

function workOrderFromItem(item) {
  if (item.title?.trim()) return item.title.trim();
  const m = String(item.photoUrl ?? '').match(/\/api\/image\/([^/?#]+)/);
  return m ? decodeURIComponent(m[1]) : '—';
}

export function buildQuoteEmailHtml({ customer, equipment, receivedAt }) {
  const rows = equipment
    .map(
      (item, index) => `
        <tr>
          <td style="padding:12px 14px;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:13px;">${index + 1}</td>
          <td style="padding:12px 14px;border-bottom:1px solid #e2e8f0;font-weight:600;color:#0f172a;">${escapeHtml(item.manufacturer)}</td>
          <td style="padding:12px 14px;border-bottom:1px solid #e2e8f0;color:#334155;">${escapeHtml(item.model)}</td>
          <td style="padding:12px 14px;border-bottom:1px solid #e2e8f0;color:#334155;">${escapeHtml(item.equipmentType)}</td>
          <td style="padding:12px 14px;border-bottom:1px solid #e2e8f0;font-family:Consolas,Monaco,monospace;color:#ea580c;font-weight:700;">${escapeHtml(workOrderFromItem(item))}</td>
        </tr>`
    )
    .join('');

  const formattedDate = escapeHtml(
    new Date(receivedAt).toLocaleString('es-CO', { dateStyle: 'full', timeStyle: 'short' })
  );

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Nueva Solicitud de Cotización - SGS Corp</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f1f5f9;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 4px 24px rgba(15,23,42,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%);padding:28px 32px;">
              <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#94a3b8;">SGS Ground Support Equipment</p>
              <h1 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;line-height:1.3;">
                Nueva Solicitud de Cotización Web - SGS Corp
              </h1>
              <p style="margin:10px 0 0;font-size:13px;color:#cbd5e1;">Recibida: ${formattedDate}</p>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 32px 8px;">
              <h2 style="margin:0 0 16px;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#ea580c;border-bottom:2px solid #fed7aa;padding-bottom:8px;">
                Bloque 1 — Datos de contacto
              </h2>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:14px;">
                <tr>
                  <td style="padding:8px 0;color:#64748b;width:140px;vertical-align:top;">Nombre completo</td>
                  <td style="padding:8px 0;color:#0f172a;font-weight:600;">${escapeHtml(customer.fullName)}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#64748b;vertical-align:top;">Correo electrónico</td>
                  <td style="padding:8px 0;"><a href="mailto:${escapeHtml(customer.email)}" style="color:#2563eb;text-decoration:none;">${escapeHtml(customer.email)}</a></td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#64748b;vertical-align:top;">Teléfono</td>
                  <td style="padding:8px 0;color:#0f172a;">${escapeHtml(customer.phone)}</td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 32px 8px;">
              <h2 style="margin:0 0 16px;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#ea580c;border-bottom:2px solid #fed7aa;padding-bottom:8px;">
                Bloque 2 — Equipos seleccionados (${equipment.length})
              </h2>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;font-size:13px;">
                <thead>
                  <tr style="background:#f8fafc;">
                    <th style="padding:10px 14px;text-align:left;color:#64748b;font-size:11px;text-transform:uppercase;">#</th>
                    <th style="padding:10px 14px;text-align:left;color:#64748b;font-size:11px;text-transform:uppercase;">Marca</th>
                    <th style="padding:10px 14px;text-align:left;color:#64748b;font-size:11px;text-transform:uppercase;">Modelo</th>
                    <th style="padding:10px 14px;text-align:left;color:#64748b;font-size:11px;text-transform:uppercase;">Categoría</th>
                    <th style="padding:10px 14px;text-align:left;color:#64748b;font-size:11px;text-transform:uppercase;">Work Order</th>
                  </tr>
                </thead>
                <tbody>${rows}</tbody>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 32px 32px;">
              <h2 style="margin:0 0 16px;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#ea580c;border-bottom:2px solid #fed7aa;padding-bottom:8px;">
                Bloque 3 — Detalles comerciales
              </h2>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;font-size:14px;">
                <tr>
                  <td style="padding:16px 20px;color:#64748b;width:160px;">Tipo de negocio</td>
                  <td style="padding:16px 20px;color:#0f172a;"><strong style="font-size:16px;">${escapeHtml(interestLabel(customer.interestType))}</strong></td>
                </tr>
                <tr>
                  <td style="padding:16px 20px;color:#64748b;border-top:1px solid #e2e8f0;">Fecha requerida</td>
                  <td style="padding:16px 20px;color:#0f172a;border-top:1px solid #e2e8f0;"><strong style="font-size:16px;color:#ea580c;">${escapeHtml(customer.requestedDate)}</strong></td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="background:#f8fafc;padding:16px 32px;border-top:1px solid #e2e8f0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#94a3b8;">
                Mensaje generado automáticamente desde el sitio web SGS Equipment.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error(
      'SMTP not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS in .env'
    );
  }

  const port = Number(process.env.SMTP_PORT || 587);
  const secure = process.env.SMTP_SECURE === 'true';

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

export async function sendQuoteEmail({ customer, equipment, receivedAt }) {
  const transporter = createTransporter();
  const html = buildQuoteEmailHtml({ customer, equipment, receivedAt });
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const subject = `[SGS Web] Cotización — ${customer.fullName} (${equipment.length} equipo${equipment.length > 1 ? 's' : ''})`;

  const text = [
    'Nueva Solicitud de Cotización Web - SGS Corp',
    '',
    '--- Datos de contacto ---',
    `Nombre: ${customer.fullName}`,
    `Email: ${customer.email}`,
    `Teléfono: ${customer.phone}`,
    '',
    '--- Equipos ---',
    ...equipment.map((item, i) => {
      const wo = workOrderFromItem(item);
      return `${i + 1}. ${item.manufacturer} ${item.model} | ${item.equipmentType} | WO: ${wo}`;
    }),
    '',
    '--- Comercial ---',
    `Tipo: ${interestLabel(customer.interestType)}`,
    `Fecha requerida: ${customer.requestedDate}`,
  ].join('\n');

  await transporter.sendMail({
    from: `"SGS Web Quotes" <${from}>`,
    to: QUOTE_TO,
    replyTo: customer.email,
    subject,
    text,
    html,
  });
}
