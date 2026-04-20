/**
 * lib/usageEvents.js — Usage event logging and anomaly detection
 * Fire-and-forget logging to the usage_events table.
 * Never await logEvent in request handlers — it must not add latency.
 */

import { getDB } from "./db/client.js";
import { createHash } from "crypto";

export const EVENT_TYPES = {
  CERT_GENERATED:      "cert_generated",
  CERT_VIEWED:         "cert_viewed",
  CERT_REVOKED:        "cert_revoked",
  API_KEY_CREATED:     "api_key_created",
  API_KEY_REVOKED:     "api_key_revoked",
  TEAM_INVITE_SENT:    "team_invite_sent",
  TEAM_MEMBER_ADDED:   "team_member_added",
  TEAM_MEMBER_REMOVED: "team_member_removed",
  RATE_LIMIT_HIT:      "rate_limit_hit",
  ANOMALY_DETECTED:    "anomaly_detected",
};

/**
 * Log a usage event. Fire-and-forget — never await this in request handlers.
 */
export function logEvent(userId, eventType, metadata = {}, ipAddress = null) {
  const db = getDB();
  const ipHash = ipAddress
    ? createHash("sha256")
        .update(ipAddress + (process.env.NEXTAUTH_SECRET ?? ""))
        .digest("hex")
        .slice(0, 16)
    : null;

  db.from("usage_events")
    .insert({
      user_id:    userId || null,
      event_type: eventType,
      metadata,
      ip_hash:    ipHash,
    })
    .then(({ error }) => {
      if (error) console.error("[usage_events] insert error:", error.message);
    });
}

/**
 * Check if a user has exceeded the anomaly threshold for cert generation.
 * Returns { anomaly: boolean, count: number }
 */
export async function checkAnomalyThreshold(userId, threshold = 50) {
  if (!userId) return { anomaly: false, count: 0 };

  const db = getDB();
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { count, error } = await db
    .from("usage_events")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("event_type", EVENT_TYPES.CERT_GENERATED)
    .gte("created_at", since);

  if (error) return { anomaly: false, count: 0 };

  const anomaly = count >= threshold;

  if (anomaly) {
    logEvent(userId, EVENT_TYPES.ANOMALY_DETECTED, {
      trigger:   "cert_volume",
      count,
      threshold,
      window:    "24h",
    });
  }

  return { anomaly, count: count ?? 0 };
}
