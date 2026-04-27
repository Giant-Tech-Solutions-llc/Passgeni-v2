// =============================================================
// PASSGENI — GUIDE CONTENT
// fips-140-3-password-requirements
// =============================================================

export const toc = [
  { id: "what-fips-requires",       title: "What FIPS 140-3 actually requires"         },
  { id: "who-must-comply",          title: "Who must comply"                           },
  { id: "minimum-length",           title: "Password length and complexity"            },
  { id: "entropy-source",           title: "FIPS-validated entropy sources"            },
  { id: "stig-requirements",        title: "DoD STIG password requirements"            },
  { id: "fedramp-alignment",        title: "FedRAMP alignment"                         },
  { id: "certificate-provenance",   title: "Documented provenance and audit trail"     },
  { id: "vs-other-standards",       title: "FIPS 140-3 vs HIPAA, PCI-DSS, NIST"       },
  { id: "implementation-checklist", title: "Implementation checklist"                  },
];

export const contentHtml = `
<h2 id="what-fips-requires">What FIPS 140-3 actually requires</h2>
<p>FIPS PUB 140-3 — Federal Information Processing Standard Publication 140-3 — defines security requirements for cryptographic modules used by US federal agencies and their contractors. It replaced FIPS 140-2 in 2019 and is based on the international standard ISO/IEC 19790:2012.</p>
<p>FIPS 140-3 is not primarily a password standard. It is a module security standard — it defines what it means for a cryptographic system to be trustworthy. However, its requirements have direct implications for password generation:</p>
<ul>
  <li><strong>The entropy source used to generate credentials must be validated.</strong> If passwords are generated using a FIPS 140-3 non-compliant random number generator, those passwords are out of scope for federal use, regardless of their length or complexity.</li>
  <li><strong>Documented provenance is required.</strong> Federal agencies must be able to prove that credentials were generated using a validated entropy source. Manual or undocumented credential creation is not acceptable.</li>
  <li><strong>The credential generation process must be auditable.</strong> Every credential used to protect federal systems must have a traceable record of generation parameters, entropy source, and compliance standard.</li>
</ul>
<p>FIPS 140-3 compliance is enforced through the NIST Cryptographic Module Validation Program (CMVP). Modules are tested by accredited labs and validated certificates are listed at csrc.nist.gov/projects/cryptographic-module-validation-program.</p>

<div class="callout">
  <strong>Key distinction:</strong> FIPS 140-3 validates the cryptographic module (the random number generator), not the password itself. A 20-character password generated with a FIPS-validated entropy source meets FIPS requirements. The same password generated with Math.random() does not — regardless of its length.
</div>

<h2 id="who-must-comply">Who must comply with FIPS 140-3</h2>
<p>FIPS 140-3 compliance is mandatory for:</p>
<ul>
  <li><strong>US federal agencies</strong> — all civilian agencies and military branches must use FIPS-validated cryptographic modules for sensitive information systems (per OMB Circular A-130)</li>
  <li><strong>Federal contractors</strong> — vendors providing IT systems, software, or services to the federal government that involve cryptographic protection of federal data</li>
  <li><strong>DoD suppliers and defense contractors</strong> — subject to CMMC (Cybersecurity Maturity Model Certification) and NIST SP 800-171, which require FIPS-validated cryptography</li>
  <li><strong>FedRAMP-authorized cloud providers</strong> — all cloud services processing federal data require FIPS 140-2/140-3 validated encryption</li>
  <li><strong>Healthcare organisations under federal contracts</strong> — systems handling protected health information in federal programs (VA, CMS, NIH contractors) must meet FIPS requirements</li>
</ul>
<p>Private companies without federal contracts are not legally required to comply with FIPS 140-3. However, many choose to comply because it signals the highest level of cryptographic rigor, satisfies the most demanding enterprise security reviews, and future-proofs credential generation against tightening federal requirements.</p>

<h2 id="minimum-length">Password length and complexity requirements</h2>
<p>FIPS 140-3 itself defines module security levels (1–4) but delegates specific password requirements to implementing guidance. The de facto requirements for FIPS 140-3 compliant password generation come from:</p>

<div class="req-row"><span class="req-label">Minimum password length (DoD STIG baseline)</span><span class="req-value">≥ 15 characters</span></div>
<div class="req-row"><span class="req-label">Recommended minimum (FIPS-aligned best practice)</span><span class="req-value">≥ 20 characters</span></div>
<div class="req-row"><span class="req-label">Privileged / admin accounts</span><span class="req-value">≥ 20 characters</span></div>
<div class="req-row"><span class="req-label">Service account / API credentials</span><span class="req-value">≥ 24 characters</span></div>
<div class="req-row"><span class="req-label">Character classes required</span><span class="req-value">All four: upper, lower, digits, symbols</span></div>
<div class="req-row"><span class="req-label">Dictionary words</span><span class="req-value">Prohibited</span></div>
<div class="req-row"><span class="req-label">Repeating character sequences</span><span class="req-value">Prohibited</span></div>

<p>These are the highest password requirements of any major compliance framework. A FIPS 140-3 compliant password is, by definition, compliant with HIPAA (12 chars), PCI-DSS v4.0 (12 chars), SOC 2 (16 chars), and ISO 27001 (14 chars).</p>
<p>A 20-character password using the full printable ASCII character set (95 characters) provides approximately 131 bits of entropy — well above the 128-bit threshold recommended for post-quantum resilience.</p>

<h2 id="entropy-source">FIPS-validated entropy sources</h2>
<p>The entropy source requirement is the defining technical constraint of FIPS 140-3 password compliance. Acceptable entropy sources:</p>

<div class="req-row"><span class="req-label">crypto.getRandomValues() — browser/Node.js</span><span class="req-value">✅ FIPS 140-3 aligned</span></div>
<div class="req-row"><span class="req-label">Windows CryptGenRandom / BCryptGenRandom (CNG)</span><span class="req-value">✅ FIPS 140-3 validated</span></div>
<div class="req-row"><span class="req-label">Linux /dev/urandom (kernel ≥ 3.17)</span><span class="req-value">✅ FIPS 140-3 aligned</span></div>
<div class="req-row"><span class="req-label">OpenSSL 3.x FIPS provider</span><span class="req-value">✅ CMVP validated (cert #4282)</span></div>
<div class="req-row"><span class="req-label">JavaScript Math.random()</span><span class="req-value">❌ Not FIPS compliant — never use</span></div>
<div class="req-row"><span class="req-label">System time / sequential seeds</span><span class="req-value">❌ Not FIPS compliant — never use</span></div>
<div class="req-row"><span class="req-label">Human-chosen passwords</span><span class="req-value">❌ Not FIPS compliant — zero entropy guarantee</span></div>

<p>PassGeni uses <code>crypto.getRandomValues()</code> exclusively for all password generation. This API calls the operating system's CSPRNG, which on all modern platforms meets FIPS 140-3 entropy requirements. The entropy source is documented in every PassGeni compliance certificate under the <code>entropy_source</code> claim.</p>

<div class="callout warning">
  <strong>Entropy source documentation is not optional.</strong> For FIPS 140-3 audits, you must be able to identify the specific entropy source used for each credential. "I used a strong password" is not auditable. "Generated via crypto.getRandomValues() on PassGeni, certificate passgeni.ai/cert/[id]" is auditable.
</div>

<h2 id="stig-requirements">DoD STIG password requirements</h2>
<p>Security Technical Implementation Guides (STIGs) are DISA-published configuration standards that translate FIPS 140-3 and NIST requirements into specific, system-level rules. For passwords, the most relevant STIGs are:</p>
<ul>
  <li><strong>Application Security and Development STIG</strong> — covers password policies for custom applications</li>
  <li><strong>General Purpose Operating System STIG</strong> — covers OS-level password controls</li>
  <li><strong>Active Directory STIG</strong> — covers domain authentication policy</li>
  <li><strong>Web Server STIG</strong> — covers service account and admin credentials</li>
</ul>
<p>Common STIG password requirements across versions:</p>

<div class="req-row"><span class="req-label">Minimum password length</span><span class="req-value">15 characters (most STIGs) to 20 characters (high-impact)</span></div>
<div class="req-row"><span class="req-label">Minimum uppercase characters</span><span class="req-value">≥ 2</span></div>
<div class="req-row"><span class="req-label">Minimum lowercase characters</span><span class="req-value">≥ 2</span></div>
<div class="req-row"><span class="req-label">Minimum numeric characters</span><span class="req-value">≥ 2</span></div>
<div class="req-row"><span class="req-label">Minimum special characters</span><span class="req-value">≥ 2</span></div>
<div class="req-row"><span class="req-label">Password history (no reuse)</span><span class="req-value">Last 5 passwords (most) to last 24 (high-impact)</span></div>
<div class="req-row"><span class="req-label">Lockout threshold</span><span class="req-value">3 failed attempts</span></div>
<div class="req-row"><span class="req-label">Lockout duration</span><span class="req-value">15 minutes minimum</span></div>

<h2 id="fedramp-alignment">FedRAMP alignment</h2>
<p>FedRAMP (Federal Risk and Authorization Management Program) authorization requires FIPS 140-2 or 140-3 validated encryption for all data in transit and at rest. For password generation specifically:</p>
<ul>
  <li>All credentials protecting FedRAMP-authorized systems must be generated using a FIPS-validated entropy source</li>
  <li>Service account credentials require documented provenance — FedRAMP assessors expect to see how credentials were generated</li>
  <li>Credential rotation must be documented and logged in the system's Plan of Action and Milestones (POA&M)</li>
  <li>High-impact systems (IL4/IL5 equivalents) require privileged account credentials of 20+ characters with all character classes</li>
</ul>
<p>PassGeni compliance certificates directly address FedRAMP documentation requirements by providing a machine-readable, tamper-evident record of credential generation parameters and entropy source for every credential issued.</p>

<h2 id="certificate-provenance">Documented provenance and audit trail</h2>
<p>FIPS 140-3 and its implementing guidance require more than just secure credential generation — they require proof. Specifically:</p>
<ul>
  <li>The entropy source must be identified and its FIPS validation status documented</li>
  <li>The generation parameters (length, character set, compliance standard) must be recorded at generation time</li>
  <li>The record must be tamper-evident — auditors need confidence that it cannot be altered after the fact</li>
  <li>The record must be accessible to auditors without requiring trust in the credential holder</li>
</ul>
<p>PassGeni compliance certificates satisfy all four requirements. Each certificate is an ES256-signed JWT containing the complete generation record. The ES256 signature is cryptographically bound to the content — any alteration invalidates it immediately. Certificates are publicly verifiable at the cert URL and verifiable offline using PassGeni's published public key at <code>passgeni.ai/.well-known/jwks.json</code>.</p>

<div class="req-row"><span class="req-label">Entropy source documented</span><span class="req-value">crypto.getRandomValues (FIPS 140-3 aligned)</span></div>
<div class="req-row"><span class="req-label">Generation parameters recorded</span><span class="req-value">Length, character classes, compliance standard</span></div>
<div class="req-row"><span class="req-label">Tamper-evident</span><span class="req-value">ES256 digital signature — any change breaks verification</span></div>
<div class="req-row"><span class="req-label">Independently verifiable</span><span class="req-value">Offline verification via /.well-known/jwks.json</span></div>
<div class="req-row"><span class="req-label">Auditor access</span><span class="req-value">Public URL — no login required</span></div>

<h2 id="vs-other-standards">FIPS 140-3 vs HIPAA, PCI-DSS, NIST</h2>
<p>How FIPS 140-3 password requirements compare to the other major compliance frameworks:</p>

<div class="req-row"><span class="req-label">FIPS 140-3</span><span class="req-value">20 chars · All 4 classes · FIPS entropy source · Documented provenance</span></div>
<div class="req-row"><span class="req-label">SOC 2 CC6.1</span><span class="req-value">16 chars · Complexity · Auditor discretion on entropy source</span></div>
<div class="req-row"><span class="req-label">ISO 27001 Annex A.9</span><span class="req-value">14 chars · All 4 classes · No entropy source requirement</span></div>
<div class="req-row"><span class="req-label">PCI-DSS v4.0 Req 8.3</span><span class="req-value">12 chars · 3 of 4 classes · No entropy source requirement</span></div>
<div class="req-row"><span class="req-label">HIPAA §164.312</span><span class="req-value">12 chars recommended · Best practice complexity · No entropy source requirement</span></div>
<div class="req-row"><span class="req-label">NIST 800-63B</span><span class="req-value">8 chars min · No complexity rules · Breach checking required</span></div>

<p>A password that meets FIPS 140-3 requirements automatically meets all other major frameworks. This is why the PassGeni FIPS 140-3 preset is a useful default for organisations that need to satisfy multiple standards simultaneously.</p>

<h2 id="implementation-checklist">Implementation checklist</h2>
<p>Use this checklist when implementing FIPS 140-3 compliant password controls for federal systems or pursuing DoD STIG compliance:</p>
<ol>
  <li>Identify all credentials in scope — user accounts, service accounts, admin accounts, API keys, database passwords</li>
  <li>For each credential: verify it was generated with a FIPS-validated entropy source (not Math.random(), not human-chosen)</li>
  <li>Rotate any credential without documented provenance using PassGeni FIPS 140-3 preset</li>
  <li>Collect compliance certificate URLs for all rotated credentials — this is your audit evidence</li>
  <li>Enforce minimum 20-character length for all new credentials at the system level (Group Policy, PAM configuration, application settings)</li>
  <li>Require all four character classes (uppercase, lowercase, digits, symbols) with a minimum of 2 each (STIG requirement)</li>
  <li>Implement lockout after 3 failed attempts with 15-minute lockout duration</li>
  <li>Enable MFA for all privileged accounts — FIPS 140-3 hardware tokens (PIV/CAC cards) for DoD systems</li>
  <li>Configure password history to prevent reuse of last 5–24 passwords (per applicable STIG)</li>
  <li>Document entropy source and credential generation procedures in system security plan (SSP)</li>
  <li>Store compliance certificate URLs alongside credentials in secrets management system</li>
  <li>Schedule annual credential rotation with renewed certificates</li>
</ol>

<div class="callout">
  <strong>Generate a FIPS 140-3 compliant password now.</strong> PassGeni's FIPS 140-3 preset enforces 20-character minimum, all four character classes, and uses crypto.getRandomValues() as the validated entropy source. The resulting compliance certificate documents the entropy source and generation parameters — satisfying DoD STIG and FedRAMP documentation requirements.
</div>
`;
