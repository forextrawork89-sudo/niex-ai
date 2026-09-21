'use strict';

/**
 * SSRF Guard — 15.5-bo'lim
 * ------------------------------------------------------------
 * NIEX'da URL tekshiruvi (bola kirgan saytni kategoriyalash, favicon/og-image
 * olish, Knowledge Base import) server tomondan tashqi so'rov yuborishni
 * talab qiladi. Bu klassik SSRF yuzasi.
 *
 * Himoya qatlamlari:
 *   1) Sxema whitelist (faqat http/https)
 *   2) Port whitelist (80/443)
 *   3) Credential va noodatiy hostname formatlarini rad etish
 *   4) DNS resolve QILINGANDAN keyin IP tekshiruvi (private/loopback/link-local/CGNAT/multicast)
 *   5) Redirect'larni QO'LDA kuzatish — har bir hop uchun qayta IP tekshiruvi
 *      (aks holda 302 -> 169.254.169.254 bilan bypass qilinadi)
 *   6) Timeout + javob hajmi cheklovi (DoS/resource exhaustion)
 *
 * DNS rebinding: to'liq himoya uchun resolve qilingan IP'ga to'g'ridan-to'g'ri
 * ulanib, Host headerni qo'lda o'rnatish kerak (pastda `pinnedLookup` shu ishni
 * qiladi — Node agent'ning lookup funksiyasini almashtiradi).
 */

const dns = require('dns').promises;
const net = require('net');
const http = require('http');
const https = require('https');
const { URL } = require('url');

const DEFAULT_OPTIONS = {
  allowedProtocols: ['http:', 'https:'],
  allowedPorts: [80, 443],
  timeoutMs: 5000,
  maxRedirects: 3,
  maxResponseBytes: 2 * 1024 * 1024, // 2 MB
  allowedHostnames: null, // null = hammasi (bloklanganlardan tashqari); massiv = qat'iy whitelist
};

/** IPv4/IPv6 manzil xavfli (ichki tarmoq) ekanligini aniqlaydi */
function isBlockedIp(ip) {
  const type = net.isIP(ip);
  if (type === 0) return true; // IP emas — ishonmaymiz

  if (type === 4) {
    const parts = ip.split('.').map(Number);
    const [a, b] = parts;

    if (a === 0) return true;                          // 0.0.0.0/8
    if (a === 10) return true;                         // 10.0.0.0/8 private
    if (a === 127) return true;                        // loopback
    if (a === 100 && b >= 64 && b <= 127) return true; // 100.64.0.0/10 CGNAT
    if (a === 169 && b === 254) return true;           // link-local + cloud metadata (169.254.169.254)
    if (a === 172 && b >= 16 && b <= 31) return true;  // 172.16.0.0/12 private
    if (a === 192 && b === 0) return true;             // 192.0.0.0/24 IETF
    if (a === 192 && b === 168) return true;           // 192.168.0.0/16 private
    if (a === 198 && (b === 18 || b === 19)) return true; // benchmark
    if (a >= 224) return true;                         // multicast + reserved + broadcast
    return false;
  }

  // IPv6
  const lower = ip.toLowerCase();
  if (lower === '::' || lower === '::1') return true;              // unspecified / loopback
  if (lower.startsWith('fe80')) return true;                       // link-local
  if (lower.startsWith('fc') || lower.startsWith('fd')) return true; // unique local fc00::/7
  if (lower.startsWith('ff')) return true;                         // multicast

  // IPv4-mapped (::ffff:169.254.169.254) — ichidagi IPv4'ni tekshiramiz
  const mapped = lower.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mapped) return isBlockedIp(mapped[1]);

  return false;
}

class SsrfError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'SsrfError';
    this.code = code;
  }
}

/**
 * URL'ni sintaktik va tarmoq darajasida tekshiradi.
 * @returns {Promise<{url: URL, addresses: string[]}>}
 */
