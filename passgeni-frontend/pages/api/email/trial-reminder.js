// =============================================================
// PASSGENI — TRIAL REMINDER  (pages/api/email/trial-reminder.js)
// POST /api/email/trial-reminder
// =============================================================
// Called by a cron job (Vercel Cron or external scheduler)
// to notify customers whose trial ends in exactly 3 days.
//
// Also handles Paddle's subscription.trialing webhook event
// (fires when trial is active, 3 days before end).
//
// Auth: INTERNAL_SECRET header
// =============================================================

import { sendEmail }        from "../../../lib/email/send.js";
import { teamTrialReminder } from "../../../lib/email/templates.js";
import { getDB }            from "../../../lib/db/client.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const secret = req.headers["x-internal-secret"];
  if (secret !== process.env.INTERNAL_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Mode 1: explicit email + days from Paddle webhook forwarding
  if (req.body?.email && req.body?.daysRemaining) {
    const { email, daysRemaining } = req.body;
    const tmpl = teamTrialReminder(email, daysRemaining);
    const { ok } = await sendEmail({ to: email, ...tmpl });
    return res.status(ok ? 200 : 500).json({ ok });
  }

  // Mode 2: cron — find all customers whose trial ends in 3 days
  try {
    const db  = getDB();
    const now = new Date();
    const in3  = new Date(now.getTime() + 3 * 86_400_000);
    const in4  = new Date(now.getTime() + 4 * 86_400_000);

    const { data: customers, error } = await db
      .from("customers")
      .select("id, email, trial_end, plan_status")
      .eq("plan_status", "trialing")
      .gte("trial_end", in3.toISOString())
      .lt("trial_end",  in4.toISOString());

    if (error) throw error;

    const results = await Promise.allSettled(
      (customers || []).map(async (c) => {
        const tmpl = teamTrialReminder(c.email, 3);
        return sendEmail({ to: c.email, ...tmpl });
      })
    );

    const sent   = results.filter((r) => r.status === "fulfilled" && r.value?.ok).length;
    const failed = results.length - sent;

    return res.status(200).json({ processed: results.length, sent, failed });
  } catch (err) {
    console.error("Trial reminder cron error:", err);
    return res.status(500).json({ error: err.message });
  }
}
