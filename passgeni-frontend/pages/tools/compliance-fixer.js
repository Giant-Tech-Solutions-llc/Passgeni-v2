// =============================================================
// PASSGENI — COMPLIANCE FIXER TOOL
// passgeni.ai/tools/compliance-fixer
// =============================================================

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import ToolPage from "../../components/tools/ToolPage.js";
import { fadeUp } from "../../lib/motion.js";

// ─── CLIENT-SIDE ENTROPY CALCULATION ─────────────────────────
function calcEntropy(pwd) {
  if (!pwd) return 0;
  let pool = 0;
  if (/[a-z]/.test(pwd)) pool += 26;
  if (/[A-Z]/.test(pwd)) pool += 26;
  if (/[0-9]/.test(pwd)) pool += 10;
  if (/[^a-zA-Z0-9]/.test(pwd)) pool += 32;
  return pool > 0 ? Math.round(pwd.length * Math.log2(pool)) : 0;
}

function analyzeCredential(pwd) {
  if (!pwd) return null;
  const entropy = calcEntropy(pwd);
  const issues = [];

  if (pwd.length < 12)  issues.push({ code: "length",    msg: "Too short — minimum 12 characters for NIST/SOC2" });
  if (pwd.length < 16 && pwd.length >= 12) issues.push({ code: "length_priv", msg: "Below 16 characters — required for privileged/admin accounts" });
  if (!/[A-Z]/.test(pwd)) issues.push({ code: "upper",  msg: "No uppercase letters" });
  if (!/[a-z]/.test(pwd)) issues.push({ code: "lower",  msg: "No lowercase letters" });
  if (!/[0-9]/.test(pwd)) issues.push({ code: "digit",  msg: "No digits" });
  if (!/[^a-zA-Z0-9]/.test(pwd)) issues.push({ code: "symbol", msg: "No special characters — required by PCI-DSS v4.0 / SOC2" });
  if (/(.)\1{2,}/.test(pwd)) issues.push({ code: "repeat", msg: "Repeated characters detected — weak pattern" });
  if (/^[a-zA-Z]+\d{1,4}$/.test(pwd)) issues.push({ code: "pattern", msg: "Word + number suffix — common brute-force target" });

  const standards = [];
  if (entropy < 64 || pwd.length < 8)  standards.push("NIST 800-63B");
  if (entropy < 72 || pwd.length < 12) standards.push("SOC 2 CC6.1");
  if (issues.some(i => i.code === "symbol") || pwd.length < 12) standards.push("PCI-DSS v4.0");
  if (pwd.length < 12) standards.push("HIPAA §164.312");

  return { entropy, issues, failedStandards: standards, length: pwd.length };
}

// ─── CREDENTIAL GENERATOR ─────────────────────────────────────
const CHARS = {
  lower:  "abcdefghijklmnopqrstuvwxyz",
  upper:  "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  digits: "0123456789",
  symbols:"!@#$%^&*()-_=+[]{}|;:,.<>?",
};
const ALL_CHARS = CHARS.lower + CHARS.upper + CHARS.digits + CHARS.symbols;

