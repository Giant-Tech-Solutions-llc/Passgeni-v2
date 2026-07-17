import type { Metadata } from "next";
import Link from "next/link";
import { STANDARDS } from "@/lib/standards";
import { MicroLabel, Chip } from "@/components/primitives";

export const metadata: Metadata = {
  title: "Compliance standards library",
  description:
    "The exact controls PassGeni validates on every credential: NIST SP 800-63B, SOC 2, HIPAA, and PCI DSS v4.0, with requirements and citations.",
  alternates: { canonical: "/compliance" },
};

/* Roadmap standards, defined in the V2 ruleset but not yet surfaced as chips */
const ROADMAP = [
  { label: "ISO 27001", note: "Policy-aligned generation, audit trail mandatory." },
  { label: "FIPS 140-3", note: "FIPS-validated entropy source with documented provenance." },
];

export default function CompliancePage() {
  return (
    <div className="mx-auto max-w-[1120px] px-5 pb-24 pt-12">
      <div className="max-w-[720px]">
        <MicroLabel>Standards library</MicroLabel>
        <h1 className="mt-4 text-[34px] font-bold leading-[1.1] tracking-[-0.02em] sm:text-[44px]">
          The controls, in the open.
        </h1>
        <p className="mt-3 text-[17px] leading-[1.7] text-sub">
          PassGeni evaluates every credential against these controls, locally, on
          every generation. This page is the same ruleset the studio runs, with the
          citations an auditor will ask for.
        </p>
      </div>

      <div className="mt-12 space-y-8">
        {STANDARDS.map((s) => (
          <section
            key={s.id}
            aria-labelledby={`std-${s.id}`}
            className="overflow-hidden rounded-[10px] border border-line bg-surface-1 shadow-s1"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-surface-2 px-5 py-4">
              <div>
                <h2 id={`std-${s.id}`} className="text-[22px] font-bold text-ink">
                  {s.label}
                </h2>
                <p className="mt-0.5 text-[14px] text-sub">{s.description}</p>
              </div>
              <Chip state={s.locked ? "locked" : "pass"}>
                {s.locked ? "EVIDENCE ON PRO" : "FREE"}
              </Chip>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left">
                <thead>
                  <tr className="microlabel border-b border-line text-muted">
                    <th scope="col" className="px-5 py-2.5 font-bold">Control</th>
                    <th scope="col" className="px-5 py-2.5 font-bold">Requirement</th>
                    <th scope="col" className="px-5 py-2.5 font-bold">Ref</th>
                  </tr>
                </thead>
                <tbody>
                  {s.controls.map((c) => (
                    <tr key={c.id} className="border-b border-line last:border-0">
                      <th scope="row" className="px-5 py-3 text-[15px] font-semibold text-ink">
                        {c.label}
                      </th>
                      <td className="px-5 py-3 font-mono text-[13px] text-sub">{c.requirement}</td>
                      <td className="px-5 py-3 font-mono text-[12px] text-muted">{c.ref}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>

      <section aria-labelledby="zk-model" className="mt-16 max-w-[720px]">
        <h2 id="zk-model" className="text-[26px] font-bold text-ink">
          The security model
        </h2>
        <div className="mt-4 space-y-4 text-[16px] leading-[1.7] text-sub">
          <p>
            Generation uses <code className="font-mono text-[14px]">crypto.getRandomValues</code>,
            the browser&rsquo;s CSPRNG. Validation is local JavaScript against the
            control tables above. Neither step makes a network request.
          </p>
          <p>
            Certification transmits exactly two things: a salted SHA-256 hash
            commitment of the credential and the validation verdicts. The
            credential itself cannot be recovered from either. You can confirm all
            of this in your browser&rsquo;s network inspector while using the{" "}
            <Link href="/generator" className="font-semibold text-primary hover:underline">
              studio
            </Link>
            .
          </p>
        </div>
      </section>

      <section aria-labelledby="roadmap" className="mt-16">
        <h2 id="roadmap" className="microlabel text-muted">
          On the roadmap
        </h2>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {ROADMAP.map((r) => (
            <li key={r.label} className="rounded-[10px] border border-dashed border-line bg-surface-2 p-4">
              <p className="text-[16px] font-semibold text-ink">{r.label}</p>
              <p className="mt-0.5 text-[14px] text-sub">{r.note}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
