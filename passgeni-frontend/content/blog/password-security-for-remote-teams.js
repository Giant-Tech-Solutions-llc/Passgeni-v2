export const contentHtml = `
<h2>The gaps remote work created</h2>
<p>Office-based password policies assumed shared, managed devices and a visible IT department. Remote work broke both assumptions. Here are the five specific gaps that consistently appear in remote team security audits.</p>

<h2>Gap 1: Personal device use</h2>
<p>In the office, most employees used managed corporate devices. At home, they use personal laptops, family-shared computers, and personal phones — none of which have endpoint management, password manager pre-installation, or corporate security policies enforced. Your password policy can say "use a password manager" but without a managed device you can't enforce it.</p>
<p><strong>Fix:</strong> Provide a company-licensed password manager (Bitwarden Teams costs $3/user/month) and make installation a day-one onboarding task. This is the single highest-impact security investment for remote teams.</p>

<h2>Gap 2: Slack password sharing</h2>
<p>Slack, Teams, and Discord messages are searchable, logged, and often exported to third parties for compliance or support. Sharing passwords in Slack DMs is indistinguishable from posting them publicly in practice. Yet in remote teams without a password sharing tool, it happens constantly.</p>
<p><strong>Fix:</strong> PassGeni's <a href="/tools/secure-share">Secure Share</a> creates one-time encrypted links for password sharing. The AES-256 key is in the link fragment — it never reaches any server. Use it for any password that needs to be shared with a colleague.</p>

<h2>Gap 3: Shared account proliferation</h2>
<p>Remote teams tend to accumulate shared accounts — the Twitter login everyone uses for posting, the Canva account for design, the analytics dashboard with one login. Shared accounts mean no accountability, no audit trail, and password changes that cascade across everyone.</p>
<p><strong>Fix:</strong> Audit shared accounts quarterly. For every shared account, either convert to individual logins or store the shared credential in your team password manager with explicit access controls.</p>

<h2>Gap 4: Video call credential exposure</h2>
<p>Screen sharing on Zoom, Meet, or Teams has leaked more credentials than most companies acknowledge. An autofilled password field, a visible browser tab, a terminal with an API key — remote screen sharing creates exposure vectors that never existed in an office.</p>

<h2>Gap 5: Inconsistent onboarding and offboarding</h2>
<p>When someone leaves a remote team, how confident are you that all their credentials are rotated? In an office, you can physically check. Remotely, offboarding credential rotation is often incomplete. Use PassGeni's Team API to generate new credentials for system accounts during offboarding, and your password manager's audit log to identify all accounts a departing employee had access to.</p>
`;