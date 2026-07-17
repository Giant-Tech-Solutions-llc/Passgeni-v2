"use client";

// The Compliance Studio: PassGeni's signature surface.
// One instrument frame: credential → analysis → evidence.
// All generation and validation happens in lib/engine.ts, locally.

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  generatePassword,
  generatePassphrase,
  buildAuditRecord,
  STRUCTURES,
  type AuditRecord,
  type GenerationResult,
  type PasswordOptions,
  type PassphraseOptions,
  type PassphraseStructure,
  type Separator,
} from "@/lib/engine";
import { fnv1a } from "@/lib/hashgrid";
import type { StandardResult } from "@/lib/standards";
import { Button, Chip, CountUp, SegmentedMeter } from "@/components/primitives";
import { FingerprintStrip } from "@/components/brand";
import { IconCheck, IconCopy, IconCross, IconCycle, IconLock } from "@/components/icons";

export type StudioMode = "password" | "passphrase";

/* ================= state ================= */

function useComplianceStudio(initialMode: StudioMode) {
  const [mode, setMode] = useState<StudioMode>(initialMode);
  const [pw, setPw] = useState<PasswordOptions>({
    length: 16,
    upper: true,
    digits: true,
    symbols: true,
  });
  const [pp, setPp] = useState<PassphraseOptions>({
    // five words: the smallest Balanced structure that clears NIST's 70-bit bar
    structure: "balanced",
    words: 5,
    separator: "-",
    influence: "",
  });
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [audit, setAudit] = useState<AuditRecord | null>(null);

  const generate = useCallback(() => {
    setResult(mode === "password" ? generatePassword(pw) : generatePassphrase(pp));
  }, [mode, pw, pp]);

  // The studio never shows a stale credential against fresh settings.
  useEffect(() => {
    generate();
  }, [generate]);

  useEffect(() => {
    let live = true;
    if (result) {
      buildAuditRecord(result).then((a) => {
        if (live) setAudit(a);
      });
      // Reseed the brand texture from the credential's hash — never the credential.
      window.dispatchEvent(
        new CustomEvent("pg:result", { detail: String(fnv1a(result.value)) }),
      );
    }
    return () => {
      live = false;
    };
  }, [result]);

  // Hero "Generate Password" button fires this event instead of navigating.
  useEffect(() => {
    const onFire = () => generate();
    window.addEventListener("pg:generate", onFire);
    return () => window.removeEventListener("pg:generate", onFire);
  }, [generate]);

  return { mode, setMode, pw, setPw, pp, setPp, result, audit, generate };
}

/* ================= small parts ================= */

function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex rounded-[6px] border border-line bg-surface-2 p-0.5 shadow-inset">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={`min-h-[40px] flex-1 rounded-[5px] px-2.5 text-[13px] font-semibold transition-all duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] sm:min-h-[32px] ${
            value === o.value ? "bg-surface-1 text-ink shadow-s1" : "text-muted hover:text-sub"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function ClassToggle({
  glyph,
  label,
  on,
  onChange,
}: {
  glyph: string;
  label: string;
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={`inline-flex h-11 items-center gap-1.5 rounded-[6px] border px-3 font-mono text-[13px] font-medium transition-all duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] active:translate-y-[1px] sm:h-10 ${
        on
          ? "border-primary bg-primary-soft text-primary shadow-[inset_0_1px_2px_rgba(3,32,255,0.1)]"
          : "border-line bg-surface-1 text-muted hover:border-sub/40"
      }`}
    >
      {on ? <IconCheck size={12} strokeWidth={2.2} /> : <span aria-hidden="true">○</span>}
      {glyph}
    </button>
  );
}

/* ---- credential decode: characters resolve left → right, under 400ms ---- */

const SCRAMBLE = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789#$%&*+?";

