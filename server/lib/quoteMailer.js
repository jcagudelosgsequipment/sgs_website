import nodemailer from 'nodemailer';

const QUOTE_TO = process.env.QUOTE_TO || 'sales@sgsequipment.com';
export const RENTAL_QUOTE_TO = process.env.RENTAL_QUOTE_TO || 'sales@sgsequipment.com';

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function interestLabel(interestType) {
  if (interestType === 'buy') return 'Purchase';
  return 'Rental';
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
    new Date(receivedAt).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })
  );
  const dayLabel = Number(customer.estimatedDays) === 1 ? 'day' : 'days';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Quote Request - SGS Corp</title>
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
                New Quote Request
              </h1>
              <p style="margin:10px 0 0;font-size:13px;color:#cbd5e1;">Received: ${formattedDate}</p>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 32px 8px;">
              <h2 style="margin:0 0 16px;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#ea580c;border-bottom:2px solid #fed7aa;padding-bottom:8px;">
                Customer Details
              </h2>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:14px;">
                <tr>
                  <td style="padding:8px 0;color:#64748b;width:140px;vertical-align:top;">Name</td>
                  <td style="padding:8px 0;color:#0f172a;font-weight:600;">${escapeHtml(customer.fullName)}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#64748b;vertical-align:top;">Email</td>
                  <td style="padding:8px 0;"><a href="mailto:${escapeHtml(customer.email)}" style="color:#2563eb;text-decoration:none;">${escapeHtml(customer.email)}</a></td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#64748b;vertical-align:top;">Phone</td>
                  <td style="padding:8px 0;color:#0f172a;">${escapeHtml(customer.phone)}</td>
                </tr>
                ${
                  customer.company
                    ? `<tr>
                  <td style="padding:8px 0;color:#64748b;vertical-align:top;">Company</td>
                  <td style="padding:8px 0;color:#0f172a;">${escapeHtml(customer.company)}</td>
                </tr>`
                    : ''
                }
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 32px 8px;">
              <h2 style="margin:0 0 16px;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#ea580c;border-bottom:2px solid #fed7aa;padding-bottom:8px;">
                Selected Equipment (${equipment.length})
              </h2>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;font-size:13px;">
                <thead>
                  <tr style="background:#f8fafc;">
                    <th style="padding:10px 14px;text-align:left;color:#64748b;font-size:11px;text-transform:uppercase;">#</th>
                    <th style="padding:10px 14px;text-align:left;color:#64748b;font-size:11px;text-transform:uppercase;">Manufacturer</th>
                    <th style="padding:10px 14px;text-align:left;color:#64748b;font-size:11px;text-transform:uppercase;">Model</th>
                    <th style="padding:10px 14px;text-align:left;color:#64748b;font-size:11px;text-transform:uppercase;">Category</th>
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
                Commercial Details
              </h2>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;font-size:14px;">
                <tr>
                  <td style="padding:16px 20px;color:#64748b;width:160px;">Business type</td>
                  <td style="padding:16px 20px;color:#0f172a;"><strong style="font-size:16px;">${escapeHtml(interestLabel(customer.interestType))}</strong></td>
                </tr>
                <tr>
                  <td style="padding:16px 20px;color:#64748b;border-top:1px solid #e2e8f0;">Required date</td>
                  <td style="padding:16px 20px;color:#0f172a;border-top:1px solid #e2e8f0;"><strong style="font-size:16px;color:#ea580c;">${escapeHtml(customer.requestedDate)}</strong></td>
                </tr>
                ${
                  customer.startDate && customer.endDate
                    ? `<tr>
                  <td style="padding:16px 20px;color:#64748b;border-top:1px solid #e2e8f0;">Rental period</td>
                  <td style="padding:16px 20px;color:#0f172a;border-top:1px solid #e2e8f0;"><strong style="font-size:16px;color:#ea580c;">${escapeHtml(customer.startDate)} → ${escapeHtml(customer.endDate)}${customer.estimatedDays ? ` (${customer.estimatedDays} ${dayLabel})` : ''}</strong></td>
                </tr>`
                    : ''
                }
                ${
                  customer.comments
                    ? `<tr>
                  <td style="padding:16px 20px;color:#64748b;border-top:1px solid #e2e8f0;vertical-align:top;">Comments</td>
                  <td style="padding:16px 20px;color:#0f172a;border-top:1px solid #e2e8f0;white-space:pre-wrap;">${escapeHtml(customer.comments)}</td>
                </tr>`
                    : ''
                }
              </table>
            </td>
          </tr>

          <tr>
            <td style="background:#f8fafc;padding:16px 32px;border-top:1px solid #e2e8f0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#94a3b8;">
                This message was generated automatically from the SGS Equipment website.
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

