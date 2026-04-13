// =============================================================
// PASSGENI — WIFI QR CODE GENERATOR
// passgeni.ai/tools/wifi-qr
// =============================================================
// Generates a WiFi QR code entirely in the browser.
// The password NEVER leaves the device.
// Uses the WiFi QR format: WIFI:T:WPA;S:ssid;P:password;;
// =============================================================

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { btnPrimary } from "../../lib/motion.js";
import ToolPage from "../../components/tools/ToolPage.js";

// ─── QR CODE LIBRARY LOADER ───────────────────────────────────
// Loads qrcode.js from CDN — no npm install needed
function useQRCode() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.QRCode) { setLoaded(true); return; }
    const script  = document.createElement("script");
    script.src    = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
    script.onload = () => setLoaded(true);
    document.head.appendChild(script);
  }, []);

  return loaded;
}

// ─── WIFI QR STRING BUILDER ───────────────────────────────────
function buildWifiString(ssid, password, security, hidden) {
  // Escape special chars in SSID and password per WiFi QR spec
  const escape = (s) => s.replace(/([\\;,":"])/g, "\\$1");
  const hid    = hidden ? "H:true;" : "";
  if (security === "nopass") {
    return `WIFI:T:nopass;S:${escape(ssid)};;`;
  }
  return `WIFI:T:${security};S:${escape(ssid)};P:${escape(password)};${hid};`;
}

