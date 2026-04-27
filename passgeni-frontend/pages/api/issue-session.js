/**
 * POST /api/issue-session
 *
 * Issues a short-lived HMAC-signed session token from validated generation params.
 * The certificate endpoint accepts ONLY tokens issued here — this prevents users
 * from certifying passwords they generated outside PassGeni.
 *
 * Body: { compliance_standard, length, has_upper, has_lower, has_numbers, has_special, entropy_bits, char_pool_size }
 * Returns: { session_token, expires_in, compliance_valid, gaps, standards_met }
 */

import { issueSessionToken } from "../../lib/certs.js";
import {
  normalizeStandardId,
  validateAgainstStandard,
  getStandardsMet,
} from "../../lib/compliance.js";

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

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

  // Basic shape validation
  if (
    typeof compliance_standard !== "string" ||
    typeof length !== "number" ||
    typeof entropy_bits !== "number"
  ) {
    return res.status(400).json({ error: "Invalid params" });
  }

  const canonicalId = normalizeStandardId(compliance_standard);
  if (!canonicalId) {
    return res.status(400).json({ error: `Unknown compliance standard: ${compliance_standard}` });
  }

  // Map snake_case body params to engine camelCase
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

  // Store canonical ID in session token so generate-certificate receives it normalised
  const params = {
    compliance_standard: canonicalId,
    length, has_upper: !!has_upper, has_lower: !!has_lower,
    has_numbers: !!has_numbers, has_special: !!has_special,
    entropy_bits, char_pool_size: char_pool_size ?? 0,
  };

  // Even if compliance check fails, still issue a session — the client can show the gaps
  // and the certificate endpoint will attach the gap info
  let session_token = null;
  try {
    session_token = issueSessionToken(params);
  } catch (err) {
    // CERT_SESSION_SECRET not configured — API is unavailable
    return res.status(503).json({ error: "Certificate service not configured" });
  }

  return res.status(200).json({
    session_token,
    expires_in: 600,
    compliance_valid: valid,
    gaps,
    standards_met,
  });
}
