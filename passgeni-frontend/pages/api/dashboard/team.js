/**
 * GET /api/dashboard/team
 * Returns full team data for the Authority plan admin.
 */

import { requireAuthority } from "../../../lib/auth.js";
import { getToken }         from "next-auth/jwt";
import { getDB, getTeamMembers, getTeamUserIds } from "../../../lib/db/client.js";

const STANDARD_LABELS = {
  nist:  "NIST SP 800-63B",
  hipaa: "HIPAA §164.312",
  pci:   "PCI-DSS v4.0",
  soc2:  "SOC 2 CC6.1",
  iso:   "ISO 27001:2022",
  fips:  "FIPS 140-3",
};

const SEAT_LIMIT = 10;

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const auth = await requireAuthority(req, res);
  if (!auth) return;
  const { session, customerId } = auth;

  const token  = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const userId = token?.sub ?? null;

  const db = getDB();

  try {
    // ── Parallel: members + customer row (for policy) ─────────
    const [members, customerResult] = await Promise.all([
      getTeamMembers(customerId),
      db.from("customers")
        .select("team_policy_standard")
        .eq("id", customerId)
        .single(),
    ]);

    if (customerResult.error) {
      console.error("[team] customer query error:", customerResult.error);
      return res.status(500).json({ error: "Database query failed", detail: customerResult.error.message });
    }

    const policy   = customerResult.data?.team_policy_standard ?? null;
    const seatUsed = members.filter((m) => m.status !== "removed").length;

    // ── Get all team user IDs (for shared cert pool) ──────────
    const teamUserIds = await getTeamUserIds(customerId);
    // Include the admin's own userId
    const allUserIds = userId ? [...new Set([userId, ...teamUserIds])] : teamUserIds;

    let allCerts       = [];
    let recentActivity = [];

    if (allUserIds.length > 0) {
      const [certsResult, activityResult] = await Promise.all([
        db.from("certificates")
          .select("id, user_id, compliance_standard, entropy_bits, created_at, expires_at, is_revoked, revoked_at, standards_met")
          .in("user_id", allUserIds)
          .order("created_at", { ascending: false })
          .limit(200),

        db.from("certificates")
          .select("id, user_id, compliance_standard, created_at")
          .in("user_id", allUserIds)
          .order("created_at", { ascending: false })
          .limit(30),
      ]);

      if (certsResult.error) {
        console.error("[team] certs query error:", certsResult.error);
        return res.status(500).json({ error: "Database query failed", detail: certsResult.error.message });
      }

      allCerts = certsResult.data ?? [];

      // Build email map: userId → email (from team_members + session)
      const memberEmailMap = {};
      members.forEach((m) => {
        // We don't have nextauth user IDs directly — use email as label
        memberEmailMap[m.email] = m.email;
      });
      if (session.user.email) memberEmailMap["__admin__"] = session.user.email;

      recentActivity = (activityResult.data ?? []).map((c) => ({
        type:    "generated",
        cert_id: c.id,
        user_id: c.user_id,
        label:   STANDARD_LABELS[c.compliance_standard] ?? c.compliance_standard,
        at:      c.created_at,
      }));
    }

    // ── Cert counts per user_id ───────────────────────────────
    const certCountByUser = {};
    allCerts.forEach((c) => {
      certCountByUser[c.user_id] = (certCountByUser[c.user_id] ?? 0) + 1;
    });

    // ── Enrich members with cert counts ──────────────────────
    // We need nextauth_users.id per member email to join with certs.user_id
    let memberUserMap = {};
    if (members.length > 0) {
      const emails = members.map((m) => m.email.toLowerCase());
      const { data: nuUsers } = await db
        .from("nextauth_users")
        .select("id, email")
        .in("email", emails);
      (nuUsers || []).forEach((u) => { memberUserMap[u.email.toLowerCase()] = u.id; });
    }

    const enrichedMembers = members.map((m) => ({
      ...m,
      cert_count: certCountByUser[memberUserMap[m.email.toLowerCase()] ?? ""] ?? 0,
    }));

    return res.status(200).json({
      members:       enrichedMembers,
      policy,
      allCerts:      allCerts.slice(0, 100),
      recentActivity,
      seatUsed,
      seatLimit:     SEAT_LIMIT,
      plan:          session.user.plan,
      planStatus:    session.user.planStatus,
      trialEnd:      session.user.trialEnd ?? null,
    });

  } catch (err) {
    console.error("[team] unhandled error:", err?.message ?? err);
    return res.status(500).json({ error: "Failed to load team data", detail: err?.message ?? String(err) });
  }
}
