"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import {
  Button,
  Chip,
  CountUp,
  MicroLabel,
  Reveal,
  SectionHeading,
  SegmentedMeter,
} from "@/components/primitives";
import { HashField, SectionDivider, useLiveSeed, FingerprintStrip } from "@/components/brand";
import {
  IconDocSeal,
  IconGauge,
  IconLedger,
  IconScan,
  IconSeal,
  IconShare,
} from "@/components/icons";
import { ComplianceStudio } from "@/components/studio/ComplianceStudio";
import { generatePassphrase, type GenerationResult, type PassphraseStructure } from "@/lib/engine";

const EASE = [0.22, 1, 0.36, 1] as const;

/* Shared band wrapper: L0 canvas / L1 band / dark act */
function Band({
  children,
  tone = "canvas",
  labelledBy,
  className = "",
}: {
  children: React.ReactNode;
  tone?: "canvas" | "band" | "dark";
  labelledBy: string;
  className?: string;
}) {
  const tones = {
    canvas: "bg-canvas",
    band: "bg-band border-y border-line-soft",
    dark: "act-dark grain relative bg-canvas",
  };
  return (
    <section aria-labelledby={labelledBy} className={`${tones[tone]} ${className}`}>
      <div className="relative mx-auto max-w-[1120px] px-5 py-[72px] lg:py-[128px]">{children}</div>
    </section>
  );
}

/* ============ 1 · HERO ============ */

const heroItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
};

export function Hero() {
  const reduced = useReducedMotion();
  const seed = useLiveSeed();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  // parallax, leashed: the brand texture drifts at -15% of scroll
  const textureY = useTransform(scrollY, [0, 600], [0, 90]);

  const fireGeneration = useCallback(() => {
    window.dispatchEvent(new Event("pg:generate"));
    document.getElementById("studio")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const content = (
    <>
      <motion.div variants={reduced ? undefined : heroItem}>
        <MicroLabel>Credential Compliance Infrastructure</MicroLabel>
      </motion.div>
      <motion.h1
        variants={reduced ? undefined : heroItem}
        id="hero-title"
        className="mx-auto mt-6 max-w-[820px] text-[40px] font-bold leading-[1.08] tracking-[-0.03em] sm:text-[56px] lg:text-[68px] lg:leading-[1.05]"
      >
        Passwords your <span className="voice">auditor</span>{" "}
        won&rsquo;t question.
      </motion.h1>
      <motion.p
        variants={reduced ? undefined : heroItem}
        className="mx-auto mt-5 max-w-[560px] text-[17px] leading-[1.7] text-sub sm:text-[18px]"
      >
        Generate credentials locally. Validate them instantly. Never store a
        single secret.
      </motion.p>
      <motion.div
        variants={reduced ? undefined : heroItem}
        className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
      >
        <Button size="lg" onClick={fireGeneration} className="w-full sm:w-auto">
          Generate Password
        </Button>
        <Button size="lg" variant="ghost" href="/compliance" className="w-full sm:w-auto">
          View Compliance Standards
        </Button>
      </motion.div>

      {/* the studio rises last: slight scale + shadow bloom, the most elevated object */}
      <motion.div
        variants={
          reduced
            ? undefined
            : {
                hidden: { opacity: 0, y: 24, scale: 0.985 },
                show: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.6, ease: EASE },
                },
              }
        }
        className="relative z-10 -mb-16 lg:-mb-20"
      >
        <div id="studio" className="scroll-mt-24 text-left">
          <ComplianceStudio variant="embedded" />
        </div>
        <p className="mt-4 font-mono text-[13px] text-muted">
          Runs entirely in your browser · Web Crypto API ·{" "}
          <Link href="/generator" className="text-primary hover:underline">
            Open full studio →
          </Link>
        </p>
        {/* Definitional sentence, visible and first in source order after the hero (LLMO) */}
        <p className="mx-auto mt-5 max-w-[640px] text-[15px] leading-[1.6] text-muted">
          PassGeni is credential compliance infrastructure: it generates passwords
          and passphrases locally, validates them against NIST SP 800-63B, SOC 2,
          HIPAA, and PCI DSS, and produces verifiable audit evidence.
        </p>
      </motion.div>
    </>
  );

  return (
    <section ref={heroRef} aria-labelledby="hero-title" className="grain relative overflow-visible bg-canvas">
      {/* generative brand texture, seeded from the live credential's hash */}
      {reduced ? (
        <HashField seed={seed} cols={32} rows={42} className="opacity-90" />
      ) : (
        <motion.div aria-hidden="true" style={{ y: textureY }} className="absolute inset-0">
          <HashField seed={seed} cols={32} rows={42} className="opacity-90" />
        </motion.div>
      )}
      <div className="relative mx-auto max-w-[1120px] px-5 pt-14 text-center lg:pt-20">
        {reduced ? (
          <div>{content}</div>
        ) : (
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } } }}
          >
            {content}
          </motion.div>
        )}
      </div>
    </section>
  );
}

