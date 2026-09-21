'use strict';

/**
 * Device Credential Registry
 * ------------------------------------------------------------
 * Har bir qurilma (Android agent) ro'yxatdan o'tishda o'zining Ed25519
 * ochiq kalitini (raw, base64) yuboradi. Bu yerda faqat OCHIQ kalit
 * saqlanadi — maxfiy kalit hech qachon serverga yuborilmaydi/saqlanmaydi.
 *
 * Revocation: status='revoked' bo'lgan qurilma challenge/verify va
 * policy so'rovlarida rad etiladi (AT-28 talabiga mos).
 */

const fs = require('fs');
const path = require('path');

class DeviceRegistry {
  constructor(opts = {}) {
    this.dataDir = opts.dataDir || path.join(__dirname, 'data');
    this.file = path.join(this.dataDir, 'devices.json');
    this.auditFile = path.join(this.dataDir, 'device-audit.log');
    if (!fs.existsSync(this.dataDir)) fs.mkdirSync(this.dataDir, { recursive: true });
    if (!fs.existsSync(this.file)) this._write({ devices: [] });
    if (!fs.existsSync(this.auditFile)) fs.writeFileSync(this.auditFile, '');
  }

  _read() {
    return JSON.parse(fs.readFileSync(this.file, 'utf8'));
  }
  _write(data) {
    const tmp = this.file + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
    fs.renameSync(tmp, this.file);
  }
  _audit(action, meta) {
    fs.appendFileSync(this.auditFile, JSON.stringify({ ts: new Date().toISOString(), action, ...meta }) + '\n');
  }

  registerDevice(deviceId, publicKeyRawBase64, meta = {}) {
    const data = this._read();
    if (data.devices.some(d => d.deviceId === deviceId)) {
      throw new Error(`Qurilma allaqachon ro'yxatdan o'tgan: ${deviceId}`);
    }
    const now = new Date().toISOString();
    data.devices.push({
      deviceId,
      publicKey: publicKeyRawBase64,
      status: 'active',
      registeredAt: now,
      revokedAt: null,
      lastSeenAt: null,
      meta, // masalan: familyId, model, appVersion
    });
    this._write(data);
    this._audit('device_registered', { deviceId });
    return { deviceId, status: 'active', registeredAt: now };
  }

  revokeDevice(deviceId, reason = '') {
    const data = this._read();
    const rec = data.devices.find(d => d.deviceId === deviceId);
    if (!rec) return false;
    rec.status = 'revoked';
    rec.revokedAt = new Date().toISOString();
    rec.revokeReason = reason;
    this._write(data);
    this._audit('device_revoked', { deviceId, reason });
    return true;
  }

  getDevice(deviceId) {
    return this._read().devices.find(d => d.deviceId === deviceId) || null;
  }

  isActive(deviceId) {
    const d = this.getDevice(deviceId);
    return !!d && d.status === 'active';
  }

  touchLastSeen(deviceId) {
    const data = this._read();
    const rec = data.devices.find(d => d.deviceId === deviceId);
    if (rec) {
      rec.lastSeenAt = new Date().toISOString();
      this._write(data);
    }
  }

  listDevices() {
    return this._read().devices.map(({ publicKey, ...rest }) => rest); // ochiq kalit ro'yxatda ko'rsatilmaydi
  }
}

module.exports = { DeviceRegistry };
