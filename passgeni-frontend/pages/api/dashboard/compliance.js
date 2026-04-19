/**
 * GET /api/dashboard/compliance
 * Single round-trip for the compliance monitoring dashboard.
 */

import { getToken } from "next-auth/jwt";
import { getDB }    from "../../../lib/db/client.js";

const STANDARD_LABELS = {
  nist:  "NIST SP 800-63B",
  hipaa: "HIPAA §164.312",
  pci:   "PCI-DSS v4.0",
  soc2:  "SOC 2 CC6.1",
  iso:   "ISO 27001:2022",
  fips:  "FIPS 140-3",
};

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  const userId = token.sub;
  const plan   = token.plan   ?? "free";
  const isPaid = plan !== "free";

  // If no userId (shouldn't happen but be defensive), return empty state
  if (!userId) {
    return res.status(200).json(emptyResponse(plan, token));
  }

  const db         = getDB();
  const now        = new Date();
  const soonMs     = 30 * 24 * 60 * 60 * 1000;
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  try {
    // Fetch everything in parallel — simple queries only (no complex OR filters)
    const [certsResult, monthResult, viewsPrep] = await Promise.all([
      // All certs for the user (last 200 — covers table, score, and risks)
      db.from("certificates")
        .select("id, compliance_standard, entropy_bits, char_pool_size, generation_params, standards_met, created_at, expires_at, is_revoked, revoked_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(200),

      // Monthly count: certs issued this month, not revoked
      db.from("certificates")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("is_revoked", false)
        .gte("created_at", monthStart),

      // Defer views query — we need cert IDs first
      Promise.resolve(null),
    ]);

    if (certsResult.error) throw certsResult.error;
    if (monthResult.error) throw monthResult.error;

    const allCerts    = certsResult.data ?? [];
    const monthlyCount = monthResult.count ?? 0;

    // ── Compliance score (computed in JS — no extra query) ────
    const totalCerts = allCerts.length;
    const validCerts = allCerts.filter(
      (c) => !c.is_revoked && new Date(c.expires_at) > now
    ).length;
    const complianceScore = totalCerts === 0 ? 100 : Math.round((validCerts / totalCerts) * 100);
    const scoreColor = complianceScore >= 85 ? "green" : complianceScore >= 60 ? "amber" : "red";

    // ── Build risk list (computed in JS) ──────────────────────
    const risks = allCerts
      .filter((cert) => {
        if (cert.is_revoked) return true;
        const exp = new Date(cert.expires_at);
        if (exp < now) return true;
        if (exp - now < soonMs) return true;
        return false;
      })
      .slice(0, 20)
      .map((cert) => {
        const expDate  = new Date(cert.expires_at);
        const daysLeft = Math.ceil((expDate - now) / (1000 * 60 * 60 * 24));
        const issue    = cert.is_revoked ? "revoked"
                       : expDate < now   ? "expired"
                       : "expiring_soon";
        return {
          id:         cert.id,
          standard:   cert.compliance_standard,
          label:      STANDARD_LABELS[cert.compliance_standard] ?? cert.compliance_standard,
          issue,
          expires_at: cert.expires_at,
          revoked_at: cert.revoked_at ?? null,
          days:       issue === "expiring_soon" ? daysLeft : null,
        };
      });

    // ── Recent activity ───────────────────────────────────────
    const certIds   = allCerts.map((c) => c.id);
    let recentViews = [];

    if (certIds.length > 0) {
      const { data: views, error: viewErr } = await db
        .from("cert_views")
        .select("cert_id, created_at")
        .in("cert_id", certIds.slice(0, 50))   // avoid huge IN clause
        .order("created_at", { ascending: false })
        .limit(10);
      if (!viewErr) recentViews = views ?? [];
    }

    const certStdMap = Object.fromEntries(allCerts.map((c) => [c.id, c.compliance_standard]));

    const generatedEvents = allCerts.slice(0, 10).map((c) => ({
      type:    "generated",
      cert_id: c.id,
      label:   STANDARD_LABELS[c.compliance_standard] ?? c.compliance_standard,
      at:      c.created_at,
    }));

    const viewedEvents = recentViews.map((v) => ({
      type:    "viewed",
      cert_id: v.cert_id,
      label:   STANDARD_LABELS[certStdMap[v.cert_id]] ?? "Certificate",
      at:      v.created_at,
    }));

    const recentActivity = [...generatedEvents, ...viewedEvents]
      .sort((a, b) => new Date(b.at) - new Date(a.at))
      .slice(0, 10);

    return res.status(200).json({
      complianceScore,
      scoreColor,
      totalCerts,
      validCerts,
      risks,
      certs:        allCerts.slice(0, 100),    // table shows last 100
      recentActivity,
      monthlyCount,
      monthlyLimit: isPaid ? null : 3,
      plan,
      planStatus:   token.planStatus ?? null,
      trialEnd:     token.trialEnd   ?? null,
    });

  } catch (err) {
    console.error("[compliance] API error:", err?.message ?? err);
    return res.status(500).json({ error: "Failed to load compliance data" });
  }
}

function emptyResponse(plan, token) {
  return {
    complianceScore: 100,
    scoreColor:      "green",
    totalCerts:      0,
    validCerts:      0,
    risks:           [],
    certs:           [],
    recentActivity:  [],
    monthlyCount:    0,
    monthlyLimit:    plan === "free" ? 3 : null,
    plan,
    planStatus:      token.planStatus ?? null,
    trialEnd:        token.trialEnd   ?? null,
  };
}
