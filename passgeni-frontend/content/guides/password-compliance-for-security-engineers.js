// =============================================================
// PASSGENI — GUIDE CONTENT
// password-compliance-for-security-engineers
// =============================================================

export const toc = [
  { id: "the-evidence-gap",         title: "The credential evidence gap"              },
  { id: "what-auditors-probe",      title: "What auditors probe in security reviews"  },
  { id: "service-account-strategy", title: "Service account compliance strategy"      },
  { id: "certificate-workflow",     title: "The compliance certificate workflow"      },
  { id: "api-integration",          title: "API and automation integration"           },
  { id: "verification",             title: "Verifying and sharing certificates"       },
  { id: "anomaly-detection",        title: "Anomaly detection and abuse controls"     },
  { id: "standards-mapping",        title: "Standards mapping for security engineers" },
  { id: "zero-knowledge",           title: "Zero-knowledge in a security context"     },
  { id: "checklist",                title: "Security engineer's compliance checklist" },
];

export const contentHtml = `
<h2 id="the-evidence-gap">The credential evidence gap</h2>
<p>Security engineers know how to generate strong passwords. The harder problem — the one that surfaces in every SOC 2, HIPAA, and PCI-DSS audit — is proving that the right credentials were generated to the right standard at the right time.</p>
<p>The evidence gap is structural. Password generation happens at one point in time; audits happen months or years later. By the time an auditor asks "how do I know your admin passwords met HIPAA requirements when you created them?", the only honest answer for most teams is: "we had a policy, and we followed it." That is testimonial evidence, not technical evidence. It is the weakest class of audit evidence.</p>
<p>The gap is particularly acute for:</p>
<ul>
  <li><strong>Service account credentials</strong> — created by engineers, stored in secrets managers, rarely documented with anything beyond the secret itself</li>
  <li><strong>Database and infrastructure passwords</strong> — generated once, rotated infrequently, with zero provenance records</li>
  <li><strong>CI/CD pipeline credentials</strong> — often created under time pressure, with no formal compliance review</li>
  <li><strong>Admin accounts</strong> — high-value targets that auditors examine closely but that rarely have credential-level documentation</li>
</ul>
<p>PassGeni compliance certificates close this gap by creating a tamper-evident, machine-readable record at the moment of generation — before there is any need for evidence.</p>

<h2 id="what-auditors-probe">What auditors probe in security reviews</h2>
<p>Understanding exactly what auditors ask helps security engineers prepare targeted evidence. For credential controls, experienced auditors in SOC 2, HIPAA, and PCI-DSS reviews typically probe:</p>
<ul>
  <li><strong>Policy to technical enforcement gap:</strong> "You have a policy saying 16 characters minimum. Show me that your most sensitive systems actually enforce this." Screenshots of IdP settings are the standard answer, but they don't cover service accounts or individually provisioned credentials.</li>
  <li><strong>Credential provenance:</strong> "How do I know this specific admin credential was generated to policy?" Without a generation record, the answer is "we followed our policy" — unverifiable testimonial evidence.</li>
  <li><strong>Standard-specific compliance:</strong> "Your policy mentions PCI-DSS. Which credentials in your CDE have PCI-DSS documentation?" Most teams cannot answer at the credential level.</li>
  <li><strong>Entropy source:</strong> For FIPS 140-3 and FedRAMP audits specifically: "What random number generator was used to generate these credentials?" Most teams have never considered this question.</li>
</ul>
<p>Compliance certificates address all four probe areas with a single artifact: the certificate documents the compliance standard, the exact generation parameters, the entropy source, and the precise timestamp of generation.</p>

<h2 id="service-account-strategy">Service account compliance strategy</h2>
<p>Service accounts represent the highest credential compliance risk in most organisations. They typically have no MFA, broad permissions, infrequent rotation, and zero documentation of how they were created. A robust service account compliance strategy:</p>
<ul>
  <li><strong>Inventory first:</strong> Identify every service account in your environment. Common locations: Active Directory service accounts, cloud IAM service accounts, database users, CI/CD pipeline credentials, application API keys, Kubernetes service accounts.</li>
  <li><strong>Classify by compliance scope:</strong> Which service accounts have access to systems in scope for SOC 2, HIPAA, PCI-DSS, or ISO 27001? These are highest priority for certificate generation.</li>
  <li><strong>Rotate and certify:</strong> For in-scope service accounts, rotate credentials using the appropriate PassGeni compliance preset and capture the certificate URL. Store the URL as metadata alongside the credential in your secrets manager.</li>
  <li><strong>Implement a rotation schedule:</strong> Following certification, establish a rotation schedule. For FIPS/DoD environments: 90 days for privileged accounts. For SOC 2/ISO: annually or on engineer offboarding. Each rotation generates a new certificate, maintaining the audit trail.</li>
  <li><strong>Secrets manager metadata:</strong> In HashiCorp Vault: store the cert URL as a custom metadata field. In AWS Secrets Manager: add a tag <code>passgeni-cert-url: https://passgeni.ai/cert/[id]</code>. In Doppler: add the URL to the secret's note. This links the compliance evidence directly to the credential.</li>
</ul>

<div class="req-row"><span class="req-label">Production database credentials</span><span class="req-value">FIPS 140-3 preset · 20+ chars · Rotate annually, certify each rotation</span></div>
<div class="req-row"><span class="req-label">Cloud IAM service accounts</span><span class="req-value">Applicable standard preset · Certify at creation</span></div>
<div class="req-row"><span class="req-label">CI/CD pipeline tokens</span><span class="req-value">NIST 800-63B minimum · Rotate on pipeline changes</span></div>
<div class="req-row"><span class="req-label">Admin account passwords</span><span class="req-value">FIPS 140-3 or SOC 2 preset · MFA mandatory · Certify at creation</span></div>

<h2 id="certificate-workflow">The compliance certificate workflow</h2>
<p>Integrating compliance certificate generation into standard credential provisioning workflows:</p>
<ol>
  <li><strong>Determine the applicable compliance standard</strong> — Is the credential for a HIPAA-covered system? PCI-DSS CDE? SOC 2 in-scope infrastructure? Select the most demanding applicable standard. FIPS 140-3 satisfies all others simultaneously.</li>
  <li><strong>Generate via PassGeni with preset</strong> — Use the appropriate compliance preset. PassGeni validates generation parameters server-side and issues a generation_session_id (60-second expiry).</li>
  <li><strong>Certify immediately</strong> — Use the generation_session_id to request the compliance certificate before the session expires. The certificate is issued, signed with ES256, and stored. You receive a cert_url.</li>
  <li><strong>Store credential + cert URL together</strong> — The credential goes into your password manager or secrets manager. The cert URL goes into the associated metadata or documentation.</li>
  <li><strong>Reference cert URL in runbooks and incident response plans</strong> — Add cert URLs to system documentation. During audits or incidents, you have immediate access to credential provenance.</li>
</ol>
<p>The entire workflow from generation to certified storage adds approximately 90 seconds per credential. At scale, the API automates this entirely.</p>

<h2 id="api-integration">API and automation integration</h2>
<p>For teams managing credentials at scale, the PassGeni API (Authority tier) enables automated compliance certificate generation as part of standard provisioning workflows:</p>
<ul>
  <li><strong>Terraform provisioning:</strong> Call PassGeni API during resource provisioning to generate database passwords with compliance certificates. Store the cert_url as a Terraform output and tag it to the database resource.</li>
  <li><strong>Ansible playbooks:</strong> Include a PassGeni API call in credential provisioning playbooks. Store cert_url as a host variable for auditor access.</li>
  <li><strong>GitHub Actions / CI/CD:</strong> Generate service account credentials via PassGeni API during environment setup. Store cert_url as an environment variable or GitHub Actions secret annotation.</li>
  <li><strong>Kubernetes secrets:</strong> Add a passgenni-cert-url annotation to Kubernetes secrets created with PassGeni-generated credentials.</li>
</ul>

<div class="callout">
  <strong>API endpoint reference:</strong> POST /api/generate → receives generation_session_id. POST /api/generate-certificate with generation_session_id → receives cert_id, cert_url, standards_met, entropy_bits. GET /api/audit → list all certificates for the authenticated user. All endpoints use Bearer token authentication for API key access.
</div>

<h2 id="verification">Verifying and sharing certificates</h2>
<p>PassGeni certificates are independently verifiable by any party. For security engineers who need to verify certificates (whether their own or certificates they've received from vendors):</p>
<ul>
  <li><strong>Online verification:</strong> Navigate to the cert URL. The certificate page shows compliance claims, entropy, generation parameters, and current validity status in human-readable form.</li>
  <li><strong>Offline verification (Node.js):</strong>
<pre style="background:#111;border:1px solid #222;border-radius:8px;padding:16px;font-size:12px;overflow-x:auto;line-height:1.6;">import { jwtVerify, createRemoteJWKSet } from 'jose';
const JWKS = createRemoteJWKSet(
  new URL('https://passgeni.ai/.well-known/jwks.json')
);
const { payload } = await jwtVerify(token, JWKS, {
  issuer: 'passgeni.ai',
  algorithms: ['ES256'],
});
console.log(payload.compliance_standard); // e.g. 'HIPAA'
console.log(payload.standards_met);       // ['NIST-800-63B', 'HIPAA', ...]
console.log(payload.entropy_bits);        // e.g. 131.4</pre>
  </li>
  <li><strong>Auditor sharing:</strong> Share the cert URL directly. Auditors do not need a PassGeni account to view or verify. The certificate page is publicly accessible and shows all compliance claims with verification instructions.</li>
</ul>

<h2 id="anomaly-detection">Anomaly detection and abuse controls</h2>
<p>PassGeni's security architecture includes controls relevant to security engineers operating in high-security environments:</p>
<ul>
  <li><strong>Rate limiting:</strong> 10 certificate generation attempts per IP per hour (IP-level), 60 requests per user per minute (user-level), burst protection of 5 immediate then 1/second. Prevents automated abuse.</li>
  <li><strong>Generation session tokens:</strong> The generation_session_id expires in 60 seconds. This prevents certifying externally-created passwords and ensures certificates reflect genuine PassGeni generation events.</li>
  <li><strong>Anomaly threshold:</strong> Users generating more than 50 certificates in 24 hours trigger an anomaly flag in PassGeni's usage_events table. This is monitored and may trigger manual review for potential abuse.</li>
  <li><strong>Audit trail:</strong> Every certificate generation, certificate view, and API access event is logged in usage_events. For Authority tier teams, this provides a complete audit trail of certificate activity.</li>
  <li><strong>Revocation:</strong> Certificates can be revoked instantly. Revocation is reflected on the public certificate page — auditors checking the URL see the revocation status. Revocation is non-destructive: the historical record remains; the validity status changes.</li>
</ul>

<h2 id="standards-mapping">Standards mapping for security engineers</h2>
<p>Mapping compliance requirements to PassGeni presets and minimum parameters:</p>

<div class="req-row"><span class="req-label">NIST 800-63B (general / government baseline)</span><span class="req-value">8 chars · No complexity required · Breach checking</span></div>
<div class="req-row"><span class="req-label">HIPAA §164.312 (healthcare / ePHI systems)</span><span class="req-value">12 chars · Upper + lower + digit + special</span></div>
<div class="req-row"><span class="req-label">PCI-DSS v4.0 Req 8.3 (payments / CDE)</span><span class="req-value">12 chars · 3 of 4 classes · ≥40 bits entropy</span></div>
<div class="req-row"><span class="req-label">SOC 2 CC6.1 (SaaS / cloud services)</span><span class="req-value">16 chars · All 4 char classes</span></div>
<div class="req-row"><span class="req-label">ISO 27001 A.9 (enterprise / international)</span><span class="req-value">14 chars · All 4 char classes</span></div>
<div class="req-row"><span class="req-label">FIPS 140-3 (federal / DoD / FedRAMP)</span><span class="req-value">20 chars · All 4 char classes · FIPS entropy source · Provenance doc</span></div>

<p>When multiple frameworks apply, use the most demanding preset. FIPS 140-3 generates credentials that satisfy all other frameworks simultaneously.</p>

<h2 id="zero-knowledge">Zero-knowledge in a security context</h2>
<p>For security engineers evaluating PassGeni's trust model, the zero-knowledge architecture has specific security properties worth understanding:</p>
<ul>
  <li><strong>No credential storage:</strong> Passwords are generated client-side using <code>crypto.getRandomValues()</code> and never transmitted to PassGeni's servers. A PassGeni data breach cannot expose any credential that was generated using the service.</li>
  <li><strong>Certificate content scope:</strong> The certificate JWT contains generation parameters — not the credential itself. An attacker who obtained the JWT payload would learn that a credential was generated with HIPAA-standard parameters, 12 characters, and specific character classes. They would learn nothing about the credential's content.</li>
  <li><strong>Signed, not encrypted:</strong> The certificate is ES256-signed but not encrypted. The payload is base64-encoded and publicly readable. This is intentional — auditors need to read compliance claims without decryption. Sensitive information (the password) is never included.</li>
  <li><strong>Key custody:</strong> The ES256 signing private key lives exclusively in PassGeni's server environment variables. It is never transmitted, logged, or exposed. Certificate verification uses only the corresponding public key at <code>/.well-known/jwks.json</code>.</li>
  <li><strong>Subpoena resistance:</strong> Because PassGeni never stores passwords, legal demands for credential disclosure cannot be satisfied — there is nothing to disclose. The database contains only JWT payloads (generation parameters) and compliance metadata, not credentials.</li>
</ul>

<h2 id="checklist">Security engineer's compliance checklist</h2>
<p>Use this checklist when preparing for a compliance audit or implementing a new certificate-based credential management workflow:</p>
<ol>
  <li>Audit current credential estate — identify every service account, admin account, and infrastructure credential in scope</li>
  <li>Classify by compliance requirement — which standards apply to which systems?</li>
  <li>Rotate any credential without provenance documentation using the appropriate PassGeni preset</li>
  <li>Collect compliance certificate URLs for all rotated and new credentials</li>
  <li>Store certificate URLs in secrets manager metadata alongside each credential</li>
  <li>Update runbooks and system documentation with certificate URLs</li>
  <li>Generate a written password policy using PassGeni's Policy Generator</li>
  <li>Capture IdP configuration screenshots or exports for each in-scope system</li>
  <li>Create a certificate registry (spreadsheet or CMDB field) mapping credentials to cert URLs</li>
  <li>Set calendar reminders for certificate expiry (1 year from issuance) — rotate and re-certify on schedule</li>
  <li>For Authority tier teams: configure API-based certificate generation in provisioning automation</li>
  <li>Test offline verification of at least one certificate using the JOSE library to confirm auditor workflow</li>
</ol>

<div class="callout">
  <strong>Start with admin and service accounts.</strong> These are the credentials auditors probe most aggressively. Generate and certify them first with the appropriate compliance preset. Foundation plan includes 3 certificates/month free. Assurance ($19/month) provides unlimited certificates for full coverage.
</div>
`;
