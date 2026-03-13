export const contentHtml = `
<h2>Zero-knowledge: two different meanings in security</h2>
<p>"Zero-knowledge" means two different things that are often conflated. The first is zero-knowledge proofs (ZKP) — a mathematical technique where one party proves knowledge of a value without revealing the value. The second is zero-knowledge architecture — a system design where the service provider has no technical ability to access user data. Understanding the difference matters because many tools claiming "zero-knowledge" mean the architectural property, not the cryptographic one.</p>

<h2>Zero-knowledge proofs in authentication: SRP</h2>
<p>The Secure Remote Password (SRP) protocol uses a zero-knowledge proof approach: your client proves to the server that it knows your password without ever transmitting the password or anything from which the password could be derived. The server stores a verifier (a value derived from your password that can verify proofs but cannot reverse to the password). Even if the server is fully compromised, the attacker cannot recover passwords.</p>
<p>1Password uses SRP for authentication to their servers. This is the cryptographic meaning of zero-knowledge in a password context — technically stronger than simply encrypting your password before transmission.</p>

<h2>Zero-knowledge architecture: PassGeni's approach</h2>
<p>PassGeni's zero-knowledge claim is architectural, not ZKP-based: passwords are generated entirely in your browser using <code>crypto.getRandomValues()</code>. No password data is transmitted to PassGeni's servers. Ever. The server cannot access your passwords because they never arrive at the server.</p>
<p>This is verifiable: open Developer Tools (F12), switch to the Network tab, and generate a password. You'll see the requests PassGeni makes — none of them contain password data. This is the "verify, don't trust" approach to zero-knowledge claims.</p>

<h2>How to verify a tool's zero-knowledge claim</h2>
<p>Any tool claiming zero-knowledge should be verifiable, not taken on faith. For client-side tools like PassGeni: check the Network tab and confirm no password data leaves the browser. For server-side vaults like 1Password: look for audit reports from independent security firms and SRP-based authentication in the technical documentation. For tools you can't verify: treat the claim as marketing, not security architecture.</p>
<p>The PassGeni <a href="/guides/what-is-zero-knowledge-architecture">zero-knowledge guide</a> covers the full architecture in detail — including the specific browser APIs used and how to audit them yourself.</p>
`;