// =============================================================
// PASSGENI — API DOCUMENTATION PAGE
// passgeni.ai/api
// =============================================================
// The developer-facing documentation page.
// Also acts as the sales page for the Team plan.
// Interactive code examples. Live endpoint reference.
// =============================================================

import { useState } from "react";
import PageLayout from "../components/layout/PageLayout.js";

// ─── CONSTANTS ────────────────────────────────────────────────
const BASE_URL = "https://passgeni.ai/api/v1";

// ─── REUSABLE COMPONENTS ──────────────────────────────────────

function CodeBlock({ code, language = "bash", label }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div style={{ background: "#060608", border: "1px solid #1a1a1a", borderRadius: 10, overflow: "hidden", marginBottom: 20 }}>
      {label && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 18px", borderBottom: "1px solid #111" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#555", letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</span>
          <button onClick={copy} style={{ background: "none", border: "none", fontFamily: "var(--font-mono)", fontSize: 10, color: copied ? "#C8FF00" : "#555", cursor: "pointer", letterSpacing: "0.08em", transition: "color 0.15s" }}>
            {copied ? "✓ copied" : "copy"}
          </button>
        </div>
      )}
      <pre style={{ margin: 0, padding: "20px 22px", fontFamily: "var(--font-mono)", fontSize: 12, color: "#aaa", lineHeight: 1.85, overflowX: "auto", whiteSpace: "pre" }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

function ParamRow({ name, type, required, defaultVal, description }) {
  return (
    <tr>
      <td style={{ padding: "14px 16px", borderBottom: "1px solid #0e0e10", verticalAlign: "top" }}>
        <code style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#C8FF00" }}>{name}</code>
        {required && <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#ff4444", marginLeft: 6, letterSpacing: "0.06em" }}>required</span>}
      </td>
      <td style={{ padding: "14px 16px", borderBottom: "1px solid #0e0e10", verticalAlign: "top" }}>
        <code style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#888" }}>{type}</code>
      </td>
      <td style={{ padding: "14px 16px", borderBottom: "1px solid #0e0e10", verticalAlign: "top" }}>
        <code style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#555" }}>{defaultVal || "—"}</code>
      </td>
      <td style={{ padding: "14px 16px", borderBottom: "1px solid #0e0e10", verticalAlign: "top" }}>
        <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#888", lineHeight: 1.7 }}>{description}</span>
      </td>
    </tr>
  );
}

function SectionAnchor({ id, title }) {
  return (
    <h2 id={id} style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(20px,2.5vw,28px)", color: "#fff", letterSpacing: "-0.02em", marginBottom: 20, marginTop: 64, paddingTop: 16, scrollMarginTop: 80 }}>
      {title}
    </h2>
  );
}

// ─── INTERACTIVE TESTER ───────────────────────────────────────
function LiveTester() {
  const [apiKey,     setApiKey]     = useState("");
  const [profession, setProfession] = useState("developer");
  const [length,     setLength]     = useState(18);
  const [count,      setCount]      = useState(3);
  const [compliance, setCompliance] = useState("");
  const [response,   setResponse]   = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");

  const run = async () => {
    setLoading(true);
    setError("");
    setResponse(null);
    try {
      const body = { profession, length, count };
      if (apiKey.trim()) body.apiKey    = apiKey.trim();
      if (compliance)    body.compliance = compliance;

      const res  = await fetch("/api/v1/generate", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(body),
      });
      const data = await res.json();
      setResponse({ status: res.status, body: data });
    } catch (e) {
      setError("Request failed — check your connection.");
    }
    setLoading(false);
  };

  return (
    <div style={{ background: "#0a0a0c", border: "1px solid #1a1a1a", borderRadius: 14, overflow: "hidden", marginTop: 24 }}>
      <div style={{ padding: "16px 22px", borderBottom: "1px solid #141416", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#C8FF00", animation: "blink 2s ease infinite" }} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#888", letterSpacing: "0.1em" }}>LIVE API TESTER</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, padding: "22px" }}>
        {/* API Key */}
        <div style={{ gridColumn: "1/-1" }}>
          <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
            API Key <span style={{ color: "#555" }}>(optional — leave blank for free tier)</span>
          </label>
          <input
            type="password"
            placeholder="pg_live_... or pg_test_..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            style={{ width: "100%", background: "#060608", border: "1px solid #1a1a1a", borderRadius: 7, padding: "10px 14px", fontFamily: "var(--font-mono)", fontSize: 13, color: "#fff", outline: "none", boxSizing: "border-box" }}
          />
        </div>

        {/* Profession */}
        <div>
          <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>profession</label>
          <select value={profession} onChange={(e) => setProfession(e.target.value)}
            style={{ width: "100%", background: "#060608", border: "1px solid #1a1a1a", borderRadius: 7, padding: "10px 14px", fontFamily: "var(--font-mono)", fontSize: 13, color: "#fff", outline: "none", cursor: "pointer", boxSizing: "border-box" }}>
            {["developer", "doctor", "finance", "designer", "legal", "educator"].map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* Compliance */}
        <div>
          <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>compliance</label>
          <select value={compliance} onChange={(e) => setCompliance(e.target.value)}
            style={{ width: "100%", background: "#060608", border: "1px solid #1a1a1a", borderRadius: 7, padding: "10px 14px", fontFamily: "var(--font-mono)", fontSize: 13, color: "#fff", outline: "none", cursor: "pointer", boxSizing: "border-box" }}>
            <option value="">none</option>
            {["hipaa", "pci", "soc2", "iso", "nist", "dod"].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Length */}
        <div>
          <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
            length: {length}
          </label>
          <input type="range" min={8} max={32} value={length} onChange={(e) => setLength(+e.target.value)} />
        </div>

        {/* Count */}
        <div>
          <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
            count: {count}
          </label>
          <input type="range" min={1} max={10} value={count} onChange={(e) => setCount(+e.target.value)} />
        </div>

        {/* Run */}
        <div style={{ gridColumn: "1/-1" }}>
          <button onClick={run} disabled={loading} className="btn-primary" style={{ fontSize: 14, padding: "12px 28px", animation: "none" }}>
            {loading ? "Running…" : "Run request →"}
          </button>
        </div>
      </div>

      {/* Response */}
      {(response || error) && (
        <div style={{ borderTop: "1px solid #111", padding: "0 22px 22px" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: response?.status === 200 ? "#C8FF00" : "#ff4444", letterSpacing: "0.1em", textTransform: "uppercase", padding: "16px 0 10px" }}>
            {error ? "error" : `HTTP ${response.status}`}
          </div>
          {error
            ? <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#ff8888" }}>{error}</p>
            : (
              <pre style={{ margin: 0, fontFamily: "var(--font-mono)", fontSize: 11, color: "#aaa", lineHeight: 1.85, overflowX: "auto", whiteSpace: "pre-wrap" }}>
                {JSON.stringify(response.body, null, 2)}
              </pre>
            )
          }
        </div>
      )}
    </div>
  );
}

// ─── SIDEBAR NAV ──────────────────────────────────────────────
function SidebarNav() {
  const sections = [
    { id: "overview",       label: "Overview"         },
    { id: "authentication", label: "Authentication"   },
    { id: "rate-limits",    label: "Rate Limits"      },
    { id: "generate",       label: "POST /generate"   },
    { id: "parameters",     label: "Parameters"       },
    { id: "response",       label: "Response Schema"  },
    { id: "errors",         label: "Errors"           },
    { id: "examples",       label: "Code Examples"    },
    { id: "tester",         label: "Live Tester"      },
    { id: "pricing",        label: "Pricing & Limits" },
  ];

  return (
    <nav style={{ position: "sticky", top: 88, width: 200, flexShrink: 0 }} aria-label="API docs navigation">
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#555", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 14 }}>
        Contents
      </div>
      {sections.map(({ id, label }) => (
        <a
          key={id}
          href={`#${id}`}
          style={{ display: "block", fontFamily: "var(--font-body)", fontSize: 13, color: "#888", textDecoration: "none", padding: "6px 0", borderLeft: "2px solid transparent", paddingLeft: 12, transition: "all 0.15s", lineHeight: 1.4 }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#C8FF00"; e.currentTarget.style.borderLeftColor = "#C8FF00"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "#888";    e.currentTarget.style.borderLeftColor = "transparent"; }}
        >
          {label}
        </a>
      ))}

      <div style={{ marginTop: 28, background: "#0a0a0c", border: "1px solid #C8FF0022", borderRadius: 10, padding: "16px" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#C8FF0066", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>Team plan</div>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#888", lineHeight: 1.7, marginBottom: 12 }}>
          5,000 calls/day. All compliance presets. $29/month.
        </p>
        <a href="#pricing" style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#C8FF00", textDecoration: "none" }}>
          Get started →
        </a>
      </div>
    </nav>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────
export default function APIDocsPage() {
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const startCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const res  = await fetch("/api/paddle/checkout", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({}),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (e) {
      alert("Could not start checkout. Please try again.");
    }
    setCheckoutLoading(false);
  };

  const schema = {
    "@context": "https://schema.org",
    "@type":    "TechArticle",
    "name":     "PassGeni API Documentation",
    "description": "Complete API documentation for the PassGeni password generation API. REST endpoint, parameters, rate limits, and code examples in JavaScript, Python, and curl.",
    "url":      "https://passgeni.ai/api",
  };

  return (
    <PageLayout
      title="API Documentation — PassGeni Password Generation API"
      description="PassGeni REST API for developers. Generate secure, compliance-ready passwords programmatically. Free tier: 50 calls/day. Team: 5,000/day. Full documentation with examples."
      canonical="https://passgeni.ai/api"
      schema={schema}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px var(--page-pad) 120px" }}>

        {/* ── Page header ── */}
        <div style={{ marginBottom: 60 }}>
          <nav aria-label="Breadcrumb" style={{ marginBottom: 24 }}>
            <a href="/" style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#888", textDecoration: "none" }}>PassGeni</a>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#444", margin: "0 8px" }}>→</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#C8FF00" }}>API Docs</span>
          </nav>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>
            REST API · v1
          </div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(30px,4.5vw,54px)", color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 16 }}>
            PassGeni API<br /><span style={{ color: "#C8FF00" }}>Documentation.</span>
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 16, color: "#888", lineHeight: 1.8, maxWidth: 560 }}>
            Generate cryptographically secure, compliance-ready passwords programmatically.
            One endpoint. JSON in, passwords out. No setup beyond an API key.
          </p>

          {/* Quick stats */}
          <div style={{ display: "flex", gap: 24, marginTop: 28, flexWrap: "wrap" }}>
            {[
              { label: "Base URL",    value: BASE_URL },
              { label: "Auth",        value: "API key in body" },
              { label: "Format",      value: "JSON" },
              { label: "Free tier",   value: "50 calls/day" },
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#555", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
                <code style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#aaa" }}>{value}</code>
              </div>
            ))}
          </div>
        </div>

        {/* ── Two-column layout: sidebar + content ── */}
        <div style={{ display: "flex", gap: 60, alignItems: "flex-start" }}>

          {/* Sidebar — hidden on mobile */}
          <div style={{ display: "block" }} className="nav-trust-row">
            <SidebarNav />
          </div>

          {/* Main content */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* ── OVERVIEW ── */}
            <SectionAnchor id="overview" title="Overview" />
            <p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "#aaa", lineHeight: 1.85, marginBottom: 20 }}>
              The PassGeni API lets you generate secure passwords at scale — in your backend, during user onboarding,
              for credential rotation, or any programmatic use case. One endpoint. No SDK required.
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "#aaa", lineHeight: 1.85 }}>
              The free tier gives you 50 calls per day with no API key. The Team plan ($29/month) gives you
              5,000 calls/day, all compliance presets, and bulk generation up to 500 passwords per request.
            </p>

            {/* ── AUTHENTICATION ── */}
            <SectionAnchor id="authentication" title="Authentication" />
            <p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "#aaa", lineHeight: 1.85, marginBottom: 20 }}>
              Pass your API key in the request body as <code style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#C8FF00", background: "#C8FF0011", padding: "2px 6px", borderRadius: 4 }}>apiKey</code>.
              No Authorization header required. Free tier requests work without any key.
            </p>
            <CodeBlock
              label="Example — authenticated request"
              code={`curl -X POST https://passgeni.ai/api/v1/generate \\
  -H "Content-Type: application/json" \\
  -d '{
    "apiKey":     "pg_live_your_key_here",
    "profession": "developer",
    "length":     20,
    "count":      5
  }'`}
            />
            <div style={{ background: "#0a0806", border: "1px solid #ff440022", borderRadius: 10, padding: "14px 18px", marginBottom: 24 }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#ff8866", margin: 0, lineHeight: 1.7 }}>
                ⚠️ Never expose your API key in client-side code or public repositories. Use environment variables.
                API keys can be rotated from your dashboard at any time.
              </p>
            </div>

            {/* ── RATE LIMITS ── */}
            <SectionAnchor id="rate-limits" title="Rate Limits" />
            <div style={{ background: "#0a0a0c", border: "1px solid #141416", borderRadius: 12, overflow: "hidden", marginBottom: 24 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #1a1a1a" }}>
                    {["Tier", "Calls / day", "Max count per request", "Compliance presets"].map((h) => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", letterSpacing: "0.1em", textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { tier: "Free (no key)", calls: "50 / day",   count: "10",  compliance: "—"   },
                    { tier: "Team",          calls: "5,000 / day", count: "500", compliance: "All" },
                  ].map(({ tier, calls, count, compliance }) => (
                    <tr key={tier} style={{ borderBottom: "1px solid #0e0e10" }}>
                      <td style={{ padding: "14px 16px" }}><span style={{ fontFamily: "var(--font-body)", fontSize: 14, color: tier === "Team" ? "#C8FF00" : "#ccc" }}>{tier}</span></td>
                      <td style={{ padding: "14px 16px" }}><code style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#aaa" }}>{calls}</code></td>
                      <td style={{ padding: "14px 16px" }}><code style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#aaa" }}>{count}</code></td>
                      <td style={{ padding: "14px 16px" }}><code style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: compliance === "All" ? "#C8FF00" : "#555" }}>{compliance}</code></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#aaa", lineHeight: 1.8, marginBottom: 24 }}>
              Rate limit headers are returned on every response:
            </p>
            <CodeBlock
              label="Rate limit headers"
              code={`X-RateLimit-Limit:     5000
X-RateLimit-Remaining: 4997
X-RateLimit-Reset:     1704067200000`}
            />

            {/* ── ENDPOINT ── */}
            <SectionAnchor id="generate" title="POST /v1/generate" />
            <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#0a0a0c", border: "1px solid #C8FF0022", borderRadius: 10, padding: "16px 20px", marginBottom: 24 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#fff", background: "#C8FF0022", border: "1px solid #C8FF0044", borderRadius: 6, padding: "4px 10px", letterSpacing: "0.06em" }}>POST</span>
              <code style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "#aaa" }}>{BASE_URL}/generate</code>
            </div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "#aaa", lineHeight: 1.85, marginBottom: 24 }}>
              Generates one or more secure passwords. All parameters are optional — sensible defaults apply.
              Returns a JSON object containing the generated passwords plus audit metadata.
            </p>

            {/* ── PARAMETERS ── */}
            <SectionAnchor id="parameters" title="Request Parameters" />
            <div style={{ background: "#0a0a0c", border: "1px solid #141416", borderRadius: 12, overflow: "hidden", marginBottom: 24 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #1a1a1a" }}>
                    {["Parameter", "Type", "Default", "Description"].map((h) => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", letterSpacing: "0.1em", textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <ParamRow name="apiKey"     type="string"  required={false} defaultVal="null"       description="Your Team API key. Omit for free tier (50 calls/day)." />
                  <ParamRow name="profession" type="string"  required={false} defaultVal='"general"'  description='Influences password seed. Options: "developer", "doctor", "finance", "designer", "legal", "educator", or any custom string.' />
                  <ParamRow name="length"     type="number"  required={false} defaultVal="18"         description="Password length. Range: 8–32. Compliance presets may enforce a higher minimum." />
                  <ParamRow name="count"      type="number"  required={false} defaultVal="1"          description="Number of passwords to generate. Free: max 10. Team: max 500." />
                  <ParamRow name="compliance" type="string"  required={false} defaultVal="null"       description='Compliance preset. Options: "hipaa", "pci", "soc2", "iso", "nist", "dod". Team plan only.' />
                  <ParamRow name="mode"       type="string"  required={false} defaultVal='"password"' description='Generation mode. "password" or "passphrase".' />
                  <ParamRow name="quantum"    type="boolean" required={false} defaultVal="false"      description="Enable post-quantum mode. Sets minimum length 20, expands symbol set." />
                </tbody>
              </table>
            </div>

            {/* ── RESPONSE ── */}
            <SectionAnchor id="response" title="Response Schema" />
            <CodeBlock
              label="200 OK — success response"
              code={`{
  "passwords":  ["nX9#kT2@mP5!qR8$vZ3", "Bz7!deploy#K3@stack"],
  "count":      2,
  "entropy":    131,
  "length":     20,
  "compliance": null,
  "mode":       "password",
  "quantum":    false,
  "tier":       "team",
  "generated":  "2025-01-15T14:23:11.442Z",
  "audit": {
    "entropySource":  "Node.js crypto.randomInt() — FIPS 140-3 aligned",
    "characterPool":  "lower+upper+numbers+symbols",
    "clientSide":     false,
    "serverContact":  true,
    "note":           "API generation is server-side. For zero-knowledge generation, use the web tool at passgeni.ai"
  }
}`}
            />

            {/* ── ERRORS ── */}
            <SectionAnchor id="errors" title="Error Codes" />
            <div style={{ background: "#0a0a0c", border: "1px solid #141416", borderRadius: 12, overflow: "hidden", marginBottom: 24 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #1a1a1a" }}>
                    {["Status", "Error", "Cause"].map((h) => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", letterSpacing: "0.1em", textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { status: "400", error: "Bad request",        cause: "Malformed JSON or invalid parameter types"   },
                    { status: "405", error: "Method not allowed", cause: "Only POST is accepted"                       },
                    { status: "429", error: "Rate limit exceeded", cause: "Too many requests. Check X-RateLimit-Reset" },
                    { status: "500", error: "Generation failed",  cause: "Internal error — try again or contact support" },
                  ].map(({ status, error, cause }) => (
                    <tr key={status} style={{ borderBottom: "1px solid #0e0e10" }}>
                      <td style={{ padding: "14px 16px" }}><code style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: parseInt(status) >= 400 ? "#ff6644" : "#C8FF00" }}>{status}</code></td>
                      <td style={{ padding: "14px 16px" }}><code style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#888" }}>{error}</code></td>
                      <td style={{ padding: "14px 16px" }}><span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#777" }}>{cause}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <CodeBlock
              label="429 rate limit response"
              code={`{
  "error":   "Rate limit exceeded",
  "limit":   50,
  "resetAt": "2025-01-15T15:00:00.000Z",
  "upgrade": "Upgrade to Team for 5,000 calls/day — passgeni.ai/api"
}`}
            />

            {/* ── EXAMPLES ── */}
            <SectionAnchor id="examples" title="Code Examples" />

            <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 16, color: "#fff", marginBottom: 12, marginTop: 28 }}>cURL</h3>
            <CodeBlock
              label="cURL — basic"
              code={`# Free tier — no API key needed
curl -X POST https://passgeni.ai/api/v1/generate \\
  -H "Content-Type: application/json" \\
  -d '{"profession": "developer", "length": 18, "count": 3}'`}
            />
            <CodeBlock
              label="cURL — Team with compliance preset"
              code={`curl -X POST https://passgeni.ai/api/v1/generate \\
  -H "Content-Type: application/json" \\
  -d '{
    "apiKey":     "pg_live_your_key_here",
    "profession": "doctor",
    "length":     18,
    "compliance": "hipaa",
    "count":      10
  }'`}
            />

            <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 16, color: "#fff", marginBottom: 12, marginTop: 28 }}>JavaScript / Node.js</h3>
            <CodeBlock
              label="Node.js — async/await"
              code={`const response = await fetch("https://passgeni.ai/api/v1/generate", {
  method:  "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    apiKey:     process.env.PASSGENI_API_KEY,
    profession: "developer",
    length:     20,
    count:      5,
    compliance: "soc2",
  }),
});

const { passwords, entropy, tier } = await response.json();
// passwords: ["Bz7!deploy#K3@stack", ...]
// entropy:   131
// tier:      "team"`}
            />

            <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 16, color: "#fff", marginBottom: 12, marginTop: 28 }}>Python</h3>
            <CodeBlock
              label="Python — requests"
              code={`import requests, os

response = requests.post(
    "https://passgeni.ai/api/v1/generate",
    json={
        "apiKey":     os.environ["PASSGENI_API_KEY"],
        "profession": "developer",
        "length":     20,
        "count":      5,
        "compliance": "soc2",
    }
)

data      = response.json()
passwords = data["passwords"]
print(f"Generated {len(passwords)} passwords, entropy: {data['entropy']} bits")`}
            />

            <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 16, color: "#fff", marginBottom: 12, marginTop: 28 }}>PHP</h3>
            <CodeBlock
              label="PHP — cURL"
              code={`$response = file_get_contents("https://passgeni.ai/api/v1/generate", false,
  stream_context_create([
    "http" => [
      "method"  => "POST",
      "header"  => "Content-Type: application/json",
      "content" => json_encode([
        "apiKey"     => getenv("PASSGENI_API_KEY"),
        "profession" => "developer",
        "length"     => 20,
        "count"      => 5,
      ]),
    ],
  ])
);

$data = json_decode($response, true);
$passwords = $data["passwords"]; // array of password strings`}
            />

            {/* ── LIVE TESTER ── */}
            <SectionAnchor id="tester" title="Live Tester" />
            <p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "#aaa", lineHeight: 1.8, marginBottom: 4 }}>
              Try the API directly from this page. The free tier works without an API key.
            </p>
            <LiveTester />

            {/* ── PRICING ── */}
            <SectionAnchor id="pricing" title="Pricing & Limits" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
              {[
                {
                  name:     "Free",
                  price:    "$0",
                  color:    "#888",
                  features: ["50 API calls / day", "Max 10 per request", "No API key needed", "Password mode only", "No compliance presets"],
                },
                {
                  name:     "Team",
                  price:    "$29/mo",
                  color:    "#C8FF00",
                  featured: true,
                  badge:    "14-day free trial",
                  features: ["5,000 API calls / day", "Max 500 per request", "All compliance presets", "Password + passphrase", "Post-quantum mode", "5 team seats", "CSV export"],
                },
              ].map((plan) => (
                <div key={plan.name} style={{ background: "#0a0a0c", border: `1px solid ${plan.featured ? "#C8FF0044" : "#1a1a1a"}`, borderRadius: 14, padding: "24px 28px", position: "relative" }}>
                  {plan.badge && (
                    <div style={{ position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)", background: "#C8FF00", color: "#000", fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, padding: "3px 12px", borderRadius: "0 0 6px 6px", letterSpacing: "0.1em", whiteSpace: "nowrap" }}>
                      {plan.badge}
                    </div>
                  )}
                  <div style={{ marginTop: plan.badge ? 14 : 0 }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: plan.color, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>{plan.name}</div>
                    <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 32, color: "#fff", letterSpacing: "-0.03em", marginBottom: 20 }}>{plan.price}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {plan.features.map((f, i) => (
                        <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <span style={{ color: plan.featured ? "#C8FF00" : "#555", fontSize: 11 }}>✓</span>
                          <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: plan.featured ? "#ccc" : "#777" }}>{f}</span>
                        </div>
                      ))}
                    </div>
                    {plan.featured && (
                      <button onClick={startCheckout} disabled={checkoutLoading} className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 20, fontSize: 14, animation: "none" }}>
                        {checkoutLoading ? "Loading…" : "Start free trial →"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#666", lineHeight: 1.7 }}>
              Questions? Email <a href="mailto:hello@passgeni.ai" style={{ color: "#C8FF00", textDecoration: "none" }}>hello@passgeni.ai</a>.
              We reply within 24 hours.
            </p>

          </div>
        </div>
      </div>
    </PageLayout>
  );
}
