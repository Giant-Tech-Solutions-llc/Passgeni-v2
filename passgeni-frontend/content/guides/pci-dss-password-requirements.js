// =============================================================
// PASSGENI — GUIDE CONTENT
// pci-dss-password-requirements
// =============================================================

export const toc = [
  { id: "pci-v4-overview",       title: "PCI-DSS v4.0 overview"                 },
  { id: "what-changed",          title: "What changed from v3.2.1"              },
  { id: "requirement-8",         title: "Requirement 8 in full"                 },
  { id: "mfa-requirements",      title: "MFA requirements (expanded)"           },
  { id: "service-accounts",      title: "Service accounts and system passwords" },
  { id: "vendor-default",        title: "Vendor default passwords"              },
  { id: "audit-and-logging",     title: "Audit and logging requirements"        },
  { id: "compliance-deadline",   title: "Compliance timeline"                   },
  { id: "implementation",        title: "Implementation checklist"              },
];

export const contentHtml = `
<h2 id="pci-v4-overview">PCI-DSS v4.0 overview</h2>
<p>PCI-DSS (Payment Card Industry Data Security Standard) version 4.0 was released in March 2022 and became the sole enforceable version in March 2024 when v3.2.1 retired. It governs any organisation that stores, processes, or transmits payment cardholder data — effectively any business that accepts credit or debit card payments directly.</p>
<p>Version 4.0 made the most significant changes to authentication requirements in the standard's history. The headline change: minimum password length increased from 7 characters to 12 characters. But the password-related changes go deeper than that headline number.</p>

<h2 id="what-changed">What changed from v3.2.1</h2>

<table>
  <thead><tr><th>Requirement</th><th>PCI-DSS v3.2.1</th><th>PCI-DSS v4.0</th></tr></thead>
  <tbody>
    <tr><td>Minimum password length</td><td>7 characters</td><td>12 characters</td></tr>
    <tr><td>Character complexity</td><td>Numbers + letters required</td><td>Upper + lower + numbers + special required</td></tr>
    <tr><td>Rotation frequency</td><td>Every 90 days</td><td>Every 90 days (unchanged)</td></tr>
    <tr><td>Password history</td><td>Last 4 passwords</td><td>Last 4 passwords (unchanged)</td></tr>
    <tr><td>Account lockout</td><td>After 6 attempts</td><td>After 10 attempts</td></tr>
    <tr><td>Lockout duration</td><td>30 minutes or until reset</td><td>30 minutes or until reset (unchanged)</td></tr>
    <tr><td>MFA for non-console admin</td><td>Required</td><td>Required (expanded scope)</td></tr>
    <tr><td>MFA for all remote access</td><td>Required</td><td>Required (unchanged)</td></tr>
    <tr><td>MFA for all CDE access</td><td>Not required</td><td>Required (new in v4.0)</td></tr>
    <tr><td>Password/phrase option</td><td>Not mentioned</td><td>Passphrases explicitly permitted</td></tr>
  </tbody>
</table>

<h2 id="requirement-8">Requirement 8 in full</h2>
<p>Requirement 8 governs "Identify Users and Authenticate Access to System Components." The password-specific sub-requirements are:</p>
<ul>
  <li><strong>8.3.6:</strong> Passwords must be at least 12 characters long (or if the system does not support 12, a minimum of 8 with documented compensating control)</li>
  <li><strong>8.3.6 continued:</strong> Passwords must contain both numeric and alphabetic characters (v4.0 also recommends but does not strictly mandate uppercase + special)</li>
  <li><strong>8.3.7:</strong> Passwords cannot be the same as any of the last 4 passwords used</li>
  <li><strong>8.3.9:</strong> Passwords for user accounts must be changed at least every 90 days, unless alternative controls are in place</li>
  <li><strong>8.3.11:</strong> Where passwords are used as authentication for system/application accounts, manage these accounts via: change on schedule based on risk, change as soon as possible after compromise, change at each use (for use-once credentials)</li>
  <li><strong>8.2.6:</strong> Inactive accounts must be removed or disabled within 90 days</li>
  <li><strong>8.2.7:</strong> Accounts used by third parties must be managed and monitored</li>
</ul>
<p>A critical note on Requirement 8.3.9: PCI-DSS v4.0 acknowledges NIST 800-63B's guidance on mandatory rotation in its supplemental guidance, noting that organisations may use risk-based approaches as an alternative to 90-day rotation if they implement compensating controls. However, this requires formal documentation and QSA (Qualified Security Assessor) approval. For most organisations, 90-day rotation for user accounts accessing the Cardholder Data Environment (CDE) remains the safer path.</p>

<div class="callout warning">
  <strong>Passphrase exception:</strong> PCI-DSS v4.0 explicitly permits passphrases as an alternative to passwords (Requirement 8.3.6 guidance). If using passphrases, the minimum is 15 characters. This is the only PCI-DSS version to formally recognise this option.
</div>

<h2 id="mfa-requirements">MFA requirements (expanded)</h2>
<p>The most significant change in v4.0 beyond password length is the expansion of MFA requirements. Under v3.2.1, MFA was required for remote access and non-console administrator access. Under v4.0:</p>
<ul>
  <li><strong>Requirement 8.4.2:</strong> MFA is required for all access into the CDE — not just remote access. This means employees accessing payment systems from inside the corporate network now require MFA.</li>
  <li><strong>Requirement 8.4.3:</strong> MFA is required for all remote network access originating from outside the entity's network.</li>
</ul>
<p>What counts as MFA under PCI-DSS v4.0:</p>
<ul>
  <li>Two of: something you know (password), something you have (hardware token, authenticator app), something you are (biometric)</li>
  <li>Authenticator apps (TOTP) satisfy the "something you have" factor</li>
  <li>SMS OTP is technically permitted but discouraged due to SIM swap vulnerabilities</li>
  <li>Push notification (Duo, Microsoft Authenticator) satisfies the requirement</li>
  <li>Hardware keys (YubiKey, FIDO2) are the most robust option and fully compliant</li>
</ul>

<h2 id="service-accounts">Service accounts and system passwords</h2>
<p>Requirement 8.6 introduced new controls for system and application accounts — passwords used by automated processes rather than humans. These are frequently overlooked but represent significant risk (hardcoded credentials, shared service accounts, never-rotated API keys).</p>
<p>PCI-DSS v4.0 requirements for service accounts:</p>
<ul>
  <li>Interactive logins must be disabled for service accounts where possible</li>
  <li>Where interactive login is enabled, it must be logged, monitored, and justified</li>
  <li>Service account passwords must be at least as strong as user passwords (12+ characters)</li>
  <li>Service account passwords must be changed when the associated personnel change or when compromise is suspected</li>
  <li>Passwords must not be hardcoded in scripts or configuration files — use secrets management systems</li>
</ul>

<h2 id="vendor-default">Vendor default passwords</h2>
<p>Requirement 2.2.2 requires that vendor default passwords are changed before any system component is deployed in the production environment. This applies to:</p>
<ul>
  <li>Network equipment: routers, switches, firewalls</li>
  <li>Point-of-sale terminals and payment hardware</li>
  <li>Database management systems</li>
  <li>Operating system default accounts</li>
  <li>Application default credentials</li>
</ul>
<p>Default credentials are consistently in the top attack vectors for CDE compromises. The Mirai botnet, which caused the 2016 Dyn DDoS attack, was almost entirely powered by default credentials on IoT devices. In the payment environment, default credentials on POS systems and network devices remain a common breach vector.</p>

<h2 id="audit-and-logging">Audit and logging requirements</h2>
<p>Requirement 10 covers logging. Authentication-related logging requirements:</p>
<ul>
  <li>Log all individual user access to cardholder data</li>
  <li>Log all actions by individuals with root or administrative privileges</li>
  <li>Log all invalid logical access attempts</li>
  <li>Log all changes to authentication mechanisms including creation, deletion, and modification</li>
  <li>Retain logs for at least 12 months, with 3 months immediately available for analysis</li>
  <li>Use time-synchronisation technology (NTP) to ensure audit log timestamps are reliable</li>
</ul>

<h2 id="compliance-deadline">Compliance timeline</h2>
<p>PCI-DSS v4.0 became the only valid version in March 2024. All organisations in scope must be fully compliant. Key dates:</p>

<div class="req-row"><span class="req-label">PCI-DSS v4.0 published</span><span class="req-value">March 2022</span></div>
<div class="req-row"><span class="req-label">v3.2.1 retired</span><span class="req-value">March 31, 2024</span></div>
<div class="req-row"><span class="req-label">All new requirements must be met</span><span class="req-value">March 31, 2025</span></div>
<div class="req-row"><span class="req-label">Next version (v4.0.1 or v5.0) expected</span><span class="req-value">2026+</span></div>

<p>Some requirements in v4.0 were marked as "future-dated" — meaning organisations had until March 2025 to implement them. As of 2025, all requirements including the future-dated ones are in effect.</p>

<h2 id="implementation">Implementation checklist</h2>
<ol>
  <li>Update all authentication systems to enforce 12-character minimum (or 15-character minimum if passphrases are supported)</li>
  <li>Ensure complexity: at minimum numbers + letters; aim for upper + lower + numbers + special characters</li>
  <li>Configure 90-day rotation for all user accounts that access the CDE</li>
  <li>Enforce password history: block reuse of last 4 passwords</li>
  <li>Set account lockout to trigger after 10 failed attempts</li>
  <li>Implement MFA for all access into the CDE (not just remote access)</li>
  <li>Implement MFA for all remote access into the cardholder data environment</li>
  <li>Audit and change all vendor default passwords across all in-scope systems</li>
  <li>Implement secrets management for service account credentials — no hardcoded passwords</li>
  <li>Configure authentication event logging on all in-scope systems</li>
  <li>Ensure log retention: 12 months total, 3 months immediately accessible</li>
  <li>Review and disable or remove inactive accounts every 90 days</li>
  <li>Document any deviations with formal compensating controls</li>
</ol>

<div class="callout">
  PassGeni's PCI-DSS v4.0 preset enforces 12-character minimum length and full character set — meeting Requirement 8.3.6. After generation, certify the credential to receive an ES256-signed compliance certificate citing the specific PCI-DSS requirement — giving QSAs machine-verifiable audit evidence. <a href="/guides/how-to-prove-password-compliance-to-auditors" style="color:#c8ff00">See the full audit evidence playbook →</a>
</div>
`;
