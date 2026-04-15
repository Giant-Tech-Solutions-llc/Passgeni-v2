import Head from "next/head";
import Header from "../components/layout/Header.js";
import Footer from "../components/layout/Footer.js";
import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { getSiteSchema, getFAQSchema, getHowToSchema } from "../seo/schema.js";
import { FAQ } from "../content/copy.js";

/* ─── helpers ─────────────────────────────────────────────── */
const CHARSET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
function genPassword(len = 20) {
  const arr = new Uint32Array(len);
  crypto.getRandomValues(arr);
  return Array.from(arr, (n) => CHARSET[n % CHARSET.length]).join("");
}
function calcEntropy(pw) {
  let pool = 0;
  if (/[a-z]/.test(pw)) pool += 26;
  if (/[A-Z]/.test(pw)) pool += 26;
  if (/[0-9]/.test(pw)) pool += 10;
  if (/[^a-zA-Z0-9]/.test(pw)) pool += 32;
  return pool > 0 ? Math.floor(pw.length * Math.log2(pool)) : 0;
}

/* ─── FadeIn wrapper ──────────────────────────────────────── */
function FadeIn({ children, delay = 0, y = 24, className, style }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ─── Live Generator Demo ─────────────────────────────────── */
function GeneratorDemo() {
  const [pw, setPw] = useState("");
  const [entropy, setEntropy] = useState(0);
  const [copied, setCopied] = useState(false);
  const [pulsing, setPulsing] = useState(false);

  const generate = useCallback(() => {
    const next = genPassword(20);
    setPw(next);
    setEntropy(calcEntropy(next));
    setPulsing(true);
    setTimeout(() => setPulsing(false), 400);
  }, []);

  useEffect(() => { generate(); }, [generate]);

  const copy = () => {
    navigator.clipboard.writeText(pw).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  const pct = Math.min(100, (entropy / 128) * 100);
  const barColor = entropy >= 80 ? "var(--accent)" : entropy >= 50 ? "#f59e0b" : "var(--danger)";

  return (
    <div className="bc" style={{ maxWidth: 540, margin: "0 auto", padding: "28px 28px 24px" }}>
      {/* password output */}
      <motion.div
        animate={pulsing ? { scale: [1, 1.012, 1] } : {}}
        transition={{ duration: 0.35 }}
        style={{
          background: "rgba(0,0,0,0.45)",
          border: "1px solid var(--border)",
          borderRadius: 10,
          padding: "14px 16px",
          fontFamily: "var(--font-mono, monospace)",
          fontSize: 15,
          letterSpacing: "0.06em",
          color: "var(--accent)",
          wordBreak: "break-all",
          minHeight: 52,
          display: "flex",
          alignItems: "center",
        }}
      >
        {pw || "—"}
      </motion.div>

      {/* entropy bar */}
      <div style={{ margin: "14px 0 6px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--muted)", marginBottom: 5 }}>
          <span>Entropy</span>
          <span style={{ color: barColor, fontWeight: 600 }}>{entropy} bits</span>
        </div>
        <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 99 }}>
          <motion.div
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ height: "100%", borderRadius: 99, background: barColor }}
          />
        </div>
      </div>

      {/* badges */}
      <div style={{ display: "flex", gap: 8, margin: "14px 0 18px", flexWrap: "wrap" }}>
        <span style={{ fontSize: 11, padding: "3px 9px", borderRadius: 99, background: "rgba(0,208,132,0.12)", color: "var(--success)", border: "1px solid rgba(0,208,132,0.25)" }}>
          ✓ NIST SP 800-63B
        </span>
        <span style={{ fontSize: 11, padding: "3px 9px", borderRadius: 99, background: "rgba(255,68,68,0.1)", color: "var(--danger)", border: "1px solid rgba(255,68,68,0.22)" }}>
          ✗ No Certificate
        </span>
      </div>

      {/* actions */}
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={generate} className="btn-primary" style={{ flex: 1, fontSize: 13, padding: "10px 0" }}>
          Generate Password
        </button>
        <button onClick={copy} className="btn-ghost" style={{ fontSize: 13, padding: "10px 16px" }}>
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* locked upsell */}
      <div style={{ position: "relative", marginTop: 10 }}>
        <button
          disabled
          style={{
            width: "100%",
            padding: "10px 0",
            fontSize: 13,
            borderRadius: 8,
            border: "1px solid rgba(200,255,0,0.25)",
            background: "rgba(200,255,0,0.04)",
            color: "rgba(200,255,0,0.4)",
            cursor: "not-allowed",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <motion.span
            style={{
              position: "absolute", top: 0, left: "-60%", width: "50%", height: "100%",
              background: "linear-gradient(90deg, transparent, rgba(200,255,0,0.08), transparent)",
            }}
            animate={{ left: ["−60%", "130%"] }}
            transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }}
          />
          🔒 Generate with Compliance Certificate
        </button>
      </div>
    </div>
  );
}

