/**
 * /dashboard/certify — Linear 3-step certificate generation flow
 * Step 1: Choose compliance standard
 * Step 2: Set generation parameters
 * Step 3: Generate & certify
 */

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import { motion, AnimatePresence } from "framer-motion";
import PageLayout from "../../components/layout/PageLayout.js";
import { IcCheck } from "../../lib/icons.js";

// ─── STANDARDS ────────────────────────────────────────────────────────────────
const STANDARDS = [
  { id: "NIST-800-63B", label: "NIST SP 800-63B",            tier: "free", minLen: 8,  requireSpecial: false, desc: "Digital Identity Guidelines. Length over complexity." },
  { id: "HIPAA",        label: "HIPAA §164.312(d)",           tier: "paid", minLen: 8,  requireSpecial: true,  desc: "Technical safeguards for ePHI access control." },
  { id: "PCI-DSS",      label: "PCI-DSS v4.0 Req 8.3",       tier: "paid", minLen: 12, requireSpecial: true,  desc: "Payment Card Industry security standard." },
  { id: "SOC2",         label: "SOC 2 CC6.1",                 tier: "paid", minLen: 12, requireSpecial: true,  desc: "Trust criterion for logical access controls." },
  { id: "ISO-27001",    label: "ISO/IEC 27001:2022 A.9",      tier: "paid", minLen: 12, requireSpecial: true,  desc: "Information security access control policy." },
  { id: "FIPS-140-3",   label: "FIPS PUB 140-3",              tier: "paid", minLen: 14, requireSpecial: true,  desc: "Security requirements for cryptographic modules." },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function charPool(opts) {
  let s = "abcdefghijklmnopqrstuvwxyz";
  if (opts.upper) s += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (opts.numbers) s += "0123456789";
  if (opts.special) s += "!@#$%^&*";
  return s;
}

function entropy(length, poolSize) {
  if (!poolSize) return 0;
  return parseFloat((length * Math.log2(poolSize)).toFixed(1));
}

function generatePassword(length, opts) {
  const pool = charPool(opts);
  if (!pool.length) return "";
  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  return Array.from(arr).map((n) => pool[n % pool.length]).join("");
}

// ─── STEP INDICATOR ──────────────────────────────────────────────────────────
function StepIndicator({ step, total = 3 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 40 }}>
      {Array.from({ length: total }, (_, i) => {
        const n = i + 1;
        const done = n < step;
        const active = n === step;
        return (
          <div key={n} style={{ display: "flex", alignItems: "center", flex: 1 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700,
              background: done ? "#c8ff00" : active ? "rgba(200,255,0,0.12)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${done ? "#c8ff00" : active ? "rgba(200,255,0,0.5)" : "rgba(255,255,255,0.1)"}`,
              color: done ? "#000" : active ? "#c8ff00" : "#555",
              transition: "all 0.2s",
            }}>
              {done ? <IcCheck size={13} color="#000" /> : n}
            </div>
            {n < total && (
              <div style={{
                flex: 1, height: 1,
                background: done ? "rgba(200,255,0,0.4)" : "rgba(255,255,255,0.06)",
                transition: "background 0.3s",
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── STEP 1 — CHOOSE STANDARD ────────────────────────────────────────────────
function Step1({ selected, onSelect, plan }) {
  const isPaid = plan && plan !== "free";
  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 6, letterSpacing: "-0.02em" }}>
        Choose compliance standard
      </h2>
      <p style={{ fontSize: 13, color: "#666", marginBottom: 24, lineHeight: 1.7 }}>
        Select the standard your password must meet. The certificate will certify compliance with this standard.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {STANDARDS.map((s) => {
          const locked = s.tier === "paid" && !isPaid;
          const active = selected === s.id;
          return (
            <button key={s.id}
              onClick={() => !locked && onSelect(s.id)}
              style={{
                display: "flex", alignItems: "flex-start", gap: 14,
                padding: "16px 18px",
                background: active ? "rgba(200,255,0,0.07)" : locked ? "rgba(255,255,255,0.01)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${active ? "rgba(200,255,0,0.4)" : "rgba(255,255,255,0.07)"}`,
                borderRadius: 10,
                cursor: locked ? "not-allowed" : "pointer",
                textAlign: "left",
                width: "100%",
                opacity: locked ? 0.45 : 1,
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => { if (!locked && !active) e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}
              onMouseLeave={(e) => { if (!locked && !active) e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}
            >
              <div style={{
                width: 18, height: 18, borderRadius: "50%", flexShrink: 0, marginTop: 1,
                border: `1px solid ${active ? "#c8ff00" : "rgba(255,255,255,0.15)"}`,
                background: active ? "#c8ff00" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {active && <IcCheck size={10} color="#000" />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: active ? "#fff" : "#ccc" }}>{s.label}</span>
                  {locked && <span style={{ fontSize: 9, color: "#facc15", background: "rgba(250,204,21,0.1)", border: "1px solid rgba(250,204,21,0.25)", padding: "2px 7px", borderRadius: 99, letterSpacing: "0.07em", flexShrink: 0 }}>PAID</span>}
                </div>
                <div style={{ fontSize: 12, color: "#555", lineHeight: 1.5 }}>{s.desc}</div>
              </div>
            </button>
          );
        })}
      </div>
      {!isPaid && (
        <div style={{ marginTop: 16, padding: "12px 16px", background: "rgba(250,204,21,0.05)", border: "1px solid rgba(250,204,21,0.15)", borderRadius: 8, fontSize: 12, color: "#666", lineHeight: 1.7 }}>
          Paid standards require the Assurance plan.{" "}
          <a href="/pricing" style={{ color: "#c8ff00", textDecoration: "none" }}>Upgrade →</a>
        </div>
      )}
    </div>
  );
}

// ─── STEP 2 — PARAMETERS ─────────────────────────────────────────────────────
function Step2({ standard, length, setLength, opts, setOpts }) {
  const std = STANDARDS.find((s) => s.id === standard);
  const pool = charPool(opts);
  const bits = entropy(length, pool.length);

  const strengthColor = bits >= 80 ? "#00d084" : bits >= 60 ? "#facc15" : "#ff6b6b";

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 6, letterSpacing: "-0.02em" }}>
        Set generation parameters
      </h2>
      <p style={{ fontSize: 13, color: "#666", marginBottom: 24, lineHeight: 1.7 }}>
        Parameters are embedded in the certificate. The password is generated in your browser and never sent to us.
      </p>

      {/* Length */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
          <label style={{ fontSize: 11, color: "#555", letterSpacing: "0.1em", fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>
            Length
          </label>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 18, fontWeight: 700, color: "#fff" }}>{length}</span>
        </div>
        <input type="range" min={std?.minLen ?? 8} max={64} value={length}
          onChange={(e) => setLength(+e.target.value)}
          style={{ width: "100%", accentColor: "#c8ff00" }} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
          <span style={{ fontSize: 10, color: "#333", fontFamily: "var(--font-mono)" }}>{std?.minLen ?? 8} min</span>
          <span style={{ fontSize: 10, color: "#333", fontFamily: "var(--font-mono)" }}>64 max</span>
        </div>
      </div>

      {/* Character options */}
      <div style={{ marginBottom: 24 }}>
        <label style={{ fontSize: 11, color: "#555", letterSpacing: "0.1em", fontFamily: "var(--font-mono)", textTransform: "uppercase", display: "block", marginBottom: 12 }}>
          Character types
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            ["upper",   "Uppercase A–Z",    true],
            ["lower",   "Lowercase a–z",    true],
            ["numbers", "Digits 0–9",       false],
            ["special", "Symbols !@#$%^&*", std?.requireSpecial],
          ].map(([key, label, required]) => {
            const on = opts[key];
            return (
              <button key={key}
                onClick={() => !required && setOpts((p) => ({ ...p, [key]: !p[key] }))}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 14px", borderRadius: 8,
                  background: on ? "rgba(200,255,0,0.07)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${on ? "rgba(200,255,0,0.3)" : "rgba(255,255,255,0.07)"}`,
                  cursor: required ? "default" : "pointer",
                  textAlign: "left",
                }}
              >
                <div style={{
                  width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                  background: on ? "#c8ff00" : "transparent",
                  border: `1px solid ${on ? "#c8ff00" : "rgba(255,255,255,0.15)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {on && <IcCheck size={10} color="#000" />}
                </div>
                <div>
                  <div style={{ fontSize: 12, color: on ? "#ccc" : "#555", lineHeight: 1.2 }}>{label}</div>
                  {required && <div style={{ fontSize: 9, color: "#facc15", marginTop: 2 }}>required</div>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Entropy preview */}
      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "14px 18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 11, color: "#555", fontFamily: "var(--font-mono)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Entropy</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 16, fontWeight: 700, color: strengthColor }}>{bits} bits</span>
        </div>
        <div style={{ height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 100, overflow: "hidden" }}>
          <motion.div
            animate={{ width: `${Math.min(bits / 128 * 100, 100)}%`, background: strengthColor }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{ height: "100%", borderRadius: 100 }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11, color: "#444", fontFamily: "var(--font-mono)" }}>
          <span>Pool: {pool.length} chars</span>
          <span>{bits >= 80 ? "Strong" : bits >= 60 ? "Acceptable" : "Weak"}</span>
        </div>
      </div>
    </div>
  );
}

// ─── STEP 3 — GENERATE & CERTIFY ─────────────────────────────────────────────
function Step3({ standard, length, opts, onDone, onUpgradeHit, atLimit }) {
  const [phase, setPhase]   = useState("idle"); // idle | generating | certifying | done | error
  const [password, setPassword] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [result, setResult]   = useState(null);
  const [error, setError]    = useState("");

  const std = STANDARDS.find((s) => s.id === standard);
  const pool = charPool(opts);
  const bits = entropy(length, pool.length);

  const run = useCallback(async () => {
    setPhase("generating");
    setError("");

    // Generate client-side
    const pw = generatePassword(length, opts);
    setPassword(pw);

    await new Promise((r) => setTimeout(r, 400));
    setPhase("certifying");

    // Get session token from server
    const sessRes = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        compliance_standard: standard,
        length,
        has_upper: opts.upper,
        has_lower: opts.lower,
        has_numbers: opts.numbers,
        has_special: opts.special,
        entropy_bits: bits,
        char_pool_size: pool.length,
      }),
    });

    const sessData = await sessRes.json();
    if (!sessRes.ok) {
      setError(sessData.error ?? "Failed to validate parameters.");
      setPhase("error");
      return;
    }

    // Generate certificate
    const certRes = await fetch("/api/generate-certificate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ generation_session_id: sessData.generation_session_id }),
    });

    const certData = await certRes.json();

    if (certRes.status === 402) {
      setPhase("idle");
      onUpgradeHit?.({ reason: certData.code, used: certData.used, limit: certData.limit });
      return;
    }

    if (!certRes.ok) {
      setError(certData.error ?? "Certificate generation failed.");
      setPhase("error");
      return;
    }

    setResult(certData);
    setPhase("done");
    onDone?.(certData);
  }, [standard, length, opts, bits, pool.length, onDone, onUpgradeHit]);

  if (phase === "done" && result) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ padding: "24px", background: "rgba(0,208,132,0.06)", border: "1px solid rgba(0,208,132,0.25)", borderRadius: 12, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#00d084" }} />
            <span style={{ fontWeight: 700, fontSize: 14, color: "#00d084" }}>Certificate issued</span>
          </div>
          <div style={{ fontSize: 13, color: "#aaa", marginBottom: 6, lineHeight: 1.6 }}>
            <strong style={{ color: "#fff" }}>{std?.label}</strong> · {result.entropy_bits} bits entropy
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#555", marginBottom: 18, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            ID: {result.cert_id}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <a href={result.cert_url} target="_blank" rel="noreferrer"
              style={{ background: "#c8ff00", color: "#000", fontWeight: 700, fontSize: 13, padding: "9px 20px", borderRadius: 7, textDecoration: "none" }}>
              View certificate →
            </a>
            <button onClick={() => navigator.clipboard.writeText(result.cert_url)}
              style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#ccc", fontSize: 13, padding: "9px 16px", borderRadius: 7, cursor: "pointer" }}>
              Copy URL
            </button>
          </div>
        </div>

        {/* Password reveal */}
        <div style={{ background: "#0a0a0c", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "16px 18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: "#555", fontFamily: "var(--font-mono)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Generated password</span>
            <button onClick={() => setRevealed((v) => !v)}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "#666", fontFamily: "var(--font-body)" }}>
              {revealed ? "Hide" : "Reveal"}
            </button>
          </div>
          {revealed ? (
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "#c8ff00", letterSpacing: "0.05em", wordBreak: "break-all", userSelect: "all" }}>
              {password}
            </div>
          ) : (
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "#333", letterSpacing: "0.1em" }}>
              {"•".repeat(Math.min(password.length, 24))}
            </div>
          )}
          <div style={{ marginTop: 10, fontSize: 11, color: "#444", lineHeight: 1.6 }}>
            Copy this password now. It is not stored anywhere — not by PassGeni, not in your browser after this session.
          </div>
        </div>

        <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
          <a href="/dashboard" style={{ fontSize: 13, color: "#c8ff00", textDecoration: "none" }}>← Back to dashboard</a>
          <span style={{ color: "#333" }}>·</span>
          <button onClick={() => { setPhase("idle"); setPassword(""); setResult(null); setRevealed(false); }}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#666", fontFamily: "var(--font-body)" }}>
            Issue another
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 6, letterSpacing: "-0.02em" }}>
        Generate & certify
      </h2>
      <p style={{ fontSize: 13, color: "#666", marginBottom: 24, lineHeight: 1.7 }}>
        The password is generated in your browser using <code style={{ fontFamily: "var(--font-mono)", fontSize: 11, background: "#111", padding: "1px 5px", borderRadius: 3 }}>crypto.getRandomValues</code> and is never transmitted to PassGeni.
      </p>

      {/* Summary */}
      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "16px 18px", marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: "#555", fontFamily: "var(--font-mono)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Summary</div>
        {[
          ["Standard", std?.label ?? standard],
          ["Length", `${length} characters`],
          ["Character pool", `${pool.length} chars (${[opts.upper && "A–Z", opts.lower && "a–z", opts.numbers && "0–9", opts.special && "symbols"].filter(Boolean).join(", ")})`],
          ["Entropy", `${bits} bits`],
        ].map(([k, v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: 13, gap: 12 }}>
            <span style={{ color: "#555" }}>{k}</span>
            <span style={{ color: "#ccc", textAlign: "right" }}>{v}</span>
          </div>
        ))}
      </div>

      {error && (
        <div style={{ padding: "12px 16px", background: "rgba(255,68,68,0.08)", border: "1px solid rgba(255,68,68,0.2)", borderRadius: 8, fontSize: 13, color: "#ff9999", marginBottom: 16 }}>
          {error}
        </div>
      )}

      {atLimit && (
        <div style={{
          padding: '12px 16px', borderRadius: 8,
          background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.25)',
          marginBottom: 12, fontSize: 13, color: '#ff8080', lineHeight: 1.5,
        }}>
          <strong style={{color:'#ff6b6b'}}>Monthly limit reached.</strong>{' '}
          You've used all 3 free certificates this month.{' '}
          <a href="/pricing" style={{color:'var(--accent)', fontWeight:600}}>
            Upgrade to Assurance →
          </a>
        </div>
      )}

      <button
        onClick={run}
        disabled={atLimit || phase === "generating" || phase === "certifying"}
        title={atLimit ? "Monthly limit reached — upgrade to Assurance for unlimited certificates" : undefined}
        style={{
          width: "100%",
          padding: "16px 24px",
          background: atLimit ? "rgba(200,255,0,0.1)" : phase === "idle" || phase === "error" ? "#c8ff00" : "rgba(200,255,0,0.2)",
          border: "none",
          borderRadius: 8,
          fontFamily: "var(--font-body)",
          fontWeight: 700,
          fontSize: 15,
          color: atLimit ? "#666" : phase === "idle" || phase === "error" ? "#000" : "#c8ff00",
          cursor: atLimit || phase === "generating" || phase === "certifying" ? "not-allowed" : "pointer",
          letterSpacing: "-0.01em",
          transition: "all 0.2s",
        }}
      >
        {phase === "generating" ? "Generating password…" : phase === "certifying" ? "Issuing certificate…" : "Generate & certify →"}
      </button>

      {(phase === "generating" || phase === "certifying") && (
        <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "#555" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#c8ff00", animation: "livePulse 1s infinite" }} />
          {phase === "generating" ? "Generating with crypto.getRandomValues…" : "Signing certificate with ES256…"}
        </div>
      )}
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function CertifyPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [step, setStep]   = useState(1);
  const [standard, setStandard] = useState("NIST-800-63B");
  const [length, setLength]   = useState(16);
  const [opts, setOpts]     = useState({ upper: true, lower: true, numbers: true, special: false });
  const [upgradeModal, setUpgradeModal] = useState(null);
  const [monthlyUsed, setMonthlyUsed] = useState(null);
  const [fetchedPlan, setFetchedPlan] = useState(null);
  const [certResult, setCertResult] = useState(null);
  const [showNps, setShowNps] = useState(false);
  const [npsRating, setNpsRating] = useState(null);
  const [npsSubmitted, setNpsSubmitted] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/signin?callbackUrl=/dashboard/certify");
  }, [status, router]);

  useEffect(() => {
    if (!session) return;
    fetch('/api/dashboard/compliance')
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d) {
          setMonthlyUsed(d.monthly_used ?? d.monthlyUsed ?? null);
          setFetchedPlan(d.plan ?? null);
        }
      })
      .catch(() => {});
  }, [session]);

  // Show NPS modal 1.5s after cert is issued (once per session)
  useEffect(() => {
    if (certResult && !sessionStorage.getItem("nps_shown")) {
      const t = setTimeout(() => setShowNps(true), 1500);
      return () => clearTimeout(t);
    }
  }, [certResult]);

  const submitNps = (rating) => {
    setNpsRating(rating);
    sessionStorage.setItem("nps_shown", "1");
    fetch("/api/nps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, cert_id: certResult?.cert_id }),
    }).catch(() => {});
    setTimeout(() => setNpsSubmitted(true), 300);
  };

  // Pre-select standard from ?standard= query param (e.g. from Quick Fix panel deep-link)
  useEffect(() => {
    if (!router.isReady) return;
    const { standard: qStandard } = router.query;
    if (!qStandard) return;
    const match = STANDARDS.find((s) => s.id === qStandard);
    if (!match) return;
    setStandard(match.id);
    if (match.requireSpecial) setOpts((p) => ({ ...p, special: true }));
    if (match.minLen && 16 < match.minLen) setLength(match.minLen);
    // Clean the query param from the URL without a page reload
    router.replace("/dashboard/certify", undefined, { shallow: true });
  }, [router.isReady, router.query.standard]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStandardSelect = (id) => {
    setStandard(id);
    const std = STANDARDS.find((s) => s.id === id);
    if (std?.requireSpecial) setOpts((p) => ({ ...p, special: true }));
    if (std?.minLen && length < std.minLen) setLength(std.minLen);
  };

  if (status === "loading" || status === "unauthenticated") return null;

  const plan = session?.user?.plan_type ?? session?.user?.plan ?? "free";
  const effectivePlan = fetchedPlan ?? plan;
  const FREE_LIMIT = 3;
  const atLimit = effectivePlan === 'free' && monthlyUsed !== null && monthlyUsed >= FREE_LIMIT;

  return (
    <PageLayout title="Issue Certificate — PassGeni" description="Generate a compliant password and issue a cryptographically signed compliance certificate.">
      <main style={{ maxWidth: 560, margin: "0 auto", padding: "60px var(--page-pad) 100px" }}>

        {/* Page heading */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#555", letterSpacing: ".16em", textTransform: "uppercase", marginBottom: 10 }}>
            Certificate Generation
          </div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(20px,3vw,28px)", color: "#fff", letterSpacing: "-0.03em", margin: 0, lineHeight: 1.1 }}>
            Issue a compliance certificate
          </h1>
        </div>

        <StepIndicator step={step} />

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            {step === 1 && (
              <Step1 selected={standard} onSelect={handleStandardSelect} plan={plan} />
            )}
            {step === 2 && (
              <Step2 standard={standard} length={length} setLength={setLength} opts={opts} setOpts={setOpts} />
            )}
            {step === 3 && (
              <Step3
                standard={standard}
                length={length}
                opts={opts}
                atLimit={atLimit}
                onDone={(data) => setCertResult(data)}
                onUpgradeHit={(info) => {
                  setUpgradeModal(info);
                  setStep(1);
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        {step < 3 && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 32 }}>
            {step > 1 ? (
              <button onClick={() => setStep((s) => s - 1)}
                style={{ background: "none", border: "1px solid rgba(255,255,255,0.08)", color: "#666", padding: "9px 18px", borderRadius: 7, cursor: "pointer", fontFamily: "var(--font-body)", fontSize: 13 }}>
                ← Back
              </button>
            ) : (
              <a href="/dashboard" style={{ fontSize: 13, color: "#555", textDecoration: "none" }}>← Dashboard</a>
            )}
            <button
              onClick={() => setStep((s) => s + 1)}
              style={{ background: "#c8ff00", color: "#000", fontWeight: 700, fontSize: 13, padding: "10px 24px", borderRadius: 7, border: "none", cursor: "pointer", fontFamily: "var(--font-body)", letterSpacing: "-0.01em" }}
            >
              {step === 1 ? "Set parameters →" : "Review & certify →"}
            </button>
          </div>
        )}

        {/* NPS post-cert survey modal */}
        <AnimatePresence>
          {showNps && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "fixed", inset: 0, zIndex: 999,
                background: "rgba(5,5,7,0.82)", backdropFilter: "blur(6px)",
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "0 20px",
              }}
              onClick={(e) => { if (e.target === e.currentTarget) setShowNps(false); }}
            >
              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                style={{
                  width: "100%", maxWidth: 440,
                  background: "#0e0e11", border: "1px solid rgba(255,255,255,0.09)",
                  borderRadius: 14, padding: "28px 28px 24px",
                }}
              >
                {npsSubmitted ? (
                  <div style={{ textAlign: "center", padding: "12px 0" }}>
                    <div style={{ fontSize: 28, marginBottom: 12 }}>🎉</div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: "#fff", marginBottom: 6 }}>Thanks for the feedback!</div>
                    <div style={{ fontSize: 13, color: "#555" }}>It helps us improve PassGeni.</div>
                    <button
                      onClick={() => setShowNps(false)}
                      style={{ marginTop: 20, background: "#c8ff00", color: "#000", fontWeight: 700, fontSize: 13, padding: "9px 22px", borderRadius: 7, border: "none", cursor: "pointer", fontFamily: "var(--font-body)" }}
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 15, color: "#fff", marginBottom: 4 }}>How likely are you to recommend PassGeni?</div>
                        <div style={{ fontSize: 12, color: "#555" }}>0 = Not at all · 10 = Definitely</div>
                      </div>
                      <button
                        onClick={() => setShowNps(false)}
                        style={{ background: "none", border: "none", color: "#444", fontSize: 18, cursor: "pointer", lineHeight: 1, padding: "0 0 0 12px" }}
                        aria-label="Close"
                      >×</button>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(11, 1fr)", gap: 5, marginBottom: 10 }}>
                      {Array.from({ length: 11 }, (_, i) => (
                        <button
                          key={i}
                          onClick={() => submitNps(i)}
                          style={{
                            aspectRatio: "1", borderRadius: 6,
                            background: npsRating === i ? "#c8ff00" : "rgba(255,255,255,0.04)",
                            border: `1px solid ${npsRating === i ? "#c8ff00" : "rgba(255,255,255,0.08)"}`,
                            color: npsRating === i ? "#000" : "#888",
                            fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700,
                            cursor: "pointer",
                            transition: "all 0.12s",
                          }}
                          onMouseEnter={(e) => { if (npsRating !== i) { e.currentTarget.style.borderColor = "rgba(200,255,0,0.4)"; e.currentTarget.style.color = "#c8ff00"; }}}
                          onMouseLeave={(e) => { if (npsRating !== i) { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#888"; }}}
                        >
                          {i}
                        </button>
                      ))}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#333", fontFamily: "var(--font-mono)", marginTop: 4 }}>
                      <span>Not likely</span>
                      <span>Very likely</span>
                    </div>
                    <div style={{ marginTop: 16, fontSize: 11, color: "#333", textAlign: "center" }}>
                      Select a rating to submit · takes 3 seconds
                    </div>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upgrade prompt */}
        {upgradeModal && (
          <div style={{ marginTop: 24, padding: "16px 20px", background: "rgba(200,255,0,0.05)", border: "1px solid rgba(200,255,0,0.2)", borderRadius: 10 }}>
            <div style={{ fontSize: 13, color: "#ccc", marginBottom: 12, lineHeight: 1.6 }}>
              {upgradeModal.reason === "LIMIT_REACHED"
                ? `You've used all ${upgradeModal.limit} free certificates this month.`
                : "This standard requires the Assurance plan."}
            </div>
            <a href="/pricing" style={{ background: "#c8ff00", color: "#000", fontWeight: 700, fontSize: 13, padding: "8px 18px", borderRadius: 6, textDecoration: "none" }}>
              Upgrade to Assurance →
            </a>
            <button onClick={() => setUpgradeModal(null)}
              style={{ background: "none", border: "none", color: "#555", fontSize: 13, marginLeft: 12, cursor: "pointer", fontFamily: "var(--font-body)" }}>
              Dismiss
            </button>
          </div>
        )}

      </main>
    </PageLayout>
  );
}

export async function getServerSideProps() { return { props: {} }; }
