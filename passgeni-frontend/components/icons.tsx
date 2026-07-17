// Custom icon set — one style: 20px grid, 1.5px stroke, round caps, 2px corner
// logic, currentColor. Certificate/audit vocabulary only. No icon libraries.

import type { SVGProps } from "react";

function I({
  children,
  size = 16,
  ...props
}: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

type P = SVGProps<SVGSVGElement> & { size?: number };

/** clipboard with a hash cell */
export const IconCopy = (p: P) => (
  <I {...p}>
    <rect x="7" y="7" width="9" height="10" rx="2" />
    <path d="M13 7V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h1" />
    <path d="M10.5 11.5h3M10.5 14h1.5" />
  </I>
);

/** regenerate cycle */
export const IconCycle = (p: P) => (
  <I {...p}>
    <path d="M16 10a6 6 0 1 1-1.76-4.24" />
    <path d="M16 3v3.2h-3.2" />
  </I>
);

/** padlock */
export const IconLock = (p: P) => (
  <I {...p}>
    <rect x="4.5" y="9" width="11" height="8" rx="2" />
    <path d="M7 9V6.5a3 3 0 0 1 6 0V9" />
    <path d="M10 12.5v1.5" />
  </I>
);

export const IconCheck = (p: P) => (
  <I {...p}>
    <path d="M4 10.5l4 4L16 6" />
  </I>
);

export const IconCross = (p: P) => (
  <I {...p}>
    <path d="M5.5 5.5l9 9M14.5 5.5l-9 9" />
  </I>
);

/** certificate seal: circle + scallops + ribbon */
export const IconSeal = (p: P) => (
  <I {...p}>
    <circle cx="10" cy="8" r="4.5" />
    <path d="M8 15.5 7 18l3-1.5L13 18l-1-2.5" />
    <path d="M8.2 8.2l1.3 1.3 2.3-2.6" />
  </I>
);

/** ledger: timestamped rows */
export const IconLedger = (p: P) => (
  <I {...p}>
    <rect x="3.5" y="3.5" width="13" height="13" rx="2" />
    <path d="M6.5 7.5h2M10.5 7.5h3M6.5 10.5h2M10.5 10.5h3M6.5 13.5h2M10.5 13.5h1.5" />
  </I>
);

/** document with seal */
export const IconDocSeal = (p: P) => (
  <I {...p}>
    <path d="M5 3.5h7l3 3V16.5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-12a1 1 0 0 1 1-1Z" />
    <path d="M12 3.5V7h3" />
    <circle cx="8.5" cy="12" r="2" />
    <path d="M8.5 14v2" />
  </I>
);

/** signature chain link */
export const IconChain = (p: P) => (
  <I {...p}>
    <path d="M8.5 11.5a3 3 0 0 0 4.2.3l2-2a3 3 0 0 0-4.2-4.2l-1 1" />
    <path d="M11.5 8.5a3 3 0 0 0-4.2-.3l-2 2a3 3 0 0 0 4.2 4.2l1-1" />
  </I>
);

/** entropy gauge */
export const IconGauge = (p: P) => (
  <I {...p}>
    <path d="M4 13a6 6 0 1 1 12 0" />
    <path d="M10 13l3-3.5" />
    <path d="M4 16h12" />
  </I>
);

/** breach scan: magnifier over hash cells */
export const IconScan = (p: P) => (
  <I {...p}>
    <circle cx="9" cy="9" r="5" />
    <path d="M13 13l3.5 3.5" />
    <path d="M7.2 8h1.2M10 8h1.2M7.2 10.4h1.2M10 10.4h.6" strokeWidth="1.3" />
  </I>
);

/** fingerprint grid: the brand mark as icon */
export const IconGrid = (p: P) => (
  <I {...p}>
    <rect x="4" y="4" width="3.2" height="3.2" rx="0.8" />
    <rect x="12.8" y="4" width="3.2" height="3.2" rx="0.8" />
    <rect x="8.4" y="8.4" width="3.2" height="3.2" rx="0.8" />
    <rect x="4" y="12.8" width="3.2" height="3.2" rx="0.8" />
    <rect x="12.8" y="12.8" width="3.2" height="3.2" rx="0.8" />
  </I>
);

/** one-time share: arrow through a keyhole slot */
export const IconShare = (p: P) => (
  <I {...p}>
    <path d="M3.5 10h9" />
    <path d="M9.5 6.5 13 10l-3.5 3.5" />
    <rect x="14.5" y="4.5" width="2" height="11" rx="1" />
  </I>
);
