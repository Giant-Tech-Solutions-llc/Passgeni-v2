/**
 * /dashboard/team — Team Management (Authority plan only)
 */

import { useState, useEffect, useCallback } from "react";
import { useSession }  from "next-auth/react";
import { useRouter }   from "next/router";
import PageLayout      from "../../components/layout/PageLayout.js";
import { IcBolt, IcEye } from "../../lib/icons.js";

export function getServerSideProps() {
  return { props: {} };
}

// ─── CONSTANTS ───────────────────────────────────────────────
const STANDARD_LABELS = {
  nist:  "NIST SP 800-63B",
  hipaa: "HIPAA §164.312",
  pci:   "PCI-DSS v4.0",
  soc2:  "SOC 2 CC6.1",
  iso:   "ISO 27001:2022",
  fips:  "FIPS 140-3",
};

const STANDARD_OPTIONS = [
  { value: "",     label: "No policy set" },
  { value: "nist", label: "NIST SP 800-63B" },
  { value: "hipaa",label: "HIPAA §164.312" },
  { value: "pci",  label: "PCI-DSS v4.0" },
  { value: "soc2", label: "SOC 2 CC6.1" },
  { value: "iso",  label: "ISO 27001:2022" },
  { value: "fips", label: "FIPS 140-3" },
];

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
function certStatusLabel(cert) {
  if (cert.is_revoked) return { text: "Revoked",  color: "#ff6644" };
  if (new Date(cert.expires_at) < new Date()) return { text: "Expired", color: "#ff4444" };
  return { text: "Valid", color: "#00d084" };
}

// ─── SORT UTIL ────────────────────────────────────────────────
function sortBy(arr, key, dir) {
  return [...arr].sort((a, b) => {
    const av = a[key] ?? "";
    const bv = b[key] ?? "";
    if (typeof av === "number") return dir === "asc" ? av - bv : bv - av;
    return dir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
  });
}

// ─── ROLE BADGE ───────────────────────────────────────────────
function RoleBadge({ role }) {
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, letterSpacing: ".08em",
      padding: "3px 8px", borderRadius: 4,
      background: role === "owner" ? "rgba(200,255,0,0.12)" : "rgba(255,255,255,0.06)",
      color: role === "owner" ? "#C8FF00" : "#888",
    }}>
      {role?.toUpperCase()}
    </span>
  );
}

