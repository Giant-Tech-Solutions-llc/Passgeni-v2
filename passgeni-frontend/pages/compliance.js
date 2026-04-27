import Head from "next/head";
import { useState } from "react";
import Header from "../components/layout/Header.js";
import Footer from "../components/layout/Footer.js";
import { STANDARDS } from "../lib/compliance.js";
import { IcShield, IcUser, IcKey, IcCompass, IcSettings, IcLock } from "../lib/icons.js";

const STANDARD_DETAIL = {
  "NIST-800-63B": {
    icon: <IcShield size={22} color="var(--accent)" />,
    who: "US Federal agencies, defense contractors, any enterprise following US NIST guidance.",
    why: "NIST SP 800-63B shifted the industry away from complexity rules toward length as the primary security driver. Mandatory for federal systems; widely adopted as a best-practice baseline.",
    auditNote: "NIST does not mandate rotation or special characters — password length ≥ 8 with entropy checks is sufficient for certification.",
    learnMore: "/guides/nist-800-63b-password-guidelines",
  },
  HIPAA: {
    icon: <IcUser size={22} color="var(--accent)" />,
    who: "Healthcare providers, health insurers, medical SaaS, Business Associates under HIPAA.",
    why: "HIPAA §164.312(d) requires technical safeguards for ePHI authentication. Auditors expect documented evidence of strong credential generation.",
    auditNote: "Certificates issued for HIPAA include entropy, char pool, and generation params — all fields an OCR auditor may request.",
    learnMore: "/guides/hipaa-password-requirements",
  },
  "PCI-DSS-v4": {
    icon: <IcKey size={22} color="var(--accent)" />,
    who: "Payment processors, merchants, card-not-present platforms, FinTech companies.",
    why: "PCI-DSS v4.0 Requirement 8.3 mandates minimum password complexity, entropy, and rotation documentation for systems that access cardholder data.",
    auditNote: "PassGeni certificates satisfy the documentation requirement for Req 8.3. Rotation schedules must still be enforced by your policies.",
    learnMore: "/guides/pci-dss-password-requirements",
  },
  SOC2: {
    icon: <IcCompass size={22} color="var(--accent)" />,
    who: "SaaS companies, cloud infrastructure providers, B2B platforms undergoing SOC 2 Type II audits.",
    why: "SOC 2 CC6.1 (Logical Access Controls) requires evidence of a documented, policy-driven credential management process.",
    auditNote: "Type II auditors want to see consistency. Certificates prove that employees use a systematic, auditable process — not ad-hoc generation.",
    learnMore: "/guides/soc2-password-requirements",
  },
  "ISO-27001": {
    icon: <IcSettings size={22} color="var(--accent)" />,
    who: "Enterprises seeking ISO/IEC 27001:2022 certification, government contractors, GovTech.",
    why: "Annex A.9 (Access Control) requires an information security access control policy and evidence that credentials meet defined standards.",
    auditNote: "ISO 27001 auditors assess whether the organisation has a documented, repeatable process. PassGeni certificates serve as per-credential evidence.",
    learnMore: "/guides/iso-27001-password-requirements",
  },
  "FIPS-140-3": {
    icon: <IcLock size={22} color="var(--accent)" />,
    who: "US government contractors, agencies, defence and intelligence systems requiring FIPS-validated cryptography.",
    why: "FIPS PUB 140-3 requires that cryptographic modules use approved entropy sources. Passwords generated with `crypto.getRandomValues` qualify.",
    auditNote: "FIPS 140-3 is the strictest standard: 20+ char minimum, all character classes, no dictionary words, documented entropy source.",
    learnMore: "/guides/nist-800-63b-password-guidelines",
  },
};

