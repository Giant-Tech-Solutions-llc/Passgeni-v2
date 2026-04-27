/**
 * GET /api/.well-known/jwks.json
 *
 * Publishes PassGeni's ES256 public key for offline certificate verification.
 * Standard JWKS format — compatible with jose, jsonwebtoken, and audit tools.
 *
 * Also served at /.well-known/jwks.json via next.config.js rewrite.
 * And at /api/certs/jwks for backwards compatibility.
 */

import { getJWKS } from "../../../lib/certs.js";

export default function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  // Prefer JWK-format env var if set, fall back to existing PEM-derived JWKS
  let jwks;
  if (process.env.CERT_PUBLIC_KEY_JWK) {
    try {
      const publicKeyJwk = JSON.parse(process.env.CERT_PUBLIC_KEY_JWK);
      jwks = {
        keys: [
          {
            ...publicKeyJwk,
            use: "sig",
            alg: "ES256",
            kid: "passgeni-cert-v1",
          },
        ],
      };
    } catch {
      jwks = getJWKS();
    }
  } else {
    jwks = getJWKS();
  }

  if (!jwks.keys.length) {
    return res.status(503).json({ error: "Public key not configured" });
  }

  res.setHeader("Cache-Control", "public, max-age=3600");
  res.setHeader("Content-Type", "application/json");
  return res.status(200).json(jwks);
}
