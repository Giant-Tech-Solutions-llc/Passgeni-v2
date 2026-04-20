/**
 * POST /api/generate-certificate
 *
 * Issues an ES256-signed compliance certificate.
 * Requires: auth session + valid generation session_token from /api/issue-session.
 *
 * Body: { session_token }
 * Returns: { cert_id, cert_url, standards_met, compliance_standard, entropy_bits, expires_at }
 */

import crypto from "crypto";
import { verifySessionToken, signCertJWT } from "../../lib/certs.js";
import {
  STANDARDS,
  normalizeStandardId,
  validateAgainstStandard,
  getStandardsMet,
  calculateEntropy,
  inferCharPoolSize,
} from "../../lib/compliance.js";
import { createCertificate, getMonthlyCount } from "../../lib/db/certs.js";
import { resolveApiCaller } from "../../lib/apiAuth.js";
import { createRateLimiter } from "../../lib/rateLimit.js";

// 30 cert generations per minute per user/key
const checkRateLimit = createRateLimiter({ limit: 30, windowMs: 60_000 });

// Free tier: 3 certs/month, NIST-800-63B only
const FREE_MONTHLY_LIMIT = 3;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  // ── Auth (session cookie or Bearer API key) ───────────────────────────────
  const caller = await resolveApiCaller(req, res);
  if (!caller) return; // resolveApiCaller already sent the error response

  if (!checkRateLimit(req, res, caller)) return;

  const { userId, email, plan }  = caller;

  // ── Session token validation ──────────────────────────────────────────────
  const { session_token } = req.body ?? {};
  if (!session_token) {
    return res.status(400).json({ error: "session_token is required" });
  }

  let sessionParams;
  try {
    sessionParams = verifySessionToken(session_token);
  } catch (err) {
    return res.status(400).json({
      error: err.message.includes("expired")
        ? "Your generation session expired. Go back and generate a new password to certify."
        : "Invalid session token.",
    });
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
      error: `Unknown compliance standard: ${compliance_standard}`,
      supported: Object.keys(STANDARDS),
    });
  }
  const standard = STANDARDS[canonicalId];

  // ── Tier gates ────────────────────────────────────────────────────────────
  if (plan === "free") {
    // Standard gate: NIST only on free tier
    if (canonicalId !== "NIST-800-63B") {
      return res.status(402).json({
        error: `The ${standard.label} standard requires an Assurance plan. Upgrade for $19/month.`,
        code: "UPGRADE_REQUIRED",
        upgrade_url: "/pricing",
      });
    }
    // Monthly cert limit
    const monthlyCount = await getMonthlyCount(userId);
    if (monthlyCount >= FREE_MONTHLY_LIMIT) {
      return res.status(402).json({
        error: `You've used all ${FREE_MONTHLY_LIMIT} free certificates this month. Upgrade to Assurance for unlimited certificates and all compliance standards.`,
        code: "LIMIT_REACHED",
        upgrade_url: "/pricing",
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
    return res.status(422).json({
      error: `Password parameters do not meet ${standard.label} requirements.`,
      compliance_standard: canonicalId,
      gaps,
      fix: "Adjust generation parameters to meet the standard requirements",
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
