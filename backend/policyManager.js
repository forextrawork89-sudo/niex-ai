'use strict';

/**
 * Policy Manager
 * ------------------------------------------------------------
 * Server o'z Ed25519 juftligi bilan siyosat (policy) hujjatini imzolaydi.
 * Qurilma (Android agent) siyosatni qo'llashdan oldin shu imzoni,
 * ishlab chiqarishga o'rnatilgan (pinned) server ochiq kaliti bilan
 * tekshiradi — shu orqali soxta/o'zgartirilgan siyosat qabul qilinmaydi
 * (AT-29 talabi).
 *
 * MUHIM: server private key fayl tizimida saqlanadi (demo uchun) —
 * productionda buni ham SecretManager/HSM/KMS orqali saqlash tavsiya etiladi.
 */

const fs = require('fs');
const path = require('path');
const {
  generateKeyPair,
  privateKeyToRawBase64,
  privateKeyFromRawBase64,
  sign,
} = require('./ed25519Utils');

// Har bir imzolangan siyosat kanonik JSON ustidan imzolanadi —
// deterministik bo'lishi uchun kalitlar alifbo tartibida saralanadi.
function canonicalize(obj) {
  if (Array.isArray(obj)) return `[${obj.map(canonicalize).join(',')}]`;
  if (obj && typeof obj === 'object') {
    const keys = Object.keys(obj).sort();
    return `{${keys.map(k => JSON.stringify(k) + ':' + canonicalize(obj[k])).join(',')}}`;
  }
  return JSON.stringify(obj);
}

class PolicyManager {
  constructor(opts = {}) {
    this.dataDir = opts.dataDir || path.join(__dirname, 'data');
    this.keyFile = path.join(this.dataDir, 'policy-signing-key.json');
    if (!fs.existsSync(this.dataDir)) fs.mkdirSync(this.dataDir, { recursive: true });
    this._ensureKeyPair();
    this.currentSigned = null;
  }

  _ensureKeyPair() {
    if (fs.existsSync(this.keyFile)) {
      const raw = JSON.parse(fs.readFileSync(this.keyFile, 'utf8'));
      this.privateKey = privateKeyFromRawBase64(raw.privateRawBase64, raw.publicRawBase64);
      this.publicRawBase64 = raw.publicRawBase64;
      this.keyId = raw.keyId;
      return;
    }
    const { privateKey } = generateKeyPair();
    const raw = privateKeyToRawBase64(privateKey);
    const keyId = 'policy-key-' + Date.now();
    fs.writeFileSync(this.keyFile, JSON.stringify({ keyId, ...raw }, null, 2), { mode: 0o600 });
    this.privateKey = privateKey;
    this.publicRawBase64 = raw.publicRawBase64;
    this.keyId = keyId;
  }

  /** Android agentga provisioning paytida shu ochiq kalitni pin qiling (root of trust) */
  getServerPublicKeyRawBase64() {
    return this.publicRawBase64;
  }

  signPolicy(policyObject) {
    const canonical = canonicalize(policyObject);
    const signature = sign(this.privateKey, Buffer.from(canonical, 'utf8'));
    this.currentSigned = {
      policy: policyObject,
      canonical,
      signature: signature.toString('base64'),
      keyId: this.keyId,
      signedAt: new Date().toISOString(),
    };
    return this.currentSigned;
  }

  getSignedPolicy() {
    if (!this.currentSigned) throw new Error('Hali hech qanday policy imzolanmagan — signPolicy() chaqiring.');
    return this.currentSigned;
  }
}

module.exports = { PolicyManager, canonicalize };
