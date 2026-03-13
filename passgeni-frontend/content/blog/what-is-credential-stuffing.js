export const contentHtml = `
<h2>Where the credentials come from</h2>
<p>Over 12 billion username/password combinations are available for purchase on dark web markets right now. They come from thousands of data breaches over the past 15 years. LinkedIn (2016), Adobe (2013), RockYou (2009), Collection #1 (2019) — every major breach contributes to the pile. These lists are sorted, deduped, and sold for a few hundred dollars per billion records.</p>

<h2>How credential stuffing attacks actually work</h2>
<p>An attacker buys a credential list and runs it through a tool like Sentry MBA or SNIPR configured for a specific target site. The tool handles rate limiting, CAPTCHA solving (via bypass services), and proxy rotation to avoid IP blocks. It tests hundreds of thousands of username/password pairs per hour, automatically logging successful logins.</p>
<p>The key insight: the attacker isn't trying to crack your password. They're testing whether your leaked password from LinkedIn also works on your bank, because they know most people reuse passwords across sites.</p>

<h2>Why your 'unique' password actually needs to be unique</h2>
<p>Password reuse is the entire attack surface for credential stuffing. A completely unique password on every site means a credential stuffing attack using your LinkedIn credentials will fail on every other site — the attacker gets one account and nothing more.</p>
<p>This is impossible to manage manually. You need a password manager, or you need to use PassGeni to generate and use genuinely unique passwords for every account. Using the same base password with minor variations ("Netflix1", "Amazon1", "Gmail1") doesn't help — attackers run rule-based variations automatically.</p>

<h2>The breach checker as your first line of defence</h2>
<p>PassGeni's <a href="/tools/breach-checker">breach checker</a> uses k-anonymity to check your passwords against 12+ billion compromised credentials without revealing your actual password. If a password comes back as compromised, change it immediately — on that site and every other site where you used it.</p>
<p>Run your important passwords through the breach checker now. Your email, banking, and any work credentials should be checked first. A positive result isn't the end of the world — it's information you need to act on.</p>
`;