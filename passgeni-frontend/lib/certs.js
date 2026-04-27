/**
 * lib/certs.js — Certificate engine core
 *
 * Handles:
 *  - Compliance rule validation
 *  - HMAC-SHA256 generation session tokens (server-issued, prevents external certs)
 *  - ES256 JWT certificate signing + verification
 *  - JWKS public-key export
 */

import crypto from "crypto";

/* ─── base64url helpers ────────────────────────────────────────────────────── */
const b64u = (buf) => Buffer.from(buf).toString("base64url");
const fromb64u = (str) => Buffer.from(str, "base64url");

/* ─── Session tokens (HMAC-HS256) ────────────────────────────────────────── */
const SESSION_TTL = 10 * 60; // 10 minutes

export function issueSessionToken(params) {
  const secret = process.env.CERT_SESSION_SECRET;
  if (!secret) throw new Error("CERT_SESSION_SECRET is not configured");

  const payload = {
    ...params,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL,
  };
  const header = b64u(JSON.stringify({ alg: "HS256", typ: "session" }));
  const body = b64u(JSON.stringify(payload));
  const signingInput = `${header}.${body}`;
  const sig = crypto
    .createHmac("sha256", secret)
    .update(signingInput)
    .digest();
  return `${signingInput}.${b64u(sig)}`;
}

export function verifySessionToken(token) {
  const secret = process.env.CERT_SESSION_SECRET;
  if (!secret) throw new Error("CERT_SESSION_SECRET is not configured");

  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Malformed session token");
  const [header, body, sig] = parts;
  const signingInput = `${header}.${body}`;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(signingInput)
    .digest();
  const actual = fromb64u(sig);

  if (expected.length !== actual.length || !crypto.timingSafeEqual(expected, actual))
    throw new Error("Invalid session token signature");

  const payload = JSON.parse(fromb64u(body).toString());
  if (payload.exp < Math.floor(Date.now() / 1000))
    throw new Error("Session token expired");

  return payload;
}

/* ─── ES256 Certificate JWTs ─────────────────────────────────────────────── */
const CERT_KID = "passgeni-cert-key-1";

export function signCertJWT(payload) {
  const privKey = process.env.CERT_PRIVATE_KEY;
  if (!privKey) throw new Error("CERT_PRIVATE_KEY is not configured");

  // PEM may be stored with literal \n — normalise them
  const pem = privKey.replace(/\\n/g, "\n");

  const header = b64u(JSON.stringify({ alg: "ES256", typ: "JWT", kid: CERT_KID }));
  const body = b64u(JSON.stringify(payload));
  const signingInput = `${header}.${body}`;

  const sign = crypto.createSign("SHA256");
  sign.update(signingInput);
  // ieee-p1363 = raw R+S bytes (required for JWT ES256)
  const sig = sign.sign({ key: pem, dsaEncoding: "ieee-p1363" });
  return `${signingInput}.${b64u(sig)}`;
}

export function verifyCertJWT(token) {
  const pubKey = process.env.CERT_PUBLIC_KEY;
  if (!pubKey) throw new Error("CERT_PUBLIC_KEY is not configured");

  const pem = pubKey.replace(/\\n/g, "\n");
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Malformed JWT");
  const [header, body, sig] = parts;
  const signingInput = `${header}.${body}`;

  const verify = crypto.createVerify("SHA256");
  verify.update(signingInput);
  const valid = verify.verify(
    { key: pem, dsaEncoding: "ieee-p1363" },
    fromb64u(sig)
  );
  if (!valid) throw new Error("Invalid certificate signature");

  return JSON.parse(fromb64u(body).toString());
}

/** Returns a JWK Set containing the public key — used at /api/certs/jwks */
export function getJWKS() {
  const pubKey = process.env.CERT_PUBLIC_KEY;
  if (!pubKey) return { keys: [] };

  const pem = pubKey.replace(/\\n/g, "\n");
  const keyObj = crypto.createPublicKey({ key: pem, format: "pem" });
  const jwk = keyObj.export({ format: "jwk" });

  return {
    keys: [
      {
        ...jwk,
        alg: "ES256",
        use: "sig",
        kid: CERT_KID,
      },
    ],
  };
}

