// Credential generation, analysis, and scoring.
// Pure module: no network access anywhere in lib/ — this is the product claim
// "no credential ever leaves your browser", enforceable by grepping for fetch.
import {
  EFF_WORDS,
  EASY_WORDS,
  EFF_BITS_PER_WORD,
  EASY_BITS_PER_WORD,
} from "@/data/wordlist";
import {
  evaluateStandards,
  type CredentialAnalysis,
  type StandardResult,
} from "@/lib/standards";

// ---------- randomness ----------

/** Uniform integer in [0, max) via rejection sampling over crypto.getRandomValues. */
function randomInt(max: number): number {
  if (max <= 0) throw new Error("randomInt: max must be positive");
  const buf = new Uint32Array(1);
  const limit = Math.floor(0x100000000 / max) * max;
  for (;;) {
    crypto.getRandomValues(buf);
    if (buf[0] < limit) return buf[0] % max;
  }
}

const pick = <T,>(arr: readonly T[]): T => arr[randomInt(arr.length)];

// ---------- character sets ----------

const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";
export const SYMBOLS = "!@#$%^&*()-_=+[]{}<>?/~;:";

export type PasswordOptions = {
  length: number; // 8–64
  upper: boolean;
  digits: boolean;
  symbols: boolean;
};

export type PassphraseStructure = "easy" | "balanced" | "high";
export type Separator = "-" | " " | "." | "";

export type PassphraseOptions = {
  structure: PassphraseStructure;
  words: number; // 3–8
  separator: Separator;
  influence: string; // free text, comma/space separated
};

export type DnaFactor = {
  id: "entropy" | "pattern" | "dictionary" | "composition";
  label: string;
  score: number;
  max: number;
  note: string;
};

export type InfluenceInfo = {
  tokens: string[];
  penaltyBits: number;
  literalTokens: string[]; // tokens inserted verbatim (0 bits)
};

export type GenerationResult = {
  mode: "password" | "passphrase";
  value: string;
  /** passphrase only: the word segments before joining, for per-word coloring */
  segments?: string[];
  entropyBits: number;
  entropyBasis: string;
  analysis: CredentialAnalysis;
  standards: StandardResult[];
  dna: { total: number; factors: DnaFactor[] };
  influence?: InfluenceInfo;
  generatedAt: string; // ISO, local clock
};

// ---------- analysis ----------

const QWERTY_ROWS = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];

function hasSequence(value: string): boolean {
  const v = value.toLowerCase();
  for (let i = 0; i + 2 < v.length; i++) {
    const a = v.charCodeAt(i);
    const b = v.charCodeAt(i + 1);
    const c = v.charCodeAt(i + 2);
    const alnum = /[a-z0-9]{3}/.test(v.slice(i, i + 3));
    if (alnum && ((b === a + 1 && c === b + 1) || (b === a - 1 && c === b - 1))) return true;
    const tri = v.slice(i, i + 3);
    if (QWERTY_ROWS.some((row) => row.includes(tri))) return true;
  }
  return false;
}

/** Wordlist words (>= 4 chars) embedded in the credential. Password mode only. */
function findDictionaryHits(value: string): string[] {
  const v = value.toLowerCase();
  if (v.length < 4) return [];
  const hits: string[] = [];
  for (const w of EFF_WORDS) {
    if (w.length >= 4 && v.includes(w)) {
      hits.push(w);
      if (hits.length >= 3) break;
    }
  }
  return hits;
}

export function analyzeCredential(
  value: string,
  mode: "password" | "passphrase",
  entropyBits: number,
  wordCount?: number,
): CredentialAnalysis {
  const hasUpper = /[A-Z]/.test(value);
  const hasLower = /[a-z]/.test(value);
  const hasDigit = /[0-9]/.test(value);
  const hasSymbol = /[^A-Za-z0-9]/.test(value);
  return {
    length: value.length,
    hasUpper,
    hasLower,
    hasDigit,
    hasSymbol,
    classCount: [hasUpper, hasLower, hasDigit, hasSymbol].filter(Boolean).length,
    entropyBits,
    hasRepeatRun: /(.)\1\1/.test(value),
    hasSequence: hasSequence(value),
    dictionaryHits: mode === "password" ? findDictionaryHits(value) : [],
    mode,
    wordCount,
  };
}

// ---------- DNA score ----------
// Composite 0–100: entropy 40, pattern resistance 25, dictionary distance 20,
// composition 15. The layman's mirror of the audit table.

