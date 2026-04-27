// =============================================================
// PASSGENI — API DOCUMENTATION PAGE  (v2 — DX-first redesign)
// passgeni.ai/api-docs
// =============================================================

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { btnPrimary, btnGhost } from "../lib/motion.js";
import PageLayout from "../components/layout/PageLayout.js";
import { IcBolt, IcCheck, IcLock, IcSettings, IcKey, IcUser, IcAlert } from "../lib/icons.js";

const BASE = "https://passgeni.ai/api";

// ─── Syntax-highlight a JSON string ──────────────────────────
function JsonHL({ code }) {
  const lines = code.split("\n").map((line, i) => {
    const highlighted = line
      .replace(/("[\w_]+")\s*:/g, '<span style="color:#79c0ff">$1</span>:')
      .replace(/:\s*(".*?")/g, ': <span style="color:#a5d6a7">$1</span>')
      .replace(/:\s*(true|false|null)/g, ': <span style="color:#ff7b72">$1</span>')
      .replace(/:\s*(\d+\.?\d*)/g, ': <span style="color:#ffa657">$1</span>');
    return <div key={i} dangerouslySetInnerHTML={{ __html: highlighted }} />;
  });
  return <>{lines}</>;
}

// ─── Code block with copy ────────────────────────────────────
function CodeBlock({ code, label, json = false, maxH }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(code); } catch(_) {}
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div style={{ background: "#05050a", border: "1px solid rgba(255,255,255,.07)", borderRadius: 12, overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 18px", borderBottom: "1px solid rgba(255,255,255,.05)", background: "rgba(255,255,255,.02)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", gap: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
          </div>
          {label && <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#555", letterSpacing: ".08em" }}>{label}</span>}
        </div>
        <button onClick={copy} style={{ background: copied ? "rgba(200,255,0,.1)" : "none", border: `1px solid ${copied ? "rgba(200,255,0,.25)" : "rgba(255,255,255,.08)"}`, borderRadius: 6, padding: "4px 12px", fontFamily: "var(--font-mono)", fontSize: 10, color: copied ? "#C8FF00" : "#555", cursor: "pointer", transition: "all .15s", display: "inline-flex", alignItems: "center", gap: 4 }}>
          {copied ? <><IcCheck size={10} color="#C8FF00" /> copied</> : "copy"}
        </button>
      </div>
      <div style={{ overflowY: maxH ? "auto" : "visible", maxHeight: maxH, padding: "18px 20px", fontFamily: "var(--font-mono)", fontSize: 12.5, lineHeight: 1.9, color: "#9ca3af", overflowX: "auto", whiteSpace: "pre" }}>
        {json ? <JsonHL code={code} /> : code}
      </div>
    </div>
  );
}

// ─── Tabbed code examples ─────────────────────────────────────
const LANG_EXAMPLES = [
  {
    id: "curl", label: "cURL",
    code: `curl -X POST ${BASE}/generate \\
  -H "Content-Type: application/json" \\
  -d '{
    "apiKey":     "pg_live_your_key_here",
    "profession": "developer",
    "length":     20,
    "count":      5
  }'`,
  },
  {
    id: "js", label: "JavaScript",
    code: `const res = await fetch("${BASE}/generate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    apiKey:     process.env.PASSGENI_API_KEY,
    profession: "developer",
    length:     20,
    count:      5,
    compliance: "hipaa",   // team plan only
  }),
});

const { passwords, entropy } = await res.json();
// passwords → ["nX9#kT2@mP5!qR8$", ...]
// entropy   → 131 bits`,
  },
  {
    id: "python", label: "Python",
    code: `import requests, os

resp = requests.post(
    "${BASE}/generate",
    json={
        "apiKey":     os.environ["PASSGENI_API_KEY"],
        "profession": "finance",
        "length":     20,
        "count":      10,
        "compliance": "pci",
    }
)

data = resp.json()
print(data["passwords"])   # list of strings
print(data["entropy"])     # bits of entropy`,
  },
  {
    id: "php", label: "PHP",
    code: `$data = json_decode(file_get_contents(
    "${BASE}/generate",
    false,
    stream_context_create(["http" => [
        "method"  => "POST",
        "header"  => "Content-Type: application/json",
        "content" => json_encode([
            "apiKey"     => getenv("PASSGENI_API_KEY"),
            "profession" => "developer",
            "length"     => 20,
            "count"      => 5,
        ]),
    ]])
), true);

$passwords = $data["passwords"]; // string[]`,
  },
  {
    id: "python-webhook", label: "Python (webhook)",
    code: `# Auto-generate passwords on new user signup
# Works with Flask, FastAPI, Django — any framework

from flask import Flask, request, jsonify
import requests, os

app = Flask(__name__)

@app.route("/webhook/new-user", methods=["POST"])
def on_new_user():
    user = request.json

    # Generate a secure onboarding password
    resp = requests.post("${BASE}/generate", json={
        "apiKey":     os.environ["PASSGENI_API_KEY"],
        "profession": user.get("role", "general"),
        "length":     18,
        "count":      1,
    })
    temp_password = resp.json()["passwords"][0]

    # → email it, store hash, set expiry flag
    send_welcome_email(user["email"], temp_password)
    return jsonify({"ok": True})`,
  },
  {
    id: "node-cron", label: "Node (rotation)",
    code: `// Rotate credentials every 90 days (PCI-DSS Req 8.3.9)
// Run with node-cron, GitHub Actions, or any scheduler

import fetch from "node-fetch";
import { updateUserCredential } from "./db.js";

export async function rotateAllCredentials(userIds) {
  const res = await fetch("${BASE}/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      apiKey:     process.env.PASSGENI_API_KEY,
      compliance: "pci",    // enforces PCI-DSS v4.0 Req 8
      count:      userIds.length,  // up to 500 per request
      length:     16,
    }),
  });

  const { passwords } = await res.json();

  for (const [i, userId] of userIds.entries()) {
    await updateUserCredential(userId, passwords[i]);
    await notifyUser(userId, "Your credential has been rotated.");
  }
}`,
  },
];

// ─── Integration cards ────────────────────────────────────────
const INTEGRATIONS = [
  {
    icon: "settings",
    title: "GitHub Actions / CI-CD",
    desc: "Auto-generate deploy secrets, DB passwords, and env vars on every release pipeline run. Never commit a credential again.",
    badge: "DevOps",
    color: "#79c0ff",
    snippet: `# .github/workflows/rotate-secrets.yml
- name: Rotate DB password
  run: |
    PW=$(curl -s -X POST ${BASE}/generate \\
      -H "Content-Type: application/json" \\
      -d '{"apiKey":"$PASSGENI_KEY","compliance":"soc2","count":1}' \\
      | jq -r '.passwords[0]')
    echo "::add-mask::$PW"   # mask from logs
    gh secret set DB_PASSWORD --body "$PW"`,
  },
  {
    icon: "bolt",
    title: "Zapier / Make / n8n",
    desc: "No-code automation. Trigger a PassGeni API call on any event — new user, form submission, Salesforce record — and pipe the password anywhere.",
    badge: "No-Code",
    color: "#ffa657",
    snippet: `// Zapier "Run JavaScript" step
const response = await fetch("${BASE}/generate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    apiKey: "pg_live_...",
    profession: inputData.department,
    count: 1,
  }),
});
const { passwords } = await response.json();
return { password: passwords[0] };`,
  },
  {
    icon: "user",
    title: "Healthcare Onboarding",
    desc: "Generate HIPAA §164.312(d)-compliant credentials for new staff. One API call returns a temporary password that meets your IT policy on day one.",
    badge: "HIPAA",
    color: "#4fc3f7",
    snippet: `# On-call script — new staff member joins
import requests, os

def onboard_staff(name, role, email):
    pw = requests.post("${BASE}/generate", json={
        "apiKey":     os.environ["PASSGEN_KEY"],
        "profession": role,           # "doctor", "nurse", etc.
        "compliance": "hipaa",        # enforces 12+ chars
        "count":      1,
    }).json()["passwords"][0]

    send_secure_email(email, name, pw)
    set_force_change_on_login(email)`,
  },
  {
    icon: "key",
    title: "PCI-DSS Compliance Automation",
    desc: "Enforce PCI-DSS v4.0 Requirement 8 across every credential your system manages. The API rejects non-compliant requests and returns the exact standard cite.",
    badge: "PCI-DSS",
    color: "#ffb74d",
    snippet: `// Monthly credential rotation — PCI-DSS Req 8.3.9
const { passwords } = await passgeni.generate({
  compliance: "pci",   // enforces: 12+ chars, upper+lower+num+sym
  count: accountIds.length,  // up to 500 at once
});

for (const [i, id] of accountIds.entries()) {
  await db.rotateCredential(id, passwords[i]);
  await audit.log(id, "rotated", "pci-req-8");
}`,
  },
  {
    icon: "settings",
    title: "WordPress / PHP Apps",
    desc: "Add a 'Generate strong password' button to any PHP form. Three lines of code. No plugin needed. Works on any WordPress, Laravel, or plain PHP project.",
    badge: "PHP",
    color: "#ce93d8",
    snippet: `<?php
// add_action('user_register', 'pg_set_secure_password');
function pg_set_secure_password($user_id) {
    $resp = wp_remote_post("${BASE}/generate", [
        "body"    => json_encode(["count" => 1, "length" => 18]),
        "headers" => ["Content-Type" => "application/json"],
    ]);
    $pw = json_decode(wp_remote_retrieve_body($resp))->passwords[0];
    wp_set_password($pw, $user_id);
}`,
  },
  {
    icon: "bolt",
    title: "Slack Bots & Internal Tools",
    desc: "Let your team request a compliant password via Slack slash command. The bot calls PassGeni, DMs the result, and logs the action — all in under a second.",
    badge: "Slack",
    color: "#a5d6a7",
    snippet: `// Slack bolt app — /genpassword command
app.command("/genpassword", async ({ command, ack, client }) => {
  await ack();
  const { passwords } = await passgeni({
    compliance: command.text || null,  // /genpassword hipaa
    count: 1,
  });
  await client.chat.postEphemeral({
    channel: command.channel_id,
    user: command.user_id,
    text: "🔐 Your password: \`" + passwords[0] + "\`",
  });
});`,
  },
];

// ─── Quick param cards ────────────────────────────────────────
const PARAMS = [
  { name: "apiKey",     type: "string",  req: false, def: "null",        color: "#79c0ff", note: "Your Team key. Leave blank for free tier (50 calls/day)." },
  { name: "profession", type: "string",  req: false, def: '"developer"', color: "#a5d6a7", note: "Seeds the generator: developer · doctor · finance · designer · legal · educator" },
  { name: "length",     type: "number",  req: false, def: "18",          color: "#ffa657", note: "Password length. Range 8–32. Compliance presets enforce a higher minimum." },
  { name: "count",      type: "number",  req: false, def: "1",           color: "#ffa657", note: "How many passwords to return. Free: max 10. Team: max 500 per request." },
  { name: "compliance", type: "string",  req: false, def: "null",        color: "#ffb74d", note: "hipaa · pci · soc2 · iso · nist · dod — Assurance or Authority plan only. Enforces the exact standard." },
  { name: "mode",       type: "string",  req: false, def: '"password"',  color: "#ce93d8", note: '"password" for standard, "passphrase" for memorable word-based credentials.' },
  { name: "quantum",    type: "boolean", req: false, def: "false",       color: "#ef9a9a", note: "Post-quantum mode: 512-bit entropy, expanded symbol set, 20-char minimum." },
];

// ─── Sidebar links ────────────────────────────────────────────
const NAV_SECTIONS = [
  { id: "quickstart",     label: "Quickstart — 30 sec" },
  { id: "how-it-works",   label: "How it works"         },
  { id: "integrations",   label: "Integrations"         },
  { id: "authentication", label: "Authentication"        },
  { id: "rate-limits",    label: "Rate limits"           },
  { id: "parameters",     label: "Parameters"            },
  { id: "response",       label: "Response schema"       },
  { id: "errors",         label: "Error codes"           },
  { id: "examples",       label: "Code examples"         },
  { id: "tester",         label: "Live tester"           },
  { id: "pricing",        label: "Plans & pricing"       },
];

// ─── Live tester ──────────────────────────────────────────────
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
    setLoading(true); setError(""); setResponse(null);
    try {
      const body = { profession, length, count };
      if (apiKey.trim()) body.apiKey    = apiKey.trim();
      if (compliance)    body.compliance = compliance;
      const res  = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      setResponse({ status: res.status, body: data });
    } catch { setError("Request failed — check your connection."); }
    setLoading(false);
  };

  const SELECT = { width: "100%", background: "#08080d", border: "1px solid rgba(255,255,255,.08)", borderRadius: 8, padding: "10px 14px", fontFamily: "var(--font-mono)", fontSize: 13, color: "#ccc", outline: "none", cursor: "pointer", boxSizing: "border-box" };
  const INPUT  = { ...SELECT, cursor: "text" };

  return (
    <div style={{ background: "rgba(5,5,10,.95)", border: "1px solid rgba(200,255,0,.12)", borderRadius: 16, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "14px 22px", borderBottom: "1px solid rgba(255,255,255,.05)", display: "flex", alignItems: "center", gap: 10, background: "rgba(200,255,0,.03)" }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#C8FF00", boxShadow: "0 0 8px rgba(200,255,0,.6)", animation: "livePulse 2s ease-in-out infinite" }} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#C8FF00", letterSpacing: ".12em" }}>LIVE API TESTER — runs a real request</span>
      </div>

      <div style={{ padding: "22px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          {/* API key */}
          <div style={{ gridColumn: "1/-1" }}>
            <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 9, color: "#555", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 6 }}>
              apiKey <span style={{ color: "#333" }}>— optional, leave blank for free tier</span>
            </label>
            <input type="password" placeholder="pg_live_…" value={apiKey} onChange={e => setApiKey(e.target.value)}
              style={{ ...INPUT, fontSize: 13 }}
              onFocus={e => (e.currentTarget.style.borderColor = "rgba(200,255,0,.3)")}
              onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,.08)")} />
          </div>

          {/* Profession */}
          <div>
            <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 9, color: "#555", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 6 }}>profession</label>
            <select value={profession} onChange={e => setProfession(e.target.value)} style={SELECT}>
              {["developer","doctor","finance","designer","legal","educator","general"].map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          {/* Compliance */}
          <div>
            <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 9, color: "#555", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 6 }}>
              compliance <span style={{ color: "#333" }}>paid plans only</span>
            </label>
            <select value={compliance} onChange={e => setCompliance(e.target.value)} style={SELECT}>
              <option value="">none</option>
              {["hipaa","pci","soc2","iso","nist","dod"].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Length */}
          <div>
            <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 9, color: "#555", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 8 }}>
              length: <span style={{ color: "#C8FF00" }}>{length}</span>
            </label>
            <input type="range" min={8} max={32} value={length} onChange={e => setLength(+e.target.value)} style={{ width: "100%" }} />
          </div>

          {/* Count */}
          <div>
            <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 9, color: "#555", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 8 }}>
              count: <span style={{ color: "#C8FF00" }}>{count}</span>
            </label>
            <input type="range" min={1} max={10} value={count} onChange={e => setCount(+e.target.value)} style={{ width: "100%" }} />
          </div>
        </div>

        <motion.button onClick={run} disabled={loading} className="btn-primary" {...btnPrimary} style={{ width: "100%", justifyContent: "center", fontSize: 13 }}>
          {loading ? "Running…" : "Run request →"}
        </motion.button>
      </div>

      {/* Response */}
      <AnimatePresence>
        {(response || error) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
            style={{ borderTop: "1px solid rgba(255,255,255,.05)", overflow: "hidden" }}>
            <div style={{ padding: "18px 22px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: error ? "#ff4444" : response?.status === 200 ? "#C8FF00" : "#ffaa00" }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: error ? "#ff6644" : response?.status === 200 ? "#C8FF00" : "#ffaa00", letterSpacing: ".1em" }}>
                  {error ? "CONNECTION ERROR" : `HTTP ${response.status}`}
                </span>
              </div>
              {error
                ? <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#ff8888", margin: 0 }}>{error}</p>
                : (
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "#9ca3af", lineHeight: 1.9, overflowX: "auto", whiteSpace: "pre-wrap" }}>
                    <JsonHL code={JSON.stringify(response.body, null, 2)} />
                  </div>
                )
              }
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Integration card ─────────────────────────────────────────
function IntegrationCard({ item, isOpen, onToggle }) {
  return (
    <div style={{ background: "rgba(8,8,13,.9)", border: `1px solid ${isOpen ? `${item.color}30` : "rgba(255,255,255,.06)"}`, borderRadius: 14, overflow: "hidden", transition: "border-color .25s" }}>
      <button
        onClick={onToggle}
        style={{ width: "100%", background: "none", border: "none", padding: "20px 22px", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "flex-start", gap: 14 }}
      >
        <div style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0, background: `${item.color}10`, border: `1px solid ${item.color}25`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {item.icon === "bolt" && <IcBolt size={20} color={item.color} />}
          {item.icon === "settings" && <IcSettings size={20} color={item.color} />}
          {item.icon === "user" && <IcUser size={20} color={item.color} />}
          {item.icon === "key" && <IcKey size={20} color={item.color} />}
          {item.icon === "lock" && <IcLock size={20} color={item.color} />}
          {item.icon === "alert" && <IcAlert size={20} color={item.color} />}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
            <span style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 15, color: "#e0e0e0" }}>{item.title}</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: item.color, background: `${item.color}12`, border: `1px solid ${item.color}25`, borderRadius: 100, padding: "2px 8px", letterSpacing: ".08em", flexShrink: 0 }}>{item.badge}</span>
          </div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#666", lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
        </div>
        <motion.span animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.2 }}
          style={{ color: "rgba(200,255,0,.4)", fontSize: 22, lineHeight: 1, flexShrink: 0, fontWeight: 300 }}>+</motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="code" initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }} style={{ overflow: "hidden" }}>
            <div style={{ padding: "0 22px 22px" }}>
              <CodeBlock code={item.snippet} label={`${item.title} — example`} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Section header ───────────────────────────────────────────
