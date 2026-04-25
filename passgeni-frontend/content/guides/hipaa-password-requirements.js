// =============================================================
// PASSGENI — GUIDE CONTENT
// hipaa-password-requirements
// =============================================================

export const toc = [
  { id: "what-hipaa-requires",        title: "What HIPAA actually requires"             },
  { id: "minimum-length",             title: "Minimum password length"                  },
  { id: "complexity-requirements",    title: "Complexity requirements"                  },
  { id: "rotation-policy",            title: "Rotation and expiration policy"           },
  { id: "mfa-requirements",           title: "Multi-factor authentication (MFA)"        },
  { id: "audit-controls",             title: "Audit controls and logging"               },
  { id: "emergency-access",           title: "Emergency access procedures"              },
  { id: "policy-template",            title: "HIPAA password policy template"           },
  { id: "hipaa-password-checklist",   title: "Implementation checklist"                 },
];

export const contentHtml = `
<h2 id="what-hipaa-requires">What HIPAA actually requires</h2>
<p>Here is the frustrating truth about HIPAA password requirements: the regulation does not specify an exact minimum password length, a required character set, or a mandatory rotation schedule. What it <em>does</em> specify is the outcome — your organisation must implement "reasonable and appropriate" technical safeguards that protect the confidentiality, integrity, and availability of electronic Protected Health Information (ePHI).</p>
<p>The specific requirements come from two rules within the HIPAA Security Rule (45 CFR Part 164):</p>
<ul>
  <li><strong>§164.312(a)(1) — Access Control</strong>: Assign unique user identification to each person, implement emergency access procedures, implement automatic logoff, and use encryption and decryption where appropriate.</li>
  <li><strong>§164.312(d) — Person or Entity Authentication</strong>: Implement procedures to verify that a person or entity seeking access to ePHI is who they claim to be.</li>
</ul>
<p>Passwords are the primary implementation mechanism for both requirements. Because the regulation leaves implementation specifics to covered entities, HHS has issued supplemental guidance, and most HIPAA auditors rely on NIST SP 800-63B as the authoritative technical reference.</p>

<div class="callout">
  <strong>Key insight:</strong> HIPAA compliance for passwords is primarily about documentation and policy, not just technical controls. A well-documented password policy is as important as the policy itself during an audit.
</div>

<h2 id="minimum-length">Minimum password length</h2>
<p>HIPAA does not mandate a specific minimum, but HHS guidance and industry consensus have converged on the following:</p>

<div class="req-row"><span class="req-label">Minimum length (HHS guidance baseline)</span><span class="req-value">≥ 8 characters</span></div>
<div class="req-row"><span class="req-label">Recommended length (NIST 800-63B / best practice)</span><span class="req-value">≥ 12 characters</span></div>
<div class="req-row"><span class="req-label">Privileged / admin accounts</span><span class="req-value">≥ 16 characters</span></div>
<div class="req-row"><span class="req-label">Service accounts and API keys</span><span class="req-value">≥ 20 characters</span></div>

<p>If your organisation is subject to both HIPAA and PCI-DSS (common for hospitals with payment processing), PCI-DSS v4.0 mandates a minimum of 12 characters, which effectively sets your floor.</p>
<p>Longer passwords are categorically stronger. A 12-character password with a pool of 94 printable ASCII characters has approximately 79 bits of entropy — well beyond the 56-bit threshold below which brute-force attacks become practical with modern hardware.</p>

<h2 id="complexity-requirements">Complexity requirements</h2>
<p>Under the old paradigm (pre-NIST 800-63B), covered entities enforced complexity rules: uppercase, lowercase, numbers, and special characters required. NIST 800-63B revised this guidance in 2017 and again in 2020. The current NIST position is:</p>
<ul>
  <li>Complexity requirements add burden without proportional security improvement when length is sufficient</li>
  <li>Complexity rules cause users to make predictable substitutions (<code>P@ssw0rd</code>) that are trivially defeated</li>
  <li>Length is a more reliable predictor of password strength than character diversity</li>
</ul>
<p>However, HIPAA auditors are not uniformly aligned with NIST's updated guidance. Many legacy audit frameworks still reward complexity requirements. A pragmatic HIPAA-compliant approach:</p>
<ul>
  <li>Require at least 3 of 4 character types: uppercase, lowercase, numbers, symbols</li>
  <li>Reject passwords containing the username, common words, or sequences (<code>123456</code>, <code>qwerty</code>)</li>
  <li>Check new passwords against known-breached credential lists (HIBP API)</li>
  <li>For high-privilege accounts, require all 4 character types and a minimum of 16 characters</li>
</ul>

<h2 id="rotation-policy">Rotation and expiration policy</h2>
<p>This is the area where HIPAA and NIST guidance diverge most sharply from traditional IT policy.</p>
<p><strong>Traditional guidance (pre-2017):</strong> Force password rotation every 60–90 days. Many legacy HIPAA audit frameworks still reflect this.</p>
<p><strong>NIST 800-63B (current):</strong> Do not require periodic rotation unless there is evidence of compromise. Mandatory rotation causes users to choose weaker passwords with predictable patterns (<code>Password1!</code>, <code>Password2!</code>).</p>
<p>The practical HIPAA-compliant position in 2025:</p>

<div class="req-row"><span class="req-label">Standard user accounts (no evidence of breach)</span><span class="req-value">No mandatory rotation</span></div>
<div class="req-row"><span class="req-label">Privileged / admin accounts</span><span class="req-value">90 days or on role change</span></div>
<div class="req-row"><span class="req-label">On confirmed or suspected compromise</span><span class="req-value">Immediate rotation required</span></div>
<div class="req-row"><span class="req-label">On employee termination</span><span class="req-value">Immediate deactivation, rotation of shared accounts</span></div>
<div class="req-row"><span class="req-label">On vendor/contractor access end</span><span class="req-value">Same day deactivation</span></div>

<p>If your organisation still enforces 90-day rotation, ensure your password policy explicitly states that this is a documented organisational decision and reference the NIST guidance as context.</p>

<h2 id="mfa-requirements">Multi-factor authentication (MFA)</h2>
<p>HIPAA does not explicitly require MFA. However, as of 2025, MFA for ePHI access is essentially required in practice for two reasons:</p>
<ol>
  <li><strong>Enforcement trend:</strong> HHS breach investigations and settlements increasingly treat the absence of MFA as a contributing factor to violations. The January 2024 HHS cybersecurity guidance specifically recommended MFA as a high-priority control.</li>
  <li><strong>Cyber insurance requirements:</strong> Most cyber insurance policies covering HIPAA-regulated entities now require MFA as a policy condition. Operating without it may void coverage in the event of a breach.</li>
</ol>
<p>MFA implementation requirements by access type:</p>
<ul>
  <li><strong>Required immediately:</strong> All remote access (VPN, RDP, remote desktop)</li>
  <li><strong>Required immediately:</strong> EHR/EMR system access for clinical staff</li>
  <li><strong>Required immediately:</strong> Admin console and privileged account access</li>
  <li><strong>Strongly recommended:</strong> All internal access to systems storing ePHI</li>
  <li><strong>Acceptable without MFA:</strong> Physical workstations in secured clinical areas with automatic logoff and physical access controls</li>
</ul>

<h2 id="audit-controls">Audit controls and logging</h2>
<p>§164.312(b) requires covered entities to "implement hardware, software, and/or procedural mechanisms that record and examine activity in information systems that contain or use ePHI." For password systems specifically, this means:</p>
<ul>
  <li>Log all failed authentication attempts with timestamp, user ID, and source IP</li>
  <li>Implement account lockout after a configurable number of failures (typically 5–10)</li>
  <li>Log all successful logins and logoffs to ePHI systems</li>
  <li>Log all password changes, resets, and account modifications</li>
  <li>Retain authentication logs for a minimum of 6 years (HIPAA's 6-year retention requirement)</li>
  <li>Review audit logs periodically — the frequency should be documented in your policy</li>
</ul>
<p>Automatic logoff (§164.312(a)(2)(iii)) requires that sessions terminate after a defined period of inactivity. Typical implementations:</p>

<div class="req-row"><span class="req-label">Workstations in clinical areas</span><span class="req-value">15 minutes inactivity</span></div>
<div class="req-row"><span class="req-label">Administrative workstations</span><span class="req-value">30 minutes inactivity</span></div>
<div class="req-row"><span class="req-label">Remote access sessions</span><span class="req-value">15–30 minutes inactivity</span></div>
<div class="req-row"><span class="req-label">Mobile devices with ePHI</span><span class="req-value">2–5 minutes inactivity</span></div>

<h2 id="emergency-access">Emergency access procedures</h2>
<p>§164.312(a)(2)(ii) requires a documented emergency access procedure — a way to access ePHI if normal access controls fail. This is often misunderstood. HIPAA is <em>not</em> saying you must have a back door. It is saying you must have a documented plan for the scenario where normal authentication is unavailable (e.g., directory server failure during a code blue).</p>
<p>Compliant emergency access implementations include:</p>
<ul>
  <li>Break-glass accounts: highly privileged accounts stored in a physical sealed envelope in the clinical director's office, logged and audited every use</li>
  <li>Offline password vault: encrypted credential store accessible without network connectivity</li>
  <li>Documented manual override procedure that requires dual-authorisation and creates an automatic audit trail</li>
</ul>

<h2 id="policy-template">HIPAA password policy template</h2>
<p>Every covered entity needs a written password policy. Below is a template structure that satisfies HIPAA audit requirements. Customise the bracketed fields for your organisation.</p>
<ul>
  <li><strong>Policy name:</strong> Password and Authentication Security Policy</li>
  <li><strong>Policy owner:</strong> [CISO / IT Director / Privacy Officer]</li>
  <li><strong>Effective date:</strong> [Date]</li>
  <li><strong>Review cycle:</strong> Annual</li>
  <li><strong>Scope:</strong> All workforce members, contractors, and business associates who access systems containing ePHI</li>
  <li><strong>Minimum length:</strong> 12 characters for standard accounts, 16 for privileged accounts</li>
  <li><strong>Complexity:</strong> Must include at least 3 of: uppercase letters, lowercase letters, numbers, special characters</li>
  <li><strong>Prohibited patterns:</strong> Username, organisation name, common words, sequential characters, previously used passwords (last 12)</li>
  <li><strong>Rotation:</strong> [Choose: annual for standard / 90-day for privileged] or on evidence of compromise</li>
  <li><strong>MFA:</strong> Required for all remote access and EHR access</li>
  <li><strong>Account lockout:</strong> After 5 consecutive failures; 30-minute lockout or administrator unlock</li>
  <li><strong>Session timeout:</strong> 15 minutes for clinical workstations, 30 minutes for administrative systems</li>
  <li><strong>Password manager:</strong> Recommended and supported; employees may use an organisation-approved password manager</li>
  <li><strong>Emergency access:</strong> Break-glass procedure as documented in [Emergency Access Procedure document]</li>
</ul>

<h2 id="hipaa-password-checklist">Implementation checklist</h2>
<p>Use this checklist when preparing for a HIPAA audit or implementing HIPAA-compliant password controls for the first time:</p>
<ol>
  <li>Written password policy exists, is dated, signed, and accessible to all workforce members</li>
  <li>Minimum 12-character password length enforced in all systems touching ePHI</li>
  <li>Complexity requirements enforced at the system level, not just by policy</li>
  <li>Passwords checked against known-breached credential lists on creation and reset</li>
  <li>MFA enabled for all remote access and EHR/EMR access</li>
  <li>Account lockout after 5–10 failed attempts, documented in policy</li>
  <li>Automatic session timeout configured for all ePHI-adjacent workstations</li>
  <li>Authentication event logging enabled, logs retained for 6 years</li>
  <li>Log review process documented and scheduled</li>
  <li>Emergency access procedure documented, tested, and stored securely</li>
  <li>Password reset procedure documented — especially for email-based self-service reset</li>
  <li>Employee onboarding includes password security training</li>
  <li>Policy review scheduled annually or after any relevant breach or regulation update</li>
</ol>

<div class="callout">
  <strong>Generate and certify a HIPAA-compliant password.</strong> PassGeni's HIPAA preset enforces minimum 12-character length, full character set, and entropy requirements per HHS guidance. After generation, click 'Certify this password' to receive an ES256-signed compliance certificate — machine-readable audit evidence for §164.312 assessments. <a href="/guides/what-is-a-compliance-certificate" style="color:#c8ff00">Learn how compliance certificates work →</a>
</div>
`;
