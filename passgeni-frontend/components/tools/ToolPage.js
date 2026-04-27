// =============================================================
// PASSGENI — TOOL PAGE WRAPPER
// =============================================================
// Every tool page uses this wrapper for consistent layout,
// breadcrumbs, and the "try the generator" CTA at the bottom.
// =============================================================

import { motion } from "framer-motion";
import { btnPrimary } from "../../lib/motion.js";
import PageLayout from "../layout/PageLayout.js";

// ─── BREADCRUMB ───────────────────────────────────────────────
function Breadcrumb({ toolName }) {
  return (
    <nav aria-label="Breadcrumb" style={{ marginBottom: 32 }}>
      <ol style={{ display: "flex", gap: 8, alignItems: "center", listStyle: "none", padding: 0, margin: 0 }}>
        <li>
          <a href="/" style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#888", textDecoration: "none", letterSpacing: "0.08em" }}>
            PassGeni
          </a>
        </li>
        <li style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#444" }}>→</li>
        <li>
          <a href="/tools" style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#888", textDecoration: "none", letterSpacing: "0.08em" }}>
            Tools
          </a>
        </li>
        <li style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#444" }}>→</li>
        <li style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#C8FF00", letterSpacing: "0.08em" }}>
          {toolName}
        </li>
      </ol>
    </nav>
  );
}

