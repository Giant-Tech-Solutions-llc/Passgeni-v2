# PassGeni V3 — frontend

Credential compliance infrastructure. Next.js 16 (App Router) + TypeScript +
Tailwind v4 + motion. Design plan: `../docs/V3-BUILD-PLAN.md`; full design spec:
`../docs/V3-REDESIGN.md`.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## The product claim, enforced in code

"No credential ever leaves your browser" is verifiable:

- All generation/validation/scoring lives in `lib/engine.ts` + `lib/standards.ts`.
  Neither file (nor anything in `lib/` or `data/`) contains a network call —
  `grep -r "fetch\|XMLHttpRequest" lib/ data/` returns nothing.
- The audit record contains a **salted SHA-256 hash commitment**, never the
  credential (`buildAuditRecord` in `lib/engine.ts`).
- Randomness is `crypto.getRandomValues` with rejection sampling (`randomInt`).

## File map

```
app/
  layout.tsx        fonts (Fontsource, npm-vendored — do NOT switch to
                    next/font/google, it broke Railway builds before), metadata
  page.tsx          homepage + JSON-LD (@graph: Org, WebSite, SoftwareApplication,
                    HowTo, FAQPage)
  generator/        full Compliance Studio; ?mode=passphrase deep link
  compliance/       standards library (renders the same ruleset the studio runs)
  tools/            six-tool index (five link to live V2 tools; verifier pending)
  pricing/          real V2 prices (Free / Pro $19 / Team $59)
  robots.ts, sitemap.ts
components/
  primitives.tsx    Button, Chip, MicroLabel, SectionHeading, SegmentedMeter, Reveal
  shell.tsx         Header, Footer
  studio/ComplianceStudio.tsx
                    useComplianceStudio() hook + all studio zones
                    (output, standards rail, controls, DNA block, audit preview,
                    certify bar); variants: embedded (homepage) | full (/generator)
  home/sections.tsx Hero, HowItWorks, AuditorTable, PassphraseShowcase,
                    ZeroKnowledge, ToolsGrid, DashboardPreview, Testimonials, FinalCTA
lib/
  engine.ts         generation (password + passphrase), entropy, analysis,
                    DNA score, influence-word bias with entropy penalty, audit record
  standards.ts      NIST / SOC 2 / HIPAA / PCI control definitions + citations
data/
  wordlist.ts       GENERATED — EFF large (7,776) + 4,096-word "easy" subset;
                    rebuild with scripts/build-wordlist.mjs
public/llms.txt
```

## Component usage notes

- **Chip** — status semantics everywhere; never color-only (glyph + text baked in).
- **SegmentedMeter** — the instrumentation meter (12 segments). Use instead of any
  smooth/gradient bar.
- **Reveal** — the only scroll animation (fade + 8px rise, once). Respects
  `prefers-reduced-motion`. Do not add other entrance animations.
- **MicroLabel** — the category marker. One per page hero, not a decoration.
- **`.voice`** (globals.css) — Newsreader Italic accent. Ration: 1–2 phrases per
  page section, marks the human word in a technical sentence.
- **Turbopack gotcha** — JSX drops the space after inline elements; write
  `<span className="voice">auditor</span>{" "}won't`.

## CRO rationale (one line per homepage section)

1. Hero — first generation (interaction, not signup); the CTA fires the studio.
2. Studio — click "Certify this credential".
3. How it works — comprehension of the generate → validate → certify loop.
4. Auditor table — credibility ("these people know NIST"); built to be screenshot.
5. Passphrase — deep-link into `?mode=passphrase`.
6. Zero-knowledge — trust; the red ✗ transmission line is the argument.
7. Tools — breadth belief → tool visits.
8. Dashboard preview — pricing page visit.
9. Social proof — objection removal (placeholder personas, see below).
10. Final CTA — account creation intent.

## Placeholders / not yet ported from V2 (git history @ 2e03200)

- **Certify flow** — presentational soft-gate; the Ed25519 signing API
  (`pages/api/generate-certificate`) and `/cert/[id]` pages still live in V2.
- **Auth** — "Sign in" points at https://passgeni.ai/login.
- **Billing/checkout** — pricing CTAs for paid plans point at the V2 pricing page.
- **Tool pages** — the six tools link to their live V2 implementations; port one
  route at a time into `app/tools/[slug]/`.
- **Testimonials** — placeholder personas, marked `PLACEHOLDER` in
  `components/home/sections.tsx`. Never ship named fake quotes.
- **Favicon/OG image** — still the scaffold favicon; no OG image yet.

## Extending

- New standard: add a `StandardDef` to `lib/standards.ts` (controls carry their own
  `check` + citation); the studio rail, audit record, and /compliance page pick it
  up automatically.
- New tool: `app/tools/<slug>/page.tsx`, import the engine, keep everything local.
- Analytics events (not yet wired): `studio_generate`, `mode_switch`,
  `standard_chip_click(locked?)`, `audit_expand`, `certify_click`,
  `influence_applied` — see spec §8.