export function dnaScore(a: CredentialAnalysis): { total: number; factors: DnaFactor[] } {
  const entropy = Math.round(Math.min(a.entropyBits / 100, 1) * 40);
  let pattern = 25;
  if (a.hasRepeatRun) pattern -= 12;
  if (a.hasSequence) pattern -= 13;
  const dictionary =
    a.mode === "passphrase"
      ? a.entropyBits >= 50
        ? 20
        : 10
      : Math.max(0, 20 - a.dictionaryHits.length * 10);
  const composition =
    a.mode === "passphrase"
      ? Math.min(15, (a.wordCount ?? 0) * 3 + (a.classCount - 1) * 1.5)
      : a.classCount * 3.75;
  const factors: DnaFactor[] = [
    {
      id: "entropy",
      label: "Entropy",
      score: entropy,
      max: 40,
      note: `${a.entropyBits.toFixed(1)} bits vs 100-bit ceiling`,
    },
    {
      id: "pattern",
      label: "Pattern resistance",
      score: pattern,
      max: 25,
      note:
        pattern === 25
          ? "no runs, sequences, or keyboard walks"
          : "penalized: repeated or sequential characters",
    },
    {
      id: "dictionary",
      label: "Dictionary distance",
      score: Math.round(dictionary),
      max: 20,
      note:
        a.mode === "passphrase"
          ? "wordlist-based by design; scored on total entropy"
          : a.dictionaryHits.length === 0
            ? "no wordlist words embedded"
            : `found: ${a.dictionaryHits.join(", ")}`,
    },
    {
      id: "composition",
      label: "Composition",
      score: Math.round(composition),
      max: 15,
      note:
        a.mode === "passphrase"
          ? `${a.wordCount} words, ${a.classCount} character classes`
          : `${a.classCount} of 4 character classes`,
    },
  ];
  return { total: factors.reduce((s, f) => s + f.score, 0), factors };
}

// ---------- password generation ----------

export function generatePassword(opts: PasswordOptions): GenerationResult {
  const length = Math.min(64, Math.max(8, opts.length));
  let pool = LOWER;
  if (opts.upper) pool += UPPER;
  if (opts.digits) pool += DIGITS;
  if (opts.symbols) pool += SYMBOLS;

  // Rejection loop: every selected class present, no triple runs, no sequences.
  let value = "";
  for (let attempt = 0; attempt < 100; attempt++) {
    let v = "";
    for (let i = 0; i < length; i++) v += pool[randomInt(pool.length)];
    if (opts.upper && !/[A-Z]/.test(v)) continue;
    if (opts.digits && !/[0-9]/.test(v)) continue;
    if (opts.symbols && !/[^A-Za-z0-9]/.test(v)) continue;
    if (!/[a-z]/.test(v)) continue;
    if (/(.)\1\1/.test(v) || hasSequence(v)) continue;
    value = v;
    break;
  }
  if (!value) value = Array.from({ length }, () => pool[randomInt(pool.length)]).join("");

  const entropyBits = Math.log2(pool.length) * length;
  const analysis = analyzeCredential(value, "password", entropyBits);
  return {
    mode: "password",
    value,
    entropyBits,
    entropyBasis: `log2(${pool.length}) × ${length} characters`,
    analysis,
    standards: evaluateStandards(analysis),
    dna: dnaScore(analysis),
    generatedAt: new Date().toISOString(),
  };
}

// ---------- passphrase generation ----------

export const STRUCTURES: Record<
  PassphraseStructure,
  { label: string; note: string; list: readonly string[]; bitsPerWord: number }
> = {
  easy: {
    label: "Easy to remember",
    note: "common words, no mutation",
    list: EASY_WORDS,
    bitsPerWord: EASY_BITS_PER_WORD,
  },
  balanced: {
    label: "Balanced",
    note: "capitalized words + one digit",
    list: EFF_WORDS,
    bitsPerWord: EFF_BITS_PER_WORD,
  },
  high: {
    label: "High entropy",
    note: "capitalized words + digit + symbol",
    list: EFF_WORDS,
    bitsPerWord: EFF_BITS_PER_WORD,
  },
};

const cap = (w: string) => w.charAt(0).toUpperCase() + w.slice(1);

function parseInfluence(raw: string): string[] {
  return raw
    .toLowerCase()
    .split(/[\s,]+/)
    .map((t) => t.replace(/[^a-z]/g, ""))
    .filter((t) => t.length >= 3)
    .slice(0, 3);
}

