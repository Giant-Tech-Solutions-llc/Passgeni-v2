# PassGeni V2

> AI-powered password generator. Zero storage. Zero knowledge. Free forever for individuals.

**Live:** https://passgeni.ai
**Repo:** https://github.com/Giant-Tech-Solutions-llc/Passgeni-v2

---

## What is PassGeni

PassGeni generates strong, memorable passwords seeded by the user's profession. A doctor gets medical vocabulary patterns. A developer gets tech patterns. Everything runs client-side via `crypto.getRandomValues()` — nothing is ever sent to a server.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14.2.5 |
| UI | React 18 |
| Styling | CSS Variables + globals.css (no Tailwind, no CSS-in-JS library) |
| Database | Supabase (PostgreSQL) |
| Auth | NextAuth v4 — magic link via Resend, JWT sessions |
| AI | Google Gemini (profession-aware seeding) |
| Payments | Paddle |
| Email | Resend |
| Hosting | Vercel |

---

## Repository Structure

```
Passgeni-v2/
├── vercel.json                        ← Vercel rewrite rules (root-level)
└── passgeni-frontend/                 ← Next.js app — THIS is the Vercel root directory
    ├── pages/
    │   ├── _app.js                    ← Global app wrapper (ErrorBoundary, global CSS)
    │   ├── _document.js               ← Custom HTML document (fonts, meta)
    │   ├── index.js                   ← Homepage
    │   ├── api-docs.js                ← /api-docs page
    │   ├── checkout.js                ← /checkout page
    │   ├── contact.js                 ← /contact page
    │   ├── privacy.js                 ← /privacy page
    │   ├── terms.js                   ← /terms page
    │   ├── refund.js                  ← /refund page
    │   ├── robots.txt.js              ← Dynamic robots.txt
    │   ├── sitemap.xml.js             ← Dynamic sitemap
    │   ├── 404.js                     ← Custom 404 page
    │   ├── api/
    │   │   ├── auth/                  ← NextAuth magic link handler
    │   │   ├── dashboard/             ← Dashboard API routes
    │   │   ├── email/                 ← Email sending routes
    │   │   ├── keys/                  ← API key management
    │   │   ├── paddle/                ← Paddle webhook + checkout
    │   │   ├── usage/                 ← Usage tracking
    │   │   ├── v1/                    ← Public REST API v1
    │   │   ├── waitlist.js            ← Waitlist signup
    │   │   └── test-gemini.js         ← Gemini connection test
    │   ├── auth/                      ← Auth pages (signin, error, verify)
    │   ├── blog/
    │   │   ├── index.js               ← Blog listing (card grid, pagination, search)
    │   │   └── [slug].js              ← Blog post (hero image, TOC, FAQs, social share)
    │   ├── dashboard/                 ← User dashboard (auth-gated)
    │   ├── guides/                    ← Compliance & how-to guides
    │   └── tools/                     ← Individual tool pages
    ├── components/
    │   ├── layout/
    │   │   ├── Header.js              ← Site header / navigation
    │   │   └── Footer.js              ← Site footer
    │   ├── sections/
    │   │   ├── Hero.js                ← Hero section
    │   │   ├── GeneratorSection.js    ← Password generator UI
    │   │   ├── HowItWorks.js          ← 3-step explainer
    │   │   ├── Features.js            ← Feature cards
    │   │   ├── ToolsPreview.js        ← Tools preview cards
    │   │   ├── Pricing.js             ← Pricing section
    │   │   ├── Testimonials.js        ← Testimonials marquee
    │   │   ├── FAQ.js                 ← FAQ accordion
    │   │   ├── StatsBar.js            ← Stats bar
    │   │   ├── Waitlist.js            ← Team API CTA
    │   │   └── index.js               ← Barrel exports for all sections
    │   ├── generator/                 ← Generator sub-components
    │   ├── tools/                     ← Tool-specific components
    │   ├── ui/                        ← Shared UI primitives
    │   ├── BlogHeroSVG.js             ← Blog hero illustration
    │   ├── CopyBtn.js                 ← Unified copy-to-clipboard button
    │   ├── ErrorBoundary.js           ← Global error boundary
    │   ├── Layout.js                  ← Page layout wrapper
    │   ├── TestimonialsSection.js     ← Testimonials (infinite marquee)
    │   └── TrustStrip.js              ← Trust indicators strip
    ├── content/
    │   └── copy.js                    ← ALL website text lives here
    ├── data/
    │   └── blogPosts.js               ← All 53 blog posts (title, slug, hero image, FAQs, keywords)
    ├── lib/
    │   ├── auth/                      ← Supabase NextAuth adapter
    │   ├── db/                        ← Supabase database helpers
    │   ├── email/                     ← Resend email templates
    │   ├── apiKeys.js                 ← API key generation and validation
    │   ├── auth.js                    ← Auth helpers
    │   ├── gemini.js                  ← Gemini AI client
    │   ├── generator.js               ← Client-side password generation logic
    │   ├── paddle.js                  ← Paddle billing client + webhook verification
    │   └── strength.js                ← Password DNA Score calculator
    ├── seo/
    │   └── schema.js                  ← JSON-LD schema generators
    ├── styles/
    │   └── globals.css                ← All global styles, CSS variables, animations
    ├── public/                        ← Static assets (favicon, og-image, icons)
    ├── next.config.js                 ← Next.js config
    ├── INTEGRATION.md                 ← Integration guide for component updates
    └── package.json
```

