# PASSGENI V3 — HOMEPAGE + GENERATOR REDESIGN SPEC

Status: Design specification (pre-implementation)
Owner: Product/Design
Scope: Homepage (`pages/index.js`), Generator experience, supporting design system
Positioning: **Credential Compliance Infrastructure** — not a password generator.

---

## 0. FIRST PRINCIPLES — ASSUMPTIONS WE ARE KILLING

Before any layout work, these are the assumptions in the current product that contradict the new positioning. Each one is a decision, not a suggestion.

| # | Current assumption | Why it dies | V3 decision |
|---|---|---|---|
| A1 | "Profession-aware seeding" (ProfessionSelector, `deriveSeeds`) is a differentiator | Seeding passwords with guessable dictionary words derived from the user's job is **exactly what an auditor flags**. It reduces effective entropy and undermines the entire compliance story. It is also the #1 thing making PassGeni read as a gimmicky generator. | **Remove from the compliance generator.** Profession seeding survives only inside Passphrase mode as optional "Influence Words" (semantic guidance for memorability), clearly labeled with its entropy cost shown live. |
| A2 | The homepage sells features | Nobody buys features; auditors buy evidence. | Every section sells **one artifact**: the compliance certificate. Features exist only as proof that the certificate is credible. |
| A3 | Generator = a card with a password and sliders | That's Chrome's built-in generator. | Generator = a **verification instrument**. The password is one column of a three-column evidence layout: credential → analysis → audit record. |
| A4 | Dark "security" aesthetic signals trust | It signals hacker-tool. Enterprise buyers trust Stripe/Mercury light-surface precision. | Light canvas (#F7F8FC), tonal layering, engineered density. Zero neon, zero glow. |
| A5 | More tools = more value (incl. WiFi QR) | WiFi QR generator destroys category credibility instantly. | Tools ecosystem is exactly 6 compliance-adjacent tools. WiFi QR removed from nav, homepage, and tools index (page can 301 → /tools). |
| A6 | Explain the product in prose | Prose loses the 5-second test. | The hero contains the **live product**. The first thing a visitor does is generate a compliant credential and see it validated. |
| A7 | Stats ticker / testimonials-as-decoration build trust | Fake-feeling numbers are anti-trust for a security audience. | Social proof only where verifiable and role-attributed. No counters that can't be defended. |

---

## 1. UX ARCHITECTURE

### 1.1 The one mental model

Every screen teaches the same three-verb loop:

```
GENERATE (locally, in your browser)
   → VALIDATE (against a compliance standard)
      → CERTIFY (cryptographically signed evidence)
```

The homepage is this loop rendered once, vertically. The generator is this loop rendered as an instrument. The dashboard is this loop's ledger.

### 1.2 The 5-second test (hero contract)

Within 5 seconds, a first-time visitor must be able to answer:
1. **What is it?** — "It checks whether credentials pass compliance standards and gives you proof."
2. **Is it safe?** — "Nothing leaves my browser." (stated in the hero, demonstrated in Section 6)
3. **What do I do first?** — Press the one blue button: **Generate Password**.

### 1.3 Site map (homepage-relevant slice)

```
/                      Homepage (hero + live generator + narrative)
/generator             Full-screen Compliance Studio (same component, expanded)
/compliance            Standards library (NIST / SOC2 / HIPAA / PCI detail pages)
/tools                 6-tool ecosystem index
/tools/*               breach-checker, strength-checker, audit, policy-generator,
                       secure-share, cert-verifier
/pricing               Plans
/dashboard/*           Paid experience (ledger, certs, team)
/cert/[id]             Public certificate verification page (already exists — this
                       is the shareable proof artifact; treat as a landing page)
```

### 1.4 Primary user flows

**Flow 1 — Developer (anonymous → activation)**
Hero → generates in embedded studio → sees "NIST SP 800-63B: PASS" → clicks Audit Preview → sees redacted evidence record → hits "Certify" → soft gate (free account) → first certificate → `/cert/[id]` share link.

**Flow 2 — Compliance manager (evaluation)**
Hero → "View Compliance Standards" → `/compliance` → sees the actual control mappings (Section 4 logic, expanded) → Dashboard preview (Section 8) → Pricing.

**Flow 3 — Upgrade tension (free → paid)**
Every generation shows 4 standard chips: NIST unlocked, SOC2/HIPAA/PCI locked. Locked chips still *compute* pass/fail but blur the evidence detail. The user sees that the answer exists and is one plan away. One objective per surface: the studio sells certification, nothing else.

### 1.5 Conversion objective map (one per section — CRO rule)

| Section | Single objective |
|---|---|
| 1 Hero | First generation (interaction, not signup) |
| 2 Live Generator | Click "Certify this credential" |
| 3 How It Works | Comprehension: the 3-verb loop |
| 4 Auditor Logic | Credibility: "these people know NIST" |
| 5 Passphrase | Try passphrase mode (deep-link into studio) |
| 6 Zero-Knowledge | Trust: "nothing is transmitted" |
| 7 Tools | Breadth belief → tool page visits |
| 8 Dashboard Preview | Pricing page visit |
| 9 Social Proof | Objection removal |
| 10 Final CTA | Account creation |

---

## 2. HOMEPAGE WIREFRAME + CONTENT HIERARCHY

Max content width 1120px. Section rhythm: 128px vertical (desktop) / 72px (mobile). Alternating canvas `#F7F8FC` and white bands; no full-bleed color sections except final CTA.

### Section 1 — HERO (single column, centered)

```
┌────────────────────────────────────────────────────────────┐
│  [• CREDENTIAL COMPLIANCE INFRASTRUCTURE]        micro-label│
│                                                             │
│        Passwords your auditor                     H1, 68px  │
│        won't question.                    "auditor" set in  │
│                                           Newsreader Italic │
│   Generate credentials locally. Validate them instantly.    │
│   Never store a single secret.            18px, muted, 2 ln │
│                                                             │
│   [ Generate Password ]   [ View Compliance Standards ]     │
│      primary #0320FF          ghost, border               │
│                                                             │
│   ┌───────────────────────────────────────────────────┐    │
│   │        COMPLIANCE STUDIO (live, embedded)         │    │
│   │        — see Section 2 / Part 4 spec —            │    │
│   └───────────────────────────────────────────────────┘    │
│   ◦ Runs entirely in your browser · Web Crypto API          │
└────────────────────────────────────────────────────────────┘
```

- "Generate Password" does **not** navigate. It fires a generation in the embedded studio below and smooth-scrolls 100px so the result is centered. First interaction < 1 second, zero commitment.
- The studio is the real component, pre-seeded with one generation on load (so the page never shows an empty product).
- Trust microcopy under the studio, not a badge wall.

### Section 2 — LIVE GENERATOR (Compliance Studio, embedded mode)

Full spec in Part 4/5. On the homepage it renders in "embedded" density: output + compliance chips + core controls + audit preview collapsed to a summary row. "Open full studio →" links to `/generator`.

### Section 3 — HOW PASSGENI WORKS

Three columns, each a **cropped fragment of real product UI** (rendered React, not icons, not screenshots):

```
  01 GENERATE              02 VALIDATE               03 CERTIFY
┌───────────────┐        ┌───────────────┐        ┌───────────────┐
│ mono password │        │ NIST  ✓ PASS  │        │ ┌─────────┐   │
│ K7#mQ…        │  ───►  │ Entropy 92bit │  ───►  │ │CERT-8F2A│   │
│ [regenerate]  │        │ Pattern  ✓    │        │ │ signed  │   │
└───────────────┘        └───────────────┘        └─────────────  │
 Generated with           Checked against          Ed25519-signed
 crypto.getRandomValues() 40+ auditor controls,    evidence, verifiable
 in your browser.         live.                    at /cert/[id].
 Nothing transmitted.
```

Connective arrows animate once on scroll-into-view (200ms stagger, no loops).

### Section 4 — WHAT AUDITORS CARE ABOUT

Structured data, not cards. A single bordered table styled like an audit worksheet:

```
CONTROL                     REQUIREMENT                 PASSGENI CHECK        REF
─────────────────────────────────────────────────────────────────────────────────
Minimum entropy             ≥ 70 bits effective         Live per-credential   NIST SP 800-63B §5.1.1
Length                      12–64 chars, no max cap     Enforced range        NIST SP 800-63B
Dictionary resistance       Not in breach corpora       k-anonymity check     HIBP / NIST
Pattern resistance          No keyboard walks,          Sequence + repeat     OWASP ASVS 2.1
                            dates, repeats              scanner
Composition rules           No forced rotation,         Policy engine         NIST SP 800-63B §5.1.1.2
                            no arbitrary complexity
Evidence retention          Verifiable audit trail      Signed certificates   SOC 2 CC6.1
```

Monospace for values, real citations in the REF column. This section exists to be screenshot-ed by a security engineer into their team Slack.

### Section 5 — PASSPHRASE SYSTEM

Split: left = explanation (H2 + 3 short paragraphs), right = a live mini passphrase generator locked to display mode with the three structure presets as tabs:

```
Easy to Remember   correct-horse-battery-staple      44 bits  ◔
Balanced           Quartz-Meadow7-Anchor-Tide        68 bits  ◕
High Entropy       vex9!Krill-Ostium-2Fjord-Plasm    96 bits  ●
```

Each row: live example (regenerates on tab focus), entropy meter, one-line auditor note ("Meets NIST memorized-secret guidance").

### Section 6 — ZERO KNOWLEDGE ARCHITECTURE

One horizontal diagram (SVG, drawn to the design system, animated stroke on scroll):

```
┌──────────── YOUR BROWSER ────────────┐      ┌──── PASSGENI SERVERS ────┐
│  ① Generate      ② Validate          │      │                          │
│  Web Crypto  →  compliance engine    │  ✗   │   ✓ signs certificate    │
│  (local)        (local JS)           │──────│     metadata only        │
│                                      │ no   │   ✗ never receives       │
│  ③ hash-only proof ─────────────────►│ pwd  │     the credential       │
└──────────────────────────────────────┘      └──────────────────────────┘
```

The red ✗ on the transmission line is the hero of this diagram. Caption: "The certificate contains a salted hash commitment and the validation results — never the credential." Link: "Read the security model →" (`/security`).

### Section 7 — TOOLS ECOSYSTEM

Six items exactly, 3×2 grid of quiet list-rows (not marketing cards): name, one-line job, mono keyboard-style glyph. Breach Checker, Strength Checker, Password Audit, Policy Generator, Secure Sharing, Certificate Verifier. **WiFi QR removed.**

### Section 8 — COMPLIANCE DASHBOARD PREVIEW

One framed product frame (rendered UI at 0.8 scale, slight perspective-none, soft shadow `sh3`) showing: certificate ledger table, compliance score ring, audit log stream. Overlaid top-right chip: `PRO`. Copy is two sentences max. CTA: "See plans →". Deliberately undersold — it's a preview, the frame does the selling.

### Section 9 — SOCIAL PROOF

Three quotes max, each attributed with role + context ("Security Engineer, Series B fintech"), typeset large in Newsreader Italic with role in Outfit. If real verifiable quotes don't exist yet, **ship the section with design-partner case snippets or omit it** — no invented quotes.

### Section 10 — FINAL CTA (full-bleed #0010A3, the only dark band)

```
        Will you have evidence,
        or just good intentions?          H2, white, italic accent

    [ Get Your First Certified Credential ]   accent #0FF280 on navy
        Free · No credential ever leaves your browser
```

---

## 3. DESIGN SYSTEM

### 3.1 Color tokens (CSS custom properties, replaces per-file `C` objects)

```css
:root {
  --pg-primary:      #0320FF;  /* actions, focus, live data */
  --pg-primary-hov:  #0218CC;
  --pg-primary-soft: rgba(3,32,255,0.07);
  --pg-secondary:    #0010A3;  /* dark band, deep accents */
  --pg-accent:       #0FF280;  /* PASS states + final CTA only — rationed */
  --pg-accent-ink:   #067A42;  /* accessible green for text on light */
  --pg-canvas:       #F7F8FC;
  --pg-surface-1:    #FFFFFF;
  --pg-surface-2:    #F1F3F9;
  --pg-surface-3:    #E9EDF6;
  --pg-border:       #E5E7EB;
  --pg-border-focus: #0320FF;
  --pg-text:         #0B0D17;
  --pg-text-sub:     #3D4257;
  --pg-text-muted:   #667085;
  --pg-fail:         #D92D20;
  --pg-warn:         #B54708;
  --pg-sh-1: 0 1px 2px rgba(16,24,40,.04);
  --pg-sh-2: 0 6px 16px rgba(16,24,40,.06);
  --pg-sh-3: 0 16px 40px rgba(16,24,40,.10);
}
```

Rules: `--pg-accent` appears only for PASS states and the final CTA button. Never as decoration. FAIL text uses `--pg-fail` (4.5:1 on white). `#0FF280` never carries text (contrast ~1.4:1 on white) — pair with `--pg-accent-ink` for labels.

### 3.2 Typography

| Role | Font | Size / LH | Weight |
|---|---|---|---|
| H1 | Outfit | 68px / 1.05, ls -0.03em | 700 |
| H1 accent word | Newsreader Italic | inherit | 500 italic |
| H2 | Outfit | 52px / 1.1 | 700 |
| H3 | Outfit | 30px / 1.2 | 650 |
| H4/labels | Outfit | 12px / caps / ls 0.09em | 700 |
| Body | Outfit | 18px / 1.7 | 400 |
| Body small | Outfit | 15px / 1.6 | 400 |
| Data/mono | JetBrains Mono | 14–15px | 500 |
| Password output | JetBrains Mono | 28px / 1.3 | 600 |

Newsreader Italic ration: max one italic phrase per section — it marks the *human* word in a technical sentence ("auditor", "evidence", "remember").
Font loading: `next/font` (Outfit, Newsreader, JetBrains Mono), replacing the `_document.js` `<link>` hack and Bricolage Grotesque entirely.

### 3.3 Spacing, radius, elevation, motion

- 4px base grid; section padding 128/72px (desktop/mobile); card padding 24px.
- Radius: 6px (inputs/chips), 10px (cards), 14px (studio frame). Nothing pill except micro-labels.
- Elevation: three shadows only (`--pg-sh-1/2/3`); depth also via surface-2/3 layering, not shadow spam.
- Motion (framer-motion): fade+8px rise on scroll-into-view, 0.45s `[0.22,1,0.36,1]`, once. Number transitions (entropy, DNA) tween 300ms. `prefers-reduced-motion` → all disabled. No infinite/looping animation anywhere.

### 3.4 Iconography & data-viz language

- 1.5px stroke line icons, 20px grid, currentColor. No filled blobs, no emoji.
- Meters: horizontal segmented bars (12 segments) rather than smooth gradients — reads as instrumentation.
- Status semantics everywhere: `✓ PASS` green-ink chip, `✗ FAIL` red chip, `● LOCKED` neutral chip with lock glyph. Same chip component across studio, tables, dashboard.

---

## 4. COMPONENT SYSTEM

```
components/v3/
  primitives/     Button (primary|ghost|accent), Chip (pass|fail|warn|locked|neutral),
                  MicroLabel, Eyebrow, SectionHeading, SegmentedMeter, Slider,
                  SegmentedControl, Toggle, Tooltip, MonoValue, Table
  studio/         ComplianceStudio        (orchestrator; modes: embedded|full)
                  CredentialOutput        (mono display, char-class coloring, copy,
                                           regenerate, reveal-on-focus)
                  ComplianceRail          (4 standard chips + per-control checklist)
                  ControlPanel            (password controls)
                  PassphrasePanel         (structure/words/separator/influence)
                  EntropyMeter            (bits + segmented bar + percentile note)
                  DNAScore                (0–100 composite, ring + factor breakdown)
                  AuditPreview            (the evidence record, redacted)
                  CertifyBar              (persistent CTA + upgrade trigger)
  home/           Hero, HowItWorks, AuditorTable, PassphraseShowcase,
                  ZeroKnowledgeDiagram, ToolsGrid, DashboardPreview,
                  Testimonials, FinalCTA
  layout/         Header (slim, 64px, canvas-blur), Footer
```

State: one `useComplianceStudio()` hook owns generation state; all studio children are pure renderers of its output. Generation + validation stay in `lib/generator.js` / `lib/compliance.js` / `lib/strength.js` (already pure — reuse, don't rewrite; **delete profession-seed path from password mode**, see A1).

---

## 5. GENERATOR REDESIGN — PASSWORD MODE (Compliance Studio)

The studio is one frame (`--pg-surface-1`, border, radius 14, `--pg-sh-2`) with an instrument layout. Desktop full mode:

```
┌ COMPLIANCE STUDIO ──────────────────────────── [Password | Passphrase] ┐
│                                                                        │
│  ① OUTPUT                                                              │
│  ┌──────────────────────────────────────────────────┐  ┌───────────┐  │
│  │  Vq7#mK2$pLw9@Fx4                    [copy][gen] │  │ ② STATUS  │  │
│  │  mono 28px — digits blue, symbols navy           │  │ NIST ✓PASS│  │
│  └──────────────────────────────────────────────────┘  │ SOC2 ●    │  │
│     Entropy ▰▰▰▰▰▰▰▰▰▱▱▱  92.3 bits                    │ HIPAA ●   │  │
│                                                        │ PCI  ●    │  │
│  ③ CONTROLS                                            │ ─────────  │  │
│  Length  ────────●──── 16      ABC ✓  123 ✓  #$% ✓     │ ④ DNA  87 │  │
│                                                        │  ring +   │  │
│  ⑤ AUDIT PREVIEW                                       │  4 factors│  │
│  ┌──────────────────────────────────────────────────┐  └───────────┘  │
│  │ credential_hash   sha256:9f2a…c41e   (salted)    │                 │
│  │ generated_at      2026-07-06T14:22:09Z  (local)  │                 │
│  │ entropy_bits      92.3                           │                 │
│  │ nist_800_63b      PASS  · 6/6 controls           │                 │
│  │ soc2_cc6_1        ████████ (unlock with Pro)     │                 │
│  └──────────────────────────────────────────────────┘                 │
│                                                                        │
│  ⑥ [ Certify this credential → ]        Free · verifiable at /cert/id │
└────────────────────────────────────────────────────────────────────────┘
```

Behavioral spec:
- **Output**: reveal by default (it's a generator, not a vault); per-character-class coloring (letters ink, digits `--pg-primary`, symbols `--pg-secondary`) so composition is visible without counting. Copy button gives 1.2s `✓ Copied — not stored` confirmation.
- **Compliance Status**: NIST chip expands to the 6-control checklist with per-control pass/fail. SOC2/HIPAA/PCI chips render locked but *alive*: they show `PASS`/`FAIL` verdict computed locally, with the control detail blurred + lock. Clicking a locked chip → inline upgrade popover (single objective: plan page), never a modal wall.
- **Controls**: one row. Length slider (8–64, default 16), three toggles (upper/digits/symbols). No profession selector (A1). Changing any control regenerates immediately — the studio never shows a stale credential against fresh settings.
- **DNA Score**: 0–100 composite ring (entropy 40%, pattern resistance 25%, dictionary distance 20%, composition 15%). Factor breakdown on hover/focus. It's the layman's mirror of the audit table.
- **Audit Preview**: styled as a real evidence record (mono key/value), including the salted hash commitment — this *is* the product demo of zero-knowledge. Locked rows show the row label with blurred value, proving paid depth exists (upgrade tension without dark patterns).
- **Certify bar**: persistent bottom bar of the studio, always visible in full mode (sticky within frame). One CTA. Free tier: creates account + issues NIST certificate. That first certificate is the activation event.
- Embedded (homepage) density hides ⑤ behind a "View audit record ▸" disclosure and compresses ② to a chip row.

---

## 6. GENERATOR REDESIGN — PASSPHRASE MODE

Not a re-skin: different controls, same evidence rail (status/DNA/audit identical components).

```
│  ① OUTPUT                                                              │
│  Quartz-Meadow7-Anchor-Tide          words colored per-word            │
│  Entropy ▰▰▰▰▰▰▰▰▱▱▱▱  68.5 bits                                       │
│                                                                        │
│  ③ CONTROLS                                                            │
│  STRUCTURE  [ Easy to Remember | Balanced | High Entropy ]             │
│     Easy: 4 common words, no mutation      ~44 bits                    │
│     Balanced: 4 words + digit + case mix   ~68 bits                    │
│     High: 5 rare words + symbol injection  ~96 bits                    │
│  WORDS      ───●──── 4    (range 3–8; live entropy delta shown)        │
│  SEPARATOR  [ – | space | . | none ]                                   │
│  INFLUENCE  ( optional: "ocean, jazz" )  ⓘ costs ≈ n bits of entropy   │
```

- **Structure presets** are the primary control (segmented, with the one-line entropy note under each). They set wordlist + mutation strategy; word count and separator remain independently adjustable after preset selection.
- **Influence Words** (successor to profession seeding, per A1): free-text tags that bias word selection toward a semantic field. The entropy meter immediately shows the reduction ("Influence applied: −6.2 bits") — honesty is the feature. Compliance rail re-validates; if influence drops a standard below threshold, the chip flips to FAIL in real time. This turns a gimmick into a teaching instrument.
- Wordlist: EFF large wordlist (7,776 words → 12.9 bits/word) as the entropy basis auditors recognize; "Easy" preset uses a curated 4k common-word subset (12 bits/word) — cite both in the audit record.
- Everything live: entropy, compliance chips, DNA, audit preview update on every control change with 300ms tweens. Certify bar identical to password mode.

---

## 7. MOBILE LAYOUTS (≤ 640px)

- H1 40px, H2 32px, body 17px; section padding 72px.
- Hero: stacked; CTAs full-width stacked; studio becomes the whole viewport below the fold — sticky mini-header inside the studio keeps the output + NIST chip visible while scrolling controls.
- Studio: single column in order ① output → ② status (horizontal chip scroll) → ③ controls → ④ DNA (compact horizontal bar variant) → ⑤ audit (accordion) → ⑥ certify bar becomes `position:sticky; bottom:0` within page flow — one persistent CTA on mobile, exactly one.
- Section 3 steps stack vertically with a left rail line connecting 01→02→03.
- Auditor table (Section 4): re-renders as definition-list cards per control (never horizontal scroll for critical content).
- Diagram (Section 6): vertical variant, browser box above server box.
- Tools grid → single-column list rows. Dashboard preview → cropped mobile frame.
- Touch targets ≥ 44px; sliders get 28px thumbs on touch.

---

## 8. CRO SPECIFICATION

Trust / Different / Upgrade — answered per surface:

- **Why trust?** Hero microcopy ("runs entirely in your browser"), audit-grade table with real citations (S4), zero-knowledge diagram with the ✗ transmission line (S6), salted hash visible in the audit preview, public `/cert/[id]` verification.
- **Why different?** The category label (micro-label, repeated in footer + schema), the evidence record in the studio (no generator shows one), the standards rail. Copy never says "strong passwords"; it says "credentials that pass".
- **Why upgrade?** Locked-but-alive standard chips + blurred audit rows. The free product is complete for NIST; the paid delta is *more standards + the ledger*, previewed honestly in S8.

Mechanics:
1. Primary hero CTA triggers product use, not navigation → activation before commitment.
2. One CTA per section, one objective per section (map in §1.5). Header keeps a single quiet "Sign in" + "Get started".
3. Certify gate is post-value: user certifies *after* seeing the evidence they'll receive.
4. No countdowns, no fake scarcity, no exit modals — anti-patterns are trust-killers for this audience.
5. Instrument events: `studio_generate`, `mode_switch`, `standard_chip_click(locked?)`, `audit_expand`, `certify_click`, `influence_applied`, per-section scroll depth. These six answer every funnel question V3 will face.

---

## 9. SEO / AEO / GEO / LLMO

- **Semantic skeleton**: single `<h1>`; each section a `<section aria-labelledby>` with a question-form `<h2>` where natural ("How does PassGeni work?", "What do auditors check in a password?", "What is a zero-knowledge password generator?"). Each section's first paragraph is a self-contained, extractable answer (AEO snippet discipline).
- **Entity-rich copy**: name the entities LLMs anchor on — NIST SP 800-63B, SOC 2 CC6.1, HIPAA §164.308, PCI DSS 8.3, Web Crypto API, k-anonymity, EFF wordlist. The auditor table doubles as an entity mesh.
- **Schema (JSON-LD, extend `seo/schema.js`)**: `Organization`, `WebSite`, `SoftwareApplication` (with `offers`), `FAQPage` (6–8 question-form Q&As mirroring section headings), `BreadcrumbList`, `HowTo` (Generate→Validate→Certify).
- **LLMO**: definitional sentence in hero source order ("PassGeni is a credential compliance platform that generates passwords locally and issues verifiable compliance certificates."); add `/llms.txt`; keep the studio SSR-renderable with static fallback output so crawlers see product semantics, not an empty div.
- Glossary/guides (already exist) interlink from the auditor table's control names.

---

## 10. ACCESSIBILITY (WCAG 2.1 AA)

- Contrast: all text ≥ 4.5:1 (`--pg-accent-ink` for green text; `#0FF280` backgrounds carry `#062D1B` text). Muted `#667085` used ≥ 15px only.
- Pass/fail never color-only: chips always carry ✓/✗/lock glyph + text.
- Studio is fully keyboard-operable: logical tab order ①→②→③→⑤→⑥; slider arrow-key steps; segmented controls as `radiogroup`; visible 2px `--pg-border-focus` outline (offset 2px) on everything.
- Live regions: `aria-live="polite"` announcement on generation ("New credential generated. Entropy 92 bits. NIST: pass."); entropy meter is `role="meter"` with `aria-valuenow`.
- Copy button announces "Copied to clipboard". Locked chips: `aria-disabled` with explanatory `aria-describedby`.
- Reveal/blur states never applied to content a screen reader needs (blurred audit rows expose "Available on Pro" text, not gibberish).
- `prefers-reduced-motion` respected globally (see §3.3).

---

## 11. TECHNICAL IMPLEMENTATION PLAN

Stack stays: Next.js (pages router), React 18, framer-motion, Supabase, existing cert/signing pipeline. This is a frontend refactor + design-system extraction, not a rebuild.

**Phase 0 — Foundation (1 sprint)**
- `styles/tokens.css` with §3.1 custom properties; wire into `globals.css`.
- `next/font` for Outfit / Newsreader / JetBrains Mono; remove Bricolage `<link>` from `_document.js`.
- Build `components/v3/primitives/*`. Kill per-file `C = {...}` token objects going forward.

**Phase 1 — Compliance Studio (2 sprints, highest risk first)**
- `useComplianceStudio()` hook wrapping `lib/generator.js` + `lib/compliance.js` + `lib/strength.js`.
- Engine changes: remove profession-seed path from `buildPassword` (A1: pool-only random); add passphrase structure presets + EFF wordlist + influence-word bias with entropy accounting; add locked-standard local evaluation (SOC2/HIPAA/PCI rulesets run client-side, gating is presentational).
- Build studio components (§4/§5/§6); ship at `/generator` behind a flag first.

**Phase 2 — Homepage (1.5 sprints)**
- New `pages/index.js` assembling `components/v3/home/*` with embedded studio; new copy per §2; schema extensions per §9.
- Remove WiFi QR from nav/tools index; 301 its route.

**Phase 3 — Certify loop + dashboard preview (1 sprint)**
- Certify bar → existing `api/generate-certificate` flow; ensure the client sends hash commitment + validation results only (verify no plaintext path — this is a release blocker).
- Static-data DashboardPreview frame reusing dashboard table components.

**Phase 4 — Hardening (0.5 sprint)**
- Axe + keyboard pass (§10), Lighthouse ≥ 95 perf/a11y/SEO, `prefers-reduced-motion` QA, mobile QA per §7, analytics events per §8.
- Staging (Railway `staging` branch) → production (Vercel `main`).

**Deletions**: ProfessionSelector from password mode, StatsBar/Ticker, WiFi QR surface, testimonial placeholders without attribution, Bricolage Grotesque.
**Untouched**: auth, billing (Paddle/LemonSqueezy), cert verification pages, API routes, dashboard internals (only previewed).
