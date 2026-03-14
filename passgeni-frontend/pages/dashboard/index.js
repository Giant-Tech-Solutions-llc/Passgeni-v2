// =============================================================
// PASSGENI — TEAM DASHBOARD  (Phase 6 — analytics charts)
// passgeni.ai/dashboard
// =============================================================
// Phase 6 changes:
//   - 30-day usage bar chart (SVG, gap-filled, hover tooltips)
//   - Stats summary row (total calls, peak day, avg/day, utilisation)
//   - 3 analytics mini-stat cards above chart
//   - All email events wired via lib/email/templates.js
// =============================================================

import { useState, useEffect, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter }           from "next/router";
import PageLayout              from "../../components/layout/PageLayout.js";

// ─── HELPERS ─────────────────────────────────────────────────
function maskKey(prefix) { return `${prefix}••••••••••••••••`; }

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

// ─── 30-DAY BAR CHART ────────────────────────────────────────
function UsageBarChart({ data = [], limit }) {
  const [tooltip, setTooltip] = useState(null);

  if (!data.length) {
    return (
      <div style={{ height: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#333" }}>No usage data yet</span>
      </div>
    );
  }

  const W      = 100;
  const H      = 72;
  const GAP    = 0.4;
  const n      = data.length;
  const barW   = (W - (n - 1) * GAP) / n;
  const maxVal = Math.max(...data.map((d) => d.total), 1);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <svg viewBox={`0 0 ${W} ${H + 14}`} preserveAspectRatio="none"
        style={{ width: "100%", height: 120, overflow: "visible", display: "block" }}>

        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <line key={f} x1={0} y1={H - f * H} x2={W} y2={H - f * H} stroke="#181818" strokeWidth={0.3} />
        ))}

        {/* Bars */}
        {data.map((d, i) => {
          const x      = i * (barW + GAP);
          const pct    = d.total / limit;
          const barH   = Math.max(0.5, (d.total / maxVal) * H);
          const y      = H - barH;
          const col    = accent(pct);
          const today  = i === n - 1;
          return (
            <rect key={i} x={x} y={y} width={barW} height={barH}
              fill={col} opacity={today ? 1 : 0.5} rx={0.4}
              style={{ cursor: "pointer", transition: "opacity 0.1s" }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = 1; setTooltip({ i, date: d.date, total: d.total, pct }); }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = today ? 1 : 0.5; setTooltip(null); }}
            />
          );
        })}

        {/* X-axis: first / middle / last / today */}
        {[0, Math.floor(n / 2)].map((i) => (
          <text key={i} x={i * (barW + GAP) + barW / 2} y={H + 11}
            textAnchor="middle" style={{ fontFamily: "monospace", fontSize: 5, fill: "#3a3a3a" }}>
            {fmtShort(data[i]?.date)}
          </text>
        ))}
        <text x={(n - 1) * (barW + GAP) + barW / 2} y={H + 11}
          textAnchor="middle" style={{ fontFamily: "monospace", fontSize: 5, fill: "#C8FF00" }}>
          today
        </text>
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div style={{ position: "absolute", top: 4, right: 4, background: "#111", border: "1px solid #222", borderRadius: 6, padding: "6px 10px", pointerEvents: "none", zIndex: 10 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#666", letterSpacing: "0.08em" }}>{tooltip.date}</div>
          <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 18, color: accent(tooltip.pct), lineHeight: 1.1 }}>
            {tooltip.total.toLocaleString()}
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#555" }}>
            calls · {Math.round(tooltip.pct * 100)}% of limit
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 7-DAY SPARKLINE ─────────────────────────────────────────
function UsageSparkline({ data, limit }) {
  if (!data?.length) {
    return (
      <div style={{ height: 48, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#333" }}>No data yet</span>
      </div>
    );
  }
  const W    = 280;
  const H    = 48;
  const max  = Math.max(...data.map((d) => d.total), 1);
  const barW = Math.max(4, Math.floor((W - (data.length - 1) * 3) / data.length));
  return (
    <svg width={W} height={H} style={{ overflow: "visible" }}>
      {data.map((d, i) => {
        const barH = Math.max(3, (d.total / max) * (H - 8));
        const x    = i * (barW + 3);
        const col  = accent(d.total / limit);
        return (
          <g key={i}>
            <rect x={x} y={H - barH} width={barW} height={barH} fill={col} opacity={0.8} rx={1} />
            <title>{d.date}: {d.total} calls</title>
          </g>
        );
      })}
    </svg>
  );
}

// ─── TODAY'S USAGE BAR ───────────────────────────────────────
function TodayUsageBar({ used, limit }) {
  const pct = Math.min((used / limit) * 100, 100);
  const col = accent(used / limit);
  return (
    <div style={{ background: "#0a0a0c", border: "1px solid #141416", borderRadius: 14, padding: "22px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", letterSpacing: "0.12em", textTransform: "uppercase" }}>API Usage Today</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#ccc" }}>{used.toLocaleString()} / {limit.toLocaleString()}</span>
      </div>
      <div style={{ height: 6, background: "#141416", borderRadius: 100, overflow: "hidden", marginBottom: 8 }}>
        <div style={{ height: "100%", width: `${pct}%`, background: col, borderRadius: 100, transition: "width 1s cubic-bezier(.16,1,.3,1)" }} />
      </div>
      <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#555" }}>
        {(limit - used).toLocaleString()} calls remaining today
      </span>
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

  const copy = async () => {
    await navigator.clipboard.writeText(freshKey || maskKey(apiKey.key_prefix));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const doRotate = async () => {
    setRotating(true); setRotateError("");
    try {
      const res  = await fetch("/api/keys/rotate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body:   JSON.stringify({ keyId: apiKey.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setFreshKey(data.newKey); setRevealed(true); setShowConfirm(false);
      if (onRotate) onRotate();
    } catch (e) { setRotateError(e.message || "Rotation failed"); }
    setRotating(false);
  };

  return (
    <div style={{ background: "#0a0a0c", border: `1px solid ${freshKey ? "#C8FF0044" : "#141416"}`, borderRadius: 14, overflow: "hidden", transition: "border-color 0.3s" }}>
      <div style={{ padding: "16px 22px", borderBottom: "1px solid #111", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", letterSpacing: "0.12em", textTransform: "uppercase" }}>{apiKey.label || "API Key"}</span>
          {freshKey && <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#C8FF00", background: "#C8FF0011", border: "1px solid #C8FF0033", borderRadius: 100, padding: "2px 8px" }}>NEW — copy now</span>}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {freshKey && <button onClick={() => setRevealed((v) => !v)} style={{ background: "none", border: "1px solid #1e1e1e", borderRadius: 6, padding: "5px 12px", fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", cursor: "pointer" }}>{revealed ? "Hide" : "Show"}</button>}
          <button onClick={copy} style={{ background: copied ? "#C8FF0015" : "none", border: `1px solid ${copied ? "#C8FF0033" : "#1e1e1e"}`, borderRadius: 6, padding: "5px 12px", fontFamily: "var(--font-mono)", fontSize: 10, color: copied ? "#C8FF00" : "#888", cursor: "pointer", transition: "all 0.15s" }}>
            {copied ? "✓ Copied" : "Copy"}
          </button>
        </div>
      </div>
      <div style={{ padding: "16px 22px", fontFamily: "var(--font-mono)", fontSize: 13, color: (freshKey && revealed) ? "#C8FF00" : "#555", background: "#060608", letterSpacing: "0.04em", wordBreak: "break-all", lineHeight: 1.6 }}>
        {(freshKey && revealed) ? freshKey : maskKey(apiKey.key_prefix)}
      </div>
      <div style={{ padding: "12px 22px", borderTop: "1px solid #0e0e0e", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", gap: 20 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#555" }}>Created {fmtDate(apiKey.created_at)}</span>
          {apiKey.last_used_at && <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#555" }}>Last used {fmtDate(apiKey.last_used_at)}</span>}
        </div>
        {!showConfirm ? (
          <button onClick={() => setShowConfirm(true)}
            style={{ background: "none", border: "1px solid #1e1e1e", borderRadius: 6, padding: "5px 12px", fontFamily: "var(--font-mono)", fontSize: 10, color: "#555", cursor: "pointer" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#ff6644"; e.currentTarget.style.borderColor = "#ff444433"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#555"; e.currentTarget.style.borderColor = "#1e1e1e"; }}>
            Rotate key
          </button>
        ) : (
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#ffaa00" }}>Invalidates old key immediately</span>
            <button onClick={() => setShowConfirm(false)} style={{ background: "none", border: "1px solid #1e1e1e", borderRadius: 5, padding: "4px 10px", fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", cursor: "pointer" }}>Cancel</button>
            <button onClick={doRotate} disabled={rotating} style={{ background: "#ff44440a", border: "1px solid #ff444433", borderRadius: 5, padding: "4px 12px", fontFamily: "var(--font-mono)", fontSize: 10, color: "#ff6644", cursor: "pointer" }}>
              {rotating ? "Rotating…" : "Confirm"}
            </button>
          </div>
        )}
      </div>
      {rotateError && <div style={{ padding: "8px 22px 12px", fontFamily: "var(--font-body)", fontSize: 12, color: "#ff6644" }}>{rotateError}</div>}
    </div>
  );
}

// ─── TEAM MANAGER ────────────────────────────────────────────
function TeamManager({ members, customerId, onUpdate }) {
  const [email, setEmail]     = useState("");
  const [name,  setName]      = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState("");

  const invite = async () => {
    if (!email.trim()) return;
    setLoading(true); setError(""); setSuccess("");
    try {
      const res  = await fetch("/api/keys/team", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body:   JSON.stringify({ action: "invite", email: email.trim(), name: name.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess(`Invitation sent to ${email}`); setEmail(""); setName("");
      if (onUpdate) onUpdate();
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const remove = async (memberId) => {
    try {
      await fetch("/api/keys/team", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body:   JSON.stringify({ action: "remove", memberId }),
      });
      if (onUpdate) onUpdate();
    } catch (e) { console.error(e); }
  };

  const activeMembers = members?.filter((m) => m.status !== "removed") || [];
  const remaining     = 5 - activeMembers.length;

  return (
    <div style={{ background: "#0a0a0c", border: "1px solid #141416", borderRadius: 14, overflow: "hidden" }}>
      <div style={{ padding: "18px 22px", borderBottom: "1px solid #111", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", letterSpacing: "0.12em", textTransform: "uppercase" }}>Team Members</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: remaining > 0 ? "#555" : "#ff4444" }}>{activeMembers.length}/5 seats</span>
      </div>
      <div style={{ padding: "8px 0" }}>
        {activeMembers.length === 0 && (
          <div style={{ padding: "16px 22px", fontFamily: "var(--font-body)", fontSize: 13, color: "#555" }}>No team members yet. Invite up to 4 more seats.</div>
        )}
        {activeMembers.map((m) => (
          <div key={m.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 22px", borderBottom: "1px solid #0e0e0e" }}>
            <div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#ccc" }}>{m.name || m.email}</div>
              {m.name && <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#555" }}>{m.email}</div>}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: m.status === "active" ? "#C8FF00" : "#ffaa00", background: m.status === "active" ? "#C8FF0011" : "#ffaa0011", border: `1px solid ${m.status === "active" ? "#C8FF0033" : "#ffaa0033"}`, borderRadius: 100, padding: "2px 8px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                {m.role === "owner" ? "owner" : m.status}
              </span>
              {m.role !== "owner" && (
                <button onClick={() => remove(m.id)} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 12, padding: "2px 6px", transition: "color 0.15s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#ff6644")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}>✕</button>
              )}
            </div>
          </div>
        ))}
      </div>
      {remaining > 0 && (
        <div style={{ padding: "18px 22px", borderTop: "1px solid #111" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <input type="text"  placeholder="Name (optional)" value={name}  onChange={(e) => setName(e.target.value)}
              style={{ flex: "0 0 140px", background: "#060608", border: "1px solid #1a1a1a", borderRadius: 7, padding: "9px 12px", fontFamily: "var(--font-body)", fontSize: 13, color: "#fff", outline: "none" }} />
            <input type="email" placeholder="colleague@company.com" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && invite()}
              style={{ flex: 1, background: "#060608", border: "1px solid #1a1a1a", borderRadius: 7, padding: "9px 12px", fontFamily: "var(--font-body)", fontSize: 13, color: "#fff", outline: "none" }} />
            <button onClick={invite} disabled={loading || !email.trim()} className="btn-primary"
              style={{ fontSize: 12, padding: "9px 16px", animation: "none", flexShrink: 0, opacity: !email.trim() ? 0.5 : 1 }}>
              {loading ? "…" : "Invite"}
            </button>
          </div>
          {error   && <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#ff6644", margin: 0 }}>{error}</p>}
          {success && <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#C8FF00",  margin: 0 }}>{success}</p>}
        </div>
      )}
    </div>
  );
}

// ─── PLAN BADGE ──────────────────────────────────────────────
function PlanBadge({ plan, planStatus, trialEnd }) {
  const isTeam    = plan === "team";
  const isTrial   = planStatus === "trialing";
  const isPastDue = planStatus === "past_due";
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 14, color: isTeam ? "#C8FF00" : "#888", background: isTeam ? "#C8FF0011" : "#0a0a0c", border: `1px solid ${isTeam ? "#C8FF0044" : "#1e1e1e"}`, borderRadius: 10, padding: "8px 16px" }}>
        {isTeam ? "Team" : "Free"}
      </span>
      {isTrial && (
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#ffaa00", background: "#ffaa0011", border: "1px solid #ffaa0033", borderRadius: 100, padding: "3px 10px", letterSpacing: "0.08em" }}>
          TRIAL — ends {fmtDate(trialEnd)}
        </span>
      )}
      {isPastDue && (
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#ff4444", background: "#ff444411", border: "1px solid #ff444433", borderRadius: 100, padding: "3px 10px", letterSpacing: "0.08em" }}>
          PAYMENT PAST DUE
        </span>
      )}
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [data,           setData]           = useState(null);
  const [loadError,      setLoadError]      = useState("");
  const [billingLoading, setBillingLoading] = useState(false);
  const [newRawKey]                         = useState(null); // set from URL param on future key-reveal flow

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/signin?callbackUrl=/dashboard");
  }, [status, router]);

  const fetchData = useCallback(async () => {
    setLoadError("");
    try {
      const res = await fetch("/api/dashboard/summary");
      if (!res.ok) throw new Error("Failed to load");
      setData(await res.json());
    } catch (e) {
      setLoadError("Could not load dashboard data. Please refresh.");
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      fetchData();
      const params = new URLSearchParams(window.location.search);
      if (params.get("status") === "success") window.history.replaceState({}, "", "/dashboard");
    }
  }, [status, fetchData]);

  const openBillingPortal = async () => {
    if (!data?.stripeCustomerId) return;
    setBillingLoading(true);
    try {
      const res  = await fetch("/api/stripe/portal", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body:   JSON.stringify({ customerId: data.stripeCustomerId }),
      });
      const json = await res.json();
      if (json.url) window.location.href = json.url;
    } catch { alert("Could not open billing portal. Contact hello@passgeni.ai"); }
    setBillingLoading(false);
  };

  if (status === "loading" || (!data && !loadError)) {
    return (
      <PageLayout title="Dashboard — PassGeni" description="">
        <div style={{ maxWidth: 920, margin: "0 auto", padding: "120px var(--page-pad)", textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#555", letterSpacing: "0.1em" }}>Loading dashboard…</div>
        </div>
      </PageLayout>
    );
  }

  if (loadError) {
    return (
      <PageLayout title="Dashboard — PassGeni" description="">
        <div style={{ maxWidth: 920, margin: "0 auto", padding: "120px var(--page-pad)", textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#ff6644", marginBottom: 16 }}>{loadError}</div>
          <button onClick={fetchData} className="btn-ghost" style={{ fontSize: 13 }}>Retry</button>
        </div>
      </PageLayout>
    );
  }

  const stats = data.stats || {};

  return (
    <PageLayout title="Dashboard — PassGeni Team" description="">
      <main style={{ maxWidth: 920, margin: "0 auto", padding: "56px var(--page-pad) 100px" }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#555", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>Team Dashboard</div>
            <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(22px,3vw,34px)", color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 12 }}>
              {data.name || session?.user?.email}
            </h1>
            <PlanBadge plan={data.plan} planStatus={data.planStatus} trialEnd={data.trialEnd} />
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <a href="/api" className="btn-ghost" style={{ fontSize: 13, padding: "10px 18px" }}>API Docs</a>
            <button onClick={openBillingPortal} disabled={billingLoading || !data.stripeCustomerId} className="btn-ghost"
              style={{ fontSize: 13, padding: "10px 18px", cursor: "pointer", opacity: !data.stripeCustomerId ? 0.4 : 1 }}>
              {billingLoading ? "Loading…" : "Billing →"}
            </button>
            <button onClick={() => signOut({ callbackUrl: "/" })}
              style={{ background: "none", border: "1px solid #1e1e1e", borderRadius: 8, padding: "10px 18px", fontFamily: "var(--font-body)", fontSize: 13, color: "#555", cursor: "pointer" }}>
              Sign out
            </button>
          </div>
        </div>

        {/* ── Plan stats (4 cards) ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 16 }}>
          {[
            { label: "Plan",        value: data.plan === "team" ? "Team" : "Free", sub: "$29/month",                           ac: "#C8FF00" },
            { label: "Daily limit", value: data.usageLimit.toLocaleString(),       sub: "calls/day" },
            { label: "Used today",  value: data.usageToday.toLocaleString(),       sub: `${stats.utilisation ?? 0}% of limit` },
            { label: "Team seats",  value: `${(data.teamMembers?.length || 0) + 1}/5`, sub: "including you" },
          ].map(({ label, value, sub, ac }) => (
            <div key={label} style={{ background: "#0a0a0c", border: "1px solid #141416", borderRadius: 12, padding: "20px 22px" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#555", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 28, color: ac || "#fff", letterSpacing: "-0.03em", lineHeight: 1 }}>{value}</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#555", marginTop: 6 }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* ── 30-day mini stats ── */}
        {stats.totalCalls30d !== undefined && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16 }}>
            {[
              { label: "Total calls (30d)", value: stats.totalCalls30d.toLocaleString(), sub: "" },
              { label: "Avg per day",       value: stats.avgDaily.toLocaleString(),      sub: "30-day average" },
              { label: "Peak day",          value: stats.peakCalls.toLocaleString(),     sub: stats.peakDay ? fmtShort(stats.peakDay) : "—" },
            ].map(({ label, value, sub }) => (
              <div key={label} style={{ background: "#0a0a0c", border: "1px solid #141416", borderRadius: 12, padding: "16px 20px" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#555", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 22, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1 }}>
                  {value}
                  {sub && <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#555", fontWeight: 400, marginLeft: 6 }}>{sub}</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Today usage bar + 7-day sparkline ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, marginBottom: 16, alignItems: "stretch" }}>
          <TodayUsageBar used={data.usageToday} limit={data.usageLimit} />
          <div style={{ background: "#0a0a0c", border: "1px solid #141416", borderRadius: 14, padding: "20px 24px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#555", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>7-day</div>
            <UsageSparkline data={data.usageWeek} limit={data.usageLimit} />
          </div>
        </div>

        {/* ── 30-day chart ── */}
        <div style={{ background: "#0a0a0c", border: "1px solid #141416", borderRadius: 14, padding: "22px 24px", marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", letterSpacing: "0.12em", textTransform: "uppercase" }}>
              API Calls — Last 30 Days
            </span>
            <div style={{ display: "flex", gap: 14 }}>
              {[["#C8FF00","≤70%"],["#ffaa00","70–90%"],["#ff4444",">90%"]].map(([col, lbl]) => (
                <div key={lbl} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 7, height: 7, background: col, borderRadius: 2 }} />
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#555" }}>{lbl}</span>
                </div>
              ))}
            </div>
          </div>
          <UsageBarChart data={data.usageMonth || data.usageWeek || []} limit={data.usageLimit} />
        </div>

        {/* ── API Keys ── */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 18, color: "#fff", letterSpacing: "-0.01em" }}>API Keys</h2>
            <a href="/api" style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#C8FF00", textDecoration: "none" }}>View docs →</a>
          </div>
          {data.keys?.length > 0 ? (
            data.keys.map((k) => (
              <div key={k.id} style={{ marginBottom: 12 }}>
                <ApiKeyCard apiKey={k} newRawKey={newRawKey} onRotate={fetchData} />
              </div>
            ))
          ) : (
            <div style={{ background: "#0a0a0c", border: "1px solid #141416", borderRadius: 14, padding: "28px", textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#888" }}>
                No API key found. Check your welcome email or contact{" "}
                <a href="mailto:hello@passgeni.ai" style={{ color: "#C8FF00" }}>hello@passgeni.ai</a>.
              </p>
            </div>
          )}
        </div>

        {/* ── Team ── */}
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 18, color: "#fff", letterSpacing: "-0.01em", marginBottom: 12 }}>Team</h2>
          <TeamManager members={data.teamMembers} customerId={session?.user?.customerId} onUpdate={fetchData} />
        </div>

        {/* ── Compliance presets ── */}
        <div style={{ background: "#0a0a0c", border: "1px solid #141416", borderRadius: 14, padding: "20px 24px" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14 }}>
            Compliance Presets — all active
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[
              { id: "hipaa",  label: "HIPAA",        c: "#4fc3f7" },
              { id: "pci",    label: "PCI-DSS v4.0", c: "#ffb74d" },
              { id: "soc2",   label: "SOC 2",        c: "#ce93d8" },
              { id: "iso",    label: "ISO 27001",    c: "#80cbc4" },
              { id: "nist",   label: "NIST 800-63B", c: "#a5d6a7" },
              { id: "dod",    label: "DoD 8570",     c: "#ef9a9a" },
            ].map(({ id, label, c }) => (
              <span key={id} style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: c, background: `${c}11`, border: `1px solid ${c}33`, borderRadius: 100, padding: "5px 14px", letterSpacing: "0.08em" }}>
                ✓ {label}
              </span>
            ))}
          </div>
        </div>

      </main>
    </PageLayout>
  );
}

export async function getServerSideProps() { return { props: {} }; }

export async function getServerSideProps() { return { props: {} }; }
// build-trigger
