'use strict';
/**
 * Saqlash siyosati (retention) skripti — lokatsiya nuqtalarini tozalash.
 * Cron: 0 4 * * *  (har kuni soat 04:00)
 */
require('dotenv').config();
const { LocationGuard } = require('../src');

const lg = new LocationGuard({
  dataDir: process.env.DATA_DIR ? `${process.env.DATA_DIR}/location` : undefined,
  retentionDays: Number(process.env.LOCATION_RETENTION_DAYS || 30),
});

console.log(`[${new Date().toISOString()}] o'chirilgan lokatsiya nuqtalari: ${lg.purgeOldPoints()}`);