const FEATURE_ROWS = [
  { label: "Min length", key: "minLength", fmt: (v) => `${v}+` },
  { label: "Uppercase required", key: "requireUppercase", fmt: (v) => v ? "Yes" : "No" },
  { label: "Lowercase required", key: "requireLowercase", fmt: (v) => v ? "Yes" : "No" },
  { label: "Numbers required", key: "requireNumbers", fmt: (v) => v ? "Yes" : "No" },
  { label: "Special chars required", key: "requireSpecial", fmt: (v) => v ? "Yes" : "No" },
  { label: "No dictionary words", key: "forbidDictionaryWords", fmt: (v) => v ? "Yes" : "—" },
  { label: "No repeating chars", key: "forbidRepeatingChars", fmt: (v) => v ? "Yes" : "—" },
  { label: "Min entropy bits", key: "minEntropyBits", fmt: (v) => v > 0 ? `${v} bits` : "—" },
  { label: "Rotation required", key: "rotationRequired", fmt: (v) => v ? "Yes" : "—" },
  { label: "Audit trail required", key: "auditTrailRequired", fmt: (v) => v ? "Yes" : "—" },
];

const FAQ_ITEMS = [
  {
    q: "What is a compliance certificate?",
    a: "A compliance certificate is an ES256-signed cryptographic proof that a password met a specific standard's requirements at the time of generation. It records entropy, character pool, generation parameters, and which standards were satisfied — without ever storing the password itself.",
  },
  {
    q: "Can I use these certificates in a real audit?",
    a: "Yes. The certificates are designed for this. They contain the fields auditors ask for: issuer, standard, entropy bits, char pool size, generation method, and a verifiable cryptographic signature. The JWT fingerprint lets auditors confirm the certificate has not been tampered with.",
  },
  {
    q: "Which standard should I choose?",
    a: "Choose the standard your industry is regulated by. Healthcare → HIPAA. Payments → PCI-DSS. SaaS with enterprise clients → SOC 2. Government contractors → FIPS 140-3 or NIST SP 800-63B. If unsure, NIST SP 800-63B is the best general-purpose baseline.",
  },
  {
    q: "Does PassGeni store my passwords?",
    a: "Never. Password generation happens entirely in your browser using the Web Crypto API (crypto.getRandomValues). The password never reaches our servers. Only the generation parameters, entropy metadata, and signature are stored to issue the certificate.",
  },
  {
    q: "How do I verify a certificate offline?",
    a: "Every certificate page includes instructions for offline verification. Fetch the public JWK from passgeni.ai/.well-known/jwks.json, decode the JWT, and verify the ES256 signature with any standard JWT library. No API call to PassGeni is required.",
  },
  {
    q: "What is the difference between SOC 2 and ISO 27001?",
    a: "Both require audit trails and rotation policies. SOC 2 (CC6.1) is primarily used by US-based cloud providers and requires a minimum of 16 characters. ISO 27001:2022 (A.9) is the international equivalent, with a minimum of 14 characters. PassGeni issues certificates for both.",
  },
];