function formatReadableDate(isoDate) {
  if (!isoDate) return '—';
  const [year, month, day] = String(isoDate).split('-').map(Number);
  if (!year || !month || !day) return String(isoDate);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export function buildRentalQuoteEmailHtml({ customer, equipment, receivedAt, estimatedDays, orderId }) {
  const formattedDate = escapeHtml(
    new Date(receivedAt).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })
  );
  const workOrder = equipment.title || equipment.id || '—';
  const displayName = equipment.displayName || `${equipment.manufacturer || ''} ${equipment.model || ''}`.trim() || workOrder;
  const dayLabel = Number(estimatedDays) === 1 ? 'day' : 'days';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Rental Request - SGS Corp</title>
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
                New Rental Request
              </h1>
              ${
                orderId
                  ? `<p style="margin:14px 0 0;font-size:20px;font-weight:700;color:#ffffff;">Rental Order: #${escapeHtml(orderId)}</p>`
                  : ''
              }
              <p style="margin:10px 0 0;font-size:13px;color:#cbd5e1;">Received: ${formattedDate}</p>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 32px 8px;">
              <h2 style="margin:0 0 16px;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#ea580c;border-bottom:2px solid #fed7aa;padding-bottom:8px;">
                Customer Details
              </h2>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:14px;">
                <tr>
                  <td style="padding:8px 0;color:#64748b;width:140px;vertical-align:top;">Name</td>
                  <td style="padding:8px 0;color:#0f172a;font-weight:600;">${escapeHtml(customer.fullName)}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#64748b;vertical-align:top;">Company</td>
                  <td style="padding:8px 0;color:#0f172a;">${escapeHtml(customer.company || '—')}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#64748b;vertical-align:top;">Email</td>
                  <td style="padding:8px 0;"><a href="mailto:${escapeHtml(customer.email)}" style="color:#2563eb;text-decoration:none;">${escapeHtml(customer.email)}</a></td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#64748b;vertical-align:top;">Phone</td>
                  <td style="padding:8px 0;color:#0f172a;">${escapeHtml(customer.phone)}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#64748b;vertical-align:top;">Destination address</td>
                  <td style="padding:8px 0;color:#0f172a;white-space:pre-wrap;">${escapeHtml(customer.address || '—')}</td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 32px 8px;">
              <h2 style="margin:0 0 16px;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#ea580c;border-bottom:2px solid #fed7aa;padding-bottom:8px;">
                Requested Equipment
              </h2>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:14px;">
                <tr>
                  <td style="padding:8px 0;color:#64748b;width:140px;vertical-align:top;">Name</td>
                  <td style="padding:8px 0;color:#0f172a;font-weight:600;">${escapeHtml(displayName)}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#64748b;vertical-align:top;">Model</td>
                  <td style="padding:8px 0;color:#0f172a;">${escapeHtml(equipment.model || '—')}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#64748b;vertical-align:top;">Manufacturer</td>
                  <td style="padding:8px 0;color:#0f172a;">${escapeHtml(equipment.manufacturer || '—')}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#64748b;vertical-align:top;">Work Order / ID</td>
                  <td style="padding:8px 0;font-family:Consolas,Monaco,monospace;color:#ea580c;font-weight:700;">${escapeHtml(workOrder)}</td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 32px 32px;">
              <h2 style="margin:0 0 16px;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#ea580c;border-bottom:2px solid #fed7aa;padding-bottom:8px;">
                Rental Dates
              </h2>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;font-size:14px;">
                <tr>
                  <td style="padding:16px 20px;color:#64748b;width:160px;">Start date</td>
                  <td style="padding:16px 20px;color:#0f172a;"><strong style="color:#ea580c;">${escapeHtml(formatReadableDate(customer.startDate))}</strong></td>
                </tr>
                <tr>
                  <td style="padding:16px 20px;color:#64748b;border-top:1px solid #e2e8f0;">End date</td>
                  <td style="padding:16px 20px;color:#0f172a;border-top:1px solid #e2e8f0;"><strong style="color:#ea580c;">${escapeHtml(formatReadableDate(customer.endDate))}</strong></td>
                </tr>
                <tr>
                  <td style="padding:16px 20px;color:#64748b;border-top:1px solid #e2e8f0;">Total days</td>
                  <td style="padding:16px 20px;color:#0f172a;border-top:1px solid #e2e8f0;"><strong style="font-size:16px;">${escapeHtml(estimatedDays)} ${dayLabel}</strong></td>
                </tr>
                ${
                  customer.comments
                    ? `<tr>
                  <td style="padding:16px 20px;color:#64748b;border-top:1px solid #e2e8f0;vertical-align:top;">Comments</td>
                  <td style="padding:16px 20px;color:#0f172a;border-top:1px solid #e2e8f0;white-space:pre-wrap;">${escapeHtml(customer.comments)}</td>
                </tr>`
                    : ''
                }
              </table>
            </td>
          </tr>

          <tr>
            <td style="background:#f8fafc;padding:16px 32px;border-top:1px solid #e2e8f0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#94a3b8;">
                This message was generated automatically from the SGS Equipment website. Booking status: Pending.
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

