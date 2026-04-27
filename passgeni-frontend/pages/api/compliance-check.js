/**
 * POST /api/compliance-check
 *
 * Public endpoint — no auth required.
 * Accepts password generation params and returns gap analysis for all standards.
 *
 * Body: {
 *   length: number,
 *   has_upper: boolean, has_lower: boolean, has_numbers: boolean, has_special: boolean,
 *   entropy_bits?: number, char_pool_size?: number,
 * }
 * Returns: { results: { [canonicalId]: { valid, label, gaps, shortLabel } } }
 */

import {
  STANDARDS,
  validateAgainstStandard,
  calculateEntropy,
  inferCharPoolSize,
} from "../../lib/compliance.js";

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const {
    length,
    has_upper,
    has_lower,
    has_numbers,
    has_special,
    entropy_bits: rawEntropy,
    char_pool_size: rawPool,
  } = req.body ?? {};

  if (!length || typeof length !== "number") {
    return res.status(400).json({ error: "length (number) is required" });
  }

  const charPoolSize = Number(rawPool) || inferCharPoolSize("x".repeat(length));
  const entropyBits  = rawEntropy ?? calculateEntropy("x".repeat(length), charPoolSize);

  const params = {
    length:             Number(length),
    hasUppercase:       Boolean(has_upper),
    hasLowercase:       Boolean(has_lower),
    hasNumbers:         Boolean(has_numbers),
    hasSpecial:         Boolean(has_special),
    hasDictionaryWords: false,
    hasRepeatingChars:  false,
    entropyBits:        Number(entropyBits),
  };

  const results = {};
  for (const [id, std] of Object.entries(STANDARDS)) {
    const { valid, gaps } = validateAgainstStandard(params, id);
    results[id] = {
      valid,
      label:      std.label,
      shortLabel: std.shortLabel,
      gaps,
    };
  }

  res.setHeader("Cache-Control", "no-store");
  return res.status(200).json({ results });
}
