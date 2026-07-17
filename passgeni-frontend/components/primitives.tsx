"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { IconCheck, IconCross, IconLock } from "@/components/icons";

/* ---------- Reveal: the one scroll animation. Fade + 16px drift, once. ---------- */

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- CountUp: data that moves feels alive ---------- */

export function CountUp({
  value,
  decimals = 0,
  duration = 400,
  className = "",
}: {
  value: number;
  decimals?: number;
  duration?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);

  useEffect(() => {
    if (reduced) {
      setDisplay(value);
      return;
    }
    const from = fromRef.current;
    fromRef.current = value;
    if (from === value) return;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4); // matches the site easing family
      setDisplay(from + (value - from) * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration, reduced]);

  return <span className={className}>{display.toFixed(decimals)}</span>;
}

/* ---------- Buttons: layered depth, one hue, real pressed state ---------- */

const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-[6px] font-semibold transition-[background-color,box-shadow,transform,border-color,color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] active:translate-y-[1px] disabled:opacity-50";

const btnVariants = {
  primary:
    "text-white bg-gradient-to-b from-[#1a35ff] to-primary hover:from-primary-hov hover:to-primary-down " +
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_1px_2px_rgba(3,32,255,0.35)] active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]",
  ghost:
    "border border-line bg-surface-1 text-ink hover:bg-surface-2 hover:border-sub/40 " +
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_1px_2px_rgba(16,24,40,0.06)] active:shadow-inset",
  accent:
    "text-[#062d1b] bg-gradient-to-b from-[#3ff79c] to-accent hover:brightness-95 " +
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_1px_2px_rgba(6,122,66,0.4)] active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)]",
  quiet: "text-sub hover:text-ink hover:bg-surface-2",
} as const;

const btnSizes = {
  lg: "h-12 px-6 text-[16px]",
  md: "h-10 px-4 text-[15px]",
  sm: "h-8 px-3 text-[13px]",
} as const;

export function Button({
  variant = "primary",
  size = "md",
  href,
  className = "",
  ...props
}: {
  variant?: keyof typeof btnVariants;
  size?: keyof typeof btnSizes;
  href?: string;
  className?: string;
  children: ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const cls = `${btnBase} ${btnVariants[variant]} ${btnSizes[size]} ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls}>
        {props.children}
      </Link>
    );
  }
  return <button type="button" className={cls} {...props} />;
}

/* ---------- Status chips: never color-only (WCAG 1.4.1) ---------- */

export type ChipState = "pass" | "fail" | "warn" | "locked" | "neutral";

const chipStyles: Record<ChipState, string> = {
  pass: "bg-[#e7fbf1] text-accent-ink border-[#b7ecd2]",
  fail: "bg-[#fdecea] text-fail border-[#f5c6c0]",
  warn: "bg-[#fdf3e7] text-warn border-[#f2ddc0]",
  locked: "bg-surface-2 text-muted border-line",
  neutral: "bg-surface-2 text-sub border-line",
};

function ChipGlyph({ state }: { state: ChipState }) {
  if (state === "pass") return <IconCheck size={11} strokeWidth={2.4} />;
  if (state === "fail") return <IconCross size={11} strokeWidth={2.4} />;
  if (state === "locked") return <IconLock size={11} strokeWidth={2} />;
  if (state === "warn") return <span aria-hidden="true">!</span>;
  return <span aria-hidden="true">·</span>;
}

export function Chip({
  state,
  children,
  className = "",
}: {
  state: ChipState;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-[6px] border px-2 py-0.5 font-mono text-[12px] font-medium ${chipStyles[state]} ${className}`}
    >
      <ChipGlyph state={state} />
      {children}
    </span>
  );
}

/* ---------- Micro-label: the category marker ---------- */

export function MicroLabel({ children }: { children: ReactNode }) {
  return (
    <span className="microlabel inline-flex items-center gap-2 rounded-full border border-line bg-surface-1 px-3.5 py-1.5 text-sub shadow-s1">
      {children}
    </span>
  );
}

/* ---------- Section heading block ---------- */

export function SectionHeading({
  id,
  eyebrow,
  title,
  lede,
  align = "left",
}: {
  id: string;
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  align?: "left" | "center";
}) {
  const alignCls = align === "center" ? "text-center mx-auto" : "";
  return (
    <div className={`max-w-[720px] ${alignCls}`}>
      <p className="microlabel text-primary [.act-dark_&]:text-[#8fa3ff]">{eyebrow}</p>
      <h2
        id={id}
        className="mt-3 text-[32px] leading-[1.15] font-bold tracking-[-0.02em] text-ink sm:text-[44px] lg:text-[52px] lg:leading-[1.1]"
      >
        {title}
      </h2>
      {lede ? <p className="mt-4 text-[18px] leading-[1.7] text-sub">{lede}</p> : null}
    </div>
  );
}

/* ---------- Segmented meter: 12 cells, stamps in on remount ---------- */

export function SegmentedMeter({
  value,
  max = 100,
  label,
  className = "",
  animateKey,
}: {
  value: number;
  max?: number;
  label: string;
  className?: string;
  /** change to replay the fill animation (e.g. generation timestamp) */
  animateKey?: string | number;
}) {
  const reduced = useReducedMotion();
  const segments = 12;
  const filled = Math.round(Math.min(value / max, 1) * segments);
  return (
    <div
      role="meter"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
      className={`flex items-center gap-[3px] ${className}`}
    >
      {Array.from({ length: segments }, (_, i) => (
        <span
          key={animateKey !== undefined ? `${animateKey}-${i}` : i}
          aria-hidden="true"
          className={`h-[10px] w-full max-w-[14px] flex-1 rounded-[2px] ${
            !reduced && animateKey !== undefined && i < filled ? "seg-in" : ""
          } ${
            i < filled
              ? filled <= 3
                ? "bg-fail"
                : filled <= 6
                  ? "bg-warn"
                  : "bg-accent-ink"
              : "bg-surface-3"
          }`}
          style={
            !reduced && animateKey !== undefined && i < filled
              ? { animationDelay: `${i * 22}ms` }
              : undefined
          }
        />
      ))}
    </div>
  );
}