function useDecodedValue(value: string, enabled: boolean) {
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    if (!enabled) {
      setDisplay(value);
      return;
    }
    const D = 340;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min((now - start) / D, 1);
      const resolved = Math.floor(t * value.length);
      let out = value.slice(0, resolved);
      for (let i = resolved; i < value.length; i++) {
        const c = value[i];
        // separators stay put so the credential's structure reads during decode
        out +=
          c === " " || c === "-" || c === "."
            ? c
            : SCRAMBLE[(Math.random() * SCRAMBLE.length) | 0];
      }
      setDisplay(out);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, enabled]);
  return display;
}

/* Colored credential: composition visible without counting (see V3 spec §5). */
function ColoredCredential({ result }: { result: GenerationResult }) {
  const reduced = useReducedMotion();
  const display = useDecodedValue(result.value, !reduced);
  const settled = display === result.value;

  if (settled && result.mode === "passphrase" && result.segments) {
    const wordColors = ["text-ink", "text-primary", "text-secondary"];
    const sep = result.segments.length > 1
      ? result.value.slice(result.segments[0].length, result.value.indexOf(result.segments[1]))
      : "";
    return (
      <span>
        {result.segments.map((w, i) => (
          <span key={i}>
            {i > 0 && <span className="text-muted">{sep || ""}</span>}
            <span className={wordColors[i % 3]}>{w}</span>
          </span>
        ))}
      </span>
    );
  }
  return (
    <span>
      {display.split("").map((ch, i) => (
        <span
          key={i}
          className={/[0-9]/.test(ch) ? "text-primary" : /[^A-Za-z0-9]/.test(ch) ? "text-secondary" : "text-ink"}
        >
          {ch}
        </span>
      ))}
    </span>
  );
}

/* Copy button morphs into its confirmation state — no toast */
function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <>
      <button
        type="button"
        aria-label="Copy credential to clipboard"
        onClick={async () => {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        }}
        className={`inline-flex h-8 items-center gap-1.5 rounded-[6px] border px-3 font-mono text-[12px] font-semibold transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] active:translate-y-[1px] ${
          copied
            ? "border-[#b7ecd2] bg-[#e7fbf1] text-accent-ink"
            : "border-line bg-surface-1 text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_1px_2px_rgba(16,24,40,0.06)] hover:bg-surface-2"
        }`}
      >
        {copied ? <IconCheck size={12} strokeWidth={2.2} /> : <IconCopy size={13} />}
        {copied ? "Copied · not stored" : "Copy"}
      </button>
      <span aria-live="polite" className="sr-only">
        {copied ? "Copied to clipboard. Not stored." : ""}
      </span>
    </>
  );
}

/* ================= compliance rail ================= */

