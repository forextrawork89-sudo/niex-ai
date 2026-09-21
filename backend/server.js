'use strict';

/**
 * NIEX Security — to'liq integratsiya qilingan server namunasi.
 * Barcha xavfsizlik qatlamlari to'g'ri TARTIBDA ulangan.
 */

require('dotenv').config();
const express = require('express');
const crypto = require('crypto');

const {
  SecretManager,
  DeviceRegistry, NonceStore, SessionStore, PolicyManager,
  publicKeyFromRawBase64, verify,
  securityHeaders, rateLimit, multiRateLimit,
  safeFetch, SsrfError,
  PinGuard, OtpService,
  telegramWebhookGuard, buildWebhookConfig,
  createSafeLogger, requestLogger,
  LocationGuard,
  promptGuard,
} = require('./index');

const logger = createSafeLogger(console);
const app = express();

// Reverse proxy (nginx/Caddy) orqasida ishlaganda haqiqiy IP uchun
app.set('trust proxy', 1);
app.disable('x-powered-by');

// ---------- Xavfsizlik middleware'lari (TARTIB MUHIM) ----------
app.use(securityHeaders({ enableHsts: process.env.NODE_ENV === 'production' }));
app.use(requestLogger(logger));
// Global limit — DoS'ga qarshi birinchi to'siq
app.use(rateLimit({ windowMs: 60 * 1000, max: 120 }));
// JSON hajmi cheklangan
app.use(express.json({ limit: '128kb' }));

// ---------- Servislar ----------
const secretManager = new SecretManager({
  masterKeyBase64: process.env.MASTER_KMS_KEY,
  dataDir: process.env.DATA_DIR ? `${process.env.DATA_DIR}/secrets` : undefined,
});
const deviceRegistry = new DeviceRegistry({ dataDir: process.env.DATA_DIR ? `${process.env.DATA_DIR}/devices` : undefined });
const nonceStore = new NonceStore({ ttlMs: 2 * 60 * 1000 });
const sessionStore = new SessionStore({ ttlMs: 15 * 60 * 1000 });
const policyManager = new PolicyManager({ dataDir: process.env.DATA_DIR ? `${process.env.DATA_DIR}/policy` : undefined });
const locationGuard = new LocationGuard({ dataDir: process.env.DATA_DIR ? `${process.env.DATA_DIR}/location` : undefined });

const pinGuard = new PinGuard({
  freeAttempts: 3,
  baseLockoutMs: 30 * 1000,
  onLockout: ({ identity, failCount }) => {
    // TODO: ota-onaga Telegram orqali ogohlantirish yuborish
    logger.warn({ event: 'pin_lockout', identity, failCount });
  },
});

const otpService = new OtpService({
  logger,
  sender: async ({ phone, code }) => {
    // TODO: haqiqiy SMS provayder (Eskiz.uz / Play Mobile)
    // DIQQAT: code hech qachon log qilinmasin
    if (process.env.NODE_ENV !== 'production') logger.info({ event: 'otp_dev_stub', phone });
  },
});

policyManager.signPolicy({
  version: 1,
  screenTimeLimits: { weekday: 120, weekend: 240 },
  blockedCategories: ['adult', 'gambling', 'violence'],
});

// ---------- Auth middleware'lar ----------
function requireAdmin(req, res, next) {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  const expected = process.env.ADMIN_API_TOKEN || '';
  const a = Buffer.from(token), b = Buffer.from(expected);
  const ok = expected && a.length === b.length && crypto.timingSafeEqual(a, b);
  if (!ok) return res.status(401).json({ error: 'unauthorized' });
  next();
}

function requireDeviceSession(req, res, next) {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  const deviceId = token && sessionStore.verifySession(token);
  if (!deviceId) return res.status(401).json({ error: 'unauthorized' });
  if (!deviceRegistry.isActive(deviceId)) return res.status(403).json({ error: 'device_revoked' });
  req.deviceId = deviceId;
  next();
}

// ================= ADMIN =================
app.post('/admin/secrets', requireAdmin, (req, res) => {
  const { name, value } = req.body || {};
  if (!name || typeof value !== 'string') return res.status(400).json({ error: 'bad_request' });
  res.status(201).json(secretManager.setSecret(name, value));
});
app.get('/admin/secrets', requireAdmin, (req, res) => res.json({ secrets: secretManager.listSecrets() }));
app.post('/admin/keys/rotate', requireAdmin, (req, res) => res.json(secretManager.rotateKey()));

