// =============================================================
// PASSGENI — CERT EXPIRY REMINDER  (pages/api/email/cert-expiry.js)
// POST /api/email/cert-expiry
// =============================================================
// Called by a cron job (Vercel Cron or external scheduler) daily
// to notify users whose certificates expire within 30 days.
//
// Implements the PRD §3B "Expiry loop":
//   Certificate nears 1-year expiry → Email reminder → Re-certify
//
// Auth: INTERNAL_SECRET header
// =============================================================

import { sendEmail }          from "../../../lib/email/send.js";
import { certExpiryReminder } from "../../../lib/email/templates.js";
import { getDB }              from "../../../lib/db/client.js";
import { STANDARD_LABELS }   from "../../../lib/compliance.js";

const DAYS_BEFORE_EXPIRY = 30; // send reminder when ≤ 30 days remain

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const secret = req.headers["x-internal-secret"];
  if (secret !== process.env.INTERNAL_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const db  = getDB();
    const now = new Date();

    // Window: certs expiring between tomorrow and DAYS_BEFORE_EXPIRY from now
    // (avoid re-sending for certs already expired)
    const windowStart = new Date(now.getTime() + 1 * 86_400_000);
    const windowEnd   = new Date(now.getTime() + DAYS_BEFORE_EXPIRY * 86_400_000);

    // Fetch certs expiring soon, joined with user email
    const { data: certs, error } = await db
      .from("certificates")
      .select("id, user_id, email, compliance_standard, expires_at")
      .eq("is_revoked", false)
      .gte("expires_at", windowStart.toISOString())
      .lte("expires_at", windowEnd.toISOString())
      .order("expires_at", { ascending: true });

    if (error) throw error;
    if (!certs?.length) return res.status(200).json({ processed: 0, sent: 0 });

    // Group certs by user email so each user gets one consolidated email
    const byEmail = {};
    for (const cert of certs) {
      const recipientEmail = cert.email;
      if (!recipientEmail) continue;
      if (!byEmail[recipientEmail]) byEmail[recipientEmail] = [];
      byEmail[recipientEmail].push(cert);
    }

    const baseUrl = process.env.NEXTAUTH_URL ?? "https://passgeni.ai";

    const results = await Promise.allSettled(
      Object.entries(byEmail).map(async ([email, userCerts]) => {
        const certsExpiring = userCerts.map((c) => {
          const daysLeft = Math.ceil((new Date(c.expires_at) - now) / (1000 * 60 * 60 * 24));
          return {
            id:         c.id,
            standard:   STANDARD_LABELS[c.compliance_standard] ?? c.compliance_standard,
            expiresAt:  new Date(c.expires_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            daysLeft,
          };
        });

        const tmpl = certExpiryReminder(email, {
          certsExpiring,
          dashboardUrl: `${baseUrl}/dashboard/certify`,
        });

        return sendEmail({ to: email, ...tmpl });
      })
    );

    const sent   = results.filter((r) => r.status === "fulfilled" && r.value?.ok).length;
    const failed = results.length - sent;

    return res.status(200).json({
      processed: results.length,
      sent,
      failed,
      window: { start: windowStart.toISOString(), end: windowEnd.toISOString() },
    });

  } catch (err) {
    console.error("[cert-expiry] cron error:", err);
    return res.status(500).json({ error: err.message });
  }
}
