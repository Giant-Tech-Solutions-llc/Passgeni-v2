/**
 * /dashboard/certs — User certificate dashboard
 * Lists all certificates, stats, and quick certify CTA.
 */

import { useState, useEffect, useCallback } from "react";
import { useSession, signIn } from "next-auth/react";
import Head from "next/head";
import Header from "../../components/layout/Header.js";
import Footer from "../../components/layout/Footer.js";
import UpgradeModal from "../../components/ui/UpgradeModal.js";

const STANDARD_LABELS = {
  nist:  "NIST SP 800-63B",
  hipaa: "HIPAA §164.312",
  pci:   "PCI-DSS v4.0",
  soc2:  "SOC 2 CC6.1",
  iso:   "ISO 27001:2022",
  fips:  "FIPS 140-3",
};

const STATUS_STYLE = {
  valid:   { color: "#00d084", bg: "rgba(0,208,132,0.1)",  border: "rgba(0,208,132,0.25)",  label: "Valid"   },
  revoked: { color: "#ff4444", bg: "rgba(255,68,68,0.1)",  border: "rgba(255,68,68,0.25)",  label: "Revoked" },
  expired: { color: "#facc15", bg: "rgba(250,204,21,0.1)", border: "rgba(250,204,21,0.25)", label: "Expired" },
};

function certStatus(cert) {
  if (cert.is_revoked) return "revoked";
  if (new Date(cert.expires_at) < new Date()) return "expired";
  return "valid";
}

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