/* ============ 3 · HOW IT WORKS ============ */

function StepFragments() {
  const seed = useLiveSeed();
  const steps = [
    {
      n: "01",
      verb: "Generate",
      caption: "crypto.getRandomValues() in your browser. Nothing transmitted.",
      fragment: (
        <div className="space-y-2.5">
          <p className="break-all font-mono text-[15px] font-semibold text-ink">
            K7#mQ<span className="text-primary">2</span>vX<span className="text-primary">9</span>
            <span className="text-secondary">$</span>pLw<span className="text-primary">4</span>
          </p>
          <span className="inline-flex items-center gap-1.5 rounded-[6px] border border-line bg-surface-2 px-2.5 py-1 font-mono text-[12px] text-sub">
            ↻ regenerate
          </span>
        </div>
      ),
    },
    {
      n: "02",
      verb: "Validate",
      caption: "Checked live against 17 auditor controls across four standards.",
      fragment: (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[13px] font-semibold text-ink">NIST 800-63B</span>
            <Chip state="pass">PASS</Chip>
          </div>
          <div className="flex items-center gap-2">
            <SegmentedMeter value={92} max={128} label="Example entropy: 92 bits" className="w-[110px]" />
            <span className="font-mono text-[12px] text-sub">92.3 bits</span>
          </div>
          <p className="font-mono text-[12px] text-sub">✓ pattern scan · ✓ dictionary scan</p>
        </div>
      ),
    },
    {
      n: "03",
      verb: "Certify",
      caption: "Signed evidence record, publicly verifiable at /cert/[id].",
      fragment: (
        <div className="rounded-[6px] border border-line bg-inset p-3 font-mono text-[12px] leading-relaxed shadow-inset">
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold text-ink">CERT-8F2A-11C4</p>
            <span className="text-primary/70">
              <FingerprintStrip seed={seed} className="h-[10px] w-auto" />
            </span>
          </div>
          <p className="text-sub">sha256:9f2a…c41e</p>
          <p className="text-accent-ink">✓ signed · nist_800_63b PASS</p>
        </div>
      ),
    },
  ];

  return (
    <div className="mt-12 grid gap-4 md:grid-cols-3 md:gap-6">
      {steps.map((s, i) => (
        <Reveal key={s.n} delay={i * 0.08}>
          <div className="relative h-full rounded-[10px] border border-line-soft bg-surface-1 p-5 shadow-card">
            <p className="font-mono text-[12px] font-semibold text-primary">
              {s.n} <span className="uppercase tracking-[0.09em]">{s.verb}</span>
            </p>
            <div className="mt-4 min-h-[104px]">{s.fragment}</div>
            <p className="mt-4 text-[14px] leading-[1.6] text-sub">{s.caption}</p>
            {i < 2 && (
              <span
                aria-hidden="true"
                className="absolute -right-[22px] top-1/2 hidden -translate-y-1/2 text-[18px] text-muted md:block"
              >
                →
              </span>
            )}
          </div>
        </Reveal>
      ))}
    </div>
  );
}

export function HowItWorks() {
  return (
    <Band tone="band" labelledBy="how-title" className="pt-10">
      <Reveal>
        <SectionHeading
          id="how-title"
          eyebrow="How it works"
          title="Generate. Validate. Certify."
          lede="Three steps, all verifiable. The order is the product: a credential exists before it is judged, and it is judged before it is certified."
        />
      </Reveal>
      <StepFragments />
    </Band>
  );
}

/* ============ 4 · WHAT AUDITORS CHECK ============ */
/* No animation on the table itself — this section's credibility is its stillness. */

