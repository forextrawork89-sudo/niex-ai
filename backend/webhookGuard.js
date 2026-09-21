'use strict';

/**
 * Telegram Webhook Guard — 15.5-bo'lim
 * ------------------------------------------------------------
 * Telegram webhook URL'i ochiq internetda turadi. Himoyasiz qoldirilsa
 * har kim soxta "update" yuborib, botni ota-ona nomidan boshqarishi mumkin.
 *
 * Uch qatlam:
 *   1) X-Telegram-Bot-Api-Secret-Token header (setWebhook paytida o'rnatiladi)
 *      — timingSafeEqual bilan taqqoslanadi
 *   2) Telegram rasmiy IP diapazonlari (149.154.160.0/20, 91.108.4.0/22)
 *   3) Rate limit + update_id dedupe (replay/duplicate)
 *
 * Bundan tashqari webhook path'ining o'zi ham random bo'lishi kerak:
 *   /tg/webhook/<random-32-hex>
 */

const crypto = require('crypto');

const TELEGRAM_CIDRS = [
  { base: '149.154.160.0', bits: 20 },
  { base: '91.108.4.0', bits: 22 },
];

function ipv4ToInt(ip) {
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some(p => !Number.isInteger(p) || p < 0 || p > 255)) return null;
  return ((parts[0] << 24) >>> 0) + (parts[1] << 16) + (parts[2] << 8) + parts[3];
}

function isTelegramIp(ip) {
  // IPv4-mapped IPv6 (::ffff:1.2.3.4) normalizatsiyasi
  const clean = ip.replace(/^::ffff:/i, '');
  const ipInt = ipv4ToInt(clean);
  if (ipInt === null) return false;

  return TELEGRAM_CIDRS.some(({ base, bits }) => {
    const baseInt = ipv4ToInt(base);
    const mask = bits === 0 ? 0 : (~0 << (32 - bits)) >>> 0;
    return (ipInt & mask) === (baseInt & mask);
  });
}

function safeCompare(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) {
    // Uzunlik farq qilsa ham doimiy vaqt sarflaymiz
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

/** update_id bo'yicha takroriy update'larni tashlab yuborish */
class UpdateDeduper {
  constructor(opts = {}) {
    this.ttlMs = opts.ttlMs || 10 * 60 * 1000;
    this.seen = new Map();
    const gc = setInterval(() => {
      const now = Date.now();
      for (const [id, ts] of this.seen.entries()) if (now - ts > this.ttlMs) this.seen.delete(id);
    }, 60 * 1000);
    if (gc.unref) gc.unref();
  }
  isDuplicate(updateId) {
    if (updateId === undefined || updateId === null) return false;
    if (this.seen.has(updateId)) return true;
    this.seen.set(updateId, Date.now());
    return false;
  }
}

/**
 * @param {Object} opts
 * @param {string} opts.secretToken - setWebhook'da bergan secret_token
 * @param {boolean} [opts.checkIp=true]
 * @param {UpdateDeduper} [opts.deduper]
 * @param {Object} [opts.logger]
 */
function telegramWebhookGuard(opts) {
  if (!opts || !opts.secretToken) throw new Error('secretToken talab qilinadi');
  const checkIp = opts.checkIp !== false;
  const deduper = opts.deduper || new UpdateDeduper();
  const logger = opts.logger || console;

  return function (req, res, next) {
    const header = req.get('X-Telegram-Bot-Api-Secret-Token');
    if (!header || !safeCompare(header, opts.secretToken)) {
      logger.warn({ event: 'telegram_webhook_bad_secret', ip: req.ip });
      return res.status(403).json({ error: 'forbidden' }); // 401 emas — bot ekanligini oshkor qilmaymiz
    }

    if (checkIp) {
      // Proxy orqasida bo'lsa app'da `app.set('trust proxy', 1)` yoqilgan bo'lishi kerak
      const ip = req.ip || req.socket.remoteAddress || '';
      if (!isTelegramIp(ip)) {
        logger.warn({ event: 'telegram_webhook_bad_ip', ip });
        return res.status(403).json({ error: 'forbidden' });
      }
    }

    const updateId = req.body?.update_id;
    if (deduper.isDuplicate(updateId)) {
      // Telegram qayta yuborishni to'xtatishi uchun 200 qaytaramiz, lekin qayta ishlamaymiz
      return res.status(200).json({ ok: true, duplicate: true });
    }

    next();
  };
}

/** setWebhook uchun tayyor parametrlar generatori */
function buildWebhookConfig(baseUrl) {
  const secretToken = crypto.randomBytes(32).toString('hex');
  const pathSuffix = crypto.randomBytes(16).toString('hex');
  return {
    secretToken,
    path: `/tg/webhook/${pathSuffix}`,
    url: `${baseUrl.replace(/\/$/, '')}/tg/webhook/${pathSuffix}`,
    // Telegram API chaqiruvi:
    // POST https://api.telegram.org/bot<TOKEN>/setWebhook
    // { url, secret_token: secretToken, allowed_updates: [...], max_connections: 40 }
  };
}

module.exports = { telegramWebhookGuard, isTelegramIp, UpdateDeduper, buildWebhookConfig };
