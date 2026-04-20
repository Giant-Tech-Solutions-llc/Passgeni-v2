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
import { verifySessionToken, signCertJWT, buildCertPayload, validateCompliance, STANDARDS } from "../../lib/certs.js";
import { createCertificate, getMonthlyCount } from "../../lib/db/certs.js";
import { resolveApiCaller } from "../../lib/apiAuth.js";

// Free tier: 3 certs/month, NIST only
const FREE_MONTHLY_LIMIT = 3;
const FREE_STANDARDS = ["nist"];

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  // ── Auth (session cookie or Bearer API key) ───────────────────────────────
  const caller = await resolveApiCaller(req, res);
  if (!caller) return; // resolveApiCaller already sent the error response

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

  const { compliance_standard, length, has_upper, has_lower, has_numbers, has_special, entropy_bits, char_pool_size } = sessionParams;

  // ── Tier gates ────────────────────────────────────────────────────────────
  if (plan === "free") {
    // Standard gate: NIST only on free tier
    if (!FREE_STANDARDS.includes(compliance_standard)) {
      return res.status(402).json({
        error: `The ${STANDARDS[compliance_standard]?.label ?? compliance_standard} standard requires an Assurance plan. Upgrade for $19/month.`,
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

  // ── Compliance validation (server-side, never trust client) ───────────────
  const params = { compliance_standard, length, has_upper, has_lower, has_numbers, has_special, entropy_bits, char_pool_size };
  const { valid, gaps } = validateCompliance(params, compliance_standard);
  if (!valid) {
    return res.status(422).json({
      error: `This password does not meet ${STANDARDS[compliance_standard]?.label} requirements.`,
      gaps,
      code: "COMPLIANCE_FAILURE",
    });
  }

  // ── Sign + store certificate ──────────────────────────────────────────────
  const certId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

  const jwtPayload = buildCertPayload({ certId, userId, email, sessionParams });
  const jwtToken = signCertJWT(jwtPayload);

  const cert = await createCertificate({
    id: certId,
    user_id: userId,
    email,
    compliance_standard,
    generation_params: { length, has_upper, has_lower, has_numbers, has_special },
    entropy_bits,
    char_pool_size,
    standards_met: jwtPayload.standards_met,
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
    entropy_bits,
    expires_at: expiresAt,
    created_at: cert.created_at,
  });
}
