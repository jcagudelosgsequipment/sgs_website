import axios from 'axios';

const RECAPTCHA_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';

function isLocalHost(req) {
  const host = (req.hostname || '').toLowerCase();
  return host === 'localhost' || host === '127.0.0.1';
}

function isDevelopmentBypass(req) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  const isDevEnv =
    process.env.NODE_ENV === 'development' ||
    !secretKey ||
    secretKey === 'test';

  return isDevEnv || isLocalHost(req);
}

/**
 * Validates Google reCAPTCHA v2/v3 token from req.body.recaptchaToken.
 * v3 responses enforce a minimum trust score of 0.5; v2 only checks success.
 * Skips verification entirely in development, test-key, or localhost contexts.
 * @returns {Promise<boolean>} true if the request may proceed, false if blocked
 */
export async function verifyRecaptcha(req, res) {
  if (isDevelopmentBypass(req)) {
    console.log('🚀 [reCAPTCHA] Ambiente de desarrollo detectado. Bypass exitoso.');
    return true;
  }

  const recaptchaToken = req.body?.recaptchaToken;
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!recaptchaToken?.trim()) {
    res.status(400).json({ error: 'Captcha verification token is required.' });
    return false;
  }

  try {
    const { data } = await axios.post(
      RECAPTCHA_VERIFY_URL,
      new URLSearchParams({
        secret: secretKey,
        response: recaptchaToken.trim(),
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const isV3Response = typeof data.score === 'number';
    const failedV3 = isV3Response && data.score < 0.5;

    if (!data.success || failedV3) {
      console.warn(
        `🛑 Petición bloqueada por reCAPTCHA v3. Score obtenido: ${isV3Response ? data.score : 'N/A (v2)'}`
      );
      res.status(403).json({ error: 'Bot detected or low trust score. Verification failed.' });
      return false;
    }

    return true;
  } catch (error) {
    console.error('[recaptcha] Verification request failed:', error.message);
    res.status(403).json({ error: 'Bot detected or low trust score. Verification failed.' });
    return false;
  }
}