/* ─── Certificate Card ────────────────────────────────────── */
function CertificateCard() {
  const now = new Date();
  const sha = "a3f9e2...c71b40";
  const exp = new Date(now);
  exp.setFullYear(exp.getFullYear() + 1);
  const fmt = (d) => d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  return (
    <div
      className="bc"
      style={{
        maxWidth: 340,
        padding: "28px 26px",
        fontFamily: "var(--font-mono, monospace)",
        fontSize: 12,
        lineHeight: 1.7,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* glow */}
      <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(200,255,0,0.06)", filter: "blur(40px)", pointerEvents: "none" }} />

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
        <div style={{ width: 28, height: 28, borderRadius: 6, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 14, color: "#000" }}>✦</span>
        </div>
        <div>
          <div style={{ fontFamily: "var(--font-heading)", fontSize: 13, fontWeight: 700, letterSpacing: "0.05em", color: "#fff" }}>COMPLIANCE CERTIFICATE</div>
          <div style={{ fontSize: 10, color: "var(--muted)" }}>PassGeni Assurance v2.0</div>
        </div>
      </div>

      {[
        ["Standard", "NIST SP 800-63B"],
        ["Entropy", "128 bits"],
        ["Algorithm", "CSPRNG / SHA-256"],
        ["SHA-256", sha],
        ["Issued", fmt(now)],
        ["Expires", fmt(exp)],
        ["Issuer", "PassGeni Authority"],
      ].map(([k, v]) => (
        <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          <span style={{ color: "var(--muted)" }}>{k}</span>
          <span style={{ color: "#e0e0e0", maxWidth: 160, textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v}</span>
        </div>
      ))}

      <div style={{ marginTop: 16, padding: "8px 12px", borderRadius: 8, background: "rgba(0,208,132,0.1)", border: "1px solid rgba(0,208,132,0.25)", display: "flex", alignItems: "center", gap: 8 }}>
        <motion.div
          style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--success)" }}
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        />
        <span style={{ color: "var(--success)", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em" }}>VERIFIED — CRYPTOGRAPHICALLY SIGNED</span>
      </div>
    </div>
  );
}

/* ─── Sections ────────────────────────────────────────────── */

const Hero = (
  <section style={{ padding: "clamp(80px,12vw,140px) 0 clamp(60px,8vw,100px)", textAlign: "center" }}>
    <div className="container">
      <FadeIn>
        <div className="eyebrow" style={{ marginBottom: 20 }}>Zero-Knowledge · CSPRNG · Compliance-Grade</div>
      </FadeIn>
      <FadeIn delay={0.08}>
        <h1 style={{ fontSize: "clamp(2.4rem,5.5vw,4rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: 20, maxWidth: 720, margin: "0 auto 20px" }}>
          Passwords are easy.<br />
          <span style={{ color: "var(--accent)" }}>Proof is not.</span>
        </h1>
      </FadeIn>
      <FadeIn delay={0.15}>
        <p style={{ fontSize: "clamp(1rem,1.8vw,1.2rem)", color: "var(--muted)", maxWidth: 540, margin: "0 auto 40px", lineHeight: 1.65 }}>
          PassGeni generates cryptographically strong passwords and issues verifiable compliance certificates — so your next audit has evidence, not just words.
        </p>
      </FadeIn>
      <FadeIn delay={0.22}>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 56 }}>
          <a href="/signup" className="btn-primary" style={{ fontSize: 15, padding: "13px 28px" }}>Get your first certificate →</a>
          <a href="#how-it-works" className="btn-ghost" style={{ fontSize: 15, padding: "13px 24px" }}>See how it works</a>
        </div>
      </FadeIn>
      <FadeIn delay={0.28}>
        <GeneratorDemo />
      </FadeIn>
      <FadeIn delay={0.35}>
        <div style={{ display: "flex", gap: 28, justifyContent: "center", flexWrap: "wrap", marginTop: 40, fontSize: 12, color: "var(--muted)" }}>
          {["HIPAA compliant", "PCI-DSS v4.0", "SOC 2 ready", "ISO 27001", "DoD STIG"].map((b) => (
            <span key={b} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ color: "var(--accent)" }}>✦</span> {b}
            </span>
          ))}
        </div>
      </FadeIn>
    </div>
  </section>
);

const Problem = (
  <section style={{ padding: "clamp(60px,8vw,100px) 0", background: "rgba(255,255,255,0.015)" }}>
    <div className="container">
      <FadeIn>
        <div className="section-header" style={{ textAlign: "center", marginBottom: 56 }}>
          <div className="eyebrow">The Problem</div>
          <h2>Compliance teams accept passwords on faith.<br /><span style={{ color: "var(--accent)" }}>That era is over.</span></h2>
        </div>
      </FadeIn>
      <div className="grid-cards" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        {[
          { icon: "🗂", title: "No audit trail", body: "You generated a strong password. Great. But auditors need evidence, not claims." },
          { icon: "📋", title: "Compliance gaps", body: "HIPAA requires documented password policies. Spreadsheets don't count as proof." },
          { icon: "🔧", title: "Manual proof is painful", body: "Screenshots, logs, email chains — compliance teams waste hours assembling evidence." },
          { icon: "📜", title: "No verifiable standard", body: "Any generator can claim NIST compliance. Only PassGeni issues a signed certificate you can open." },
        ].map(({ icon, title, body }, i) => (
          <FadeIn key={title} delay={i * 0.07}>
            <div className="bc" style={{ padding: "28px 24px", height: "100%" }}>
              <div style={{ fontSize: 28, marginBottom: 14 }}>{icon}</div>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: "#fff" }}>{title}</h3>
              <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.65 }}>{body}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

const Solution = (
  <section id="how-it-works" style={{ padding: "clamp(60px,8vw,100px) 0" }}>
    <div className="container">
      <FadeIn>
        <div className="section-header" style={{ textAlign: "center", marginBottom: 64 }}>
          <div className="eyebrow">How it works</div>
          <h2>Three steps from generation to <span style={{ color: "var(--accent)" }}>certified proof</span></h2>
        </div>
      </FadeIn>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24, maxWidth: 860, margin: "0 auto" }}>
        {[
          { n: "01", title: "Generate", body: "Select your compliance standard. PassGeni's CSPRNG produces a password that satisfies every character-class and entropy requirement." },
          { n: "02", title: "Validate", body: "Our engine checks entropy (bits), character distribution, breach exposure via k-anonymity, and alignment with your chosen standard." },
          { n: "03", title: "Certify", body: "Download a tamper-evident PDF certificate with your password hash, standard, entropy score, timestamp, and a cryptographic signature." },
        ].map(({ n, title, body }, i) => (
          <FadeIn key={n} delay={i * 0.1}>
            <div className="bc-feat" style={{ padding: "32px 26px", position: "relative", overflow: "hidden" }}>
              <div style={{ fontSize: "clamp(3rem, 6vw, 4.5rem)", fontWeight: 900, color: "rgba(200,255,0,0.07)", lineHeight: 1, position: "absolute", top: 12, right: 16, letterSpacing: "-0.04em" }}>{n}</div>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                <span style={{ fontWeight: 900, color: "#000", fontSize: 16 }}>{n.slice(-1)}</span>
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10, color: "#fff" }}>{title}</h3>
              <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7 }}>{body}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