export function generatePassphrase(opts: PassphraseOptions): GenerationResult {
  const wordCount = Math.min(8, Math.max(3, opts.words));
  const structure = STRUCTURES[opts.structure];
  const tokens = parseInfluence(opts.influence);

  const fullBits = structure.bitsPerWord;
  let bits = 0;
  const literalTokens: string[] = [];
  const words: string[] = [];

  for (let i = 0; i < wordCount; i++) {
    const token = tokens[i]; // influence applies to the first N slots
    if (token) {
      // Bias this slot toward the token's semantic field: same-stem words.
      const matches = structure.list.filter(
        (w) => w.startsWith(token.slice(0, 4)) || w.includes(token),
      );
      if (matches.length >= 2) {
        words.push(pick(matches));
        bits += Math.log2(matches.length);
      } else {
        words.push(token); // literal insertion carries zero entropy
        literalTokens.push(token);
      }
    } else {
      words.push(pick(structure.list));
      bits += fullBits;
    }
  }

  let segments = words;
  if (opts.structure !== "easy") {
    segments = words.map(cap);
    // one random word gets a digit appended: +log2(10) + log2(n) bits
    const di = randomInt(wordCount);
    segments[di] = segments[di] + DIGITS[randomInt(10)];
    bits += Math.log2(10) + Math.log2(wordCount);
    if (opts.structure === "high" && wordCount > 1) {
      // a second, distinct word gets a symbol: +log2(8) + log2(n-1) bits
      const symbolSet = "!@#$%&*+";
      let si = randomInt(wordCount - 1);
      if (si >= di) si++;
      segments[si] = segments[si] + symbolSet[randomInt(symbolSet.length)];
      bits += Math.log2(symbolSet.length) + Math.log2(wordCount - 1);
    }
  }

  const value = segments.join(opts.separator);
  const idealBits =
    fullBits * wordCount +
    (opts.structure === "easy"
      ? 0
      : Math.log2(10) +
        Math.log2(wordCount) +
        (opts.structure === "high" && wordCount > 1 ? 3 + Math.log2(wordCount - 1) : 0));
  const penaltyBits = Math.max(0, idealBits - bits);

  const analysis = analyzeCredential(value, "passphrase", bits, wordCount);
  return {
    mode: "passphrase",
    value,
    segments,
    entropyBits: bits,
    entropyBasis: `${wordCount} words × ${fullBits.toFixed(2)} bits (${structure.list.length.toLocaleString()}-word list)${penaltyBits > 0 ? " − influence penalty" : ""}`,
    analysis,
    standards: evaluateStandards(analysis),
    dna: dnaScore(analysis),
    influence:
      tokens.length > 0 ? { tokens, penaltyBits, literalTokens } : undefined,
    generatedAt: new Date().toISOString(),
  };
}

// ---------- audit evidence ----------

export type AuditRecord = {
  record_type: string;
  credential_hash: string; // sha256 over salt || credential — never the credential
  hash_salt: string;
  generated_at: string;
  generation_method: string;
  entropy_bits: string;
  entropy_basis: string;
  standards: Record<string, string>;
};

const hex = (buf: ArrayBuffer | Uint8Array) =>
  Array.from(buf instanceof Uint8Array ? buf : new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

/** Salted hash commitment. This is the only derivative of the credential that
 * would ever appear in a certificate — the credential itself never leaves. */
export async function buildAuditRecord(r: GenerationResult): Promise<AuditRecord> {
  const salt = new Uint8Array(16);
  crypto.getRandomValues(salt);
  const data = new TextEncoder().encode(hex(salt) + r.value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  const standards: Record<string, string> = {};
  for (const s of r.standards) {
    standards[s.id.toLowerCase().replace(/-/g, "_")] =
      `${s.verdict.toUpperCase()} · ${s.passed}/${s.total} controls`;
  }
  return {
    record_type: "PG-EVIDENCE/3.0",
    credential_hash: `sha256:${hex(digest)}`,
    hash_salt: hex(salt),
    generated_at: r.generatedAt,
    generation_method:
      r.mode === "password"
        ? "crypto.getRandomValues, rejection-sampled, in-browser"
        : "EFF wordlist indices via crypto.getRandomValues, in-browser",
    entropy_bits: r.entropyBits.toFixed(1),
    entropy_basis: r.entropyBasis,
    standards,
  };
}
