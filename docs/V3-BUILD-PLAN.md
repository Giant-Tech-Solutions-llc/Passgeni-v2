# PASSGENI V3 — BUILD PLAN (Phase 0 + Phase 1 output)

Companion to `V3-REDESIGN.md` (the full design spec, still authoritative for section-level
detail). This document records the Phase 0 design plan, the Phase 1 self-critique, and the
deltas introduced by the 2026-07-07 App Router rebuild.

## Phase 0 — Design plan

### Palette (6 values, roles)

| Token | Hex | Role |
|---|---|---|
| `--pg-canvas` | `#F7F8FC` | Page canvas — cool-tinted light, not white, not cream |
| `--pg-surface-1` | `#FFFFFF` | Elevated surface: studio frame, tables, rows |
| `--pg-surface-2` | `#F1F3F9` | Recessed surface: wells, audit record, control tracks |
| `--pg-ink` | `#0B0D17` | Text ink |
| `--pg-primary` | `#0320FF` | Action blue: buttons, focus, live data accents |
| `--pg-secondary` | `#0010A3` | Deep navy: final CTA band, symbol coloring, depth |
| `--pg-accent` | `#0FF280` | PASS semantics + final CTA button ONLY. Never carries text (pair with `--pg-accent-ink #067A42`) |

Semantic: `--pg-fail #D92D20`, `--pg-warn #B54708`. Depth via surface layering + three
shadow steps, never gradients.

### Type system

- **Outfit** (variable) — headings and body. H1 68/1.05 w700 ls-0.03em · H2 52/1.1 w700 ·
  H3 30/1.2 w650 · body 18/1.7 w400 · small 15/1.6 · caps-labels 12/ls 0.09em w700.
- **Newsreader Italic** — accent voice only, max 1–2 phrases per page section; marks the
  *human* word in a technical sentence ("auditor", "evidence").
- **JetBrains Mono** — all credential/data surfaces. Output 28/1.3 w600, data 14–15 w500.
- Loaded via Fontsource packages (self-hosted through npm) — `next/font/google` fetches at
  build time and previously broke Railway builds; npm-vendored fonts cannot.

### Layout concept (one sentence per section)

