// =============================================================
// PASSGENI — TOOLS INDEX PAGE
// passgeni.ai/tools
// =============================================================

import { motion } from "framer-motion";
import { fadeUp, heroEntrance, bcCard, fadeIn } from "../../lib/motion.js";
import PageLayout from "../../components/layout/PageLayout.js";

const TOOLS = [
  {
    href:     "/tools/breach-checker",
    icon:     "🔍",
    title:    "Password Breach Checker",
    desc:     "Check if your password has appeared in known data breaches. Uses k-anonymity — your password never leaves your browser. Checks against 900M+ compromised credentials.",
    badge:    "k-anonymity",
    color:    "#ff4444",
  },
  {
    href:     "/tools/strength-checker",
    icon:     "💪",
    title:    "Password Strength Checker",
    desc:     "Instant analysis: entropy in bits, estimated crack time, 7-point DNA audit score, and specific improvement suggestions. 100% client-side.",
    badge:    "Entropy analysis",
    color:    "#C8FF00",
  },
  {
    href:     "/tools/audit",
    icon:     "📊",
    title:    "Password Audit Tool",
    desc:     "Audit up to 10 passwords simultaneously. Breach check, entropy score, DNA grading, and pattern detection — all in one view. Nothing stored or transmitted.",
    badge:    "Batch audit",
    color:    "#ffaa00",
  },
  {
    href:     "/tools/policy-generator",
    icon:     "📋",
    title:    "Password Policy Generator",
    desc:     "Generate a complete, audit-ready password policy for your organisation. Aligned with HIPAA, SOC 2, ISO 27001, PCI-DSS v4.0, and NIST 800-63B. Free download.",
    badge:    "Compliance",
    color:    "#ce93d8",
  },
  {
    href:     "/tools/secure-share",
    icon:     "🔐",
    title:    "Secure Password Sharing",
    desc:     "Share passwords safely with AES-256-GCM encrypted links. The decryption key is embedded in the URL fragment — never sent to any server. Zero knowledge sharing.",
    badge:    "AES-256-GCM",
    color:    "#4fc3f7",
  },
  {
    href:     "/tools/wifi-qr",
    icon:     "📶",
    title:    "WiFi QR Code Generator",
    desc:     "Generate a QR code for your WiFi network. Anyone scans to connect instantly — no typing required. Your WiFi password never leaves your browser.",
    badge:    "Client-side only",
    color:    "#80cbc4",
  },
];

const schema = {
  "@context": "https://schema.org",
  "@type":    "CollectionPage",
  "name":     "Free Password Security Tools — PassGeni",
  "description": "Six free password security tools: breach checker, strength checker, audit tool, policy generator, secure sharing, and WiFi QR generator.",
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
      title="Free Password Security Tools | PassGeni"
      description="Six free password security tools: breach checker, strength checker, password audit, policy generator, secure sharing, and WiFi QR generator. All client-side. Nothing stored."
      canonical="https://passgeni.ai/tools"
      schema={schema}
    >
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "80px var(--page-pad) 120px" }}>

        {/* Header */}
        <motion.div style={{ marginBottom: 64 }} {...heroEntrance(0)}>
          <nav aria-label="Breadcrumb" style={{ marginBottom: 24 }}>
            <a href="/" style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#888", textDecoration: "none" }}>PassGeni</a>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#444", margin: "0 8px" }}>→</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#C8FF00" }}>Tools</span>
          </nav>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>
            Free security tools
          </div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(32px,5vw,56px)", color: "#fff", letterSpacing: "-0.03em", marginBottom: 16, lineHeight: 1.1 }}>
            Six tools.<br /><span style={{ color: "var(--color-accent)" }}>Zero cost.</span>
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 16, color: "#888", maxWidth: 520, lineHeight: 1.8 }}>
            Every tool runs entirely in your browser. Nothing is stored. Nothing is transmitted. Free, forever.
          </p>
        </motion.div>

        {/* Tools grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
          {TOOLS.map((tool, i) => (
            <motion.a
              key={tool.href}
              href={tool.href}
              {...bcCard(i)}
              style={{ textDecoration: "none", display: "flex", flexDirection: "column", background: "#0a0a0c", border: "1px solid #141416", borderRadius: 16, padding: "28px 32px", position: "relative", overflow: "hidden" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor  = `${tool.color}44`;
                e.currentTarget.style.boxShadow    = `0 20px 60px ${tool.color}11`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor  = "#141416";
                e.currentTarget.style.boxShadow    = "none";
              }}
            >
              {/* Badge */}
              <div style={{ position: "absolute", top: 20, right: 20, fontFamily: "var(--font-mono)", fontSize: 9, color: tool.color, background: `${tool.color}15`, border: `1px solid ${tool.color}33`, borderRadius: 100, padding: "3px 10px", letterSpacing: "0.08em" }}>
                {tool.badge}
              </div>

              {/* Icon */}
              <div style={{ fontSize: 32, marginBottom: 20 }}>{tool.icon}</div>

              {/* Content */}
              <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 18, color: "#fff", marginBottom: 12, lineHeight: 1.3 }}>{tool.title}</h2>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#888", lineHeight: 1.8, flex: 1, marginBottom: 24 }}>{tool.desc}</p>

              {/* CTA */}
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: tool.color, letterSpacing: "0.08em" }}>Use tool</span>
                <span style={{ color: tool.color, fontSize: 14 }}>→</span>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Bottom trust row */}
        <motion.div {...fadeUp(0.1)} style={{ marginTop: 64, padding: "32px", background: "#0a0a0c", border: "1px solid #141416", borderRadius: 12, textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>
            Zero retention by design
          </div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#aaa", maxWidth: 520, margin: "0 auto" }}>
            Every tool on this page runs entirely client-side using your browser's native cryptographic APIs.
            No account, no tracking, no servers involved in processing your passwords.
          </p>
        </motion.div>

        {/* Testimonials */}
        <div style={{ marginTop: 80 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 24 }}>
            What users say about the tools
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
            {[
              { name: "Jake F.",   role: "Small biz owner",       text: "The Password Audit Tool found three weak passwords across my team I didn't know about. Breach check, entropy score, pattern detection — all in one run." },
              { name: "Ben A.",    role: "Freelance copywriter",  text: "Secure Share is the feature I didn't know I needed. Sent my client their CMS login via a PassGeni encrypted link. Way better than texting passwords." },
              { name: "Layla S.", role: "Marketing manager",     text: "WiFi QR Generator at our agency. Thirty seconds, QR printed, no one asks for the WiFi password at meetings. Genuinely improves the workday." },
              { name: "Nina P.",  role: "UX researcher",          text: "Strength Checker gave me actual data — entropy in bits, crack time, improvements to make. Not just a vague red/green bar. Actual useful feedback." },
              { name: "Elena V.", role: "HR director",            text: "Generated a complete HIPAA-aligned password policy PDF in two minutes using the Policy Generator. IT stopped arguing with us instantly." },
              { name: "Hana J.", role: "Data analyst",            text: "Breach checker k-anonymity is real. Only 5 chars of my SHA-1 hash go to HIBP. I checked the network tab. My password never left the browser." },
            ].map((t, i) => (
              <motion.div key={t.name} {...bcCard(i)} style={{ background: "#0c0c0e", border: "1px solid #141416", borderRadius: 12, padding: "22px 24px" }}>
                <div style={{ display: "flex", gap: 2, marginBottom: 10 }}>
                  {[1,2,3,4,5].map(i => <span key={i} style={{ color: "#C8FF00", fontSize: 11 }}>★</span>)}
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
