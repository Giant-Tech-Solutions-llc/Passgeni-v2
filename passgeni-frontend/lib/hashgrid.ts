// The brand system: deterministic cell grids seeded from credential data.
// The credential never leaves the browser, but its fingerprint is visible —
// that is the product, drawn. Pure module, no network, no DOM.

/** FNV-1a 32-bit string hash. */
export function fnv1a(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** mulberry32 PRNG — tiny, deterministic, good enough for visuals. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type HashCell = {
  col: number;
  row: number;
  /** 0 = off; 1–3 = intensity tiers */
  tier: 0 | 1 | 2 | 3;
};

/**
 * Deterministic cell grid for a seed string.
 * `density` is the fraction of cells that are on (default 0.42).
 */
export function hashGrid(
  seed: string,
  cols: number,
  rows: number,
  density = 0.42,
): HashCell[] {
  const rand = mulberry32(fnv1a(seed));
  const cells: HashCell[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const r = rand();
      const tier =
        r >= density ? 0 : r < density * 0.25 ? 3 : r < density * 0.6 ? 2 : 1;
      cells.push({ col, row, tier: tier as HashCell["tier"] });
    }
  }
  return cells;
}
