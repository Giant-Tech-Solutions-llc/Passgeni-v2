// =============================================================
// PASSGENI — GUIDE CONTENT: soc2-password-requirements
// =============================================================

export const toc = [
  { id: "what-is-soc2",        title: "What SOC 2 actually is"               },
  { id: "cc6-1-breakdown",     title: "CC6.1 logical access controls"         },
  { id: "what-auditors-check", title: "What auditors look for"               },
  { id: "password-controls",   title: "Password controls that satisfy CC6.1" },
  { id: "mfa-expectations",    title: "MFA expectations for SaaS companies"   },
  { id: "documentation",       title: "Documentation requirements"           },
  { id: "privileged-access",   title: "Privileged access and admin accounts" },
  { id: "checklist",           title: "SOC 2 password checklist"             },
];

export const contentHtml = `
<h2 id="what-is-soc2">What SOC 2 actually is</h2>
<p>SOC 2 is an auditing standard developed by the American Institute of Certified Public Accountants (AICPA) that evaluates how service organisations handle customer data. Unlike prescriptive standards such as PCI-DSS, SOC 2 is principles-based — it describes outcomes rather than specific technical controls. This gives SaaS companies flexibility in implementation, but it also means that the audit is a judgment call by an independent CPA firm, not a checkbox exercise.</p>
<p>SOC 2 evaluates against five Trust Service Criteria: Security, Availability, Processing Integrity, Confidentiality, and Privacy. The Security criterion is mandatory for all SOC 2 reports. Password controls fall primarily under the Security criterion, specifically under Common Criteria 6 (CC6): Logical and Physical Access Controls.</p>

<h2 id="cc6-1-breakdown">CC6.1 logical access controls</h2>
<p>CC6.1 is the specific criterion that governs access controls to protected data and systems. The full text reads: "The entity implements logical access security software, infrastructure, and architectures over protected information assets to protect them from security events to meet the entity's objectives."</p>
<p>The AICPA supplemental guidance for CC6.1 identifies several "points of focus" — areas auditors use to evaluate whether the criterion is met. The most relevant to password controls:</p>
<ul>
  <li><strong>Identifies and authenticates users:</strong> The entity identifies and authenticates users before allowing access to protected information or systems</li>
  <li><strong>Restricts access based on business requirements:</strong> Access is granted to authorised users in a manner that meets business objectives — least privilege</li>
  <li><strong>Considers network segmentation:</strong> Access paths to sensitive systems are restricted</li>
  <li><strong>Manages points of access:</strong> Points of access to the system are identified and security controls are implemented at those points</li>
  <li><strong>Authenticates with the environment:</strong> Users are identified and authenticated for both local and remote access</li>
</ul>

<h2 id="what-auditors-check">What auditors look for</h2>
<p>SOC 2 auditors evaluate evidence over a period — typically 6 or 12 months for a Type II report. For password controls, the evidence they want to see:</p>
<ul>
  <li><strong>Written policy:</strong> A documented password policy that sets minimum standards. The policy must be approved, dated, and distributed to all relevant personnel.</li>
  <li><strong>Technical enforcement:</strong> Screen-shot or system configuration evidence showing that the technical controls enforce the policy — not just that the policy exists. A written policy saying "12-character minimum" that is not enforced at the system level is a finding.</li>
  <li><strong>Access review logs:</strong> Evidence that user access is reviewed periodically (typically quarterly). This includes who has access to what, and how that access was granted and removed.</li>
  <li><strong>MFA evidence:</strong> Configuration screenshots or access logs showing MFA is enabled for privileged accounts and, increasingly, for all accounts with access to sensitive systems.</li>
  <li><strong>Terminated user procedures:</strong> Evidence showing that access is revoked promptly when employees leave — usually expected within 24 hours of departure.</li>
  <li><strong>Vendor/third-party access:</strong> How external access is granted, monitored, and terminated.</li>
</ul>

<div class="callout warning">
  <strong>Type I vs Type II:</strong> A SOC 2 Type I report evaluates controls at a point in time. Type II evaluates controls over a 6–12 month period. If you are going through SOC 2 Type II, you need to demonstrate that these controls were <em>operational</em> consistently — not just configured correctly on audit day.
</div>

<h2 id="password-controls">Password controls that satisfy CC6.1</h2>
<p>SOC 2 does not specify exact values for minimum length or complexity. Auditors evaluate whether controls are "reasonable and appropriate" for the sensitivity of the data being protected. Based on current audit practice and the AICPA guidance:</p>

<div class="req-row"><span class="req-label">Minimum password length (standard accounts)</span><span class="req-value">≥ 12 characters</span></div>
<div class="req-row"><span class="req-label">Minimum password length (admin/privileged)</span><span class="req-value">≥ 16 characters</span></div>
<div class="req-row"><span class="req-label">Character complexity</span><span class="req-value">At least 3 of 4 types</span></div>
<div class="req-row"><span class="req-label">Breached credential check</span><span class="req-value">Required at creation and reset</span></div>
<div class="req-row"><span class="req-label">Account lockout threshold</span><span class="req-value">5–10 failed attempts</span></div>
<div class="req-row"><span class="req-label">Password history</span><span class="req-value">Last 10–12 passwords</span></div>
<div class="req-row"><span class="req-label">Session timeout</span><span class="req-value">≤ 30 minutes inactivity</span></div>

<p>These represent consensus auditor expectations. A SaaS company storing sensitive customer data whose controls fall below these thresholds is likely to receive a qualified opinion or a management letter finding.</p>
<p>Note that SOC 2 auditors are frequently more demanding than HIPAA or ISO 27001 auditors on the privileged access side — the 16-character minimum for admin accounts is genuinely expected, not just recommended.</p>

<h2 id="mfa-expectations">MFA expectations for SaaS companies</h2>
<p>MFA has moved from "recommended" to effectively required in SOC 2 audits. The specific expectations depend on the auditor and the scope of the audit, but the industry baseline as of 2025:</p>
<ul>
  <li><strong>Required without exception:</strong> MFA for all production system access — cloud console, deployment pipelines, database access, secrets management</li>
  <li><strong>Required without exception:</strong> MFA for all VPN and remote access</li>
  <li><strong>Required for privileged users:</strong> MFA for all administrative accounts in all environments</li>
  <li><strong>Expected:</strong> MFA for all employee access to internal systems (SaaS tools, communication platforms, code repositories)</li>
  <li><strong>Documentation:</strong> A written MFA policy and evidence of enforcement (IdP configuration screenshots, SSO configuration logs)</li>
</ul>
<p>The acceptable MFA methods for SOC 2 purposes follow NIST AAL2 guidance: TOTP authenticator apps (Google Authenticator, Authy, 1Password), push notifications (Duo, Okta), or hardware keys (YubiKey). SMS OTP is generally not challenged by auditors but increasingly noted as a risk in management letters.</p>

<div class="callout">
  <strong>Hardware key recommendation:</strong> For admin and production access, FIDO2 hardware keys (YubiKey 5 series) provide phishing-resistant authentication that satisfies NIST AAL3. They eliminate the push fatigue attack vector and are increasingly expected for privileged access in security-conscious SOC 2 audits. <a href="https://www.yubico.com/products/yubikey-5-overview/?utm_source=passgeni&utm_medium=guide&utm_campaign=soc2" style="color:#C8FF00;" target="_blank" rel="noopener">YubiKey 5 series →</a>
</div>

<h2 id="documentation">Documentation requirements</h2>
<p>SOC 2 is a documentation-heavy audit. For password and access controls specifically, you need:</p>
<ol>
  <li><strong>Information Security Policy:</strong> Top-level policy that establishes the security program and delegates to specific sub-policies</li>
  <li><strong>Access Control Policy:</strong> Minimum password standards, MFA requirements, session management, account lockout</li>
  <li><strong>User Access Management Procedure:</strong> How access is granted, modified, and revoked — including timelines for each</li>
  <li><strong>Privileged Access Management Procedure:</strong> How admin/privileged credentials are managed, rotated, and audited</li>
  <li><strong>Access Review Evidence:</strong> Completed periodic access reviews — typically quarterly, with sign-off from the reviewer</li>
  <li><strong>Onboarding/Offboarding Logs:</strong> Evidence showing access was granted and revoked in accordance with policy timelines</li>
</ol>
<p>All policy documents should be version-controlled with an effective date and the approver identified. Auditors look for policies that are actively maintained, not last updated two years ago.</p>

<h2 id="privileged-access">Privileged access and admin accounts</h2>
<p>Privileged access management is one of the most scrutinised areas in SOC 2 audits. The standard expectation:</p>
<ul>
  <li>Admin accounts should be separate from standard user accounts — no dual-use (same account for daily email and production console access)</li>
  <li>Admin credentials must use unique, randomly generated passwords of 16+ characters</li>
  <li>Admin accounts require hardware MFA (YubiKey or equivalent), not just TOTP</li>
  <li>Shared admin credentials are a finding — each admin needs an individually attributed account</li>
  <li>Break-glass accounts (emergency access) must be documented, secured, and audited on every use</li>
  <li>Admin access must be reviewed at least quarterly, with role changes triggering immediate review</li>
  <li>Credentials in source code, configuration files, or CI/CD pipelines are findings — use secrets management (HashiCorp Vault, AWS Secrets Manager, etc.)</li>
</ul>

<h2 id="checklist">SOC 2 password checklist</h2>
<ol>
  <li>Written Access Control Policy exists, is version-controlled, and was reviewed within the past 12 months</li>
  <li>Minimum 12-character password length technically enforced for standard accounts</li>
  <li>Minimum 16-character password length technically enforced for admin and privileged accounts</li>
  <li>MFA required and enforced for all admin and production system access</li>
  <li>MFA required for all VPN and remote access</li>
  <li>Account lockout after 5–10 failed attempts, configured in IdP</li>
  <li>Session timeout ≤ 30 minutes configured for sensitive systems</li>
  <li>Quarterly access reviews completed and documented, with evidence</li>
  <li>Terminated user offboarding process documented, with completion within 24 hours</li>
  <li>No shared admin credentials — each admin has individually attributed account</li>
  <li>No credentials in source code or configuration files — secrets management system in use</li>
  <li>Break-glass accounts documented, secured, and audit-logged</li>
  <li>Vendor/third-party access documented with defined scope and expiry</li>
</ol>

<div class="callout">
  PassGeni's SOC 2 preset generates 16-character minimum credentials with full character set — matching CC6.1 expectations. After generation, certify the credential to receive an ES256-signed certificate your auditor can verify independently. Stack certificates across your audit period to demonstrate consistent enforcement for SOC 2 Type II. <a href="/guides/how-to-prove-password-compliance-to-auditors" style="color:#c8ff00">Full SOC 2 evidence package guide →</a>
</div>
`;
