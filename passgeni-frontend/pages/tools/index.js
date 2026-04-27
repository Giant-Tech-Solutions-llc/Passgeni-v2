// =============================================================
// PASSGENI — TOOLS INDEX PAGE
// passgeni.ai/tools
// =============================================================

import { motion } from "framer-motion";
import { fadeUp, heroEntrance, bcCard } from "../../lib/motion.js";
import PageLayout from "../../components/layout/PageLayout.js";
import { IcSearch, IcBarChart, IcClipboard, IcLock, IcBolt, IcStar, IcShield } from "../../lib/icons.js";

const TOOLS = [
  {
    href:        "/tools/compliance-fixer",
    icon:        <IcShield size={28} color="#C8FF00" />,
    title:       "Credential Compliance Fixer",
    desc:        "Paste any credential. Get entropy analysis and compliance gap detection against SOC2, HIPAA, PCI-DSS, and NIST. Generate a certified replacement.",
    badge:       "New",
    color:       "#C8FF00",
    limit:       "Free: preview only",
    cta:         "Fix & certify →",
    upgrade:     "Full fix requires certification — unlock SOC2/HIPAA audit proof",
  },
  {
    href:        "/tools/strength-checker",
    icon:        <IcBolt size={28} color="#ffaa00" />,
    title:       "Password Strength Checker",
    desc:        "Entropy in bits, crack time estimate, 7-point DNA audit score, and specific improvement suggestions. 100% client-side.",
    badge:       "Entropy analysis",
    color:       "#ffaa00",
    limit:       "Does not verify compliance standards.",
    cta:         "Check strength →",
    upgrade:     "→ Validate against SOC2, HIPAA, NIST",
  },
  {
    href:        "/tools/audit",
    icon:        <IcBarChart size={28} color="#ff8c42" />,
    title:       "Password Audit Tool",
    desc:        "Audit up to 3 passwords simultaneously. Breach check, entropy score, DNA grading, and pattern detection — all in one view.",
    badge:       "Batch audit",
    color:       "#ff8c42",
    limit:       "Audit is incomplete without compliance proof.",
    cta:         "Audit passwords →",
    upgrade:     "→ Generate certified credentials",
  },
  {
    href:        "/tools/policy-generator",
    icon:        <IcClipboard size={28} color="#ce93d8" />,
    title:       "Password Policy Generator",
    desc:        "Generate a complete, audit-ready password policy for your organisation. Aligned with HIPAA, SOC 2, ISO 27001, PCI-DSS v4.0, and NIST 800-63B.",
    badge:       "Compliance",
    color:       "#ce93d8",
    limit:       "Policy document only — no machine-verifiable proof.",
    cta:         "Generate policy →",
    upgrade:     "→ Certify credentials to back your policy",
  },
  {
    href:        "/tools/breach-checker",
    icon:        <IcSearch size={28} color="#4fc3f7" />,
    title:       "Password Breach Checker",
    desc:        "Check if your password has appeared in known data breaches. Uses k-anonymity — your password never leaves your browser. 900M+ compromised credentials.",
    badge:       "k-anonymity",
    color:       "#4fc3f7",
    limit:       "Confirms breach exposure only.",
    cta:         "Check for breaches →",
    upgrade:     "→ Certify your replacement credential",
  },
  {
    href:        "/tools/secure-share",
    icon:        <IcLock size={28} color="#80cbc4" />,
    title:       "Secure Password Sharing",
    desc:        "Share passwords safely with AES-256-GCM encrypted links. The decryption key is embedded in the URL fragment — never sent to any server.",
    badge:       "AES-256-GCM",
    color:       "#80cbc4",
    limit:       "Sharing is not the same as proving compliance.",
    cta:         "Share securely →",
    upgrade:     "→ Certify before you share",
  },
];

const schema = {
  "@context": "https://schema.org",
  "@type":    "CollectionPage",
  "name":     "Password Security Tools — PassGeni",
  "description": "Analyze, fix, and certify credentials against SOC2, HIPAA, PCI-DSS v4.0, and NIST 800-63B. Six tools including the Credential Compliance Fixer.",
  "url":      "https://passgeni.ai/tools",
  "hasPart":  TOOLS.map((t) => ({
    "@type": "WebApplication",
    "name":  t.title,
    "url":   `https://passgeni.ai${t.href}`,
  })),
};

