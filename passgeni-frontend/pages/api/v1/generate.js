// =============================================================
// PASSGENI — PASSWORD GENERATION API  (Phase 4 — real DB)
// POST /api/v1/generate
// =============================================================
// Phase 4 changes:
//   - API key validated against Supabase (not env var list)
//   - Daily usage tracked per-key in usage_daily table
//   - Every call logged to usage_logs for analytics
//   - Rate limit reads from DB, not in-memory Map
//
// Free tier:  50 calls/day  (IP-based, no key needed)
// Team tier:  5,000 calls/day (key-based, DB-backed)
// =============================================================

import {
  validateAndFetchKey,
  getDailyUsage,
  incrementDailyUsage,
  logApiCall,
} from "../../../lib/db/client.js";

// ─── FALLBACK RATE LIMITER ────────────────────────────────────
// For free (keyless) requests — IP-based, in-memory.
// Team requests use the DB exclusively.
const freeRateLimitStore = new Map();

function getFreeRateLimit(ip) {
  const limit    = 50;
  const windowMs = 24 * 60 * 60 * 1000;
  const now      = Date.now();
  const key      = `free:${ip}`;

  if (!freeRateLimitStore.has(key)) {
    freeRateLimitStore.set(key, { count: 0, resetAt: now + windowMs });
  }
  const record = freeRateLimitStore.get(key);
  if (now > record.resetAt) { record.count = 0; record.resetAt = now + windowMs; }
  record.count++;

  return {
    allowed:   record.count <= limit,
    remaining: Math.max(0, limit - record.count),
    resetAt:   record.resetAt,
    limit,
  };
}

// ─── CHARACTER SETS ───────────────────────────────────────────
const CHARS = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  num:   "0123456789",
  sym:   "!@#$%^&*-_=+",
  symX:  "!@#$%^&*-_=+[]{}|;:,.<>?",
};

const COMPLIANCE_LENGTHS = {
  hipaa: 12, pci: 12, soc2: 16, iso: 14, nist: 15, dod: 15, quantum: 20,
};

function generatePassword(length, opts, quantum = false) {
  let pool = CHARS.lower;
  if (opts.upper) pool += CHARS.upper;
  if (opts.num)   pool += CHARS.num;
  if (opts.sym)   pool += quantum ? CHARS.symX : CHARS.sym;
  const arr = pool.split("");
  const { randomInt } = require("crypto");
  return Array.from({ length }, () => arr[randomInt(arr.length)]).join("");
}

function calcEntropy(password) {
  return Math.round(password.length * Math.log2(94));
}

