/**
 * PATCH /api/team/members/[id]  — update role
 * DELETE /api/team/members/[id] — remove member
 */

import { requireAuthority }           from "../../../../lib/auth.js";
import { updateTeamMemberRole, removeTeamMember } from "../../../../lib/db/client.js";

export default async function handler(req, res) {
  if (!["PATCH", "DELETE"].includes(req.method)) return res.status(405).end();

  const auth = await requireAuthority(req, res);
  if (!auth) return;
  const { customerId } = auth;

  const memberId = req.query.id;
  if (!memberId) return res.status(400).json({ error: "Member ID required" });

  try {
    if (req.method === "DELETE") {
      await removeTeamMember(memberId, customerId);
      return res.status(200).json({ success: true });
    }

    // PATCH — update role
    const { role } = req.body ?? {};
    if (!["member", "owner"].includes(role)) {
      return res.status(400).json({ error: "role must be 'member' or 'owner'" });
    }
    const updated = await updateTeamMemberRole(memberId, customerId, role);
    if (!updated) return res.status(404).json({ error: "Member not found" });
    return res.status(200).json({ success: true, member: updated });

  } catch (err) {
    console.error("[team/members] error:", err?.message);
    return res.status(500).json({ error: "Operation failed", detail: err?.message });
  }
}
