/**
 * GET /api/cert/[id]
 *
 * Public endpoint — no auth required.
 * Returns certificate metadata from DB + verifies the stored JWT signature.
 * Used by /cert/[id] page and by auditors for programmatic verification.
 */

import { getCertificate, logCertView } from "../../../lib/db/certs.js";
import { verifyCertJWT } from "../../../lib/certs.js";
import { STANDARDS } from "../../../lib/compliance.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const { id } = req.query;
  if (!id || typeof id !== "string") return res.status(400).json({ error: "Missing cert id" });

  const cert = await getCertificate(id).catch(() => null);
  if (!cert) return res.status(404).json({ error: "Certificate not found" });

  // Verify JWT signature (proves cert hasn't been tampered with)
  let signatureValid = false;
  let jwtPayload = null;
  try {
    jwtPayload = verifyCertJWT(cert.jwt_token);
    signatureValid = true;
  } catch {
    signatureValid = false;
  }

  // Log view (fire-and-forget)
  const rawIp = (req.headers["x-forwarded-for"] ?? req.socket.remoteAddress ?? "").split(",")[0].trim();
  logCertView(id, rawIp);

  const now = new Date();
  const expiresAt = new Date(cert.expires_at);
  const isExpired = expiresAt < now;
  const isValid = !cert.is_revoked && !isExpired && signatureValid;

  res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=300");

  const standardLabel = STANDARDS[cert.compliance_standard]?.label ?? cert.compliance_standard;

  return res.status(200).json({
    cert_id:            cert.id,
    compliance_standard: cert.compliance_standard,
    standard_label:     standardLabel,
    standards_met:      cert.standards_met ?? [],
    generation_params:  cert.generation_params ?? {},
    entropy_bits:       cert.entropy_bits,
    char_pool_size:     cert.char_pool_size,
    entropy_source:     cert.entropy_source ?? "crypto.getRandomValues (FIPS 140-3 aligned)",
    cert_version:       cert.cert_version   ?? "2.0",
    issuer:             cert.issuer         ?? "passgeni.ai",
    created_at:         cert.created_at,
    expires_at:         cert.expires_at,
    is_valid:           isValid,
    is_revoked:         cert.is_revoked,
    revoked_at:         cert.revoked_at ?? null,
    is_expired:         isExpired,
    signature_valid:    signatureValid,
    status:             cert.is_revoked ? "revoked" : isExpired ? "expired" : signatureValid ? "valid" : "invalid",
    // Never expose the raw JWT or user_id in the public API
  });
}
