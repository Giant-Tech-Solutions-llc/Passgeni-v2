export const contentHtml = `
<h2>The hidden breach surface: API keys</h2>
<p>API keys are credentials, but they're often treated as configuration rather than secrets. They end up in .env files committed to GitHub, hardcoded in mobile apps, logged in server access logs, and passed in URL query strings where they're visible in browser history and server logs. The consequences are real: exposed AWS keys have resulted in six-figure cloud bills within hours of exposure.</p>

<h2>Generation: what a good API key looks like</h2>
<p>A strong API key should have at least 128 bits of cryptographic randomness — roughly 32 hexadecimal characters or 22 base64url characters. It should be generated using a cryptographically secure random number generator, not a hash of predictable inputs. PassGeni's Team plan generates API keys using this standard — pg_live_ prefix, 40 random hex characters, SHA-256 hashed before storage.</p>

<h2>Storage: never commit, never log</h2>
<ul>
  <li>Store API keys in environment variables, not in code files. Use <code>.env</code> for local development and your CI/CD platform's secret store for deployed environments.</li>
  <li>Add <code>.env</code> to <code>.gitignore</code> immediately when creating a project — before your first commit.</li>
  <li>Audit your existing git history for committed secrets: <code>git log --all --full-history -- .env</code></li>
  <li>Never log API keys, even in debug output. Use request IDs or key prefixes (first 8 characters) for log correlation.</li>
  <li>Never pass API keys in URL query parameters — they appear in access logs, browser history, and referrer headers.</li>
</ul>

<h2>Scope restriction: principle of least privilege</h2>
<p>Most API key systems allow you to restrict a key's permissions. A key used to read analytics data should not have write access. A key for a frontend widget should not have admin access. Scope every key to the minimum permissions required for its specific use case.</p>

<h2>Rotation: when and how</h2>
<p>Rotate API keys when: a team member with access leaves; you suspect exposure; you're doing a security audit; or you're decommissioning a service that had access. Build rotation into your offboarding checklist. PassGeni's Team dashboard provides one-click key rotation with immediate invalidation of the old key.</p>

<h2>Leak detection</h2>
<p>Set up GitHub secret scanning (free for public repos, available for private repos with Advanced Security). Configure AWS CloudTrail, GCP Audit Logs, or equivalent for unusual API call patterns. Services like GitGuardian monitor commits in real time for credential patterns. For critical keys, set up alerts on first-use from a new IP range.</p>
`;