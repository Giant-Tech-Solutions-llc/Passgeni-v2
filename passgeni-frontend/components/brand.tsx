"use client";

// Brand components: every visual here derives from lib/hashgrid.ts — the one
// metaphor (the hash / commitment grid) applied consistently.

import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "motion/react";
import { hashGrid } from "@/lib/hashgrid";

/* ---------- BrandMark: the logo glyph, a 4x4 fingerprint ---------- */

export function BrandMark({ size = 22 }: { size?: number }) {
  // Fixed seed: the brand's own fingerprint. cells stay stable across renders.
  const cells = useMemo(() => hashGrid("passgeni:v3", 4, 4, 0.55), []);
  const u = size / 4;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden="true"
      className="shrink-0"
    >
      {cells.map((c) =>
        c.tier === 0 ? null : (
          <rect
            key={`${c.col}-${c.row}`}
            x={c.col * u + 0.75}
            y={c.row * u + 0.75}
            width={u - 1.5}
            height={u - 1.5}
            rx={1.5}
            fill="currentColor"
            opacity={c.tier === 3 ? 1 : c.tier === 2 ? 0.55 : 0.28}
          />
        ),
      )}
    </svg>
  );
}

/* ---------- HashField: the generative background texture ---------- */
/* Seeded from the live credential — regenerating a password visibly reseeds
   the brand surface. Low contrast, ambient, masked at the edges. */

export function HashField({
  seed,
  cols = 36,
  rows = 14,
  className = "",
  dark = false,
}: {
  seed: string;
  cols?: number;
  rows?: number;
  className?: string;
  dark?: boolean;
}) {
  const reduced = useReducedMotion();
  const cells = useMemo(() => hashGrid(seed, cols, rows, 0.4), [seed, cols, rows]);
  const cell = 100 / cols;
  const color = dark ? "#8fa3ff" : "#0320ff";
  const alpha = dark ? [0.1, 0.18, 0.3] : [0.05, 0.09, 0.15];
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{
        maskImage: "radial-gradient(ellipse 75% 90% at 50% 40%, black 30%, transparent 100%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 75% 90% at 50% 40%, black 30%, transparent 100%)",
      }}
    >
      <svg
        className="h-full w-full"
        viewBox={`0 0 100 ${(rows * cell).toFixed(2)}`}
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Cell identity is positional: a reseed cross-fades opacities via CSS
            transitions instead of remounting hundreds of nodes (keeps the main
            thread free during generation — the decode animation runs alongside). */}
        {cells.map((c) => (
          <rect
            key={`${c.col}-${c.row}`}
            x={c.col * cell + cell * 0.22}
            y={c.row * cell + cell * 0.22}
            width={cell * 0.56}
            height={cell * 0.56}
            rx={cell * 0.12}
            fill={color}
            style={{
              opacity: c.tier === 0 ? 0 : alpha[c.tier - 1],
              transition: reduced
                ? undefined
                : `opacity 500ms cubic-bezier(0.22,1,0.36,1) ${((c.col * 7 + c.row * 13) % 17) * 18}ms`,
            }}
          />
        ))}
      </svg>
    </div>
  );
}

/* Subscribes to studio generations so the texture reseeds with the product. */
export function useLiveSeed(initial = "passgeni:v3") {
  const [seed, setSeed] = useState(initial);
  useEffect(() => {
    const onResult = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (typeof detail === "string") setSeed(detail);
    };
    window.addEventListener("pg:result", onResult);
    return () => window.removeEventListener("pg:result", onResult);
  }, []);
  return seed;
}

/* ---------- FingerprintStrip: 16x3 credential fingerprint (studio/audit) ---------- */

export function FingerprintStrip({
  seed,
  className = "",
}: {
  seed: string;
  className?: string;
}) {
  const cells = useMemo(() => hashGrid(seed, 18, 3, 0.5), [seed]);
  return (
    <svg
      width="90"
      height="15"
      viewBox="0 0 90 15"
      aria-hidden="true"
      className={className}
    >
      {cells.map((c) =>
        c.tier === 0 ? null : (
          <rect
            key={`${c.col}-${c.row}`}
            x={c.col * 5 + 1}
            y={c.row * 5 + 1}
            width={3}
            height={3}
            rx={0.75}
            fill="currentColor"
            opacity={c.tier === 3 ? 0.9 : c.tier === 2 ? 0.5 : 0.25}
          />
        ),
      )}
    </svg>
  );
}

/* ---------- SectionDivider: hash strip at act boundaries ---------- */

export function SectionDivider({ seed, dark = false }: { seed: string; dark?: boolean }) {
  const cells = useMemo(() => hashGrid(seed, 64, 2, 0.35), [seed]);
  return (
    <div aria-hidden="true" className="overflow-hidden">
      <svg
        className="mx-auto block h-[14px] w-full max-w-[1120px] px-5"
        viewBox="0 0 448 14"
        preserveAspectRatio="xMidYMid meet"
      >
        {cells.map((c) =>
          c.tier === 0 ? null : (
            <rect
              key={`${c.col}-${c.row}`}
              x={c.col * 7 + 1.5}
              y={c.row * 7 + 1.5}
              width={4}
              height={4}
              rx={1}
              fill={dark ? "#8fa3ff" : "#0320ff"}
              opacity={(c.tier === 3 ? 0.5 : c.tier === 2 ? 0.3 : 0.15) * (dark ? 1.4 : 1)}
            />
          ),
        )}
      </svg>
    </div>
  );
}