---

## Design System

All styles live in `styles/globals.css`. There is no Tailwind or CSS-in-JS library.

### CSS Variables

| Variable | Value | Usage |
|---|---|---|
| `--color-accent` | `#C8FF00` | Primary brand color — buttons, highlights, icons |
| `--color-bg` | `#060608` | Page background |
| `--color-text` | `#e0e0e0` | Primary text |
| `--font-heading` | Outfit 700/800 | All headings |
| `--font-body` | DM Sans 400/500/600 | Body copy, labels, nav |
| `--font-mono` | IBM Plex Mono | Code, password display |

### Key CSS Classes

| Class | Purpose |
|---|---|
| `.cta-primary` | Lime (#C8FF00) background CTA button, black text |
| `.gen-capsule` | Live password display pill in hero |
| `.nav-link` | Nav link — lime when inactive, white when active |
| `.nav-link.active` | Active nav link — white |
| `.testimonial-track` | Infinite horizontal marquee (80s, pauses on hover) |
| `.copy-btn` | Unified copy button |
| `.copy-btn.copied` | Copied state |
| `.nav-hamburger` | Mobile menu toggle (visible below 900px) |
| `.mobile-nav-drawer` | Mobile nav slide-down drawer |
| `.trust-strip-text` | Trust strip — 12px, #aaa, flex row |

---

## Content System

**All website text is in one file: `content/copy.js`**

Edit text there — it updates across the site automatically. Never hardcode text in components.

Key exports from `content/copy.js`:

| Export | Contents |
|---|---|
| `SITE` | Name, domain, email, description |
| `NAV` | Nav links, CTA button label |
| `HERO` | Badge, headline, subheadline, trust points, CTA labels |
| `HOW_IT_WORKS` | 3 steps |
| `FEATURES` | 8 feature cards |
| `TOOLS_PREVIEW` | 6 tool cards |
| `PRICING` | Plan names, prices, features (Free / Team / Enterprise) |
| `TESTIMONIALS` | 50+ testimonials |
| `FAQ` | 8 Q&A items |
| `WAITLIST` | Team API CTA section |
| `FOOTER` | Links, copyright, trust chips |
| `TICKER_ITEMS` | Scrolling ticker labels |
| `STATS` | Stats bar numbers |

---

## Auth

- **Provider:** NextAuth v4
- **Method:** Magic link (email only — no passwords)
- **Email sender:** Resend from `hello@passgeni.ai`
- **Sessions:** JWT (stateless — no session DB table needed)
- **Adapter:** Custom Supabase adapter at `lib/auth/`

---

## Database — Supabase

All user data stored in Supabase PostgreSQL. Key table: `profiles`.

```sql
profiles (
  id                      UUID   -- FK to auth.users
  email                   TEXT
  plan_type               TEXT   -- 'free' | 'team' | 'enterprise'
  plan_status             TEXT   -- 'active' | 'trialing' | 'past_due' | 'canceled'
  paddle_subscription_id  TEXT
  paddle_price_id         TEXT
  paddle_customer_id      TEXT
  trial_end               TIMESTAMPTZ
  next_billing_at         TIMESTAMPTZ
  created_at              TIMESTAMPTZ
  updated_at              TIMESTAMPTZ
)
```

---

## Payments — Paddle

Webhook endpoint: `POST /api/paddle/webhook`

Events handled: `subscription.created`, `subscription.activated`, `subscription.trialing`, `subscription.updated`, `subscription.canceled`, `subscription.past_due`, `transaction.completed`, `transaction.payment_failed`

---

## AI — Gemini

Used for profession-aware password seeding. Client: `lib/gemini.js`

Test endpoint: `GET /api/test-gemini`

---

## Local Development

```bash
git clone https://github.com/Giant-Tech-Solutions-llc/Passgeni-v2.git
cd Passgeni-v2/passgeni-frontend
npm install
cp .env.template .env.local
# Fill in env vars (see below)
npm run dev
```

Open: http://localhost:3000

---

## Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=

# Email
RESEND_API_KEY=

# AI
GEMINI_API_KEY=

# Paddle
PADDLE_API_KEY=
PADDLE_WEBHOOK_SECRET=
PADDLE_PRODUCT_PRO_MONTHLY=
PADDLE_PRODUCT_PRO_ANNUAL=
PADDLE_PRODUCT_TEAM_MONTHLY=
PADDLE_PRODUCT_TEAM_ANNUAL=
```

---

## Vercel Deployment

- **Project ID:** `prj_VEAZ4S4AlUXPSxRSWPxu0tjuqtCU`
- **Root directory:** `passgeni-frontend` — must always be set
- **Framework preset:** Next.js
- **Production domain:** `passgeni.ai`
- Auto-deploys on every push to `main`

---

## Rules for Working on This Codebase

1. **Read the file fully before editing it** — never edit blind
2. **Text changes go in `content/copy.js` only** — never hardcode text in components
3. **Style changes go in `styles/globals.css`** — never use inline styles for design decisions
4. **Never rewrite a working component** — make targeted edits only
5. **Never change the logo or favicon** — these are brand assets
6. **Check the live site before and after every change**
7. **Run `npm run build` locally before pushing** — catch errors before Vercel does
8. **The brand color is `#C8FF00`** — always use `var(--color-accent)` in components
