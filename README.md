<div align="center">

<img src="passgeni-frontend/public/images/logo.svg" alt="PassGeni Logo" width="72" height="72" />

# PassGeni

**AI-powered password generator. Zero storage. Zero knowledge. Free forever.**

[![Live](https://img.shields.io/badge/Live-passgeni.ai-C8FF00?style=flat-square&labelColor=0a0a0c)](https://passgeni.ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)
[![Security Policy](https://img.shields.io/badge/Security-Policy-red?style=flat-square)](SECURITY.md)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-C8FF00?style=flat-square)](CONTRIBUTING.md)

[passgeni.ai](https://passgeni.ai) · [Tools](https://passgeni.ai/tools) · [Pricing](https://passgeni.ai/pricing) · [About](https://passgeni.ai/about)

</div>

---

## What is PassGeni?

PassGeni is a **zero-knowledge, AI-assisted password security platform**. Every password it generates is created entirely inside your browser using `crypto.getRandomValues()` — a cryptographically secure random number generator built into every modern browser. Your passwords are never transmitted, never stored on any server, and never seen by anyone but you.

The platform combines:

- A **smart password generator** with AI-powered entropy suggestions (Google Gemini)
- **Six free security tools** (breach checker, strength analyzer, audit, policy generator, secure share, WiFi QR)
- A **compliance library** aligned with HIPAA, PCI-DSS v4.0, SOC 2, ISO 27001, NIST SP 800-63B, and DoD STIG
- A **Pro/Team tier** with advanced generation options (Post-Quantum, passphrases, bulk export)

---

## Live Product

| URL | Description |
|-----|-------------|
| [passgeni.ai](https://passgeni.ai) | Homepage + generator |
| [passgeni.ai/tools](https://passgeni.ai/tools) | All free security tools |
| [passgeni.ai/tools/breach-checker](https://passgeni.ai/tools/breach-checker) | k-anonymity HIBP breach check |
| [passgeni.ai/tools/strength-checker](https://passgeni.ai/tools/strength-checker) | Entropy + DNA score analyzer |
| [passgeni.ai/tools/audit](https://passgeni.ai/tools/audit) | Batch audit up to 10 passwords |
| [passgeni.ai/tools/policy-generator](https://passgeni.ai/tools/policy-generator) | Compliance policy document generator |
| [passgeni.ai/tools/secure-share](https://passgeni.ai/tools/secure-share) | AES-256-GCM encrypted sharing |
| [passgeni.ai/tools/wifi-qr](https://passgeni.ai/tools/wifi-qr) | WiFi QR code generator |
| [passgeni.ai/pricing](https://passgeni.ai/pricing) | Pricing plans |
| [passgeni.ai/about](https://passgeni.ai/about) | About PassGeni |

---

## Core Features

| Feature | Free | Pro | Team |
|---------|------|-----|------|
| Random password generation | ✓ | ✓ | ✓ |
| Passphrase generation | ✓ | ✓ | ✓ |
| Compliance presets (HIPAA, PCI-DSS, SOC 2…) | ✓ | ✓ | ✓ |
| Post-Quantum (Kyber-enhanced entropy) | 1/day | Unlimited | Unlimited |
| Bulk generation (up to 50 passwords) | — | ✓ | ✓ |
| All 6 security tools | ✓ | ✓ | ✓ |
| Password history (session only) | — | ✓ | ✓ |
| Team sharing & invite links | — | — | ✓ |
| Secure Share (AES-256-GCM links) | ✓ | ✓ | ✓ |
| Policy document download | ✓ | ✓ | ✓ |
| Compliance cheatsheet PDF | ✓ | ✓ | ✓ |
| API access | — | — | ✓ |

---

## Security Architecture

PassGeni is built on a **zero-knowledge** principle: the server never sees your passwords.

```
┌────────────────────────────────────────────────────────────────┐
│                         YOUR BROWSER                           │
│                                                                │
│  crypto.getRandomValues()  ──▶  password  ──▶  display only   │
│                                     │                          │
│                              NEVER sent ──▶  network           │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│                AI ENHANCEMENT (optional)                        │
│                                                                │
│  Plain prompt (no passwords)  ──▶  Gemini API                  │
│  "suggest entropy improvements for 16-char passwords"          │
│  Response: text suggestions only — no password content         │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│                BREACH CHECK (k-anonymity)                       │
│                                                                │
│  SHA-1(password)[:5]  ──▶  HIBP API  ──▶  list of suffixes    │
│  Full hash never transmitted. Compared locally in browser.     │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│                SECURE SHARE (AES-256-GCM)                       │
│                                                                │
│  Key generated in browser  ──▶  encrypts secret locally        │
│  Key embedded in URL #fragment  (never sent to server)         │
│  Server receives only: encrypted ciphertext                    │
└────────────────────────────────────────────────────────────────┘
```

### Security Guarantees

| Guarantee | How it's enforced |
|-----------|-------------------|
| Passwords never leave the browser | `crypto.getRandomValues()` — no network call for generation |
| No password stored server-side | Supabase stores only user metadata (email, plan, timestamps) |
| Breach checks are private | k-anonymity: only 5-char SHA-1 prefix sent to HIBP |
| Secure share is truly secret | AES-256-GCM key in URL fragment — HTTP spec guarantees fragment is never sent to server |
| No tracking of what you generate | Zero analytics on password content or generator settings |
| Open source | This repo. Audit the code yourself. |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14.2.5 (App Router disabled — Pages Router) |
| **UI** | React 18, inline styles + CSS variables, Framer Motion |
| **Auth** | NextAuth v4 (magic link / email, no passwords for accounts) |
| **Database** | Supabase (PostgreSQL) |
| **Billing** | Paddle (subscription management, webhooks) |
| **AI** | Google Gemini 1.5 Flash (`gemini-1.5-flash`) |
| **Email** | Resend (transactional) |
| **Breach Check** | Have I Been Pwned v3 API (k-anonymity range lookup) |
| **Deployment** | Vercel |
| **Domain** | Cloudflare DNS |

---

## Repository Structure

```
Passgeni-v2/
├── passgeni-frontend/          # Next.js application
│   ├── components/
│   │   ├── generator/          # Password generator widgets
│   │   │   ├── GeneratorWidget.js    # Core generator state
│   │   │   ├── ComplianceBar.js      # Compliance preset buttons
│   │   │   ├── PasswordDisplay.js    # Password output display
│   │   │   └── index.js              # Exported generator
│   │   ├── layout/
│   │   │   ├── Header.js             # Nav + mega menus
│   │   │   ├── Footer.js             # Site footer
│   │   │   └── PageLayout.js         # Shell with Head/SEO
│   │   ├── sections/
│   │   │   ├── Hero.js               # Homepage hero
│   │   │   └── index.js              # All homepage sections
│   │   └── tools/
│   │       └── ToolPage.js           # Shared tool page shell
│   ├── content/
│   │   └── copy.js                   # ALL website text (single source of truth)
│   ├── lib/
│   │   ├── gemini.js                 # callGemini() helper
│   │   ├── motion.js                 # ALL Framer Motion variants
│   │   ├── strength.js               # getStrength(), getEntropy(), etc.
│   │   ├── supabase.js               # Supabase client
│   │   └── wordlist.js               # Passphrase word list
│   ├── pages/
│   │   ├── api/                      # API routes
│   │   │   ├── auth/                 # NextAuth handlers
│   │   │   ├── waitlist.js           # Email list signup
│   │   │   ├── generate-share-copy.js # AI copy generator
│   │   │   └── paddle/               # Billing webhooks
│   │   ├── tools/
│   │   │   ├── index.js              # /tools hub
│   │   │   ├── breach-checker.js
│   │   │   ├── strength-checker.js
│   │   │   ├── audit.js
│   │   │   ├── policy-generator.js
│   │   │   ├── secure-share.js
│   │   │   └── wifi-qr.js
│   │   ├── dashboard/
│   │   │   └── index.js              # User dashboard
│   │   ├── guides/
│   │   │   ├── index.js              # /guides hub
│   │   │   └── [slug].js             # Dynamic guide pages
│   │   ├── index.js                  # Homepage
│   │   ├── pricing.js                # Pricing page
│   │   ├── about.js                  # About page
│   │   ├── contact.js                # Contact page
│   │   ├── api-docs.js               # API documentation
│   │   └── 404.js                    # 404 page
│   ├── public/
│   │   ├── downloads/
│   │   │   └── passgeni-compliance-cheatsheet.pdf
│   │   └── images/
│   ├── styles/
│   │   └── globals.css               # CSS variables + global styles
│   └── package.json
├── README.md                         # This file
├── LICENSE                           # MIT License
├── SECURITY.md                       # Vulnerability disclosure policy
├── CONTRIBUTING.md                   # Contribution guidelines
├── CODE_OF_CONDUCT.md                # Contributor Covenant
└── .github/
    ├── CODEOWNERS
    ├── PULL_REQUEST_TEMPLATE.md
    └── ISSUE_TEMPLATE/
        ├── bug_report.md
        ├── feature_request.md
        └── security_concern.md
```

---

## Getting Started (Local Development)

### Prerequisites

- Node.js 18+ and npm
- A Supabase project (free tier works)
- A Google AI Studio API key (Gemini)
- A Resend account (for magic link emails)

### 1. Clone the repository

```bash
git clone https://github.com/Giant-Tech-Solutions-llc/Passgeni-v2.git
cd Passgeni-v2/passgeni-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create `passgeni-frontend/.env.local`:

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Google Gemini AI
GEMINI_API_KEY=your-gemini-api-key

# Resend (magic link emails)
RESEND_API_KEY=your-resend-api-key

# Paddle billing (use sandbox for local dev)
NEXT_PUBLIC_PADDLE_VENDOR_ID=your-vendor-id
NEXT_PUBLIC_PADDLE_PRO_MONTHLY_PLAN_ID=your-plan-id
NEXT_PUBLIC_PADDLE_PRO_ANNUAL_PLAN_ID=your-plan-id
NEXT_PUBLIC_PADDLE_TEAM_MONTHLY_PLAN_ID=your-plan-id
NEXT_PUBLIC_PADDLE_TEAM_ANNUAL_PLAN_ID=your-plan-id
PADDLE_WEBHOOK_SECRET=your-webhook-secret
```

> **Never commit `.env.local` to version control.** It is in `.gitignore`.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Build for production

```bash
npm run build
npm start
```

---

## Content System

**All website copy lives in one file: [`content/copy.js`](passgeni-frontend/content/copy.js)**

```js
import { NAV, HERO, GENERATOR, PRICING, FAQ, TESTIMONIALS, BOTTOM_CTA } from "../content/copy.js";
```

To change any visible text on the site — headlines, button labels, FAQ answers, testimonials — edit `copy.js` only. Do not hardcode strings in components.

---

## Animation System

**All Framer Motion variants live in one file: [`lib/motion.js`](passgeni-frontend/lib/motion.js)**

```js
import { btnPrimary, btnGhost, bcCard, sectionHeadReveal, heroEntrance } from "../lib/motion.js";

// Button
<motion.button className="btn-primary" {...btnPrimary}>Click me</motion.button>

// Card
<motion.div {...bcCard(i)}>Card content</motion.div>

// Section heading
<motion.h2 {...sectionHeadReveal}>Heading</motion.h2>
```

---

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth/[...nextauth]` | GET/POST | NextAuth magic link auth |
| `/api/waitlist` | POST | Email list signup via Resend |
| `/api/generate-share-copy` | POST | AI-generated social share copy |
| `/api/paddle/webhook` | POST | Paddle billing event handler |

---

## Database Schema (Supabase)

```sql
-- Users (managed by NextAuth + Supabase adapter)
users (id, email, created_at)

-- Sessions
sessions (id, user_id, expires, session_token)

-- User plan metadata
user_profiles (
  id          uuid references users(id),
  plan_type   text default 'free',  -- 'free' | 'pro' | 'team' | 'enterprise'
  paddle_subscription_id  text,
  created_at  timestamptz,
  updated_at  timestamptz
)

-- Waitlist / email subscribers
waitlist (
  id        bigserial primary key,
  email     text unique not null,
  type      text,  -- 'waitlist' | 'digest'
  created_at timestamptz default now()
)
```

---

## Compliance Coverage

The free [Compliance Cheatsheet PDF](https://passgeni.ai/downloads/passgeni-compliance-cheatsheet.pdf) and the Policy Generator tool cover:

| Standard | Scope |
|----------|-------|
| HIPAA | ePHI access controls, minimum password length, MFA requirements |
| PCI-DSS v4.0 | Req 8.3 — password complexity, rotation, MFA for cardholder data |
| SOC 2 CC6.1 | Logical access, password controls for Type II audits |
| ISO 27001:2022 | Annex A.9 — access control policy, password management |
| NIST SP 800-63B | Digital identity guidelines — length-over-complexity model |
| DoD STIG | Defense Information Systems Agency password requirements |

---

## Contributing

We welcome contributions! Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

**Quick rules:**
- Security issues → email [security@passgeni.ai](mailto:security@passgeni.ai), **do not** open a public issue
- All copy changes → `content/copy.js` only
- All animation changes → `lib/motion.js` only
- Write minimal, focused PRs — one concern per PR

---

## Security

**Found a vulnerability?** Please report it responsibly.

- **Email:** [security@passgeni.ai](mailto:security@passgeni.ai)
- **Do not** open a public GitHub issue for security vulnerabilities
- Full disclosure policy: [SECURITY.md](SECURITY.md)

---

## License

MIT License — see [LICENSE](LICENSE) for full text.

Copyright (c) 2021–2026 PassGeni / Giant Tech Solutions LLC

Permission is granted to use, copy, modify, and distribute this software for any purpose, with or without fee, provided the copyright notice is retained.

---

## Contact

| | |
|-|--|
| **Website** | [passgeni.ai](https://passgeni.ai) |
| **Security** | [security@passgeni.ai](mailto:security@passgeni.ai) |
| **Support** | [support@passgeni.ai](mailto:support@passgeni.ai) |
| **Company** | Giant Tech Solutions LLC |
| **GitHub** | [Giant-Tech-Solutions-llc](https://github.com/Giant-Tech-Solutions-llc) |

---

<div align="center">

Built with care. Zero knowledge. Zero compromise.

</div>
