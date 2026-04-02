// =============================================================================
// PASSGENI — CUSTOM NEXTAUTH SUPABASE ADAPTER
// =============================================================================
// NextAuth EmailProvider requires a database adapter to persist verification
// tokens between when the magic-link email is sent and when the user clicks it.
// Without an adapter, sign-in always fails on serverless (Vercel).
//
// This minimal adapter implements only what EmailProvider + JWT sessions need:
//   - createVerificationToken / useVerificationToken (token storage)
//   - getUserByEmail / createUser / getUser / updateUser  (user identity)
//
// Tables required (run lib/db/schema.sql additions in Supabase SQL Editor):
//   nextauth_users      — maps email → UUID for NextAuth identity
//   verification_tokens — short-lived magic-link tokens
// =============================================================================

import { getDB } from "../db/client.js";

export function SupabaseAdapter() {
  return {
    // ── Token storage ─────────────────────────────────────────────────────────

    async createVerificationToken({ identifier, token, expires }) {
      const db = getDB();
      const { error } = await db.from("verification_tokens").insert({
        identifier,
        token,
        expires: expires instanceof Date ? expires.toISOString() : expires,
      });
      if (error) throw error;
      return { identifier, token, expires };
    },

    async useVerificationToken({ identifier, token }) {
      const db = getDB();
      // Delete the token so it can only be used once, and return it
      const { data, error } = await db
        .from("verification_tokens")
        .delete()
        .eq("identifier", identifier)
        .eq("token", token)
        .select()
        .single();
      if (error && error.code !== "PGRST116") throw error; // PGRST116 = not found
      if (!data) return null;
      return {
        identifier: data.identifier,
        token:      data.token,
        expires:    new Date(data.expires),
      };
    },

    // ── User identity ─────────────────────────────────────────────────────────

    async getUserByEmail(email) {
      const db = getDB();
      const { data, error } = await db
        .from("nextauth_users")
        .select("*")
        .eq("email", email.toLowerCase())
        .single();
      if (error && error.code !== "PGRST116") throw error;
      if (!data) return null;
      return mapUser(data);
    },

    async createUser({ email, emailVerified }) {
      const db = getDB();
      const { data, error } = await db
        .from("nextauth_users")
        .insert({
          email:          email.toLowerCase(),
          email_verified: emailVerified ? new Date(emailVerified).toISOString() : null,
        })
        .select()
        .single();
      if (error) throw error;
      return mapUser(data);
    },

    async getUser(id) {
      const db = getDB();
      const { data, error } = await db
        .from("nextauth_users")
        .select("*")
        .eq("id", id)
        .single();
      if (error && error.code !== "PGRST116") throw error;
      if (!data) return null;
      return mapUser(data);
    },

    async updateUser({ id, ...fields }) {
      const db     = getDB();
      const update = {};
      if (fields.email)              update.email          = fields.email.toLowerCase();
      if (fields.emailVerified !== undefined)
        update.email_verified = fields.emailVerified
          ? new Date(fields.emailVerified).toISOString()
          : null;
      const { data, error } = await db
        .from("nextauth_users")
        .update(update)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return mapUser(data);
    },

    // ── Stubs required by adapter interface (unused with JWT + EmailProvider) ─

    async linkAccount()         { return null; },
    async createSession()       { return null; },
    async getSessionAndUser()   { return null; },
    async updateSession()       { return null; },
    async deleteSession()       {},
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function mapUser(row) {
  return {
    id:            row.id,
    email:         row.email,
    emailVerified: row.email_verified ? new Date(row.email_verified) : null,
  };
}
