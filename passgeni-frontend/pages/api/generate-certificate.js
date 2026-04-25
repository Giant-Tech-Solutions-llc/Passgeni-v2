/**
 * POST /api/generate-certificate
 *
 * Issues an ES256-signed compliance certificate.
 * Requires: auth session + valid generation_session_id from /api/generate.
 *
 * Body: { generation_session_id }
 * Returns: { cert_id, cert_url, standards_met, compliance_standard, entropy_bits, expires_at }
 */

import crypto from "crypto";
import { jwtVerify } from "jose";
import { verifySessionToken, signCertJWT } from "../../lib/certs.js";
import { logEvent, checkAnomalyThreshold, EVENT_TYPES } from "../../lib/usageEvents.js";
import {
  STANDARDS,
  normalizeStandardId,
  validateAgainstStandard,
  getStandardsMet,
  calculateEntropy,
  inferCharPoolSize,
} from "../../lib/compliance.js";
import { createCertificate, getMonthlyCount } from "../../lib/db/certs.js";
import { getDB } from "../../lib/db/client.js";
import { resolveApiCaller } from "../../lib/apiAuth.js";
import { burstLimit } from "../../lib/rateLimit.js";
import { rateLimitDb } from "../../lib/rateLimitDb.js";
import { getClientIp } from "../../lib/request.js";

// IP rate limit: 10 cert attempts per hour (free-tier / unauthenticated scraping protection)
const IP_LIMIT = 10;
const IP_WINDOW_MS = 60 * 60 * 1000; // 1 hour