// ─── STATUS BADGE ─────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    active:  { color: "#00d084", bg: "rgba(0,208,132,0.1)",  label: "Active" },
    pending: { color: "#facc15", bg: "rgba(250,204,21,0.1)", label: "Invited" },
    removed: { color: "#555",    bg: "rgba(255,255,255,0.04)", label: "Removed" },
  };
  const s = map[status] ?? map.removed;
  return (
    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".08em", padding: "3px 8px", borderRadius: 4, background: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

// ─── SORT HEADER ─────────────────────────────────────────────
function SortTh({ children, sortKey, sortState, onSort, style }) {
  const active = sortState.key === sortKey;
  return (
    <th
      onClick={() => onSort(sortKey)}
      style={{ ...thStyle, cursor: "pointer", color: active ? "#C8FF00" : "#555", userSelect: "none", ...style }}
    >
      {children}{active ? (sortState.dir === "asc" ? " ↑" : " ↓") : ""}
    </th>
  );
}

// ─── TEAM PAGE ────────────────────────────────────────────────
export default function TeamPage() {
  const { data: session, status } = useSession();
  const router  = useRouter();

  const [data,       setData]       = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);

  // Invite form
  const [invEmail,   setInvEmail]   = useState("");
  const [invName,    setInvName]    = useState("");
  const [invLoading, setInvLoading] = useState(false);
  const [invMsg,     setInvMsg]     = useState(null);
  const [showInvite, setShowInvite] = useState(false);

  // Policy
  const [policyVal,  setPolicyVal]  = useState("");
  const [polySaving, setPolySaving] = useState(false);
  const [polyMsg,    setPolyMsg]    = useState(null);

  // Cert sort
  const [certSort,   setCertSort]   = useState({ key: "created_at", dir: "desc" });
  // Member filter for cert table
  const [memberFilter, setMemberFilter] = useState("all");

  // Gate: redirect non-Authority users
  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.plan !== "authority") {
      router.replace("/pricing?upgrade=team");
    }
  }, [status, session, router]);

  const fetchData = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const r = await fetch("/api/dashboard/team");
      if (!r.ok) {
        const d = await r.json().catch(() => ({}));
        throw new Error(d.error || `HTTP ${r.status}`);
      }
      const d = await r.json();
      setData(d);
      setPolicyVal(d.policy ?? "");
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { if (session?.user?.plan === "authority") fetchData(); }, [session, fetchData]);

  // ── Invite handler
  async function handleInvite(e) {
    e.preventDefault();
    setInvLoading(true); setInvMsg(null);
    try {
      const r = await fetch("/api/team/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: invEmail.trim(), name: invName.trim() || undefined }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Invite failed");
      setInvMsg({ ok: true, text: `Invite sent to ${invEmail.trim()}` });
      setInvEmail(""); setInvName("");
      fetchData();
    } catch (ex) { setInvMsg({ ok: false, text: ex.message }); }
    finally { setInvLoading(false); }
  }

  // ── Policy handler
  async function handlePolicySave() {
    setPolySaving(true); setPolyMsg(null);
    try {
      const r = await fetch("/api/team/policy", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ standard: policyVal }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Save failed");
      setPolyMsg({ ok: true, text: "Policy saved." });
      if (data) setData({ ...data, policy: policyVal || null });
    } catch (ex) { setPolyMsg({ ok: false, text: ex.message }); }
    finally { setPolySaving(false); }
  }

  // ── Remove member
  async function handleRemove(memberId) {
    if (!confirm("Remove this member from your team?")) return;
    await fetch(`/api/team/members/${memberId}`, { method: "DELETE" });
    fetchData();
  }

  // ── Change role
  async function handleRoleChange(memberId, newRole) {
    await fetch(`/api/team/members/${memberId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    fetchData();
  }

  if (status === "loading" || !session || session.user.plan !== "authority") return null;

  const activeMembers = (data?.members ?? []).filter((m) => m.status !== "removed");
  const seatUsed      = data?.seatUsed ?? activeMembers.length;
  const seatLimit     = data?.seatLimit ?? 10;

  // Cert table with user_id filter
  let certs = data?.allCerts ?? [];
  if (memberFilter !== "all") certs = certs.filter((c) => c.user_id === memberFilter);
  certs = sortBy(certs, certSort.key, certSort.dir);

  const uniqueUserIds = [...new Set((data?.allCerts ?? []).map((c) => c.user_id))];

  return (
    <PageLayout>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>

        {/* ── Page header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.02em" }}>Team Management</h1>
            <p style={{ fontSize: 13, color: "#555", margin: "6px 0 0" }}>Authority plan · {seatUsed} / {seatLimit} seats used</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <a href="/dashboard" style={linkBtn}>← Dashboard</a>
            <button onClick={() => setShowInvite(!showInvite)} style={primaryBtn}>
              + Invite Member
            </button>
          </div>
        </div>

        {error && (
          <div style={{ background: "rgba(255,68,68,0.08)", border: "1px solid rgba(255,68,68,0.2)", borderRadius: 10, padding: "14px 18px", color: "#ff6b6b", fontSize: 13, marginBottom: 24 }}>
            Error: {error}
          </div>
        )}

        {loading && !data && (
          <div style={{ color: "#444", fontSize: 14, padding: "40px 0", textAlign: "center" }}>Loading team data…</div>
        )}

        {/* ── Invite form */}
        {showInvite && (
          <div style={card}>
            <div style={{ fontSize: 10, color: "#C8FF00", letterSpacing: ".14em", fontWeight: 700, marginBottom: 14 }}>INVITE MEMBER</div>
            <form onSubmit={handleInvite} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <input
                type="email" required placeholder="email@company.com" value={invEmail}
                onChange={(e) => setInvEmail(e.target.value)}
                style={inputStyle}
              />
              <input
                type="text" placeholder="Name (optional)" value={invName}
                onChange={(e) => setInvName(e.target.value)}
                style={{ ...inputStyle, maxWidth: 180 }}
              />
              <button type="submit" disabled={invLoading} style={primaryBtn}>
                {invLoading ? "Sending…" : "Send Invite"}
              </button>
            </form>
            {invMsg && (
              <p style={{ fontSize: 12, marginTop: 10, color: invMsg.ok ? "#00d084" : "#ff6b6b" }}>{invMsg.text}</p>
            )}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
          {/* ── Seat usage */}
          <div style={card}>
            <div style={{ fontSize: 10, color: "#C8FF00", letterSpacing: ".14em", fontWeight: 700, marginBottom: 12 }}>SEAT USAGE</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", marginBottom: 8 }}>{seatUsed} <span style={{ fontSize: 14, color: "#555", fontWeight: 400 }}>/ {seatLimit} seats</span></div>
            <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 3, background: "#C8FF00", width: `${Math.min(100, (seatUsed / seatLimit) * 100)}%`, transition: "width .4s" }} />
            </div>
          </div>

          {/* ── Policy */}
          <div style={card}>
            <div style={{ fontSize: 10, color: "#C8FF00", letterSpacing: ".14em", fontWeight: 700, marginBottom: 12 }}>ORG COMPLIANCE POLICY</div>
            <p style={{ fontSize: 12, color: "#555", marginBottom: 12, lineHeight: 1.5 }}>
              Required standard for all team certificates.
            </p>
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <select value={policyVal} onChange={(e) => setPolicyVal(e.target.value)} style={selectStyle}>
                {STANDARD_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <button onClick={handlePolicySave} disabled={polySaving} style={primaryBtn}>
                {polySaving ? "Saving…" : "Save"}
              </button>
            </div>
            {polyMsg && <p style={{ fontSize: 12, marginTop: 8, color: polyMsg.ok ? "#00d084" : "#ff6b6b" }}>{polyMsg.text}</p>}
          </div>
        </div>

        {/* ── Members table */}
        <div style={{ ...card, marginBottom: 24 }}>
          <div style={{ fontSize: 10, color: "#C8FF00", letterSpacing: ".14em", fontWeight: 700, marginBottom: 16 }}>TEAM MEMBERS</div>
          {(data?.members ?? []).length === 0 ? (
            <p style={{ color: "#444", fontSize: 13 }}>No members yet. Use &ldquo;Invite Member&rdquo; above.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <th style={thStyle}>Member</th>
                    <th style={thStyle}>Role</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Certs</th>
                    <th style={thStyle}>Joined</th>
                    <th style={{ ...thStyle, textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.members ?? []).filter((m) => m.status !== "removed").map((m) => (
                    <tr key={m.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <td style={tdStyle}>
                        <div style={{ fontWeight: 600, color: "#e0e0e0" }}>{m.name || m.email}</div>
                        {m.name && <div style={{ fontSize: 11, color: "#555" }}>{m.email}</div>}
                      </td>
                      <td style={tdStyle}><RoleBadge role={m.role} /></td>
                      <td style={tdStyle}><StatusBadge status={m.status} /></td>
                      <td style={tdStyle}>{m.cert_count ?? 0}</td>
                      <td style={tdStyle}>{fmtDate(m.accepted_at || m.invited_at)}</td>
                      <td style={{ ...tdStyle, textAlign: "right" }}>
                        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                          {m.role === "member" && (
                            <button onClick={() => handleRoleChange(m.id, "owner")} style={ghostBtn}>Make admin</button>
                          )}
                          {m.role === "owner" && (
                            <button onClick={() => handleRoleChange(m.id, "member")} style={ghostBtn}>Demote</button>
                          )}
                          <button onClick={() => handleRemove(m.id)} style={{ ...ghostBtn, color: "#ff6644", borderColor: "rgba(255,102,68,0.2)" }}>Remove</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Shared certificates */}
        <div style={{ ...card, marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
            <div style={{ fontSize: 10, color: "#C8FF00", letterSpacing: ".14em", fontWeight: 700 }}>SHARED CERTIFICATE POOL</div>
            {uniqueUserIds.length > 1 && (
              <select value={memberFilter} onChange={(e) => setMemberFilter(e.target.value)} style={{ ...selectStyle, fontSize: 12, padding: "5px 10px" }}>
                <option value="all">All members</option>
                {uniqueUserIds.map((uid) => (
                  <option key={uid} value={uid}>{uid.slice(0, 8)}…</option>
                ))}
              </select>
            )}
          </div>
          {certs.length === 0 ? (
            <p style={{ color: "#444", fontSize: 13 }}>No certificates yet.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <SortTh sortKey="compliance_standard" sortState={certSort} onSort={(k) => setCertSort((s) => ({ key: k, dir: s.key === k && s.dir === "asc" ? "desc" : "asc" }))}>Standard</SortTh>
                    <SortTh sortKey="entropy_bits" sortState={certSort} onSort={(k) => setCertSort((s) => ({ key: k, dir: s.key === k && s.dir === "asc" ? "desc" : "asc" }))}>Entropy</SortTh>
                    <SortTh sortKey="created_at" sortState={certSort} onSort={(k) => setCertSort((s) => ({ key: k, dir: s.key === k && s.dir === "asc" ? "desc" : "asc" }))}>Created</SortTh>
                    <SortTh sortKey="expires_at" sortState={certSort} onSort={(k) => setCertSort((s) => ({ key: k, dir: s.key === k && s.dir === "asc" ? "desc" : "asc" }))}>Expires</SortTh>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Member</th>
                  </tr>
                </thead>
                <tbody>
                  {certs.slice(0, 100).map((cert) => {
                    const s = certStatusLabel(cert);
                    return (
                      <tr key={cert.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                        <td style={tdStyle}>{STANDARD_LABELS[cert.compliance_standard] ?? cert.compliance_standard}</td>
                        <td style={tdStyle}>{cert.entropy_bits ? `${cert.entropy_bits} bits` : "—"}</td>
                        <td style={tdStyle}>{fmtDate(cert.created_at)}</td>
                        <td style={tdStyle}>{fmtDate(cert.expires_at)}</td>
                        <td style={tdStyle}><span style={{ color: s.color, fontSize: 11, fontWeight: 700 }}>{s.text}</span></td>
                        <td style={{ ...tdStyle, color: "#555", fontSize: 11 }}>{cert.user_id?.slice(0, 8)}…</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Audit log */}
        <div style={card}>
          <div style={{ fontSize: 10, color: "#C8FF00", letterSpacing: ".14em", fontWeight: 700, marginBottom: 16 }}>AUDIT LOG</div>
          {(data?.recentActivity ?? []).length === 0 ? (
            <p style={{ color: "#444", fontSize: 13 }}>No activity yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {(data?.recentActivity ?? []).map((ev, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: 12 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: "rgba(200,255,0,0.06)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {ev.type === "generated" ? <IcBolt size={14} color="#C8FF00" /> : <IcEye size={14} color="#888" />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ color: "#e0e0e0" }}>{ev.type === "generated" ? "Generated" : "Viewed"} </span>
                    <span style={{ color: "#C8FF00" }}>{ev.label}</span>
                  </div>
                  <div style={{ color: "#444", fontSize: 11 }}>{fmtRelative(ev.at)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </PageLayout>
  );
}

// ─── SHARED STYLES ────────────────────────────────────────────
const card = {
  background:   "#0a0a0c",
  border:       "1px solid rgba(255,255,255,0.06)",
  borderRadius: 12,
  padding:      "20px 24px",
};

const primaryBtn = {
  background:   "#C8FF00",
  color:        "#000",
  border:       "none",
  borderRadius: 8,
  padding:      "9px 18px",
  fontWeight:   800,
  fontSize:     12,
  cursor:       "pointer",
  whiteSpace:   "nowrap",
};

const ghostBtn = {
  background:   "transparent",
  color:        "#666",
  border:       "1px solid rgba(255,255,255,0.1)",
  borderRadius: 6,
  padding:      "5px 10px",
  fontWeight:   600,
  fontSize:     11,
  cursor:       "pointer",
  whiteSpace:   "nowrap",
};

const linkBtn = {
  background:     "transparent",
  color:          "#555",
  border:         "1px solid rgba(255,255,255,0.08)",
  borderRadius:   8,
  padding:        "9px 14px",
  fontSize:       12,
  textDecoration: "none",
  whiteSpace:     "nowrap",
};

const inputStyle = {
  background:   "rgba(255,255,255,0.04)",
  border:       "1px solid rgba(255,255,255,0.1)",
  borderRadius: 8,
  padding:      "9px 14px",
  fontSize:     13,
  color:        "#e0e0e0",
  outline:      "none",
  flex:         1,
  minWidth:     200,
};

const selectStyle = {
  background:   "#111114",
  border:       "1px solid rgba(255,255,255,0.1)",
  borderRadius: 8,
  padding:      "9px 14px",
  fontSize:     13,
  color:        "#e0e0e0",
  cursor:       "pointer",
  outline:      "none",
};

const thStyle = {
  textAlign:   "left",
  padding:     "8px 10px",
  fontSize:    10,
  fontWeight:  700,
  letterSpacing: ".08em",
  color:       "#555",
};

const tdStyle = {
  padding:  "10px 10px",
  color:    "#aaa",
  fontSize: 12,
};
