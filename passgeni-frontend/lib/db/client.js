// =============================================================
// PASSGENI — SUPABASE CLIENT
// =============================================================
// Single import point for the Supabase client.
// Uses the SERVICE ROLE key — never expose to the browser.
// All database access is server-side only (API routes, webhooks).
//
// Environment variables required:
//   SUPABASE_URL          — https://xxxx.supabase.co
//   SUPABASE_SERVICE_KEY  — service_role key (never the anon key)
// =============================================================

import { createClient } from "@supabase/supabase-js";

let _db = null;

/**
 * Returns the Supabase service-role client.
 * Lazy-initialised. Throws if env vars are missing.
 * Call this only from server-side code (API routes, getServerSideProps).
 */
export function getDB() {
  if (_db) return _db;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables. " +
      "Add them to .env.local and Vercel dashboard."
    );
  }

  _db = createClient(url, key, {
    auth: {
      // Service role never uses cookies or sessions
      persistSession:    false,
      autoRefreshToken:  false,
      detectSessionInUrl: false,
    },
  });

  return _db;
}

// ─── TYPED QUERY HELPERS ──────────────────────────────────────
// Thin wrappers so callers don't repeat table names.
// All throw on unexpected DB errors.

/**
 * Find a customer by Paddle customer ID.
 * @param {string} paddleCustomerId
 * @returns {Promise<Object|null>}
 */
export async function findCustomerByPaddleId(paddleCustomerId) {
  const db = getDB();
  const { data, error } = await db
    .from("customers")
    .select("*")
    .eq("paddle_customer_id", paddleCustomerId)
    .single();
  if (error && error.code !== "PGRST116") throw error;
  return data || null;
}

/**
 * Find a customer by email.
 * @param {string} email
 * @returns {Promise<Object|null>}
 */
export async function findCustomerByEmail(email) {
  const db = getDB();
  const { data, error } = await db
    .from("customers")
    .select("*")
    .eq("email", email.toLowerCase())
    .single();
  if (error && error.code !== "PGRST116") throw error;
  return data || null;
}

/**
 * Upsert a customer by email (used when provisioning a new subscription).
 * Creates a new customer or updates an existing one with the same email.
 */
export async function upsertCustomerByEmail(fields) {
  const db = getDB();
  const { data, error } = await db
    .from("customers")
    .upsert(fields, { onConflict: "email" })
    .select()
    .single();
  if (error) throw error;
  return data;
}

/**
 * Update an existing customer record by Paddle customer ID.
 * Used for subscription.updated / subscription.canceled / payment_failed.
 */
export async function updateCustomerByPaddleId(paddleCustomerId, fields) {
  const db = getDB();
  const { data, error } = await db
    .from("customers")
    .update(fields)
    .eq("paddle_customer_id", paddleCustomerId)
    .select()
    .single();
  if (error && error.code !== "PGRST116") throw error;
  return data || null;
}

/**
 * Validate an API key and return the customer + key record.
 * Returns null if the key doesn't exist or is inactive.
 *
 * @param {string} rawKey - The full pg_live_... key from the request
 * @returns {Promise<{customer, apiKey}|null>}
 */
export async function validateAndFetchKey(rawKey) {
  if (!rawKey || !rawKey.startsWith("pg_")) return null;

  const { hashApiKey } = await import("../apiKeys.js");
  const hash = hashApiKey(rawKey);

  const db = getDB();
  const { data, error } = await db
    .from("api_keys")
    .select("*, customers(*)")
    .eq("key_hash", hash)
    .eq("is_active", true)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  if (!data) return null;

  // Check the customer's subscription is still active
  const validStatuses = ["active", "trialing"];
  if (!validStatuses.includes(data.customers.plan_status)) return null;

  return { customer: data.customers, apiKey: data };
}

/**
 * Insert an API key record for a customer.
 */
export async function createApiKey({ customerId, keyHash, keyPrefix, label }) {
  const db = getDB();
  const { data, error } = await db
    .from("api_keys")
    .insert({ customer_id: customerId, key_hash: keyHash, key_prefix: keyPrefix, label: label || "Default" })
    .select()
    .single();
  if (error) throw error;
  return data;
}

