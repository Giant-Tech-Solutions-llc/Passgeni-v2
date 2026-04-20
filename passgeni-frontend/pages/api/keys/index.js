/**
 * GET  /api/keys        — list caller's API keys
 * POST /api/keys        — create a new API key
 * DELETE /api/keys?id=  — revoke a key by ID
 *
 * Requires session cookie (browser) or Bearer pk_live_* (not supported
 * for key management — session only for security).
 */

import { getToken }        from "next-auth/jwt";
import { generateApiKey }  from "../../../lib/apiKeys.js";
import {
  createUserApiKey,
  listUserApiKeys,
  revokeUserApiKey,
} from "../../../lib/db/client.js";

const MAX_KEYS = 5;

async function requireSession(req, res) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    res.status(401).json({ error: "Sign in to manage API keys" });
    return null;
  }
  return token;
}

export default async function handler(req, res) {
  // ── GET — list keys ──────────────────────────────────────
  if (req.method === "GET") {
    const token = await requireSession(req, res);
    if (!token) return;

    try {
      const keys = await listUserApiKeys(token.sub);
      return res.status(200).json({ keys });
    } catch (err) {
      console.error("[keys] list error:", err?.message);
      return res.status(500).json({ error: "Failed to list keys" });
    }
  }

  // ── POST — create key ────────────────────────────────────
  if (req.method === "POST") {
    const token = await requireSession(req, res);
    if (!token) return;

    const { name, scopes } = req.body ?? {};
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({ error: "Key name is required" });
    }

    try {
      const existing = await listUserApiKeys(token.sub);
      if (existing.length >= MAX_KEYS) {
        return res.status(400).json({
          error: `Maximum ${MAX_KEYS} active keys allowed. Revoke an existing key first.`,
          code: "MAX_KEYS_REACHED",
        });
      }

      const { raw, hash, prefix } = generateApiKey("live");
      const key = await createUserApiKey({
        userId:    token.sub,
        name:      name.trim().slice(0, 64),
        keyHash:   hash,
        keyPrefix: prefix,
        scopes:    Array.isArray(scopes) ? scopes : ["generate", "certify", "read"],
      });

      // Return raw key ONCE — never stored, never shown again
      return res.status(201).json({
        id:         key.id,
        name:       key.name,
        key:        raw,       // only returned on creation
        key_prefix: key.key_prefix,
        scopes:     key.scopes,
        created_at: key.created_at,
      });
    } catch (err) {
      console.error("[keys] create error:", err?.message);
      return res.status(500).json({ error: "Failed to create key" });
    }
  }

  // ── DELETE — revoke key ──────────────────────────────────
  if (req.method === "DELETE") {
    const token = await requireSession(req, res);
    if (!token) return;

    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "Key ID is required" });

    try {
      await revokeUserApiKey(id, token.sub);
      return res.status(200).json({ revoked: true });
    } catch (err) {
      console.error("[keys] revoke error:", err?.message);
      return res.status(500).json({ error: "Failed to revoke key" });
    }
  }

  return res.status(405).end();
}
