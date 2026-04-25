/**
 * POST /api/nps
 *
 * Stores an NPS rating (0–10) in usage_events. Called after cert issuance.
 * Auth optional — anonymous ratings accepted but user_id attached when available.
 *
 * Body: { rating: number (0–10), cert_id?: string }
 * Returns: { ok: true }
 */
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth].js";
import { getDB } from "../../lib/db/client.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { rating, cert_id } = req.body ?? {};

  // NPS scale is 0–10 inclusive (standard Net Promoter Score)
  if (typeof rating !== "number" || !Number.isInteger(rating) || rating < 0 || rating > 10) {
    return res.status(400).json({ error: "rating must be an integer between 0 and 10." });
  }

  // Try to get session but don't require it (anonymous NPS is fine)
  let userId = null;
  try {
    const session = await getServerSession(req, res, authOptions);
    userId = session?.user?.id ?? null;
  } catch {}

  try {
    const db = getDB();

    // Prevent duplicate submissions for the same cert
    if (cert_id && userId) {
      const { count } = await db
        .from("usage_events")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("event_type", "nps_rating")
        .eq("metadata->>cert_id", cert_id);
      if ((count ?? 0) > 0) return res.status(200).json({ ok: true });
    }

    await db.from("usage_events").insert({
      user_id: userId,
      event_type: "nps_rating",
      metadata: { rating, ...(cert_id ? { cert_id } : {}) },
    });
  } catch (err) {
    // Non-critical — log but always return ok to avoid breaking the UX
    console.error("[nps] insert failed:", err?.message);
  }

  return res.status(200).json({ ok: true });
}