// ─── CERTIFY CTA ──────────────────────────────────────────────
function GeneratorCTA() {
  return (
    <section style={{ margin: "80px auto 0", maxWidth: 760, padding: "0 var(--page-pad) 80px" }}>
      <div style={{ background: "#0a0a0c", border: "1px solid #141416", borderRadius: 16, padding: "40px 48px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#C8FF0066", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>
              Next step
            </div>
            <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(18px,2.5vw,26px)", color: "#fff", marginBottom: 10, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
              Certify this credential.
            </h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#888", maxWidth: 360, lineHeight: 1.7 }}>
              Analysis proves strength. A certificate proves compliance — ES256-signed, auditor-verifiable, standard-specific.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
            <motion.a href="/dashboard/certify" className="btn-primary" {...btnPrimary} style={{ fontSize: 14, padding: "13px 28px", whiteSpace: "nowrap" }}>
              Certify this credential →
            </motion.a>
            <a href="/#generator" style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#555", textDecoration: "none", textAlign: "center", letterSpacing: "0.08em" }}>
              or generate a new one first →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── TOOL TESTIMONIALS ────────────────────────────────────────
const TOOL_TESTIMONIALS = {
  breach:   [
    { name: "Hana J.", role: "Data analyst", text: "The k-anonymity implementation is real. Only 5 chars of my SHA-1 hash go to HIBP. Checked the network tab myself — my password never left the browser." },
    { name: "Luke S.", role: "Uni student", text: "Used the breach checker before setting up my bank app password. Realised my old one showed up 3 times in breach databases. PassGeni probably saved me real money." },
    { name: "Hamid K.", role: "Cybersecurity student", text: "The breach checker is honest about how it works. k-anonymity, SHA-1, first 5 chars. Most tools just say 'secure' — this one explains the actual mechanism." },
  ],
  strength: [
    { name: "Nina P.", role: "UX researcher", text: "Strength Checker gave me actual data — entropy in bits, crack time, specific improvements. Not just a red/green bar. That's useful feedback." },
    { name: "Pat L.", role: "Network admin", text: "The DNA Score caught a pattern I missed. My router admin password had 3 repeated characters. The check flagged it. Never would have noticed otherwise." },
    { name: "Finn O.", role: "Security consultant", text: "I use the DNA Score in client security training. It flags specific weaknesses — low entropy, no symbols, repeated chars — in plain language everyone understands." },
  ],
  share:    [
    { name: "Ben A.", role: "Freelance copywriter", text: "Sent my client their CMS login via a PassGeni encrypted link. Way better than texting passwords. AES-256 in the browser — it's actually what it claims to be." },
    { name: "Jade S.", role: "Paralegal", text: "The Secure Share solved a real problem. I used to text passwords to clients. Now I send a link that expires after one view. The security jump is night and day." },
    { name: "Kyle N.", role: "Startup CTO", text: "Explained the fragment-key architecture to a client and they were impressed. The key never touches a server. That's a rare architectural guarantee." },
  ],
  audit:    [
    { name: "Jake F.", role: "Small biz owner", text: "The Password Audit Tool found three weak passwords I didn't know about across my team. Breach check, entropy score, pattern detection — all in one run." },
    { name: "Hira A.", role: "Accountant", text: "Checked all 8 of my business passwords at once. Three entropy fails, one breach match. Fixed all of them with PassGeni in under 5 minutes." },
    { name: "Ivan C.", role: "CISO, mid-size company", text: "Bulk audit runs were a revelation. We ran 40 existing service account passwords through it before migration. Found 6 that would have failed our SOC 2 audit." },
  ],
  policy:   [
    { name: "Elena V.", role: "HR director", text: "Generated a complete HIPAA-aligned password policy PDF in two minutes. IT stopped arguing with us about what 'complex' means. Clear, cited, done." },
    { name: "Rosa F.", role: "Vet technician", text: "Small clinic, one IT person — me. PassGeni's Policy Generator replaced a consultant invoice. Two minutes and we had a written policy for the auditor." },
    { name: "Mei L.", role: "Nurse practitioner", text: "HIPAA preset gave us exactly the right policy without reading a 40-page document. Works great for the whole clinic team." },
  ],
  fixer:    [
    { name: "Ivan C.",  role: "CISO, mid-size company",  text: "Compliance Fixer flagged six service account passwords before migration. Generated certified replacements. Auditor got a cert URL per credential. Clean." },
    { name: "Jake F.",  role: "Small biz owner",         text: "Thought my passwords were fine. Compliance Fixer showed exactly which standard they failed and why. Fixed and certified in under three minutes." },
    { name: "Elena V.", role: "HR director",             text: "Policy Generator for the written policy, Compliance Fixer for the machine-verifiable proof. Auditor was satisfied on first review." },
  ],
};

function ToolTestimonials({ toolKey }) {
  const items = TOOL_TESTIMONIALS[toolKey] || [];
  if (!items.length) return null;
  return (
    <section style={{ margin: "64px 0 0" }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 20 }}>
        What users say
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
        {items.map((t) => (
          <div key={t.name} style={{ background: "#0c0c0e", border: "1px solid #141416", borderRadius: 12, padding: "20px 22px" }}>
            <div style={{ display: "flex", gap: 2, marginBottom: 10 }}>
              {[1,2,3,4,5].map(i => <span key={i} style={{ color: "#C8FF00", fontSize: 10 }}>★</span>)}
            </div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#999", lineHeight: 1.75, marginBottom: 14 }}>"{t.text}"</p>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 12, color: "#fff" }}>{t.name}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#555", marginTop: 3 }}>{t.role}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── TOOL PAGE WRAPPER ────────────────────────────────────────
export default function ToolPage({
  title,
  description,
  canonical,
  schema,
  toolName,
  eyebrow,
  headline,
  subheadline,
  children,
  showGeneratorCTA = true,
  testimonialKey,
}) {
  return (
    <PageLayout title={title} description={description} canonical={canonical} schema={schema}>
      <main>
        {/* ── Tool header ─────────────────────────────────── */}
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "60px var(--page-pad) 0" }}>
          <Breadcrumb toolName={toolName} />

          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>
            {eyebrow || "Free tool"}
          </div>

          <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(28px,4vw,48px)", color: "#fff", letterSpacing: "-0.02em", marginBottom: 16, lineHeight: 1.1 }}>
            {headline}
          </h1>

          {subheadline && (
            <p style={{ fontFamily: "var(--font-body)", fontSize: 16, color: "#888", lineHeight: 1.8, marginBottom: 40, maxWidth: 580 }}>
              {subheadline}
            </p>
          )}
        </div>

        {/* ── Tool content (passed as children) ───────────── */}
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 var(--page-pad)" }}>
          {children}
          {testimonialKey && <ToolTestimonials toolKey={testimonialKey} />}
        </div>

        {/* ── Generator CTA at bottom ─────────────────────── */}
        {showGeneratorCTA && <GeneratorCTA />}
      </main>
    </PageLayout>
  );
}
