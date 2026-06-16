import nodemailer from 'nodemailer';

export const CONTACT_TO = process.env.CONTACT_TO || 'sales@sgsequipment.com';

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
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

export async function sendContactEmail({ contact, receivedAt }) {
  const transporter = createTransporter();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const fullName = `${contact.firstName} ${contact.lastName}`.trim();
  const formattedDate = new Date(receivedAt).toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'short',
  });

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>Contact Form — SGS</title></head>
<body style="margin:0;padding:24px;background:#f1f5f9;font-family:Segoe UI,Roboto,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;border:1px solid #e2e8f0;overflow:hidden;">
    <tr>
      <td style="background:#0f172a;padding:24px 28px;">
        <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#94a3b8;">SGS Ground Support Equipment</p>
        <h1 style="margin:0;font-size:20px;color:#fff;">New Contact Form Submission</h1>
        <p style="margin:8px 0 0;font-size:13px;color:#cbd5e1;">Received: ${escapeHtml(formattedDate)}</p>
      </td>
    </tr>
    <tr>
      <td style="padding:24px 28px;font-size:14px;color:#334155;">
        <p style="margin:0 0 8px;"><strong>Name:</strong> ${escapeHtml(fullName)}</p>
        <p style="margin:0 0 8px;"><strong>Company:</strong> ${escapeHtml(contact.companyName)}</p>
        <p style="margin:0 0 8px;"><strong>Email:</strong> <a href="mailto:${escapeHtml(contact.email)}">${escapeHtml(contact.email)}</a></p>
        <p style="margin:0 0 8px;"><strong>Reason:</strong> ${escapeHtml(contact.reason)}</p>
        <p style="margin:16px 0 8px;font-weight:700;color:#0f172a;">Message</p>
        <p style="margin:0;white-space:pre-wrap;line-height:1.6;">${escapeHtml(contact.message)}</p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = [
    'New Contact Form Submission — SGS',
    '',
    `Name: ${fullName}`,
    `Company: ${contact.companyName}`,
    `Email: ${contact.email}`,
    `Reason: ${contact.reason}`,
    '',
    'Message:',
    contact.message,
  ].join('\n');

  await transporter.sendMail({
    from: `"SGS Web Contact" <${from}>`,
    to: CONTACT_TO,
    replyTo: contact.email,
    subject: `[SGS Web] Contact — ${fullName} (${contact.reason})`,
    text,
    html,
  });
}
