/**
 * Verifies a Google reCAPTCHA v2 token against Google's siteverify API.
 * Rejects missing tokens and the literal "test" bypass value.
 * @param {string|undefined|null} token
 * @param {string|undefined|null} remoteIp
 * @returns {Promise<boolean>}
 */
export async function verifyRecaptcha(token, remoteIp) {
  if (!token || token === 'test') return false;
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    console.error('❌ ERROR CRÍTICO: RECAPTCHA_SECRET_KEY no está definida en el .env');
    return false;
  }

  try {
    const params = new URLSearchParams({
      secret: secret,
      response: token,
      ...(remoteIp ? { remoteip: remoteIp } : {}),
    });

    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    const data = await res.json();
    return data.success === true;
  } catch (err) {
    console.error('❌ Error comunicando con Google siteverify:', err);
    return false;
  }
}

/**
 * Silent honeypot + strict reCAPTCHA gate for mail/quote endpoints.
 * @returns {Promise<'honeypot'|'blocked'|'ok'>}
 */
export async function enforceFormSecurity(req, res) {
  if (req.body?.b_website_hp) {
    res.status(200).json({ success: true });
    return 'honeypot';
  }

  const clientIp =
    req.headers['x-forwarded-for']?.toString().split(',')[0].trim() ||
    req.socket.remoteAddress;

  const isValid = await verifyRecaptcha(req.body?.recaptchaToken, clientIp);

  if (!isValid) {
    console.warn(`[Seguridad] Intento bloqueado por reCAPTCHA inválido desde IP: ${clientIp}`);
    res.status(403).json({
      success: false,
      error: 'Verificación de seguridad fallida. Por favor, resuelve el captcha interactivo.',
    });
    return 'blocked';
  }

  return 'ok';
}
