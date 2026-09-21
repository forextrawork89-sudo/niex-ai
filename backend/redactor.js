'use strict';

/**
 * Log Redactor — AT-25
 * ------------------------------------------------------------
 * Log'ga hech qachon tushmasligi kerak: parol, PIN, token, Ed25519 kalitlar,
 * Telegram bot token, SMS OTP kod, aniq lokatsiya koordinatalari, telefon raqam,
 * bolaning ko'rgan URL'lari to'liq holda.
 *
 * Ikki qatlam:
 *   1) Kalit nomi bo'yicha (password, token, pin, secret ...) -> [REDACTED]
 *   2) Qiymat pattern bo'yicha (JWT, telefon, koordinata, bot token) -> maskalash
 *
 * Chuqur nested obyektlarda ham ishlaydi, sirkulyar havolalarni bardosh qiladi.
 */

const SENSITIVE_KEY_PATTERN = /(pass(word|wd)?|pin|secret|token|apikey|api_key|auth|credential|privatekey|private_key|otp|code|cookie|session|signature|nonce|masterkey|master_key|dek|kek)/i;

// Koordinata maydonlari — butunlay olib tashlanmaydi, aniqligi pasaytiriladi
const COORD_KEY_PATTERN = /^(lat|latitude|lon|lng|longitude)$/i;

const VALUE_PATTERNS = [
  { name: 'jwt', re: /\beyJ[A-Za-z0-9_-]{5,}\.[A-Za-z0-9_-]{5,}\.[A-Za-z0-9_-]{5,}\b/g },
  { name: 'telegram_bot_token', re: /\b\d{6,12}:[A-Za-z0-9_-]{30,}\b/g },
  { name: 'bearer', re: /\bBearer\s+[A-Za-z0-9._~+/-]{10,}=*/gi },
  { name: 'uz_phone', re: /\+998\d{9}\b/g },
  { name: 'email', re: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g },
  { name: 'card', re: /\b\d{13,19}\b/g },
];

const REDACTED = '[REDACTED]';

function maskString(str) {
  let out = str;
  for (const { re } of VALUE_PATTERNS) {
    out = out.replace(re, REDACTED);
  }
  return out;
}

/** Koordinatani ~1km aniqlikka yaxlitlash (log uchun yetarli, shaxsni aniqlab bo'lmaydi) */
function coarseCoordinate(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return REDACTED;
  return Math.round(num * 100) / 100;
}

function redact(input, opts = {}) {
  const maxDepth = opts.maxDepth || 8;
  const seen = new WeakSet();

  function walk(value, depth, keyName) {
    if (depth > maxDepth) return '[MAX_DEPTH]';

    if (typeof value === 'string') {
      if (keyName && SENSITIVE_KEY_PATTERN.test(keyName)) return REDACTED;
      if (keyName && COORD_KEY_PATTERN.test(keyName)) return coarseCoordinate(value);
      return maskString(value);
    }

    if (typeof value === 'number' || typeof value === 'boolean' || value === null || value === undefined) {
      if (keyName && SENSITIVE_KEY_PATTERN.test(keyName)) return REDACTED;
      if (keyName && COORD_KEY_PATTERN.test(keyName)) return coarseCoordinate(value);
      return value;
    }

    if (value instanceof Error) {
      return { name: value.name, message: maskString(value.message), stack: maskString(value.stack || '') };
    }

    if (Array.isArray(value)) {
      if (seen.has(value)) return '[CIRCULAR]';
      seen.add(value);
      return value.map(v => walk(v, depth + 1, keyName));
    }

    if (typeof value === 'object') {
      if (seen.has(value)) return '[CIRCULAR]';
      seen.add(value);
      const out = {};
      for (const [k, v] of Object.entries(value)) {
        if (SENSITIVE_KEY_PATTERN.test(k)) {
          out[k] = REDACTED;
        } else {
          out[k] = walk(v, depth + 1, k);
        }
      }
      return out;
    }

    if (typeof value === 'function') return '[FUNCTION]';
    return String(value);
  }

  return walk(input, 0, null);
}

/** Tayyor logger wrapper — console yoki pino/winston o'rniga qo'ying */
function createSafeLogger(baseLogger = console) {
  const wrap = level => (...args) => {
    const safe = args.map(a => (typeof a === 'string' ? maskString(a) : redact(a)));
    baseLogger[level](...safe);
  };
  return {
    info: wrap('info'),
    warn: wrap('warn'),
    error: wrap('error'),
    debug: wrap(baseLogger.debug ? 'debug' : 'log'),
    log: wrap('log'),
  };
}

/** Express middleware — request'ni xavfsiz log qiladi */
function requestLogger(logger = createSafeLogger()) {
  return function (req, res, next) {
    const start = Date.now();
    res.on('finish', () => {
      logger.info({
        method: req.method,
        path: req.path, // query STRING log qilinmaydi — token bo'lishi mumkin
        status: res.statusCode,
        durationMs: Date.now() - start,
        ip: req.ip,
        deviceId: req.deviceId || undefined,
      });
    });
    next();
  };
}

module.exports = { redact, maskString, createSafeLogger, requestLogger, coarseCoordinate };