1. **Hero** — centered single column that hands the visitor the real product within one viewport.
2. **Compliance Studio** — the live instrument: credential → analysis → evidence, three-zone layout.
3. **How it works** — three cropped fragments of real product UI wired left-to-right (order is real: generate → validate → certify).
4. **Auditor table** — one bordered audit worksheet with monospace values and real citations; designed to be screenshot into Slack.
5. **Passphrase system** — explanation left, three live structure presets right, entropy shown per preset.
6. **Zero-knowledge diagram** — one SVG: browser box, server box, and a red ✗ on the credential path; hash-only line crosses.
7. **Tools** — six quiet list-rows, a platform index, not marketing cards.
8. **Dashboard preview** — one framed product frame, undersold on purpose, PRO chip, one CTA.
9. **Social proof** — role-attributed placeholder quotes, clearly marked `PLACEHOLDER` in code.
10. **Final CTA** — the only dark band (#0010A3): "Will you have evidence, or just good intentions?"

Full ASCII wireframes: see `V3-REDESIGN.md` §2 (unchanged).

### Signature element

**The Compliance Studio's evidence record.** A live generator whose output zone is
paired with a machine-readable audit record (salted hash commitment, entropy bits,
per-standard verdicts) that updates on every keystroke. No password generator shows the
evidence artifact; that artifact IS the category claim. Secondary signature: the DNA
score rendered as a four-factor segmented instrument block (no donut rings, no smooth
gradient bars).

## Phase 1 — Self-critique (what changed from the generic default)

Test applied: "would a generic security-SaaS brief produce this?" Deltas forced:

1. Generic default is near-black + neon glow → we ship a light instrument canvas; the
   accent green is rationed to PASS semantics and one CTA, never decoration, never text.
2. Generic default is three-card feature rows → the only grid on the page is the tools
   index (list-rows); everything else is a table, an instrument, a diagram, or a frame.
3. Numbered 01/02/03 markers appear once, where order is genuinely causal.
4. DNA "ring" from the original spec was itself a dashboard default → replaced with the
   segmented four-factor block (§ signature above).
5. No cream/serif/terracotta, no glassmorphism, no blobs, no hairline broadsheet: radii
   6/10/14, tonal layering, engineered density.
6. Copy audit: zero "seamlessly/unlock/revolutionize", no em dashes, buttons state the
   action, every claim specific (bits, citations, standards).

## Rebuild deltas (2026-07-07, App Router)

- Stack: **Next.js (App Router) + TypeScript + Tailwind v4 + motion**, replacing the
  pages-router app. Legacy full product (auth, API, billing, dashboard) remains in git
  history at `2e03200`; it is NOT ported in this pass — see Implementation Notes in
  `passgeni-frontend/README.md` for the port list.
- All generation/validation/scoring logic lives in `lib/engine.ts` + `lib/standards.ts`,
  pure modules with **zero network access** (the zero-knowledge claim is enforceable by
  grepping `lib/` for `fetch`).
- Wordlists: EFF large (7,776 words, 12.92 bits/word) vendored in `data/wordlist.ts`;
  "Easy" preset uses the 4,096-word short-word subset (12.0 bits/word). Regenerate via
  `scripts/build-wordlist.mjs`.
- Profession seeding stays dead (spec A1). Influence words exist only in passphrase mode
  with the entropy penalty displayed live.
- Certify flow is a presentational soft-gate in this build (the signing API ports from V2
  in a later phase); marked placeholder in code.

## V3.1 — Brand, depth, and motion layer (2026-07-07)

### Brand metaphor: the hash (commitment grid)

One metaphor everywhere: **a deterministic cell grid seeded from the credential's
hash**. The credential never leaves the browser, but its fingerprint is visible —
that is the product, drawn. `lib/hashgrid.ts` turns any string into a reproducible
cell pattern (FNV-1a hash → mulberry32 PRNG → on/off cells at 3 intensity tiers).

Appears in: ① hero background texture (reseeds on every generation), ② the brand
mark in the header/favicon/OG image, ③ section-divider strips at the light/dark act
boundaries, ④ the credential fingerprint strip in the studio's DNA block and audit
record, ⑤ generation/loading states (character decode + grid reseed), ⑥ the
certificate fragment in "How it works".

### Elevation ramp (tone + shadow + 1px low-alpha border, per level)

| Token | Value | Role |
|---|---|---|
| `--pg-canvas` | `#F2F4FA` | L0 page |
| `--pg-band` | `#F8FAFD` | L1 section band |
| `--pg-surface-1` | `#FFFFFF` | L2 card (`--pg-sh-card`) |
| raised | `#FFFFFF` + `--pg-sh-raised` | L3: the studio, the single most elevated object |
| `--pg-inset` | `#EDF0F8` + `--pg-sh-inset` | recessed: outputs, audit record |

Dark act (`.act-dark` remaps the same semantic tokens, so every component works in
both acts): `--pg-deep-0 #0A102E` page, `--pg-deep-1 #101740` card,
borders `rgba(255,255,255,.08)`, ink `#EDF0FB`. Used for §6 zero-knowledge and §10
final CTA — the page gets a dark act, not a blue rectangle.

Blue ramp: `--pg-blue-050 #EEF1FF` tint fills · `500 #0320FF` interactive ·
`600 #0218CC` hover · `700 #0113A0` pressed.

Shadows are layered (tight 1px ambient + soft wide diffuse), never one blurry drop:
`--pg-sh-card`, `--pg-sh-raised`, `--pg-sh-inset`, `--pg-sh-deep`. Grain: inline-SVG
feTurbulence at 2.5% opacity on hero + dark bands only.

### Iconography

Custom 12-icon set (`components/icons.tsx`), one style: 20px grid, 1.5px stroke,
round caps, 2px corner logic, `currentColor`. Certificate/audit vocabulary: seal,
ledger, doc-seal, chain, gauge, scan, grid-fingerprint, key, copy, cycle, lock,
check/cross. No generic icon library, no emoji (the 🔒 dies here).

### Motion system

- One easing family site-wide: `cubic-bezier(0.22, 1, 0.36, 1)`. Durations: 150ms
  micro / 300ms UI / 450ms reveals / 800ms hero orchestration.
- `prefers-reduced-motion`: every animation gated (motion's `useReducedMotion` +
  CSS media query); static site remains complete.
- Transform/opacity only. No layout-property animation.
- **Hero orchestration** (the one cinematic moment, <1.2s): label → headline →
  subheadline → CTAs → studio rises last (24px + scale 0.985 + shadow bloom).
- **Scroll reveals**: once, 16px drift + fade, 60–80ms child stagger.
- **Parallax, two places only**: hero texture at −15% differential; ZK diagram
  browser/server layers separating slightly (the motion argues the section's point).
- **Micro-interactions**: character decode on generate (<400ms) + grid reseed;
  compliance chips stamp in at 80ms intervals; DNA/entropy count-up; segmented
  meters fill staggered; copy button morphs (no toast); slider value chip follows
  thumb; locked standards shimmer once on hover; certify button shadow-breathes —
  the single permitted ambient loop.
- **Banned and respected**: no animation on the auditor table (stillness = credibility).
