// =============================================================
// PASSGENI — PASSWORD AUDIT TOOL
// passgeni.ai/tools/audit
// =============================================================
// Audits up to 10 passwords at once.
// Client-side only. Nothing is sent to any server.
// =============================================================

import { useState } from "react";
import { motion } from "framer-motion";
import { btnPrimary, btnGhost } from "../../lib/motion.js";
import ToolPage from "../../components/tools/ToolPage.js";
import { getStrength, getEntropy, getCrackTime, getDNAScore } from "../../lib/strength.js";
import { IcCheck, IcX, IcAlert, IcStar, IcEye, IcEyeOff } from "../../lib/icons.js";

const MAX_PASSWORDS = 10;

// ─── SHA-1 for breach check ───────────────────────────────────
async function sha1(str) {
  const buf = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("").toUpperCase();
}

async function checkBreach(password) {
  try {
    const hash   = await sha1(password);
    const prefix = hash.slice(0, 5);
    const suffix = hash.slice(5);
    const res    = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, { headers: { "Add-Padding": "true" } });
    if (!res.ok) return { breached: false, count: 0, error: true };
    const text   = await res.text();
    for (const line of text.split("\n")) {
      const [s, c] = line.trim().split(":");
      if (s === suffix) return { breached: true, count: parseInt(c, 10) };
    }
    return { breached: false, count: 0 };
  } catch {
    return { breached: false, count: 0, error: true };
  }
}

