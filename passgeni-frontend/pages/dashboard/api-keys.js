/**
 * /dashboard/api-keys — Manage developer API keys
 */

import { useState, useEffect } from "react";
import { useSession }          from "next-auth/react";
import { useRouter }           from "next/router";
import PageLayout              from "../../components/layout/PageLayout.js";

function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function ApiKeysPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [keys,        setKeys]        = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [creating,    setCreating]    = useState(false);
  const [newKeyName,  setNewKeyName]  = useState("");
  const [newKeyRaw,   setNewKeyRaw]   = useState(null); // shown once after creation
  const [revoking,    setRevoking]    = useState(null);
  const [error,       setError]       = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") { router.replace("/auth/signin"); return; }
    if (status === "authenticated")   { fetchKeys(); }
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchKeys() {
    setLoading(true);
    setError(null);
    try {
      const r    = await fetch("/api/keys");
      const body = await r.json();
      if (!r.ok) throw new Error(body.error ?? "Failed to load keys");
      setKeys(body.keys ?? []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    setCreating(true);
    setError(null);
    try {
      const r    = await fetch("/api/keys", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: newKeyName.trim() }) });
      const body = await r.json();
      if (!r.ok) throw new Error(body.error ?? "Failed to create key");
      setNewKeyRaw(body.key);
      setNewKeyName("");
      await fetchKeys();
    } catch (e) {
      setError(e.message);
    } finally {
      setCreating(false);
    }
  }

  async function handleRevoke(keyId) {
    setRevoking(keyId);
    setError(null);
    try {
      const r    = await fetch(`/api/keys?id=${keyId}`, { method: "DELETE" });
      const body = await r.json();
      if (!r.ok) throw new Error(body.error ?? "Failed to revoke key");
      await fetchKeys();
    } catch (e) {
      setError(e.message);
    } finally {
      setRevoking(null);
    }
  }

  const card = { background: "#0a0a0c", border: "1px solid #1e1e1e", borderRadius: 14, padding: "24px 28px", marginBottom: 16 };

  return (
    <PageLayout title="API Keys — PassGeni">
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 20px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff", margin: 0 }}>API Keys</h1>
            <p style={{ fontSize: 13, color: "#555", margin: "6px 0 0" }}>
              Use Bearer keys to call <code style={{ color: "#C8FF00", fontSize: 12 }}>generate-certificate</code>, <code style={{ color: "#C8FF00", fontSize: 12 }}>audit</code>, and <code style={{ color: "#C8FF00", fontSize: 12 }}>revoke</code> endpoints programmatically.
            </p>
          </div>
          <a href="/dashboard" style={{ fontSize: 12, color: "#555", textDecoration: "none" }}>← Dashboard</a>
        </div>

        {error && (
          <div style={{ background: "rgba(255,68,68,.08)", border: "1px solid rgba(255,68,68,.2)", borderRadius: 10, padding: "12px 16px", marginBottom: 20, color: "#ff6644", fontSize: 13 }}>
            {error}
          </div>
        )}

        {/* New-key reveal banner */}
        {newKeyRaw && (
          <div style={{ background: "rgba(200,255,0,.06)", border: "1px solid rgba(200,255,0,.25)", borderRadius: 12, padding: "20px 24px", marginBottom: 24 }}>
            <p style={{ margin: "0 0 8px", fontSize: 13, color: "#C8FF00", fontWeight: 700 }}>Copy your key now — it will not be shown again.</p>
            <code style={{ display: "block", background: "#060608", border: "1px solid #1e1e1e", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#e0e0e0", wordBreak: "break-all", fontFamily: "monospace" }}>
              {newKeyRaw}
            </code>
            <button
              onClick={() => { navigator.clipboard.writeText(newKeyRaw); }}
              style={{ marginTop: 10, background: "#C8FF00", color: "#000", border: "none", borderRadius: 6, padding: "8px 18px", fontWeight: 700, fontSize: 12, cursor: "pointer" }}
            >
              Copy
            </button>
            <button
              onClick={() => setNewKeyRaw(null)}
              style={{ marginTop: 10, marginLeft: 8, background: "none", color: "#555", border: "1px solid #1e1e1e", borderRadius: 6, padding: "8px 14px", fontSize: 12, cursor: "pointer" }}
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Create form */}
        <div style={card}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: "#fff", margin: "0 0 16px" }}>Create new key</h2>
          <form onSubmit={handleCreate} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="Key name (e.g. production, ci-pipeline)"
              maxLength={64}
              required
              style={{ flex: 1, minWidth: 220, background: "#060608", border: "1px solid #1e1e1e", borderRadius: 8, padding: "10px 14px", color: "#e0e0e0", fontSize: 13, fontFamily: "var(--font-body)", outline: "none" }}
            />
            <button
              type="submit"
              disabled={creating || !newKeyName.trim()}
              style={{ background: "#C8FF00", color: "#000", border: "none", borderRadius: 8, padding: "10px 20px", fontWeight: 700, fontSize: 13, cursor: creating ? "not-allowed" : "pointer", opacity: creating ? 0.6 : 1 }}
            >
              {creating ? "Creating…" : "Create Key"}
            </button>
          </form>
          <p style={{ margin: "10px 0 0", fontSize: 11, color: "#333" }}>Max 5 active keys. Keys use the <code style={{ color: "#555" }}>pk_live_</code> prefix.</p>
        </div>

        {/* Key list */}
        <div style={card}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: "#fff", margin: "0 0 16px" }}>
            Active keys <span style={{ color: "#555", fontWeight: 400, fontSize: 13 }}>({keys.length}/5)</span>
          </h2>

          {loading ? (
            <p style={{ color: "#555", fontSize: 13 }}>Loading…</p>
          ) : keys.length === 0 ? (
            <p style={{ color: "#555", fontSize: 13 }}>No keys yet. Create one above.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ color: "#555", fontSize: 11, letterSpacing: "0.08em", textAlign: "left" }}>
                  <th style={{ padding: "0 0 12px", fontWeight: 600 }}>NAME</th>
                  <th style={{ padding: "0 0 12px", fontWeight: 600 }}>PREFIX</th>
                  <th style={{ padding: "0 0 12px", fontWeight: 600 }}>CREATED</th>
                  <th style={{ padding: "0 0 12px", fontWeight: 600 }}>LAST USED</th>
                  <th style={{ padding: "0 0 12px", fontWeight: 600 }}></th>
                </tr>
              </thead>
              <tbody>
                {keys.map((k) => (
                  <tr key={k.id} style={{ borderTop: "1px solid #1e1e1e" }}>
                    <td style={{ padding: "12px 0", color: "#e0e0e0", fontWeight: 600 }}>{k.name}</td>
                    <td style={{ padding: "12px 0", color: "#555", fontFamily: "monospace" }}>{k.key_prefix}…</td>
                    <td style={{ padding: "12px 0", color: "#555" }}>{fmtDate(k.created_at)}</td>
                    <td style={{ padding: "12px 0", color: "#555" }}>{k.last_used_at ? fmtDate(k.last_used_at) : "Never"}</td>
                    <td style={{ padding: "12px 0", textAlign: "right" }}>
                      <button
                        onClick={() => handleRevoke(k.id)}
                        disabled={revoking === k.id}
                        style={{ background: "none", border: "1px solid rgba(255,68,68,.25)", borderRadius: 6, padding: "5px 12px", color: "#ff6644", fontSize: 11, cursor: "pointer", opacity: revoking === k.id ? 0.5 : 1 }}
                      >
                        {revoking === k.id ? "Revoking…" : "Revoke"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Usage */}
        <div style={card}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: "#fff", margin: "0 0 14px" }}>Usage</h2>
          <p style={{ fontSize: 13, color: "#aaa", margin: "0 0 12px" }}>Include your key as a Bearer token in the <code style={{ color: "#C8FF00", fontSize: 12 }}>Authorization</code> header:</p>
          <code style={{ display: "block", background: "#060608", border: "1px solid #1e1e1e", borderRadius: 8, padding: "12px 14px", fontSize: 12, color: "#e0e0e0", fontFamily: "monospace", whiteSpace: "pre" }}>
{`curl https://passgeni.ai/api/audit \\
  -H "Authorization: Bearer pk_live_your_key_here"`}
          </code>
          <a href="/api-docs" style={{ display: "inline-block", marginTop: 14, fontSize: 12, color: "#C8FF00", textDecoration: "none" }}>View full API documentation →</a>
        </div>

      </div>
    </PageLayout>
  );
}
