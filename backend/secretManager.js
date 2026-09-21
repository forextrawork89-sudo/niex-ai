'use strict';

/**
 * NIEX Secret Manager
 * ------------------------------------------------------------
 * Envelope encryption yondashuvi:
 *   - MASTER KEY (KEK)   -> env'dan olinadi, hech qachon diskka yozilmaydi
 *   - DATA KEYS (DEK)    -> MASTER KEY bilan shifrlangan holda saqlanadi, versiyalanadi
 *   - SECRETS            -> faol DEK bilan shifrlanadi (AES-256-GCM)
 *
 * Kalit rotatsiyasi: yangi DEK yaratiladi, barcha secretlar shu bilan
 * qayta shifrlanadi, eski DEKlar retired holatga o'tadi (darhol o'chirilmaydi —
 * chunki rotatsiya paytida boshqa jarayon eski versiya bilan o'qiyotgan bo'lishi mumkin),
 * so'ng belgilangan muddatdan keyin tozalanadi (purgeRetiredKeys).
 *
 * Audit: har bir get/set/rotate amali audit logga yoziladi (qiymatning o'zi emas,
 * faqat metadata) — 15.5 va AT-25 talabiga mos.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ALGO = 'aes-256-gcm';

function b64(buf) {
  return Buffer.isBuffer(buf) ? buf.toString('base64') : buf;
}
function unb64(str) {
  return Buffer.from(str, 'base64');
}

class SecretManager {
  /**
   * @param {Object} opts
   * @param {string} opts.masterKeyBase64 - 32 baytli (base64) master key. openssl rand -base64 32
   * @param {string} [opts.dataDir] - fayllar saqlanadigan papka (prod'da DB bilan almashtiring)
   * @param {number} [opts.retiredKeyRetentionDays] - retired kalitlarni saqlash muddati (kun)
   */
  /**
   * KMS provider orqali xavfsiz yaratish — master key hech qachon
   * env/diskda emas, faqat shu funksiya chaqirilgan paytda RAM'ga tushadi.
   *
   * @param {Object} opts
   * @param {import('../kms/kmsProvider').KmsProvider} opts.kmsProvider
   * @param {string} [opts.dataDir]
   * @param {number} [opts.retiredKeyRetentionDays]
   */
  static async create(opts) {
    const masterKey = await opts.kmsProvider.getMasterKey();
    return new SecretManager({
      masterKeyBase64: masterKey.toString('base64'),
      dataDir: opts.dataDir,
      retiredKeyRetentionDays: opts.retiredKeyRetentionDays,
    });
  }

  constructor(opts) {
    if (!opts || !opts.masterKeyBase64) {
      throw new Error('MASTER_KMS_KEY berilmagan. .env faylida MASTER_KMS_KEY o\'rnating.');
    }
    this.masterKey = unb64(opts.masterKeyBase64);
    if (this.masterKey.length !== 32) {
      throw new Error('MASTER_KMS_KEY 32 bayt (base64 kodlangan) bo\'lishi kerak.');
    }

    this.dataDir = opts.dataDir || path.join(__dirname, 'data');
    this.keysFile = path.join(this.dataDir, 'keys.json');
    this.secretsFile = path.join(this.dataDir, 'secrets.json');
    this.auditFile = path.join(this.dataDir, 'audit.log');
    this.retiredKeyRetentionDays = opts.retiredKeyRetentionDays || 90;

    this._ensureStorage();
  }

  // ---------- Storage helpers ----------

  _ensureStorage() {
    if (!fs.existsSync(this.dataDir)) fs.mkdirSync(this.dataDir, { recursive: true });
    if (!fs.existsSync(this.keysFile)) this._writeJson(this.keysFile, { keys: [] });
    if (!fs.existsSync(this.secretsFile)) this._writeJson(this.secretsFile, { secrets: [] });
    if (!fs.existsSync(this.auditFile)) fs.writeFileSync(this.auditFile, '');

    // Birinchi ishga tushirishda aktiv kalit bo'lmasa — yaratamiz
    const keys = this._readJson(this.keysFile).keys;
    if (!keys.some(k => k.status === 'active')) {
      this._createNewKey();
    }
  }

  _readJson(file) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  }
  _writeJson(file, data) {
    const tmp = file + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
    fs.renameSync(tmp, file); // atomic yozish
  }

  _audit(action, meta) {
    const line = JSON.stringify({
      ts: new Date().toISOString(),
      action,
      ...meta, // faqat nomlar/versiyalar, hech qachon ochiq qiymat qo'yilmasin
    }) + '\n';
    fs.appendFileSync(this.auditFile, line);
  }

  // ---------- Low-level crypto ----------

  _encryptRaw(plaintextBuf, keyBuf) {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(ALGO, keyBuf, iv);
    const ciphertext = Buffer.concat([cipher.update(plaintextBuf), cipher.final()]);
    const authTag = cipher.getAuthTag();
    return { iv: b64(iv), ciphertext: b64(ciphertext), authTag: b64(authTag) };
  }

  _decryptRaw(record, keyBuf) {
    const decipher = crypto.createDecipheriv(ALGO, keyBuf, unb64(record.iv));
    decipher.setAuthTag(unb64(record.authTag));
    const plaintext = Buffer.concat([
      decipher.update(unb64(record.ciphertext)),
      decipher.final(),
    ]);
    return plaintext;
  }

  // ---------- Key management (DEK) ----------

  _createNewKey() {
    const keysData = this._readJson(this.keysFile);
    const newDek = crypto.randomBytes(32);
    const encryptedDek = this._encryptRaw(newDek, this.masterKey);

    // eski aktiv kalitni retired qilamiz
    keysData.keys.forEach(k => {
      if (k.status === 'active') {
        k.status = 'retired';
        k.retiredAt = new Date().toISOString();
      }
    });

    const version = (keysData.keys.reduce((max, k) => Math.max(max, k.version), 0)) + 1;
    keysData.keys.push({
      version,
      status: 'active',
      createdAt: new Date().toISOString(),
      retiredAt: null,
      ...encryptedDek, // iv, ciphertext, authTag (DEK master key bilan shifrlangan)
    });

    this._writeJson(this.keysFile, keysData);
    this._audit('key_created', { keyVersion: version });
    return version;
  }

  _getKeyRecord(version) {
    const keysData = this._readJson(this.keysFile);
    const rec = keysData.keys.find(k => k.version === version);
    if (!rec) throw new Error(`Kalit versiyasi topilmadi: v${version}`);
    return rec;
  }

  _getActiveKeyRecord() {
    const keysData = this._readJson(this.keysFile);
    const rec = keysData.keys.find(k => k.status === 'active');
    if (!rec) throw new Error('Aktiv kalit topilmadi — createNewKey chaqirilmagan.');
    return rec;
  }

  _decryptDek(keyRecord) {
    return this._decryptRaw(keyRecord, this.masterKey);
  }

  /**
   * Kalitni rotatsiya qilish: yangi DEK yaratadi va BARCHA secretlarni
   * shu yangi kalit bilan qayta shifrlaydi. Eski kalit(lar) retired holatda
   * qoladi (darhol o'chirilmaydi).
   */
  rotateKey() {
    const newVersion = this._createNewKey();
    const newKeyRecord = this._getKeyRecord(newVersion);
    const newDek = this._decryptDek(newKeyRecord);

    const secretsData = this._readJson(this.secretsFile);
    for (const s of secretsData.secrets) {
      const oldKeyRecord = this._getKeyRecord(s.keyVersion);
      const oldDek = this._decryptDek(oldKeyRecord);
      const plaintext = this._decryptRaw(s, oldDek);

      const reEncrypted = this._encryptRaw(plaintext, newDek);
      Object.assign(s, reEncrypted, { keyVersion: newVersion, updatedAt: new Date().toISOString() });
    }
    this._writeJson(this.secretsFile, secretsData);

    this._audit('key_rotated', { newKeyVersion: newVersion, secretsReEncrypted: secretsData.secrets.length });
    return { newVersion, reEncryptedCount: secretsData.secrets.length };
  }

  /**
   * Retired kalitlarni tozalash — faqat ularga bog'liq secret qolmagan
   * va retention muddati o'tgan bo'lsa.
   */
  purgeRetiredKeys() {
    const keysData = this._readJson(this.keysFile);
    const secretsData = this._readJson(this.secretsFile);
    const inUseVersions = new Set(secretsData.secrets.map(s => s.keyVersion));
    const now = Date.now();
    const before = keysData.keys.length;

    keysData.keys = keysData.keys.filter(k => {
      if (k.status !== 'retired') return true;
      if (inUseVersions.has(k.version)) return true; // hali kerak
      const retiredAgeDays = (now - new Date(k.retiredAt).getTime()) / 86400000;
      return retiredAgeDays < this.retiredKeyRetentionDays; // eskisini olib tashlaymiz
    });

    this._writeJson(this.keysFile, keysData);
    const purged = before - keysData.keys.length;
    this._audit('keys_purged', { purgedCount: purged });
    return purged;
  }

  // ---------- Secret CRUD ----------

  setSecret(name, plaintextValue) {
    if (!name || typeof plaintextValue !== 'string') {
      throw new Error('name va plaintextValue (string) talab qilinadi.');
    }
    const activeKey = this._getActiveKeyRecord();
    const dek = this._decryptDek(activeKey);
    const enc = this._encryptRaw(Buffer.from(plaintextValue, 'utf8'), dek);

    const secretsData = this._readJson(this.secretsFile);
    const existing = secretsData.secrets.find(s => s.name === name);
    const now = new Date().toISOString();

    if (existing) {
      Object.assign(existing, enc, { keyVersion: activeKey.version, updatedAt: now });
    } else {
      secretsData.secrets.push({
        name,
        keyVersion: activeKey.version,
        createdAt: now,
        updatedAt: now,
        ...enc,
      });
    }
    this._writeJson(this.secretsFile, secretsData);
    this._audit('secret_set', { name, keyVersion: activeKey.version });
    return { name, keyVersion: activeKey.version, updatedAt: now };
  }

  getSecret(name) {
    const secretsData = this._readJson(this.secretsFile);
    const rec = secretsData.secrets.find(s => s.name === name);
    if (!rec) {
      this._audit('secret_get_miss', { name });
      return null;
    }
    const keyRecord = this._getKeyRecord(rec.keyVersion);
    const dek = this._decryptDek(keyRecord);
    const plaintext = this._decryptRaw(rec, dek);

    this._audit('secret_get', { name, keyVersion: rec.keyVersion });
    return plaintext.toString('utf8');
  }

  deleteSecret(name) {
    const secretsData = this._readJson(this.secretsFile);
    const before = secretsData.secrets.length;
    secretsData.secrets = secretsData.secrets.filter(s => s.name !== name);
    this._writeJson(this.secretsFile, secretsData);
    const deleted = before !== secretsData.secrets.length;
    if (deleted) this._audit('secret_deleted', { name });
    return deleted;
  }

  /** Faqat metadata — qiymatlar hech qachon qaytarilmaydi */
  listSecrets() {
    const secretsData = this._readJson(this.secretsFile);
    return secretsData.secrets.map(s => ({
      name: s.name,
      keyVersion: s.keyVersion,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    }));
  }

  listKeys() {
    const keysData = this._readJson(this.keysFile);
    return keysData.keys.map(k => ({
      version: k.version,
      status: k.status,
      createdAt: k.createdAt,
      retiredAt: k.retiredAt,
    }));
  }
}

module.exports = { SecretManager };
