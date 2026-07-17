// Builds data/wordlist.ts from the EFF large wordlist (eff_large_wordlist.txt).
// Usage: node build-wordlist.mjs <input.txt> <output.ts>
import { readFileSync, writeFileSync } from "node:fs";

const [, , input, output] = process.argv;
const lines = readFileSync(input, "utf8").trim().split(/\r?\n/);
const words = lines.map((l) => l.split(/\s+/)[1]).filter(Boolean);
if (words.length !== 7776) throw new Error(`expected 7776 words, got ${words.length}`);

// "Easy" preset pool: the 4096 shortest words (ties alphabetical) = exactly 12.0 bits/word.
const easy = [...words]
  .sort((a, b) => a.length - b.length || a.localeCompare(b))
  .slice(0, 4096)
  .sort();

const banner = `// GENERATED FILE — do not edit by hand. Rebuild with scripts/build-wordlist.mjs
// Source: EFF large wordlist (7,776 words, 12.92 bits/word)
// https://www.eff.org/files/2016/07/18/eff_large_wordlist.txt
// EASY_WORDS: 4,096 shortest-word subset (12.0 bits/word).
`;
const ts = `${banner}
export const EFF_WORDS: readonly string[] = ${JSON.stringify(words)};

export const EASY_WORDS: readonly string[] = ${JSON.stringify(easy)};

export const EFF_BITS_PER_WORD = Math.log2(EFF_WORDS.length); // 12.925
export const EASY_BITS_PER_WORD = Math.log2(EASY_WORDS.length); // 12.0
`;
writeFileSync(output, ts);
console.log(`wrote ${output}: ${words.length} EFF words, ${easy.length} easy words`);
