// =============================================================
// PASSGENI — REUSABLE UI COMPONENTS
// =============================================================
// Small, single-purpose components used throughout the site.
// =============================================================

import { useState } from "react";
import { IcCheck, IcShield, IcSparkle } from "../../lib/icons.js";

// ─── TRUST CHIP ───────────────────────────────────────────────
// The small badge chips showing security credentials
export function TrustChip({ label, type = "shield" }) {
  const icons = {
    dot:    <span className="live-dot" />,
    check:  <IcCheck size={10} color="#C8FF0088" />,
    zero:   <IcShield size={10} color="#C8FF0088" />,
    shield: <IcShield size={10} color="#C8FF0088" />,
  };
  return (
    <span className="trust-chip" title={label}>
      {icons[type] || icons.shield}
      {label}
    </span>
  );
}

// ─── COPY BUTTON ─────────────────────────────────────────────
// Copies text to clipboard. Shows "COPIED" confirmation for 2s.
// pulse=true creates a lime glow to grab attention on new password.
export function CopyBtn({ text, pulse = false }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      className={`copy-btn ${copied ? "copied" : ""} ${pulse && !copied ? "pulse" : ""}`}
      onClick={copy}
      aria-label="Copy to clipboard"
      style={pulse && !copied ? { borderColor: "#C8FF00", color: "#C8FF00", boxShadow: "0 0 12px #C8FF0066", animation: "copyPulse 1s ease infinite" } : {}}
    >
      {copied ? <><IcCheck size={11} color="#C8FF00" /> COPIED</> : "COPY"}
    </button>
  );
}

// ─── TOGGLE PILL ─────────────────────────────────────────────
// A small selectable pill button used in option groups
export function TogglePill({ label, active, onClick, dashed = false }) {
  return (
    <button
      className={`toggle-pill ${active ? "active" : ""}`}
      style={dashed && !active ? { borderColor: "#2a2a2a", borderStyle: "dashed", color: "#888" } : {}}
      onClick={onClick}
      aria-pressed={active}
    >
      {active && !dashed ? <><IcCheck size={11} color="#C8FF00" />{" "}</> : ""}{label}
    </button>
  );
}

// ─── STRENGTH BAR ────────────────────────────────────────────
// Visual 4-segment strength indicator
export function StrengthBar({ password, strength, entropy, crackTime }) {
  if (!password) return null;
  const { score, label, color } = strength;

  return (
    <div style={{ marginTop: 14 }}>
      {/* Labels row */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          strength
        </span>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#555", letterSpacing: "0.06em" }}>
            {entropy} bits entropy
          </span>
          <span
            className={label === "Unbreakable" ? "unbreakable-label" : ""}
            style={{ fontFamily: "var(--font-mono)", fontSize: 10, color, letterSpacing: "0.08em", fontWeight: 600 }}
          >
            {label}{label === "Unbreakable" ? <><span style={{ marginLeft: 3 }}><IcSparkle size={11} color="var(--accent)" /></span></> : ""}
          </span>
        </div>
      </div>

      {/* Segments */}
      <div style={{ display: "flex", gap: 4 }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="strength-seg" style={{ background: i <= score ? color : "#141416" }} />
        ))}
      </div>

      {/* Crack time */}
      <div style={{ marginTop: 8, fontFamily: "var(--font-body)", fontSize: 11, color: "#888" }}>
        Estimated crack time:{" "}
        <span style={{ color: "#aaa" }}>{crackTime}</span>
      </div>
    </div>
  );
}

// ─── SECTION EYEBROW ─────────────────────────────────────────
// The small uppercase label above section headlines
export function Eyebrow({ children }) {
  return (
    <div style={{
      fontFamily:    "var(--font-mono)",
      fontSize:      10,
      color:         "#888",
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      marginBottom:  16,
    }}>
      {children}
    </div>
  );
}

// ─── SECTION HEADLINE ────────────────────────────────────────
export function Headline({ children, accent, size = "large" }) {
  const fontSize = size === "large"
    ? "clamp(28px, 4vw, 48px)"
    : "clamp(22px, 3vw, 36px)";

  return (
    <h2 style={{
      fontFamily:    "var(--font-heading)",
      fontWeight:    800,
      fontSize,
      color:         "#fff",
      letterSpacing: "-0.02em",
      lineHeight:    1.1,
      whiteSpace:    "pre-line",
    }}>
      {children}
      {accent && (
        <>
          {"\n"}
          <span style={{ color: "var(--color-accent)" }}>{accent}</span>
        </>
      )}
    </h2>
  );
}