app.post('/admin/devices/register', requireAdmin, (req, res) => {
  const { deviceId, publicKey, meta } = req.body || {};
  if (!deviceId || !publicKey) return res.status(400).json({ error: 'bad_request' });
  try { publicKeyFromRawBase64(publicKey); }
  catch { return res.status(400).json({ error: 'invalid_public_key' }); }
  try { res.status(201).json(deviceRegistry.registerDevice(deviceId, publicKey, meta || {})); }
  catch (e) { res.status(409).json({ error: e.message }); }
});

app.post('/admin/devices/:deviceId/revoke', requireAdmin, (req, res) => {
  const ok = deviceRegistry.revokeDevice(req.params.deviceId, req.body?.reason || '');
  if (!ok) return res.status(404).json({ error: 'not_found' });
  sessionStore.revokeAllForDevice(req.params.deviceId);
  res.json({ deviceId: req.params.deviceId, status: 'revoked' });
});

// ================= QURILMA AUTH =================
app.post('/devices/:deviceId/challenge', rateLimit({ windowMs: 60000, max: 20, keyGenerator: r => r.params.deviceId }), (req, res) => {
  if (!deviceRegistry.isActive(req.params.deviceId)) return res.status(403).json({ error: 'device_not_authorized' });
  res.json(nonceStore.issueChallenge(req.params.deviceId));
});

app.post('/devices/:deviceId/verify', rateLimit({ windowMs: 60000, max: 10, keyGenerator: r => r.params.deviceId }), (req, res) => {
  const { deviceId } = req.params;
  const { nonce, signature } = req.body || {};
  if (!nonce || !signature) return res.status(400).json({ error: 'bad_request' });

  const device = deviceRegistry.getDevice(deviceId);
  if (!device || device.status !== 'active') return res.status(403).json({ error: 'device_not_authorized' });

  const consumed = nonceStore.consumeChallenge(deviceId, nonce);
  if (!consumed.ok) return res.status(400).json({ error: 'invalid_challenge', reason: consumed.reason });

  const valid = verify(publicKeyFromRawBase64(device.publicKey), Buffer.from(nonce, 'base64'), Buffer.from(signature, 'base64'));
  if (!valid) return res.status(401).json({ error: 'invalid_signature' });

  deviceRegistry.touchLastSeen(deviceId);
  res.json(sessionStore.createSession(deviceId));
});

app.get('/policy/latest', requireDeviceSession, (req, res) => {
  try { res.json(policyManager.getSignedPolicy()); }
  catch { res.status(503).json({ error: 'policy_not_ready' }); }
});

app.get('/policy/server-public-key', (req, res) => {
  res.json({ publicKey: policyManager.getServerPublicKeyRawBase64(), keyId: policyManager.keyId });
});

// ================= PIN =================
const pinStore = new Map(); // parentId -> hash (prod: DB)

app.post('/pin/set', requireAdmin, (req, res) => {
  const { parentId, pin } = req.body || {};
  try {
    pinStore.set(parentId, pinGuard.setPin(pin));
    res.json({ ok: true });
  } catch (e) { res.status(400).json({ error: e.message }); }
});

app.post('/pin/verify', (req, res) => {
  const { parentId, pin } = req.body || {};
  const hash = pinStore.get(parentId);
  if (!hash) return res.status(404).json({ error: 'not_found' });
  const r = pinGuard.verify(parentId, String(pin || ''), hash);
  if (!r.ok) return res.status(r.reason === 'locked' ? 429 : 401).json(r);
  res.json({ ok: true });
});

// ================= OTP =================
app.post('/otp/request', multiRateLimit([{ windowMs: 60000, max: 3 }, { windowMs: 3600000, max: 20 }]), async (req, res) => {
  const { phone } = req.body || {};
  if (!/^\+998\d{9}$/.test(phone || '')) return res.status(400).json({ error: 'invalid_phone' });
  const r = await otpService.requestCode(phone, { ip: req.ip });
  res.status(r.ok ? 200 : 429).json(r);
});

