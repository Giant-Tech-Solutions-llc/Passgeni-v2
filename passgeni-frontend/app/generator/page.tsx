import type { Metadata } from "next";
import { ComplianceStudio } from "@/components/studio/ComplianceStudio";
import { MicroLabel } from "@/components/primitives";

export const metadata: Metadata = {
  title: "Compliance Studio — generate and validate credentials",
  description:
    "Generate passwords and passphrases locally, validate them live against NIST SP 800-63B, SOC 2, HIPAA, and PCI DSS, and preview the audit evidence. Nothing leaves your browser.",
  alternates: { canonical: "/generator" },
};

export default async function GeneratorPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const { mode } = await searchParams;
  const initialMode = mode === "passphrase" ? "passphrase" : "password";
  return (
    <div className="mx-auto max-w-[1120px] px-5 pb-24 pt-12">
      <div className="mb-8 max-w-[720px]">
        <MicroLabel>Compliance Studio</MicroLabel>
        <h1 className="mt-4 text-[34px] font-bold leading-[1.1] tracking-[-0.02em] sm:text-[44px]">
          Generate, validate, and prove it.
        </h1>
        <p className="mt-3 text-[17px] leading-[1.7] text-sub">
          Every control below runs locally. Change a setting and the credential,
          entropy, compliance verdicts, and audit record update together.
        </p>
      </div>
      <ComplianceStudio variant="full" initialMode={initialMode} />
      <p className="mt-5 font-mono text-[13px] text-muted">
        Runs entirely in your browser · Web Crypto API · no credential in any
        network request
      </p>
    </div>
  );
}
