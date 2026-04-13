# Contributing to PassGeni

Thank you for your interest in contributing. This document explains how to work with the codebase effectively.

---

## Before You Start

- **Security vulnerabilities** → email [security@passgeni.ai](mailto:security@passgeni.ai). Do not open a public issue.
- **Large features or architectural changes** → open an issue to discuss before writing code. Saves everyone time.
- **Small bugs, typos, docs** → feel free to open a PR directly.

---

## What We Welcome

| Contribution | Notes |
|---|---|
| Bug fixes | Always welcome. Include reproduction steps in the PR. |
| UI/UX improvements | Open an issue first to align on the approach. |
| New security tools | Discuss scope and security model in an issue first. |
| Documentation | Always welcome. |
| Performance improvements | Benchmark before/after if possible. |
| Accessibility fixes | Always welcome. |
| Test coverage | We appreciate it. |

## What Requires Discussion First

- New dependencies (we keep the bundle lean)
- Changes to the auth or billing flow
- New API routes that touch user data
- Changes to the zero-knowledge architecture

---

## Development Setup

```bash
git clone https://github.com/Giant-Tech-Solutions-llc/Passgeni-v2.git
cd Passgeni-v2/passgeni-frontend
npm install
cp .env.example .env.local   # fill in your own keys
npm run dev
```

See [README.md](README.md) for full environment variable reference.

---

## Workflow

1. **Fork** the repository
2. **Create a branch** from `main`:
   ```bash
   git checkout -b fix/describe-your-change
   # or
   git checkout -b feature/short-description
   ```
3. **Make your changes** (see conventions below)
4. **Test** — run `npm run build` and visually verify at `localhost:3000`
5. **Commit** with a clear message:
   ```
   fix: correct entropy calculation for passwords with emoji
   feat: add CCPA section to policy generator
   docs: clarify k-anonymity explanation in README
   ```
6. **Open a PR** against `main` — fill in the PR template fully

---

## Code Conventions

### Copy / text content

**All visible text lives in `content/copy.js` only.**

```js
// ✓ Correct
import { HERO } from "../content/copy.js";
<h1>{HERO.headline}</h1>

// ✗ Wrong
<h1>How strong is your password?</h1>
```

If you're adding a new page or section, add its copy to `copy.js` first, then import it. Do not hardcode strings in components.

### Animations

**All Framer Motion variants live in `lib/motion.js` only.**

```js
// ✓ Correct
import { btnPrimary, bcCard } from "../lib/motion.js";
<motion.button {...btnPrimary}>Submit</motion.button>

// ✗ Wrong
<motion.button whileHover={{ scale: 1.03 }}>Submit</motion.button>
```

Do not define inline animation variants. Add new variants to `lib/motion.js` and export them.

### Styling

- Use inline styles with CSS variables (`var(--font-heading)`, `var(--color-accent)`, etc.)
- Do not add new CSS classes unless absolutely necessary — check `globals.css` first
- Match the existing dark theme: background `#060608` / `#0a0a0c`, text `#fff` / `#aaa` / `#888`, accent `#C8FF00`

### Components

- Prefer editing existing components over creating new ones
- Keep components focused: one responsibility, no speculative abstractions
- Do not add error handling for impossible scenarios
- Do not add feature flags

### Security

- Never log passwords, tokens, or credentials
- All user input must be sanitized before rendering (prevent XSS)
- All API routes must validate method, content-type, and body shape
- Do not weaken the zero-knowledge guarantees of the generator, breach check, or secure share tools

---

## Pull Request Checklist

Before submitting:

- [ ] `npm run build` passes with no errors
- [ ] Changes visible at `localhost:3000` look correct
- [ ] Mobile layout checked at ~375px width if UI was changed
- [ ] All new visible strings are in `content/copy.js`
- [ ] All new animations use variants from `lib/motion.js`
- [ ] No `.env` files, passwords, or API keys in the diff
- [ ] PR description explains *why*, not just *what*

---

## Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type: short description (imperative, lowercase, no period)

Optional longer body explaining why this change was needed.
```

Types: `fix`, `feat`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

---

## Questions?

Open a [GitHub Discussion](https://github.com/Giant-Tech-Solutions-llc/Passgeni-v2/discussions) or email [support@passgeni.ai](mailto:support@passgeni.ai).
