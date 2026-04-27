// =============================================================
// PASSGENI — DUAL-AUTH MIDDLEWARE (W7)
// =============================================================
// resolveApiCaller() accepts either:
//   1. Session cookie  — browser / dashboard users
//   2. Bearer API key  — developer API (pk_live_...)
//
// Returns { userId, email, plan, source } or sends 401 and returns null.
// =============================================================

import { getToken }          from "next-auth/jwt";
import { validateUserApiKey } from "./db/client.js";
import { findCustomerByEmail } from "./db/client.js";

/**
 * Resolve the caller identity from either a session cookie or Bearer API key.
 *
 * @param {import('next').NextApiRequest}  req
 * @param {import('next').NextApiResponse} res
 * @returns {Promise<{userId:string, email:string, plan:string, source:'session'|'apikey'}|null>}
 */
export async function resolveApiCaller(req, res) {
  // ── 1. Bearer API key ─────────────────────────────────────
  const auth = req.headers.authorization ?? "";
  if (auth.startsWith("Bearer pk_live_")) {
    const rawKey = auth.slice("Bearer ".length).trim();
    let identity;
    try {
      identity = await validateUserApiKey(rawKey);
    } catch (err) {
      console.error("[apiAuth] validateUserApiKey error:", err?.message);
      res.status(500).json({ error: "Auth check failed" });
      return null;
    }

    if (!identity) {
      res.status(401).json({ error: "Invalid or revoked API key", code: "INVALID_API_KEY" });
      return null;
    }

    // Look up plan for rate-limiting and tier gates
    const customer = await findCustomerByEmail(identity.email).catch(() => null);
    const plan = customer?.plan ?? "free";

    return { userId: identity.userId, email: identity.email, plan, keyId: identity.keyId, scopes: identity.scopes, source: "apikey" };
  }

  // ── 2. Session cookie ─────────────────────────────────────
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    res.status(401).json({
      error: "Sign in to generate your certificate. It takes 30 seconds — no password needed.",
      fix: "Visit /auth/signin to sign in with your email.",
      code: "AUTH_REQUIRED",
    });
    return null;
  }

  const customer = await findCustomerByEmail(token.email).catch(() => null);
  const plan = customer?.plan ?? "free";

  return { userId: token.sub, email: token.email, plan, source: "session" };
}
