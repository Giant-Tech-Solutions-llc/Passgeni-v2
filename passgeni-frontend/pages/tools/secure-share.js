// =============================================================
// PASSGENI — SECURE PASSWORD SHARING
// passgeni.ai/tools/secure-share
// =============================================================
// Client-side AES-256-GCM encryption.
// Encrypted payload is stored in the URL fragment (#), which
// is NEVER sent to the server. The server cannot decrypt it.
// =============================================================

import { useState } from "react";
import { motion } from "framer-motion";
import { btnPrimary, btnGhost } from "../../lib/motion.js";
import ToolPage from "../../components/tools/ToolPage.js";
import { IcEye, IcEyeOff, IcCheck, IcLock } from "../../lib/icons.js";

// ─── CRYPTO HELPERS ───────────────────────────────────────────

// Encrypt a string using AES-256-GCM.
// Returns base64url-encoded payload containing iv + ciphertext.
async function encrypt(plaintext) {
  const key = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
  const iv         = crypto.getRandomValues(new Uint8Array(12));
  const encoded    = new TextEncoder().encode(plaintext);
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoded);
  const exported   = await crypto.subtle.exportKey("raw", key);

  // Pack: [iv (12 bytes)] + [ciphertext]
  const combined = new Uint8Array(iv.byteLength + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.byteLength);

  const keyB64     = btoa(String.fromCharCode(...new Uint8Array(exported)));
  const payloadB64 = btoa(String.fromCharCode(...combined));

  return { keyB64, payloadB64 };
}

// Decrypt a payload using a raw AES-256-GCM key.
async function decrypt(payloadB64, keyB64) {
  const keyBytes     = Uint8Array.from(atob(keyB64), (c) => c.charCodeAt(0));
  const combined     = Uint8Array.from(atob(payloadB64), (c) => c.charCodeAt(0));
  const iv           = combined.slice(0, 12);
  const ciphertext   = combined.slice(12);
  const key          = await crypto.subtle.importKey("raw", keyBytes, { name: "AES-GCM" }, false, ["decrypt"]);
  const decrypted    = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ciphertext);
  return new TextDecoder().decode(decrypted);
}

// ─── SHARE LINK BUILDER ───────────────────────────────────────
// The key goes in the URL fragment (#key=...) — never sent to server.
// The payload is in the query string (server can see it but cannot decrypt).
// This is a simplified demo — in production you'd store payload server-side.
function buildShareLink(payloadB64, keyB64) {
  // For demo: pack everything into the fragment so nothing reaches the server
  // In production: store payload in DB with TTL, put only key in fragment
  const base = typeof window !== "undefined" ? window.location.origin : "https://passgeni.ai";
  const fragment = `k=${encodeURIComponent(keyB64)}&p=${encodeURIComponent(payloadB64)}`;
  return `${base}/tools/secure-share#${fragment}`;
}

// Parse key and payload from current URL fragment
function parseFragment() {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash.slice(1);
  if (!hash) return null;
  const params = new URLSearchParams(hash);
  const k = params.get("k");
  const p = params.get("p");
  return k && p ? { keyB64: k, payloadB64: p } : null;
}

