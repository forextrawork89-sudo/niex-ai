'use strict';

/**
 * Ed25519 yordamchi funksiyalar.
 *
 * Android agent odatda raw 32-baytli Ed25519 kalitlardan foydalanadi
 * (libsodium/TweetNaCl). Node crypto esa KeyObject bilan ishlaydi, shuning
 * uchun raw <-> KeyObject o'zaro konvertatsiyasi uchun JWK (OKP/Ed25519)
 * formatidan foydalanamiz — bu Node 12+ da barqaror ishlaydi.
 */

const crypto = require('crypto');

function toBase64Url(buf) {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function fromBase64Url(str) {
  const pad = str.length % 4 === 0 ? '' : '='.repeat(4 - (str.length % 4));
  const b64 = str.replace(/-/g, '+').replace(/_/g, '/') + pad;
  return Buffer.from(b64, 'base64');
}

/** Standart base64 (raw kalitlar API/JSON orqali shu formatda yuboriladi) -> KeyObject */
function publicKeyFromRawBase64(rawBase64) {
  const raw = Buffer.from(rawBase64, 'base64');
  if (raw.length !== 32) throw new Error('Ed25519 ochiq kalit 32 bayt bo\'lishi kerak.');
  const jwk = { kty: 'OKP', crv: 'Ed25519', x: toBase64Url(raw) };
  return crypto.createPublicKey({ key: jwk, format: 'jwk' });
}

function privateKeyFromRawBase64(rawBase64, publicRawBase64) {
  const d = Buffer.from(rawBase64, 'base64');
  const x = Buffer.from(publicRawBase64, 'base64');
  const jwk = { kty: 'OKP', crv: 'Ed25519', d: toBase64Url(d), x: toBase64Url(x) };
  return crypto.createPrivateKey({ key: jwk, format: 'jwk' });
}

/** KeyObject (public) -> raw 32-bayt base64 */
function publicKeyToRawBase64(publicKeyObject) {
  const jwk = publicKeyObject.export({ format: 'jwk' });
  return fromBase64Url(jwk.x).toString('base64');
}

/** KeyObject (private) -> {privateRawBase64, publicRawBase64} */
function privateKeyToRawBase64(privateKeyObject) {
  const jwk = privateKeyObject.export({ format: 'jwk' });
  return {
    privateRawBase64: fromBase64Url(jwk.d).toString('base64'),
    publicRawBase64: fromBase64Url(jwk.x).toString('base64'),
  };
}

/** Server yoki test uchun yangi Ed25519 juftlik yaratish */
function generateKeyPair() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519');
  return { publicKey, privateKey };
}

function sign(privateKeyObject, dataBuffer) {
  // Ed25519 uchun algoritm nomi kerak emas (null) — imzo dataning o'zi ustidan olinadi
  return crypto.sign(null, dataBuffer, privateKeyObject);
}

function verify(publicKeyObject, dataBuffer, signatureBuffer) {
  try {
    return crypto.verify(null, dataBuffer, publicKeyObject, signatureBuffer);
  } catch (e) {
    return false; // noto'g'ri format/uzunlik bo'lsa ham xavfsiz false qaytaramiz
  }
}

module.exports = {
  toBase64Url,
  fromBase64Url,
  publicKeyFromRawBase64,
  privateKeyFromRawBase64,
  publicKeyToRawBase64,
  privateKeyToRawBase64,
  generateKeyPair,
  sign,
  verify,
};