export default function ToolsIndexPage() {
  return (
    <PageLayout
      title="Password Security Tools | PassGeni"
      description="Analyze your credentials. Fix compliance gaps. Generate audit-certified proof for SOC2, HIPAA, PCI-DSS, and NIST 800-63B. Six tools — all client-side."
      canonical="https://passgeni.ai/tools"
      schema={schema}
    >
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "80px var(--page-pad) 120px" }}>

        {/* ── Header ────────────────────────────────────────── */}
        <motion.div style={{ marginBottom: 64 }} {...heroEntrance(0)}>
          <nav aria-label="Breadcrumb" style={{ marginBottom: 24 }}>
            <a href="/" style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#888", textDecoration: "none" }}>PassGeni</a>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#444", margin: "0 8px" }}>→</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#C8FF00" }}>Tools</span>
          </nav>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>
            Compliance tools
          </div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(30px,5vw,54px)", color: "#fff", letterSpacing: "-0.03em", marginBottom: 16, lineHeight: 1.1 }}>
            Security tools are easy.<br />
            <span style={{ color: "var(--color-accent)" }}>Proving compliance is not.</span>
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 16, color: "#888", maxWidth: 520, lineHeight: 1.8 }}>
            Analyze your credentials. Fix them. Certify them.
          </p>
        </motion.div>

        {/* ── Tools grid ────────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
          {TOOLS.map((tool, i) => (
            <motion.a
              key={tool.href}
              href={tool.href}
              {...bcCard(i)}
              style={{ textDecoration: "none", display: "flex", flexDirection: "column", background: "#0a0a0c", border: "1px solid #141416", borderRadius: 16, padding: "28px 32px", position: "relative", overflow: "hidden" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${tool.color}44`;
                e.currentTarget.style.boxShadow   = `0 20px 60px ${tool.color}11`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#141416";
                e.currentTarget.style.boxShadow   = "none";
              }}
            >
              {/* Badge */}
              <div style={{ position: "absolute", top: 20, right: 20, fontFamily: "var(--font-mono)", fontSize: 9, color: tool.color, background: `${tool.color}15`, border: `1px solid ${tool.color}33`, borderRadius: 100, padding: "3px 10px", letterSpacing: "0.08em" }}>
                {tool.badge}
              </div>

              {/* Icon */}
              <div style={{ marginBottom: 20 }}>{tool.icon}</div>

              {/* Content */}
              <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 18, color: "#fff", marginBottom: 12, lineHeight: 1.3 }}>{tool.title}</h2>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#888", lineHeight: 1.8, flex: 1, marginBottom: 16 }}>{tool.desc}</p>

              {/* Compliance limit note */}
              <div style={{ marginBottom: 16, paddingTop: 14, borderTop: "1px solid #0e0e10" }}>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "#555", lineHeight: 1.6, marginBottom: 6 }}>{tool.limit}</p>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: tool.color, letterSpacing: "0.06em" }}>{tool.upgrade}</span>
              </div>

              {/* CTA */}
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: tool.color, letterSpacing: "0.08em" }}>{tool.cta}</span>
              </div>
            </motion.a>
          ))}
        </div>

        {/* ── Conversion banner ─────────────────────────────── */}
        <motion.div {...fadeUp(0.1)} style={{ marginTop: 64, padding: "40px 48px", background: "#0a0a0c", border: "1px solid #1e1e20", borderRadius: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
            <div>
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(18px,2.5vw,26px)", color: "#fff", letterSpacing: "-0.02em", marginBottom: 8, lineHeight: 1.2 }}>
                You analyzed your credentials.<br />
                <span style={{ color: "#555" }}>But you still have no proof.</span>
              </div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#555", maxWidth: 420, lineHeight: 1.7 }}>
                An ES256-signed certificate gives auditors machine-verifiable evidence that your credential met the required standard at the time of generation.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, flexShrink: 0 }}>
              <a
                href="/dashboard/certify"
                style={{
                  background: "#C8FF00", color: "#000", textDecoration: "none",
                  borderRadius: 9, padding: "13px 28px",
                  fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 14,
                  whiteSpace: "nowrap",
                }}
              >
                Generate Certified Credential →
              </a>
              <a
                href="/guides/what-is-a-compliance-certificate"
                style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#555", textDecoration: "none", textAlign: "center", letterSpacing: "0.08em" }}
              >
                What is a compliance certificate? →
              </a>
            </div>
          </div>
        </motion.div>

        {/* ── Testimonials ─────────────────────────────────── */}
        <div style={{ marginTop: 80 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 24 }}>
            What users say
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
            {[
              { name: "Ivan C.",  role: "CISO, mid-size company",    text: "Bulk audit runs before migration. Found 6 that would have failed our SOC 2 audit. Then certified the replacements — gave the auditor a cert URL per credential." },
              { name: "Jake F.",  role: "Small biz owner",           text: "The Compliance Fixer flagged three passwords I thought were fine. Generated certified replacements in under two minutes." },
              { name: "Elena V.", role: "HR director",               text: "Policy Generator gave us the written policy. Compliance Fixer gave us the machine-verifiable proof to go with it. Auditor was satisfied first try." },
              { name: "Hana J.",  role: "Data analyst",              text: "k-anonymity breach check, then entropy analysis, then certified replacement. The whole workflow in one session. That's the right order of operations." },
              { name: "Nina P.",  role: "UX researcher",             text: "Strength Checker showed me the entropy gap. Compliance Fixer showed me exactly which standard I was failing and why. Completely different level of detail." },
              { name: "Ben A.",   role: "Freelance copywriter",      text: "Certified the credential before sharing it via Secure Share. The cert URL is in the message thread. That's audit trail without extra work." },
            ].map((t, i) => (
              <motion.div key={t.name} {...bcCard(i)} style={{ background: "#0c0c0e", border: "1px solid #141416", borderRadius: 12, padding: "22px 24px" }}>
                <div style={{ display: "flex", gap: 2, marginBottom: 10 }}>
                  {[1,2,3,4,5].map(j => <IcStar key={j} size={11} color="#C8FF00" />)}
                </div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#999", lineHeight: 1.75, marginBottom: 14 }}>"{t.text}"</p>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 12, color: "#fff" }}>{t.name}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#555", marginTop: 3 }}>{t.role}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </PageLayout>
  );
}
