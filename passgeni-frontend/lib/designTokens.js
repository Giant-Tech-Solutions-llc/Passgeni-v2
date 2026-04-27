// =============================================================
// PASSGENI — DESIGN TOKENS
// lib/designTokens.js
// =============================================================
// Single source of truth for visual design values.
// Import from here; never hardcode magic values in components.
//
// Dark depth layers:
//   bg       #060608  — page background
//   card     #0a0a0c  — card / panel surface
//   elevated #0e0e12  — hover state / raised elements
// =============================================================

export const colors = {
  // Depth
  bg:           "#060608",
  card:         "#0a0a0c",
  elevated:     "#0e0e12",

  // Accent
  accent:       "#c8ff00",
  accentDim:    "rgba(200,255,0,0.5)",
  accentFaint:  "rgba(200,255,0,0.08)",
  accentBorder: "rgba(200,255,0,0.15)",
  accentGlow:   "0 0 28px rgba(200,255,0,0.35)",

  // Text
  text:         "#ffffff",
  textMuted:    "#aaaaaa",
  textDim:      "#555555",

  // Borders
  border:       "rgba(255,255,255,0.07)",
  borderSubtle: "rgba(255,255,255,0.04)",

  // Semantic
  success:      "#00d084",
  successFaint: "rgba(0,208,132,0.08)",
  danger:       "#ff6b6b",
  dangerFaint:  "rgba(255,107,107,0.08)",
  warning:      "#facc15",
  info:         "#60a5fa",
};

// 8px grid — use multiples of 8 for all spacing
export const spacing = {
  1:  8,
  2:  16,
  3:  24,
  4:  32,
  5:  40,
  6:  48,
  7:  56,
  8:  64,
  9:  72,
  10: 80,
  12: 96,
  16: 128,
};

export const fonts = {
  heading: "Outfit, sans-serif",
  body:    "Outfit, sans-serif",
  mono:    "'Space Mono', monospace",
};

export const fontWeights = {
  regular: 400,
  medium:  500,
  bold:    700,
  black:   800,
};

export const radius = {
  sm:   4,
  md:   8,
  lg:   14,
  xl:   20,
  pill: 100,
};

export const shadows = {
  card:        "0 1px 3px rgba(0,0,0,0.5)",
  elevated:    "0 8px 32px rgba(0,0,0,0.4)",
  accentGlow:  "0 0 28px rgba(200,255,0,0.25)",
  accentStrong:"0 0 40px rgba(200,255,0,0.45)",
};

export const transition = {
  fast:   "0.15s ease",
  medium: "0.25s ease",
  slow:   "0.4s ease",
};

// Pre-composed style objects for common surfaces
export const cardStyle = {
  background:   colors.card,
  border:       `1px solid ${colors.border}`,
  borderRadius: radius.lg,
  padding:      spacing[3],
};

export const cardHoverStyle = {
  background:   colors.elevated,
  borderColor:  colors.accentBorder,
  transform:    "translateY(-2px)",
};

// Eyebrow label pattern used across sections
export const eyebrowStyle = {
  fontFamily:    fonts.mono,
  fontSize:      10,
  fontWeight:    fontWeights.bold,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color:         colors.textDim,
  marginBottom:  spacing[2],
};
