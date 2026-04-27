// =============================================================
// PASSGENI — IN-MEMORY RATE LIMITER
// =============================================================
// NOTE: This in-memory limiter is used for per-request burst control (burstLimit)
// and low-security per-instance limits. For IP-based security limits in production,
// use rateLimitDb (lib/rateLimitDb.js) which is Supabase-backed and works across
// Vercel instances. Replace with Upstash Redis for high-throughput (>100 rps).
//
// Usage:
//   const { allowed, remaining, resetAt } = rateLimit(identifier, limit, windowMs)
// =============================================================

const _store = new Map();      // identifier → { count, windowStart }
const _burstStore = new Map(); // identifier → { tokens, lastRefill }

// Evict stale sliding-window entries every 5 minutes.
// Entries are only touched on each hit from the same key; IPs/users that
// don't repeat stay in memory indefinitely without this sweep.
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of _store.entries()) {
    // Default window is 60s; longest window in use is 1h (IP limit).
    // Use 2h as a conservative eviction threshold.
    if (now - entry.windowStart > 2 * 60 * 60 * 1000) _store.delete(key);
  }
}, 5 * 60 * 1000).unref?.();

/**
 * Burst limiter: allows burstSize requests immediately, then enforces cooldownMs between requests.
 * Use for cert generation: 5 burst, then 1/second.
 * @returns {{ allowed: boolean, waitMs?: number }}
 */
export function burstLimit(key, { burstSize = 5, cooldownMs = 1000 } = {}) {
  const now = Date.now();
  const entry = _burstStore.get(key) ?? { tokens: burstSize, lastRefill: now };

  const elapsed = now - entry.lastRefill;
  const refill = Math.floor(elapsed / cooldownMs);
  if (refill > 0) {
    entry.tokens = Math.min(burstSize, entry.tokens + refill);
    entry.lastRefill = now;
  }

  if (entry.tokens <= 0) {
    const waitMs = cooldownMs - (now - entry.lastRefill);
    _burstStore.set(key, entry);
    return { allowed: false, waitMs: Math.max(0, waitMs) };
  }

  entry.tokens--;
  _burstStore.set(key, entry);
  return { allowed: true };
}

// Clean up stale burst entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of _burstStore.entries()) {
    if (now - entry.lastRefill > 5 * 60 * 1000) _burstStore.delete(key);
  }
}, 5 * 60 * 1000).unref?.();

/**
 * Check and increment rate limit for an identifier.
 *
 * @param {string} identifier  — e.g. userId or IP
 * @param {number} limit       — max requests per window
 * @param {number} windowMs    — window duration in ms (default: 60_000)
 * @returns {{ allowed: boolean, remaining: number, resetAt: number }}
 */
export function rateLimit(identifier, limit, windowMs = 60_000) {
  const now = Date.now();

  let entry = _store.get(identifier);
  if (!entry || now - entry.windowStart >= windowMs) {
    entry = { count: 0, windowStart: now };
  }

  entry.count += 1;
  _store.set(identifier, entry);

  const resetAt   = entry.windowStart + windowMs;
  const remaining = Math.max(0, limit - entry.count);
  const allowed   = entry.count <= limit;

  return { allowed, remaining, resetAt };
}

/**
 * Express-style middleware factory for Next.js API routes.
 *
 * @param {{ limit: number, windowMs: number, keyFn?: (req) => string }} opts
 * @returns {(req, res, caller) => boolean}  — returns false if rate limited (response already sent)
 */
export function createRateLimiter({ limit = 60, windowMs = 60_000, keyFn } = {}) {
  return function checkRateLimit(req, res, caller) {
    const identifier = keyFn
      ? keyFn(req, caller)
      : caller?.userId ?? req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ?? req.socket?.remoteAddress ?? "anonymous";

    const { allowed, remaining, resetAt } = rateLimit(identifier, limit, windowMs);

    res.setHeader("X-RateLimit-Limit",     String(limit));
    res.setHeader("X-RateLimit-Remaining", String(remaining));
    res.setHeader("X-RateLimit-Reset",     String(Math.ceil(resetAt / 1000)));

    if (!allowed) {
      const retryAfterSecs = Math.ceil((resetAt - Date.now()) / 1000);
      res.setHeader("Retry-After", String(retryAfterSecs));
      res.status(429).json({
        error: `Rate limit exceeded. Max ${limit} requests per ${Math.round(windowMs / 1000)}s window.`,
        code: "RATE_LIMITED",
        retry_after: retryAfterSecs,
      });
      return false;
    }

    return true;
  };
}
