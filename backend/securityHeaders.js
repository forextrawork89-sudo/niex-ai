'use strict';

/**
 * Security Headers — 15.5-bo'lim
 * ------------------------------------------------------------
 * helmet'ga tashqi bog'liqliksiz, NIEX ehtiyojiga moslangan variant.
 * Web kabinet (parent dashboard) va Trust sahifasi uchun mo'ljallangan.
 */

const crypto = require('crypto');

function buildCsp(nonce, opts) {
  const directives = {
    'default-src': ["'self'"],
    // inline skriptlar uchun nonce — 'unsafe-inline' ISHLATILMAYDI
    'script-src': ["'self'", `'nonce-${nonce}'`],
    'style-src': ["'self'", `'nonce-${nonce}'`],
    'img-src': ["'self'", 'data:', 'blob:'],
    'font-src': ["'self'"],
    'connect-src': ["'self'", ...(opts.connectSrc || [])],
    'frame-ancestors': ["'none'"],   // clickjacking
    'form-action': ["'self'"],
    'base-uri': ["'self'"],
    'object-src': ["'none'"],
    'upgrade-insecure-requests': [],
  };
  if (opts.cspOverrides) Object.assign(directives, opts.cspOverrides);

  return Object.entries(directives)
    .map(([k, v]) => (v.length ? `${k} ${v.join(' ')}` : k))
    .join('; ');
}

/**
 * @param {Object} [options]
 * @param {boolean} [options.enableHsts=true] - faqat HTTPS orqasida yoqing
 * @param {string[]} [options.connectSrc] - qo'shimcha API originlar
 * @param {Object} [options.cspOverrides]
 */
function securityHeaders(options = {}) {
  const opts = { enableHsts: true, ...options };

  return function (req, res, next) {
    // Har so'rov uchun yangi nonce — shablonda <script nonce="<%= cspNonce %>">
    const nonce = crypto.randomBytes(16).toString('base64');
    res.locals.cspNonce = nonce;

    res.setHeader('Content-Security-Policy', buildCsp(nonce, opts));
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
    res.setHeader('Origin-Agent-Cluster', '?1');
    res.setHeader(
      'Permissions-Policy',
      'geolocation=(self), camera=(), microphone=(), payment=(), usb=(), interest-cohort=()'
    );
    // Texnologiya stackini oshkor qilmaslik
    res.removeHeader('X-Powered-By');

    if (opts.enableHsts) {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    }

    next();
  };
}

module.exports = { securityHeaders };
