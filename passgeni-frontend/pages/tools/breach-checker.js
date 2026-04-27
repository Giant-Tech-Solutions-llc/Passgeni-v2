// =============================================================
// PASSGENI — BREACH CHECKER
// passgeni.ai/tools/breach-checker
// =============================================================
// Uses HaveIBeenPwned k-anonymity API.
// Only the first 5 characters of the SHA-1 hash are ever sent.
// The actual password NEVER leaves the browser.
// =============================================================

import { useState } from "react";
import { motion } from "framer-motion";
import { btnPrimary } from "../../lib/motion.js";
import ToolPage from "../../components/tools/ToolPage.js";
import { IcAlert, IcCheck, IcEye, IcEyeOff } from "../../lib/icons.js";

// ─── SHA-1 HASH (client-side) ────────────────────────────────
async function sha1(str) {
  const buffer = await crypto.subtle.digest(
    "SHA-1",
    new TextEncoder().encode(str)
  );
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
}

// ─── CHECK PASSWORD AGAINST HIBP ────────────────────────────
// k-anonymity: sends only first 5 chars of hash, never the password
async function checkBreach(password) {
  const hash   = await sha1(password);
  const prefix = hash.slice(0, 5);   // sent to API
  const suffix = hash.slice(5);      // checked locally

  const response = await fetch(
    `https://api.pwnedpasswords.com/range/${prefix}`,
    { headers: { "Add-Padding": "true" } }
  );

  if (!response.ok) throw new Error("HIBP API unavailable");

  const text  = await response.text();
  const lines = text.split("\n");

  // Find if our suffix appears in the returned list
  for (const line of lines) {
    const [returnedSuffix, countStr] = line.trim().split(":");
    if (returnedSuffix === suffix) {
      return { breached: true, count: parseInt(countStr, 10) };
    }
  }
  return { breached: false, count: 0 };
}

