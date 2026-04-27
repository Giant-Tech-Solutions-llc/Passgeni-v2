// =============================================================
// PASSGENI — GUIDE CONTENT
// how-to-prove-password-compliance-to-auditors
// =============================================================

export const toc = [
  { id: "what-auditors-ask",        title: "What auditors actually ask"                },
  { id: "evidence-types",           title: "Types of compliance evidence"              },
  { id: "why-screenshots-fail",     title: "Why screenshots and docs fail"             },
  { id: "certificate-approach",     title: "The compliance certificate approach"       },
  { id: "soc2-package",             title: "SOC 2 evidence package"                   },
  { id: "hipaa-evidence",           title: "HIPAA audit evidence"                     },
  { id: "pci-dss-evidence",         title: "PCI-DSS v4.0 audit evidence"              },
  { id: "iso-evidence",             title: "ISO 27001 audit evidence"                 },
  { id: "fips-evidence",            title: "FIPS 140-3 / FedRAMP evidence"            },
  { id: "retention",                title: "Evidence retention requirements"           },
  { id: "two-hour-package",         title: "2-hour audit prep playbook"               },
];

export const contentHtml = `
<h2 id="what-auditors-ask">What auditors actually ask</h2>
<p>Password compliance questions appear in virtually every security audit, regardless of framework. But the specific questions vary by standard. Understanding exactly what auditors ask — and what they consider acceptable evidence — is the foundation of efficient audit preparation.</p>
<p>Across SOC 2, HIPAA, PCI-DSS, and ISO 27001, auditors ask four core questions about password controls:</p>
<ol>
  <li><strong>Policy:</strong> "Show me your written password policy." — They want a dated, signed document specifying minimum length, complexity, rotation, and MFA requirements for different account types.</li>
  <li><strong>Technical enforcement:</strong> "Show me that the policy is technically enforced — not just documented." — Screenshots of Group Policy, IdP settings, or application configuration. Without this, a policy is just words.</li>
  <li><strong>Consistent application:</strong> "How do I know your high-risk credentials actually meet policy?" — This is where most organisations struggle. They have policy documents and system screenshots, but no credential-level evidence.</li>
  <li><strong>Breach awareness:</strong> "How do you detect compromised credentials?" — Evidence of breach checking, anomaly detection, or credential monitoring.</li>
</ol>
<p>Questions 1 and 4 have well-established answers. Question 2 has a mostly adequate answer (IdP screenshots). Question 3 is the gap that compliance certificates were built to close.</p>

<h2 id="evidence-types">Types of compliance evidence</h2>
<p>Auditors classify evidence by reliability. From most to least reliable:</p>
<ul>
  <li><strong>Technical evidence (highest reliability)</strong> — system configuration exports, API responses, cryptographically signed records. Cannot be fabricated without breaking the cryptographic guarantee. PassGeni compliance certificates fall here.</li>
  <li><strong>Administrative evidence (medium reliability)</strong> — written policies, meeting minutes, training records. Can be fabricated but auditors generally accept them for policies and procedures.</li>
  <li><strong>Testimonial evidence (lower reliability)</strong> — interviews, verbal confirmations, self-attestation. Accepted for subjective controls but not for specific technical claims.</li>
  <li><strong>Screenshots (lowest reliability)</strong> — can be fabricated, point-in-time, not machine-verifiable. Accepted out of necessity but viewed skeptically by experienced auditors.</li>
</ul>
<p>The practical implication: compliance certificates provide higher-quality evidence than screenshots for credential-level compliance. They replace the weakest link in most audit packages.</p>

<h2 id="why-screenshots-fail">Why screenshots and manual docs fail</h2>
<p>Most security teams rely on screenshots and written policy documents to prove password compliance. This approach has three fundamental problems:</p>
<ul>
  <li><strong>Point-in-time, not credential-level:</strong> A screenshot showing "minimum 12 characters" in Active Directory proves that, at one moment, the policy was configured correctly. It does not prove any specific credential met the standard. Auditors increasingly recognise this gap.</li>
  <li><strong>Not tamper-evident:</strong> Screenshots can be modified in any image editor. Experienced auditors are aware of this — it's why some request screen recordings or system exports instead of screenshots. Neither eliminates the forgery risk entirely.</li>
  <li><strong>Not machine-readable:</strong> Screenshots require manual auditor review — reading the image, interpreting the settings, mapping to the standard. This creates time pressure and interpretation ambiguity. A compliance certificate is machine-readable and can be verified programmatically in seconds.</li>
</ul>
<p>Manual policy documentation has a related problem: it proves what the organisation intended, not what actually happened at credential creation time. A policy written in January does not prove credentials created in October were compliant.</p>

<h2 id="certificate-approach">The compliance certificate approach</h2>
<p>A PassGeni compliance certificate closes the credential-level evidence gap. It is:</p>
<ul>
  <li><strong>Tamper-evident</strong> — ES256-signed. Any modification to the compliance claims (inflating entropy, changing the standard, altering generation parameters) invalidates the signature immediately.</li>
  <li><strong>Timestamp-anchored</strong> — the <code>iat</code> claim records the exact generation time. The certificate proves the credential met compliance at that specific moment, not just that a policy existed.</li>
  <li><strong>Machine-readable</strong> — auditors can verify with any JOSE library in under 60 seconds. No interpretation required — the compliance_standard and standards_met claims are explicit.</li>
  <li><strong>Independently verifiable</strong> — verification requires only PassGeni's public key at <code>passgeni.ai/.well-known/jwks.json</code>. No trust in the certificate holder is required. No call to PassGeni's servers required.</li>
  <li><strong>Credential-level</strong> — each certificate is for a specific credential generation event, not a system-wide policy claim. Auditors get evidence that this specific credential was compliant, not just that the system was configured to produce compliant credentials.</li>
</ul>
<p>Certificates supplement, not replace, written policy documents. The optimal audit package includes both: policy documents demonstrating organisational intent, and certificates demonstrating consistent execution.</p>

<h2 id="soc2-package">SOC 2 evidence package</h2>
<p>SOC 2 Trust Services Criteria CC6.1 covers logical access security. For password controls, a complete evidence package includes:</p>
<ul>
  <li><strong>Written password policy</strong> — covers minimum length (16+ chars for SOC 2), complexity, MFA, rotation, and service account requirements. Must be dated, signed by management, and show annual review. Use PassGeni's Policy Generator.</li>
  <li><strong>IdP / Active Directory configuration export</strong> — screenshot or XML export of password policy settings from your identity provider. Demonstrates technical enforcement of the written policy.</li>
  <li><strong>Compliance certificates for high-risk credentials</strong> — admin accounts, privileged service accounts, database credentials, CI/CD secrets. Provide the cert URL for each. Auditors independently verify. For SOC 2 Type II, having certificates from across the audit period demonstrates consistent enforcement over time.</li>
  <li><strong>Access review documentation</strong> — quarterly or semi-annual review log showing who has access to which systems, with approvals. CC6.2 and CC6.3.</li>
  <li><strong>Breach monitoring evidence</strong> — configuration showing credential monitoring (HIBP integration, SIEM alerts for credential stuffing). CC7.1.</li>
</ul>

<div class="callout">
  <strong>SOC 2 Type I vs Type II:</strong> Type I assesses design at a point in time. Type II assesses operation over a period (typically 6–12 months). For Type II, compliance certificates timestamped across the audit period demonstrate consistent credential-level compliance — stronger evidence than a single system screenshot.
</div>

<h2 id="hipaa-evidence">HIPAA audit evidence</h2>
<p>HIPAA audits (OCR investigations and third-party risk assessments) focus on §164.312 Technical Safeguards. For password controls, auditors assess:</p>
<ul>
  <li><strong>§164.312(a)(1) — Access Control:</strong> Written access control policy, evidence of unique user identification, automatic logoff configuration. Compliance certificates demonstrating credentials met HIPAA-standard generation parameters address the "unique, strong credentials" element.</li>
  <li><strong>§164.312(d) — Person or Entity Authentication:</strong> Policy and evidence that authentication mechanisms are appropriate to the risk. For password-based authentication: minimum 12-character credentials with complexity, MFA for remote and privileged access, credential generation documentation.</li>
  <li><strong>§164.312(b) — Audit Controls:</strong> Authentication event logs retained for 6 years. Compliance certificate records (accessible via cert URL) are persistent and dated — they contribute to the 6-year retention requirement for access control evidence.</li>
</ul>
<p>The OCR's HIPAA audit protocol specifically asks covered entities to produce policies, procedures, and technical implementation evidence for each safeguard. Compliance certificates provide the technical implementation evidence for credential generation that is otherwise difficult to produce.</p>

<h2 id="pci-dss-evidence">PCI-DSS v4.0 audit evidence</h2>
<p>PCI-DSS v4.0 (mandatory since March 2024) significantly strengthened password requirements. Requirement 8.3 covers password authentication:</p>
<ul>
  <li><strong>Req 8.3.6 — Minimum 12 characters, 3 of 4 character types:</strong> Technical configuration evidence (IdP settings) plus compliance certificates demonstrating 12-character minimum and complexity for cardholder data environment (CDE) credentials.</li>
  <li><strong>Req 8.3.9 — Password change only on evidence of compromise:</strong> Documentation showing your organisation has replaced mandatory rotation with breach-evidence-based rotation. PassGeni's breach checker integration supports this.</li>
  <li><strong>Req 8.4.2 — MFA for all CDE access:</strong> IdP configuration evidence. MFA is separate from password generation evidence but auditors review both together.</li>
  <li><strong>Req 8.6 — System/application account management:</strong> Service account credentials must be individually managed, not shared. Compliance certificates for each service account credential provide the individual management evidence.</li>
</ul>
<p>QSAs (Qualified Security Assessors) conducting PCI-DSS audits are increasingly sophisticated about credential evidence. Certificates providing exact entropy_bits and generation_params align with the quantitative approach QSAs bring to their assessments.</p>

<h2 id="iso-evidence">ISO 27001 audit evidence</h2>
<p>ISO 27001:2022 Annex A.9 (Access Control) and the associated control objectives require both documented controls and objective evidence of implementation. For password controls:</p>
<ul>
  <li><strong>A.9.4.3 — Password management system:</strong> Evidence of a system that enforces strong passwords, prevents reuse, and locks accounts on failure. System configuration evidence plus compliance certificates demonstrating ISO 27001-aligned generation (14+ chars, all character classes).</li>
  <li><strong>A.9.2.4 — Management of secret authentication information:</strong> Evidence that credentials are provisioned securely, changed on compromise, and not shared. Compliance certificates provide the generation provenance; access logs provide the usage trail.</li>
  <li><strong>Clause 9.1 — Monitoring, measurement, analysis, and evaluation:</strong> Evidence that controls are measured and effective. A portfolio of compliance certificates across the credential estate demonstrates measured, consistent enforcement.</li>
  <li><strong>Clause 7.5 — Documented information:</strong> ISO 27001 requires documented evidence of control operation. Compliance certificates are documented, machine-readable, externally hosted evidence that satisfies this clause without additional manual record-keeping.</li>
</ul>

<h2 id="fips-evidence">FIPS 140-3 / FedRAMP evidence</h2>
<p>Federal audits have the most explicit requirements for credential generation evidence:</p>
<ul>
  <li><strong>Entropy source documentation:</strong> FIPS 140-3 requires identifying the specific validated entropy source. PassGeni certificates include <code>entropy_source: "crypto.getRandomValues (FIPS 140-3 aligned)"</code> — satisfying this requirement in a tamper-evident format.</li>
  <li><strong>System Security Plan (SSP) references:</strong> FedRAMP-authorized systems must document credential management in their SSP. Reference PassGeni compliance certificate URLs as evidence of FIPS-aligned credential generation in the relevant control sections (IA-5, IA-5(1)).</li>
  <li><strong>STIG compliance:</strong> DoD STIG assessors ask for evidence that credentials meet STIG password requirements (typically 15–20 chars, all character types). Compliance certificates with FIPS 140-3 preset satisfy these requirements and provide the documented provenance STIG assessors need.</li>
  <li><strong>POA&M items:</strong> If existing credentials lack documented provenance, create a Plan of Action and Milestones item to rotate and recertify them. PassGeni certificates for rotated credentials close the POA&M item with cryptographic evidence.</li>
</ul>

<h2 id="retention">Evidence retention requirements</h2>
<p>Password compliance evidence must be retained for the duration specified by each framework:</p>

<div class="req-row"><span class="req-label">HIPAA (45 CFR §164.316)</span><span class="req-value">6 years from creation or last effective date</span></div>
<div class="req-row"><span class="req-label">PCI-DSS v4.0</span><span class="req-value">12 months minimum (current period + previous period)</span></div>
<div class="req-row"><span class="req-label">SOC 2</span><span class="req-value">Evidence from each audit period — typically 3 years</span></div>
<div class="req-row"><span class="req-label">ISO 27001</span><span class="req-value">Per documented retention policy — typically 3 years</span></div>
<div class="req-row"><span class="req-label">FIPS 140-3 / FedRAMP</span><span class="req-value">Per applicable NIST SP 800-53 control requirements</span></div>

<p>PassGeni compliance certificates are persistently accessible via their certificate URL for the duration of their validity period. For HIPAA's 6-year requirement, archive the certificate URL (and the certificate page content) at the time of creation. The cert URL provides ongoing access; the archived snapshot provides fallback if PassGeni is unavailable.</p>

<h2 id="two-hour-package">The 2-hour audit prep playbook</h2>
<p>For teams preparing for an upcoming audit with limited time, this sequence addresses the most common password evidence gaps in approximately 2 hours:</p>
<ol>
  <li><strong>Generate written password policy (20 minutes):</strong> Use PassGeni's Policy Generator with your organisation type and applicable standards. Download, customise with your organisation name and dates, get management signature. This covers the policy evidence gap for all frameworks.</li>
  <li><strong>Identify highest-risk credentials (15 minutes):</strong> Admin accounts, service accounts, database passwords, CI/CD credentials, cloud console access. These are the credentials auditors will probe.</li>
  <li><strong>Rotate and certify high-risk credentials (45 minutes):</strong> For each high-risk credential, generate a replacement using the appropriate PassGeni compliance preset, certify it, and collect the certificate URL. Update the credential in your password manager and secrets manager. This creates the credential-level evidence that replaces missing documentation.</li>
  <li><strong>Document the certificate URLs (20 minutes):</strong> Create a simple spreadsheet: credential name | system | compliance standard | cert URL | rotation date. This is your compliance certificate registry — reference it during audit interviews.</li>
  <li><strong>Capture IdP configuration screenshots (20 minutes):</strong> Screenshot or export your identity provider's password policy settings. These supplement the certificates with system-level enforcement evidence.</li>
</ol>
<p>Total output: written policy, IdP screenshots, compliance certificates for all high-risk credentials, and a certificate registry. This package addresses the evidence requirements for SOC 2 CC6.1, HIPAA §164.312, PCI-DSS Req 8.3, and ISO 27001 A.9 at the credential level.</p>

<div class="callout">
  <strong>Start with your riskiest credentials.</strong> Generate and certify your admin account passwords, service account credentials, and database passwords first. These are the credentials auditors focus on. Foundation plan covers 3 certificates/month free. Assurance ($19/month) provides unlimited certificates and all 6 compliance standards for complete coverage.
</div>
`;
