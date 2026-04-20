// =============================================================
// PASSGENI — IN-MEMORY RATE LIMITER (W7)
// =============================================================
// Map-based per-key/IP sliding window. Suitable for single-instance
// deploy (Railway/Vercel single region). For multi-region, replace
// backing store with Redis.
//
// Usage:
//   const { allowed, remaining, resetAt } = rateLimit(identifier, limit, windowMs)
// =============================================================

const _store = new Map(); // identifier → { count, windowStart }

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
      : caller?.userId ?? req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ?? "anonymous";

    const { allowed, remaining, resetAt } = rateLimit(identifier, limit, windowMs);

    res.setHeader("X-RateLimit-Limit",     String(limit));
    res.setHeader("X-RateLimit-Remaining", String(remaining));
    res.setHeader("X-RateLimit-Reset",     String(Math.ceil(resetAt / 1000)));

    if (!allowed) {
      res.status(429).json({
        error: `Rate limit exceeded. Max ${limit} requests per ${Math.round(windowMs / 1000)}s window.`,
        code: "RATE_LIMITED",
        retry_after: Math.ceil((resetAt - Date.now()) / 1000),
      });
      return false;
    }

    return true;
  };
}
