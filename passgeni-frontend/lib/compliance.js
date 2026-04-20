/**
 * PassGeni Compliance Standards Engine
 * Single source of truth for all standard definitions.
 * Both client-side generation and server-side certification import from here.
 *
 * Primary IDs use canonical names (HIPAA, NIST-800-63B, etc.).
 * Legacy short IDs (hipaa, nist, pci, soc2, iso, fips) are supported via
 * normalizeStandardId() so existing session tokens continue to work.
 */

export const STANDARDS = {
  "NIST-800-63B": {
    id: "NIST-800-63B",
    label: "NIST 800-63B",
    shortLabel: "NIST",
    minLength: 8,
    maxLength: null,
    requireUppercase: false,
    requireLowercase: false,
    requireNumbers: false,
    requireSpecial: false,
    forbidDictionaryWords: false,
    forbidRepeatingChars: false,
    minEntropyBits: 0,
    rotationRequired: false,
    auditTrailRequired: false,
    description: "Length over complexity. No forced character types per NIST guidance.",
    targetMarket: "US Federal, Defense",
    certVersion: "1.0",
  },
  HIPAA: {
    id: "HIPAA",
    label: "HIPAA",
    shortLabel: "HIPAA",
    minLength: 12,
    maxLength: null,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecial: true,
    forbidDictionaryWords: true,
    forbidRepeatingChars: false,
    minEntropyBits: 0,
    rotationRequired: false,
    auditTrailRequired: false,
    description: "Upper, lower, number, special. No dictionary words.",
    targetMarket: "Healthcare, MedTech",
    certVersion: "1.0",
  },
  "PCI-DSS-v4": {
    id: "PCI-DSS-v4",
    label: "PCI-DSS v4",
    shortLabel: "PCI-DSS",
    minLength: 12,
    maxLength: null,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecial: true,
    forbidDictionaryWords: false,
    forbidRepeatingChars: true,
    minEntropyBits: 40,
    rotationRequired: true,
    auditTrailRequired: false,
    description: "Min entropy 40 bits. No repeating chars. Rotation required.",
    targetMarket: "Payments, FinTech",
    certVersion: "1.0",
  },
  SOC2: {
    id: "SOC2",
    label: "SOC 2",
    shortLabel: "SOC 2",
    minLength: 16,
    maxLength: null,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecial: true,
    forbidDictionaryWords: false,
    forbidRepeatingChars: false,
    minEntropyBits: 0,
    rotationRequired: true,
    auditTrailRequired: true,
    description: "Complexity + rotation policy evidence required.",
    targetMarket: "SaaS, Cloud services",
    certVersion: "1.0",
  },
  "ISO-27001": {
    id: "ISO-27001",
    label: "ISO 27001",
    shortLabel: "ISO",
    minLength: 14,
    maxLength: null,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecial: true,
    forbidDictionaryWords: false,
    forbidRepeatingChars: false,
    minEntropyBits: 0,
    rotationRequired: false,
    auditTrailRequired: true,
    description: "Policy-aligned generation, audit trail mandatory.",
    targetMarket: "Enterprise, GovTech",
    certVersion: "1.0",
  },
  "FIPS-140-3": {
    id: "FIPS-140-3",
    label: "FIPS 140-3",
    shortLabel: "FIPS",
    minLength: 20,
    maxLength: null,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecial: true,
    forbidDictionaryWords: true,
    forbidRepeatingChars: false,
    minEntropyBits: 0,
    rotationRequired: false,
    auditTrailRequired: true,
    entropySourceRequired: "crypto.getRandomValues",
    description: "FIPS-validated entropy source, documented provenance.",
    targetMarket: "Government contractors",
    certVersion: "1.0",
  },
};

// ─── Legacy ID mapping ─────────────────────────────────────────
// Maps short legacy IDs (used in session tokens) to canonical IDs
const LEGACY_ID_MAP = {
  nist:  "NIST-800-63B",
  hipaa: "HIPAA",
  pci:   "PCI-DSS-v4",
  soc2:  "SOC2",
  iso:   "ISO-27001",
  fips:  "FIPS-140-3",
};