// ─── HANDLER ─────────────────────────────────────────────────
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const startMs = Date.now();
  const {
    profession = "general",
    length     = 18,
    compliance = null,
    count      = 1,
    mode       = "password",
    quantum    = false,
    apiKey     = null,
  } = req.body || {};

  const ip = req.headers["x-forwarded-for"]?.split(",")[0].trim()
    || req.socket.remoteAddress
    || "unknown";

  // ── Authenticate API key against DB ──────────────────────
  let isTeam       = false;
  let customerId   = null;
  let keyId        = null;
  let usedToday    = 0;
  const TEAM_LIMIT = 5000;
  const FREE_LIMIT = 50;

  if (apiKey) {
    try {
      const result = await validateAndFetchKey(apiKey);
      if (result) {
        isTeam     = true;
        customerId = result.customer.id;
        keyId      = result.apiKey.id;
        usedToday  = await getDailyUsage(keyId);
      }
      // Invalid key → treat as free tier (don't reveal whether key exists)
    } catch (dbErr) {
      console.error("DB key validation error:", dbErr);
      // Fail open to free tier — don't break the API over a DB hiccup
    }
  }

  // ── Rate limiting ─────────────────────────────────────────
  let rateLimitAllowed = false;
  let rateLimitRemaining = 0;
  let rateLimitReset = Date.now() + 24 * 60 * 60 * 1000;

  if (isTeam) {
    // DB-backed rate limit for Team keys
    rateLimitAllowed   = usedToday < TEAM_LIMIT;
    rateLimitRemaining = Math.max(0, TEAM_LIMIT - usedToday);
    // Reset is midnight UTC
    const tomorrow     = new Date();
    tomorrow.setUTCHours(24, 0, 0, 0);
    rateLimitReset     = tomorrow.getTime();
  } else {
    // In-memory IP limit for free tier
    const fl           = getFreeRateLimit(ip);
    rateLimitAllowed   = fl.allowed;
    rateLimitRemaining = fl.remaining;
    rateLimitReset     = fl.resetAt;
  }

  res.setHeader("X-RateLimit-Limit",     isTeam ? TEAM_LIMIT : FREE_LIMIT);
  res.setHeader("X-RateLimit-Remaining", rateLimitRemaining);
  res.setHeader("X-RateLimit-Reset",     rateLimitReset);

  if (!rateLimitAllowed) {
    return res.status(429).json({
      error:   "Rate limit exceeded",
      limit:   isTeam ? TEAM_LIMIT : FREE_LIMIT,
      resetAt: new Date(rateLimitReset).toISOString(),
      upgrade: isTeam ? null : "Upgrade to Team for 5,000 calls/day — passgeni.ai/api",
    });
  }

  // ── Compliance preset gating ──────────────────────────────
  if (compliance && !isTeam) {
    return res.status(403).json({
      error:   "Compliance presets require a Team plan API key",
      upgrade: "https://passgeni.ai/api#pricing",
    });
  }

  // ── Validate inputs ───────────────────────────────────────
  const maxCount  = isTeam ? 500 : 10;
  const safeCount = Math.min(Math.max(1, parseInt(count) || 1), maxCount);
  let safeLength  = Math.min(Math.max(8, parseInt(length) || 18), 32);

  if (compliance && COMPLIANCE_LENGTHS[compliance]) {
    safeLength = Math.max(safeLength, COMPLIANCE_LENGTHS[compliance]);
  }
  if (quantum) safeLength = Math.max(safeLength, 20);

  const opts = { upper: true, num: true, sym: compliance !== "nist" };

  // ── Generate ─────────────────────────────────────────────
  try {
    const passwords     = Array.from({ length: safeCount }, () =>
      generatePassword(safeLength, opts, quantum)
    );
    const responseMs    = Date.now() - startMs;
    const firstEntropy  = calcEntropy(passwords[0]);

    // ── Async: increment usage + log + alert (don't await — keep response fast)
    if (isTeam && keyId) {
      incrementDailyUsage(keyId).then(async () => {
        // Fire 80% and 100% usage alerts (server-side, email sent once per day)
        try {
          const newUsed    = usedToday + safeCount;
          const pct        = (newUsed / TEAM_LIMIT) * 100;
          const wasBelow80 = ((usedToday)     / TEAM_LIMIT) * 100 < 80;
          const wasBelow100 = ((usedToday)    / TEAM_LIMIT) * 100 < 100;
          const shouldAlert = (pct >= 80 && wasBelow80) || (pct >= 100 && wasBelow100);
          if (shouldAlert) {
            // customerId already in scope from key validation above
            // Minimal: just fire internal alert endpoint (handles dedup)
            const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://passgeni.ai";
            fetch(`${baseUrl}/api/usage/alert`, {
              method:  "POST",
              headers: {
                "Content-Type":     "application/json",
                "x-internal-secret": process.env.INTERNAL_SECRET || "",
              },
              body: JSON.stringify({ customerId, email: null, percentUsed: Math.round(pct) }),
            }).catch(console.error);
          }
        } catch (alertErr) { console.error("Usage alert error:", alertErr); }
      }).catch(console.error);

      logApiCall({
        keyId, customerId,
        params:     { ip, profession, compliance, length: safeLength, count: safeCount, mode },
        responseMs,
        status:     "ok",
      }).catch(console.error);
    }

    return res.status(200).json({
      passwords,
      count:      passwords.length,
      entropy:    firstEntropy,
      length:     safeLength,
      compliance: compliance || null,
      mode,
      quantum,
      tier:       isTeam ? "team" : "free",
      generated:  new Date().toISOString(),
      audit: {
        entropySource: "Node.js crypto.randomInt() — FIPS 140-3 aligned",
        characterPool: `lower+upper+numbers${opts.sym ? "+symbols" : ""}${quantum ? "(expanded)" : ""}`,
        clientSide:    false,
        serverContact: true,
        note:          "API generation is server-side. For zero-knowledge generation, use the web tool at passgeni.ai",
      },
    });

  } catch (error) {
    console.error("Generation error:", error);
    return res.status(500).json({ error: "Generation failed. Please try again." });
  }
}
