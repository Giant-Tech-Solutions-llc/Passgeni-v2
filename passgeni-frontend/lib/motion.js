// =============================================================
// PASSGENI — SHARED MOTION PRIMITIVES
// lib/motion.js
// =============================================================
// Single source of truth for all framer-motion animation
// variants and helpers. Import here; never define inline.
//
// Style: Structural / Stagger
//   EASE   [0.16, 1, 0.3, 1]  — tight ease-out, confident
//   ENTER  500ms               — section / card entrances
//   FAST   180ms               — hover, border, color
// =============================================================

export const EASE = [0.16, 1, 0.3, 1];
export const ENTER_MS = 0.5;  // seconds
export const FAST_MS  = 0.18; // seconds
export const STAGGER  = 0.08; // seconds between staggered children

// ─── Single-element entrance ─────────────────────────────────

/** Fade up from y offset. Use on headings, prose blocks, standalone elements. */
export const fadeUp = (delay = 0, y = 24) => ({
  initial:     { opacity: 0, y },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true, amount: 0.15 },
  transition:  { duration: ENTER_MS, delay, ease: EASE },
});

/** Fade in place (no y offset). Use on decorative or full-width elements. */
export const fadeIn = (delay = 0) => ({
  initial:     { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport:    { once: true, amount: 0.1 },
  transition:  { duration: ENTER_MS, delay, ease: EASE },
});

/** Entrance for the very first element on a page (animate, not whileInView). */
export const heroEntrance = (delay = 0, y = 28) => ({
  initial:    { opacity: 0, y },
  animate:    { opacity: 1, y: 0 },
  transition: { duration: ENTER_MS, delay, ease: EASE },
});

// ─── Stagger container + children ────────────────────────────

/**
 * Wrap a grid/list in motion.div with this prop spread.
 * Children use staggerChild below.
 * @param {number} delay  — initial delay before first child starts
 */
export const staggerContainer = (delay = 0) => ({
  initial:     { opacity: 1 },
  whileInView: { opacity: 1 },
  viewport:    { once: true, amount: 0.1 },
  transition:  { staggerChildren: STAGGER, delayChildren: delay },
});

/**
 * Each child in a stagger group. Spread onto motion.div / motion.article.
 * The parent's staggerContainer drives timing automatically.
 */
export const staggerChild = {
  initial:    { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport:   { once: true },
  transition: { duration: ENTER_MS, ease: EASE },
};

// ─── Section heading reveal ───────────────────────────────────

/** For .section-header h2 elements. Matches homepage pattern exactly. */
export const sectionHeadReveal = {
  initial:     { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true, margin: "-80px" },
  transition:  { duration: 0.6, ease: EASE },
};

// ─── Interactive states ───────────────────────────────────────

/** .btn-primary — lime button with glow on hover */
export const btnPrimary = {
  whileHover: { scale: 1.03, boxShadow: "0 0 28px rgba(200,255,0,0.35)" },
  whileTap:   { scale: 0.97 },
  transition: { duration: FAST_MS },
};

/** .btn-ghost — outlined button, subtle lift */
export const btnGhost = {
  whileHover: { scale: 1.02, borderColor: "rgba(200,255,0,0.5)" },
  whileTap:   { scale: 0.98 },
  transition: { duration: FAST_MS },
};

/** .bc card — spring lift without fighting the CSS hover */
export const cardHover = {
  whileHover: { y: -4, transition: { duration: 0.22, ease: EASE } },
  whileTap:   { y: 0,  transition: { duration: 0.12 } },
};

// ─── Convenience: merge fadeUp + cardHover for .bc cards ─────

/** Card entrance + hover. Spread onto motion.article / motion.div with className="bc". */
export const bcCard = (i = 0) => ({
  initial:     { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true },
  transition:  { duration: ENTER_MS, delay: i * STAGGER, ease: EASE },
  whileHover:  { y: -4, transition: { duration: 0.22, ease: EASE } },
});
