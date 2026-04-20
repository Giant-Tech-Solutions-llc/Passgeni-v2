# PassGeni v2 — ProductHunt Launch Assets

## Tagline (60 chars)
Compliance certificates for passwords — HIPAA, NIST, PCI

## Description (260 chars)
PassGeni generates zero-storage passwords that are cryptographically proven compliant. ES256-signed certificates verify entropy, character pool, and standards met — for HIPAA, PCI-DSS, SOC 2, ISO 27001, NIST, and FIPS. Free to try.

## Topics
Security, Compliance, Developer Tools, SaaS, Productivity

## First Comment (Maker Comment)
Hey PH! 👋

I built PassGeni after watching compliance teams manually screenshot password generators to "prove" their credentials met HIPAA or PCI requirements during audits. That's not auditable — it's theater.

PassGeni v2 fixes this with a proper cryptographic proof: ES256-signed compliance certificates that embed entropy bits, character pool size, and the exact standards met. Verifiable offline. Shareable by URL. Revocable.

**What's new in v2:**
- Compliance monitoring dashboard (score, risks, expiry alerts)
- Team workspaces with shared cert pools (Authority plan)
- Org-level compliance policy engine
- Public certificate verification at /cert/[id] — no login required, no PassGeni server call needed
- 14-day free trial, no card required

Would love your feedback on which standards to prioritize next — SOX? GDPR? FedRAMP? Drop a comment below.

---

## Screenshots Needed
1. **Dashboard** — compliance score ring + certificate table (show green score, 2-3 certs)
2. **Certificate page** `/cert/[id]` — verification badge + metadata (ES256 signature, entropy bits)
3. **Team management page** — members table + policy dropdown
4. **Generator** — password output with compliance preset selected (e.g. HIPAA)

**Dimensions:** 1270×760px recommended (16:9). Dark background (#060608) renders well.

## Demo GIF (30 seconds)
Suggested flow:
1. Homepage — type into generator, select HIPAA preset (3s)
2. Click "Certify" button — cert modal appears (3s)
3. Sign in via magic link email (4s)
4. Certificate page loads — green ✅ badge, entropy display (5s)
5. Dashboard — compliance score ring animates, cert appears in table (5s)
6. Share cert URL — open in incognito to show public verification (5s)
7. Team page — show members table (5s)

**Tool:** Kap (Mac) or ShareX (Windows). Export as .gif or .mp4. Max 10MB for PH.

---

## Pricing Positioning
- **Free** — 3 NIST certificates/month, no card required
- **Assurance** — $19/mo — unlimited certs, all 6 standards, 14-day trial
- **Authority** — $59/mo — everything + 10-seat team workspace, org policy

## Key Differentiators for PH Comments
1. **Zero storage** — passwords are never stored. The certificate proves compliance without holding the secret.
2. **Offline verifiable** — the ES256 JWT in every certificate can be verified locally with the public key, no PassGeni API call needed.
3. **Audit-ready** — certificates include ISO 8601 timestamps, standards_met array, entropy_bits, char_pool_size. Paste into an audit report directly.
4. **Revocation** — certs can be revoked (e.g. if a password is compromised). The dashboard shows revoked certs as risks.

---

## Launch Day Checklist
- [ ] Upload 4 screenshots (1270×760px)
- [ ] Upload demo GIF
- [ ] Set live URL to https://passgeni.ai
- [ ] Set pricing: Paid (starts at $19/mo, has free tier)
- [ ] Add maker comment within first 30 minutes of launch
- [ ] Reply to every comment in the first 2 hours
- [ ] Share in relevant communities: r/netsec, r/devops, r/sysadmin, Hacker News, compliance Slack groups
- [ ] Tweet from @passgeni with PH link

## Hunter Notes
Best launch day: Tuesday or Wednesday. Peak PH traffic is 8–10am PT.
Schedule announcement email (`POST /api/admin/announce`) for 30 minutes after PH post goes live.