/**
 * Deactivate all API keys for a customer (on subscription cancel).
 */
export async function deactivateCustomerKeys(customerId) {
  const db = getDB();
  const { error } = await db
    .from("api_keys")
    .update({ is_active: false, rotated_at: new Date().toISOString() })
    .eq("customer_id", customerId);
  if (error) throw error;
}

/**
 * Get today's usage count for an API key.
 * Returns 0 if no record exists yet.
 */
export async function getDailyUsage(keyId) {
  const db   = getDB();
  const today = new Date().toISOString().split("T")[0];
  const { data, error } = await db
    .from("usage_daily")
    .select("call_count")
    .eq("key_id", keyId)
    .eq("date", today)
    .single();
  if (error && error.code !== "PGRST116") throw error;
  return data?.call_count || 0;
}

/**
 * Atomically increment the daily usage counter.
 * Uses upsert with increment logic.
 * Returns the new count.
 */
export async function incrementDailyUsage(keyId) {
  const db    = getDB();
  const today = new Date().toISOString().split("T")[0];

  // Upsert: insert with count=1, or increment if row exists
  const { data, error } = await db.rpc("increment_usage", {
    p_key_id: keyId,
    p_date:   today,
  });
  if (error) {
    // Fallback if RPC not set up: manual upsert
    const { data: upserted, error: upsertErr } = await db
      .from("usage_daily")
      .upsert(
        { key_id: keyId, date: today, call_count: 1 },
        { onConflict: "key_id,date", ignoreDuplicates: false }
      )
      .select("call_count")
      .single();
    if (upsertErr) throw upsertErr;
    return upserted.call_count;
  }
  return data;
}

/**
 * Log a single API call.
 */
export async function logApiCall({ keyId, customerId, params, responseMs, status }) {
  const db = getDB();
  // Hash the IP for privacy before storing
  const { createHash } = await import("crypto");
  const ipHash = params.ip ? createHash("sha256").update(params.ip).digest("hex").slice(0, 16) : null;

  const { error } = await db.from("usage_logs").insert({
    key_id:      keyId,
    customer_id: customerId,
    ip_hash:     ipHash,
    profession:  params.profession || null,
    compliance:  params.compliance || null,
    length:      params.length     || null,
    count:       params.count      || null,
    mode:        params.mode       || null,
    response_ms: responseMs        || null,
    status:      status            || "ok",
  });
  if (error) console.error("Failed to log API call:", error); // non-fatal
}

/**
 * Get the last 7 days of usage for a customer's keys.
 */
export async function getUsageHistory(customerId, days = 7) {
  const db  = getDB();
  const ago = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const { data: keyRows, error: keyErr } = await db
    .from("api_keys")
    .select("id")
    .eq("customer_id", customerId);
  if (keyErr) throw keyErr;

  const keyIds = (keyRows || []).map((r) => r.id);
  if (!keyIds.length) return [];

  const { data, error } = await db
    .from("usage_daily")
    .select("date, call_count, key_id, api_keys(key_prefix, label)")
    .gte("date", ago)
    .in("key_id", keyIds)
    .order("date", { ascending: true });
  if (error) throw error;
  return data || [];
}

/**
 * Get all API keys for a customer.
 */
export async function getCustomerKeys(customerId) {
  const db = getDB();
  const { data, error } = await db
    .from("api_keys")
    .select("*")
    .eq("customer_id", customerId)
    .eq("is_active", true)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data || [];
}

/**
 * Get team members for a customer.
 */
export async function getTeamMembers(customerId) {
  const db = getDB();
  const { data, error } = await db
    .from("team_members")
    .select("*")
    .eq("customer_id", customerId)
    .order("invited_at", { ascending: true });
  if (error) throw error;
  return data || [];
}

/**
 * Add (or re-invite) a team member. Upserts on (customer_id, email).
 */
export async function addTeamMember(customerId, email, name) {
  const db = getDB();
  const { data, error } = await db
    .from("team_members")
    .upsert(
      { customer_id: customerId, email: email.toLowerCase(), name: name || null, status: "pending", role: "member", invited_at: new Date().toISOString() },
      { onConflict: "customer_id,email" }
    )
    .select()
    .single();
  if (error) throw error;
  return data;
}