// Free tier: 3 certs/month, NIST-800-63B only
const FREE_MONTHLY_LIMIT = 3;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  // ── IP rate limit (PRD §9.0C) — enforced before auth ─────────────────────
  const ipCheck = await rateLimitDb(`ip:cert:${getClientIp(req)}`, IP_LIMIT, IP_WINDOW_MS);
  if (!ipCheck.allowed) {
    const retryAfterSecs = Math.ceil((ipCheck.resetAt - Date.now()) / 1000);
    res.setHeader("Retry-After", String(retryAfterSecs));
    return res.status(429).json({
      error: "Too many certificate requests from this IP. Max 10 per hour.",
      code: "IP_RATE_LIMITED",
      retry_after: retryAfterSecs,
      fix: "Wait before making more certificate requests, or sign in to get a higher limit.",
    });
  }

  // ── Auth (session cookie or Bearer API key) ───────────────────────────────
  const caller = await resolveApiCaller(req, res);
  if (!caller) return; // resolveApiCaller already sent the error response

  const { userId, email, plan } = caller;

  // User-level rate limit: 60 cert generations per minute (DB-backed, works across Vercel instances)
  const userRlKey = `user:cert:${userId}`;
  const userRl = await rateLimitDb(userRlKey, 60, 60_000);
  res.setHeader("X-RateLimit-Limit", "60");
  res.setHeader("X-RateLimit-Remaining", String(userRl.remaining));
  res.setHeader("X-RateLimit-Reset", String(Math.ceil(userRl.resetAt / 1000)));
  if (!userRl.allowed) {
    const retryAfterSecs = Math.ceil((userRl.resetAt - Date.now()) / 1000);
    res.setHeader("Retry-After", String(retryAfterSecs));
    return res.status(429).json({
      error: `Rate limit exceeded. Max 60 certificate requests per minute.`,
      code: "RATE_LIMITED",
      retry_after: retryAfterSecs,
      fix: "Wait before making more certificate requests.",
    });
  }

  // ── Burst protection: 5 immediate, then 1/second ──────────────────────────
  const burst = burstLimit(`burst:cert:${userId}`, { burstSize: 5, cooldownMs: 1000 });
  if (!burst.allowed) {
    const retryAfterSecs = Math.ceil((burst.waitMs ?? 1000) / 1000);
    res.setHeader("Retry-After", String(retryAfterSecs));
    return res.status(429).json({
      error: "Too many certificates generated too quickly. Please wait a moment.",
      retry_after: retryAfterSecs,
      fix: "Wait 1 second between certificate generation requests.",
    });
  }

  // ── API key daily limit (enterprise callers only) ────────────────────────
  if (caller.source === "apikey") {
    const db = getDB();
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count } = await db
      .from("usage_events")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("event_type", "cert_generated")
      .gte("created_at", since);
    const dailyLimit = 1000;
    if ((count ?? 0) >= dailyLimit) {
      const retryAfterSecs = Math.ceil((new Date().setHours(24, 0, 0, 0) - Date.now()) / 1000);
      res.setHeader("Retry-After", String(retryAfterSecs));
      return res.status(429).json({
        error: `Daily API limit of ${dailyLimit} certificates reached.`,
        fix: "Contact support to increase your daily limit, or wait until tomorrow.",
        retry_after: retryAfterSecs,
        resets_at: new Date(new Date().setHours(24, 0, 0, 0)).toISOString(),
      });
    }
  }

  // ── Session token validation (generation_session_id primary, session_token legacy) ─
  const { generation_session_id, session_token } = req.body ?? {};
  const token = generation_session_id ?? session_token;

  if (!token) {
    return res.status(400).json({
      error: "generation_session_id is required.",
      fix: "Call POST /api/generate first to get a session token, then certify using that token.",
    });
  }

  let sessionParams;
  if (generation_session_id) {
    // New jose-signed token from /api/generate
    try {
      const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);
      const { payload } = await jwtVerify(generation_session_id, secret);
      if (payload.type !== "generation_session") throw new Error("Invalid token type");
      // Params are server-verified — client cannot tamper with them
      const p = payload.params;
      sessionParams = {
        compliance_standard: p.compliance_standard,
        length:      p.length,
        has_upper:   p.has_upper,
        has_lower:   p.has_lower,
        has_numbers: p.has_numbers,
        has_special: p.has_special,
        entropy_bits:  p.entropy_bits,
        char_pool_size: p.char_pool_size,
      };
    } catch {
      return res.status(401).json({
        error: "Invalid or expired generation session. Sessions expire after 60 seconds.",
        fix: "Generate a new password and certify within 60 seconds.",
      });
    }
  } else {
    // Legacy HMAC token from /api/issue-session
    try {
      sessionParams = verifySessionToken(session_token);
    } catch (err) {
      return res.status(400).json({
        error: err.message.includes("expired")
          ? "Your generation session expired. Go back and generate a new password to certify."
          : "Invalid session token.",
        fix: "Call POST /api/generate to get a fresh session token.",
      });
    }
  }

  const {
    compliance_standard,
    length,
    has_upper,
    has_lower,
    has_numbers,
    has_special,
    entropy_bits: rawEntropyBits,
    char_pool_size: rawCharPoolSize,
  } = sessionParams;

  // ── Resolve canonical standard ID ────────────────────────────────────────
  const canonicalId = normalizeStandardId(compliance_standard);
  if (!canonicalId) {
    return res.status(400).json({
      error: `Unknown compliance standard: "${compliance_standard}". Supported: NIST, HIPAA, PCI-DSS, SOC 2, ISO 27001, FIPS.`,
      fix: "Use one of the supported standard IDs.",
      supported: Object.keys(STANDARDS),
    });
  }
  const standard = STANDARDS[canonicalId];

  // ── Tier gates ────────────────────────────────────────────────────────────
  if (plan === "free") {
    // Standard gate: NIST only on free tier
    if (canonicalId !== "NIST-800-63B") {
      return res.status(402).json({
        error: `The ${standard.label} standard requires an Assurance plan. Upgrade to certify ${standard.label} passwords.`,
        fix: "Upgrade to the Assurance plan at passgeni.ai/pricing.",
        code: "UPGRADE_REQUIRED",
        upgrade_url: `${process.env.NEXTAUTH_URL ?? "https://passgeni.ai"}/pricing`,
      });
    }
    // Monthly cert limit
    const monthlyCount = await getMonthlyCount(userId);
    if (monthlyCount >= FREE_MONTHLY_LIMIT) {
      return res.status(402).json({
        error: `You've used all ${FREE_MONTHLY_LIMIT} free certificates this month. Upgrade to Assurance for unlimited certificates.`,
        fix: "Upgrade to the Assurance plan at passgeni.ai/pricing.",
        code: "LIMIT_REACHED",
        upgrade_url: `${process.env.NEXTAUTH_URL ?? "https://passgeni.ai"}/pricing`,
        used: monthlyCount,
        limit: FREE_MONTHLY_LIMIT,
      });
    }
  }

  // ── Build params for centralised validation ───────────────────────────────
  const charPoolSize = Number(rawCharPoolSize) || inferCharPoolSize("x".repeat(Number(length) || 12));
  const entropyBits = rawEntropyBits ?? calculateEntropy("x".repeat(Number(length) || 12), charPoolSize);

  const validationParams = {
    length:             Number(length),
    hasUppercase:       Boolean(has_upper),
    hasLowercase:       Boolean(has_lower),
    hasNumbers:         Boolean(has_numbers),
    hasSpecial:         Boolean(has_special),
    hasDictionaryWords: false,
    hasRepeatingChars:  false,
    entropyBits:        Number(entropyBits),
  };

  // ── Server-side compliance validation ────────────────────────────────────
  const { valid, gaps } = validateAgainstStandard(validationParams, canonicalId);
  if (!valid) {
    // Build specific error message from the first gap
    const firstGap = gaps[0] ?? `Password parameters do not meet ${standard.label} requirements.`;
    return res.status(422).json({
      error: firstGap,
      compliance_standard: canonicalId,
      gaps,
      fix: `Adjust your generation settings to meet ${standard.label} requirements (min ${standard.minLength} characters${standard.requireSpecial ? ", special characters required" : ""}).`,
      code: "COMPLIANCE_FAILURE",
    });
  }

  // ── Compute standards_met ─────────────────────────────────────────────────
  const standardsMet = getStandardsMet(validationParams);

  // ── Sign + store certificate ──────────────────────────────────────────────
  const certId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
  const now = Math.floor(Date.now() / 1000);

  const jwtPayload = {
    jti:  certId,
    iss:  "passgeni.ai",
    sub:  userId,
    email,
    cert_version: "2.0",
    compliance_standard: canonicalId,
    standards_met:       standardsMet,
    generation_params: {
      length:      Number(length),
      has_upper:   Boolean(has_upper),
      has_lower:   Boolean(has_lower),
      has_numbers: Boolean(has_numbers),
      has_special: Boolean(has_special),
    },
    entropy_bits:  parseFloat(Number(entropyBits).toFixed(2)),
    char_pool_size: charPoolSize,
    entropy_source: "crypto.getRandomValues (FIPS 140-3 aligned)",
    iat: now,
    exp: now + 365 * 24 * 60 * 60,
  };

  const jwtToken = signCertJWT(jwtPayload);

  const cert = await createCertificate({
    id: certId,
    user_id: userId,
    email,
    compliance_standard: canonicalId,
    generation_params: jwtPayload.generation_params,
    entropy_bits:  jwtPayload.entropy_bits,
    char_pool_size: charPoolSize,
    standards_met: standardsMet,
    jwt_token: jwtToken,
    expires_at: expiresAt,
  });

  const baseUrl = process.env.NEXTAUTH_URL ?? "https://passgeni.ai";
  const cert_url = `${baseUrl}/cert/${certId}`;

  // Fire-and-forget: log event + anomaly check (no latency impact)
  const rawIp = (req.headers["x-forwarded-for"] ?? req.socket?.remoteAddress ?? "").split(",")[0].trim();
  logEvent(userId, EVENT_TYPES.CERT_GENERATED, { cert_id: certId, compliance_standard: canonicalId, entropy_bits: jwtPayload.entropy_bits }, rawIp);
  checkAnomalyThreshold(userId, 50).then(({ anomaly, count }) => {
    if (anomaly) console.warn(`[anomaly] User ${userId} generated ${count} certs in 24h`);
  });

  // NOTE: jwt_token is intentionally NOT returned in the API response (PRD §7.1 delta).
  // The JWT is stored in the DB and publicly verifiable via /cert/[id] and /.well-known/jwks.json.
  // Returning the raw JWT would expose it to browser history, logs, and network traces.
  // Auditors verify via the public cert URL, not the raw token. This is a security improvement over the PRD spec.
  // If raw JWT access is needed for Enterprise integrations, it can be added as an opt-in via API key scope.
  return res.status(201).json({
    cert_id: certId,
    cert_url,
    compliance_standard,
    standards_met: jwtPayload.standards_met,
    entropy_bits: jwtPayload.entropy_bits,
    expires_at: expiresAt,
    created_at: cert.created_at,
  });
}