// ─── QR CODE RENDERER ─────────────────────────────────────────
function QRDisplay({ wifiString, label }) {
  const containerRef = useRef(null);
  const qrRef        = useRef(null);
  const qrLoaded     = useQRCode();

  useEffect(() => {
    if (!qrLoaded || !wifiString || !containerRef.current) return;
    // Clear previous QR
    containerRef.current.innerHTML = "";

    try {
      qrRef.current = new window.QRCode(containerRef.current, {
        text:          wifiString,
        width:         220,
        height:        220,
        colorDark:     "#060608",
        colorLight:    "#ffffff",
        correctLevel:  window.QRCode.CorrectLevel.H,
      });
    } catch (e) {
      console.error("QR generation error:", e);
    }
  }, [wifiString, qrLoaded]);

  if (!wifiString) return null;

  const download = () => {
    const canvas = containerRef.current?.querySelector("canvas");
    if (!canvas) return;
    const link      = document.createElement("a");
    link.download   = `wifi-${label || "qr"}.png`;
    link.href       = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, animation: "fadeIn 0.4s ease" }}>
      {/* QR Code */}
      <div style={{ background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 0 0 1px #141416, 0 40px 80px #00000088" }}>
        <div ref={containerRef} />
      </div>

      {/* Label */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 16, color: "#fff", marginBottom: 4 }}>
          {label || "WiFi Network"}
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#888" }}>
          Scan to connect instantly
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 10 }}>
        <motion.button onClick={download} className="btn-primary" {...btnPrimary} style={{ fontSize: 13, padding: "12px 24px", animation: "none" }}>
          ↓ Download PNG
        </motion.button>
      </div>

      {/* Privacy note */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#C8FF00", flexShrink: 0, display: "inline-block" }} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#555", letterSpacing: "0.08em" }}>
          Generated entirely in your browser · Password never transmitted
        </span>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────
export default function WifiQRPage() {
  const [ssid,     setSsid]     = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [security, setSecurity] = useState("WPA");
  const [hidden,   setHidden]   = useState(false);
  const [qrString, setQrString] = useState("");

  const generate = () => {
    if (!ssid.trim()) return;
    if (security !== "nopass" && !password.trim()) return;
    setQrString(buildWifiString(ssid.trim(), password, security, hidden));
  };

  const schema = {
    "@context": "https://schema.org",
    "@type":    "WebApplication",
    "name":     "PassGeni WiFi QR Code Generator",
    "description": "Generate a QR code for your WiFi network. Anyone scans to connect instantly. Your password never leaves your browser.",
    "url":      "https://passgeni.ai/tools/wifi-qr",
    "applicationCategory": "SecurityApplication",
    "offers":   { "@type": "Offer", "price": "0" },
  };

  return (
    <ToolPage
      title="WiFi QR Code Generator — Free, Private, Client-Side | PassGeni"
      description="Generate a WiFi QR code in seconds. Anyone scans it to connect instantly — no typing the password. 100% client-side. Your WiFi password never leaves your browser."
      canonical="https://passgeni.ai/tools/wifi-qr"
      schema={schema}
      toolName="WiFi QR Generator"
      testimonialKey="wifi"
      eyebrow="Free tool"
      headline="Generate a WiFi QR code."
      subheadline="Create a QR code for your WiFi network. Anyone scans it to connect instantly — no password typing needed. Everything happens in your browser. Your password is never sent anywhere."
    >
      <div style={{ display: "grid", gridTemplateColumns: qrString ? "1fr 1fr" : "1fr", gap: 24, alignItems: "start" }}>

        {/* ── Form ── */}
        <div style={{ background: "#0a0a0c", border: "1px solid #141416", borderRadius: 16, padding: "28px" }}>

          {/* Network name */}
          <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>
            Network name (SSID)
          </label>
          <input
            type="text"
            placeholder="My Home WiFi"
            value={ssid}
            onChange={(e) => { setSsid(e.target.value); setQrString(""); }}
            style={{ width: "100%", background: "#060608", border: "1px solid #1a1a1a", borderRadius: 8, padding: "12px 16px", fontFamily: "var(--font-body)", fontSize: 14, color: "#fff", outline: "none", marginBottom: 20, boxSizing: "border-box" }}
          />

          {/* Security type */}
          <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>
            Security type
          </label>
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            {[["WPA", "WPA / WPA2"], ["WEP", "WEP"], ["nopass", "Open (no password)"]].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setSecurity(val)}
                className={`toggle-pill ${security === val ? "active" : ""}`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Password */}
          {security !== "nopass" && (
            <>
              <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>
                WiFi password
              </label>
              <div style={{ position: "relative", marginBottom: 20 }}>
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="Your WiFi password…"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setQrString(""); }}
                  style={{ width: "100%", background: "#060608", border: "1px solid #1a1a1a", borderRadius: 8, padding: "12px 48px 12px 16px", fontFamily: "var(--font-mono)", fontSize: 14, color: "#fff", outline: "none", boxSizing: "border-box" }}
                />
                <button onClick={() => setShowPw((v) => !v)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#555" }}>
                  {showPw ? "🙈" : "👁"}
                </button>
              </div>
            </>
          )}

          {/* Hidden network option */}
          <label style={{ display: "flex", gap: 10, alignItems: "center", cursor: "pointer", marginBottom: 24 }}>
            <input type="checkbox" checked={hidden} onChange={(e) => setHidden(e.target.checked)} style={{ accentColor: "#C8FF00" }} />
            <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#aaa" }}>Hidden network (not broadcast)</span>
          </label>

          <motion.button
            onClick={generate}
            disabled={!ssid.trim() || (security !== "nopass" && !password.trim())}
            className="btn-primary"
            {...btnPrimary}
            style={{ width: "100%", justifyContent: "center", fontSize: 14, animation: "none", opacity: (!ssid.trim() || (security !== "nopass" && !password.trim())) ? 0.5 : 1 }}
          >
            Generate QR code →
          </motion.button>

          {/* Tips */}
          <div style={{ marginTop: 20 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#555", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
              Tips
            </div>
            {[
              "Case-sensitive: WiFi name and password must match exactly",
              "Download the QR code and print or display it for guests",
              "Works with iOS Camera app, Android Camera, and QR scanners",
            ].map((tip, i) => (
              <p key={i} style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#555", marginBottom: 6, lineHeight: 1.7 }}>
                · {tip}
              </p>
            ))}
          </div>
        </div>

        {/* ── QR output ── */}
        {qrString && (
          <QRDisplay wifiString={qrString} label={ssid} />
        )}
      </div>
    </ToolPage>
  );
}
