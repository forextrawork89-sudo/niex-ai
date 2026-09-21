'use strict';

/**
 * Rate Limiter (sliding window)
 * ------------------------------------------------------------
 * Demo uchun xotirada. Production'da bir nechta instance bo'lsa
 * Redis backendga o'ting (INCR + EXPIRE yoki sorted set).
 * `store` interfeysi orqali almashtirsa bo'ladi.
 */

class MemoryStore {
  constructor() {
    this.map = new Map();
    const gc = setInterval(() => this._gc(), 60 * 1000);
    if (gc.unref) gc.unref();
  }
  hit(key, windowMs) {
    const now = Date.now();
    const arr = (this.map.get(key) || []).filter(ts => now - ts < windowMs);
    arr.push(now);
    this.map.set(key, arr);
    return arr.length;
  }
  count(key, windowMs) {
    const now = Date.now();
    return (this.map.get(key) || []).filter(ts => now - ts < windowMs).length;
  }
  reset(key) {
    this.map.delete(key);
  }
  _gc() {
    const now = Date.now();
    for (const [k, arr] of this.map.entries()) {
      // eng uzun oyna 1 soat deb hisoblaymiz
      if (!arr.some(ts => now - ts < 60 * 60 * 1000)) this.map.delete(k);
    }
  }
}

const defaultStore = new MemoryStore();

/**
 * @param {Object} opts
 * @param {number} opts.windowMs
 * @param {number} opts.max
 * @param {Function} [opts.keyGenerator] - (req) => string
 * @param {string} [opts.prefix]
 */
function rateLimit(opts) {
  const {
    windowMs,
    max,
    keyGenerator = req => req.ip,
    prefix = 'rl',
    store = defaultStore,
    message = 'too_many_requests',
  } = opts;

  return function (req, res, next) {
    const key = `${prefix}:${keyGenerator(req)}`;
    const hits = store.hit(key, windowMs);

    res.setHeader('RateLimit-Limit', max);
    res.setHeader('RateLimit-Remaining', Math.max(0, max - hits));

    if (hits > max) {
      res.setHeader('Retry-After', Math.ceil(windowMs / 1000));
      return res.status(429).json({ error: message });
    }
    next();
  };
}

/** Bir nechta darajali limit (masalan daqiqasiga 5 VA soatiga 20) */
function multiRateLimit(tiers, keyGenerator = req => req.ip, prefix = 'mrl') {
  const store = defaultStore;
  return function (req, res, next) {
    const base = keyGenerator(req);
    for (const tier of tiers) {
      const key = `${prefix}:${tier.windowMs}:${base}`;
      const hits = store.hit(key, tier.windowMs);
      if (hits > tier.max) {
        res.setHeader('Retry-After', Math.ceil(tier.windowMs / 1000));
        return res.status(429).json({ error: 'too_many_requests', tier: `${tier.max}/${tier.windowMs}ms` });
      }
    }
    next();
  };
}

module.exports = { rateLimit, multiRateLimit, MemoryStore, defaultStore };
