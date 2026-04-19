/**
 * PATCH /api/team/policy
 * Set (or clear) the org compliance policy standard.
 * Body: { standard } — one of nist|hipaa|pci|soc2|iso|fips, or "" to clear.
 */

import { requireAuthority } from "../../../lib/auth.js";
import { setTeamPolicy }    from "../../../lib/db/client.js";

const VALID_STANDARDS = ["nist", "hipaa", "pci", "soc2", "iso", "fips"];

export default async function handler(req, res) {
  if (req.method !== "PATCH") return res.status(405).end();

  const auth = await requireAuthority(req, res);
  if (!auth) return;
  const { customerId } = auth;

  const { standard } = req.body ?? {};
  if (standard && !VALID_STANDARDS.includes(standard)) {
    return res.status(400).json({ error: `standard must be one of: ${VALID_STANDARDS.join(", ")} or empty` });
  }

  try {
    await setTeamPolicy(customerId, standard || null);
    return res.status(200).json({ success: true, standard: standard || null });
  } catch (err) {
    console.error("[team/policy] error:", err?.message);
    return res.status(500).json({ error: "Failed to update policy", detail: err?.message });
  }
}
