// =============================================================
// PASSGENI — PASSWORD STRENGTH CHECKER
// passgeni.ai/tools/strength-checker
// =============================================================

import { useState } from "react";
import { motion } from "framer-motion";
import { btnPrimary } from "../../lib/motion.js";
import ToolPage from "../../components/tools/ToolPage.js";
import { getStrength, getEntropy, getCrackTime, getDNAScore } from "../../lib/strength.js";
import { IcCheck, IcX, IcEye, IcEyeOff } from "../../lib/icons.js";

function StrengthMeter({ password }) {
  const strength  = getStrength(password);
  const entropy   = getEntropy(password);
  const crackTime = getCrackTime(password);
  const dna       = getDNAScore(password);

  if (!password) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, animation: "fadeIn 0.3s ease" }}>

      {/* ── Top summary ── */}
      <div style={{ background: "#0a0a0c", border: `1px solid ${strength.color}33`, borderRadius: 12, padding: "24px 28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 28, color: strength.color, letterSpacing: "-0.02em" }}>
              {strength.label}
            </div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#888", marginTop: 4 }}>
              Estimated crack time: <span style={{ color: "#ccc" }}>{crackTime}</span>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 36, color: dna?.gradeColor || "#888" }}>
              {dna?.grade || "—"}
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#666", letterSpacing: "0.08em" }}>DNA GRADE</div>
          </div>
        </div>

        {/* Strength bar */}
        <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
          {[1,2,3,4].map((i) => (
            <div key={i} style={{ height: 4, flex: 1, borderRadius: 100, background: i <= strength.score ? strength.color : "#1a1a1a", transition: "background 0.4s" }} />
          ))}
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {[
            { label: "Length",    value: `${password.length} chars`, pass: null },
            { label: "Entropy",   value: `${entropy} bits`,          pass: null },
            { label: "Uppercase", value: /[A-Z]/.test(password) ? "Yes" : "No", pass: /[A-Z]/.test(password) },
            { label: "Numbers",   value: /[0-9]/.test(password) ? "Yes" : "No", pass: /[0-9]/.test(password) },
            { label: "Symbols",   value: /[^A-Za-z0-9]/.test(password) ? "Yes" : "No", pass: /[^A-Za-z0-9]/.test(password) },
          ].map(({ label, value, pass }) => (
            <div key={label}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#666", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: pass === true ? "#C8FF00" : pass === false ? "#ff4444" : "#ccc", display: "inline-flex", alignItems: "center", gap: 4 }}>
                {pass === true && <IcCheck size={11} color="#C8FF00" />}
                {pass === false && <IcX size={11} color="#ff4444" />}
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── DNA Score breakdown ── */}
      {dna && (
        <div style={{ background: "#0a0a0c", border: "1px solid #141416", borderRadius: 12, padding: "24px 28px" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>
            DNA Score Breakdown — {dna.total}/100
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {dna.checks.map((c, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: c.pass ? "#ccc" : "#555", display: "inline-flex", alignItems: "center", gap: 8 }}>
                    {c.pass ? <IcCheck size={13} color="#C8FF00" /> : <IcX size={13} color="#ff4444" />}
                    {c.label}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: c.pass ? "#C8FF0088" : "#333" }}>
                    {c.pass ? `+${c.weight}` : "0"} pts
                  </span>
                </div>
                <div style={{ height: 3, background: "#0e0e10", borderRadius: 100, overflow: "hidden" }}>
                  <div style={{ height: "100%", background: c.pass ? dna.gradeColor : "transparent", width: c.pass ? `${(c.weight / 85) * 100}%` : "0%", borderRadius: 100, transition: "width 0.8s cubic-bezier(.16,1,.3,1)" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Improvement suggestions ── */}
      {dna && dna.total < 85 && (
        <div style={{ background: "#0a0a0c", border: "1px solid #141416", borderRadius: 12, padding: "24px 28px" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
            How to improve this password
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {dna.checks.filter((c) => !c.pass).map((c, i) => {
              const tips = {
                "Length ≥ 12":      "Add more characters — aim for at least 12. Every extra character multiplies crack time exponentially.",
                "Length ≥ 16":      "Extend to 16+ characters. Length is the single biggest factor in password strength.",
                "Uppercase A-Z":    "Add at least one uppercase letter (A–Z) to expand the character pool.",
                "Lowercase a-z":    "Include lowercase letters to increase character variety.",
                "Numbers 0-9":      "Add at least one number (0–9) to increase entropy.",
                "Symbols !@#…":     "Add a symbol like ! @ # $ % ^ & * to dramatically increase crack resistance.",
                "No repeats (aaa)": "Avoid repeating the same character three times in a row (e.g. 'aaa').",
              };
              return (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ color: "#ffaa00", flexShrink: 0, marginTop: 2 }}>→</span>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#aaa", lineHeight: 1.7 }}>{tips[c.label] || c.label}</span>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid #111" }}>
            <motion.a href="/#generator" className="btn-primary" {...btnPrimary} style={{ fontSize: 13, padding: "12px 24px", animation: "none" }}>
              Generate a stronger password →
            </motion.a>
          </div>
        </div>
      )}

      {/* ── Perfect score ── */}
      {dna && dna.total >= 85 && (
        <div style={{ background: "#050f05", border: "1px solid #C8FF0033", borderRadius: 12, padding: "20px 28px", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: "50%", background: "rgba(200,255,0,0.12)", flexShrink: 0 }}><IcCheck size={22} color="#C8FF00" /></div>
          <div>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 16, color: "#C8FF00", marginBottom: 4 }}>This password passes all quality checks.</div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#888" }}>Make sure it's unique and stored in a password manager.</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StrengthCheckerPage() {
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);

  const schema = {
    "@context": "https://schema.org",
    "@type":    "WebApplication",
    "name":     "PassGeni Password Strength Checker",
    "description": "Check password strength instantly. Get entropy score, crack time estimates, DNA audit score, and specific improvement suggestions. 100% client-side.",
    "url":      "https://passgeni.ai/tools/strength-checker",
    "applicationCategory": "SecurityApplication",
    "offers":   { "@type": "Offer", "price": "0" },
  };

  return (
    <ToolPage
      title="Password Strength Checker — Entropy, Crack Time & DNA Score | PassGeni"
      description="Check password strength instantly. Entropy score, crack time estimate, 7-point DNA audit, and specific improvement tips. 100% client-side — nothing stored."
      canonical="https://passgeni.ai/tools/strength-checker"
      schema={schema}
      toolName="Strength Checker"
      testimonialKey="strength"
      eyebrow="Free security tool"
      headline="How strong is your password?"
      subheadline="Paste any password for an instant analysis: entropy in bits, estimated crack time, a 7-point DNA quality audit, and specific improvement suggestions."
    >
      {/* Input */}
      <div style={{ background: "#0a0a0c", border: "1px solid #141416", borderRadius: 16, padding: "28px", marginBottom: 24 }}>
        <label htmlFor="strength-input" style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>
          Paste your password
        </label>
        <div style={{ position: "relative" }}>
          <input
            id="strength-input"
            type={showPw ? "text" : "password"}
            placeholder="Enter any password to analyse…"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", background: "#060608", border: "1px solid #1e1e1e", borderRadius: 8, padding: "14px 48px 14px 18px", fontFamily: "var(--font-mono)", fontSize: 14, color: "#fff", outline: "none", boxSizing: "border-box" }}
            autoComplete="off"
          />
          <button
            onClick={() => setShowPw((v) => !v)}
            style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#555" }}
            aria-label={showPw ? "Hide" : "Show"}
          >{showPw ? <IcEyeOff size={18} color="#555" /> : <IcEye size={18} color="#555" />}</button>
        </div>
        {password && (
          <div style={{ display: "flex", gap: 4, marginTop: 10 }}>
            {[1,2,3,4].map((i) => (
              <div key={i} style={{ height: 2, flex: 1, borderRadius: 100, background: i <= getStrength(password).score ? getStrength(password).color : "#1a1a1a", transition: "background 0.3s" }} />
            ))}
          </div>
        )}
      </div>

      <StrengthMeter password={password} />

      {/* FAQ */}
      <div style={{ marginTop: 56 }}>
        <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 24, color: "#fff", marginBottom: 24, letterSpacing: "-0.02em" }}>
          Understanding password strength
        </h2>
        {[
          { q: "What is entropy and why does it matter?", a: "Entropy measures how unpredictable a password is, expressed in bits. A password with 60 bits of entropy requires 2^60 guesses to crack by brute force — about 1.1 quintillion attempts. Every additional character of random selection roughly doubles the entropy." },
          { q: "What crack time estimates are based on?", a: "Estimates assume a dedicated attacker using a modern GPU cluster capable of approximately 10 billion guesses per second — the realistic threat model for offline attacks on stolen credential databases. Online attacks are limited to a few thousand per second by rate limiting." },
          { q: "Why might a long password still score poorly?", a: "Length alone is not enough if the characters are predictable. 'aaaaaaaaaaaaaaaa' is 16 characters but has near-zero entropy because it contains only one character. Good passwords combine length with genuine randomness across multiple character classes." },
          { q: "What is the DNA Score?", a: "PassGeni's proprietary 7-point quality audit. It checks length thresholds (12+ and 16+ characters), presence of uppercase, lowercase, numbers, and symbols, and absence of triple-repeat patterns. Each check is weighted by security impact and combined into a 0–100 score graded A+ to C." },
          { q: "Does this tool prove compliance for an audit?", a: "Strength analysis shows whether a credential meets quality thresholds, but does not constitute audit evidence on its own. To obtain machine-verifiable proof for HIPAA, PCI-DSS, SOC 2, or ISO 27001 auditors, use the Credential Compliance Fixer and issue an ES256-signed compliance certificate." },
        ].map(({ q, a }, i) => (
          <div key={i} style={{ borderBottom: "1px solid #111", padding: "20px 0" }}>
            <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 16, color: "#fff", marginBottom: 10 }}>{q}</h3>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#aaa", lineHeight: 1.8, margin: 0 }}>{a}</p>
          </div>
        ))}
      </div>

      {/* Compliance linkage */}
      <div style={{ marginTop: 48, background: "#0a0a0c", border: "1px solid #1e1e22", borderRadius: 14, padding: "24px 28px" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#555", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 14 }}>
          From analysis to proof
        </div>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#777", lineHeight: 1.8, marginBottom: 18 }}>
          Strength analysis tells you a credential is strong. A{" "}
          <a href="/password-compliance-certificate" style={{ color: "#C8FF00", textDecoration: "none" }}>compliance certificate</a>
          {" "}tells your auditor it was generated correctly. Use the{" "}
          <a href="/tools/compliance-fixer" style={{ color: "#C8FF00", textDecoration: "none" }}>Credential Compliance Fixer</a>{" "}
          to check this credential against NIST, HIPAA, PCI-DSS, SOC 2, ISO 27001, or FIPS 140-3 and issue an ES256-signed certificate.
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a href="/tools/compliance-fixer" style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#C8FF00", background: "rgba(200,255,0,0.06)", border: "1px solid rgba(200,255,0,0.2)", borderRadius: 8, padding: "9px 16px", textDecoration: "none" }}>
            Compliance Fixer →
          </a>
          <a href="/glossary/entropy" style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#888", background: "#050507", border: "1px solid #1a1a1a", borderRadius: 8, padding: "9px 16px", textDecoration: "none" }}>
            What is entropy? →
          </a>
          <a href="/guides/nist-800-63b-password-guidelines" style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#888", background: "#050507", border: "1px solid #1a1a1a", borderRadius: 8, padding: "9px 16px", textDecoration: "none" }}>
            NIST 800-63B guide →
          </a>
        </div>
      </div>
    </ToolPage>
  );
}