const CertSection = (
  <section style={{ padding: "clamp(60px,8vw,100px) 0", background: "rgba(255,255,255,0.015)" }}>
    <div className="container">
      <div style={{ display: "flex", gap: "clamp(32px,6vw,72px)", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 320px" }}>
          <FadeIn>
            <div className="eyebrow" style={{ marginBottom: 14 }}>The Certificate</div>
            <h2 style={{ fontSize: "clamp(1.6rem,3vw,2.4rem)", fontWeight: 800, marginBottom: 20, lineHeight: 1.2 }}>
              Proof your auditors<br /><span style={{ color: "var(--accent)" }}>can actually verify</span>
            </h2>
            <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7, marginBottom: 28, maxWidth: 420 }}>
              Every certificate includes the SHA-256 hash of your password, the compliance standard applied, entropy measurement, generation timestamp, and a cryptographic signature from PassGeni Authority.
            </p>
          </FadeIn>
          {[
            "Tamper-evident PDF download",
            "SHA-256 hash of generated password",
            "Entropy score in bits",
            "Standard: HIPAA / PCI-DSS / SOC 2 / NIST",
            "Cryptographically signed by PassGeni Authority",
            "Linked to your audit log",
          ].map((f, i) => (
            <FadeIn key={f} delay={i * 0.06}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
                <span style={{ color: "var(--accent)", flexShrink: 0, marginTop: 1 }}>✦</span>
                <span style={{ fontSize: 13.5, color: "#ccc" }}>{f}</span>
              </div>
            </FadeIn>
          ))}
        </div>
        <FadeIn delay={0.12} style={{ flex: "0 1 360px" }}>
          <CertificateCard />
        </FadeIn>
      </div>
    </div>
  </section>
);