export async function sendRentalQuoteEmail({ customer, equipment, receivedAt, estimatedDays, to }) {
  const transporter = createTransporter();
  const html = buildRentalQuoteEmailHtml({ customer, equipment, receivedAt, estimatedDays });
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const recipient = to || RENTAL_QUOTE_TO;
  const displayName =
    equipment.displayName || `${equipment.manufacturer || ''} ${equipment.model || ''}`.trim() || equipment.title;
  const subject = `New Rental Request - ${displayName} (${customer.startDate} to ${customer.endDate})`;
  const workOrder = equipment.title || equipment.id || '—';

  const text = [
    'New Rental Request - SGS Corp',
    '',
    '--- Customer Details ---',
    `Name: ${customer.fullName}`,
    `Company: ${customer.company || '—'}`,
    `Email: ${customer.email}`,
    `Phone: ${customer.phone}`,
    `Destination address: ${customer.address || '—'}`,
    '',
    '--- Requested Equipment ---',
    `Name: ${displayName}`,
    `Model: ${equipment.model || '—'}`,
    `Manufacturer: ${equipment.manufacturer || '—'}`,
    `Work Order / ID: ${workOrder}`,
    '',
    '--- Rental Dates ---',
    `Start date: ${customer.startDate}`,
    `End date: ${customer.endDate}`,
    `Total days: ${estimatedDays}`,
    customer.comments ? `Comments: ${customer.comments}` : null,
  ]
    .filter((line) => line != null)
    .join('\n');

  await transporter.sendMail({
    from: `"SGS Web Rentals" <${from}>`,
    to: recipient,
    cc: customer.email,
    replyTo: customer.email,
    subject,
    text,
    html,
  });
}

export async function sendQuoteEmail({ customer, equipment, receivedAt, to }) {
  const transporter = createTransporter();
  const html = buildQuoteEmailHtml({ customer, equipment, receivedAt });
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const recipient = to || QUOTE_TO;
  const itemLabel = equipment.length === 1 ? 'item' : 'items';
  const subject = `[SGS Web] Quote — ${customer.fullName} (${equipment.length} ${itemLabel})`;
  const dayLabel = Number(customer.estimatedDays) === 1 ? 'day' : 'days';

  const text = [
    'New Quote Request - SGS Corp',
    '',
    '--- Customer Details ---',
    `Name: ${customer.fullName}`,
    `Email: ${customer.email}`,
    `Phone: ${customer.phone}`,
    customer.company ? `Company: ${customer.company}` : null,
    '',
    '--- Selected Equipment ---',
    ...equipment.map((item, i) => {
      const wo = workOrderFromItem(item);
      return `${i + 1}. ${item.manufacturer} ${item.model} | ${item.equipmentType} | WO: ${wo}`;
    }),
    '',
    '--- Commercial Details ---',
    `Business type: ${interestLabel(customer.interestType)}`,
    `Required date: ${customer.requestedDate}`,
    customer.startDate && customer.endDate
      ? `Rental period: ${customer.startDate} → ${customer.endDate}${customer.estimatedDays ? ` (${customer.estimatedDays} ${dayLabel})` : ''}`
      : null,
    customer.comments ? `Comments: ${customer.comments}` : null,
  ]
    .filter((line) => line != null)
    .join('\n');

  await transporter.sendMail({
    from: `"SGS Web Quotes" <${from}>`,
    to: recipient,
    replyTo: customer.email,
    subject,
    text,
    html,
  });
}
