'use strict';

/**
 * OTP Service — 15.5-bo'lim (SMS OTP rate limit) + AT-02 (eski kod)
 * ------------------------------------------------------------
 * Himoya:
 *   - Kod crypto.randomInt bilan (Math.random EMAS — bashorat qilinadi)
 *   - Kod hashlanib saqlanadi (SHA-256 + per-code salt); plaintext hech qayerda turmaydi
 *   - TTL 5 daqiqa, muddati o'tgan kod qat'iy rad etiladi (AT-02)
 *   - Bitta kodga 3 marta noto'g'ri urinish -> kod bekor qilinadi
 *   - Yuborish limiti: 1 daqiqada 1 ta, 1 soatda 5 ta, 1 kunda 10 ta (telefon bo'yicha)
 *   - IP bo'yicha ham alohida limit (bir IP'dan ko'p raqamga spam)
 *   - Yangi kod so'ralganda eski kod darhol bekor qilinadi
 *   - Tekshiruvda timingSafeEqual
 */

const crypto = require('crypto');

function hashCode(code, salt) {
  return crypto.createHash('sha256').update(salt + ':' + code).digest('hex');
}

class OtpService {
  /**
   * @param {Object} [opts]
   * @param {number} [opts.codeLength=6]
   * @param {number} [opts.ttlMs=300000] - 5 daqiqa
   * @param {number} [opts.maxVerifyAttempts=3]
   * @param {Function} [opts.sender] - async ({phone, code}) => void, SMS provayder
   */
  constructor(opts = {}) {
    this.codeLength = opts.codeLength || 6;
    this.ttlMs = opts.ttlMs || 5 * 60 * 1000;
    this.maxVerifyAttempts = opts.maxVerifyAttempts || 3;
    this.sender = opts.sender || (async () => {});
    this.logger = opts.logger || console;

    this.codes = new Map();     // phone -> { hash, salt, expiresAt, attempts }
    this.sendLog = new Map();   // key -> [timestamps]

    this.sendLimits = opts.sendLimits || [
      { windowMs: 60 * 1000, max: 1 },
      { windowMs: 60 * 60 * 1000, max: 5 },
      { windowMs: 24 * 60 * 60 * 1000, max: 10 },
    ];
    this.ipLimits = opts.ipLimits || [
      { windowMs: 60 * 60 * 1000, max: 15 },
    ];

    const gc = setInterval(() => this._gc(), 60 * 1000);
    if (gc.unref) gc.unref();
  }

  _checkLimits(key, limits) {
    const now = Date.now();
    const arr = (this.sendLog.get(key) || []).filter(ts => now - ts < 24 * 60 * 60 * 1000);
    for (const { windowMs, max } of limits) {
      const inWindow = arr.filter(ts => now - ts < windowMs).length;
      if (inWindow >= max) {
        const oldest = arr.filter(ts => now - ts < windowMs).sort()[0];
        return { allowed: false, retryAfterMs: windowMs - (now - oldest) };
      }
    }
    return { allowed: true, log: arr };
  }

  /**
   * OTP yuborish.
   * @returns {Promise<{ok: boolean, reason?: string, retryAfterMs?: number, expiresAt?: number}>}
   */
  async requestCode(phone, { ip } = {}) {
    const phoneCheck = this._checkLimits(`phone:${phone}`, this.sendLimits);
    if (!phoneCheck.allowed) {
      this.logger.warn({ event: 'otp_rate_limited', scope: 'phone' });
      return { ok: false, reason: 'rate_limited', retryAfterMs: phoneCheck.retryAfterMs };
    }

    if (ip) {
      const ipCheck = this._checkLimits(`ip:${ip}`, this.ipLimits);
      if (!ipCheck.allowed) {
        this.logger.warn({ event: 'otp_rate_limited', scope: 'ip' });
        return { ok: false, reason: 'rate_limited', retryAfterMs: ipCheck.retryAfterMs };
      }
      const ipArr = ipCheck.log || [];
      ipArr.push(Date.now());
      this.sendLog.set(`ip:${ip}`, ipArr);
    }

    const phoneArr = phoneCheck.log || [];
    phoneArr.push(Date.now());
    this.sendLog.set(`phone:${phone}`, phoneArr);

    // Kriptografik xavfsiz kod
    const max = Math.pow(10, this.codeLength);
    const code = String(crypto.randomInt(0, max)).padStart(this.codeLength, '0');

    const salt = crypto.randomBytes(16).toString('hex');
    const expiresAt = Date.now() + this.ttlMs;

    // Eski kod avtomatik almashtiriladi (bekor bo'ladi)
    this.codes.set(phone, { hash: hashCode(code, salt), salt, expiresAt, attempts: 0 });

    await this.sender({ phone, code });
    // DIQQAT: code hech qachon log qilinmaydi
    this.logger.info({ event: 'otp_sent', phoneMasked: phone.slice(0, 4) + '****' + phone.slice(-2) });

    return { ok: true, expiresAt };
  }

  /**
   * OTP tekshirish.
   * @returns {{ok: boolean, reason?: string, attemptsLeft?: number}}
   */
  verifyCode(phone, code) {
    const rec = this.codes.get(phone);
    if (!rec) return { ok: false, reason: 'no_code' };

    if (Date.now() > rec.expiresAt) {
      this.codes.delete(phone);
      return { ok: false, reason: 'expired' }; // AT-02
    }

    rec.attempts += 1;

    const candidate = hashCode(String(code), rec.salt);
    const a = Buffer.from(candidate, 'hex');
    const b = Buffer.from(rec.hash, 'hex');
    const match = a.length === b.length && crypto.timingSafeEqual(a, b);

    if (!match) {
      // Limitga yetgan bo'lsa kod DARHOL bekor qilinadi — yangi kod so'rash kerak
      if (rec.attempts >= this.maxVerifyAttempts) {
        this.codes.delete(phone);
        this.logger.warn({ event: 'otp_too_many_attempts' });
        return { ok: false, reason: 'too_many_attempts' };
      }
      return { ok: false, reason: 'invalid_code', attemptsLeft: this.maxVerifyAttempts - rec.attempts };
    }

    this.codes.delete(phone); // bir martalik
    return { ok: true };
  }

  _gc() {
    const now = Date.now();
    for (const [phone, rec] of this.codes.entries()) {
      if (now > rec.expiresAt) this.codes.delete(phone);
    }
    for (const [key, arr] of this.sendLog.entries()) {
      const fresh = arr.filter(ts => now - ts < 24 * 60 * 60 * 1000);
      if (fresh.length) this.sendLog.set(key, fresh);
      else this.sendLog.delete(key);
    }
  }
}

module.exports = { OtpService };
