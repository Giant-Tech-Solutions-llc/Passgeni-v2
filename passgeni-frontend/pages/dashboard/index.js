// =============================================================
// PASSGENI — TEAM DASHBOARD
// passgeni.ai/dashboard
// =============================================================

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { btnPrimary, btnGhost } from "../../lib/motion.js";
import { useSession, signOut } from "next-auth/react";
import { useRouter }           from "next/router";
import PageLayout              from "../../components/layout/PageLayout.js";

// ─── HELPERS ─────────────────────────────────────────────────
function maskKey(prefix) { return `${prefix}••••••••••••••••••••`; }
function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function fmtShort(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}
function accent(pct) {
  return pct > 0.9 ? "#ff4444" : pct > 0.7 ? "#ffaa00" : "#C8FF00";
}

// ─── LOADING SKELETON ────────────────────────────────────────
function Skeleton({ w = "100%", h = 18, r = 6 }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: r,
      background: "linear-gradient(90deg,#111 25%,#1a1a1a 50%,#111 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.4s infinite",
    }} />
  );
}

// ─── 30-DAY BAR CHART ────────────────────────────────────────
function UsageBarChart({ data = [], limit }) {
  const [tooltip, setTooltip] = useState(null);

  if (!data.length) {
    return (
      <div style={{ height: 100, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <span style={{ fontSize: 22 }}>📊</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#333" }}>No usage data yet</span>
      </div>
    );
  }

  const W = 100, H = 64, GAP = 0.4, n = data.length;
  const barW   = (W - (n - 1) * GAP) / n;
  const maxVal = Math.max(...data.map((d) => d.total), 1);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <svg viewBox={`0 0 ${W} ${H + 14}`} preserveAspectRatio="none"
        style={{ width: "100%", height: 100, overflow: "visible", display: "block" }}>
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <line key={f} x1={0} y1={H - f * H} x2={W} y2={H - f * H} stroke="#161618" strokeWidth={0.3} />
        ))}
        {data.map((d, i) => {
          const x     = i * (barW + GAP);
          const pct   = d.total / (limit || 1);
          const barH  = Math.max(0.5, (d.total / maxVal) * H);
          const y     = H - barH;
          const col   = accent(pct);
          const today = i === n - 1;
          return (
            <rect key={i} x={x} y={y} width={barW} height={barH}
              fill={col} opacity={today ? 1 : 0.45} rx={0.5}
              style={{ cursor: "pointer", transition: "opacity .1s" }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = 1; setTooltip({ i, date: d.date, total: d.total, pct }); }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = today ? 1 : 0.45; setTooltip(null); }}
            />
          );
        })}
        {[0, Math.floor(n / 2)].map((i) => (
          <text key={i} x={i * (barW + GAP) + barW / 2} y={H + 11}
            textAnchor="middle" style={{ fontFamily: "monospace", fontSize: 4.5, fill: "#2e2e2e" }}>
            {fmtShort(data[i]?.date)}
          </text>
        ))}
        <text x={(n - 1) * (barW + GAP) + barW / 2} y={H + 11}
          textAnchor="middle" style={{ fontFamily: "monospace", fontSize: 4.5, fill: "#C8FF00" }}>
          today
        </text>
      </svg>
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            style={{ position: "absolute", top: 4, right: 4, background: "rgba(8,8,11,.97)", border: "1px solid #222", borderRadius: 8, padding: "8px 12px", pointerEvents: "none", zIndex: 10, backdropFilter: "blur(8px)" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#555", letterSpacing: ".08em", marginBottom: 3 }}>{tooltip.date}</div>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 20, color: accent(tooltip.pct), lineHeight: 1.1 }}>
              {tooltip.total.toLocaleString()}
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#555", marginTop: 2 }}>
              calls · {Math.round(tooltip.pct * 100)}% of limit
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── API KEY CARD ────────────────────────────────────────────
function ApiKeyCard({ apiKey, newRawKey, onRotate }) {
  const [revealed,    setRevealed]    = useState(!!newRawKey);
  const [copied,      setCopied]      = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [rotating,    setRotating]    = useState(false);
  const [rotateError, setRotateError] = useState("");
  const [freshKey,    setFreshKey]    = useState(newRawKey || null);

  const displayKey = freshKey ? (revealed ? freshKey : maskKey(apiKey.key_prefix)) : maskKey(apiKey.key_prefix);

  const copy = async () => {
    const toCopy = freshKey || maskKey(apiKey.key_prefix);
    try { await navigator.clipboard.writeText(toCopy); } catch (_) {}
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const doRotate = async () => {
    setRotating(true); setRotateError("");
    try {
      const res  = await fetch("/api/keys/rotate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ keyId: apiKey.id }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setFreshKey(data.newKey); setRevealed(true); setShowConfirm(false);
      if (onRotate) onRotate();
    } catch (e) { setRotateError(e.message || "Rotation failed"); }
    setRotating(false);
  };

  return (
    <div style={{ background: "rgba(8,8,11,.9)", border: `1px solid ${freshKey ? "rgba(200,255,0,.25)" : "rgba(255,255,255,.06)"}`, borderRadius: 12, overflow: "hidden", transition: "border-color .3s" }}>
      {/* Header row */}
      <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,.04)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: "linear-gradient(135deg,rgba(200,255,0,.15),rgba(200,255,0,.04))", border: "1px solid rgba(200,255,0,.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>🔑</div>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#aaa", letterSpacing: ".04em" }}>{apiKey.label || "Default API Key"}</span>
          {freshKey && (
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: "#000", background: "var(--accent)", borderRadius: 100, padding: "2px 8px", letterSpacing: ".08em", fontWeight: 700 }}>
              NEW — COPY NOW
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {freshKey && (
            <button onClick={() => setRevealed(v => !v)}
              style={{ background: "none", border: "1px solid rgba(255,255,255,.08)", borderRadius: 6, padding: "5px 12px", fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", cursor: "pointer", transition: "all .15s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(200,255,0,.2)"; e.currentTarget.style.color = "#C8FF00"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,.08)"; e.currentTarget.style.color = "#888"; }}>
              {revealed ? "Hide" : "Reveal"}
            </button>
          )}
          <button onClick={copy}
            style={{ background: copied ? "rgba(200,255,0,.08)" : "none", border: `1px solid ${copied ? "rgba(200,255,0,.25)" : "rgba(255,255,255,.08)"}`, borderRadius: 6, padding: "5px 12px", fontFamily: "var(--font-mono)", fontSize: 10, color: copied ? "#C8FF00" : "#888", cursor: "pointer", transition: "all .15s" }}>
            {copied ? "✓ Copied" : "Copy"}
          </button>
        </div>
      </div>

      {/* Key display */}
      <div style={{ padding: "14px 20px", background: "#050507", fontFamily: "var(--font-mono)", fontSize: 12, color: (freshKey && revealed) ? "#C8FF00" : "#3a3a3a", letterSpacing: ".06em", wordBreak: "break-all", lineHeight: 1.7 }}>
        {displayKey}
      </div>

      {/* Footer */}
      <div style={{ padding: "12px 20px", borderTop: "1px solid rgba(255,255,255,.04)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", gap: 16 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#444" }}>Created {fmtDate(apiKey.created_at)}</span>
          {apiKey.last_used_at && <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#444" }}>Last used {fmtDate(apiKey.last_used_at)}</span>}
        </div>
        {!showConfirm ? (
          <button onClick={() => setShowConfirm(true)}
            style={{ background: "none", border: "1px solid rgba(255,255,255,.06)", borderRadius: 6, padding: "5px 12px", fontFamily: "var(--font-mono)", fontSize: 10, color: "#555", cursor: "pointer", transition: "all .15s" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#ff6644"; e.currentTarget.style.borderColor = "rgba(255,68,68,.3)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#555"; e.currentTarget.style.borderColor = "rgba(255,255,255,.06)"; }}>
            Rotate key
          </button>
        ) : (
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "#ffaa44" }}>Old key invalidated immediately</span>
            <button onClick={() => setShowConfirm(false)} style={{ background: "none", border: "1px solid rgba(255,255,255,.06)", borderRadius: 5, padding: "4px 10px", fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", cursor: "pointer" }}>Cancel</button>
            <button onClick={doRotate} disabled={rotating} style={{ background: "rgba(255,68,68,.06)", border: "1px solid rgba(255,68,68,.25)", borderRadius: 5, padding: "4px 12px", fontFamily: "var(--font-mono)", fontSize: 10, color: "#ff6644", cursor: "pointer" }}>
              {rotating ? "Rotating…" : "Confirm"}
            </button>
          </div>
        )}
      </div>
      {rotateError && <div style={{ padding: "8px 20px 12px", fontFamily: "var(--font-body)", fontSize: 12, color: "#ff6644" }}>{rotateError}</div>}
    </div>
  );
}

// ─── TEAM MANAGER ────────────────────────────────────────────
function TeamManager({ members, onUpdate }) {
  const [email,   setEmail]   = useState("");
  const [name,    setName]    = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState("");

  const invite = async () => {
    if (!email.trim()) return;
    setLoading(true); setError(""); setSuccess("");
    try {
      const res  = await fetch("/api/keys/team", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "invite", email: email.trim(), name: name.trim() }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess(`Invitation sent to ${email}`); setEmail(""); setName("");
      if (onUpdate) onUpdate();
    } catch (e) { setError(e.message || "Invite failed. Please try again."); }
    setLoading(false);
  };

  const remove = async (memberId) => {
    try {
      await fetch("/api/keys/team", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "remove", memberId }) });
      if (onUpdate) onUpdate();
    } catch (e) { console.error(e); }
  };

  const activeMembers = members?.filter(m => m.status !== "removed") || [];
  const remaining     = Math.max(0, 5 - activeMembers.length - 1); // -1 for the owner

  const STATUS_COLOR  = { active: "#C8FF00", trialing: "#ffaa00", invited: "#aaa", past_due: "#ff4444" };
  const INPUT = { background: "rgba(8,8,11,.9)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 8, padding: "10px 14px", fontFamily: "var(--font-body)", fontSize: 13, color: "#fff", outline: "none", transition: "border-color .2s" };

  return (
    <div style={{ background: "rgba(10,10,13,.8)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 14, overflow: "hidden" }}>
      <div style={{ padding: "16px 22px", borderBottom: "1px solid rgba(255,255,255,.04)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", letterSpacing: ".12em", textTransform: "uppercase" }}>Team Members</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, background: "rgba(200,255,0,.08)", border: "1px solid rgba(200,255,0,.15)", color: "#C8FF00", borderRadius: 100, padding: "2px 8px" }}>
            {activeMembers.length + 1}/5 seats
          </span>
        </div>
        {remaining > 0 && (
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#555" }}>{remaining} seat{remaining !== 1 ? "s" : ""} available</span>
        )}
      </div>

      <div style={{ padding: "6px 0" }}>
        {activeMembers.length === 0 && (
          <div style={{ padding: "20px 22px", display: "flex", gap: 12, alignItems: "flex-start" }}>
            <span style={{ fontSize: 20 }}>👥</span>
            <div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#777", lineHeight: 1.6 }}>No team members yet.</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#444", marginTop: 2 }}>Invite up to 4 seats below — they&apos;ll get a magic link to the dashboard.</div>
            </div>
          </div>
        )}
        {activeMembers.map((m, i) => (
          <div key={m.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 22px", borderBottom: i < activeMembers.length - 1 ? "1px solid rgba(255,255,255,.03)" : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                background: "linear-gradient(135deg,rgba(200,255,0,.14),rgba(200,255,0,.04))",
                border: "1px solid rgba(200,255,0,.14)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 12, color: "rgba(200,255,0,.8)",
              }}>
                {(m.name || m.email || "?").slice(0, 1).toUpperCase()}
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#ccc", lineHeight: 1.2 }}>{m.name || m.email}</div>
                {m.name && <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#555", marginTop: 2 }}>{m.email}</div>}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".08em", textTransform: "uppercase",
                color: STATUS_COLOR[m.status] || "#888",
                background: `${STATUS_COLOR[m.status] || "#888"}12`,
                border: `1px solid ${STATUS_COLOR[m.status] || "#888"}30`,
                borderRadius: 100, padding: "2px 8px",
              }}>{m.role === "owner" ? "owner" : m.status}</span>
              {m.role !== "owner" && (
                <button onClick={() => remove(m.id)}
                  style={{ background: "none", border: "none", color: "#444", cursor: "pointer", fontSize: 14, padding: "2px 4px", transition: "color .15s", lineHeight: 1 }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#ff6644")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#444")}
                  title="Remove member">✕</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {remaining > 0 && (
        <div style={{ padding: "16px 22px", borderTop: "1px solid rgba(255,255,255,.04)" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
            <input type="text" placeholder="Name (optional)" value={name} onChange={e => setName(e.target.value)}
              style={{ ...INPUT, flex: "0 0 150px" }}
              onFocus={e => (e.currentTarget.style.borderColor = "rgba(200,255,0,.3)")}
              onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,.07)")} />
            <input type="email" placeholder="colleague@company.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && invite()}
              style={{ ...INPUT, flex: 1, minWidth: 160 }}
              onFocus={e => (e.currentTarget.style.borderColor = "rgba(200,255,0,.3)")}
              onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,.07)")} />
            <motion.button onClick={invite} disabled={loading || !email.trim()} className="btn-primary"
              {...btnPrimary}
              style={{ fontSize: 12, padding: "10px 18px", flexShrink: 0, opacity: !email.trim() ? 0.45 : 1 }}>
              {loading ? "Sending…" : "Invite →"}
            </motion.button>
          </div>
          {error   && <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#ff6644", margin: 0 }}>{error}</p>}
          {success && <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#C8FF00", margin: 0 }}>✓ {success}</p>}
        </div>
      )}
    </div>
  );
}

// ─── STAT CARD ────────────────────────────────────────────────
function StatCard({ label, value, sub, accent: ac, delay = 0, icon, trend }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut", delay }}
      style={{ background: "rgba(10,10,13,.8)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 14, padding: "20px 22px", position: "relative", overflow: "hidden" }}>
      {/* Subtle top shimmer */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${ac || "rgba(200,255,0,.12)"},transparent)`, pointerEvents: "none" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#555", letterSpacing: ".14em", textTransform: "uppercase" }}>{label}</span>
        {icon && <span style={{ fontSize: 16, opacity: .5 }}>{icon}</span>}
      </div>
      <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(22px,2.5vw,32px)", color: ac || "#fff", letterSpacing: "-.03em", lineHeight: 1, marginBottom: 6 }}>
        {value}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#555" }}>{sub}</span>
        {trend !== undefined && trend !== null && (
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: trend >= 0 ? "#C8FF00" : "#ff6644" }}>
            {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}%
          </span>
        )}
      </div>
    </motion.div>
  );
}

// ─── UPGRADE BANNER ──────────────────────────────────────────
function UpgradeBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      style={{
        background: "linear-gradient(135deg,rgba(200,255,0,.06) 0%,rgba(10,10,13,.9) 60%)",
        border: "1px solid rgba(200,255,0,.18)",
        borderRadius: 14, padding: "20px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 16, flexWrap: "wrap", marginBottom: 20,
        position: "relative", overflow: "hidden",
      }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,rgba(200,255,0,.35),transparent)", pointerEvents: "none" }} />
      <div>
        <div style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 14, color: "#fff", marginBottom: 4 }}>
          You&apos;re on the Free plan · 50 API calls/day
        </div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#666" }}>
          Upgrade to Team for 5,000 calls/day, 5 seats, compliance exports, and full API access.
        </div>
      </div>
      <motion.a href="/pricing" className="btn-primary" {...btnPrimary} style={{ whiteSpace: "nowrap", flexShrink: 0, fontSize: 12 }}>
        Upgrade to Team →
      </motion.a>
    </motion.div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────
export default function DashboardPage() {
  const router  = useRouter();
  const { data: session, status } = useSession();
  const [data,           setData]           = useState(null);
  const [loadError,      setLoadError]      = useState("");
  const [billingLoading, setBillingLoading] = useState(false);
  const [billingError,   setBillingError]   = useState("");
  const [newRawKey,      setNewRawKey]      = useState(null);

  // Detect new key from sessionStorage (set after key creation flow)
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("pg_new_api_key");
      if (stored) { setNewRawKey(stored); sessionStorage.removeItem("pg_new_api_key"); }
    } catch (_) {}
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/signin?callbackUrl=/dashboard");
  }, [status, router]);

  const fetchData = useCallback(async () => {
    setLoadError("");
    try {
      const res = await fetch("/api/dashboard/summary");
      if (!res.ok) throw new Error("Failed to load");
      setData(await res.json());
    } catch {
      setLoadError("Could not load dashboard data.");
    }
  }, []);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetchData();
    const params = new URLSearchParams(window.location.search);
    if (params.get("status") === "success") window.history.replaceState({}, "", "/dashboard");
  }, [status, fetchData]);

  const openBillingPortal = async () => {
    if (!data?.paddleCustomerId) return;
    setBillingLoading(true); setBillingError("");
    try {
      const res  = await fetch("/api/paddle/portal", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ customerId: data.paddleCustomerId }) });
      const json = await res.json();
      if (json.url) window.location.href = json.url;
      else throw new Error("No portal URL returned");
    } catch { setBillingError("Could not open billing portal. Contact hello@passgeni.ai"); }
    setBillingLoading(false);
  };

  // ── Loading ────────────────────────────────────────────────
  if (status === "loading" || (!data && !loadError)) {
    return (
      <PageLayout title="Dashboard — PassGeni" description="">
        <main style={{ maxWidth: 1100, margin: "0 auto", padding: "60px var(--page-pad) 100px" }}>
          {/* Header skeleton */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 36, flexWrap: "wrap", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Skeleton w={120} h={10} />
              <Skeleton w={280} h={32} r={8} />
              <Skeleton w={80} h={24} r={10} />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Skeleton w={90} h={40} r={8} />
              <Skeleton w={90} h={40} r={8} />
              <Skeleton w={90} h={40} r={8} />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginBottom: 16 }}>
            {[1,2,3,4].map(i => <Skeleton key={i} h={90} r={14} />)}
          </div>
          <Skeleton h={160} r={14} />
          <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
        </main>
      </PageLayout>
    );
  }

  // ── Error ──────────────────────────────────────────────────
  if (loadError) {
    return (
      <PageLayout title="Dashboard — PassGeni" description="">
        <main style={{ maxWidth: 480, margin: "0 auto", padding: "120px var(--page-pad)", textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 16 }}>⚠️</div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "#ff6644", marginBottom: 20 }}>{loadError}</div>
          <motion.button onClick={fetchData} className="btn-ghost" {...btnGhost} style={{ fontSize: 13 }}>Try again →</motion.button>
        </main>
      </PageLayout>
    );
  }

  const stats           = data.stats || {};
  const isTeam          = data.plan === "team";
  const activeMembers   = (data.teamMembers || []).filter(m => m.status !== "removed");
  const seatCount       = activeMembers.length + 1; // +1 for owner
  const usedPct         = data.usageLimit > 0 ? (data.usageToday / data.usageLimit) : 0;
  const utilisationStr  = `${Math.round(usedPct * 100)}% of limit`;
  const planSub         = isTeam ? "$29/month" : "Free forever";

  return (
    <PageLayout title="Dashboard — PassGeni Team" description="">
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "56px var(--page-pad) 100px" }}>

        {/* ── Header ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#555", letterSpacing: ".16em", textTransform: "uppercase", marginBottom: 8 }}>Dashboard</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              {/* Avatar */}
              <div style={{
                width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
                background: "linear-gradient(135deg,rgba(200,255,0,.2),rgba(200,255,0,.05))",
                border: "1px solid rgba(200,255,0,.2)",
                boxShadow: "0 0 20px rgba(200,255,0,.08)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 16, color: "rgba(200,255,0,.9)",
              }}>
                {(session?.user?.email || "U").slice(0, 1).toUpperCase()}
              </div>
              <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(18px,2.5vw,28px)", color: "#fff", letterSpacing: "-.02em", lineHeight: 1.1, margin: 0 }}>
                {data.name || session?.user?.email}
              </h1>
            </div>
            {/* Plan badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <span style={{
                fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 11,
                color: isTeam ? "#000" : "#888",
                background: isTeam ? "var(--accent)" : "rgba(255,255,255,.05)",
                border: isTeam ? "none" : "1px solid rgba(255,255,255,.08)",
                borderRadius: 8, padding: "5px 12px", letterSpacing: ".06em",
              }}>{isTeam ? "TEAM" : "FREE"}</span>
              {data.planStatus === "trialing" && (
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#ffaa00", background: "rgba(255,170,0,.08)", border: "1px solid rgba(255,170,0,.25)", borderRadius: 100, padding: "3px 10px", letterSpacing: ".08em" }}>
                  TRIAL · ends {fmtDate(data.trialEnd)}
                </span>
              )}
              {data.planStatus === "past_due" && (
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#ff4444", background: "rgba(255,68,68,.08)", border: "1px solid rgba(255,68,68,.25)", borderRadius: 100, padding: "3px 10px", letterSpacing: ".08em" }}>
                  ⚠ PAYMENT PAST DUE
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <motion.a href="/api-docs" className="btn-ghost" {...btnGhost} style={{ fontSize: 12, padding: "9px 16px" }}>API Docs</motion.a>
            {data.paddleCustomerId && (
              <motion.button onClick={openBillingPortal} disabled={billingLoading} className="btn-ghost"
                {...btnGhost}
                style={{ fontSize: 12, padding: "9px 16px", cursor: "pointer" }}>
                {billingLoading ? "Loading…" : "Billing →"}
              </motion.button>
            )}
            <button onClick={() => signOut({ callbackUrl: "/" })}
              style={{ background: "none", border: "1px solid rgba(255,255,255,.07)", borderRadius: 8, padding: "9px 16px", fontFamily: "var(--font-body)", fontSize: 12, color: "#555", cursor: "pointer", transition: "all .15s" }}
              onMouseEnter={e => { e.currentTarget.style.color = "#ff6644"; e.currentTarget.style.borderColor = "rgba(255,68,68,.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "#555"; e.currentTarget.style.borderColor = "rgba(255,255,255,.07)"; }}>
              Sign out
            </button>
          </div>
        </motion.div>

        {/* Billing error inline */}
        {billingError && (
          <div style={{ background: "rgba(255,68,68,.06)", border: "1px solid rgba(255,68,68,.2)", borderRadius: 10, padding: "12px 18px", marginBottom: 16, fontFamily: "var(--font-body)", fontSize: 13, color: "#ff6644", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {billingError}
            <button onClick={() => setBillingError("")} style={{ background: "none", border: "none", color: "#ff6644", cursor: "pointer", fontSize: 16 }}>×</button>
          </div>
        )}

        {/* ── Upgrade banner (free users) ──────────────────── */}
        {!isTeam && <UpgradeBanner />}

        {/* ── 4 stat cards ─────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginBottom: 12 }}>
          <StatCard label="Plan"        value={isTeam ? "Team" : "Free"} sub={planSub}           icon="◈" ac={isTeam ? "#C8FF00" : "#888"}  delay={0}    />
          <StatCard label="Daily limit" value={data.usageLimit.toLocaleString()} sub="API calls/day"  icon="⚡" delay={0.06} />
          <StatCard label="Used today"  value={data.usageToday.toLocaleString()} sub={utilisationStr} icon="📈" ac={accent(usedPct)} delay={0.12} />
          <StatCard label="Team seats"  value={`${seatCount}/5`} sub="including you" icon="👥" delay={0.18} />
        </div>

        {/* ── 30-day mini stats ────────────────────────────── */}
        {stats.totalCalls30d !== undefined && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 12 }}>
            {[
              { label: "Total (30d)",  value: stats.totalCalls30d?.toLocaleString() ?? "0" },
              { label: "Avg / day",    value: stats.avgDaily?.toLocaleString() ?? "0",  sub: "30-day avg" },
              { label: "Peak day",     value: stats.peakCalls?.toLocaleString() ?? "0", sub: stats.peakDay ? fmtShort(stats.peakDay) : "—" },
            ].map(({ label, value, sub }, i) => (
              <motion.div key={label}
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.06 }}
                style={{ background: "rgba(10,10,13,.8)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 12, padding: "16px 20px" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#555", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 20, color: "#fff", letterSpacing: "-.02em", lineHeight: 1 }}>
                  {value}
                  {sub && <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#555", fontWeight: 400, marginLeft: 8 }}>{sub}</span>}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* ── Usage bar + 30-day chart ─────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.26 }}
          style={{ background: "rgba(10,10,13,.8)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 14, padding: "22px 24px", marginBottom: 12 }}>
          {/* Today progress */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", letterSpacing: ".12em", textTransform: "uppercase" }}>API Usage Today</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#ccc" }}>
              {data.usageToday.toLocaleString()} <span style={{ color: "#444" }}>/ {data.usageLimit.toLocaleString()}</span>
            </span>
          </div>
          <div style={{ height: 5, background: "rgba(255,255,255,.05)", borderRadius: 100, overflow: "hidden", marginBottom: 8 }}>
            <motion.div
              initial={{ width: 0 }} animate={{ width: `${Math.min(usedPct * 100, 100)}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
              style={{ height: "100%", borderRadius: 100, background: accent(usedPct), boxShadow: `0 0 8px ${accent(usedPct)}66` }}
            />
          </div>
          <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#444" }}>
            {(data.usageLimit - data.usageToday).toLocaleString()} calls remaining today
          </span>

          {/* 30-day chart */}
          <div style={{ marginTop: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#555", letterSpacing: ".12em", textTransform: "uppercase" }}>Last 30 Days</span>
              <div style={{ display: "flex", gap: 12 }}>
                {[["#C8FF00", "≤70%"], ["#ffaa00", "70–90%"], ["#ff4444", ">90%"]].map(([col, lbl]) => (
                  <div key={lbl} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <div style={{ width: 6, height: 6, background: col, borderRadius: 2 }} />
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#555" }}>{lbl}</span>
                  </div>
                ))}
              </div>
            </div>
            <UsageBarChart data={data.usageMonth || data.usageWeek || []} limit={data.usageLimit} />
          </div>
        </motion.div>

        {/* ── API Keys + Team (2-col on wide) ──────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))", gap: 16, marginBottom: 16 }}>

          {/* API Keys */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 16, color: "#fff", letterSpacing: "-.01em", margin: 0 }}>API Keys</h2>
              <a href="/api-docs" style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#C8FF00", textDecoration: "none", letterSpacing: ".06em" }}>View docs →</a>
            </div>
            {data.keys?.length > 0 ? (
              data.keys.map((k) => (
                <div key={k.id} style={{ marginBottom: 10 }}>
                  <ApiKeyCard apiKey={k} newRawKey={newRawKey} onRotate={fetchData} />
                </div>
              ))
            ) : (
              <div style={{ background: "rgba(10,10,13,.8)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 14, padding: "28px", textAlign: "center" }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>🔑</div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#666", lineHeight: 1.7, margin: 0 }}>
                  No API key yet. Check your welcome email or contact{" "}
                  <a href="mailto:hello@passgeni.ai" style={{ color: "#C8FF00", textDecoration: "none" }}>hello@passgeni.ai</a>.
                </p>
              </div>
            )}
          </motion.div>

          {/* Team */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.38 }}>
            <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 16, color: "#fff", letterSpacing: "-.01em", marginBottom: 10 }}>Team</h2>
            <TeamManager members={data.teamMembers} onUpdate={fetchData} />
          </motion.div>
        </div>

        {/* ── Compliance presets ───────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.44 }}
          style={{ background: "rgba(10,10,13,.8)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 14, padding: "20px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
            <div>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#555", letterSpacing: ".14em", textTransform: "uppercase" }}>Compliance Presets</span>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#444", margin: "4px 0 0" }}>All active on your account — available in the generator.</p>
            </div>
            <a href="/#generator" style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#C8FF00", textDecoration: "none", letterSpacing: ".06em" }}>Open generator →</a>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[
              { label: "HIPAA",        c: "#4fc3f7", href: "/guides/hipaa-password-requirements" },
              { label: "PCI-DSS v4.0", c: "#ffb74d", href: "/guides/pci-dss-password-requirements" },
              { label: "SOC 2",        c: "#ce93d8", href: "/guides/soc2-password-requirements" },
              { label: "ISO 27001",    c: "#80cbc4", href: "/guides/iso-27001-password-requirements" },
              { label: "NIST 800-63B", c: "#a5d6a7", href: "/guides/nist-800-63b-password-guidelines" },
              { label: "DoD 8570",     c: "#ef9a9a", href: "/guides" },
            ].map(({ label, c, href }) => (
              <a key={label} href={href}
                style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: c, background: `${c}10`, border: `1px solid ${c}28`, borderRadius: 100, padding: "5px 14px", letterSpacing: ".08em", textDecoration: "none", transition: "all .15s", display: "inline-flex", alignItems: "center", gap: 5 }}
                onMouseEnter={e => { e.currentTarget.style.background = `${c}20`; e.currentTarget.style.borderColor = `${c}55`; }}
                onMouseLeave={e => { e.currentTarget.style.background = `${c}10`; e.currentTarget.style.borderColor = `${c}28`; }}>
                ✓ {label}
              </a>
            ))}
          </div>
        </motion.div>

      </main>

      <style>{`
        @keyframes shimmer {
          0%   { background-position:  200% 0 }
          100% { background-position: -200% 0 }
        }
      `}</style>
    </PageLayout>
  );
}

export async function getServerSideProps() { return { props: {} }; }
