import type { Metadata } from "next";
import { Button, MicroLabel, Chip } from "@/components/primitives";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Free NIST validation forever. Pro adds SOC 2, HIPAA, and PCI DSS evidence detail plus the certificate ledger. Team adds seats, shared policy, and API access.",
  alternates: { canonical: "/pricing" },
};

/* Prices match the live V2 pricing page (Free / Pro $19 / Team $59).
   Checkout stays on the V2 app until billing ports to V3. */
const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    blurb: "Complete for NIST. No account needed to generate.",
    features: [
      "Unlimited local generation, both modes",
      "Live NIST SP 800-63B validation with control detail",
      "SOC 2 / HIPAA / PCI verdicts (detail locked)",
      "First certificate free with an account",
    ],
    cta: { label: "Generate Password", href: "/generator", variant: "ghost" as const },
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month · $179/yr",
    blurb: "The evidence tier: every standard, every record, kept.",
    features: [
      "SOC 2, HIPAA, PCI DSS control-level evidence",
      "Unlimited signed certificates",
      "Certificate ledger and audit log",
      "Compliance score across your credentials",
    ],
    cta: { label: "Start Pro", href: "https://passgeni.ai/pricing", variant: "primary" as const },
    highlight: true,
  },
  {
    name: "Team",
    price: "$59",
    period: "/month · $539/yr",
    blurb: "Shared evidence for the whole security function.",
    features: [
      "Everything in Pro, five seats included",
      "Shared policy enforcement",
      "Team audit log with member attribution",
      "API access for CI and provisioning",
    ],
    cta: { label: "Start Team", href: "https://passgeni.ai/pricing", variant: "ghost" as const },
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-[1120px] px-5 pb-24 pt-12">
      <div className="max-w-[720px]">
        <MicroLabel>Pricing</MicroLabel>
        <h1 className="mt-4 text-[34px] font-bold leading-[1.1] tracking-[-0.02em] sm:text-[44px]">
          Free to generate. Paid to prove.
        </h1>
        <p className="mt-3 text-[17px] leading-[1.7] text-sub">
          Generation and NIST validation are free forever. The paid plans buy more
          standards and the ledger that survives an audit.
        </p>
      </div>
      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {PLANS.map((p) => (
          <div
            key={p.name}
            className={`flex flex-col rounded-[14px] border bg-surface-1 p-6 ${
              p.highlight ? "border-primary shadow-s2" : "border-line shadow-s1"
            }`}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-[20px] font-bold text-ink">{p.name}</h2>
              {p.highlight && <Chip state="neutral">most popular</Chip>}
            </div>
            <p className="mt-3 font-mono text-[32px] font-semibold leading-none text-ink">
              {p.price}
              <span className="text-[13px] font-medium text-muted"> {p.period}</span>
            </p>
            <p className="mt-3 text-[15px] leading-[1.6] text-sub">{p.blurb}</p>
            <ul className="mt-5 flex-1 space-y-2.5">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-[14px] leading-[1.55] text-sub">
                  <span className="mt-0.5 font-mono text-accent-ink" aria-hidden="true">
                    ✓
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-6">
              {p.cta.href.startsWith("http") ? (
                <a
                  href={p.cta.href}
                  className={`inline-flex h-10 w-full items-center justify-center rounded-[6px] px-4 text-[15px] font-semibold ${
                    p.cta.variant === "primary"
                      ? "bg-primary text-white hover:bg-primary-hov"
                      : "border border-line bg-surface-1 text-ink hover:bg-surface-2"
                  }`}
                >
                  {p.cta.label}
                </a>
              ) : (
                <Button href={p.cta.href} variant={p.cta.variant} className="w-full">
                  {p.cta.label}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-8 text-[14px] text-muted">
        Enterprise (SSO, custom standards, on-prem verification):{" "}
        <a href="mailto:hello@passgeni.ai" className="font-semibold text-primary hover:underline">
          talk to us
        </a>
        .
      </p>
    </div>
  );
}
