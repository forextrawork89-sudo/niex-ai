'use strict';

/**
 * Location Guard — 15.3-bo'lim
 * ------------------------------------------------------------
 * Lokatsiya — eng sezgir ma'lumot. Talablar:
 *   - Har bir kirish (o'qish/stream) audit logga yoziladi: kim, qachon, qaysi bola
 *   - Bolaning roziligi/huquq bekor qilinganda faol streamlar DARHOL yopiladi
 *   - Consent bo'lmasa umuman berilmaydi
 *   - Retention: eski nuqtalar avtomatik o'chiriladi (saqlash siyosati)
 *   - Audit log o'zida aniq koordinata saqlanmaydi (faqat fakt + aniqlik darajasi)
 */

const fs = require('fs');
const path = require('path');
const { EventEmitter } = require('events');

class LocationGuard extends EventEmitter {
  /**
   * @param {Object} [opts]
   * @param {number} [opts.retentionDays=30]
   * @param {string} [opts.dataDir]
   */
  constructor(opts = {}) {
    super();
    this.retentionDays = opts.retentionDays || 30;
    this.dataDir = opts.dataDir || path.join(__dirname, 'data');
    this.auditFile = path.join(this.dataDir, 'location-audit.log');
    if (!fs.existsSync(this.dataDir)) fs.mkdirSync(this.dataDir, { recursive: true });
    if (!fs.existsSync(this.auditFile)) fs.writeFileSync(this.auditFile, '');

    this.consents = new Map();       // childId -> { granted, grantedAt, revokedAt, grantedBy }
    this.activeStreams = new Map();  // streamId -> { childId, parentId, closeFn, openedAt }
    this.points = new Map();         // childId -> [{ lat, lng, accuracy, ts }]
  }

  _audit(action, meta) {
    // DIQQAT: aniq koordinata audit logga YOZILMAYDI
    const line = JSON.stringify({ ts: new Date().toISOString(), action, ...meta }) + '\n';
    fs.appendFileSync(this.auditFile, line);
  }

  // ---- Consent boshqaruvi ----

  grantConsent(childId, grantedBy) {
    this.consents.set(childId, {
      granted: true,
      grantedAt: new Date().toISOString(),
      revokedAt: null,
      grantedBy,
    });
    this._audit('location_consent_granted', { childId, grantedBy });
  }

  /** Huquq bekor qilinganda barcha faol streamlar darhol yopiladi (15.3 talabi) */
  revokeConsent(childId, revokedBy, reason = '') {
    const c = this.consents.get(childId);
    if (c) {
      c.granted = false;
      c.revokedAt = new Date().toISOString();
    } else {
      this.consents.set(childId, { granted: false, grantedAt: null, revokedAt: new Date().toISOString() });
    }

    const closed = this.closeStreamsForChild(childId, 'consent_revoked');
    this._audit('location_consent_revoked', { childId, revokedBy, reason, streamsClosed: closed });
    this.emit('consent_revoked', { childId, streamsClosed: closed });
    return closed;
  }

  hasConsent(childId) {
    const c = this.consents.get(childId);
    return !!c && c.granted === true;
  }

  // ---- Stream boshqaruvi ----

  /**
   * Lokatsiya streamini ochish. Consent bo'lmasa ochilmaydi.
   * @param {Function} closeFn - stream'ni yopadigan funksiya (SSE/WebSocket close)
   */
  openStream(streamId, { childId, parentId, closeFn }) {
    if (!this.hasConsent(childId)) {
      this._audit('location_stream_denied', { childId, parentId, reason: 'no_consent' });
      const err = new Error('Lokatsiyaga ruxsat yo\'q');
      err.code = 'no_consent';
      throw err;
    }
    this.activeStreams.set(streamId, { childId, parentId, closeFn, openedAt: Date.now() });
    this._audit('location_stream_opened', { streamId, childId, parentId });
    return { streamId };
  }

  closeStream(streamId, reason = 'client_closed') {
    const s = this.activeStreams.get(streamId);
    if (!s) return false;
    try { s.closeFn?.(reason); } catch { /* yopilgan bo'lishi mumkin */ }
    this.activeStreams.delete(streamId);
    this._audit('location_stream_closed', {
      streamId, childId: s.childId, parentId: s.parentId, reason,
      durationMs: Date.now() - s.openedAt,
    });
    return true;
  }

  closeStreamsForChild(childId, reason) {
    let count = 0;
    for (const [streamId, s] of [...this.activeStreams.entries()]) {
      if (s.childId === childId) {
        this.closeStream(streamId, reason);
        count++;
      }
    }
    return count;
  }

  // ---- Ma'lumot bilan ishlash ----

  recordPoint(childId, { lat, lng, accuracy }) {
    if (!this.hasConsent(childId)) {
      this._audit('location_write_denied', { childId, reason: 'no_consent' });
      return false;
    }
    const arr = this.points.get(childId) || [];
    arr.push({ lat, lng, accuracy, ts: Date.now() });
    this.points.set(childId, arr);
    // Koordinata audit'ga tushmaydi — faqat fakt
    this._audit('location_point_recorded', { childId, accuracy });
    return true;
  }

  /** Ota-ona lokatsiyani o'qishi — har safar audit yoziladi */
  readLocation(childId, { parentId, purpose = 'view' } = {}) {
    if (!this.hasConsent(childId)) {
      this._audit('location_read_denied', { childId, parentId, reason: 'no_consent' });
      const err = new Error('Lokatsiyaga ruxsat yo\'q');
      err.code = 'no_consent';
      throw err;
    }
    const arr = this.points.get(childId) || [];
    const latest = arr[arr.length - 1] || null;
    this._audit('location_read', { childId, parentId, purpose, found: !!latest });
    return latest;
  }

  /** Retention siyosati — muddati o'tgan nuqtalarni o'chirish (cron orqali chaqiring) */
  purgeOldPoints() {
    const cutoff = Date.now() - this.retentionDays * 86400000;
    let purged = 0;
    for (const [childId, arr] of this.points.entries()) {
      const fresh = arr.filter(p => p.ts >= cutoff);
      purged += arr.length - fresh.length;
      if (fresh.length) this.points.set(childId, fresh);
      else this.points.delete(childId);
    }
    this._audit('location_points_purged', { purged, retentionDays: this.retentionDays });
    return purged;
  }

  /** Bola/ota-ona so'rasa — barcha lokatsiya ma'lumotini o'chirish (GDPR-style) */
  eraseAll(childId, requestedBy) {
    const count = (this.points.get(childId) || []).length;
    this.points.delete(childId);
    const closed = this.closeStreamsForChild(childId, 'data_erased');
    this._audit('location_erased', { childId, requestedBy, pointsDeleted: count, streamsClosed: closed });
    return { pointsDeleted: count, streamsClosed: closed };
  }

  getAuditTrail(childId, limit = 100) {
    const lines = fs.readFileSync(this.auditFile, 'utf8').trim().split('\n').filter(Boolean);
    return lines
      .map(l => { try { return JSON.parse(l); } catch { return null; } })
      .filter(e => e && (!childId || e.childId === childId))
      .slice(-limit);
  }
}

module.exports = { LocationGuard };
