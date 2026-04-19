/**
 * /dashboard — Compliance Monitoring Dashboard
 * Primary view for all plan users.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence }                  from "framer-motion";
import { useSession, signOut }                      from "next-auth/react";
import { useRouter }                                from "next/router";
import PageLayout                                   from "../../components/layout/PageLayout.js";
import UpgradeModal                                 from "../../components/ui/UpgradeModal.js";
import { btnPrimary, btnGhost }                     from "../../lib/motion.js";

// ─── CONSTANTS ────────────────────────────────────────────────
const STANDARD_LABELS = {
  nist:  "NIST SP 800-63B",
  hipaa: "HIPAA §164.312",
  pci:   "PCI-DSS v4.0",
  soc2:  "SOC 2 CC6.1",
  iso:   "ISO 27001:2022",
  fips:  "FIPS 140-3",
};

const SCORE_PALETTE = {
  green: { color: "#00d084", bg: "rgba(0,208,132,0.08)",  ring: "#00d084" },
  amber: { color: "#facc15", bg: "rgba(250,204,21,0.08)", ring: "#facc15" },
  red:   { color: "#ff4444", bg: "rgba(255,68,68,0.08)",  ring: "#ff4444" },
};

const ISSUE_LABELS = {
  expired:       { text: "Expired",         color: "#ff4444" },
  expiring_soon: { text: "Expiring soon",   color: "#facc15" },
  revoked:       { text: "Revoked",         color: "#ff6644" },
};

// ─── HELPERS ─────────────────────────────────────────────────
function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function fmtRelative(iso) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return fmtDate(iso);
}
function certStatus(cert) {
  if (cert.is_revoked) return "revoked";
  if (new Date(cert.expires_at) < new Date()) return "expired";
  return "valid";
}
function downloadCertJson(cert) {
  const payload = {
    id:                 cert.id,
    compliance_standard: cert.compliance_standard,
    entropy_bits:       cert.entropy_bits,
    char_pool_size:     cert.char_pool_size,
    generation_params:  cert.generation_params,
    standards_met:      cert.standards_met,
    issued:             cert.created_at,
    expires:            cert.expires_at,
    status:             certStatus(cert),
    verify_url:         `${window.location.origin}/cert/${cert.id}`,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `passgeni-cert-${cert.id.slice(0, 8)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── SKELETON ────────────────────────────────────────────────
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

// ─── SCORE RING ───────────────────────────────────────────────
function ScoreRing({ score, colorName }) {
  const pal  = SCORE_PALETTE[colorName] ?? SCORE_PALETTE.green;
  const r    = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  return (
    <svg width={136} height={136} viewBox="0 0 136 136" style={{ display: "block" }}>
      <circle cx={68} cy={68} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={10} />
      <motion.circle
        cx={68} cy={68} r={r} fill="none"
        stroke={pal.ring} strokeWidth={10}
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        strokeLinecap="round"
        transform="rotate(-90 68 68)"
      />
      <text x={68} y={62} textAnchor="middle" fill={pal.color}
        style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 28 }}>
        {score}%
      </text>
      <text x={68} y={80} textAnchor="middle" fill="rgba(255,255,255,0.35)"
        style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.12em" }}>
        COMPLIANCE
      </text>
    </svg>
  );
}

// ─── STAT CARD ────────────────────────────────────────────────
function StatCard({ label, value, sub, accentColor, icon, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut", delay }}
      style={{
        background:   "#0a0a0c",
        border:       "1px solid rgba(255,255,255,0.07)",
        borderRadius: 12,
        padding:      "18px 20px",
        position:     "relative",
        overflow:     "hidden",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${accentColor ?? "rgba(200,255,0,0.12)"},transparent)` }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#555", letterSpacing: ".14em", textTransform: "uppercase" }}>{label}</span>
        {icon && <span style={{ fontSize: 16, opacity: 0.4 }}>{icon}</span>}
      </div>
      <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(22px,2.5vw,30px)", color: accentColor ?? "#fff", letterSpacing: "-.03em", lineHeight: 1, marginBottom: 5 }}>
        {value}
      </div>
      {sub && <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#555" }}>{sub}</div>}
    </motion.div>
  );
}

// ─── QUICK FIX PANEL ─────────────────────────────────────────
function QuickFixPanel({ risks }) {
  if (!risks?.length) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{
        background:   "rgba(255,68,68,0.05)",
        border:       "1px solid rgba(255,68,68,0.22)",
        borderRadius: 12,
        overflow:     "hidden",
        marginBottom: 16,
      }}
    >
      <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,68,68,0.1)", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 15 }}>🚨</span>
        <span style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 13, color: "#ff9999" }}>
          {risks.length} certificate{risks.length !== 1 ? "s" : ""} need attention
        </span>
      </div>
      <div>
        {risks.map((risk, i) => {
          const issue = ISSUE_LABELS[risk.issue] ?? { text: risk.issue, color: "#ff9999" };
          return (
            <div key={risk.id} style={{
              display:       "flex",
              alignItems:    "center",
              justifyContent: "space-between",
              padding:       "12px 20px",
              borderBottom:  i < risks.length - 1 ? "1px solid rgba(255,68,68,0.07)" : "none",
              gap:           12,
              flexWrap:      "wrap",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
                <span style={{
                  fontSize: 10, padding: "3px 9px", borderRadius: 99, fontWeight: 700,
                  color: issue.color,
                  background: `${issue.color}18`,
                  border: `1px solid ${issue.color}35`,
                  letterSpacing: "0.07em", whiteSpace: "nowrap", flexShrink: 0,
                }}>
                  {issue.text.toUpperCase()}
                  {risk.days != null && ` · ${risk.days}d`}
                </span>
                <span style={{ fontSize: 13, color: "#ccc", fontFamily: "var(--font-body)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {risk.label}
                </span>
                <span style={{ fontSize: 11, color: "#555", fontFamily: "var(--font-mono)", flexShrink: 0 }}>
                  {risk.issue === "revoked" ? `revoked ${fmtDate(risk.revoked_at)}` : `expires ${fmtDate(risk.expires_at)}`}
                </span>
              </div>
              <a
                href="/dashboard/certs"
                style={{ fontSize: 12, fontWeight: 700, color: "#c8ff00", textDecoration: "none", border: "1px solid rgba(200,255,0,0.25)", padding: "5px 13px", borderRadius: 6, whiteSpace: "nowrap", flexShrink: 0 }}
              >
                Re-certify →
              </a>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── MONTHLY USAGE BAR ────────────────────────────────────────
function MonthlyUsageBar({ used, limit, plan }) {
  const isPaid = !limit;
  const pct    = isPaid ? 0 : Math.min(used / limit, 1);
  const barColor = pct >= 1 ? "#ff4444" : pct >= 0.66 ? "#facc15" : "#c8ff00";

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      style={{ background: "#0a0a0c", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "18px 20px" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#555", letterSpacing: ".14em", textTransform: "uppercase" }}>Certificates This Month</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#ccc" }}>
          {used}
          {limit && <span style={{ color: "#444" }}> / {limit}</span>}
          {!limit && <span style={{ color: "#555", fontSize: 10 }}> issued</span>}
        </span>
      </div>
      {limit ? (
        <>
          <div style={{ height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 100, overflow: "hidden", marginBottom: 8 }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct * 100}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
              style={{ height: "100%", borderRadius: 100, background: barColor, boxShadow: `0 0 8px ${barColor}66` }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "#444" }}>
              {limit - used > 0 ? `${limit - used} remaining` : "Limit reached"}
            </span>
            {pct >= 0.8 && (
              <a href="/pricing" style={{ fontSize: 11, color: "#c8ff00", textDecoration: "none" }}>Upgrade for unlimited →</a>
            )}
          </div>
        </>
      ) : (
        <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#555" }}>
          Unlimited on {plan === "assurance" ? "Assurance" : "Authority"} plan
        </div>
      )}
    </motion.div>
  );
}

// ─── SORT HEADER ─────────────────────────────────────────────
function SortTh({ label, field, sortBy, sortDir, onSort, style }) {
  const active = sortBy === field;
  return (
    <th
      onClick={() => onSort(field)}
      style={{
        padding:    "10px 14px",
        fontSize:   11,
        fontFamily: "var(--font-mono)",
        fontWeight: 700,
        color:      active ? "#c8ff00" : "#555",
        letterSpacing: ".08em",
        textTransform: "uppercase",
        textAlign:  "left",
        cursor:     "pointer",
        userSelect: "none",
        whiteSpace: "nowrap",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        ...style,
      }}
    >
      {label}
      {active && <span style={{ marginLeft: 4, fontSize: 9 }}>{sortDir === "asc" ? "▲" : "▼"}</span>}
    </th>
  );
}

// ─── CERT TABLE ───────────────────────────────────────────────
function CertTable({ certs }) {
  const [sortBy,  setSortBy]  = useState("created_at");
  const [sortDir, setSortDir] = useState("desc");
  const [copied,  setCopied]  = useState(null);

  function handleSort(field) {
    if (sortBy === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortBy(field); setSortDir("asc"); }
  }

  const STATUS_STYLE = {
    valid:   { color: "#00d084", bg: "rgba(0,208,132,0.1)",  label: "VALID"   },
    revoked: { color: "#ff4444", bg: "rgba(255,68,68,0.1)",  label: "REVOKED" },
    expired: { color: "#facc15", bg: "rgba(250,204,21,0.1)", label: "EXPIRED" },
  };

  const sorted = [...certs].sort((a, b) => {
    let av, bv;
    if (sortBy === "status") {
      av = certStatus(a); bv = certStatus(b);
    } else if (sortBy === "standard") {
      av = a.compliance_standard; bv = b.compliance_standard;
    } else {
      av = a[sortBy] ?? ""; bv = b[sortBy] ?? "";
    }
    if (av < bv) return sortDir === "asc" ? -1 : 1;
    if (av > bv) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const copyUrl = (id) => {
    navigator.clipboard.writeText(`${window.location.origin}/cert/${id}`).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 1800);
    });
  };

  if (!certs.length) {
    return (
      <div style={{ padding: "48px 20px", textAlign: "center", color: "#333", fontSize: 14 }}>
        No certificates yet. Issue your first one →
      </div>
    );
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <SortTh label="Standard"  field="standard"   sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
            <SortTh label="Entropy"   field="entropy_bits" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} style={{ textAlign: "right" }} />
            <SortTh label="Issued"    field="created_at" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
            <SortTh label="Expires"   field="expires_at" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
            <SortTh label="Status"    field="status"     sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
            <th style={{ padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)" }} />
          </tr>
        </thead>
        <tbody>
          {sorted.map((cert) => {
            const st     = certStatus(cert);
            const stStyle = STATUS_STYLE[st];
            return (
              <tr key={cert.id}
                style={{ borderBottom: "1px solid rgba(255,255,255,0.03)", transition: "background .1s" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(200,255,0,0.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <td style={{ padding: "12px 14px" }}>
                  <div style={{ fontSize: 13, color: "#e0e0e0", fontWeight: 600 }}>
                    {STANDARD_LABELS[cert.compliance_standard] ?? cert.compliance_standard}
                  </div>
                  <div style={{ fontSize: 10, color: "#444", fontFamily: "var(--font-mono)", marginTop: 2 }}>
                    {cert.id.slice(0, 8)}…
                  </div>
                </td>
                <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 12, color: "#888" }}>
                  {cert.entropy_bits}b
                </td>
                <td style={{ padding: "12px 14px", fontSize: 12, color: "#666", whiteSpace: "nowrap" }}>
                  {fmtDate(cert.created_at)}
                </td>
                <td style={{ padding: "12px 14px", fontSize: 12, color: "#666", whiteSpace: "nowrap" }}>
                  {fmtDate(cert.expires_at)}
                </td>
                <td style={{ padding: "12px 14px" }}>
                  <span style={{
                    fontSize: 9, padding: "3px 9px", borderRadius: 99, fontWeight: 700,
                    color: stStyle.color,
                    background: stStyle.bg,
                    letterSpacing: "0.07em",
                  }}>
                    {stStyle.label}
                  </span>
                </td>
                <td style={{ padding: "8px 14px" }}>
                  <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                    <a
                      href={`/cert/${cert.id}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontSize: 11, color: "#c8ff00", textDecoration: "none", padding: "5px 10px", border: "1px solid rgba(200,255,0,0.2)", borderRadius: 6, whiteSpace: "nowrap" }}
                    >
                      View →
                    </a>
                    <button
                      onClick={() => copyUrl(cert.id)}
                      style={{ fontSize: 11, background: "transparent", border: "1px solid rgba(255,255,255,0.07)", color: copied === cert.id ? "#c8ff00" : "#555", padding: "5px 10px", borderRadius: 6, cursor: "pointer" }}
                    >
                      {copied === cert.id ? "✓" : "Copy"}
                    </button>
                    <button
                      onClick={() => downloadCertJson(cert)}
                      title="Download as JSON"
                      style={{ fontSize: 11, background: "transparent", border: "1px solid rgba(255,255,255,0.07)", color: "#555", padding: "5px 10px", borderRadius: 6, cursor: "pointer" }}
                    >
                      ↓
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div style={{ padding: "10px 14px", borderTop: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 11, color: "#444", fontFamily: "var(--font-mono)" }}>
          Showing {sorted.length} certificate{sorted.length !== 1 ? "s" : ""}
        </span>
        <a href="/dashboard/certs" style={{ fontSize: 11, color: "#c8ff00", textDecoration: "none" }}>
          Manage all →
        </a>
      </div>
    </div>
  );
}

// ─── RECENT ACTIVITY ─────────────────────────────────────────
function RecentActivity({ events }) {
  const ICONS = { generated: "✦", viewed: "◎" };
  const COLORS = { generated: "#c8ff00", viewed: "#555" };

  if (!events?.length) {
    return (
      <div style={{ padding: "32px 20px", textAlign: "center", color: "#333", fontSize: 13 }}>
        No activity yet
      </div>
    );
  }

  return (
    <div>
      {events.map((ev, i) => (
        <div key={i} style={{
          display:      "flex",
          alignItems:   "flex-start",
          gap:          12,
          padding:      "12px 20px",
          borderBottom: i < events.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
        }}>
          <div style={{
            width:        28, height: 28, borderRadius: "50%", flexShrink: 0,
            background:   `${COLORS[ev.type] ?? "#555"}14`,
            border:       `1px solid ${COLORS[ev.type] ?? "#555"}28`,
            display:      "flex", alignItems: "center", justifyContent: "center",
            fontSize:     11, color: COLORS[ev.type] ?? "#555",
          }}>
            {ICONS[ev.type] ?? "·"}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, color: "#ccc", lineHeight: 1.3 }}>
              {ev.type === "generated" ? "Certificate issued" : "Certificate viewed"}
            </div>
            <div style={{ fontSize: 11, color: "#555", marginTop: 3, fontFamily: "var(--font-mono)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {ev.label}
            </div>
          </div>
          <div style={{ fontSize: 11, color: "#444", whiteSpace: "nowrap", fontFamily: "var(--font-mono)" }}>
            {fmtRelative(ev.at)}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────
export default function ComplianceDashboard() {
  const router  = useRouter();
  const { data: session, status } = useSession();
  const [data,         setData]         = useState(null);
  const [loadError,    setLoadError]    = useState("");
  const [upgradeModal, setUpgradeModal] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/signin?callbackUrl=/dashboard");
  }, [status, router]);

  const fetchData = useCallback(async () => {
    setLoadError("");
    try {
      const res = await fetch("/api/dashboard/compliance");
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
    if (params.get("status") === "success") {
      window.history.replaceState({}, "", "/dashboard");
    }
  }, [status, fetchData]);

  // ── Loading ────────────────────────────────────────────────
  if (status === "loading" || (status === "authenticated" && !data && !loadError)) {
    return (
      <PageLayout title="Dashboard — PassGeni" description="">
        <main style={{ maxWidth: 1100, margin: "0 auto", padding: "60px var(--page-pad) 100px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 36, flexWrap: "wrap", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Skeleton w={120} h={10} />
              <Skeleton w={280} h={32} r={8} />
              <Skeleton w={80} h={24} r={10} />
            </div>
            <Skeleton w={140} h={40} r={8} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginBottom: 16 }}>
            {[1,2,3,4].map((i) => <Skeleton key={i} h={90} r={12} />)}
          </div>
          <Skeleton h={200} r={12} />
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

  if (!data) return null;

  const pal          = SCORE_PALETTE[data.scoreColor] ?? SCORE_PALETTE.green;
  const isPaid       = data.monthlyLimit === null;
  const isTrialing   = data.planStatus === "trialing";
  const trialDaysLeft = isTrialing && data.trialEnd
    ? Math.max(0, Math.ceil((new Date(data.trialEnd) - new Date()) / (1000 * 60 * 60 * 24)))
    : 0;

  const expiredCount    = (data.certs ?? []).filter((c) => !c.is_revoked && new Date(c.expires_at) < new Date()).length;
  const expiringSoonCount = (data.risks ?? []).filter((r) => r.issue === "expiring_soon").length;
  const planLabel = { free: "Free", assurance: "Assurance", authority: "Authority" }[data.plan] ?? data.plan;

  return (
    <PageLayout title="Compliance Dashboard — PassGeni" description="">
      <UpgradeModal
        open={!!upgradeModal}
        onClose={() => setUpgradeModal(null)}
        reason={upgradeModal?.reason}
        used={upgradeModal?.used}
        limit={upgradeModal?.limit}
      />

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "56px var(--page-pad) 100px" }}>

        {/* ── Page header ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 16 }}
        >
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#555", letterSpacing: ".16em", textTransform: "uppercase", marginBottom: 8 }}>
              Compliance Monitoring
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
                background: "linear-gradient(135deg,rgba(200,255,0,.2),rgba(200,255,0,.05))",
                border: "1px solid rgba(200,255,0,.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 16, color: "rgba(200,255,0,.9)",
              }}>
                {(session?.user?.email || "U").slice(0, 1).toUpperCase()}
              </div>
              <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(18px,2.5vw,26px)", color: "#fff", letterSpacing: "-.02em", lineHeight: 1.1, margin: 0 }}>
                {session?.user?.email}
              </h1>
            </div>
            {/* Plan badge row */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{
                fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 11,
                color: isPaid ? "#000" : "#888",
                background: isPaid ? "var(--accent)" : "rgba(255,255,255,.05)",
                border: isPaid ? "none" : "1px solid rgba(255,255,255,.08)",
                borderRadius: 8, padding: "5px 12px", letterSpacing: ".06em",
              }}>
                {planLabel.toUpperCase()}
              </span>
              {isTrialing && trialDaysLeft > 0 && (
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#ffaa00", background: "rgba(255,170,0,.08)", border: "1px solid rgba(255,170,0,.25)", borderRadius: 100, padding: "3px 10px", letterSpacing: ".07em" }}>
                  TRIAL · {trialDaysLeft}d left
                </span>
              )}
              {data.planStatus === "past_due" && (
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#ff4444", background: "rgba(255,68,68,.08)", border: "1px solid rgba(255,68,68,.25)", borderRadius: 100, padding: "3px 10px", letterSpacing: ".07em" }}>
                  ⚠ PAYMENT PAST DUE
                </span>
              )}
            </div>
          </div>

          {/* Header actions */}
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <motion.a
              href="/dashboard/certs"
              className="btn-primary"
              {...btnPrimary}
              style={{ fontSize: 13, padding: "10px 20px", whiteSpace: "nowrap" }}
            >
              New Certificate →
            </motion.a>
            {!isPaid && (
              <motion.a href="/pricing" className="btn-ghost" {...btnGhost} style={{ fontSize: 12, padding: "9px 16px" }}>
                Upgrade
              </motion.a>
            )}
            {data.plan === "authority" && (
              <motion.a href="/dashboard/team" className="btn-ghost" {...btnGhost} style={{ fontSize: 12, padding: "9px 16px" }}>
                Team →
              </motion.a>
            )}
            <motion.a href="/api-docs" className="btn-ghost" {...btnGhost} style={{ fontSize: 12, padding: "9px 16px" }}>
              API Docs
            </motion.a>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              style={{ background: "none", border: "1px solid rgba(255,255,255,.07)", borderRadius: 8, padding: "9px 16px", fontFamily: "var(--font-body)", fontSize: 12, color: "#555", cursor: "pointer", transition: "all .15s" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#ff6644"; e.currentTarget.style.borderColor = "rgba(255,68,68,.3)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#555"; e.currentTarget.style.borderColor = "rgba(255,255,255,.07)"; }}
            >
              Sign out
            </button>
          </div>
        </motion.div>

        {/* ── Quick Fix Panel ─────────────────────────────── */}
        <QuickFixPanel risks={data.risks} />

        {/* ── Top stats row ───────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr 1fr", gap: 12, marginBottom: 12, alignItems: "stretch" }}>

          {/* Compliance score ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              background:   "#0a0a0c",
              border:       `1px solid ${pal.color}30`,
              borderRadius: 12,
              padding:      "20px 24px",
              display:      "flex",
              flexDirection: "column",
              alignItems:   "center",
              justifyContent: "center",
              gap:          10,
              minWidth:     160,
            }}
          >
            <ScoreRing score={data.complianceScore} colorName={data.scoreColor} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "#555", fontFamily: "var(--font-mono)", letterSpacing: ".1em", textTransform: "uppercase" }}>
                {data.scoreColor === "green" ? "On track" : data.scoreColor === "amber" ? "Needs attention" : "Action required"}
              </div>
              <div style={{ fontSize: 11, color: "#444", marginTop: 3 }}>
                {data.validCerts} / {data.totalCerts} valid
              </div>
            </div>
          </motion.div>

          {/* Stats 3-up */}
          <StatCard label="Active Certs"    value={data.validCerts}    sub="non-expired, non-revoked"  accentColor="#00d084" icon="✦" delay={0.06} />
          <StatCard
            label="Expiring Soon"
            value={expiringSoonCount}
            sub="within 30 days"
            accentColor={expiringSoonCount > 0 ? "#facc15" : "#555"}
            icon="⏱"
            delay={0.12}
          />
          <StatCard
            label="Revoked / Expired"
            value={(data.risks ?? []).filter((r) => r.issue === "revoked" || r.issue === "expired").length}
            sub="need re-certification"
            accentColor={(data.risks ?? []).filter((r) => r.issue !== "expiring_soon").length > 0 ? "#ff4444" : "#555"}
            icon="⚠"
            delay={0.18}
          />
        </div>

        {/* ── Monthly usage bar ────────────────────────────── */}
        <div style={{ marginBottom: 20 }}>
          <MonthlyUsageBar used={data.monthlyCount} limit={data.monthlyLimit} plan={data.plan} />
        </div>

        {/* ── Main 2-col: table + activity ────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16, marginBottom: 20, alignItems: "start" }}>

          {/* Certificate table */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.24 }}
            style={{ background: "#0a0a0c", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, overflow: "hidden" }}
          >
            <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#555", letterSpacing: ".14em", textTransform: "uppercase" }}>Certificate History</span>
              <span style={{ fontSize: 11, color: "#333", fontFamily: "var(--font-mono)" }}>
                Click column headers to sort
              </span>
            </div>
            <CertTable certs={data.certs ?? []} />
          </motion.div>

          {/* Recent activity */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            style={{ background: "#0a0a0c", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, overflow: "hidden" }}
          >
            <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#555", letterSpacing: ".14em", textTransform: "uppercase" }}>Recent Activity</span>
            </div>
            <RecentActivity events={data.recentActivity} />
          </motion.div>
        </div>

        {/* ── Compliance standards coverage ───────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.36 }}
          style={{ background: "#0a0a0c", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "18px 20px", marginBottom: 20 }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#555", letterSpacing: ".14em", textTransform: "uppercase" }}>Coverage This Month</span>
            <a href="/dashboard/certs" style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#c8ff00", textDecoration: "none" }}>Issue certificate →</a>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {Object.entries(STANDARD_LABELS).map(([key, label]) => {
              const hasCert = (data.certs ?? []).some((c) => c.compliance_standard === key && !c.is_revoked && new Date(c.expires_at) > new Date());
              const isLocked = !isPaid && key !== "nist";
              return (
                <div key={key} style={{
                  fontFamily:  "var(--font-mono)",
                  fontSize:    10,
                  color:       hasCert ? "#00d084" : isLocked ? "#333" : "#555",
                  background:  hasCert ? "rgba(0,208,132,0.08)" : "rgba(255,255,255,0.02)",
                  border:      `1px solid ${hasCert ? "rgba(0,208,132,0.25)" : "rgba(255,255,255,0.06)"}`,
                  borderRadius: 100,
                  padding:     "5px 14px",
                  letterSpacing: ".07em",
                  display:     "flex",
                  alignItems:  "center",
                  gap:         6,
                }}>
                  <span style={{ fontSize: 8 }}>{hasCert ? "✓" : isLocked ? "★" : "○"}</span>
                  {label}
                </div>
              );
            })}
          </div>
          {!isPaid && (
            <div style={{ marginTop: 12, fontSize: 11, color: "#444" }}>
              ★ Requires Assurance or Authority plan ·{" "}
              <a href="/pricing" style={{ color: "#c8ff00", textDecoration: "none" }}>Upgrade →</a>
            </div>
          )}
        </motion.div>

      </main>

      <style>{`
        @keyframes shimmer {
          0%   { background-position:  200% 0 }
          100% { background-position: -200% 0 }
        }
        @media (max-width: 900px) {
          .dash-main-grid { grid-template-columns: 1fr !important; }
          .dash-stats-row { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </PageLayout>
  );
}

export async function getServerSideProps() { return { props: {} }; }
