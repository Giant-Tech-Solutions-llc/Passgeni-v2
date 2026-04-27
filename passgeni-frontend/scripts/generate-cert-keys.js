#!/usr/bin/env node
/**
 * scripts/generate-cert-keys.js
 *
 * Run ONCE to generate the ES256 key pair for certificate signing.
 * Copy the output into Railway (staging) and Vercel (production) environment variables.
 *
 *   node scripts/generate-cert-keys.js
 */

const crypto = require("crypto");

const { privateKey, publicKey } = crypto.generateKeyPairSync("ec", {
  namedCurve: "prime256v1",         // P-256, required for ES256
  publicKeyEncoding:  { type: "spki",  format: "pem" },
  privateKeyEncoding: { type: "sec1", format: "pem" },
});

const sessionSecret = crypto.randomBytes(32).toString("hex");

// Collapse PEM line breaks to \n literal so the key fits on one env-var line
const collapse = (pem) => pem.replace(/\n/g, "\\n");

console.log("\n=== PassGeni Certificate Keys ===\n");
console.log("Add these to Railway (staging) and Vercel (production) environment variables:\n");
console.log(`CERT_PRIVATE_KEY="${collapse(privateKey)}"`);
console.log(`CERT_PUBLIC_KEY="${collapse(publicKey)}"`);
console.log(`CERT_SESSION_SECRET="${sessionSecret}"`);
console.log("\n=== Public key (for passgeni.ai/.well-known — commit this) ===\n");
console.log(publicKey);