const UseCases = (
  <section style={{ padding: "clamp(60px,8vw,100px) 0" }}>
    <div className="container">
      <FadeIn>
        <div className="section-header" style={{ textAlign: "center", marginBottom: 56 }}>
          <div className="eyebrow">Who uses PassGeni</div>
          <h2>Built for teams that get <span style={{ color: "var(--accent)" }}>audited</span></h2>
        </div>
      </FadeIn>
      <div className="grid-cards" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        {[
          { icon: "💻", label: "Developers", body: "Embed compliance-grade generation in your app's onboarding. Ship password policies with certificates baked in." },
          { icon: "🚀", label: "Startups", body: "Pass SOC 2 Type II and ISO 27001 audits without hiring a dedicated compliance engineer." },
          { icon: "🏥", label: "Healthcare", body: "Satisfy HIPAA § 164.312(d) technical access controls with documented, signed evidence at every rotation." },
          { icon: "👥", label: "Teams", body: "Enforce a consistent password policy across your org. Every member gets a certifiable credential." },
        ].map(({ icon, label, body }, i) => (
          <FadeIn key={label} delay={i * 0.07}>
            <div className="bc" style={{ padding: "28px 24px", height: "100%" }}>
              <div style={{ fontSize: 30, marginBottom: 14 }}>{icon}</div>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: "#fff" }}>{label}</h3>
              <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.65 }}>{body}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