app.post('/otp/verify', multiRateLimit([{ windowMs: 60000, max: 5 }]), (req, res) => {
  const { phone, code } = req.body || {};
  const r = otpService.verifyCode(phone, code);
  res.status(r.ok ? 200 : 401).json(r);
});

// ================= URL TEKSHIRUV (SSRF himoyasi) =================
app.post('/url/check', requireDeviceSession, rateLimit({ windowMs: 60000, max: 30, keyGenerator: r => r.deviceId }), async (req, res) => {
  const { url } = req.body || {};
  try {
    const result = await safeFetch(url, { timeoutMs: 5000, maxResponseBytes: 512 * 1024 });
    res.json({ statusCode: result.statusCode, finalUrl: result.finalUrl, size: result.body.length });
  } catch (e) {
    if (e instanceof SsrfError) {
      logger.warn({ event: 'ssrf_blocked', code: e.code, deviceId: req.deviceId });
      return res.status(400).json({ error: 'url_rejected', code: e.code });
    }
    res.status(500).json({ error: 'internal_error' });
  }
});

// ================= AI MODERATSIYA (prompt injection himoyasi) =================
app.post('/moderate', requireDeviceSession, rateLimit({ windowMs: 60000, max: 60, keyGenerator: r => r.deviceId }), async (req, res) => {
  const { content, contentType, childAge } = req.body || {};
  const built = promptGuard.buildModerationMessages({ untrustedContent: content, contentType, childAge });

  // TODO: bu yerda haqiqiy LLM chaqiruvi. Namuna uchun stub javob:
  const llmRawResponse = '{"rating":"safe","categories":[],"reason":"stub","confidence":0.9}';

  const verdict = promptGuard.parseModerationResponse(llmRawResponse, {
    injectionDetected: built.meta.detection.suspicious,
  });
  res.json(verdict);
});

// ================= LOKATSIYA =================
app.post('/location/consent', requireAdmin, (req, res) => {
  const { childId, parentId, granted } = req.body || {};
  if (granted) locationGuard.grantConsent(childId, parentId);
  else locationGuard.revokeConsent(childId, parentId, req.body?.reason || '');
  res.json({ ok: true, hasConsent: locationGuard.hasConsent(childId) });
});

app.post('/location/point', requireDeviceSession, (req, res) => {
  const { childId, lat, lng, accuracy } = req.body || {};
  const ok = locationGuard.recordPoint(childId, { lat, lng, accuracy });
  res.status(ok ? 201 : 403).json({ ok });
});

app.get('/location/:childId', requireAdmin, (req, res) => {
  try { res.json({ location: locationGuard.readLocation(req.params.childId, { parentId: req.query.parentId }) }); }
  catch (e) { res.status(403).json({ error: e.code || 'forbidden' }); }
});

app.delete('/location/:childId', requireAdmin, (req, res) => {
  res.json(locationGuard.eraseAll(req.params.childId, req.body?.requestedBy || 'admin'));
});

// ================= TELEGRAM WEBHOOK =================
if (process.env.TELEGRAM_WEBHOOK_SECRET && process.env.TELEGRAM_WEBHOOK_PATH) {
  app.post(
    process.env.TELEGRAM_WEBHOOK_PATH,
    rateLimit({ windowMs: 1000, max: 30 }),
    telegramWebhookGuard({
      secretToken: process.env.TELEGRAM_WEBHOOK_SECRET,
      checkIp: process.env.NODE_ENV === 'production',
      logger,
    }),
    (req, res) => {
      // TODO: update'ni qayta ishlash
      res.json({ ok: true });
    }
  );
} else {
  logger.warn({ event: 'telegram_webhook_disabled', reason: 'secret yoki path o\'rnatilmagan' });
  logger.info({ event: 'webhook_config_hint', hint: buildWebhookConfig('https://api.example.uz') });
}

// ================= XATO ISHLOVCHI =================
// Stack trace hech qachon foydalanuvchiga ko'rsatilmaydi
app.use((err, req, res, next) => {
  logger.error({ event: 'unhandled_error', err });
  res.status(500).json({ error: 'internal_error' });
});

app.use((req, res) => res.status(404).json({ error: 'not_found' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => logger.info({ event: 'server_started', port: PORT }));

module.exports = app;