async function validateUrl(rawUrl, options = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  if (typeof rawUrl !== 'string' || rawUrl.length > 2048) {
    throw new SsrfError('URL yaroqsiz yoki juda uzun', 'invalid_url');
  }

  let url;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new SsrfError('URL parse qilinmadi', 'invalid_url');
  }

  if (!opts.allowedProtocols.includes(url.protocol)) {
    throw new SsrfError(`Ruxsat etilmagan sxema: ${url.protocol}`, 'blocked_protocol');
  }

  // user:pass@host — ko'pincha filtr chalg'itish uchun ishlatiladi
  if (url.username || url.password) {
    throw new SsrfError('URL ichida credential bo\'lishi mumkin emas', 'credentials_in_url');
  }

  const port = url.port ? Number(url.port) : (url.protocol === 'https:' ? 443 : 80);
  if (!opts.allowedPorts.includes(port)) {
    throw new SsrfError(`Ruxsat etilmagan port: ${port}`, 'blocked_port');
  }

  const hostname = url.hostname.replace(/^\[|\]$/g, ''); // IPv6 qavslarini olib tashlaymiz

  if (opts.allowedHostnames && !opts.allowedHostnames.includes(hostname)) {
    throw new SsrfError('Hostname whitelistda yo\'q', 'hostname_not_allowed');
  }

  // Ba'zi maxsus nomlar — DNS'siz ham bloklaymiz
  if (/^(localhost|metadata\.google\.internal|metadata)$/i.test(hostname)) {
    throw new SsrfError('Bloklangan hostname', 'blocked_hostname');
  }

  // Agar hostname to'g'ridan-to'g'ri IP bo'lsa
  if (net.isIP(hostname)) {
    if (isBlockedIp(hostname)) {
      throw new SsrfError('Ichki/xavfli IP manzil', 'blocked_ip');
    }
    return { url, addresses: [hostname] };
  }

  // DNS resolve — barcha qaytgan manzillar tekshiriladi
  let addresses;
  try {
    const records = await dns.lookup(hostname, { all: true, verbatim: true });
    addresses = records.map(r => r.address);
  } catch {
    throw new SsrfError('DNS resolve qilinmadi', 'dns_failed');
  }

  if (!addresses.length) {
    throw new SsrfError('DNS bo\'sh javob qaytardi', 'dns_failed');
  }

  for (const addr of addresses) {
    if (isBlockedIp(addr)) {
      throw new SsrfError(`Hostname ichki IP\'ga ishora qiladi: ${addr}`, 'blocked_ip');
    }
  }

  return { url, addresses };
}

/**
 * Xavfsiz fetch — validatsiya + pinned IP + qo'lda redirect + hajm/timeout cheklovi.
 * Node'ning o'z fetch/axios redirect'lari SSRF'ga ochiq bo'lgani uchun ular ishlatilmaydi.
 */
async function safeFetch(rawUrl, options = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let currentUrl = rawUrl;

  for (let hop = 0; hop <= opts.maxRedirects; hop++) {
    const { url, addresses } = await validateUrl(currentUrl, opts);
    const pinnedIp = addresses[0]; // DNS rebinding'ga qarshi: shu IP'ga ulanamiz

    const result = await new Promise((resolve, reject) => {
      const lib = url.protocol === 'https:' ? https : http;
      const req = lib.request(
        {
          protocol: url.protocol,
          hostname: url.hostname,
          port: url.port || (url.protocol === 'https:' ? 443 : 80),
          path: url.pathname + url.search,
          method: opts.method || 'GET',
          headers: {
            'User-Agent': opts.userAgent || 'NIEX-URLChecker/1.0',
            Accept: '*/*',
            ...(opts.headers || {}),
          },
          timeout: opts.timeoutMs,
          // Resolve qilingan IP'ga qotiramiz — TLS SNI/sertifikat hostname bo'yicha qoladi
          lookup: (h, o, cb) => cb(null, pinnedIp, net.isIP(pinnedIp)),
        },
        res => {
          const chunks = [];
          let total = 0;
          res.on('data', chunk => {
            total += chunk.length;
            if (total > opts.maxResponseBytes) {
              req.destroy();
              reject(new SsrfError('Javob hajmi limitdan oshdi', 'response_too_large'));
              return;
            }
            chunks.push(chunk);
          });
          res.on('end', () =>
            resolve({
              statusCode: res.statusCode,
              headers: res.headers,
              body: Buffer.concat(chunks),
              finalUrl: url.toString(),
            })
          );
        }
      );

      req.on('timeout', () => {
        req.destroy();
        reject(new SsrfError('So\'rov timeout', 'timeout'));
      });
      req.on('error', err => reject(new SsrfError(`Tarmoq xatosi: ${err.code || err.message}`, 'network_error')));

      if (opts.body) req.write(opts.body);
      req.end();
    });

    // Redirect — keyingi hop uchun QAYTA validatsiya qilinadi
    if ([301, 302, 303, 307, 308].includes(result.statusCode) && result.headers.location) {
      currentUrl = new URL(result.headers.location, url).toString();
      continue;
    }

    return result;
  }

  throw new SsrfError('Redirect limitidan oshdi', 'too_many_redirects');
}

module.exports = { validateUrl, safeFetch, isBlockedIp, SsrfError };
