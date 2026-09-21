'use strict';
/**
 * Kalit rotatsiyasi cron skripti.
 * Cron misoli (har 90 kunda):
 *   0 3 1 */3 * cd /opt/niex && node scripts/rotateKeys.js >> /var/log/niex-rotate.log 2>&1
 */
require('dotenv').config();
const { SecretManager } = require('../src');

const sm = new SecretManager({
  masterKeyBase64: process.env.MASTER_KMS_KEY,
  dataDir: process.env.DATA_DIR ? `${process.env.DATA_DIR}/secrets` : undefined,
  retiredKeyRetentionDays: Number(process.env.RETIRED_KEY_RETENTION_DAYS || 90),
});

console.log(`[${new Date().toISOString()}] rotatsiya boshlandi`);
const r = sm.rotateKey();
console.log(`yangi kalit: v${r.newVersion}, qayta shifrlangan: ${r.reEncryptedCount}`);
console.log(`tozalangan eski kalitlar: ${sm.purgeRetiredKeys()}`);