function StandardsRail({
  standards,
  open,
  setOpen,
  stampKey,
}: {
  standards: StandardResult[];
  open: string | null;
  setOpen: (id: string | null) => void;
  stampKey: string;
}) {
  const reduced = useReducedMotion();
  return (
    <div>
      <p className="microlabel text-muted">Compliance status</p>
      <ul className="mt-2 space-y-1.5">
        {standards.map((s, i) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => setOpen(open === s.id ? null : s.id)}
              aria-expanded={open === s.id}
              aria-describedby={s.locked ? `locked-note-${s.id}` : undefined}
              className={`flex w-full items-center justify-between gap-2 rounded-[6px] border border-line bg-surface-1 px-3 py-2 text-left shadow-s1 transition-colors duration-150 hover:border-sub/40 ${
                s.locked ? "locked-row" : ""
              }`}
            >
              <span className="flex items-center gap-1.5 font-mono text-[13px] font-semibold text-ink">
                {s.shortLabel}
                {s.locked && (
                  <span className="text-muted">
                    <IconLock size={11} />
                  </span>
                )}
              </span>
              {/* verdict chips stamp in sequentially after each generation */}
              <motion.span
                key={`${stampKey}-${s.id}`}
                initial={reduced ? false : { opacity: 0, scale: 1.15 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: 0.28 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <Chip state={s.verdict === "pass" ? "pass" : "fail"}>
                  {s.verdict.toUpperCase()}
                </Chip>
              </motion.span>
            </button>
            {s.locked && (
              <span id={`locked-note-${s.id}`} className="sr-only">
                Verdict computed locally. Control detail available on Pro.
              </span>
            )}
            {open === s.id && (
              <div className="mt-1.5 rounded-[6px] border border-line bg-inset p-3 shadow-inset">
                {s.locked ? (
                  <>
                    <ul aria-hidden="true" className="evidence-locked space-y-1">
                      {s.controls.map((c) => (
                        <li key={c.id} className="font-mono text-[12px] text-sub">
                          {c.pass ? "✓" : "✗"} {c.label} · {c.detail}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-2 text-[13px] leading-snug text-sub">
                      {s.label} verdict is computed in your browser. The per-control
                      evidence unlocks with Pro.
                    </p>
                    <Link
                      href="/pricing"
                      className="mt-1 inline-block text-[13px] font-semibold text-primary hover:underline"
                    >
                      See plans →
                    </Link>
                  </>
                ) : (
                  <ul className="space-y-1.5">
                    {s.controls.map((c) => (
                      <li key={c.id} className="flex items-start gap-2 font-mono text-[12px] leading-snug">
                        <span className={c.pass ? "text-accent-ink" : "text-fail"}>
                          {c.pass ? (
                            <IconCheck size={11} strokeWidth={2.4} />
                          ) : (
                            <IconCross size={11} strokeWidth={2.4} />
                          )}
                        </span>
                        <span className="text-sub">
                          <span className="text-ink">{c.label}</span> · {c.detail}
                          <span className="sr-only">{c.pass ? " passed" : " failed"}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ================= DNA block: 4-factor segmented instrument ================= */

function DnaBlock({ result, seed }: { result: GenerationResult; seed: string }) {
  return (
    <div className="rounded-[10px] border border-line-soft bg-surface-1 p-4 shadow-card">
      <div className="flex items-baseline justify-between">
        <p className="microlabel text-muted">DNA score</p>
        <p className="font-mono text-[26px] font-semibold leading-none text-ink">
          <CountUp value={result.dna.total} duration={450} />
          <span className="text-[13px] text-muted">/100</span>
        </p>
      </div>
      {/* the credential's fingerprint — the brand grid, seeded by this generation */}
      <div className="mt-2 text-primary">
        <FingerprintStrip seed={seed} />
      </div>
      <dl className="mt-3 space-y-2.5">
        {result.dna.factors.map((f) => (
          <div key={f.id} title={f.note}>
            <div className="flex justify-between font-mono text-[11px] text-muted">
              <dt>{f.label}</dt>
              <dd>
                {f.score}/{f.max}
              </dd>
            </div>
            <SegmentedMeter
              value={f.score}
              max={f.max}
              label={`${f.label}: ${f.note}`}
              className="mt-1"
              animateKey={result.generatedAt}
            />
          </div>
        ))}
      </dl>
    </div>
  );
}

/* ================= audit preview ================= */

function AuditPreview({
  audit,
  standards,
  seed,
}: {
  audit: AuditRecord | null;
  standards: StandardResult[];
  seed: string;
}) {
  if (!audit) return null;
  const hash = audit.credential_hash;
  const shortHash = `${hash.slice(0, 15)}…${hash.slice(-4)}`;
  const rows: [string, string, boolean][] = [
    ["record_type", audit.record_type, false],
    ["credential_hash", `${shortHash} (salted)`, false],
    ["generated_at", `${audit.generated_at} (local clock)`, false],
    ["generation_method", audit.generation_method, false],
    ["entropy_bits", `${audit.entropy_bits} · ${audit.entropy_basis}`, false],
    ...standards.map(
      (s) =>
        [
          s.id.toLowerCase().replace(/-/g, "_"),
          `${s.verdict.toUpperCase()} · ${s.passed}/${s.total} controls`,
          s.locked,
        ] as [string, string, boolean],
    ),
  ];
  return (
    <div className="rounded-[10px] border border-line-soft bg-inset p-4 shadow-inset">
      <div className="flex items-center justify-between gap-3">
        <p className="microlabel text-muted">Audit evidence preview</p>
        <span className="flex items-center gap-2 font-mono text-[11px] text-muted">
          <span className="hidden sm:inline">what your certificate contains</span>
          <span className="text-primary/70">
            <FingerprintStrip seed={seed} className="h-[10px] w-auto" />
          </span>
        </span>
      </div>
      <dl className="mt-3 space-y-1">
        {rows.map(([k, v, locked]) => (
          <div key={k} className="grid grid-cols-[150px_1fr] gap-2 font-mono text-[12px] leading-relaxed sm:grid-cols-[190px_1fr]">
            <dt className="text-muted">{k}</dt>
            {locked ? (
              <dd>
                <span aria-hidden="true" className="evidence-locked text-sub">
                  {v}
                </span>
                <span className="ml-2 rounded-[4px] bg-surface-3 px-1.5 py-0.5 text-[10px] font-semibold text-muted">
                  PRO
                </span>
                <span className="sr-only">Available on Pro</span>
              </dd>
            ) : (
              <dd className="break-all text-sub">{v}</dd>
            )}
          </div>
        ))}
      </dl>
      <p className="mt-3 text-[13px] text-muted">
        The record holds a salted hash commitment and the validation results. The
        credential itself is never included and never transmitted.
      </p>
    </div>
  );
}

/* ================= controls ================= */

function SliderWithChip({
  id,
  label,
  min,
  max,
  value,
  onChange,
}: {
  id: string;
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
}) {
  const fill = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <label htmlFor={id} className="microlabel text-muted">
        {label}
      </label>
      <div className="relative mt-1">
        {/* value chip follows the thumb */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-4 z-10 -translate-x-1/2 rounded-[5px] bg-ink px-1.5 py-px font-mono text-[11px] font-semibold text-white transition-[left] duration-100"
          style={{ left: `calc(${fill}% + ${(50 - fill) * 0.2}px)` }}
        >
          {value}
        </span>
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          value={value}
          style={{ "--fill": `${fill}%` } as React.CSSProperties}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </div>
    </div>
  );
}

function PasswordControls({
  pw,
  setPw,
}: {
  pw: PasswordOptions;
  setPw: (p: PasswordOptions) => void;
}) {
  const sliderId = useId();
  return (
    <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
      <div className="min-w-[220px] flex-1">
        <SliderWithChip
          id={sliderId}
          label="Length"
          min={8}
          max={64}
          value={pw.length}
          onChange={(length) => setPw({ ...pw, length })}
        />
      </div>
      <div className="flex gap-2" role="group" aria-label="Character sets">
        <ClassToggle glyph="ABC" label="Include uppercase letters" on={pw.upper} onChange={(v) => setPw({ ...pw, upper: v })} />
        <ClassToggle glyph="123" label="Include digits" on={pw.digits} onChange={(v) => setPw({ ...pw, digits: v })} />
        <ClassToggle glyph="#$%" label="Include symbols" on={pw.symbols} onChange={(v) => setPw({ ...pw, symbols: v })} />
      </div>
    </div>
  );
}

function PassphraseControls({
  pp,
  setPp,
  influence,
}: {
  pp: PassphraseOptions;
  setPp: (p: PassphraseOptions) => void;
  influence?: GenerationResult["influence"];
}) {
  const wordsId = useId();
  const influenceId = useId();
  return (
    <div className="space-y-4">
      <div>
        <p className="microlabel mb-1.5 text-muted">Structure</p>
        <SegmentedControl<PassphraseStructure>
          label="Passphrase structure"
          value={pp.structure}
          onChange={(v) => setPp({ ...pp, structure: v })}
          options={[
            { value: "easy", label: "Easy to remember" },
            { value: "balanced", label: "Balanced" },
            { value: "high", label: "High entropy" },
          ]}
        />
        <p className="mt-1.5 font-mono text-[12px] text-muted">{STRUCTURES[pp.structure].note}</p>
      </div>
      <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
        <div className="min-w-[180px] flex-1">
          <SliderWithChip
            id={wordsId}
            label="Words"
            min={3}
            max={8}
            value={pp.words}
            onChange={(words) => setPp({ ...pp, words })}
          />
        </div>
        <div>
          <p className="microlabel mb-1.5 text-muted">Separator</p>
          <SegmentedControl<Separator>
            label="Word separator"
            value={pp.separator}
            onChange={(v) => setPp({ ...pp, separator: v })}
            options={[
              { value: "-", label: "dash" },
              { value: " ", label: "space" },
              { value: ".", label: "dot" },
              { value: "", label: "none" },
            ]}
          />
        </div>
      </div>
      <div>
        <label htmlFor={influenceId} className="microlabel text-muted">
          Influence words <span className="normal-case tracking-normal">(optional)</span>
        </label>
        <input
          id={influenceId}
          type="text"
          value={pp.influence}
          onChange={(e) => setPp({ ...pp, influence: e.target.value })}
          placeholder="ocean, jazz"
          autoComplete="off"
          spellCheck={false}
          className="mt-1.5 h-10 w-full max-w-[320px] rounded-[6px] border border-line bg-inset px-3 font-mono text-[14px] text-ink shadow-inset transition-colors placeholder:text-muted focus:border-primary"
        />
        {influence && (
          <p className="mt-1.5 font-mono text-[12px] text-warn">
            Influence applied: −{influence.penaltyBits.toFixed(1)} bits
            {influence.literalTokens.length > 0 &&
              ` · "${influence.literalTokens.join('", "')}" inserted verbatim (0 bits)`}
          </p>
        )}
      </div>
    </div>
  );
}

/* ================= the studio ================= */

export function ComplianceStudio({
  variant = "full",
  initialMode = "password",
}: {
  variant?: "embedded" | "full";
  initialMode?: StudioMode;
}) {
  const studio = useComplianceStudio(initialMode);
  const { result, audit } = studio;
  const [openStandard, setOpenStandard] = useState<string | null>(null);
  // open by default in both variants: the evidence record IS the category claim
  const [auditOpen, setAuditOpen] = useState(true);
  const [certifyOpen, setCertifyOpen] = useState(false);

  const seed = useMemo(() => (result ? String(fnv1a(result.value)) : "passgeni:v3"), [result]);

  const announcement = useMemo(() => {
    if (!result) return "";
    const nist = result.standards.find((s) => s.id === "NIST-800-63B");
    return `New credential generated. Entropy ${Math.round(result.entropyBits)} bits. NIST: ${nist?.verdict}.`;
  }, [result]);

  return (
    <section
      aria-label="Compliance Studio — live credential generator"
      className="overflow-hidden rounded-[14px] border border-line-soft bg-surface-1 text-left shadow-raised"
    >
      {/* header */}
      <div className="flex items-center justify-between gap-3 border-b border-line bg-surface-2 px-4 py-3 sm:px-6">
        <p className="microlabel flex items-center gap-2 text-sub">
          Compliance Studio
        </p>
        <div className="w-[220px]">
          <SegmentedControl<StudioMode>
            label="Credential mode"
            value={studio.mode}
            onChange={(m) => studio.setMode(m)}
            options={[
              { value: "password", label: "Password" },
              { value: "passphrase", label: "Passphrase" },
            ]}
          />
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>

      {!result ? (
        /* SSR / pre-hydration fallback: crawlers and first paint see semantics, not an empty div */
        <div className="p-6 sm:p-8">
          <p className="font-mono text-[22px] tracking-wide text-muted" aria-hidden="true">
            ················
          </p>
          <p className="mt-2 text-[15px] text-muted">
            Generating a credential locally with the Web Crypto API…
          </p>
        </div>
      ) : (
        <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[1fr_260px] lg:gap-8">
          {/* left column: output → controls → audit */}
          <div className="min-w-0 space-y-6">
            {/* ① output — the recessed instrument well */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-[10px] border border-line-soft bg-inset px-4 py-4 shadow-inset">
                <output
                  aria-label="Generated credential"
                  className="min-w-0 break-all font-mono text-[20px] font-semibold leading-[1.3] sm:text-[26px]"
                >
                  <ColoredCredential result={result} />
                </output>
                <div className="flex shrink-0 items-center gap-2">
                  <CopyButton value={result.value} />
                  <button
                    type="button"
                    onClick={studio.generate}
                    aria-label="Generate a new credential"
                    className="inline-flex h-8 items-center gap-1.5 rounded-[6px] border border-line bg-surface-1 px-3 font-mono text-[12px] font-semibold text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_1px_2px_rgba(16,24,40,0.06)] transition-all duration-150 hover:bg-surface-2 active:translate-y-[1px]"
                  >
                    <IconCycle size={13} />
                    Regenerate
                  </button>
                </div>
              </div>
              <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                <SegmentedMeter
                  value={result.entropyBits}
                  max={128}
                  label={`Entropy ${result.entropyBits.toFixed(1)} bits`}
                  className="w-[150px]"
                  animateKey={result.generatedAt}
                />
                <span className="font-mono text-[13px] font-semibold text-ink">
                  <CountUp value={result.entropyBits} decimals={1} duration={450} /> bits
                </span>
                <span className="font-mono text-[12px] text-muted">{result.entropyBasis}</span>
              </div>
            </div>

            {/* ③ controls */}
            {result.mode === "password" ? (
              <PasswordControls pw={studio.pw} setPw={studio.setPw} />
            ) : (
              <PassphraseControls pp={studio.pp} setPp={studio.setPp} influence={result.influence} />
            )}

            {/* ⑤ audit preview */}
            {variant === "embedded" && (
              <button
                type="button"
                onClick={() => setAuditOpen(!auditOpen)}
                aria-expanded={auditOpen}
                className="text-[14px] font-semibold text-primary hover:underline"
              >
                {auditOpen ? "Hide audit record ▾" : "View audit record ▸"}
              </button>
            )}
            {auditOpen && <AuditPreview audit={audit} standards={result.standards} seed={seed} />}
          </div>

          {/* right column: status + DNA */}
          <div className="space-y-5">
            <StandardsRail
              standards={result.standards}
              open={openStandard}
              setOpen={setOpenStandard}
              stampKey={result.generatedAt}
            />
            <DnaBlock result={result} seed={seed} />
          </div>
        </div>
      )}

      {/* ⑥ certify bar */}
      <div className="border-t border-line bg-surface-2 px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button
            variant="primary"
            size="md"
            onClick={() => setCertifyOpen(!certifyOpen)}
            aria-expanded={certifyOpen}
            className="certify-breathe"
          >
            Certify this credential →
          </Button>
          <p className="font-mono text-[12px] text-muted">Free · verifiable at /cert/[id]</p>
        </div>
        {certifyOpen && (
          /* PLACEHOLDER: certification issues an Ed25519-signed record via the V2
             signing API (pages/api/generate-certificate). That service ports to this
             app in Phase 3 — until then this is a presentational soft-gate. */
          <div className="mt-3 rounded-[10px] border border-line bg-surface-1 p-4 text-[15px] leading-relaxed text-sub shadow-card">
            Certification signs the audit record above (hash commitment + verdicts,
            never the credential) and publishes it at a verifiable{" "}
            <span className="font-mono text-[13px]">/cert/[id]</span> link. The signing
            service is being ported to V3 — certificates issue from the current app
            until it lands.
          </div>
        )}
      </div>
    </section>
  );
}
