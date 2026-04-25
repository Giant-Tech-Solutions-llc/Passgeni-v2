/**
 * GET /api/audit?limit=20&offset=0&standard=HIPAA&date_from=2026-01-01&date_to=2026-12-31&status=valid
 *
 * Returns the caller's certificate audit log with optional filtering.
 * Accepts session cookie or Bearer API key.
 *
 * Query params:
 *   limit        — max results per page (default 20, max 100)
 *   offset       — pagination offset (default 0)
 *   standard     — filter by compliance_standard (e.g. HIPAA, NIST-800-63B)
 *   date_from    — filter created_at >= date_from (ISO date string)
 *   date_to      — filter created_at <= date_to (ISO date string)
 *   status       — "valid" | "revoked" | "expired"
 */

import { resolveApiCaller }      from "../../lib/apiAuth.js";
import { getCertificatesByUser } from "../../lib/db/certs.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const caller = await resolveApiCaller(req, res);
  if (!caller) return;

  const { limit: rawLimit = "20", offset: rawOffset = "0", standard, date_from, date_to, status } = req.query;

  const limit  = Math.min(parseInt(rawLimit,  10), 100);
  const offset = Math.max(parseInt(rawOffset, 10), 0);

  try {
    const { certs, total } = await getCertificatesByUser(caller.userId, { limit, offset, standard, date_from, date_to, status });
    return res.status(200).json({
      certs,
      total,
      limit,
      offset,
      filters: {
        standard:  standard  || null,
        date_from: date_from || null,
        date_to:   date_to   || null,
        status:    status    || null,
      },
    });
  } catch (err) {
    console.error("[audit] DB error:", err?.message);
    return res.status(500).json({ error: "Failed to fetch audit log" });
  }
}
