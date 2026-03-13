export const contentHtml = `
<h2>What Have I Been Pwned is</h2>
<p>Have I Been Pwned (HIBP) is a free service created by Troy Hunt that aggregates data from publicly known data breaches. As of 2025, it contains over 12 billion compromised accounts from more than 800 breaches, including the largest credential leaks in history. When you check a password, you're checking whether it appears in this aggregate dataset.</p>

<h2>The k-anonymity implementation</h2>
<p>The clever part of HIBP's password checking API is that your actual password never leaves your device. Here is exactly how it works:</p>
<ol>
  <li>Your browser computes the SHA-1 hash of your password locally. SHA-1 of "password123" = "cbfdac6008f9cab4083784cbd1874f76618d2a97"</li>
  <li>Only the first 5 characters of that hash are sent to HIBP's API: "CBFDA"</li>
  <li>HIBP returns a list of all hashes in its database that start with those 5 characters — hundreds of them, all different passwords</li>
  <li>Your browser checks locally whether your full hash appears in that list</li>
  <li>HIBP never saw your full hash. HIBP cannot determine which password you were checking</li>
</ol>
<p>This is k-anonymity: your query is indistinguishable from any other query that shares the same 5-character prefix. Even if HIBP's API was monitored, an observer would see "CBFDA" and have no idea which specific password from the thousands with that prefix was being checked.</p>

<h2>How PassGeni implements this</h2>
<p>PassGeni's <a href="/tools/breach-checker">breach checker</a> uses exactly this implementation. The SHA-1 hash is computed in your browser using the Web Crypto API. Only the 5-character prefix is sent. The full list of matching hashes is returned and checked locally. Nothing identifying your password reaches any server — PassGeni's or HIBP's.</p>
<p>You can verify this yourself: open DevTools (F12), go to the Network tab, run a breach check, and inspect the outgoing request. You'll see only the 5-character prefix in the URL.</p>

<h2>What it means when a password is flagged</h2>
<p>A flagged password doesn't mean your account was specifically breached — it means the password appears in at least one breach dataset. The count shown tells you how many times it appeared. "password" appears over 9 million times. Even a single appearance means the password is in attacker wordlists and should never be used.</p>
<p>Change any flagged password immediately on every site where you've used it. Use PassGeni to generate a replacement with verified high entropy.</p>
`;