function FAQAccordion() {
  const [open, setOpen] = useState(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {FAQ_ITEMS.map((item, i) => (
        <div key={i} style={{ border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, overflow: "hidden" }}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{ width: "100%", background: "none", border: "none", padding: "16px 20px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", color: open === i ? "#fff" : "#aaa", fontSize: 14, fontFamily: "Outfit, sans-serif", textAlign: "left", gap: 16 }}
          >
            <span>{item.q}</span>
            <span style={{ fontSize: 20, lineHeight: 1, flexShrink: 0, color: "#c8ff00" }}>{open === i ? "−" : "+"}</span>
          </button>
          {open === i && (
            <div style={{ padding: "0 20px 18px", fontSize: 13, color: "#888", lineHeight: 1.75, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              <p style={{ margin: "14px 0 0" }}>{item.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function CompliancePage() {
  const standards = Object.values(STANDARDS);

  return (
    <>
      <Head>
        <title>Compliance Standards Reference — PassGeni</title>
        <meta name="description" content="Complete reference for NIST 800-63B, HIPAA, PCI-DSS v4, SOC 2, ISO 27001, and FIPS 140-3 password requirements. Minimum lengths, character rules, entropy, and audit trail requirements." />
        <meta property="og:title" content="Password Compliance Standards Reference — PassGeni" />
        <meta property="og:description" content="Side-by-side comparison of NIST, HIPAA, PCI-DSS, SOC 2, ISO 27001, and FIPS 140-3 password requirements." />
        <link rel="preload" href="/fonts/SpaceMono-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </Head>
      <Header />

      <main style={{ background: "#060608", color: "#e0e0e0", fontFamily: "Outfit, sans-serif", minHeight: "100vh" }}>

        {/* Hero */}
        <section style={{ maxWidth: 900, margin: "0 auto", padding: "80px 24px 64px", textAlign: "center" }}>
          <div style={{ fontSize: 10, letterSpacing: "0.18em", color: "#555", marginBottom: 16, fontFamily: "Space Mono, monospace" }}>
            COMPLIANCE REFERENCE
          </div>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 800, letterSpacing: "-0.03em", color: "#fff", marginBottom: 16, lineHeight: 1.15 }}>
            Password compliance standards,<br />explained for every industry.
          </h1>
          <p style={{ fontSize: 16, color: "#666", maxWidth: 560, margin: "0 auto 36px", lineHeight: 1.7 }}>
            Minimum lengths, character rules, entropy requirements, and audit trail obligations — all six major standards, side by side.
          </p>
          <a href="/#generator" style={{ display: "inline-block", background: "#c8ff00", color: "#000", fontWeight: 800, fontSize: 14, padding: "12px 28px", borderRadius: 8, textDecoration: "none", letterSpacing: "-0.01em" }}>
            Generate a compliant password →
          </a>
        </section>

        {/* Standard cards */}
        <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 80px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
            {standards.map((std) => {
              const detail = STANDARD_DETAIL[std.id];
              return (
                <div key={std.id} style={{ background: "#0a0a0c", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "28px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                    <div>
                      <div style={{ marginBottom: 8 }}>{detail?.icon}</div>
                      <h2 style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", margin: 0 }}>{std.label}</h2>
                      <div style={{ fontSize: 11, color: "#555", marginTop: 4, fontFamily: "Space Mono, monospace" }}>{std.id}</div>
                    </div>
                    <div style={{ flexShrink: 0, padding: "4px 12px", borderRadius: 99, background: "rgba(200,255,0,0.08)", border: "1px solid rgba(200,255,0,0.2)", fontSize: 10, color: "#c8ff00", fontFamily: "Space Mono, monospace", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
                      {std.targetMarket?.split(",")[0]}
                    </div>
                  </div>

                  <p style={{ fontSize: 13, color: "#888", lineHeight: 1.65, margin: 0 }}>{std.description}</p>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 99, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#888" }}>
                      Min {std.minLength} chars
                    </span>
                    {std.requireUppercase && <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 99, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#888" }}>A-Z</span>}
                    {std.requireNumbers && <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 99, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#888" }}>0-9</span>}
                    {std.requireSpecial && <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 99, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#888" }}>Symbols</span>}
                    {std.minEntropyBits > 0 && <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 99, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#888" }}>{std.minEntropyBits}+ bits</span>}
                    {std.auditTrailRequired && <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 99, background: "rgba(250,204,21,0.06)", border: "1px solid rgba(250,204,21,0.15)", color: "#facc15" }}>Audit trail</span>}
                    {std.rotationRequired && <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 99, background: "rgba(250,204,21,0.06)", border: "1px solid rgba(250,204,21,0.15)", color: "#facc15" }}>Rotation</span>}
                  </div>

                  {detail?.who && (
                    <div style={{ fontSize: 12, color: "#555", lineHeight: 1.6, borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 14 }}>
                      <span style={{ color: "#444", fontFamily: "Space Mono, monospace", fontSize: 10, letterSpacing: "0.06em" }}>WHO: </span>{detail.who}
                    </div>
                  )}

                  {detail?.learnMore && (
                    <a href={detail.learnMore} style={{ fontSize: 12, color: "#c8ff00", textDecoration: "none", letterSpacing: "-0.01em", marginTop: "auto" }}>
                      Read full guide →
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Comparison table */}
        <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 80px" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontSize: 10, letterSpacing: "0.18em", color: "#555", marginBottom: 12, fontFamily: "Space Mono, monospace" }}>SIDE-BY-SIDE COMPARISON</div>
            <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff" }}>All standards at a glance</h2>
          </div>
          <div style={{ overflowX: "auto", borderRadius: 12, border: "1px solid rgba(255,255,255,0.07)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "Outfit, sans-serif" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(200,255,0,0.02)" }}>
                  <th style={{ padding: "14px 20px", textAlign: "left", fontSize: 11, color: "#555", fontFamily: "Space Mono, monospace", letterSpacing: "0.06em", fontWeight: 400, whiteSpace: "nowrap" }}>Requirement</th>
                  {standards.map((s) => (
                    <th key={s.id} style={{ padding: "14px 16px", textAlign: "center", fontSize: 11, color: "#aaa", fontWeight: 700, whiteSpace: "nowrap" }}>{s.shortLabel}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FEATURE_ROWS.map((row, ri) => (
                  <tr key={row.key} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: ri % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
                    <td style={{ padding: "12px 20px", fontSize: 12, color: "#888", whiteSpace: "nowrap" }}>{row.label}</td>
                    {standards.map((s) => {
                      const val = s[row.key];
                      const display = row.fmt(val);
                      const isPositive = display !== "—" && display !== "No";
                      return (
                        <td key={s.id} style={{ padding: "12px 16px", textAlign: "center", fontSize: 12, color: isPositive ? "#c8ff00" : "#333", fontFamily: display === "—" || display === "No" ? "inherit" : "Space Mono, monospace" }}>
                          {display}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 3-step explainer */}
        <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 80px" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 10, letterSpacing: "0.18em", color: "#555", marginBottom: 12, fontFamily: "Space Mono, monospace" }}>HOW IT WORKS</div>
            <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff" }}>From generation to certification in 3 steps</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
            {[
              { num: "01", title: "Generate in-browser", body: "crypto.getRandomValues produces cryptographically secure randomness in your browser. The password never leaves your device." },
              { num: "02", title: "Select your standard", body: "Pick the compliance framework your organisation is subject to. PassGeni validates your parameters server-side against the standard's exact rules." },
              { num: "03", title: "Receive your certificate", body: "An ES256-signed certificate is issued and stored. Share the URL — auditors can verify the signature offline against the public JWK." },
            ].map((step) => (
              <div key={step.num} style={{ background: "#0a0a0c", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "28px 24px" }}>
                <div style={{ fontFamily: "Space Mono, monospace", fontSize: 28, fontWeight: 700, color: "rgba(200,255,0,0.35)", marginBottom: 16 }}>{step.num}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 10, letterSpacing: "-0.01em" }}>{step.title}</h3>
                <p style={{ fontSize: 13, color: "#777", lineHeight: 1.7, margin: 0 }}>{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px 80px" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontSize: 10, letterSpacing: "0.18em", color: "#555", marginBottom: 12, fontFamily: "Space Mono, monospace" }}>FAQ</div>
            <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff" }}>Common questions</h2>
          </div>
          <FAQAccordion />
        </section>

        {/* CTA */}
        <section style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px 100px", textAlign: "center" }}>
          <div style={{ background: "#0a0a0c", border: "1px solid rgba(200,255,0,0.12)", borderRadius: 20, padding: "52px 40px" }}>
            <div style={{ fontSize: 10, letterSpacing: "0.18em", color: "#555", marginBottom: 14, fontFamily: "Space Mono, monospace" }}>GET CERTIFIED</div>
            <h2 style={{ fontSize: "clamp(22px, 4vw, 34px)", fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", marginBottom: 14 }}>
              Stop screenshotting your password generator.
            </h2>
            <p style={{ fontSize: 14, color: "#666", maxWidth: 440, margin: "0 auto 32px", lineHeight: 1.7 }}>
              Generate, certify, and share cryptographic proof of compliance — in under 30 seconds.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/signup" style={{ display: "inline-block", background: "#c8ff00", color: "#000", fontWeight: 800, fontSize: 14, padding: "12px 28px", borderRadius: 8, textDecoration: "none", letterSpacing: "-0.01em" }}>
                Get PassGeni free →
              </a>
              <a href="/#generator" style={{ display: "inline-block", background: "transparent", color: "#888", fontWeight: 600, fontSize: 14, padding: "12px 28px", borderRadius: 8, textDecoration: "none", letterSpacing: "-0.01em", border: "1px solid rgba(255,255,255,0.1)" }}>
                Try the generator
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