function SH({ id, eyebrow, title }) {
  return (
    <div id={id} style={{ paddingTop: 72, scrollMarginTop: 80, marginBottom: 28 }}>
      <p style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "rgba(200,255,0,.6)", letterSpacing: ".16em", textTransform: "uppercase", marginBottom: 8 }}>{eyebrow}</p>
      <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(20px,2.5vw,28px)", color: "#fff", letterSpacing: "-.02em", lineHeight: 1.1, margin: 0 }}>{title}</h2>
    </div>
  );
}

const METHOD_COLOR = { GET: "#3b82f6", POST: "#22c55e", DELETE: "#ef4444", PATCH: "#f59e0b" };

// ─── PAGE ─────────────────────────────────────────────────────
const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "name": "PassGeni API Documentation",
  "description": "Complete API documentation for the PassGeni password generation API. REST endpoint, code examples in 6 languages, live tester, and integration guides for CI/CD, Zapier, healthcare, and more.",
  "url": "https://passgeni.ai/api-docs",
};

export default function APIDocsPage() {
  const [activeLang,        setActiveLang]        = useState("js");
  const [openIntegration,   setOpenIntegration]   = useState(null);
  const [activeSection,     setActiveSection]      = useState("quickstart");
  const observerRef = useRef(null);

  // Intersection observer for active sidebar link
  useEffect(() => {
    if (typeof window === "undefined") return;
    const ids = NAV_SECTIONS.map(s => s.id);
    const targets = ids.map(id => document.getElementById(id)).filter(Boolean);
    observerRef.current = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );
    targets.forEach(t => observerRef.current.observe(t));
    return () => observerRef.current?.disconnect();
  }, []);

  const activeLangData = LANG_EXAMPLES.find(l => l.id === activeLang) || LANG_EXAMPLES[0];

  return (
    <PageLayout
      title="PassGeni API — Password Generation API for Developers"
      description="Generate HIPAA, PCI-DSS, and NIST-compliant passwords via REST API. Free tier: 50 calls/day. Team: 5,000/day. Works with Node.js, Python, PHP, cURL, Zapier, GitHub Actions, and more."
      canonical="https://passgeni.ai/api-docs"
      schema={SCHEMA}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "56px var(--page-pad) 120px" }}>

        {/* ── Hero ─────────────────────────────────────────── */}
        <div style={{ maxWidth: 760, marginBottom: 64 }}>
          <nav aria-label="Breadcrumb" style={{ marginBottom: 20 }}>
            <a href="/" style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#555", textDecoration: "none" }}>PassGeni</a>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#333", margin: "0 8px" }}>→</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#C8FF00" }}>API Docs</span>
          </nav>

          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <p className="eyebrow">REST API · v1 · JSON</p>
            <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(32px,5vw,60px)", color: "#fff", letterSpacing: "-.04em", lineHeight: .98, marginBottom: 20 }}>
              Generate secure passwords<br />
              <span style={{ color: "var(--accent)" }}>from any app. In 3 lines.</span>
            </h1>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(15px,1.6vw,17px)", color: "var(--muted)", lineHeight: 1.8, maxWidth: 540, margin: "0 0 32px" }}>
              One REST endpoint. No SDK, no install, no account required for the free tier.
              Send JSON, get passwords back. Works with any language, any framework, any no-code tool.
            </p>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <motion.a href="#quickstart" className="btn-primary" {...btnPrimary}>Start in 30 seconds →</motion.a>
              <motion.a href="#tester" className="btn-ghost" {...btnGhost}>Try live tester</motion.a>
            </div>
          </motion.div>

          {/* Stat strip */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            style={{ display: "flex", gap: "clamp(16px,3vw,36px)", marginTop: 40, flexWrap: "wrap" }}>
            {[
              { k: "Base URL",  v: BASE },
              { k: "Method",   v: "POST" },
              { k: "Format",   v: "JSON" },
              { k: "Free tier", v: "50 calls/day" },
            ].map(({ k, v }) => (
              <div key={k}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#555", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 4 }}>{k}</div>
                <code style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#aaa" }}>{v}</code>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── 2-col layout ─────────────────────────────────── */}
        <div style={{ display: "flex", gap: "clamp(32px,5vw,72px)", alignItems: "flex-start" }}>

          {/* Sidebar */}
          <nav aria-label="API docs contents" style={{ position: "sticky", top: 84, width: 200, flexShrink: 0, display: "block" }}
            className="api-sidebar">
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: "#444", letterSpacing: ".16em", textTransform: "uppercase", marginBottom: 12 }}>Contents</div>
            {NAV_SECTIONS.map(({ id, label }) => {
              const isActive = activeSection === id;
              return (
                <a key={id} href={`#${id}`}
                  style={{ display: "block", fontFamily: "var(--font-body)", fontSize: 13, color: isActive ? "#C8FF00" : "#666", textDecoration: "none", padding: "5px 0 5px 12px", borderLeft: `2px solid ${isActive ? "#C8FF00" : "transparent"}`, transition: "all .15s", lineHeight: 1.4, marginBottom: 2 }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = "#aaa"; e.currentTarget.style.borderLeftColor = "rgba(200,255,0,.2)"; } }}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = "#666"; e.currentTarget.style.borderLeftColor = "transparent"; } }}>
                  {label}
                </a>
              );
            })}

            {/* Team CTA */}
            <div style={{ marginTop: 28, background: "linear-gradient(135deg,rgba(200,255,0,.07),rgba(10,10,13,.9))", border: "1px solid rgba(200,255,0,.15)", borderRadius: 12, padding: "16px" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: "rgba(200,255,0,.6)", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 6 }}>Assurance / Authority</div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#777", lineHeight: 1.65, marginBottom: 12 }}>1,000–5,000 calls/day · All compliance presets · 500 per request</p>
              <a href="/pricing" style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#C8FF00", textDecoration: "none", letterSpacing: ".06em" }}>from $19/month →</a>
            </div>
          </nav>

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* ═══ QUICKSTART ═══════════════════════════════ */}
            <SH id="quickstart" eyebrow="Getting started" title="From zero to working code in 30 seconds." />
            <p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "#777", lineHeight: 1.8, marginBottom: 32 }}>
              No account. No signup. No API key needed to try it. Just send a POST request.
            </p>

            {/* 3 steps */}
            {[
              {
                n: "1", title: "Pick your language",
                body: "Choose any language below. The API accepts plain JSON — no SDK, no library required.",
              },
              {
                n: "2", title: "Send one POST request",
                body: `POST to <code style="background:rgba(200,255,0,.08);color:#C8FF00;padding:2px 6px;border-radius:4px;font-size:12px">${BASE}/generate</code> with a JSON body. That's it.`,
              },
              {
                n: "3", title: "Use the passwords array",
                body: "The response contains a <code style=\"background:rgba(200,255,0,.08);color:#C8FF00;padding:2px 6px;border-radius:4px;font-size:12px\">passwords</code> array, entropy bits, and an audit object. Done.",
              },
            ].map((s, i) => (
              <motion.div key={s.n}
                initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }}
                style={{ display: "flex", gap: 18, marginBottom: 24 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: "linear-gradient(135deg,rgba(200,255,0,.18),rgba(200,255,0,.04))", border: "1px solid rgba(200,255,0,.2)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 15, color: "#C8FF00", marginTop: 2 }}>{s.n}</div>
                <div>
                  <div style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 15, color: "#e0e0e0", marginBottom: 4 }}>{s.title}</div>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#666", lineHeight: 1.7, margin: 0 }} dangerouslySetInnerHTML={{ __html: s.body }} />
                </div>
              </motion.div>
            ))}

            {/* Tabbed quickstart code */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: -1 }}>
                {LANG_EXAMPLES.slice(0, 4).map(l => (
                  <button key={l.id} onClick={() => setActiveLang(l.id)}
                    style={{
                      background: activeLang === l.id ? "rgba(200,255,0,.1)" : "rgba(255,255,255,.03)",
                      border: `1px solid ${activeLang === l.id ? "rgba(200,255,0,.3)" : "rgba(255,255,255,.07)"}`,
                      borderBottom: activeLang === l.id ? "1px solid #05050a" : undefined,
                      borderRadius: "8px 8px 0 0", padding: "7px 16px",
                      fontFamily: "var(--font-mono)", fontSize: 11,
                      color: activeLang === l.id ? "#C8FF00" : "#666",
                      cursor: "pointer", transition: "all .15s", position: "relative", zIndex: 2,
                    }}>{l.label}</button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={activeLang} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                  <CodeBlock code={activeLangData.code} label={activeLangData.label} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Minimal free-tier example */}
            <div style={{ background: "rgba(200,255,0,.04)", border: "1px solid rgba(200,255,0,.1)", borderRadius: 12, padding: "16px 20px", marginBottom: 8 }}>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "rgba(200,255,0,.6)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 10 }}>Smallest possible request — no API key needed</p>
              <CodeBlock code={`curl -X POST ${BASE}/generate -H "Content-Type: application/json" -d '{}'`} />
              <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#555", margin: "8px 0 0", lineHeight: 1.6 }}>
                Returns 1 password, 18 chars. No account, no key, no setup. Free tier: 50 requests/day per IP.
              </p>
            </div>

            {/* ═══ HOW IT WORKS ══════════════════════════════ */}
            <SH id="how-it-works" eyebrow="Architecture" title="What actually happens when you call the API?" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12, marginBottom: 28 }}>
              {[
                { iconEl: <IcKey size={22} color="#c8ff00" />,      step: "You send JSON",      body: "A POST request with optional parameters. No SDK, no special headers beyond Content-Type." },
                { iconEl: <IcLock size={22} color="#c8ff00" />,     step: "Server generates",   body: "Node.js crypto.randomInt() — the same FIPS 140-3 primitive used in TLS — builds your password on our server." },
                { iconEl: <IcCheck size={22} color="#c8ff00" />,    step: "Standards applied",  body: "If you pass compliance:'hipaa', we enforce HIPAA §164.312(d) minimum requirements before returning." },
                { iconEl: <IcBolt size={22} color="#c8ff00" />,     step: "You get passwords",  body: "A JSON array of passwords plus entropy bits, crack time, and an audit object with the character pool used." },
              ].map((s, i) => (
                <motion.div key={s.step}
                  initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                  className="bc" style={{ position: "relative", overflow: "hidden" }}>
                  <div className="bc-line" />
                  <span style={{ display: "block", marginBottom: 10 }}>{s.iconEl}</span>
                  <div style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 14, color: "#e0e0e0", marginBottom: 6 }}>{s.step}</div>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--muted)", lineHeight: 1.7, margin: 0 }}>{s.body}</p>
                </motion.div>
              ))}
            </div>

            <div style={{ background: "rgba(255,170,0,.05)", border: "1px solid rgba(255,170,0,.15)", borderRadius: 10, padding: "14px 18px", marginBottom: 8 }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#ffaa44", margin: 0, lineHeight: 1.7, display: "flex", alignItems: "flex-start", gap: 8 }}>
                <span style={{ flexShrink: 0, marginTop: 2, display: "flex" }}><IcAlert size={15} color="#ffaa44" /></span><span>API generation is server-side — your password transits our server over HTTPS. For zero-knowledge, client-side generation use the{" "}
                <a href="/" style={{ color: "#ffaa44", textDecoration: "underline" }}>web generator</a>.</span>
              </p>
            </div>

            {/* ═══ INTEGRATIONS ══════════════════════════════ */}
            <SH id="integrations" eyebrow="What can you build with it?" title="Plug PassGeni into anything." />
            <p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "#777", lineHeight: 1.8, marginBottom: 24 }}>
              Because it&apos;s plain JSON over HTTPS, PassGeni works with every language, platform, and no-code tool that can make an HTTP request — which is all of them.
              Click any integration below to see a working code example.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
              {INTEGRATIONS.map((item, i) => (
                <motion.div key={item.title}
                  initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                  <IntegrationCard
                    item={item}
                    isOpen={openIntegration === i}
                    onToggle={() => setOpenIntegration(openIntegration === i ? null : i)}
                  />
                </motion.div>
              ))}
            </div>

            {/* Platform icons */}
            <div style={{ background: "rgba(10,10,13,.8)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 12, padding: "16px 20px", marginBottom: 8, textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#444", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 14 }}>Also works with</p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
                {["Zapier","Make","n8n","GitHub Actions","AWS Lambda","Vercel Edge","Cloudflare Workers","Postman","Insomnia","Laravel","Django","Rails","Spring Boot","Go stdlib","Rust reqwest"].map(t => (
                  <span key={t} style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#555", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.05)", borderRadius: 6, padding: "4px 10px" }}>{t}</span>
                ))}
              </div>
            </div>

            {/* ═══ AUTHENTICATION ════════════════════════════ */}
            <SH id="authentication" eyebrow="Security" title="Authentication" />
            <p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "#777", lineHeight: 1.8, marginBottom: 20 }}>
              Pass your API key as <code style={{ background: "rgba(200,255,0,.08)", color: "#C8FF00", padding: "2px 6px", borderRadius: 4, fontSize: 13 }}>apiKey</code> in the request body.
              Free tier requests need no key at all.
            </p>
            <CodeBlock code={`// Authenticated (Assurance or Authority plan)
{ "apiKey": "pg_live_abc123...", "count": 10 }

// Anonymous (free tier — no key needed, 50 calls/day)
{ "count": 1 }`} label="Authentication — body field" />

            <div style={{ background: "rgba(255,68,68,.05)", border: "1px solid rgba(255,68,68,.18)", borderRadius: 10, padding: "14px 18px", marginBottom: 8 }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#ff8866", margin: 0, lineHeight: 1.75, display: "flex", alignItems: "flex-start", gap: 8 }}>
                <span style={{ flexShrink: 0, marginTop: 2, display: "flex" }}><IcLock size={15} color="#ff8866" /></span><span>Never put your API key in front-end code, browser JS, or a public GitHub repo.
                Use an environment variable (<code style={{ background: "rgba(255,68,68,.1)", padding: "2px 5px", borderRadius: 3 }}>process.env.PASSGENI_API_KEY</code>). Rotate from your{" "}
                <a href="/dashboard" style={{ color: "#ff8866", textDecoration: "underline" }}>dashboard</a> if compromised.</span>
              </p>
            </div>

            {/* ═══ RATE LIMITS ═══════════════════════════════ */}
            <SH id="rate-limits" eyebrow="Quotas" title="Rate limits" />
            <div style={{ background: "rgba(8,8,13,.9)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 12, overflow: "hidden", marginBottom: 20 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,.05)", background: "rgba(255,255,255,.02)" }}>
                    {["Plan","Calls/day","Per request","Compliance","Cost"].map(h => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontFamily: "var(--font-mono)", fontSize: 9, color: "#555", letterSpacing: ".1em", textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,.03)" }}>
                    <td style={{ padding: "14px 16px" }}><span style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#aaa" }}>Free</span></td>
                    <td style={{ padding: "14px 16px" }}><code style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#aaa" }}>50/day (IP)</code></td>
                    <td style={{ padding: "14px 16px" }}><code style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#aaa" }}>10</code></td>
                    <td style={{ padding: "14px 16px" }}><span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#555" }}>—</span></td>
                    <td style={{ padding: "14px 16px" }}><span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#aaa" }}>$0</span></td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,.03)" }}>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#C8FF00", fontWeight: 700 }}>Assurance</span>
                    </td>
                    <td style={{ padding: "14px 16px" }}><code style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#C8FF00" }}>1,000/day</code></td>
                    <td style={{ padding: "14px 16px" }}><code style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#C8FF00" }}>500</code></td>
                    <td style={{ padding: "14px 16px" }}><span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#C8FF00" }}>All 6</span></td>
                    <td style={{ padding: "14px 16px" }}><span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#aaa" }}>$19/mo</span></td>
                  </tr>
                  <tr>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#C8FF00", fontWeight: 700 }}>Authority</span>
                    </td>
                    <td style={{ padding: "14px 16px" }}><code style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#C8FF00" }}>5,000/day</code></td>
                    <td style={{ padding: "14px 16px" }}><code style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#C8FF00" }}>500</code></td>
                    <td style={{ padding: "14px 16px" }}><span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#C8FF00" }}>All 6</span></td>
                    <td style={{ padding: "14px 16px" }}><span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#aaa" }}>$59/mo</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <CodeBlock code={`X-RateLimit-Limit:     5000
X-RateLimit-Remaining: 4995
X-RateLimit-Reset:     1735689600000  // Unix ms — midnight UTC`} label="Rate limit headers (every response)" />

            {/* ═══ PARAMETERS ════════════════════════════════ */}
            <SH id="parameters" eyebrow="Request body" title="Parameters" />
            <p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "#777", lineHeight: 1.8, marginBottom: 20 }}>
              All parameters are optional. An empty body <code style={{ background: "rgba(200,255,0,.06)", color: "#C8FF00", padding: "2px 5px", borderRadius: 4, fontSize: 13 }}>{"{}"}</code> returns one 18-character password with sensible defaults.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
              {PARAMS.map(p => (
                <div key={p.name} style={{ display: "flex", gap: 16, alignItems: "flex-start", background: "rgba(8,8,13,.9)", border: "1px solid rgba(255,255,255,.05)", borderRadius: 10, padding: "14px 18px" }}>
                  <div style={{ flexShrink: 0, minWidth: 100 }}>
                    <code style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: p.color, display: "block", marginBottom: 4 }}>{p.name}</code>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#444" }}>{p.type}</span>
                    {p.req && <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#ff4444", marginLeft: 6 }}>required</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <code style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#444", background: "rgba(255,255,255,.03)", padding: "2px 6px", borderRadius: 4, display: "inline-block", marginBottom: 5 }}>default: {p.def}</code>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#666", lineHeight: 1.65, margin: 0 }}>{p.note}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* ═══ RESPONSE ══════════════════════════════════ */}
            <SH id="response" eyebrow="Response format" title="Response schema" />
            <p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "#777", lineHeight: 1.8, marginBottom: 20 }}>
              Every successful response is <code style={{ background: "rgba(200,255,0,.06)", color: "#C8FF00", padding: "2px 6px", borderRadius: 4, fontSize: 13 }}>HTTP 200</code> with this JSON structure:
            </p>
            <CodeBlock json label="200 OK — example response" code={`{
  "passwords":  ["nX9#kT2@mP5!qR8$vZ", "Bz7!deploy#K3@stack9"],
  "count":      2,
  "entropy":    131,
  "length":     20,
  "compliance": "hipaa",
  "mode":       "password",
  "quantum":    false,
  "tier":       "team",
  "generated":  "2026-04-11T14:23:11.442Z",
  "audit": {
    "entropySource": "Node.js crypto.randomInt() — FIPS 140-3 aligned",
    "characterPool": "lower+upper+numbers+symbols",
    "clientSide":    false,
    "serverContact": true
  }
}`} />

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 10, marginBottom: 20, marginTop: 4 }}>
              {[
                { field: "passwords", desc: "Array of generated password strings" },
                { field: "entropy",   desc: "Bits of entropy in the first password" },
                { field: "tier",      desc: '"free" or "team" — shows which rate limit applied' },
                { field: "audit",     desc: "Character pool and entropy source for compliance evidence" },
              ].map(({ field, desc }) => (
                <div key={field} style={{ background: "rgba(8,8,13,.9)", border: "1px solid rgba(255,255,255,.05)", borderRadius: 8, padding: "12px 14px" }}>
                  <code style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#79c0ff", display: "block", marginBottom: 5 }}>{field}</code>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#666", lineHeight: 1.6, margin: 0 }}>{desc}</p>
                </div>
              ))}
            </div>

            {/* ═══ ERRORS ════════════════════════════════════ */}
            <SH id="errors" eyebrow="Error handling" title="Error codes" />
            <div style={{ background: "rgba(8,8,13,.9)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 12, overflow: "hidden", marginBottom: 20 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,.05)", background: "rgba(255,255,255,.02)" }}>
                    {["Status","Error","What to do"].map(h => (
                      <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontFamily: "var(--font-mono)", fontSize: 9, color: "#555", letterSpacing: ".1em", textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { s: "400", e: "Bad request",         f: "#ffaa44", fix: "Check that length and count are numbers, not strings." },
                    { s: "403", e: "Forbidden",            f: "#ff9977", fix: "You passed a compliance preset without a Team API key." },
                    { s: "405", e: "Method not allowed",   f: "#ff9977", fix: "Use POST. GET is not accepted on this endpoint." },
                    { s: "429", e: "Rate limit exceeded",  f: "#ff6644", fix: "Wait for X-RateLimit-Reset, or upgrade for 5,000/day." },
                    { s: "500", e: "Generation failed",    f: "#ff4444", fix: "Retry once. If it persists, email hello@passgeni.ai." },
                  ].map(({ s, e, f, fix }) => (
                    <tr key={s} style={{ borderBottom: "1px solid rgba(255,255,255,.03)" }}>
                      <td style={{ padding: "13px 16px" }}><code style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: f }}>{s}</code></td>
                      <td style={{ padding: "13px 16px" }}><code style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#888" }}>{e}</code></td>
                      <td style={{ padding: "13px 16px" }}><span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#666" }}>{fix}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <CodeBlock json label="429 — rate limit response body" code={`{
  "error":   "Rate limit exceeded",
  "limit":   50,
  "resetAt": "2026-04-12T00:00:00.000Z",
  "upgrade": "https://passgeni.ai/pricing"
}`} />

            {/* ═══ EXAMPLES ══════════════════════════════════ */}
            <SH id="examples" eyebrow="Ready-to-run examples" title="Code examples" />
            <p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "#777", lineHeight: 1.8, marginBottom: 20 }}>
              All examples work out of the box. Replace <code style={{ background: "rgba(200,255,0,.06)", color: "#C8FF00", padding: "2px 5px", borderRadius: 4, fontSize: 13 }}>pg_live_your_key_here</code> with your API key for Team features.
            </p>

            {/* All language tabs */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: -1 }}>
                {LANG_EXAMPLES.map(l => (
                  <button key={l.id} onClick={() => setActiveLang(l.id)}
                    style={{
                      background: activeLang === l.id ? "rgba(200,255,0,.1)" : "rgba(255,255,255,.03)",
                      border: `1px solid ${activeLang === l.id ? "rgba(200,255,0,.3)" : "rgba(255,255,255,.07)"}`,
                      borderBottom: activeLang === l.id ? "1px solid #05050a" : undefined,
                      borderRadius: "8px 8px 0 0", padding: "7px 14px",
                      fontFamily: "var(--font-mono)", fontSize: 11,
                      color: activeLang === l.id ? "#C8FF00" : "#666",
                      cursor: "pointer", transition: "all .15s", position: "relative", zIndex: 2,
                    }}>{l.label}</button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={activeLang} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                  <CodeBlock code={activeLangData.code} label={activeLangData.label} maxH={400} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ═══ LIVE TESTER ═══════════════════════════════ */}
            <SH id="tester" eyebrow="Interactive" title="Live tester — run a real request" />
            <p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "#777", lineHeight: 1.8, marginBottom: 20 }}>
              This sends a real API request right now. Free tier: no key needed.
              The response is the actual JSON your code would receive.
            </p>
            <LiveTester />

            {/* ═══ PRICING ═══════════════════════════════════ */}
            <SH id="pricing" eyebrow="Plans" title="Plans & pricing" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14, marginBottom: 28 }}>
              {[
                {
                  name: "Free", price: "$0", period: "forever", color: "#888", featured: false,
                  items: ["50 API calls / day", "Max 10 per request", "No API key needed", "Password mode only", "All 6 profession seeds", "No compliance presets"],
                },
                {
                  name: "Assurance", price: "$19", period: "/month", color: "#C8FF00", featured: true, badge: "14-day free trial",
                  items: ["1,000 API calls / day", "Max 500 per request", "All 6 compliance presets", "Passphrase mode", "Post-quantum mode", "Compliance dashboard", "Certificates (50/mo)", "API key rotation"],
                },
                {
                  name: "Authority", price: "$59", period: "/month", color: "#a0d000", featured: false,
                  items: ["5,000 API calls / day", "Max 500 per request", "All 6 compliance presets", "Team workspaces (10 seats)", "Unlimited certificates", "Org policy engine", "CSV bulk export", "Priority support"],
                },
              ].map(plan => (
                <div key={plan.name} style={{ background: "rgba(10,10,14,.9)", border: `1px solid ${plan.featured ? "rgba(200,255,0,.25)" : "rgba(255,255,255,.06)"}`, borderRadius: 16, padding: "28px", position: "relative", overflow: "hidden" }}>
                  {/* Top shimmer */}
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${plan.featured ? "rgba(200,255,0,.4)" : "rgba(255,255,255,.06)"},transparent)`, pointerEvents: "none" }} />
                  {plan.badge && (
                    <div style={{ position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)", background: "#C8FF00", color: "#000", fontFamily: "var(--font-mono)", fontSize: 8, fontWeight: 800, padding: "3px 12px", borderRadius: "0 0 8px 8px", letterSpacing: ".1em", whiteSpace: "nowrap" }}>
                      {plan.badge.toUpperCase()}
                    </div>
                  )}
                  <div style={{ paddingTop: plan.badge ? 16 : 0 }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: plan.color, letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 8 }}>{plan.name}</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 20 }}>
                      <span style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 36, color: "#fff", letterSpacing: "-.04em", lineHeight: 1 }}>{plan.price}</span>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#555" }}>{plan.period}</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 20 }}>
                      {plan.items.map((f, i) => (
                        <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                          <IcCheck size={12} color={plan.featured ? "#C8FF00" : "#444"} />
                          <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: plan.featured ? "#ccc" : "#666" }}>{f}</span>
                        </div>
                      ))}
                    </div>
                    {plan.featured && (
                      <motion.a href="/pricing" className="btn-primary" {...btnPrimary} style={{ display: "flex", justifyContent: "center", fontSize: 13 }}>
                        Start free trial →
                      </motion.a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* ═══ CERTIFICATE API ════════════════════════════ */}
            <div style={{ borderTop: "1px solid #1e1e1e", paddingTop: 48, marginTop: 8 }}>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "rgba(200,255,0,.6)", letterSpacing: ".16em", textTransform: "uppercase", marginBottom: 8 }}>Certificate API</p>
              <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(20px,2.5vw,26px)", color: "#fff", margin: "0 0 14px" }}>Compliance Certificates</h2>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#777", lineHeight: 1.8, marginBottom: 20 }}>
                Issue and manage ES256-signed compliance certificates programmatically.
                Accepts <code style={{ background: "rgba(200,255,0,.08)", color: "#C8FF00", padding: "2px 5px", borderRadius: 4, fontSize: 12 }}>Authorization: Bearer pk_live_…</code> or a session cookie.
                Get your API key from{" "}
                <a href="/dashboard/api-keys" style={{ color: "#C8FF00", textDecoration: "none" }}>the dashboard</a>.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                {[
                  { method: "POST",   path: "/api/generate-certificate", desc: "Issue an ES256-signed compliance certificate for a generated password." },
                  { method: "GET",    path: "/api/audit",                desc: "List your certificates with filtering and pagination. Query params: limit, offset, standard (e.g. HIPAA, NIST-800-63B), date_from (ISO), date_to (ISO), status (valid|revoked|expired)." },
                  { method: "POST",   path: "/api/revoke/[id]",          desc: "Revoke a certificate by ID. Only the owner can revoke." },
                  { method: "GET",    path: "/api/keys",                  desc: "List your active API keys (session cookie required)." },
                  { method: "POST",   path: "/api/keys",                  desc: "Create an API key — returns the raw key once only (session cookie required)." },
                  { method: "DELETE", path: "/api/keys?id=uuid",          desc: "Revoke an API key by ID (session cookie required)." },
                ].map(ep => (
                  <div key={ep.method + ep.path} style={{ display: "flex", gap: 14, alignItems: "flex-start", background: "rgba(8,8,13,.9)", border: "1px solid rgba(255,255,255,.05)", borderRadius: 10, padding: "12px 16px" }}>
                    <span style={{ background: (METHOD_COLOR[ep.method] ?? "#888") + "22", color: METHOD_COLOR[ep.method] ?? "#888", border: `1px solid ${(METHOD_COLOR[ep.method] ?? "#888")}44`, borderRadius: 5, padding: "2px 8px", fontSize: 10, fontWeight: 700, fontFamily: "monospace", minWidth: 52, textAlign: "center", flexShrink: 0 }}>{ep.method}</span>
                    <div>
                      <code style={{ color: "#e0e0e0", fontSize: 12, fontFamily: "monospace" }}>{ep.path}</code>
                      <p style={{ color: "#666", fontSize: 12, margin: "4px 0 0", lineHeight: 1.6 }}>{ep.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#555", lineHeight: 1.7 }}>
              Questions? Email{" "}
              <a href="mailto:hello@passgeni.ai" style={{ color: "#C8FF00", textDecoration: "none" }}>hello@passgeni.ai</a>
              {" "}— we reply within 24 hours.
            </p>

          </div>
        </div>
      </div>

      <style>{`
        @media(max-width:900px){
          .api-sidebar{ display: none !important; }
        }
      `}</style>
    </PageLayout>
  );
}
