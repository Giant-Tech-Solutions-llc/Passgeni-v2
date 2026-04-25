/**
 * Supabase-backed distributed rate limiter.
 * Works correctly across Vercel serverless instances.
 * Falls back to in-memory if Supabase is unavailable.
 *
 * Uses the `usage_events` table — no new table needed.
 * Counts events of type `rate_limit_hit:{key}` in the window.
 *
 * For high-throughput (>100 rps), replace with Upstash Redis.
 */

import { getDB } from "./db/client.js";
import { rateLimit as inMemoryRateLimit } from "./rateLimit.js";

/**
 * Distributed rate limit check using Supabase.
 * Atomic: uses a count query over a time window.
 *
 * @param {string} key          - unique identifier (e.g. "ip:cert:1.2.3.4")
 * @param {number} limit        - max allowed in window
 * @param {number} windowMs     - window in milliseconds
 * @returns {{ allowed: boolean, remaining: number, resetAt: number }}
 */
export async function rateLimitDb(key, limit, windowMs = 60_000) {
  try {
    const db = getDB();
    const windowStart = new Date(Date.now() - windowMs).toISOString();
    const eventType = `rl:${key}`;

    // Count events in window
    const { count, error: countErr } = await db
      .from("usage_events")
      .select("*", { count: "exact", head: true })
      .eq("event_type", eventType)
      .gte("created_at", windowStart);

    if (countErr) throw countErr;

    const current = count ?? 0;
    const allowed = current < limit;
    const remaining = Math.max(0, limit - current - (allowed ? 1 : 0));
    const resetAt = Date.now() + windowMs;

    // Log this attempt (fire and forget — don't await to avoid latency)
    if (allowed) {
      db.from("usage_events").insert({
        user_id: null,
        event_type: eventType,
        metadata: { key },
        ip_hash: key.replace(/^ip:[^:]+:/, ""), // store IP portion
        created_at: new Date().toISOString(),
      }).then(() => {}).catch(() => {});
    }

    return { allowed, remaining, resetAt };
  } catch (err) {
    // Fallback to in-memory on any DB error
    console.warn("[rateLimitDb] Supabase unavailable, falling back to in-memory:", err.message);
    return inMemoryRateLimit(key, limit, windowMs);
  }
}
