/**
 * POST /api/generate
 *
 * Issues a short-lived jose-signed session token for a set of generation params.
 * Call this after generating a password client-side to get the token needed to certify it.
 *
 * The signed token proves PassGeni's server validated the params — external passwords
 * cannot be certified because they have no valid token.
 *
 * Body: { compliance_standard, length, has_upper, has_lower, has_numbers, has_special, entropy_bits, char_pool_size }
 * Returns: { generation_session_id, session_expires_in, compliance_valid, gaps, standards_met }
 */

import crypto from "crypto";
import { SignJWT } from "jose";
import {
  normalizeStandardId,
  validateAgainstStandard,
  getStandardsMet,
} from "../../lib/compliance.js";
import { createRateLimiter } from "../../lib/rateLimit.js";
import { rateLimitDb } from "../../lib/rateLimitDb.js";
import { getClientIp } from "../../lib/request.js";

// 30 session requests per minute per IP (prevents session token flooding)
const checkSessionRateLimit = createRateLimiter({ limit: 30, windowMs: 60_000 });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  // IP-based rate limit for session generation
  const ip = getClientIp(req);
  const ipSessionCheck = await rateLimitDb(`ip:session:${ip}`, 30, 60_000);
  if (!ipSessionCheck.allowed) {
    const retryAfterSecs = Math.ceil((ipSessionCheck.resetAt - Date.now()) / 1000);
    res.setHeader("Retry-After", String(retryAfterSecs));
    return res.status(429).json({
      error: "Too many session requests from this IP. Please slow down.",
      code: "RATE_LIMITED",
      retry_after: retryAfterSecs,
      fix: "Wait before requesting more generation sessions.",
    });
  }

  const {
    compliance_standard,
    length,
    has_upper,
    has_lower,
    has_numbers,
    has_special,
    entropy_bits,
    char_pool_size,
  } = req.body ?? {};

  if (
    typeof compliance_standard !== "string" ||
    typeof length !== "number" ||
    typeof entropy_bits !== "number"
  ) {
    return res.status(400).json({ error: "Invalid params" });
  }

  const canonicalId = normalizeStandardId(compliance_standard);
  if (!canonicalId) {
    return res.status(400).json({
      error: `Unknown compliance standard: "${compliance_standard}". Supported: NIST, HIPAA, PCI-DSS, SOC 2, ISO 27001, FIPS.`,
      fix: "Use one of the supported standard IDs.",
    });
  }

  const engineParams = {
    length:             Number(length),
    hasUppercase:       Boolean(has_upper),
    hasLowercase:       Boolean(has_lower),
    hasNumbers:         Boolean(has_numbers),
    hasSpecial:         Boolean(has_special),
    hasDictionaryWords: false,
    hasRepeatingChars:  false,
    entropyBits:        Number(entropy_bits),
  };

  const { valid, gaps } = validateAgainstStandard(engineParams, canonicalId);
  const standards_met = getStandardsMet(engineParams);

  const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);
  const generation_session_id = await new SignJWT({
    type:   "generation_session",
    params: {
      compliance_standard: canonicalId,
      length:      Number(length),
      has_upper:   Boolean(has_upper),
      has_lower:   Boolean(has_lower),
      has_numbers: Boolean(has_numbers),
      has_special: Boolean(has_special),
      char_pool_size: char_pool_size ?? 0,
      entropy_bits:   Number(entropy_bits),
    },
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("60s")
    .setJti(crypto.randomUUID())
    .sign(secret);

  return res.status(200).json({
    generation_session_id,
    session_expires_in: 60,
    compliance_valid: valid,
    gaps,
    standards_met,
  });
}