/* ─── Certify flow ───────────────────────────────────────────────────────── */
function CertifyPanel({ onCertified, onPaywallHit }) {
  const [compliance, setCompliance] = useState("nist");
  const [length, setLength] = useState(16);
  const [opts, setOpts] = useState({ upper: true, lower: true, numbers: true, special: true });
  const [status, setStatus] = useState("idle"); // idle | requesting | certifying | done | error
  const [sessionToken, setSessionToken] = useState(null);
  const [sessionInfo, setSessionInfo] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const CHARSET = "abcdefghijklmnopqrstuvwxyz" +
    (opts.upper ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : "") +
    (opts.numbers ? "0123456789" : "") +
    (opts.special ? "!@#$%^&*" : "");

  const charPoolSize = CHARSET.length || 26;
  const entropyBits = Math.floor(length * Math.log2(charPoolSize));

  const requestSession = async () => {
    setStatus("requesting");
    setError(null);
    const r = await fetch("/api/issue-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        compliance_standard: compliance,
        length,
        has_upper: opts.upper,
        has_lower: opts.lower,
        has_numbers: opts.numbers,
        has_special: opts.special,
        entropy_bits: entropyBits,
        char_pool_size: charPoolSize,
      }),
    });
    const data = await r.json();
    if (!r.ok) { setError(data.error ?? "Failed to request session"); setStatus("idle"); return; }
    setSessionToken(data.session_token);
    setSessionInfo(data);
    setStatus("ready");
  };

  const certify = async () => {
    setStatus("certifying");
    setError(null);
    const r = await fetch("/api/generate-certificate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_token: sessionToken }),
    });
    const data = await r.json();
    if (r.status === 402) {
      setStatus("idle");
      onPaywallHit?.({ reason: data.code, used: data.used, limit: data.limit });
      return;
    }
    if (!r.ok) { setError(data.error ?? "Certificate generation failed"); setStatus("idle"); return; }
    setResult(data);
    setStatus("done");
    onCertified?.();
  };

  const STANDARDS = [
    { key: "nist",  label: "NIST SP 800-63B", tier: "free" },
    { key: "hipaa", label: "HIPAA",           tier: "paid" },
    { key: "pci",   label: "PCI-DSS v4",      tier: "paid" },
    { key: "soc2",  label: "SOC 2",           tier: "paid" },
    { key: "iso",   label: "ISO 27001",       tier: "paid" },
    { key: "fips",  label: "FIPS 140-3",      tier: "paid" },
  ];

  if (status === "done" && result) {
    return (
      <div style={{ padding: "28px 24px", background: "rgba(0,208,132,0.07)", border: "1px solid rgba(0,208,132,0.25)", borderRadius: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#00d084" }} />
          <span style={{ color: "#00d084", fontWeight: 700, fontSize: 14 }}>Certificate issued</span>
        </div>
        <div style={{ fontSize: 13, color: "#ccc", marginBottom: 18 }}>
          Standard: <strong style={{ color: "#fff" }}>{STANDARD_LABELS[result.compliance_standard]}</strong> · Entropy: {result.entropy_bits} bits
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <a href={result.cert_url} target="_blank" rel="noreferrer" style={{ background: "#c8ff00", color: "#000", fontWeight: 800, fontSize: 13, padding: "9px 18px", borderRadius: 7, textDecoration: "none" }}>
            View Certificate →
          </a>
          <button onClick={() => navigator.clipboard.writeText(result.cert_url)}
            style={{ background: "transparent", border: "1px solid var(--border)", color: "#ccc", fontSize: 13, padding: "9px 16px", borderRadius: 7, cursor: "pointer" }}>
            Copy URL
          </button>
          <button onClick={() => { setStatus("idle"); setResult(null); setSessionToken(null); setSessionInfo(null); }}
            style={{ background: "transparent", border: "none", color: "#666", fontSize: 13, cursor: "pointer" }}>
            + New
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", background: "#0a0a0c", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12 }}>
      <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 20 }}>Issue New Certificate</h3>

      {/* Standard selector */}
      <div style={{ marginBottom: 18 }}>
        <label style={{ fontSize: 11, color: "#555", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>COMPLIANCE STANDARD</label>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {STANDARDS.map(({ key, label, tier }) => (
            <button key={key} onClick={() => { setCompliance(key); setStatus("idle"); setSessionToken(null); }}
              style={{
                padding: "5px 11px", borderRadius: 6, fontSize: 12, cursor: "pointer",
                background: compliance === key ? "rgba(200,255,0,0.12)" : "transparent",
                border: `1px solid ${compliance === key ? "rgba(200,255,0,0.4)" : "rgba(255,255,255,0.1)"}`,
                color: compliance === key ? "#c8ff00" : tier === "paid" ? "#888" : "#ccc",
              }}>
              {label}{tier === "paid" ? " ★" : ""}
            </button>
          ))}
        </div>
      </div>

      {/* Length */}
      <div style={{ marginBottom: 18 }}>
        <label style={{ fontSize: 11, color: "#555", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>
          PASSWORD LENGTH — {length} characters
        </label>
        <input type="range" min={8} max={64} value={length}
          onChange={(e) => { setLength(+e.target.value); setStatus("idle"); setSessionToken(null); }}
          style={{ width: "100%", accentColor: "#c8ff00" }} />
      </div>

      {/* Options */}
      <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
        {[["upper", "A–Z"], ["lower", "a–z"], ["numbers", "0–9"], ["special", "!@#$"]].map(([k, l]) => (
          <button key={k} onClick={() => { setOpts((o) => ({ ...o, [k]: !o[k] })); setStatus("idle"); setSessionToken(null); }}
            style={{
              padding: "5px 11px", borderRadius: 6, fontSize: 12, cursor: "pointer",
              background: opts[k] ? "rgba(200,255,0,0.1)" : "transparent",
              border: `1px solid ${opts[k] ? "rgba(200,255,0,0.3)" : "rgba(255,255,255,0.1)"}`,
              color: opts[k] ? "#c8ff00" : "#666",
            }}>
            {l}
          </button>
        ))}
        <span style={{ marginLeft: "auto", fontSize: 11, color: "#555", alignSelf: "center" }}>
          {entropyBits} bits
        </span>
      </div>

      {/* Compliance check preview */}
      {sessionInfo && (
        <div style={{ marginBottom: 16, padding: "10px 14px", borderRadius: 8, background: sessionInfo.compliance_valid ? "rgba(0,208,132,0.07)" : "rgba(255,68,68,0.07)", border: `1px solid ${sessionInfo.compliance_valid ? "rgba(0,208,132,0.2)" : "rgba(255,68,68,0.2)"}`, fontSize: 12 }}>
          {sessionInfo.compliance_valid
            ? <span style={{ color: "#00d084" }}>✓ Meets {STANDARD_LABELS[compliance]} requirements</span>
            : <span style={{ color: "#ff9999" }}>{sessionInfo.gaps?.[0]}</span>}
        </div>
      )}

      {error && (
        <div style={{ marginBottom: 14, padding: "10px 14px", borderRadius: 8, background: "rgba(255,68,68,0.08)", border: "1px solid rgba(255,68,68,0.2)", fontSize: 12, color: "#ff9999" }}>
          {error}{" "}
          {error.includes("Upgrade") && <a href="/pricing" style={{ color: "#c8ff00" }}>Upgrade →</a>}
        </div>
      )}

      <div style={{ display: "flex", gap: 8 }}>
        {status !== "ready" ? (
          <button onClick={requestSession} disabled={status === "requesting"}
            style={{ flex: 1, padding: "10px 0", borderRadius: 8, background: "rgba(200,255,0,0.1)", border: "1px solid rgba(200,255,0,0.3)", color: "#c8ff00", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            {status === "requesting" ? "Validating…" : "Check Compliance"}
          </button>
        ) : (
          <button onClick={certify} disabled={status === "certifying"}
            style={{ flex: 1, padding: "10px 0", borderRadius: 8, background: "#c8ff00", border: "none", color: "#000", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>
            {status === "certifying" ? "Issuing…" : "Issue Certificate →"}
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function CertsDashboard() {
  const { data: session, status: authStatus } = useSession();
  const [certs, setCerts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(null);
  const [upgradeModal, setUpgradeModal] = useState(null); // null | { reason, used, limit }

  const fetchCerts = useCallback(async () => {
    setLoading(true);
    const r = await fetch("/api/dashboard/certs");
    if (r.ok) {
      const d = await r.json();
      setCerts(d.certs ?? []);
      setTotal(d.total ?? 0);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      signIn(undefined, { callbackUrl: "/dashboard/certs" });
    }
    if (authStatus === "authenticated") {
      fetchCerts();
    }
  }, [authStatus]);

  const copyUrl = (id) => {
    const base = window.location.origin;
    navigator.clipboard.writeText(`${base}/cert/${id}`).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 1800);
    });
  };

  if (authStatus === "loading" || (authStatus === "unauthenticated")) {
    return null;
  }

  const validCount = certs.filter((c) => certStatus(c) === "valid").length;
  const expiredCount = certs.filter((c) => certStatus(c) === "expired").length;

  const isTrialing = session?.user?.planStatus === "trialing";
  const trialDaysLeft = isTrialing && session.user.trialEnd
    ? Math.max(0, Math.ceil((new Date(session.user.trialEnd) - new Date()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <>
      <Head>
        <title>Certificates — PassGeni</title>
      </Head>

      <UpgradeModal
        open={!!upgradeModal}
        onClose={() => setUpgradeModal(null)}
        reason={upgradeModal?.reason}
        used={upgradeModal?.used}
        limit={upgradeModal?.limit}
      />

      <div style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
        <Header />
        <main style={{ maxWidth: 840, margin: "0 auto", padding: "48px 24px 80px" }}>

          {/* Trial banner */}
          {isTrialing && trialDaysLeft > 0 && (
            <div style={{
              marginBottom: 28,
              padding: "14px 20px",
              borderRadius: 10,
              background: "rgba(200,255,0,0.05)",
              border: "1px solid rgba(200,255,0,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
            }}>
              <div style={{ fontSize: 13, color: "#ccc" }}>
                <span style={{ color: "#c8ff00", fontWeight: 700 }}>{trialDaysLeft} day{trialDaysLeft !== 1 ? "s" : ""} left</span> on your free Assurance trial.
                Unlimited certs + all standards while active.
              </div>
              <a href="/pricing" style={{ fontSize: 12, fontWeight: 700, color: "#c8ff00", textDecoration: "none", border: "1px solid rgba(200,255,0,0.3)", padding: "6px 14px", borderRadius: 6, whiteSpace: "nowrap" }}>
                Upgrade to keep access →
              </a>
            </div>
          )}

          {/* Trial expired notice */}
          {isTrialing && trialDaysLeft === 0 && (
            <div style={{
              marginBottom: 28,
              padding: "14px 20px",
              borderRadius: 10,
              background: "rgba(255,68,68,0.07)",
              border: "1px solid rgba(255,68,68,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
            }}>
              <div style={{ fontSize: 13, color: "#ff9999" }}>
                Your Assurance trial has ended. You are now on the Free plan — 3 NIST certificates per month.
              </div>
              <a href="/pricing" style={{ fontSize: 12, fontWeight: 700, color: "#c8ff00", textDecoration: "none", border: "1px solid rgba(200,255,0,0.3)", padding: "6px 14px", borderRadius: 6, whiteSpace: "nowrap" }}>
                Upgrade →
              </a>
            </div>
          )}

          {/* top bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 40 }}>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em", color: "#fff", marginBottom: 6 }}>
                Compliance Certificates
              </h1>
              <p style={{ fontSize: 13, color: "#555" }}>
                {total} total · {validCount} active · {expiredCount} expired
              </p>
            </div>
          </div>

          {/* stats row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 36 }}>
            {[
              { label: "Total Issued",    value: total },
              { label: "Active",          value: validCount,  color: "#00d084" },
              { label: "Expiring Soon",   value: certs.filter((c) => {
                const d = new Date(c.expires_at);
                const diff = d - new Date();
                return diff > 0 && diff < 30 * 24 * 60 * 60 * 1000;
              }).length, warn: true },
              { label: "Revoked/Expired", value: certs.filter((c) => certStatus(c) !== "valid").length },
            ].map(({ label, value, color, warn }) => (
              <div key={label} style={{ background: "#0a0a0c", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "16px 18px" }}>
                <div style={{ fontSize: 24, fontWeight: 900, color: warn && value > 0 ? "#facc15" : (color ?? "#fff"), letterSpacing: "-0.03em" }}>{value}</div>
                <div style={{ fontSize: 11, color: "#555", marginTop: 3 }}>{label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 36, alignItems: "start" }}>
            {/* Issue panel */}
            <div style={{ gridColumn: "span 1" }}>
              <CertifyPanel
                onCertified={() => { fetchCerts(); }}
                onPaywallHit={(info) => setUpgradeModal(info)}
              />
            </div>

            {/* Quick guide */}
            <div style={{ padding: "20px", background: "#0a0a0c", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 14 }}>How certificates work</h3>
              {[
                ["1", "Select compliance standard + password parameters"],
                ["2", "Click Check Compliance — PassGeni validates server-side"],
                ["3", "Click Issue Certificate — signed ES256 JWT is created"],
                ["4", "Share the /cert URL with your auditor"],
              ].map(([n, text]) => (
                <div key={n} style={{ display: "flex", gap: 10, marginBottom: 10, fontSize: 12, color: "#888" }}>
                  <span style={{ color: "#c8ff00", flexShrink: 0, fontWeight: 700 }}>{n}</span>
                  <span>{text}</span>
                </div>
              ))}
              <div style={{ marginTop: 14, padding: "10px 12px", borderRadius: 8, background: "rgba(200,255,0,0.05)", border: "1px solid rgba(200,255,0,0.1)", fontSize: 11, color: "#666" }}>
                Your password is never stored or transmitted. Only the compliance parameters are signed.
              </div>
            </div>
          </div>

          {/* Certificate list */}
          <div>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 16, letterSpacing: "0.02em" }}>
              CERTIFICATE HISTORY
            </h2>

            {loading ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: "#444", fontSize: 13 }}>Loading…</div>
            ) : certs.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 0", color: "#333", fontSize: 14 }}>
                No certificates yet. Issue your first one above.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {certs.map((cert) => {
                  const st = certStatus(cert);
                  const stStyle = STATUS_STYLE[st];
                  return (
                    <div key={cert.id} style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto auto auto",
                      alignItems: "center",
                      gap: 12,
                      padding: "14px 18px",
                      background: "#0a0a0c",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: 10,
                    }}>
                      {/* info */}
                      <div>
                        <div style={{ fontSize: 13, color: "#fff", fontWeight: 600, marginBottom: 3 }}>
                          {STANDARD_LABELS[cert.compliance_standard] ?? cert.compliance_standard}
                        </div>
                        <div style={{ fontSize: 11, color: "#555" }}>
                          {cert.entropy_bits} bits · issued {fmtDate(cert.created_at)} · expires {fmtDate(cert.expires_at)}
                        </div>
                      </div>
                      {/* status */}
                      <span style={{
                        fontSize: 10, padding: "3px 9px", borderRadius: 99, fontWeight: 700,
                        background: stStyle.bg, border: `1px solid ${stStyle.border}`, color: stStyle.color,
                        letterSpacing: "0.07em", whiteSpace: "nowrap",
                      }}>
                        {stStyle.label.toUpperCase()}
                      </span>
                      {/* actions */}
                      <a href={`/cert/${cert.id}`} target="_blank" rel="noreferrer"
                        style={{ fontSize: 12, color: "#c8ff00", textDecoration: "none", whiteSpace: "nowrap" }}>
                        View →
                      </a>
                      <button onClick={() => copyUrl(cert.id)} style={{ background: "transparent", border: "none", color: "#555", fontSize: 12, cursor: "pointer", padding: "4px 8px" }}>
                        {copied === cert.id ? "✓" : "Copy"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
