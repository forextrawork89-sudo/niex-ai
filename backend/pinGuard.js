'use strict';

/**
 * PIN Guard — AT-31 (brute-force himoyasi)
 * ------------------------------------------------------------
 * NIEX'da PIN bolaning agentni o'chirishiga to'sqinlik qiladi (ota-ona PIN'i).
 * Shuning uchun brute-force himoyasi kritik.
 *
 * Himoya:
 *   - PIN scrypt bilan hashlanadi (plaintext hech qayerda saqlanmaydi)
 *   - Taqqoslash timingSafeEqual bilan (timing attack)
 *   - Progressiv kechikish: 3-urinishdan keyin lockout, har safar 2 barobar oshadi
 *   - Maksimal lockout 1 soat
 *   - Muvaffaqiyatli kirishda hisoblagich nolga tushadi
 *   - Zaif PIN'lar (1234, 0000, ketma-ket, takror) rad etiladi
 */

const crypto = require('crypto');

const SCRYPT_PARAMS = { N: 16384, r: 8, p: 1, keylen: 64 };

const WEAK_PINS = new Set([
  '0000', '1111', '2222', '3333', '4444', '5555', '6666', '7777', '8888', '9999',
  '1234', '4321', '0123', '1212', '2580', '1122', '6969', '1004', '2000', '1010',
  '000000', '111111', '123456', '654321', '121212', '112233',
]);

function isWeakPin(pin) {
  if (WEAK_PINS.has(pin)) return true;
  if (/^(\d)\1+$/.test(pin)) return true;              // hammasi bir xil
  // ketma-ket o'suvchi/kamayuvchi
  let asc = true, desc = true;
  for (let i = 1; i < pin.length; i++) {
    if (Number(pin[i]) !== Number(pin[i - 1]) + 1) asc = false;
    if (Number(pin[i]) !== Number(pin[i - 1]) - 1) desc = false;
  }
  return asc || desc;
}

function hashPin(pin) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(pin, salt, SCRYPT_PARAMS.keylen, SCRYPT_PARAMS);
  return `scrypt$${SCRYPT_PARAMS.N}$${SCRYPT_PARAMS.r}$${SCRYPT_PARAMS.p}$${salt.toString('base64')}$${hash.toString('base64')}`;
}

function verifyPinHash(pin, stored) {
  try {
    const [algo, N, r, p, saltB64, hashB64] = stored.split('$');
    if (algo !== 'scrypt') return false;
    const salt = Buffer.from(saltB64, 'base64');
    const expected = Buffer.from(hashB64, 'base64');
    const actual = crypto.scryptSync(pin, salt, expected.length, {
      N: Number(N), r: Number(r), p: Number(p),
    });
    return crypto.timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}

class PinGuard {
  /**
   * @param {Object} [opts]
   * @param {number} [opts.freeAttempts=3] - lockout boshlanmaydigan urinishlar soni
   * @param {number} [opts.baseLockoutMs=30000] - birinchi lockout (30 s)
   * @param {number} [opts.maxLockoutMs=3600000] - maksimal lockout (1 soat)
   * @param {number} [opts.attemptWindowMs=900000] - urinishlar hisoblagichi reset oynasi (15 daq)
   */
  constructor(opts = {}) {
    this.freeAttempts = opts.freeAttempts || 3;
    this.baseLockoutMs = opts.baseLockoutMs || 30 * 1000;
    this.maxLockoutMs = opts.maxLockoutMs || 60 * 60 * 1000;
    this.attemptWindowMs = opts.attemptWindowMs || 15 * 60 * 1000;
    this.state = new Map(); // identity -> { failCount, lockedUntil, lastAttemptAt }
    this.onLockout = opts.onLockout || null; // callback: ota-onaga Telegram xabar yuborish uchun
  }

  /** PIN o'rnatish — zaif PIN rad etiladi */
  setPin(pin, { minLength = 4, maxLength = 8 } = {}) {
    if (typeof pin !== 'string' || !/^\d+$/.test(pin)) {
      throw new Error('PIN faqat raqamlardan iborat bo\'lishi kerak');
    }
    if (pin.length < minLength || pin.length > maxLength) {
      throw new Error(`PIN uzunligi ${minLength}-${maxLength} raqam bo'lishi kerak`);
    }
    if (isWeakPin(pin)) {
      throw new Error('PIN juda oddiy — boshqasini tanlang');
    }
    return hashPin(pin);
  }

  _get(identity) {
    if (!this.state.has(identity)) {
      this.state.set(identity, { failCount: 0, lockedUntil: 0, lastAttemptAt: 0 });
    }
    return this.state.get(identity);
  }

  getStatus(identity) {
    const s = this._get(identity);
    const now = Date.now();
    const locked = now < s.lockedUntil;
    return {
      locked,
      retryAfterMs: locked ? s.lockedUntil - now : 0,
      failCount: s.failCount,
      attemptsLeft: Math.max(0, this.freeAttempts - s.failCount),
    };
  }

  /**
   * PIN tekshirish.
   * @returns {{ok: boolean, reason?: string, retryAfterMs?: number, attemptsLeft?: number}}
   */
  verify(identity, pin, storedHash) {
    const s = this._get(identity);
    const now = Date.now();

    if (now < s.lockedUntil) {
      return { ok: false, reason: 'locked', retryAfterMs: s.lockedUntil - now };
    }

    // Oyna o'tgan bo'lsa hisoblagich reset
    if (s.lastAttemptAt && now - s.lastAttemptAt > this.attemptWindowMs) {
      s.failCount = 0;
    }
    s.lastAttemptAt = now;

    const valid = verifyPinHash(pin, storedHash);

    if (valid) {
      s.failCount = 0;
      s.lockedUntil = 0;
      return { ok: true };
    }

    s.failCount += 1;

    if (s.failCount >= this.freeAttempts) {
      const overflow = s.failCount - this.freeAttempts;
      const lockMs = Math.min(this.baseLockoutMs * Math.pow(2, overflow), this.maxLockoutMs);
      s.lockedUntil = now + lockMs;
      if (this.onLockout) {
        try { this.onLockout({ identity, failCount: s.failCount, lockMs }); } catch { /* logger o'zi hal qiladi */ }
      }
      return { ok: false, reason: 'locked', retryAfterMs: lockMs };
    }

    return { ok: false, reason: 'invalid_pin', attemptsLeft: this.freeAttempts - s.failCount };
  }

  reset(identity) {
    this.state.delete(identity);
  }
}

module.exports = { PinGuard, hashPin, verifyPinHash, isWeakPin };
