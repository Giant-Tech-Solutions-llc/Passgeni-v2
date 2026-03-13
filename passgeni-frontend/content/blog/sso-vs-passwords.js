export const contentHtml = `
<h2>What SSO actually does</h2>
<p>Single Sign-On (SSO) lets users authenticate once to an identity provider (Google Workspace, Okta, Azure AD) and access multiple applications without re-entering credentials. The application doesn't get your password — it gets an assertion from the identity provider that you are who you say you are.</p>
<p>This is genuinely useful for reducing password sprawl and centralising access management. It's also how attackers specifically target high-value organisations.</p>

<h2>The SSO advantage: centralised security</h2>
<p>Every authentication decision flows through one system. You can enforce 2FA, device trust, and geographic restrictions in one place instead of per-application. Offboarding is one action — revoke the identity provider account and access to all connected apps is revoked simultaneously. Audit logs aggregate in one place.</p>

<h2>The SSO risk: single point of failure</h2>
<p>An attacker who compromises your Google Workspace or Okta credentials gets access to every SSO-connected application simultaneously. This is the scenario that makes SSO a high-value target. The 2023 Okta breach is the canonical example — a single compromised support account gave attackers access to customer identity infrastructure.</p>

<h2>When you still need strong standalone passwords</h2>
<ul>
  <li><strong>Applications that don't support SSO:</strong> Legacy systems, niche SaaS tools, and many SME-focused products don't support SAML or OIDC. These get individual passwords.</li>
  <li><strong>Your identity provider account itself:</strong> Your Google, Okta, or Azure AD password is the master key to your SSO-connected applications. This needs to be a strong, unique password with hardware 2FA, not the same password you used at your last employer.</li>
  <li><strong>Backup access:</strong> What happens if your SSO provider has an outage? Every critical system should have a break-glass credential that bypasses SSO, stored in a secure vault.</li>
</ul>

<h2>The practical setup</h2>
<p>Use SSO where available, with a hardware security key as the second factor for your identity provider. For non-SSO applications, generate strong unique passwords with PassGeni and store them in your password manager. Never use the same password for your SSO provider as anything else — it's the most valuable credential in your stack.</p>
`;