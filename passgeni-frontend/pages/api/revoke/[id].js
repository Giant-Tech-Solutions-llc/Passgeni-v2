/**
 * POST /api/revoke/[id]
 *
 * Revokes a compliance certificate by ID.
 * Only the owner can revoke their own certificate.
 * Accepts session cookie or Bearer API key.
 */

import { resolveApiCaller } from "../../../lib/apiAuth.js";
import { revokeCertificate } from "../../../lib/db/certs.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const caller = await resolveApiCaller(req, res);
  if (!caller) return;

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: "Certificate ID is required" });

  try {
    const cert = await revokeCertificate(id, caller.userId);
    if (!cert) return res.status(404).json({ error: "Certificate not found or already revoked" });
    return res.status(200).json({ revoked: true, cert_id: cert.id, revoked_at: cert.revoked_at });
  } catch (err) {
    console.error("[revoke] DB error:", err?.message);
    return res.status(500).json({ error: "Failed to revoke certificate" });
  }
}
