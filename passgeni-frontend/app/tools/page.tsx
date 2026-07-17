import type { Metadata } from "next";
import type { ComponentType, SVGProps } from "react";
import { MicroLabel, Chip } from "@/components/primitives";
import {
  IconDocSeal,
  IconGauge,
  IconLedger,
  IconScan,
  IconSeal,
  IconShare,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "Tools — one evidence pipeline",
  description:
    "Six compliance tools sharing one engine: breach checking, strength checking, credential audits, policy generation, secure sharing, and certificate verification.",
  alternates: { canonical: "/tools" },
};

/* The V3 tool pages port from V2 one at a time. Until each lands here, its row
   links to the live V2 implementation so nothing on this page is a dead end. */
const TOOLS: {
  name: string;
  job: string;
  icon: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  href?: string;
  status: "live" | "with-ledger";
}[] = [
  {
    name: "Breach Checker",
    job: "Test a credential against known breach corpora. Uses k-anonymity: only a hash prefix ever leaves your browser.",
    icon: IconScan,
    href: "https://passgeni.ai/tools/breach-checker",
    status: "live",
  },
  {
    name: "Password Strength Checker",
    job: "Entropy, pattern analysis, and crack-time estimates for any password, computed locally.",
    icon: IconGauge,
    href: "https://passgeni.ai/tools/strength-checker",
    status: "live",
  },
  {
    name: "Password Audit Tool",
    job: "Batch-audit a credential inventory against a policy and export the findings.",
    icon: IconLedger,
    href: "https://passgeni.ai/tools/audit",
    status: "live",
  },
  {
    name: "Password Policy Generator",
    job: "Produce an auditor-ready password policy document from NIST SP 800-63B controls.",
    icon: IconDocSeal,
    href: "https://passgeni.ai/tools/policy-generator",
    status: "live",
  },
  {
    name: "Secure Password Sharing",
    job: "Share a secret over a one-time, self-destructing link. End-to-end encrypted.",
    icon: IconShare,
    href: "https://passgeni.ai/tools/secure-share",
    status: "live",
  },
  {
    name: "Compliance Certificate Verifier",
    job: "Check any PassGeni certificate's signature and claims without learning the credential.",
    icon: IconSeal,
    status: "with-ledger",
  },
];

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-[1120px] px-5 pb-24 pt-12">
      <div className="max-w-[720px]">
        <MicroLabel>Tools</MicroLabel>
        <h1 className="mt-4 text-[34px] font-bold leading-[1.1] tracking-[-0.02em] sm:text-[44px]">
          Six tools, one evidence pipeline.
        </h1>
        <p className="mt-3 text-[17px] leading-[1.7] text-sub">
          Every tool runs the same compliance engine as the generator: same
          thresholds, same citations, same evidence format.
        </p>
      </div>
      <ul className="mt-12 grid gap-px overflow-hidden rounded-[10px] border border-line bg-line sm:grid-cols-2">
        {TOOLS.map((t) => {
          const inner = (
            <>
              <span
                aria-hidden="true"
                className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[6px] border border-line bg-surface-2 text-sub"
              >
                <t.icon size={17} />
              </span>
              <span className="min-w-0">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-[17px] font-semibold text-ink">{t.name}</span>
                  {t.status === "with-ledger" && <Chip state="neutral">ships with the ledger</Chip>}
                </span>
                <span className="mt-1 block text-[14px] leading-[1.6] text-sub">{t.job}</span>
              </span>
            </>
          );
          return (
            <li key={t.name} className="bg-surface-1">
              {t.href ? (
                <a href={t.href} className="flex h-full items-start gap-4 p-6 transition-colors hover:bg-surface-2">
                  {inner}
                </a>
              ) : (
                <div className="flex h-full items-start gap-4 p-6">{inner}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