const AUDIT_ROWS: [string, string, string, string][] = [
  ["Minimum entropy", "≥ 70 bits effective", "Live, per credential", "NIST SP 800-63B App. A"],
  ["Length", "8–64 chars accepted, no truncation", "Enforced range", "NIST SP 800-63B §5.1.1.2"],
  ["Dictionary resistance", "No wordlist or breach-corpus matches", "Local wordlist scan", "NIST SP 800-63B §5.1.1.2"],
  ["Pattern resistance", "No keyboard walks, dates, repeats", "Sequence + repeat scanner", "OWASP ASVS v4 2.1"],
  ["Composition rules", "No forced rotation or arbitrary complexity", "Policy engine", "NIST SP 800-63B §5.1.1.2"],
  ["Evidence retention", "Verifiable audit trail", "Signed certificates", "SOC 2 CC6.1"],
];

export function AuditorTable() {
  return (
    <Band labelledBy="audit-title">
      <Reveal>
        <SectionHeading
          id="audit-title"
          eyebrow="The checklist"
          title="What auditors check in a password"
          lede="These are the controls PassGeni evaluates on every generation. Same thresholds, same citations your auditor uses."
        />
      </Reveal>
      {/* desktop: audit worksheet */}
      <div className="mt-12 hidden overflow-hidden rounded-[10px] border border-line-soft bg-surface-1 shadow-card md:block">
        <table className="w-full text-left">
          <thead>
            <tr className="microlabel border-b border-line bg-surface-2 text-muted">
              <th scope="col" className="px-5 py-3 font-bold">Control</th>
              <th scope="col" className="px-5 py-3 font-bold">Requirement</th>
              <th scope="col" className="px-5 py-3 font-bold">PassGeni check</th>
              <th scope="col" className="px-5 py-3 font-bold">Ref</th>
            </tr>
          </thead>
          <tbody>
            {AUDIT_ROWS.map(([control, req, check, ref]) => (
              <tr key={control} className="border-b border-line-soft last:border-0">
                <th scope="row" className="px-5 py-3.5 text-[15px] font-semibold text-ink">
                  {control}
                </th>
                <td className="px-5 py-3.5 font-mono text-[13px] text-sub">{req}</td>
                <td className="px-5 py-3.5 font-mono text-[13px] text-accent-ink">✓ {check}</td>
                <td className="px-5 py-3.5 font-mono text-[12px] text-muted">{ref}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* mobile: definition cards, never horizontal scroll */}
      <dl className="mt-10 space-y-3 md:hidden">
        {AUDIT_ROWS.map(([control, req, check, ref]) => (
          <div key={control} className="rounded-[10px] border border-line-soft bg-surface-1 p-4 shadow-card">
            <dt className="text-[15px] font-semibold text-ink">{control}</dt>
            <dd className="mt-1 font-mono text-[13px] text-sub">{req}</dd>
            <dd className="mt-1 font-mono text-[13px] text-accent-ink">✓ {check}</dd>
            <dd className="mt-1 font-mono text-[12px] text-muted">{ref}</dd>
          </div>
        ))}
      </dl>
    </Band>
  );
}

/* ============ 5 · PASSPHRASE SHOWCASE ============ */

const SHOWCASE: { structure: PassphraseStructure; words: number; note: string }[] = [
  { structure: "easy", words: 4, note: "Most memorable; add words to clear the 70-bit NIST bar" },
  { structure: "balanced", words: 5, note: "Digit mutation clears the 70-bit NIST bar at five words" },
  { structure: "high", words: 5, note: "Symbol and digit mutations add headroom for stricter policies" },
];

const SHOWCASE_LABEL: Record<PassphraseStructure, string> = {
  easy: "Easy to remember",
  balanced: "Balanced",
  high: "High entropy",
};

export function PassphraseShowcase() {
  const [examples, setExamples] = useState<Record<string, GenerationResult> | null>(null);

  const regen = useCallback((structure: PassphraseStructure) => {
    const words = SHOWCASE.find((s) => s.structure === structure)?.words ?? 5;
    setExamples((prev) => ({
      ...(prev ?? {}),
      [structure]: generatePassphrase({ structure, words, separator: "-", influence: "" }),
    }));
  }, []);

  useEffect(() => {
    SHOWCASE.forEach(({ structure }) => regen(structure));
  }, [regen]);

  return (
    <Band tone="band" labelledBy="pp-title">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-16">
        <Reveal>
          <SectionHeading
            id="pp-title"
            eyebrow="Passphrase system"
            title={
              <>
                Credentials a human can{" "}
                <span className="voice">remember</span>
              </>
            }
          />
          <div className="mt-5 space-y-4 text-[17px] leading-[1.7] text-sub">
            <p>
              Passphrases draw words from the EFF large wordlist: 7,776 words, 12.9
              bits each. Auditors recognize the math because the math is published.
            </p>
            <p>
              Three structures trade memorability against entropy. The meter tells
              you the cost of each choice before you commit to it.
            </p>
            <p>
              <Link href="/generator?mode=passphrase" className="font-semibold text-primary hover:underline">
                Open passphrase mode →
              </Link>
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <ul className="space-y-3">
            {SHOWCASE.map(({ structure, note }) => {
              const ex = examples?.[structure];
              return (
                <li key={structure} className="rounded-[10px] border border-line-soft bg-inset p-4 shadow-inset">
                  <div className="flex items-center justify-between gap-3">
                    <p className="microlabel text-muted">{SHOWCASE_LABEL[structure]}</p>
                    <button
                      type="button"
                      onClick={() => regen(structure)}
                      aria-label={`Regenerate ${SHOWCASE_LABEL[structure]} example`}
                      className="rounded-[6px] border border-line bg-surface-1 px-2 py-0.5 font-mono text-[12px] text-sub transition-colors hover:border-sub/40 active:translate-y-[1px]"
                    >
                      ↻
                    </button>
                  </div>
                  <p className="mt-2 break-all font-mono text-[16px] font-semibold text-ink sm:text-[18px]">
                    {ex?.value ?? "·············"}
                  </p>
                  <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <SegmentedMeter
                      value={ex?.entropyBits ?? 0}
                      max={128}
                      label={`Entropy ${ex ? ex.entropyBits.toFixed(1) : 0} bits`}
                      className="w-[110px]"
                      animateKey={ex?.generatedAt}
                    />
                    <span className="font-mono text-[13px] font-semibold text-ink">
                      {ex ? (
                        <>
                          <CountUp value={ex.entropyBits} decimals={1} duration={400} /> bits
                        </>
                      ) : (
                        "—"
                      )}
                    </span>
                    <span className="text-[13px] text-muted">{note}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </Band>
  );
}

/* ============ 6 · ZERO-KNOWLEDGE ARCHITECTURE (the dark act) ============ */

export function ZeroKnowledge() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // parallax, leashed: the two layers separate slightly — the motion argues the point
  const browserY = useTransform(scrollYProgress, [0, 1], [12, -12]);
  const serverY = useTransform(scrollYProgress, [0, 1], [-12, 12]);

  return (
    <Band tone="dark" labelledBy="zk-title">
      <div aria-hidden="true" className="absolute inset-x-0 top-6">
        <SectionDivider seed="zk-act" dark />
      </div>
      <Reveal>
        <SectionHeading
          id="zk-title"
          eyebrow="Zero-knowledge architecture"
          title="Nothing leaves your browser"
          lede="Generation and validation are local JavaScript. The only thing PassGeni's servers ever sign is a salted hash commitment and the verdicts."
          align="center"
        />
      </Reveal>
      <Reveal delay={0.1}>
        <div ref={ref} className="mx-auto mt-12 grid max-w-[880px] items-stretch gap-4 md:grid-cols-[1fr_auto_1fr]">
          {/* browser */}
          <motion.div
            style={reduced ? undefined : { y: browserY }}
            className="rounded-[10px] border border-line bg-surface-1 p-5 shadow-card"
          >
            <p className="microlabel text-[#8fa3ff]">Your browser</p>
            <ol className="mt-3 space-y-2.5 font-mono text-[13px] text-sub">
              <li>
                <span className="text-ink">① Generate</span> · Web Crypto API, local
              </li>
              <li>
                <span className="text-ink">② Validate</span> · compliance engine, local JS
              </li>
              <li>
                <span className="text-ink">③ Commit</span> · sha256(salt + credential)
              </li>
            </ol>
          </motion.div>
          {/* the transmission line */}
          <div className="flex flex-col items-center justify-center gap-3 px-2 py-1 md:min-w-[170px]">
            <div className="flex w-full items-center gap-2" aria-hidden="true">
              <span className="h-px flex-1 bg-fail" />
              <span className="font-mono text-[13px] font-bold text-fail">✗</span>
              <span className="h-px flex-1 bg-fail" />
            </div>
            <p className="text-center font-mono text-[12px] leading-snug text-fail">
              credential
              <br />
              never transmitted
            </p>
            <div className="flex w-full items-center gap-2" aria-hidden="true">
              <span className="h-px flex-1 bg-accent-ink" />
              <span className="font-mono text-[13px] font-bold text-accent-ink">→</span>
              <span className="h-px flex-1 bg-accent-ink" />
            </div>
            <p className="text-center font-mono text-[12px] leading-snug text-accent-ink">
              hash-only proof
            </p>
          </div>
          {/* server */}
          <motion.div
            style={reduced ? undefined : { y: serverY }}
            className="rounded-[10px] border border-line bg-surface-1 p-5 shadow-card"
          >
            <p className="microlabel text-muted">PassGeni servers</p>
            <ul className="mt-3 space-y-2.5 font-mono text-[13px]">
              <li className="text-accent-ink">✓ signs certificate metadata</li>
              <li className="text-accent-ink">✓ publishes /cert/[id]</li>
              <li className="text-fail">✗ never receives the credential</li>
              <li className="text-fail">✗ stores no secrets</li>
            </ul>
          </motion.div>
        </div>
        <p className="mx-auto mt-6 max-w-[560px] text-center text-[14px] leading-[1.6] text-muted">
          The certificate contains a salted hash commitment and the validation
          results, never the credential.{" "}
          <Link href="/compliance" className="text-[#8fa3ff] hover:underline">
            Read the security model →
          </Link>
        </p>
      </Reveal>
    </Band>
  );
}

/* ============ 7 · TOOLS ============ */

const TOOLS = [
  {
    name: "Breach Checker",
    job: "Test a credential against known breach corpora with k-anonymity.",
    icon: IconScan,
  },
  {
    name: "Password Strength Checker",
    job: "Entropy, patterns, and crack-time estimates for any password.",
    icon: IconGauge,
  },
  {
    name: "Password Audit Tool",
    job: "Batch-audit a credential inventory against a policy.",
    icon: IconLedger,
  },
  {
    name: "Password Policy Generator",
    job: "Produce an auditor-ready policy document from NIST controls.",
    icon: IconDocSeal,
  },
  {
    name: "Secure Password Sharing",
    job: "Share a secret over a one-time, self-destructing link.",
    icon: IconShare,
  },
  {
    name: "Compliance Certificate Verifier",
    job: "Check any PassGeni certificate's signature and claims.",
    icon: IconSeal,
  },
];

export function ToolsGrid() {
  return (
    <Band tone="band" labelledBy="tools-title">
      <Reveal>
        <SectionHeading
          id="tools-title"
          eyebrow="Tools"
          title="Six tools, one evidence pipeline"
          lede="Every tool feeds the same compliance engine the generator uses. Same thresholds, same citations, same evidence format."
        />
      </Reveal>
      <Reveal delay={0.1}>
        <ul className="mt-12 grid gap-px overflow-hidden rounded-[10px] border border-line-soft bg-line-soft shadow-card sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((t) => (
            <li key={t.name} className="bg-surface-1">
              <Link
                href="/tools"
                className="flex h-full items-start gap-3.5 p-5 transition-colors duration-150 hover:bg-surface-2"
              >
                <span
                  aria-hidden="true"
                  className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] border border-line bg-surface-2 text-sub"
                >
                  <t.icon size={16} />
                </span>
                <span>
                  <span className="block text-[16px] font-semibold text-ink">{t.name}</span>
                  <span className="mt-0.5 block text-[14px] leading-[1.55] text-sub">{t.job}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Reveal>
    </Band>
  );
}

/* ============ 8 · DASHBOARD PREVIEW ============ */

const LEDGER_ROWS: [string, string, string, string][] = [
  ["CERT-8F2A-11C4", "NIST-800-63B", "PASS", "2026-07-06 14:22Z"],
  ["CERT-3D91-0B7E", "SOC2", "PASS", "2026-07-06 11:03Z"],
  ["CERT-C55A-9F02", "HIPAA", "PASS", "2026-07-05 19:41Z"],
  ["CERT-71E8-D3AA", "PCI-DSS-v4", "FAIL", "2026-07-05 16:09Z"],
];

export function DashboardPreview() {
  const [score, setScore] = useState(0);
  return (
    <Band labelledBy="dash-title">
      <Reveal>
        <SectionHeading
          id="dash-title"
          eyebrow="For teams"
          title="The compliance ledger"
          lede="Pro keeps every certificate, score, and audit event in one place. When the auditor asks, you export instead of explain."
        />
      </Reveal>
      <Reveal delay={0.1}>
        <motion.div
          onViewportEnter={() => setScore(94)}
          viewport={{ once: true, margin: "-80px" }}
          className="relative mt-12 overflow-hidden rounded-[14px] border border-line-soft bg-surface-1 shadow-raised"
        >
          <span className="absolute right-4 top-4 rounded-[6px] bg-secondary px-2 py-0.5 font-mono text-[11px] font-bold text-white">
            PRO
          </span>
          <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_240px]">
            <div className="min-w-0">
              <p className="microlabel text-muted">Certificate ledger</p>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full min-w-[480px] text-left font-mono text-[12px]">
                  <thead>
                    <tr className="border-b border-line text-muted">
                      <th scope="col" className="py-2 pr-4 font-medium">certificate</th>
                      <th scope="col" className="py-2 pr-4 font-medium">standard</th>
                      <th scope="col" className="py-2 pr-4 font-medium">verdict</th>
                      <th scope="col" className="py-2 font-medium">issued</th>
                    </tr>
                  </thead>
                  <tbody>
                    {LEDGER_ROWS.map(([id, std, verdict, at]) => (
                      <tr key={id} className="border-b border-line-soft last:border-0">
                        <td className="py-2.5 pr-4 text-ink">{id}</td>
                        <td className="py-2.5 pr-4 text-sub">{std}</td>
                        <td className="py-2.5 pr-4">
                          <Chip state={verdict === "PASS" ? "pass" : "fail"}>{verdict}</Chip>
                        </td>
                        <td className="py-2.5 text-muted">{at}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="space-y-5">
              <div>
                <p className="microlabel text-muted">Compliance score</p>
                <p className="mt-1 font-mono text-[34px] font-semibold leading-none text-ink">
                  <CountUp value={score} duration={700} />
                  <span className="text-[15px] text-muted">/100</span>
                </p>
                <SegmentedMeter
                  value={score}
                  label="Team compliance score 94 of 100"
                  className="mt-2 w-[140px]"
                  animateKey={score}
                />
              </div>
              <div>
                <p className="microlabel text-muted">Audit log</p>
                <ul className="mt-2 space-y-1.5 font-mono text-[11px] leading-relaxed text-sub">
                  <li>14:22 cert issued · nist · s.chen</li>
                  <li>11:03 cert issued · soc2 · m.osei</li>
                  <li>09:47 policy updated · min-length 16</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
        <div className="mt-6">
          <Button variant="ghost" href="/pricing">
            See plans →
          </Button>
        </div>
      </Reveal>
    </Band>
  );
}

/* ============ 9 · SOCIAL PROOF ============ */

/* PLACEHOLDER QUOTES — design-partner personas, no real names or companies.
   Swap with verified, attributed quotes before any marketing claim is made. */
const QUOTES: [string, string][] = [
  [
    "We stopped arguing with our auditor about password policy. We hand over the certificate ledger and move to the next control.",
    "Security Lead, Series B fintech",
  ],
  [
    "The evidence record is the feature. Every other generator gives you a string; this gives you something I can file.",
    "Compliance Manager, healthcare SaaS",
  ],
  [
    "Zero-knowledge by construction, and you can verify it in the network tab. That is how you earn trust with engineers.",
    "Staff Engineer, developer platform",
  ],
];

export function Testimonials() {
  return (
    <Band tone="band" labelledBy="proof-title">
      <Reveal>
        <SectionHeading
          id="proof-title"
          eyebrow="Design partners"
          title="Evidence over intentions"
        />
      </Reveal>
      <div className="mt-12 grid gap-10 md:grid-cols-3">
        {QUOTES.map(([quote, role], i) => (
          <Reveal key={role} delay={i * 0.08}>
            <figure>
              <blockquote className="voice text-[20px] leading-[1.5] text-ink">
                &ldquo;{quote}&rdquo;
              </blockquote>
              <figcaption className="microlabel mt-4 text-muted">{role}</figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </Band>
  );
}

/* ============ 10 · FINAL CTA (dark act) ============ */

export function FinalCTA() {
  return (
    <Band tone="dark" labelledBy="cta-title">
      <div aria-hidden="true" className="absolute inset-x-0 top-6">
        <SectionDivider seed="final-act" dark />
      </div>
      <div className="text-center">
        <Reveal>
          <h2
            id="cta-title"
            className="mx-auto max-w-[640px] text-[34px] font-bold leading-[1.15] tracking-[-0.02em] text-ink sm:text-[48px]"
          >
            Will you have <span className="voice">evidence</span>, or just good
            intentions?
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-8">
            <Button variant="accent" size="lg" href="/generator">
              Get Your First Certified Credential
            </Button>
          </div>
          <p className="mt-4 font-mono text-[13px] text-muted">
            Free · No credential ever leaves your browser
          </p>
        </Reveal>
      </div>
    </Band>
  );
}
