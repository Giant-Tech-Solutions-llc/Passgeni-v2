/**
 * GET /api/audit?limit=20&offset=0
 *
 * Returns the caller's certificate audit log.
 * Accepts session cookie or Bearer API key.
 */

import { resolveApiCaller }      from "../../lib/apiAuth.js";
import { getCertificatesByUser } from "../../lib/db/certs.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const caller = await resolveApiCaller(req, res);
  if (!caller) return;

  const limit  = Math.min(parseInt(req.query.limit  ?? "20", 10), 100);
  const offset = Math.max(parseInt(req.query.offset ?? "0",  10), 0);

  try {
    const { certs, total } = await getCertificatesByUser(caller.userId, { limit, offset });
    return res.status(200).json({ certs, total, limit, offset });
  } catch (err) {
    console.error("[audit] DB error:", err?.message);
    return res.status(500).json({ error: "Failed to fetch audit log" });
  }
}
