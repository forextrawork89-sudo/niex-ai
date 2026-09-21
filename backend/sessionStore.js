'use strict';

const crypto = require('crypto');

/**
 * Muvaffaqiyatli Ed25519 challenge-response'dan so'ng qurilmaga
 * qisqa muddatli (default 15 daqiqa) opaque session token beriladi.
 * Bu token keyingi so'rovlarda (masalan /policy/latest) Authorization
 * header orqali ishlatiladi — har safar imzo qo'ymaslik uchun.
 */
class SessionStore {
  constructor(opts = {}) {
    this.ttlMs = opts.ttlMs || 15 * 60 * 1000;
    this.store = new Map(); // token -> { deviceId, expiresAt }
    this._gcInterval = setInterval(() => this._gc(), 60 * 1000);
    if (this._gcInterval.unref) this._gcInterval.unref();
  }

  createSession(deviceId) {
    const token = crypto.randomBytes(32).toString('base64url');
    this.store.set(token, { deviceId, expiresAt: Date.now() + this.ttlMs });
    return { token, expiresAt: Date.now() + this.ttlMs };
  }

  verifySession(token) {
    const rec = this.store.get(token);
    if (!rec) return null;
    if (Date.now() > rec.expiresAt) {
      this.store.delete(token);
      return null;
    }
    return rec.deviceId;
  }

  revokeSession(token) {
    return this.store.delete(token);
  }

  /** Muayyan qurilmaning barcha sessiyalarini bekor qilish (masalan device revoke bilan birga) */
  revokeAllForDevice(deviceId) {
    let count = 0;
    for (const [token, rec] of this.store.entries()) {
      if (rec.deviceId === deviceId) {
        this.store.delete(token);
        count++;
      }
    }
    return count;
  }

  _gc() {
    const now = Date.now();
    for (const [token, rec] of this.store.entries()) {
      if (now > rec.expiresAt) this.store.delete(token);
    }
  }
}

module.exports = { SessionStore };