/**
 * Mark a team member as active (accepted their invite).
 */
export async function activateTeamMember(customerId, email) {
  const db = getDB();
  const { data, error } = await db
    .from("team_members")
    .update({ status: "active", accepted_at: new Date().toISOString() })
    .eq("customer_id", customerId)
    .eq("email", email.toLowerCase())
    .select()
    .single();
  if (error && error.code !== "PGRST116") throw error;
  return data || null;
}

/**
 * Remove a team member (soft-delete: status = removed).
 */
export async function removeTeamMember(memberId, customerId) {
  const db = getDB();
  const { error } = await db
    .from("team_members")
    .update({ status: "removed" })
    .eq("id", memberId)
    .eq("customer_id", customerId);
  if (error) throw error;
}

/**
 * Update a team member's role.
 */
export async function updateTeamMemberRole(memberId, customerId, role) {
  const db = getDB();
  const { data, error } = await db
    .from("team_members")
    .update({ role })
    .eq("id", memberId)
    .eq("customer_id", customerId)
    .select()
    .single();
  if (error && error.code !== "PGRST116") throw error;
  return data || null;
}

/**
 * Set (or clear) the org compliance policy for a customer.
 * Pass null to clear.
 */
export async function setTeamPolicy(customerId, standard) {
  const db = getDB();
  const { data, error } = await db
    .from("customers")
    .update({ team_policy_standard: standard || null })
    .eq("id", customerId)
    .select("team_policy_standard")
    .single();
  if (error) throw error;
  return data;
}

// ─── USER API KEYS (W7 developer API) ─────────────────────────
// Separate from the billing-tier api_keys table.
// Keyed by nextauth_users.id (identity), not customers.id (billing).

export async function createUserApiKey({ userId, name, keyHash, keyPrefix, scopes }) {
  const db = getDB();
  const { data, error } = await db
    .from("user_api_keys")
    .insert({ user_id: userId, name, key_hash: keyHash, key_prefix: keyPrefix, scopes: scopes || ["generate", "certify", "read"] })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function listUserApiKeys(userId) {
  const db = getDB();
  const { data, error } = await db
    .from("user_api_keys")
    .select("id, name, key_prefix, scopes, last_used_at, created_at, is_active")
    .eq("user_id", userId)
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function revokeUserApiKey(keyId, userId) {
  const db = getDB();
  const { error } = await db
    .from("user_api_keys")
    .update({ is_active: false })
    .eq("id", keyId)
    .eq("user_id", userId);
  if (error) throw error;
}

export async function validateUserApiKey(rawKey) {
  if (!rawKey || !rawKey.startsWith("pk_live_")) return null;
  const { createHash } = await import("crypto");
  const hash = createHash("sha256").update(rawKey).digest("hex");
  const db = getDB();
  const { data, error } = await db
    .from("user_api_keys")
    .select("*, nextauth_users!inner(id, email)")
    .eq("key_hash", hash)
    .eq("is_active", true)
    .single();
  if (error && error.code !== "PGRST116") throw error;
  if (!data) return null;
  // Update last_used_at (fire and forget)
  db.from("user_api_keys").update({ last_used_at: new Date().toISOString() }).eq("id", data.id).then(() => {}).catch(() => {});
  return { userId: data.nextauth_users.id, email: data.nextauth_users.email, keyId: data.id, scopes: data.scopes };
}

/**
 * Get all nextauth_users.id values for active team members of a customer.
 * Used to query certificates across a whole team.
 */
export async function getTeamUserIds(customerId) {
  const db = getDB();
  const { data: members, error: mErr } = await db
    .from("team_members")
    .select("email")
    .eq("customer_id", customerId)
    .eq("status", "active");
  if (mErr) throw mErr;
  if (!members || members.length === 0) return [];

  const emails = members.map((m) => m.email.toLowerCase());
  const { data: users, error: uErr } = await db
    .from("nextauth_users")
    .select("id")
    .in("email", emails);
  if (uErr) throw uErr;
  return (users || []).map((u) => u.id);
}