/**
 * Normalise a standard ID — accepts both legacy short IDs and canonical IDs.
 * Returns the canonical ID or null if unknown.
 */
export function normalizeStandardId(id) {
  if (!id) return null;
  if (STANDARDS[id]) return id;
  return LEGACY_ID_MAP[id] ?? null;
}

export const STANDARD_IDS = Object.keys(STANDARDS);

export const STANDARD_LABELS = Object.fromEntries(
  Object.values(STANDARDS).map((s) => [s.id, s.label])
);

// ─── Entropy calculation ───────────────────────────────────────

/**
 * Calculate Shannon entropy bits for a password given its char pool size.
 * entropy = log2(poolSize) * length
 */
export function calculateEntropy(password, charPoolSize) {
  if (!password || !charPoolSize) return 0;
  return Math.log2(charPoolSize) * password.length;
}

/**
 * Infer char pool size from a password's actual character set.
 */
export function inferCharPoolSize(password) {
  let pool = 0;
  if (/[a-z]/.test(password)) pool += 26;
  if (/[A-Z]/.test(password)) pool += 26;
  if (/[0-9]/.test(password)) pool += 10;
  if (/[^a-zA-Z0-9]/.test(password)) pool += 32;
  return pool || 1;
}

// ─── Validation ────────────────────────────────────────────────

/**
 * Validate generation params against a compliance standard.
 * Used server-side in /api/generate-certificate.
 * Does NOT receive the password — only the parameters.
 *
 * Accepts both canonical IDs ('HIPAA') and legacy IDs ('hipaa').
 *
 * @param {{
 *   length: number,
 *   hasUppercase: boolean,
 *   hasLowercase: boolean,
 *   hasNumbers: boolean,
 *   hasSpecial: boolean,
 *   hasDictionaryWords?: boolean,
 *   hasRepeatingChars?: boolean,
 *   entropyBits?: number,
 * }} params
 * @param {string} standardId
 * @returns {{ valid: boolean, gaps: string[] }}
 */
export function validateAgainstStandard(params, standardId) {
  const canonicalId = normalizeStandardId(standardId);
  const standard = canonicalId ? STANDARDS[canonicalId] : null;
  if (!standard) return { valid: false, gaps: [`Unknown standard: ${standardId}`] };

  const gaps = [];
  const {
    length,
    hasUppercase,
    hasLowercase,
    hasNumbers,
    hasSpecial,
    hasDictionaryWords = false,
    hasRepeatingChars = false,
    entropyBits = 0,
  } = params;

  if (length < standard.minLength) {
    gaps.push(`Length ${length} is below minimum ${standard.minLength} for ${standard.label}`);
  }
  if (standard.requireUppercase && !hasUppercase) {
    gaps.push(`${standard.label} requires uppercase characters`);
  }
  if (standard.requireLowercase && !hasLowercase) {
    gaps.push(`${standard.label} requires lowercase characters`);
  }
  if (standard.requireNumbers && !hasNumbers) {
    gaps.push(`${standard.label} requires numeric characters`);
  }
  if (standard.requireSpecial && !hasSpecial) {
    gaps.push(`${standard.label} requires special characters`);
  }
  if (standard.forbidDictionaryWords && hasDictionaryWords) {
    gaps.push(`${standard.label} forbids dictionary words`);
  }
  if (standard.forbidRepeatingChars && hasRepeatingChars) {
    gaps.push(`${standard.label} forbids repeating characters`);
  }
  if (standard.minEntropyBits > 0 && entropyBits < standard.minEntropyBits) {
    gaps.push(`Entropy ${entropyBits.toFixed(1)} bits is below minimum ${standard.minEntropyBits} bits for ${standard.label}`);
  }

  return { valid: gaps.length === 0, gaps };
}

/**
 * Given generation params, return array of all canonical standard IDs the credential satisfies.
 * Used to populate standards_met in the certificate JWT.
 */
export function getStandardsMet(params) {
  return STANDARD_IDS.filter((id) => validateAgainstStandard(params, id).valid);
}