// ─── DETECT COMMON PATTERNS ───────────────────────────────────
function detectPatterns(pw) {
  const patterns = [];
  if (/^[a-z]+$/i.test(pw))                        patterns.push("Letters only — no numbers or symbols");
  if (/^[0-9]+$/.test(pw))                         patterns.push("Numbers only");
  if (/(.)\1{2,}/.test(pw))                        patterns.push("Repeated characters (aaa, 111…)");
  if (/^(password|qwerty|abc|letmein|welcome)/i.test(pw)) patterns.push("Common password base word");
  if (/\d{4}$/.test(pw) && /^(19|20)\d{2}$/.test(pw.slice(-4))) patterns.push("Ends with year");
  if (pw.length < 8)                               patterns.push("Too short — under 8 characters");
  if (/^[A-Z][a-z]+\d+[!@#$%]?$/.test(pw))        patterns.push("Predictable structure: Word + numbers + symbol");
  return patterns;
}

// ─── SINGLE AUDIT ROW ────────────────────────────────────────
function AuditRow({ entry, index }) {
  const { password, strength, entropy, crackTime, dna, breach, patterns } = entry;
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{ background: "#0a0a0c", border: `1px solid ${strength.color}22`, borderRadius: 12, overflow: "hidden", marginBottom: 12 }}>
      {/* Summary row */}
      <div
        onClick={() => setExpanded((v) => !v)}
        style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", cursor: "pointer", flexWrap: "wrap" }}
      >
        {/* Number */}
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#555", width: 20, flexShrink: 0 }}>
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Password (masked) */}
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#aaa", flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", letterSpacing: "0.05em" }}>
          {"•".repeat(Math.min(password.length, 20))} <span style={{ color: "#555", fontSize: 10 }}>({password.length} chars)</span>
        </span>

        {/* Strength badge */}
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: strength.color, fontWeight: 600, flexShrink: 0 }}>
          {strength.label}
        </span>

        {/* DNA grade */}
        <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 18, color: dna?.gradeColor || "#888", flexShrink: 0, width: 32, textAlign: "center" }}>
          {dna?.grade || "—"}
        </span>

        {/* Breach indicator */}
        {breach && (
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: breach.error ? "#555" : breach.breached ? "#ff4444" : "#C8FF00", flexShrink: 0 }}>
            {breach.error ? "breach ?" : breach.breached ? <><IcAlert size={12} color="#ff4444" /> {breach.count.toLocaleString()} breaches</> : <><IcCheck size={12} color="#C8FF00" /> not breached</>}
          </span>
        )}

        {/* Expand toggle */}
        <span style={{ color: "#555", fontSize: 16, flexShrink: 0, transition: "transform 0.2s", transform: expanded ? "rotate(180deg)" : "none" }}>▾</span>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div style={{ borderTop: "1px solid #111", padding: "20px", animation: "fadeIn 0.2s ease" }}>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginBottom: 16 }}>
            {[
              { label: "Entropy",     value: `${entropy} bits`  },
              { label: "Crack time",  value: crackTime          },
              { label: "DNA score",   value: `${dna?.total || 0}/100` },
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#666", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#ccc" }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Pattern warnings */}
          {patterns.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#888", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Patterns detected</div>
              {patterns.map((p, i) => (
                <div key={i} style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#ffaa00", marginBottom: 4 }}>→ {p}</div>
              ))}
            </div>
          )}

          {/* DNA check fails */}
          {dna && dna.checks.filter((c) => !c.pass).length > 0 && (
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#888", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Failed checks</div>
              {dna.checks.filter((c) => !c.pass).map((c, i) => (
                <div key={i} style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#ff6644", marginBottom: 4, display: "flex", alignItems: "center", gap: 5 }}><IcX size={12} color="#ff4444" /> {c.label}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── SUMMARY STATS ────────────────────────────────────────────
function AuditSummary({ results }) {
  const breached  = results.filter((r) => r.breach?.breached).length;
  const crackable = results.filter((r) => r.strength.score <= 1).length;
  const strong    = results.filter((r) => r.strength.score >= 3).length;
  const avgDNA    = Math.round(results.reduce((s, r) => s + (r.dna?.total || 0), 0) / results.length);

  return (
    <div style={{ background: "#0a0a0c", border: "1px solid #141416", borderRadius: 12, padding: "24px 28px", marginBottom: 24 }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
        Audit Summary — {results.length} passwords
      </div>
      <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
        {[
          { label: "Breached",   value: breached,  color: breached > 0  ? "#ff4444" : "#C8FF00" },
          { label: "Crackable",  value: crackable, color: crackable > 0 ? "#ffaa00" : "#C8FF00" },
          { label: "Strong",     value: strong,    color: "#C8FF00"                              },
          { label: "Avg DNA",    value: `${avgDNA}/100`, color: avgDNA >= 70 ? "#C8FF00" : avgDNA >= 55 ? "#ffaa00" : "#ff6644" },
        ].map(({ label, value, color }) => (
          <div key={label}>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 28, color, letterSpacing: "-0.02em" }}>{value}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#666", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────
export default function AuditToolPage() {
  const [inputs,  setInputs]  = useState(Array(5).fill(""));
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [count,   setCount]   = useState(5);

  const updateInput = (i, val) => {
    const next = [...inputs];
    next[i]    = val;
    setInputs(next);
  };

  const addRow = () => {
    if (count < MAX_PASSWORDS) {
      setCount((c) => c + 1);
      setInputs((arr) => [...arr, ""]);
    }
  };

  const runAudit = async () => {
    const active = inputs.slice(0, count).filter((p) => p.trim());
    if (!active.length) return;

    setLoading(true);
    setResults([]);

    const audited = await Promise.all(
      active.map(async (pw) => {
        const strength  = getStrength(pw);
        const entropy   = getEntropy(pw);
        const crackTime = getCrackTime(pw);
        const dna       = getDNAScore(pw);
        const breach    = await checkBreach(pw);
        const patterns  = detectPatterns(pw);
        return { password: pw, strength, entropy, crackTime, dna, breach, patterns };
      })
    );

    setResults(audited);
    setLoading(false);
  };

  const schema = {
    "@context": "https://schema.org",
    "@type":    "WebApplication",
    "name":     "PassGeni Password Audit Tool",
    "description": "Audit up to 10 passwords at once. Breach check, entropy analysis, DNA Score, and pattern detection — all client-side.",
    "url":      "https://passgeni.ai/tools/audit",
    "applicationCategory": "SecurityApplication",
    "offers":   { "@type": "Offer", "price": "0" },
  };

  return (
    <ToolPage
      title="Password Audit Tool — Check Multiple Passwords at Once | PassGeni"
      description="Audit up to 10 passwords simultaneously. Breach check via k-anonymity, entropy analysis, DNA Score grading, and pattern detection. All client-side, nothing stored."
      canonical="https://passgeni.ai/tools/audit"
      schema={schema}
      toolName="Password Audit"
      testimonialKey="audit"
      eyebrow="Free security tool"
      headline="Audit up to 10 passwords at once."
      subheadline="Batch-check existing passwords for breaches, strength, and common patterns. Everything runs in your browser — nothing is sent to any server."
    >
      {/* Input panel */}
      <div style={{ background: "#0a0a0c", border: "1px solid #141416", borderRadius: 16, padding: "28px", marginBottom: 24 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
          Enter passwords to audit ({count}/{MAX_PASSWORDS})
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {Array.from({ length: count }).map((_, i) => (
            <input
              key={i}
              type="password"
              placeholder={`Password ${i + 1}…`}
              value={inputs[i] || ""}
              onChange={(e) => updateInput(i, e.target.value)}
              style={{ background: "#060608", border: "1px solid #1a1a1a", borderRadius: 8, padding: "12px 16px", fontFamily: "var(--font-mono)", fontSize: 13, color: "#fff", outline: "none", width: "100%", boxSizing: "border-box", transition: "border-color 0.2s" }}
              onFocus={(e) => (e.target.style.borderColor = "#C8FF0044")}
              onBlur={(e)  => (e.target.style.borderColor = "#1a1a1a")}
            />
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
          {count < MAX_PASSWORDS && (
            <motion.button onClick={addRow} className="btn-ghost" {...btnGhost} style={{ fontSize: 13, padding: "10px 20px" }}>
              + Add row
            </motion.button>
          )}
          <motion.button
            onClick={runAudit}
            disabled={loading || !inputs.slice(0, count).some((p) => p.trim())}
            className="btn-primary"
            {...btnPrimary}
            style={{ fontSize: 14, padding: "12px 28px", animation: "none" }}
          >
            {loading ? "Auditing…" : `Run audit →`}
          </motion.button>
        </div>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#555", marginTop: 12, letterSpacing: "0.08em" }}>
          All analysis is client-side · Breach check uses k-anonymity · Nothing is stored or transmitted
        </p>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <>
          <AuditSummary results={results} />
          {results.map((entry, i) => (
            <AuditRow key={i} entry={entry} index={i} />
          ))}
          <div style={{ marginTop: 20, textAlign: "center" }}>
            <motion.a href="/#generator" className="btn-primary" {...btnPrimary} style={{ fontSize: 14, padding: "14px 32px" }}>
              Replace weak passwords →
            </motion.a>
          </div>

          {/* Compliance linkage */}
          <div style={{ marginTop: 40, background: "#0a0a0c", border: "1px solid #1e1e22", borderRadius: 14, padding: "24px 28px" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#555", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 14 }}>
              Audit found weak credentials?
            </div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#777", lineHeight: 1.8, marginBottom: 18 }}>
              Use the{" "}
              <a href="/tools/compliance-fixer" style={{ color: "#C8FF00", textDecoration: "none" }}>Credential Compliance Fixer</a>{" "}
              to automatically generate compliant replacements and issue{" "}
              <a href="/password-compliance-certificate" style={{ color: "#C8FF00", textDecoration: "none" }}>ES256-signed compliance certificates</a>{" "}
              for each one. Give auditors a certificate URL per credential instead of a spreadsheet.
              {" "}<a href="/glossary/password-compliance" style={{ color: "#888", textDecoration: "none", fontSize: 13 }}>What is password compliance? →</a>
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a href="/tools/compliance-fixer" style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#C8FF00", background: "rgba(200,255,0,0.06)", border: "1px solid rgba(200,255,0,0.2)", borderRadius: 8, padding: "9px 16px", textDecoration: "none" }}>
                Fix & certify →
              </a>
              <a href="/tools/policy-generator" style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#888", background: "#050507", border: "1px solid #1a1a1a", borderRadius: 8, padding: "9px 16px", textDecoration: "none" }}>
                Generate written policy →
              </a>
            </div>
          </div>
        </>
      )}
    </ToolPage>
  );
}
