// =============================================================
// PASSGENI — GUIDE CONTENT
// what-is-a-compliance-certificate
// =============================================================

export const toc = [
  { id: "the-audit-problem",        title: "The audit evidence problem"               },
  { id: "what-it-is",               title: "What a compliance certificate is"         },
  { id: "certificate-content",      title: "What the certificate contains"            },
  { id: "how-it-works",             title: "How PassGeni certificates work"           },
  { id: "zero-knowledge-vs-certified", title: "Zero-knowledge vs certified mode"      },
  { id: "how-to-verify",            title: "How auditors verify certificates"         },
  { id: "use-cases",                title: "Who needs compliance certificates"        },
  { id: "standards-coverage",       title: "Standards covered"                        },
  { id: "revocation",               title: "Revocation and expiry"                    },
];

export const contentHtml = `
<h2 id="the-audit-problem">The audit evidence problem</h2>
<p>Every SOC 2 audit, HIPAA assessment, PCI-DSS review, and ISO 27001 certification includes a question that stumps most security teams:</p>
<p style="font-style:italic; color: #ccc; padding: 16px 20px; border-left: 2px solid #c8ff00; margin: 20px 0;">"How do you prove that your passwords were generated according to policy — not just that a policy exists?"</p>
<p>The honest answer, for most organisations, is: they can't. They have a written password policy. They may have Active Directory screenshots showing policy enforcement. But they have no cryptographic, tamper-evident, machine-readable record that any specific credential was generated to a specific compliance standard.</p>
<p>The workarounds are inadequate:</p>
<ul>
  <li><strong>Screenshots</strong> — not tamper-evident, point-in-time, manually alterable</li>
  <li><strong>Self-attestation</strong> — requires the auditor to trust the auditee</li>
  <li><strong>Policy documents</strong> — prove intent, not execution</li>
  <li><strong>Access logs</strong> — prove access patterns, not credential quality</li>
</ul>
<p>A password compliance certificate solves this. It is a signed, machine-readable, independently verifiable record that a specific credential was generated to a specific compliance standard at a specific point in time.</p>

<h2 id="what-it-is">What a compliance certificate is</h2>
<p>A password compliance certificate is a cryptographically signed document — specifically a JSON Web Token (JWT) signed using the ES256 algorithm (ECDSA with P-256 curve) — that records the compliance-relevant properties of a credential at the moment of generation.</p>
<p>It proves three things:</p>
<ol>
  <li><strong>The credential was machine-generated</strong> — not human-chosen, not manually typed, not taken from a previous generation</li>
  <li><strong>The generation used a validated entropy source</strong> — specifically <code>crypto.getRandomValues()</code>, which is FIPS 140-3 aligned</li>
  <li><strong>The generation parameters met the stated compliance standard</strong> — minimum length, character classes, entropy threshold, and other standard-specific requirements were all satisfied</li>
</ol>
<p>Critically: the certificate never contains the password itself. PassGeni's zero-knowledge architecture means the password is generated client-side in the user's browser and is never transmitted to any server. The certificate captures compliance properties without the sensitive secret.</p>

<div class="callout">
  <strong>A compliance certificate proves the generation process, not the credential output.</strong> This distinction is architecturally significant: it is how PassGeni can issue certificates without ever seeing your passwords.
</div>

<h2 id="certificate-content">What the certificate contains</h2>
<p>Every PassGeni compliance certificate is a JWT with a signed payload containing:</p>

<div class="req-row"><span class="req-label">compliance_standard</span><span class="req-value">The primary standard (e.g. HIPAA, PCI-DSS-v4, FIPS-140-3)</span></div>
<div class="req-row"><span class="req-label">standards_met</span><span class="req-value">All standards the credential satisfies (array — a 20-char FIPS cert also carries HIPAA, PCI-DSS, SOC2, ISO-27001, NIST)</span></div>
<div class="req-row"><span class="req-label">entropy_bits</span><span class="req-value">Calculated entropy of the generated credential (bits)</span></div>
<div class="req-row"><span class="req-label">char_pool_size</span><span class="req-value">Size of the character pool used in generation</span></div>
<div class="req-row"><span class="req-label">generation_params</span><span class="req-value">Length, has_upper, has_lower, has_numbers, has_special</span></div>
<div class="req-row"><span class="req-label">entropy_source</span><span class="req-value">crypto.getRandomValues (FIPS 140-3 aligned)</span></div>
<div class="req-row"><span class="req-label">iat</span><span class="req-value">Issue timestamp (Unix seconds)</span></div>
<div class="req-row"><span class="req-label">exp</span><span class="req-value">Expiry timestamp — default 1 year from issuance</span></div>
<div class="req-row"><span class="req-label">iss</span><span class="req-value">Issuer: passgeni.ai</span></div>
<div class="req-row"><span class="req-label">sub</span><span class="req-value">User ID of the certificate holder</span></div>
<div class="req-row"><span class="req-label">cert_version</span><span class="req-value">Certificate specification version (2.0)</span></div>

<p>The entire payload is signed with PassGeni's ES256 private key. The corresponding public key is published at <code>passgeni.ai/.well-known/jwks.json</code> per RFC 7517, enabling offline verification by any auditor.</p>

<h2 id="how-it-works">How PassGeni certificates work</h2>
<p>The certificate generation flow is designed to eliminate trust gaps:</p>
<ol>
  <li><strong>Password generated client-side</strong> — your browser calls <code>crypto.getRandomValues()</code>. The password never leaves your browser.</li>
  <li><strong>Parameters sent to server</strong> — only generation parameters (length, character classes, compliance standard, entropy target) are sent. Not the password.</li>
  <li><strong>Server validates parameters</strong> — PassGeni re-validates that the stated parameters actually meet the compliance standard. The server never trusts the client's compliance claims.</li>
  <li><strong>Server issues generation session token</strong> — a short-lived signed token (generation_session_id, expires in 60 seconds) proves the parameters were server-validated.</li>
  <li><strong>Certificate issued against session token</strong> — the certificate endpoint only accepts a valid generation_session_id. This architectural constraint prevents certifying externally-created passwords.</li>
  <li><strong>JWT signed and stored</strong> — PassGeni signs the certificate with its ES256 private key and stores the JWT in the certificates database. The password is never stored.</li>
  <li><strong>Certificate URL returned</strong> — you receive a public URL at <code>passgeni.ai/cert/[id]</code>. Share this with auditors.</li>
</ol>

<div class="callout warning">
  <strong>Why the generation session token matters:</strong> The token is the architectural boundary that makes certificates trustworthy. Without it, anyone could claim "I generated this password with FIPS parameters" without proof. The session token proves PassGeni validated the parameters before the certificate was issued.
</div>

<h2 id="zero-knowledge-vs-certified">Zero-knowledge vs certified mode</h2>
<p>PassGeni operates in two distinct modes, serving different use cases:</p>
<ul>
  <li><strong>Zero-knowledge mode (default)</strong> — Password generated entirely in your browser using <code>crypto.getRandomValues()</code>. No data leaves your browser. No server call. No record created. Zero possibility of server-side breach of your credentials. Use this for generating passwords you will store in a password manager without needing compliance evidence.</li>
  <li><strong>Certified mode</strong> — User requests a compliance certificate. The client sends only generation parameters (never the password) to the server. Server validates parameters, signs certificate, stores JWT. Compliance certificate URL is returned. Use this when you need audit evidence that a specific credential meets a specific standard.</li>
</ul>
<p>In both modes, passwords are never transmitted to or stored by PassGeni. The architectural difference is that certified mode creates a server-side record of generation parameters — not the credential itself. This distinction is mathematically enforced, not policy-based.</p>

<h2 id="how-to-verify">How auditors verify certificates</h2>
<p>Certificate verification requires no login, no PassGeni account, and no trust in PassGeni's infrastructure. Any party with basic security tooling can verify in under 60 seconds:</p>
<ol>
  <li><strong>Navigate to the certificate URL</strong> — <code>passgeni.ai/cert/[id]</code>. The certificate page shows compliance claims in human-readable form.</li>
  <li><strong>Verify the ES256 signature offline</strong> — fetch the JWT from the certificate page, use any JOSE library (<code>jose</code>, <code>python-jose</code>, <code>golang-jwt</code>), and verify against the public key at <code>passgeni.ai/.well-known/jwks.json</code>.</li>
  <li><strong>Confirm the claims</strong> — check <code>iss</code> is <code>passgeni.ai</code>, <code>exp</code> is in the future, <code>compliance_standard</code> matches the required framework, and <code>standards_met</code> includes all required standards.</li>
  <li><strong>Check revocation status</strong> — the certificate page at <code>passgeni.ai/cert/[id]</code> shows current validity including revocation. For audit-critical verification, online check is recommended over JWT-only verification.</li>
</ol>
<p>Verification confirms: the certificate is authentic (PassGeni signed it), the content is unaltered (signature is valid), and the claims are current (not expired, not revoked). This takes approximately 60 seconds and requires no special access to PassGeni systems.</p>

<h2 id="use-cases">Who needs compliance certificates</h2>
<p>Compliance certificates are most valuable for:</p>
<ul>
  <li><strong>Security engineers preparing audit evidence</strong> — SOC 2, HIPAA, PCI-DSS, ISO 27001 auditors ask for password control evidence. Certificates provide machine-readable proof that replaces manual documentation.</li>
  <li><strong>DevOps and SRE teams managing service accounts</strong> — service account credentials are the highest-risk credentials in any infrastructure. A certificate provides provenance documentation that can be stored alongside the credential in a secrets manager.</li>
  <li><strong>Enterprise CISOs building compliance programs</strong> — a certificate dashboard showing compliance coverage across all organisational credentials replaces spreadsheet-based tracking.</li>
  <li><strong>Healthcare IT teams under HIPAA</strong> — HIPAA §164.312 requires evidence of appropriate access controls. Compliance certificates document that credentials were generated to HIPAA-standard parameters.</li>
  <li><strong>Government contractors under FIPS 140-3 / CMMC</strong> — documented entropy source and provenance are explicit requirements. PassGeni certificates satisfy both.</li>
  <li><strong>SaaS companies pursuing SOC 2 Type II</strong> — Type II audits require evidence that controls operated consistently over time. A library of compliance certificates for all sensitive credentials demonstrates consistent enforcement.</li>
</ul>

<h2 id="standards-coverage">Standards covered</h2>
<p>PassGeni currently issues compliance certificates for six frameworks:</p>

<div class="req-row"><span class="req-label">NIST SP 800-63B</span><span class="req-value">8 chars · Length-primary · Breach checking</span></div>
<div class="req-row"><span class="req-label">HIPAA §164.312(d)</span><span class="req-value">12 chars · Upper + lower + digit + special</span></div>
<div class="req-row"><span class="req-label">PCI-DSS v4.0 Req 8.3</span><span class="req-value">12 chars · 3 of 4 char classes · Min 40 bits entropy</span></div>
<div class="req-row"><span class="req-label">SOC 2 CC6.1</span><span class="req-value">16 chars · Full complexity · Rotation policy evidence</span></div>
<div class="req-row"><span class="req-label">ISO/IEC 27001:2022 A.9</span><span class="req-value">14 chars · All 4 char classes · Audit trail mandatory</span></div>
<div class="req-row"><span class="req-label">FIPS PUB 140-3</span><span class="req-value">20 chars · All 4 char classes · FIPS-validated entropy source · Documented provenance</span></div>

<p>Each certificate includes a <code>standards_met</code> array listing every standard the credential satisfies — not just the primary standard requested. A FIPS 140-3 certificate for a 20-character credential with full character set will typically carry all six standards in the array, meaning one certificate can serve as evidence for multiple concurrent audit requirements.</p>

<h2 id="revocation">Revocation and expiry</h2>
<p>Compliance certificates have a defined lifecycle:</p>
<ul>
  <li><strong>Default expiry: 1 year</strong> — the <code>exp</code> claim in the JWT is set to 365 days from issuance. This aligns with typical credential rotation cycles. An expired certificate shows expired status on the certificate page.</li>
  <li><strong>Revocation</strong> — certificates can be revoked manually (e.g. when a credential is rotated or a team member departs). Revoked certificates show revoked status at their URL. The ES256 signature remains mathematically valid after revocation — the public key verification confirms authenticity only; the certificate URL confirms current validity.</li>
  <li><strong>Renewal</strong> — when a credential is rotated, generate a new PassGeni certificate for the new credential. The old certificate provides the historical audit trail; the new certificate covers the current credential.</li>
</ul>
<p>For audit-critical workflows, always verify via the certificate URL (<code>passgeni.ai/cert/[id]</code>) rather than JWT-only offline verification. The URL provides current revocation status; offline verification confirms authenticity only.</p>

<div class="callout">
  <strong>Issue your first compliance certificate.</strong> Generate a password with PassGeni using any compliance preset, sign in, and click 'Certify this password'. Your certificate URL — publicly verifiable, cryptographically signed, auditor-ready — is ready in seconds. Foundation plan includes 3 certificates/month free.
</div>
`;
