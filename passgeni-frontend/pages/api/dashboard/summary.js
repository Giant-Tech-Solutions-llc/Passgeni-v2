// =============================================================
// PASSGENI — DASHBOARD SUMMARY API  (Phase 6 — 30-day analytics)
// GET /api/dashboard/summary
// =============================================================
// Returns full dashboard state:
//   - Customer record + plan status
//   - All active API keys
//   - Usage today
//   - Usage history (last 30 days, all keys combined)
//   - Team members
// =============================================================

import { requireAuth } from "../../../lib/auth.js";
import { getDB }       from "../../../lib/db/client.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await requireAuth(req, res);
  if (!session) return;

  const customerId = session.user.customerId;

  if (!customerId) {
    return res.status(200).json({
      plan:        "free",
      planStatus:  "none",
      keys:        [],
      usageToday:  0,
      usageLimit:  50,
      usageWeek:   [],
      usageMonth:  [],
      teamMembers: [],
    });
  }

  try {
    const db    = getDB();
    const today = new Date().toISOString().split("T")[0];
    const ago7  = new Date(Date.now() -  7 * 86_400_000).toISOString().split("T")[0];
    const ago30 = new Date(Date.now() - 30 * 86_400_000).toISOString().split("T")[0];

    const [
      { data: customer,    error: e1 },
      { data: keys,        error: e2 },
      { data: teamMembers, error: e5 },
      { data: allKeyIds,   error: ekid },
    ] = await Promise.all([
      db.from("customers").select("*").eq("id", customerId).single(),

      db.from("api_keys")
        .select("id, key_prefix, label, is_active, last_used_at, created_at")
        .eq("customer_id", customerId)
        .eq("is_active", true)
        .order("created_at"),

      db.from("team_members")
        .select("*")
        .eq("customer_id", customerId)
        .order("invited_at"),

      // Fetch key IDs as plain array first (subquery builders not supported in .in())
      db.from("api_keys").select("id").eq("customer_id", customerId),
    ]);

    if (e1) throw e1;
    if (ekid) throw ekid;

    const keyIdArray = (allKeyIds || []).map((r) => r.id);

    const [
      { data: usageToday,   error: e3 },
      { data: usageHistory, error: e4 },
    ] = await Promise.all([
      keyIdArray.length
        ? db.from("usage_daily")
            .select("call_count, key_id")
            .eq("date", today)
            .in("key_id", keyIdArray)
        : Promise.resolve({ data: [], error: null }),

      keyIdArray.length
        ? db.from("usage_daily")
            .select("date, call_count")
            .gte("date", ago30)
            .in("key_id", keyIdArray)
            .order("date")
        : Promise.resolve({ data: [], error: null }),
    ]);

    const plan  = customer.plan       || "free";
    const limit = plan === "team" ? 5000 : 50;

    // Aggregate today
    const todayTotal = (usageToday || []).reduce((s, r) => s + (r.call_count || 0), 0);

    // Aggregate history by date
    const byDate = {};
    (usageHistory || []).forEach((row) => {
      byDate[row.date] = (byDate[row.date] || 0) + (row.call_count || 0);
    });

    // Fill in every calendar day so the chart has no gaps
    const filled = [];
    for (let d = 0; d < 30; d++) {
      const date = new Date(Date.now() - (29 - d) * 86_400_000)
        .toISOString().split("T")[0];
      filled.push({ date, total: byDate[date] || 0 });
    }

    // Last 7 days subset (for sparkline backward compat)
    const usageWeek = filled.slice(-7);

    // Summary stats
    const totalCalls = filled.reduce((s, r) => s + r.total, 0);
    const peakDay    = filled.reduce((a, b) => b.total > a.total ? b : a, { date: "", total: 0 });
    const avgDaily   = totalCalls > 0 ? Math.round(totalCalls / 30) : 0;

    return res.status(200).json({
      plan,
      planStatus:       customer.plan_status,
      trialEnd:         customer.trial_end,
      periodEnd:        customer.current_period_end,
      email:            customer.email,
      name:             customer.name,
      paddleCustomerId: customer.paddle_customer_id,
      keys:             keys        || [],
      usageToday:       todayTotal,
      usageLimit:       limit,
      usageWeek,                          // last 7 days (sparkline)
      usageMonth:       filled,           // last 30 days (chart)
      stats: {
        totalCalls30d:  totalCalls,
        peakDay:        peakDay.date,
        peakCalls:      peakDay.total,
        avgDaily,
        utilisation:    limit > 0 ? Math.round((todayTotal / limit) * 100) : 0,
      },
      teamMembers:      teamMembers || [],
    });

  } catch (err) {
    console.error("Dashboard summary error:", err);
    return res.status(500).json({ error: "Failed to load dashboard data" });
  }
}
