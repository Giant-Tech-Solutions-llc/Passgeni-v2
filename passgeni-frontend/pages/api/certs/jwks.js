/**
 * GET /api/certs/jwks
 *
 * Returns the JWKS (JSON Web Key Set) containing the ES256 public key
 * used to sign PassGeni compliance certificates.
 *
 * Auditors can use this to verify certificate signatures offline:
 *   const jwks = await fetch('https://passgeni.ai/api/certs/jwks').then(r => r.json())
 *
 * Add a rewrite in next.config.js to also serve at /.well-known/jwks.json:
 *   { source: '/.well-known/jwks.json', destination: '/api/certs/jwks' }
 */

import { getJWKS } from "../../../lib/certs.js";

export default function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const jwks = getJWKS();
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.setHeader("Content-Type", "application/json");
  return res.status(200).json(jwks);
}