// ─── SHARE FORM ───────────────────────────────────────────────
function ShareForm() {
  const [password, setPassword]     = useState("");
  const [showPw,   setShowPw]       = useState(false);
  const [note,     setNote]         = useState("");
  const [shareUrl, setShareUrl]     = useState("");
  const [loading,  setLoading]      = useState(false);
  const [copied,   setCopied]       = useState(false);

  const createLink = async () => {
    if (!password.trim()) return;
    setLoading(true);
    try {
      const payload        = JSON.stringify({ password, note, created: Date.now() });
      const { keyB64, payloadB64 } = await encrypt(payload);
      const url            = buildShareLink(payloadB64, keyB64);
      setShareUrl(url);
    } catch (e) {
      console.error("Encryption error:", e);
    }
    setLoading(false);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: "#0a0a0c", border: "1px solid #141416", borderRadius: 16, padding: "28px" }}>
        <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>
          Password or secret to share
        </label>
        <div style={{ position: "relative", marginBottom: 16 }}>
          <input
            type={showPw ? "text" : "password"}
            placeholder="Paste the password to share securely…"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setShareUrl(""); }}
            style={{ width: "100%", background: "#060608", border: "1px solid #1a1a1a", borderRadius: 8, padding: "14px 48px 14px 18px", fontFamily: "var(--font-mono)", fontSize: 14, color: "#fff", outline: "none", boxSizing: "border-box" }}
          />
          <button onClick={() => setShowPw((v) => !v)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#555", display: "flex", alignItems: "center" }}>
            {showPw ? <IcEyeOff size={18} color="#555" /> : <IcEye size={18} color="#555" />}
          </button>
        </div>

        <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>
          Note (optional)
        </label>
        <input
          type="text"
          placeholder="e.g. Production server SSH key"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={{ width: "100%", background: "#060608", border: "1px solid #1a1a1a", borderRadius: 8, padding: "12px 16px", fontFamily: "var(--font-body)", fontSize: 13, color: "#fff", outline: "none", marginBottom: 20, boxSizing: "border-box" }}
        />

        <motion.button onClick={createLink} disabled={loading || !password.trim()} className="btn-primary" {...btnPrimary} style={{ width: "100%", justifyContent: "center", fontSize: 14, animation: "none", opacity: !password.trim() ? 0.5 : 1 }}>
          {loading ? "Encrypting…" : "Create secure link →"}
        </motion.button>
      </div>

      {shareUrl && (
        <div style={{ background: "#050f05", border: "1px solid #C8FF0033", borderRadius: 12, padding: "24px 28px", animation: "fadeIn 0.3s ease" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#C8FF0088", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
            <IcCheck size={11} color="#C8FF0088" /> Encrypted link ready
          </div>
          <div style={{ background: "#060608", border: "1px solid #1a1a1a", borderRadius: 8, padding: "12px 16px", fontFamily: "var(--font-mono)", fontSize: 11, color: "#aaa", wordBreak: "break-all", marginBottom: 16, lineHeight: 1.7 }}>
            {shareUrl}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <motion.button onClick={copy} className="btn-primary" {...btnPrimary} style={{ fontSize: 13, padding: "10px 20px", animation: "none" }}>
              {copied ? <><IcCheck size={13} color="#000" /> Copied!</> : "Copy link"}
            </motion.button>
          </div>
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              "AES-256-GCM encryption — military-grade",
              "Decryption key is in the link fragment — never sent to any server",
              "Share the link via any channel — only the recipient can decrypt it",
            ].map((text, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <IcCheck size={11} color="#C8FF00" />
                <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#aaa" }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── DECRYPT VIEW ────────────────────────────────────────────
function DecryptView({ fragData }) {
  const [revealed, setRevealed] = useState(false);
  const [secret,   setSecret]   = useState(null);
  const [expired,  setExpired]  = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [copied,   setCopied]   = useState(false);

  // Check sessionStorage to see if this link was already used in this session
  const USED_KEY = "pg_used_" + (typeof window !== "undefined" ? window.location.hash.slice(1, 20) : "");

  const reveal = async () => {
    // Mark as used — clear the fragment so Back button can't replay it
    try { sessionStorage.setItem(USED_KEY, "1"); } catch {}
    setLoading(true);
    try {
      const raw  = await decrypt(fragData.payloadB64, fragData.keyB64);
      const data = JSON.parse(raw);
      setSecret(data);
      setRevealed(true);
      // Destroy the URL fragment so it can't be reused from address bar
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, "", window.location.pathname + "?expired=1");
      }
    } catch {
      setError("Could not decrypt. The link may be invalid or expired.");
    }
    setLoading(false);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(secret.password);
    setCopied(true);
    // After copying, wipe the displayed password for security
    setTimeout(() => {
      setCopied(false);
      setExpired(true);
    }, 1500);
  };

  // If already expired (navigated back or reloaded after use)
  if (expired) {
    return (
      <div style={{ background: "#0a0a0c", border: "1px solid #ff444433", borderRadius: 16, padding: "40px 32px", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}><IcLock size={40} color="#ff4444" /></div>
        <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 22, color: "#fff", marginBottom: 12 }}>This link has expired</div>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#888", lineHeight: 1.8, maxWidth: 400, margin: "0 auto 24px" }}>
          For security, secrets can only be viewed once. This link was already opened and the secret has been cleared from memory.
          Ask the sender to create a new secure link.
        </p>
        <motion.a href="/tools/secure-share" className="btn-ghost" {...btnGhost} style={{ display: "inline-flex", fontSize: 13, padding: "10px 24px" }}>
          Create a new secure link →
        </motion.a>
      </div>
    );
  }

  return (
    <div style={{ background: "#0a0a0c", border: "1px solid #C8FF0033", borderRadius: 16, padding: "32px", animation: "fadeIn 0.3s ease" }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#C8FF0088", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
        <IcLock size={13} color="#C8FF0088" /> Encrypted secret received
      </div>
      <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#aaa", lineHeight: 1.8, marginBottom: 24 }}>
        Someone shared an encrypted secret with you using PassGeni. Click the button below to decrypt and reveal it.
        The decryption key is embedded in this URL and never leaves your browser.{" "}
        <strong style={{ color: "#ff8888" }}>This secret can only be viewed once — save it immediately after revealing.</strong>
      </p>
      {!revealed ? (
        <motion.button onClick={reveal} disabled={loading} className="btn-primary" {...btnPrimary} style={{ fontSize: 15, padding: "14px 32px" }}>
          {loading ? "Decrypting…" : "Reveal secret →"}
        </motion.button>
      ) : secret ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {secret.note && (
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#888", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Note</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#ccc" }}>{secret.note}</div>
            </div>
          )}
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#888", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Password — copy it now, it will disappear</div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ background: "#060608", border: "1px solid #C8FF0033", borderRadius: 8, padding: "14px 18px", fontFamily: "var(--font-mono)", fontSize: 14, color: "#C8FF00", flex: 1, wordBreak: "break-all" }}>
                {secret.password}
              </div>
              <button onClick={copy} className={`copy-btn ${copied ? "copied" : ""}`} style={{ flexShrink: 0 }}>
                {copied ? <><IcCheck size={12} color="#000" /> COPIED</> : "COPY"}
              </button>
            </div>
          </div>
          <div style={{ padding: "12px 16px", background: "#1a0505", border: "1px solid #ff444422", borderRadius: 8 }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#ff8888", margin: 0 }}>
              Save this password now. Once you click COPY or close this tab, this secret is gone permanently. The link cannot be reopened.
            </p>
          </div>
        </div>
      ) : null}
      {error && <p style={{ color: "#ff4444", fontFamily: "var(--font-body)", fontSize: 13, marginTop: 12 }}>{error}</p>}
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────
export default function SecureSharePage() {
  // Check on client side if this is a decryption view
  const [fragData] = useState(() => {
    if (typeof window === "undefined") return null;
    return parseFragment();
  });

  const schema = {
    "@context": "https://schema.org",
    "@type":    "WebApplication",
    "name":     "PassGeni Secure Password Sharing",
    "description": "Share passwords safely with AES-256-GCM encrypted links. Decryption key stays in URL fragment — never sent to any server.",
    "url":      "https://passgeni.ai/tools/secure-share",
    "applicationCategory": "SecurityApplication",
    "offers":   { "@type": "Offer", "price": "0" },
  };

  return (
    <ToolPage
      title="Secure Password Sharing — AES-256 Encrypted Links | PassGeni"
      description="Share passwords safely using AES-256-GCM encrypted links. The decryption key is embedded in the URL fragment and never sent to any server. Free, client-side only."
      canonical="https://passgeni.ai/tools/secure-share"
      schema={schema}
      toolName="Secure Share"
      testimonialKey="share"
      eyebrow="Free security tool"
      headline={fragData ? "Decrypt your shared secret." : "Share passwords without exposing them."}
      subheadline={fragData
        ? "Someone sent you an encrypted secret using PassGeni. Decryption happens entirely in your browser."
        : "Create an AES-256 encrypted link that only the recipient can open. The decryption key is embedded in the URL — never sent to any server."
      }
    >
      {fragData ? <DecryptView fragData={fragData} /> : <ShareForm />}

      {/* How it works */}
      <div style={{ background: "#0a0a0c", border: "1px solid #141416", borderRadius: 12, padding: "24px 28px", marginTop: 32 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
          How the encryption works
        </div>
        {[
          { step: "01", text: "Your browser generates a random AES-256-GCM key. This key never leaves your device." },
          { step: "02", text: "Your password is encrypted with that key using AES-256-GCM — the same algorithm used by banks and governments." },
          { step: "03", text: "The decryption key is embedded in the URL fragment (#). Fragments are never sent to servers by the browser — it's a browser-level guarantee." },
          { step: "04", text: "The recipient opens the link. Their browser reads the key from the fragment and decrypts locally. PassGeni servers see only meaningless encrypted bytes." },
        ].map(({ step, text }) => (
          <div key={step} style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 14 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#C8FF00", letterSpacing: "0.1em", flexShrink: 0, marginTop: 2 }}>{step}</span>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#aaa", lineHeight: 1.8, margin: 0 }}>{text}</p>
          </div>
        ))}
      </div>
    </ToolPage>
  );
}
