export const contentHtml = `
<h2>The pattern across 2024's major breaches</h2>
<p>2024 included some of the largest credential compromises in history. Looking across them, three patterns appear repeatedly. None of them require sophisticated nation-state techniques. Most require basic operational security that the breached organisations didn't have.</p>

<h2>Pattern 1: Valid credentials, no 2FA</h2>
<p>In breach after breach, attackers used legitimate credentials obtained via phishing, credential stuffing, or infostealer malware. There was no vulnerability exploitation, no zero-day — just a working username and password and no second factor to stop the login.</p>
<p>The defence is straightforward: enforce 2FA on every externally-accessible system, and use an authenticator app rather than SMS where possible. The organisations that were breached this way had 2FA available but not enforced, or enforced only for some users.</p>

<h2>Pattern 2: Service account and API credential exposure</h2>
<p>Service accounts — automated processes that authenticate to systems — frequently had weak or default passwords, no rotation policy, and no monitoring. API keys committed to Git repositories (even private ones) were discovered and exploited. Hardcoded credentials in configuration files found their way into breaches through third-party vendor access.</p>
<p>Service account password hygiene is consistently worse than user account hygiene. Use PassGeni's <a href="/api-docs">Team API</a> to generate compliant service account credentials, and check your Git history for committed secrets using tools like git-secrets or TruffleHog.</p>

<h2>Pattern 3: Credential reuse across personal and work accounts</h2>
<p>Several 2024 breaches traced back to employees reusing passwords between personal accounts (which were previously breached) and work accounts. When the personal breach leaked plaintext or weakly-hashed credentials, attackers tested them on corporate VPN, email, and SaaS platforms.</p>
<p>This is credential stuffing applied at the individual level. The defence is password uniqueness — every account needs a different password. Run your work credentials through the <a href="/tools/breach-checker">breach checker</a> to identify any that appear in known breach databases.</p>

<h2>The common thread</h2>
<p>None of 2024's major credential-based breaches required novel attack techniques. They exploited the same three gaps that have driven breaches for a decade: missing 2FA, weak service account credentials, and password reuse. The technology to prevent all three exists and is largely free. The gap is consistently implementation and enforcement, not tooling.</p>
`;