// ─── BREACH RESULT DISPLAY ───────────────────────────────────
function BreachResult({ result, password }) {
  if (!result) return null;

  if (result.breached) {
    return (
      <div style={{ background: "#1a0505", border: "1px solid #ff444433", borderRadius: 12, padding: "24px 28px", animation: "fadeIn 0.3s ease" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
          <div style={{ flexShrink: 0, marginTop: 2 }}><IcAlert size={28} color="#ff4444" /></div>
          <div>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 20, color: "#ff4444", marginBottom: 8 }}>
              Compromised — Found in {result.count.toLocaleString()} breaches
            </div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#aaa", lineHeight: 1.8, marginBottom: 16 }}>
              This password appears in known data breach databases. Any account using it is at serious risk. Change it immediately on every site where you use it.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <motion.a href="/#generator" className="btn-primary" {...btnPrimary} style={{ fontSize: 13, padding: "10px 20px" }}>
                Generate a safe replacement →
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#050f05", border: "1px solid #C8FF0033", borderRadius: 12, padding: "24px 28px", animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
        <div style={{ flexShrink: 0, marginTop: 2, display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: "50%", background: "rgba(200,255,0,0.1)" }}><IcCheck size={22} color="#C8FF00" /></div>
        <div>
          <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 20, color: "#C8FF00", marginBottom: 8 }}>
            Not found in any known breach
          </div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#aaa", lineHeight: 1.8 }}>
            This password does not appear in the HaveIBeenPwned database of {" "}
            <strong style={{ color: "#ccc" }}>900 million+ compromised passwords</strong>.
            That is a good sign — but remember, a password can be weak without appearing in a breach database. Check the strength below.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── HOW IT WORKS EXPLAINER ──────────────────────────────────
function HowItWorks() {
  return (
    <div style={{ background: "#0a0a0c", border: "1px solid #141416", borderRadius: 12, padding: "24px 28px", marginTop: 32 }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
        How we protect your privacy
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {[
          { step: "01", text: "Your password is hashed using SHA-1 entirely in your browser. It never leaves your device as plaintext." },
          { step: "02", text: "Only the first 5 characters of that hash are sent to the HaveIBeenPwned API — not your password, not the full hash." },
          { step: "03", text: "The API returns all hash suffixes that match those 5 characters. Your browser checks locally if yours is among them." },
          { step: "04", text: "Result: we never know what you checked. HIBP never receives enough data to identify your password. This is k-anonymity." },
        ].map(({ step, text }) => (
          <div key={step} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#C8FF00", letterSpacing: "0.1em", flexShrink: 0, marginTop: 2 }}>{step}</span>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#aaa", lineHeight: 1.8, margin: 0 }}>{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN PAGE ───────────────────────────────────────────────
export default function BreachCheckerPage() {
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [result,   setResult]   = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleCheck = async () => {
    if (!password.trim()) return;
    setLoading(true);
    setResult(null);
    setError("");
    try {
      const res = await checkBreach(password);
      setResult(res);
    } catch (e) {
      setError("Could not reach the breach database. Please check your connection and try again.");
    }
    setLoading(false);
  };

  const schema = {
    "@context": "https://schema.org",
    "@type":    "WebApplication",
    "name":     "PassGeni Breach Checker",
    "description": "Check if your password has appeared in a data breach using k-anonymity. Your password never leaves your browser.",
    "url":      "https://passgeni.ai/tools/breach-checker",
    "applicationCategory": "SecurityApplication",
    "offers": { "@type": "Offer", "price": "0" },
  };

  return (
    <ToolPage
      title="Password Breach Checker — Has Your Password Been Hacked? | PassGeni"
      description="Check if your password has been exposed in a data breach. Uses k-anonymity — your password never leaves your browser. Checks against 900M+ compromised passwords."
      canonical="https://passgeni.ai/tools/breach-checker"
      schema={schema}
      toolName="Breach Checker"
      testimonialKey="breach"
      eyebrow="Free security tool"
      headline="Has your password been in a breach?"
      subheadline="Check against 900 million+ compromised passwords. Your password never leaves your browser — we use k-anonymity so even the checking service never sees it."
    >
      {/* ── Password input ── */}
      <div style={{ background: "#0a0a0c", border: "1px solid #141416", borderRadius: 16, padding: "28px", marginBottom: 20 }}>
        <label htmlFor="breach-input" style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>
          Enter any password to check
        </label>
        <div style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
          <div style={{ flex: 1, position: "relative" }}>
            <input
              id="breach-input"
              type={showPw ? "text" : "password"}
              placeholder="Paste your password here…"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setResult(null); }}
              onKeyDown={(e) => e.key === "Enter" && handleCheck()}
              style={{ width: "100%", background: "#060608", border: "1px solid #1e1e1e", borderRadius: 8, padding: "14px 48px 14px 18px", fontFamily: "var(--font-mono)", fontSize: 14, color: "#fff", outline: "none", boxSizing: "border-box" }}
            />
            <button
              onClick={() => setShowPw((v) => !v)}
              style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#555", transition: "color 0.15s" }}
              aria-label={showPw ? "Hide password" : "Show password"}
            >
              {showPw ? <IcEyeOff size={16} color="#555" /> : <IcEye size={16} color="#555" />}
            </button>
          </div>
          <motion.button
            className="btn-primary"
            {...btnPrimary}
            onClick={handleCheck}
            disabled={loading || !password.trim()}
            style={{ padding: "14px 28px", fontSize: 14, animation: "none", opacity: !password.trim() ? 0.5 : 1 }}
          >
            {loading ? "Checking…" : "Check →"}
          </motion.button>
        </div>

        {/* Zero knowledge notice */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#C8FF00", flexShrink: 0, display: "inline-block" }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#555", letterSpacing: "0.08em" }}>
            Your password never leaves your browser · k-anonymity via HaveIBeenPwned
          </span>
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div style={{ background: "#1a0a05", border: "1px solid #ff440022", borderRadius: 10, padding: "16px 20px", marginBottom: 20 }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#ff8844", margin: 0 }}>{error}</p>
        </div>
      )}

      {/* ── Result ── */}
      <BreachResult result={result} password={password} />

      {/* ── How it works ── */}
      <HowItWorks />

      {/* ── FAQ ── */}
      <div style={{ marginTop: 48 }}>
        <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 24, color: "#fff", marginBottom: 24, letterSpacing: "-0.02em" }}>
          Frequently asked questions
        </h2>
        {[
          { q: "Does PassGeni see my password?", a: "No. Your password is hashed in your browser using SHA-1. Only the first 5 characters of that hash — never the full hash, never the password — are sent anywhere. Even if someone intercepted the network request, they could not reconstruct your password from 5 characters of a hash." },
          { q: "What is k-anonymity?", a: "k-anonymity is a privacy technique where a query is designed so the response is identical for k different possible inputs. In this case, thousands of different passwords share the same 5-character hash prefix, so the API cannot determine which specific password you checked." },
          { q: "My password wasn't found — does that mean it's safe?", a: "Not necessarily. A password can be weak without appearing in breach databases. Common patterns like 'P@ssword1' or 'Summer2023!' may not appear in breach lists but would be cracked in seconds by a dictionary attack. Check the strength checker to evaluate quality, not just breach history." },
          { q: "What database does this check against?", a: "The HaveIBeenPwned database maintained by security researcher Troy Hunt. It contains over 900 million compromised passwords from hundreds of data breaches including LinkedIn, Adobe, RockYou, and many others." },
          { q: "Can breach check results be used as audit evidence?", a: "A breach check confirms a credential is not in known breach databases — a required control under NIST SP 800-63B and recommended under HIPAA and SOC 2. For full audit evidence (including entropy, generation method, and standard compliance), issue a compliance certificate via the Credential Compliance Fixer." },
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
          Breach-free isn't enough for auditors
        </div>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#777", lineHeight: 1.8, marginBottom: 18 }}>
          NIST SP 800-63B §5.1.1 requires checking credentials against known compromised lists — this tool satisfies that requirement. But auditors also need proof of generation method, entropy score, and standard compliance. Get a cryptographically signed{" "}
          <a href="/password-compliance-certificate" style={{ color: "#C8FF00", textDecoration: "none" }}>compliance certificate</a>{" "}
          via the{" "}
          <a href="/tools/compliance-fixer" style={{ color: "#C8FF00", textDecoration: "none" }}>Credential Compliance Fixer</a>.
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a href="/tools/compliance-fixer" style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#C8FF00", background: "rgba(200,255,0,0.06)", border: "1px solid rgba(200,255,0,0.2)", borderRadius: 8, padding: "9px 16px", textDecoration: "none" }}>
            Compliance Fixer →
          </a>
          <a href="/guides/nist-800-63b-password-guidelines" style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#888", background: "#050507", border: "1px solid #1a1a1a", borderRadius: 8, padding: "9px 16px", textDecoration: "none" }}>
            NIST 800-63B guide →
          </a>
          <a href="/glossary/credential-security" style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#888", background: "#050507", border: "1px solid #1a1a1a", borderRadius: 8, padding: "9px 16px", textDecoration: "none" }}>
            Credential security glossary →
          </a>
        </div>
      </div>
    </ToolPage>
  );
}
