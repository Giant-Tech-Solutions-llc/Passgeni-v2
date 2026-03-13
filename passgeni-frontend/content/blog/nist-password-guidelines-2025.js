export const contentHtml = `
<h2>What NIST SP 800-63B actually says in 2025</h2>
<p>NIST Special Publication 800-63B is the de facto standard for digital identity management in the US. The 2024-2025 revision (63B-4) made changes that directly contradict what most IT departments still enforce. Here are the key updates.</p>

<h2>No more mandatory rotation</h2>
<p>NIST explicitly recommends against periodic password expiration unless there is evidence of compromise. The reasoning: forced rotation leads to weak, predictable patterns ("Password1!" becomes "Password2!" at the next rotation). Users who are forced to change passwords every 90 days converge on the weakest password the policy will accept. NIST now says: only require a change when you know or suspect compromise.</p>

<h2>Length is the primary strength measure</h2>
<p>NIST 800-63B-4 requires a minimum of 8 characters but strongly recommends allowing up to 64 characters. More importantly: NIST says verifiers should not impose composition rules (mandatory uppercase, symbols, etc.). Length is the dominant factor in password strength — a random 16-character lowercase password is significantly stronger than an 8-character password with uppercase, numbers, and symbols.</p>

<h2>Breach checking is now required</h2>
<p>Section 5.1.1.2 of 800-63B requires that passwords be checked against lists of commonly used, expected, or compromised passwords during creation and reset. This is no longer optional guidance — it's a requirement. Acceptable checks include known breach corpuses like Have I Been Pwned, dictionary word lists, and contextual words (username, site name).</p>

<h2>No more SMS-only 2FA for high-value accounts</h2>
<p>NIST has downgraded SMS as a second factor to "restricted authenticator" status — it's no longer acceptable as the sole second factor for high-assurance use cases. Authenticator apps, hardware tokens, or push-based 2FA are the recommended path for sensitive systems.</p>

<h2>The practical implication for your organisation</h2>
<p>If your IT policy still requires 90-day rotation, mandatory symbols, and blocks passwords over 12 characters, it's now out of step with NIST guidance. PassGeni's <a href="/tools/policy-generator">Policy Generator</a> produces NIST 800-63B aligned password policies for free — with citations and implementation guidance. Use it to update your written policy and bring your enforcement in line with the current standard.</p>
`;