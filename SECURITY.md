# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| Latest (main) | ✅ Active security fixes |
| Prior releases | ❌ No backports |

We maintain a single production branch (`main`). All security fixes are applied to `main` and deployed immediately to [passgeni.ai](https://passgeni.ai).

---

## Reporting a Vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

Public disclosure of an unpatched vulnerability puts every PassGeni user at risk. Please follow responsible disclosure:

### How to report

**Email:** [security@passgeni.ai](mailto:security@passgeni.ai)

Include as much of the following as you can:

- **Description** — What is the vulnerability? What code or endpoint is affected?
- **Impact** — What can an attacker do with it?
- **Reproduction steps** — How can we reproduce it? (screenshots, request logs, proof-of-concept code)
- **Your environment** — Browser, OS, PassGeni plan (Free / Pro / Team), any relevant context
- **Your contact** — So we can ask follow-up questions and credit you if appropriate

We accept PGP-encrypted reports. Contact us first and we will send our public key.

---

## Response SLA

| Step | Timeline |
|------|----------|
| Initial acknowledgement | Within 48 hours |
| Severity assessment | Within 72 hours |
| Fix for critical/high | Within 7 days |
| Fix for medium | Within 30 days |
| Fix for low | Next scheduled release |
| Public disclosure (coordinated) | After fix is live |

We will keep you informed at each stage and credit you in the security advisory unless you prefer to remain anonymous.

---

## Scope

### In scope

- **passgeni.ai** (production website and API)
- **This repository** (source code vulnerabilities: XSS, injection, auth bypass, IDOR, cryptographic weaknesses)
- **Chrome / Safari / Firefox behavior** of the client-side generation, breach check, and secure share tools
- **Supabase Row Level Security (RLS)** bypasses
- **Paddle webhook signature verification** weaknesses
- **NextAuth session** vulnerabilities

### Out of scope

- Denial of service attacks (rate limiting, resource exhaustion)
- Social engineering attacks targeting PassGeni staff
- Physical attacks on infrastructure
- Vulnerabilities in third-party services (Supabase, Vercel, Paddle, Resend) — report those to the respective vendors
- Self-XSS that requires the attacker to already be authenticated as the target user
- Missing security headers if they do not result in a practical exploit
- SPF/DKIM/DMARC email configuration issues
- Vulnerabilities requiring MITM on the user's own network
- Issues in outdated browsers we do not support (IE, pre-Chromium Edge)

---

## PassGeni Security Architecture

PassGeni is designed with the following security properties:

### Zero-knowledge password generation

Passwords are generated using `crypto.getRandomValues()` — the browser's CSPRNG. No password, passphrase, or generator setting is ever transmitted to our servers. This is verifiable by inspecting the network tab in browser DevTools while using the generator.

### k-Anonymity breach check

When checking if a password has appeared in a breach, we:
1. Compute `SHA-1(password)` locally in the browser
2. Send only the **first 5 characters** of the hex hash to the [Have I Been Pwned](https://haveibeenpwned.com/API/v3) API
3. Receive a list of hash suffixes back
4. Compare the full hash locally

Your password never leaves your browser during a breach check.

### AES-256-GCM Secure Share

When using the Secure Share tool:
1. A random AES-256-GCM key is generated in the browser
2. The secret is encrypted locally
3. The decryption key is embedded in the **URL fragment** (`#k=...`)
4. URL fragments are **never sent to servers** by HTTP specification
5. Our server receives and stores only the encrypted ciphertext

Even a full compromise of our Supabase database would yield only AES-256-GCM ciphertext with no key.

### Authentication

PassGeni uses **magic link authentication** (passwordless). We never store user passwords. Authentication tokens are single-use, short-lived JWTs managed by NextAuth v4.

---

## Responsible Disclosure Recognition

We are grateful to security researchers who help keep PassGeni safe. We will:

- Acknowledge your contribution in the security advisory (unless you prefer anonymity)
- Provide a written letter of thanks for significant findings
- Consider bug bounty rewards for critical vulnerabilities (evaluated case-by-case)

We do not currently maintain a formal bug bounty program but we treat all good-faith researchers with respect and appreciation.

---

## Security Contacts

| Role | Contact |
|------|---------|
| Security reports | security@passgeni.ai |
| General support | support@passgeni.ai |
| Company | Giant Tech Solutions LLC |

_Last updated: April 2026_