const Comparison = (
  <section style={{ padding: "clamp(60px,8vw,100px) 0", background: "rgba(255,255,255,0.015)" }}>
    <div className="container">
      <FadeIn>
        <div className="section-header" style={{ textAlign: "center", marginBottom: 52 }}>
          <div className="eyebrow">Why PassGeni</div>
          <h2>The only generator with <span style={{ color: "var(--accent)" }}>verifiable output</span></h2>
        </div>
      </FadeIn>
      <FadeIn delay={0.1}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", maxWidth: 700, margin: "0 auto", borderCollapse: "collapse", fontSize: 13.5 }}>
            <thead>
              <tr>
                {["Feature", "Password Manager", "Random Generator", "PassGeni Assurance"].map((h, i) => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: i === 0 ? "left" : "center", color: i === 3 ? "var(--accent)" : "var(--muted)", fontWeight: i === 3 ? 700 : 500, borderBottom: "1px solid var(--border)", background: i === 3 ? "rgba(200,255,0,0.04)" : "transparent" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Generates strong password", "✓", "✓", "✓"],
                ["Zero-knowledge (client-side)", "—", "—", "✓"],
                ["Compliance standard selection", "—", "—", "✓"],
                ["Entropy measurement", "—", "—", "✓"],
                ["Breach check (k-anonymity)", "—", "—", "✓"],
                ["Signed compliance certificate", "—", "—", "✓"],
                ["Audit log with evidence", "—", "—", "✓"],
                ["Verifiable by third party", "—", "—", "✓"],
              ].map(([feat, pm, rg, pg]) => (
                <tr key={feat} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  {[feat, pm, rg, pg].map((v, i) => (
                    <td key={i} style={{
                      padding: "11px 16px",
                      textAlign: i === 0 ? "left" : "center",
                      color: v === "✓" ? (i === 3 ? "var(--accent)" : "var(--success)") : v === "—" ? "rgba(255,255,255,0.18)" : "#ccc",
                      background: i === 3 ? "rgba(200,255,0,0.025)" : "transparent",
                      fontWeight: v === "✓" && i === 3 ? 600 : 400,
                    }}>
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FadeIn>
    </div>
  </section>
);

const Features = (
  <section style={{ padding: "clamp(60px,8vw,100px) 0" }}>
    <div className="container">
      <FadeIn>
        <div className="section-header" style={{ textAlign: "center", marginBottom: 56 }}>
          <div className="eyebrow">Platform features</div>
          <h2>Everything needed for <span style={{ color: "var(--accent)" }}>defensible compliance</span></h2>
        </div>
      </FadeIn>
      <div className="grid-cards" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        {[
          { icon: "🛡", title: "Compliance Validation", body: "Every password is checked against HIPAA, PCI-DSS v4.0, SOC 2, NIST SP 800-63B, ISO 27001, and DoD STIG rules before generation completes." },
          { icon: "📄", title: "Signed Certificates", body: "Download a tamper-evident PDF certificate with SHA-256 proof, entropy score, standard applied, and a cryptographic signature." },
          { icon: "🔗", title: "Secure Share (AES-256)", body: "Share credentials with AES-256-GCM encryption. The decryption key lives only in the URL fragment — never reaches our servers." },
          { icon: "📊", title: "Audit Logs", body: "Every generation event is logged with timestamp, standard, and entropy. Export to CSV for your next audit." },
          { icon: "📋", title: "Policy Templates", body: "Generate a complete, branded password policy document aligned to any compliance standard in under 60 seconds." },
          { icon: "🔍", title: "Independent Verification", body: "Certificates are publicly verifiable via the PassGeni verification portal — no account needed for auditors." },
        ].map(({ icon, title, body }, i) => (
          <FadeIn key={title} delay={i * 0.06}>
            <div className="bc-feat" style={{ padding: "28px 24px", height: "100%" }}>
              <div style={{ fontSize: 26, marginBottom: 14 }}>{icon}</div>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: "#fff" }}>{title}</h3>
              <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.65 }}>{body}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

const PLANS = [
  {
    name: "Foundation",
    price: "$0",
    period: "forever free",
    featured: false,
    cta: "Start free",
    href: "/signup",
    items: [
      "Unlimited password generation",
      "All 6 security tools",
      "NIST SP 800-63B compliance",
      "Breach check (k-anonymity)",
      "Secure Share (AES-256)",
    ],
    excluded: ["Compliance certificates", "Audit log export", "Policy documents"],
  },
  {
    name: "Assurance",
    price: "$12",
    period: "per month",
    featured: true,
    cta: "Get Assurance",
    href: "/signup?plan=assurance",
    items: [
      "Everything in Foundation",
      "Signed compliance certificates (PDF)",
      "Certificate verification portal",
      "Audit log with export",
      "Policy document generator",
      "All standards: HIPAA, PCI-DSS, SOC 2, NIST, ISO, STIG",
    ],
    excluded: [],
  },
  {
    name: "Authority",
    price: "$49",
    period: "per month",
    featured: false,
    cta: "Get Authority",
    href: "/signup?plan=authority",
    items: [
      "Everything in Assurance",
      "Team seats (up to 25)",
      "Bulk certificate generation",
      "API access",
      "Custom issuer name on certificates",
      "Priority support",
    ],
    excluded: [],
  },
];

const Pricing = (
  <section id="pricing" style={{ padding: "clamp(60px,8vw,100px) 0", background: "rgba(255,255,255,0.015)" }}>
    <div className="container">
      <FadeIn>
        <div className="section-header" style={{ textAlign: "center", marginBottom: 56 }}>
          <div className="eyebrow">Pricing</div>
          <h2>Start free. Upgrade when <span style={{ color: "var(--accent)" }}>auditors arrive.</span></h2>
          <p style={{ color: "var(--muted)", marginTop: 12, fontSize: 14 }}>No credit card required to start. Cancel anytime.</p>
        </div>
      </FadeIn>
      <div className="pricing-grid">
        {PLANS.map(({ name, price, period, featured, cta, href, items, excluded }, i) => (
          <FadeIn key={name} delay={i * 0.08}>
            <div
              className={featured ? "bc-feat" : "bc"}
              style={{
                padding: "32px 26px",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                outline: featured ? "1px solid rgba(200,255,0,0.35)" : "none",
              }}
            >
              {featured && (
                <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "var(--accent)", color: "#000", fontSize: 10, fontWeight: 800, padding: "3px 12px", borderRadius: 99, letterSpacing: "0.1em", whiteSpace: "nowrap" }}>
                  MOST POPULAR
                </div>
              )}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)", marginBottom: 6 }}>{name}</div>
                <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: "-0.03em", color: "#fff" }}>{price}</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>{period}</div>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", flex: 1 }}>
                {items.map((item) => (
                  <li key={item} style={{ display: "flex", gap: 9, alignItems: "flex-start", marginBottom: 8, fontSize: 13, color: "#ccc" }}>
                    <span style={{ color: "var(--accent)", flexShrink: 0 }}>✓</span> {item}
                  </li>
                ))}
                {excluded.map((item) => (
                  <li key={item} style={{ display: "flex", gap: 9, alignItems: "flex-start", marginBottom: 8, fontSize: 13, color: "rgba(255,255,255,0.25)" }}>
                    <span style={{ flexShrink: 0 }}>—</span> {item}
                  </li>
                ))}
              </ul>
              <a href={href} className={featured ? "btn-primary" : "btn-ghost"} style={{ textAlign: "center", fontSize: 14, padding: "11px 0" }}>
                {cta}
              </a>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

const FinalCTA = (
  <section style={{ padding: "clamp(80px,10vw,120px) 0", textAlign: "center" }}>
    <div className="container">
      <FadeIn>
        <div className="eyebrow" style={{ marginBottom: 20 }}>Your next audit is coming</div>
        <h2 style={{ fontSize: "clamp(2rem,4.5vw,3.2rem)", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: 20 }}>
          Will you have <span style={{ color: "var(--accent)" }}>evidence</span>,<br />or just good intentions?
        </h2>
        <p style={{ fontSize: "clamp(1rem,1.6vw,1.15rem)", color: "var(--muted)", maxWidth: 480, margin: "0 auto 40px", lineHeight: 1.65 }}>
          Auditors don't take your word for it. PassGeni gives you signed, verifiable proof that every password meets the standard — ready to hand over in seconds.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="/signup" className="btn-primary" style={{ fontSize: 15, padding: "14px 32px" }}>
            Get your first certificate — free →
          </a>
          <a href="/tools" className="btn-ghost" style={{ fontSize: 15, padding: "14px 24px" }}>
            Explore free tools
          </a>
        </div>
        <p style={{ marginTop: 20, fontSize: 12, color: "rgba(255,255,255,0.25)" }}>
          No credit card · No signup required for free tier · Cancel anytime
        </p>
      </FadeIn>
    </div>
  </section>
);

/* ─── Page ────────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <>
      <Head>
        <title>PassGeni — Compliance-Grade Password Certificates | Zero Knowledge</title>
        <meta name="description" content="PassGeni generates cryptographically strong passwords and issues verifiable compliance certificates for HIPAA, PCI-DSS, SOC 2, NIST SP 800-63B, and ISO 27001. Zero storage. Client-side only." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://passgeni.ai" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://passgeni.ai" />
        <meta property="og:title" content="PassGeni — Compliance-Grade Password Certificates" />
        <meta property="og:description" content="Generate passwords with compliance certificates for HIPAA, PCI-DSS, SOC 2, and NIST. Verifiable proof your auditors can check." />
        <meta property="og:image" content="https://passgeni.ai/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="PassGeni — Compliance-Grade Password Certificates" />
        <meta name="twitter:description" content="Passwords with verifiable compliance certificates. Zero storage. HIPAA, PCI-DSS, SOC 2, NIST." />
        <meta name="twitter:image" content="https://passgeni.ai/og-image.png" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getSiteSchema()) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getFAQSchema(FAQ.items)) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getHowToSchema()) }} />
      </Head>
      <div style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
        <Header />
        <main>
          {Hero}
          {Problem}
          {Solution}
          {CertSection}
          {UseCases}
          {Comparison}
          {Features}
          {Pricing}
          {FinalCTA}
        </main>
        <Footer />
      </div>
    </>
  );
}
