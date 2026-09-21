'use strict';

/**
 * Nonce (challenge) do'koni — replay hujumidan himoya uchun.
 *
 * Oqim: server random nonce beradi -> qurilma o'z private key bilan
 * shu nonce'ni imzolab qaytaradi -> server imzoni tekshiradi va nonce'ni
 * "ishlatilgan" deb belgilaydi (bir marta ishlatiladi, qayta ishlatib
 * bo'lmaydi). Muddati o'tgan nonce'lar avtomatik rad etiladi.
 *
 * Demo uchun xotirada (Map) saqlanadi — production'da Redis tavsiya etiladi
 * (ko'p instance/klaster holatida umumiy state kerak bo'ladi).
 */

const crypto = require('crypto');

class NonceStore {
  constructor(opts = {}) {
    this.ttlMs = opts.ttlMs || 2 * 60 * 1000; // 2 daqiqa
    this.store = new Map(); // key: `${deviceId}:${nonce}` -> { expiresAt, used }
    this._gcInterval = setInterval(() => this._gc(), 60 * 1000);
    if (this._gcInterval.unref) this._gcInterval.unref();
  }

  issueChallenge(deviceId) {
    const nonce = crypto.randomBytes(24).toString('base64');
    const expiresAt = Date.now() + this.ttlMs;
    this.store.set(`${deviceId}:${nonce}`, { expiresAt, used: false });
    return { nonce, expiresAt };
  }

  /** Nonce'ni bir martalik tekshiradi va darhol "ishlatilgan" deb belgilaydi */
  consumeChallenge(deviceId, nonce) {
    const key = `${deviceId}:${nonce}`;
    const rec = this.store.get(key);
    if (!rec) return { ok: false, reason: 'not_found' };
    if (rec.used) return { ok: false, reason: 'already_used' };
    if (Date.now() > rec.expiresAt) {
      this.store.delete(key);
      return { ok: false, reason: 'expired' };
    }
    rec.used = true; // qayta ishlatishning oldini olish
    return { ok: true };
  }

  _gc() {
    const now = Date.now();
    for (const [key, rec] of this.store.entries()) {
      if (now > rec.expiresAt) this.store.delete(key);
    }
  }
}

module.exports = { NonceStore };
