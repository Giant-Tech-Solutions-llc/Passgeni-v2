/**
 * GET /api/admin/announce?dry_run=true&filter=all|paid|free
 * POST /api/admin/announce?dry_run=false&filter=all|paid|free
 *
 * Requires: Authorization: Bearer <ADMIN_SECRET>
 *
 * dry_run=true  → returns { recipients, count } without sending
 * dry_run=false → sends announcement email batch via Resend
 */

import { getDB }   from "../../../lib/db/client.js";
import { Resend }  from "resend";

export default async function handler(req, res) {
  if (!["GET", "POST"].includes(req.method)) return res.status(405).end();

  // ── Auth ─────────────────────────────────────────────────────
  const bearer = req.headers.authorization?.replace("Bearer ", "").trim();
  if (!bearer || bearer !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { dry_run, filter = "all" } = req.query;
  const isDryRun = dry_run === "true";

  // ── Fetch recipients ─────────────────────────────────────────
  const db = getDB();
  let query = db.from("customers").select("id, email, name, plan, plan_status");

  if (filter === "paid")  query = query.neq("plan", "free");
  if (filter === "free")  query = query.eq("plan", "free");

  const { data: customers, error } = await query;
  if (error) {
    console.error("[announce] DB error:", error.message);
    return res.status(500).json({ error: error.message });
  }

  if (isDryRun) {
    return res.status(200).json({
      recipients: (customers ?? []).map((c) => ({ email: c.email, plan: c.plan, status: c.plan_status })),
      count:      (customers ?? []).length,
    });
  }

  // ── Send via Resend batch ────────────────────────────────────
  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ error: "RESEND_API_KEY not configured" });
  }

  const resend   = new Resend(process.env.RESEND_API_KEY);
  const baseUrl  = process.env.NEXTAUTH_URL ?? "https://passgeni.ai";
  const allEmails = (customers ?? []).map((c) => ({
    from:    "PassGeni <hello@passgeni.ai>",
    to:      c.email,
    subject: "PassGeni v2 is here — compliance certificates for passwords",
    html: buildEmailHtml(c.name, baseUrl),
  }));

  let sent = 0, failed = 0;

  // Resend batch limit: 100 per call
  for (let i = 0; i < allEmails.length; i += 100) {
    const batch = allEmails.slice(i, i + 100);
    const { error: sendError } = await resend.batch.send(batch);
    if (sendError) {
      console.error("[announce] Resend batch error:", sendError.message);
      failed += batch.length;
    } else {
      sent += batch.length;
    }
  }

  return res.status(200).json({ sent, failed, total: allEmails.length });
}

function buildEmailHtml(name, baseUrl) {
  const greeting = name ? `Hi ${name.split(" ")[0]},` : "Hi there,";
  return `<!DOCTYPE html>
<html>
<body style="background:#060608;color:#e0e0e0;font-family:'DM Sans',Arial,sans-serif;margin:0;padding:40px 20px;">
  <div style="max-width:560px;margin:0 auto;">
    <div style="margin-bottom:32px;">
      <span style="font-size:22px;font-weight:800;color:#C8FF00;">PassGeni</span>
    </div>
    <h1 style="font-size:22px;font-weight:800;color:#fff;margin:0 0 8px;">
      PassGeni v2 is here.
    </h1>
    <p style="font-size:14px;color:#aaa;line-height:1.8;margin:0 0 8px;">${greeting}</p>
    <p style="font-size:14px;color:#aaa;line-height:1.8;margin:0 0 24px;">
      We've been building something significant. It's ready.
    </p>
    <div style="background:#0a0a0c;border:1px solid #1e1e1e;border-radius:12px;padding:24px;margin-bottom:24px;">
      <p style="font-size:14px;color:#e0e0e0;margin:0 0 12px;">
        ✓ <strong>Compliance Certificates</strong> — ES256-signed proof that your passwords meet
        NIST 800-63B, HIPAA, PCI-DSS, SOC 2, ISO 27001, and FIPS 140-3
      </p>
      <p style="font-size:14px;color:#e0e0e0;margin:0 0 12px;">
        ✓ <strong>Compliance Dashboard</strong> — monitor cert status, expiry, and risks at a glance
      </p>
      <p style="font-size:14px;color:#e0e0e0;margin:0 0 12px;">
        ✓ <strong>Team Workspaces</strong> — shared cert pool, org-level policy engine (Authority plan)
      </p>
      <p style="font-size:14px;color:#e0e0e0;margin:0;">
        ✓ <strong>14-day free trial</strong> — full Assurance plan, no card required
      </p>
    </div>
    <a href="${baseUrl}/dashboard"
       style="display:inline-block;background:#C8FF00;color:#000;font-weight:800;font-size:15px;padding:16px 32px;border-radius:8px;text-decoration:none;">
      Sign in to your dashboard →
    </a>
    <p style="font-size:12px;color:#555;margin-top:32px;line-height:1.6;">
      If you're on a free plan, your 14-day Assurance trial is waiting.<br>
      — The PassGeni team
    </p>
    <p style="font-size:11px;color:#333;margin-top:16px;">
      You're receiving this because you signed up at passgeni.ai.
    </p>
  </div>
</body>
</html>`;
}
