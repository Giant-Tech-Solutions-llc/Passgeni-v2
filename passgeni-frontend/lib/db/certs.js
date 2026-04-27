/**
 * lib/db/certs.js — Certificate database operations
 * Server-side only — never import in browser code.
 */

import { getDB } from "./client.js";
import crypto from "crypto";

/* ─── Create ─────────────────────────────────────────────────────────────── */
export async function createCertificate({ id, user_id, email, compliance_standard, generation_params, entropy_bits, char_pool_size, standards_met, jwt_token, expires_at }) {
  const db = getDB();
  const { data, error } = await db
    .from("certificates")
    .insert({
      id,
      user_id,
      email,
      compliance_standard,
      generation_params,
      entropy_bits,
      char_pool_size,
      standards_met,
      jwt_token,
      expires_at,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/* ─── Read ───────────────────────────────────────────────────────────────── */
export async function getCertificate(id) {
  const db = getDB();
  const { data, error } = await db
    .from("certificates")
    .select("id, user_id, email, compliance_standard, generation_params, entropy_bits, char_pool_size, standards_met, jwt_token, created_at, expires_at, is_revoked, revoked_at")
    .eq("id", id)
    .single();

  if (error && error.code === "PGRST116") return null; // not found
  if (error) throw error;
  return data;
}

export async function getCertificatesByUser(userId, { limit = 20, offset = 0, standard, date_from, date_to, status } = {}) {
  const db = getDB();
  let query = db
    .from("certificates")
    .select("id, compliance_standard, entropy_bits, standards_met, created_at, expires_at, is_revoked", { count: "exact" })
    .eq("user_id", userId);

  if (standard)              query = query.eq("compliance_standard", standard.toUpperCase());
  if (date_from)             query = query.gte("created_at", date_from);
  if (date_to)               query = query.lte("created_at", date_to);
  if (status === "revoked")  query = query.eq("is_revoked", true);
  if (status === "valid")    query = query.eq("is_revoked", false).gt("expires_at", new Date().toISOString());
  if (status === "expired")  query = query.eq("is_revoked", false).lte("expires_at", new Date().toISOString());

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return { certs: data ?? [], total: count ?? 0 };
}

/* ─── Monthly count (free tier gating) ──────────────────────────────────── */
export async function getMonthlyCount(userId) {
  const db = getDB();
  const { count, error } = await db
    .from("certificates")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("is_revoked", false)
    .gte("created_at", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());

  if (error) throw error;
  return count ?? 0;
}

/* ─── Revoke ─────────────────────────────────────────────────────────────── */
export async function revokeCertificate(id, userId) {
  const db = getDB();
  const { data, error } = await db
    .from("certificates")
    .update({ is_revoked: true, revoked_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", userId)      // owner-only
    .select()
    .single();

  if (error) throw error;
  return data;
}

/* ─── View logging ───────────────────────────────────────────────────────── */
export function logCertView(certId, rawIp) {
  // Fire-and-forget — don't block the response
  const ipHash = rawIp
    ? crypto.createHash("sha256").update(rawIp).digest("hex")
    : null;

  getDB()
    .from("cert_views")
    .insert({ cert_id: certId, viewer_ip_hash: ipHash })
    .then(() => {})
    .catch(() => {});
}