function generateCompliant(targetLength = 20) {
  const arr = new Uint32Array(targetLength);
  crypto.getRandomValues(arr);
  const base = ALL_CHARS;
  let out = [
    CHARS.lower[arr[0]  % CHARS.lower.length],
    CHARS.upper[arr[1]  % CHARS.upper.length],
    CHARS.digits[arr[2] % CHARS.digits.length],
    CHARS.symbols[arr[3]% CHARS.symbols.length],
  ];
  for (let i = 4; i < targetLength; i++) {
    out.push(base[arr[i] % base.length]);
  }
  // Fisher-Yates shuffle
  const extra = new Uint32Array(targetLength);
  crypto.getRandomValues(extra);
  for (let i = out.length - 1; i > 0; i--) {
    const j = extra[i] % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out.join("");
}

// ─── ENTROPY BAR ──────────────────────────────────────────────
function EntropyBar({ bits, max = 160 }) {
  const pct   = Math.min(bits / max, 1);
  const color = bits >= 100 ? "#C8FF00" : bits >= 60 ? "#ffaa00" : "#ff4444";
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ height: 4, background: "#1a1a1a", borderRadius: 100, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct * 100}%`, background: color, borderRadius: 100, transition: "width .4s ease" }} />
      </div>
    </div>
  );
}

// ─── LOCK OVERLAY ─────────────────────────────────────────────
function LockOverlay({ onDismiss }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "absolute", inset: 0, zIndex: 10,
        background: "rgba(5,5,7,0.92)",
        borderRadius: 12,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        textAlign: "center", padding: "32px 24px",
        backdropFilter: "blur(4px)",
      }}
    >
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 28, marginBottom: 16 }}>🔒</div>
      <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 18, color: "#fff", marginBottom: 12, letterSpacing: "-0.02em" }}>
        Generate compliance-certified credential
      </div>
      <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#666", lineHeight: 1.8, marginBottom: 24, maxWidth: 320 }}>
        Unlock full fix + certification:
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28, width: "100%", maxWidth: 280 }}>
        {["SOC2 / HIPAA / PCI-DSS / NIST validation", "ES256-signed audit certificate", "Export compliance proof PDF"].map((item) => (
          <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, background: "#0a0a0c", border: "1px solid #1e1e20", borderRadius: 8, padding: "10px 14px" }}>
            <span style={{ color: "#C8FF00", fontSize: 12, flexShrink: 0 }}>✓</span>
            <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#888" }}>{item}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
        <a
          href="/dashboard/certify"
          style={{
            background: "#C8FF00", color: "#000", border: "none",
            borderRadius: 8, padding: "11px 24px",
            fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 13,
            textDecoration: "none", cursor: "pointer",
          }}
        >
          Certify credential →
        </a>
        <button
          onClick={onDismiss}
          style={{
            background: "transparent", border: "1px solid #1e1e20", color: "#555",
            borderRadius: 8, padding: "11px 20px",
            fontFamily: "var(--font-body)", fontSize: 13, cursor: "pointer",
          }}
        >
          Preview only
        </button>
      </div>
    </motion.div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────
const schema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Credential Compliance Fixer — PassGeni",
  "description": "Convert weak or non-compliant credentials into high-entropy, standards-aligned credentials. Analyzes entropy, detects compliance gaps, generates certified replacements.",
  "url": "https://passgeni.ai/tools/compliance-fixer",
  "applicationCategory": "SecurityApplication",
  "operatingSystem": "Any",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
};

export default function ComplianceFixerPage() {
  const { data: session } = useSession();
  const isPaid = session?.user?.plan && session.user.plan !== "free";

  const [input,        setInput]        = useState("");
  const [analysis,     setAnalysis]     = useState(null);
  const [fixed,        setFixed]        = useState("");
  const [showLock,     setShowLock]     = useState(false);
  const [copied,       setCopied]       = useState(false);
  const [certState,    setCertState]    = useState("idle"); // idle | loading | done | error
  const [certUrl,      setCertUrl]      = useState("");

  // Auto-analyze on input change
  useEffect(() => {
    const a = analyzeCredential(input);
    setAnalysis(a);
    setFixed("");
    setShowLock(false);
    setCertState("idle");
    setCertUrl("");
  }, [input]);

  const handleFix = useCallback(() => {
    if (!input) return;
    const targetLen = Math.max(20, (analysis?.length || 0) + 8);
    const generated = generateCompliant(targetLen);
    setFixed(generated);
    if (!isPaid) {
      setShowLock(true);
    }
  }, [input, analysis, isPaid]);

  const handleCertify = useCallback(async () => {
    if (!fixed || !isPaid) return;
    setCertState("loading");
    try {
      // Issue session for certificate
      const issueRes = await fetch("/api/issue-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          length: fixed.length,
          entropy: calcEntropy(fixed),
          compliance: "NIST-800-63B",
          mode: "certified",
        }),
      });
      if (!issueRes.ok) throw new Error("Session failed");
      const { session_id } = await issueRes.json();

      const certRes = await fetch("/api/generate-certificate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ generation_session_id: session_id }),
      });
      if (!certRes.ok) throw new Error("Cert failed");
      const { cert_url } = await certRes.json();
      setCertUrl(cert_url);
      setCertState("done");
    } catch {
      setCertState("error");
    }
  }, [fixed, isPaid]);

  const copyFixed = useCallback(() => {
    if (!fixed) return;
    navigator.clipboard.writeText(fixed).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }, [fixed]);

  const isCompliant = analysis && analysis.failedStandards.length === 0;
  const fixedEntropy = fixed ? calcEntropy(fixed) : 0;

  return (
    <ToolPage
      title="Credential Compliance Fixer — PassGeni"
      description="Paste any credential. Get instant entropy analysis and compliance gap detection. Generate a high-entropy replacement that satisfies SOC2, HIPAA, PCI-DSS, and NIST requirements."
      canonical="https://passgeni.ai/tools/compliance-fixer"
      schema={schema}
      toolName="Compliance Fixer"
      eyebrow="Compliance tool"
      headline="Fix non-compliant credentials."
      subheadline="Paste any credential to detect compliance gaps. Generate a certified replacement that satisfies SOC2, HIPAA, PCI-DSS v4.0, and NIST 800-63B."
      testimonialKey="fixer"
      showGeneratorCTA={false}
    >
      {/* ── SECTION 1: INPUT ────────────────────────────────── */}
      <motion.section {...fadeUp(0)} style={{ marginBottom: 24 }}>
        <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>
          Paste your credential
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste a password or credential to analyze…"
          spellCheck={false}
          autoComplete="off"
          rows={3}
          style={{
            width: "100%", boxSizing: "border-box",
            background: "#0a0a0c", border: "1px solid #1e1e20",
            borderRadius: 10, padding: "14px 16px",
            fontFamily: "var(--font-mono)", fontSize: 13, color: "#e0e0e0",
            resize: "none", outline: "none",
            lineHeight: 1.6,
          }}
          onFocus={(e)  => { e.currentTarget.style.borderColor = "#C8FF0044"; }}
          onBlur={(e)   => { e.currentTarget.style.borderColor = "#1e1e20"; }}
        />
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#444", marginTop: 6 }}>
          Analyzed entirely in your browser. Never transmitted.
        </div>
      </motion.section>

      {/* ── SECTION 2 & 3: ANALYSIS ─────────────────────────── */}
      <AnimatePresence>
        {analysis && input && (
          <motion.section
            key="analysis"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ marginBottom: 24 }}
          >
            <div style={{ background: "#0a0a0c", border: `1px solid ${isCompliant ? "#C8FF0033" : "#ff444433"}`, borderRadius: 12, padding: "20px 22px" }}>

              {/* Status line */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <span style={{ fontSize: 16 }}>{isCompliant ? "✅" : "❌"}</span>
                <span style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 14, color: isCompliant ? "#C8FF00" : "#ff4444" }}>
                  {isCompliant
                    ? "Compliant with all checked standards"
                    : `Not compliant with ${analysis.failedStandards.join(" / ")}`}
                </span>
              </div>

              {/* Entropy */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#555", letterSpacing: "0.12em", textTransform: "uppercase" }}>Entropy</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: analysis.entropy >= 80 ? "#C8FF00" : analysis.entropy >= 50 ? "#ffaa00" : "#ff4444" }}>
                    {analysis.entropy} bits
                  </span>
                </div>
                <EntropyBar bits={analysis.entropy} />
              </div>

              {/* Issues */}
              {analysis.issues.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {analysis.issues.map((issue) => (
                    <div key={issue.code} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                      <span style={{ color: "#ff4444", fontSize: 11, flexShrink: 0, marginTop: 1 }}>✕</span>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#777", lineHeight: 1.5 }}>{issue.msg}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Meta */}
              <div style={{ display: "flex", gap: 16, marginTop: 16, paddingTop: 14, borderTop: "1px solid #111" }}>
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#444", letterSpacing: "0.12em", textTransform: "uppercase" }}>Length</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#888", marginTop: 2 }}>{analysis.length} chars</div>
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#444", letterSpacing: "0.12em", textTransform: "uppercase" }}>Issues</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: analysis.issues.length ? "#ff4444" : "#C8FF00", marginTop: 2 }}>{analysis.issues.length}</div>
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#444", letterSpacing: "0.12em", textTransform: "uppercase" }}>Standards failing</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: analysis.failedStandards.length ? "#ff4444" : "#C8FF00", marginTop: 2 }}>{analysis.failedStandards.length}</div>
                </div>
              </div>
            </div>

            {/* Fix button */}
            {!isCompliant && (
              <button
                onClick={handleFix}
                style={{
                  marginTop: 14, width: "100%",
                  background: "#C8FF00", color: "#000", border: "none",
                  borderRadius: 9, padding: "13px 20px",
                  fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 14,
                  cursor: "pointer", letterSpacing: "-0.01em",
                }}
              >
                Fix this credential →
              </button>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      {/* ── SECTION 4: FIXED OUTPUT ─────────────────────────── */}
      <AnimatePresence>
        {fixed && (
          <motion.section
            key="fixed"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ marginBottom: 24, position: "relative" }}
          >
            <AnimatePresence>
              {showLock && !isPaid && (
                <LockOverlay onDismiss={() => setShowLock(false)} />
              )}
            </AnimatePresence>

            <div style={{ background: "#0a0a0c", border: "1px solid #1e1e20", borderRadius: 12, padding: "20px 22px" }}>

              {/* Before / After comparison */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#ff444488", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>Before</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#555", wordBreak: "break-all", lineHeight: 1.5, marginBottom: 6 }}>{input}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#ff4444" }}>{analysis?.entropy ?? 0} bits ❌</div>
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#C8FF0088", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>After</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#e0e0e0", wordBreak: "break-all", lineHeight: 1.5, marginBottom: 6, filter: showLock && !isPaid ? "blur(5px)" : "none" }}>{fixed}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#C8FF00" }}>{fixedEntropy} bits ✅</div>
                </div>
              </div>

              <div style={{ paddingTop: 14, borderTop: "1px solid #111", display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button
                  onClick={copyFixed}
                  disabled={showLock && !isPaid}
                  style={{
                    flex: 1, background: copied ? "#C8FF00" : "transparent",
                    color: copied ? "#000" : "#C8FF00",
                    border: "1px solid rgba(200,255,0,0.3)", borderRadius: 8,
                    padding: "10px 16px", fontFamily: "var(--font-body)", fontWeight: 700,
                    fontSize: 13, cursor: "pointer", transition: "all .15s",
                  }}
                >
                  {copied ? "Copied!" : "Copy fixed credential"}
                </button>

                {isPaid ? (
                  <button
                    onClick={handleCertify}
                    disabled={certState === "loading" || certState === "done"}
                    style={{
                      flex: 1, background: certState === "done" ? "#C8FF00" : "#0a0a0c",
                      color: certState === "done" ? "#000" : "#888",
                      border: "1px solid #1e1e20", borderRadius: 8,
                      padding: "10px 16px", fontFamily: "var(--font-body)", fontWeight: 700,
                      fontSize: 13, cursor: certState === "idle" ? "pointer" : "default",
                    }}
                  >
                    {certState === "idle"    && "Certify this credential →"}
                    {certState === "loading" && "Certifying…"}
                    {certState === "done"    && "Certificate issued ✓"}
                    {certState === "error"   && "Retry certification"}
                  </button>
                ) : (
                  <a
                    href="/dashboard/certify"
                    style={{
                      flex: 1, textAlign: "center", textDecoration: "none",
                      background: "#0a0a0c", color: "#888",
                      border: "1px solid #1e1e20", borderRadius: 8,
                      padding: "10px 16px", fontFamily: "var(--font-body)", fontWeight: 700,
                      fontSize: 13,
                    }}
                  >
                    Fix & Certify →
                  </a>
                )}
              </div>

              {/* Cert success */}
              {certState === "done" && certUrl && (
                <div style={{ marginTop: 14, padding: "12px 14px", background: "#C8FF0008", border: "1px solid #C8FF0022", borderRadius: 8 }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#C8FF00", letterSpacing: "0.1em", marginBottom: 6 }}>CERTIFICATE ISSUED</div>
                  <a href={certUrl} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#C8FF00", wordBreak: "break-all" }}>{certUrl}</a>
                </div>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ── SECTION 5: FREE USER CTA (no lock visible) ───────── */}
      {!fixed && !input && (
        <motion.div {...fadeUp(0.1)} style={{ marginTop: 8, padding: "18px 20px", background: "#0a0a0c", border: "1px solid #141416", borderRadius: 10 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#444", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>What this tool checks</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {["Length vs NIST / SOC2 / PCI-DSS requirements", "Character complexity and entropy bits", "Common patterns and repeated character sequences", "Compliance gap report per standard"].map((item) => (
              <div key={item} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span style={{ color: "#C8FF00", fontSize: 11, flexShrink: 0 }}>→</span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#666" }}>{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── CERTIFY LINK ─────────────────────────────────────── */}
      <motion.div {...fadeUp(0.15)} style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid #0e0e10", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#555" }}>
          Analysis only proves strength. A certificate proves compliance.
        </span>
        <a href="/dashboard/certify" style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#C8FF00", textDecoration: "none", letterSpacing: "0.08em" }}>
          → Certify this credential
        </a>
      </motion.div>
    </ToolPage>
  );
}
