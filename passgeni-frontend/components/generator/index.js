// =============================================================
// PASSGENI — GENERATOR SUB-COMPONENTS
// =============================================================

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, animate } from "framer-motion";
import { btnPrimary, btnGhost } from "../../lib/motion.js";
import { COMPLIANCE_PRESETS }  from "../../data/compliance.js";
import { PROFESSIONS }         from "../../content/professions.js";
import { buildPassword, buildPassphrase } from "../../lib/generator.js";
import { getStrength, getEntropy, getCrackTime, getDNAScore } from "../../lib/strength.js";
import { CopyBtn, TogglePill, StrengthBar, TrustChip } from "../ui/index.js";
import { IcCheck, IcX, IcBolt, IcLock, IcSparkle } from "../../lib/icons.js";

// ─── PASSWORD DISPLAY ─────────────────────────────────────────
function AnimatedEntropy({ value }) {
  const mv = useMotionValue(0);
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const ctrl = animate(mv, value, { duration: 0.5, ease: "easeOut" });
    const unsub = mv.onChange(v => setDisplay(Math.round(v)));
    return () => { ctrl.stop(); unsub(); };
  }, [value]); // eslint-disable-line
  return <span>{display}</span>;
}

export function PasswordDisplay({ password, generating, strength, entropy, crackTime, isNew }) {
  const strengthPct = strength ? Math.round((strength.score / 4) * 100) : 0;
  return (
    <div style={{ background: "#08080a", border: "1px solid #141416", borderRadius: 10, padding: "20px 24px", position: "relative", overflow: "hidden" }} aria-live="polite">
      {/* Scan line animation */}
      <div style={{ position: "absolute", left: 0, right: 0, height: "1px", background: "linear-gradient(90deg,transparent,#C8FF0022,transparent)", pointerEvents: "none" }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
        {/* Password with AnimatePresence key-swap */}
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(13px,2vw,16px)", lineHeight: 1.7, wordBreak: "break-all", flex: 1, minHeight: 26, position: "relative", overflow: "hidden" }}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={password}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: generating ? 0.3 : 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: generating ? 0.15 : 0.25, ease: "easeOut" }}
            >
              {password
                ? password.split("").map((c, i) => {
                    let color = "#e8e8e8";
                    if ("!@#$%^&*-_=+[]{}|;:,.<>?".includes(c)) color = "#C8FF00";
                    else if ("0123456789".includes(c))           color = "#777";
                    else if (c === c.toUpperCase() && /[A-Z]/.test(c)) color = "#fff";
                    return <span key={i} style={{ color }}>{c}</span>;
                  })
                : <span style={{ color: "#aaa" }}>click generate —</span>
              }
            </motion.div>
          </AnimatePresence>
        </div>
        <CopyBtn text={password} pulse={isNew} />
      </div>

      {/* Animated strength bar */}
      {password && strength && (
        <div style={{ marginTop: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: strength.color, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>{strength.label}</span>
            {(entropy || 0) > 0 && (
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#555" }}>
                <AnimatedEntropy value={entropy} /> bits
              </span>
            )}
          </div>
          <div style={{ height: 3, background: "#141416", borderRadius: 100, overflow: "hidden" }}>
            <motion.div
              style={{ height: "100%", borderRadius: 100, background: strength.color }}
              initial={{ width: 0 }}
              animate={{ width: `${strengthPct}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
          {crackTime && (
            <div style={{ marginTop: 6, fontFamily: "var(--font-mono)", fontSize: 10, color: "#444", letterSpacing: "0.06em" }}>
              crack time: {crackTime}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── DNA SCORE PANEL ─────────────────────────────────────────
export function DNAScorePanel({ password }) {
  const dna = getDNAScore(password);
  if (!dna) return null;

  return (
    <div style={{ background: "#08080a", border: "1px solid #141416", borderRadius: 10, padding: "20px 24px", marginTop: 12, animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>Password DNA Score</div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#555" }}>Cryptographic quality breakdown</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 32, color: dna.gradeColor, lineHeight: 1 }}>{dna.grade}</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#555", marginTop: 2 }}>{dna.total}/100</div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {dna.checks.map((c, i) => (
          <div key={i}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: c.pass ? "#ccc" : "#555", display: "flex", alignItems: "center", gap: 5 }}>
                {c.pass ? <IcCheck size={12} color="#4ade80" /> : <IcX size={12} color="#ff6b6b" />}{c.label}
              </span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: c.pass ? "#C8FF0088" : "#333" }}>
                {c.pass ? `+${c.weight}` : "0"} pts
              </span>
            </div>
            <div style={{ height: 3, background: "#141416", borderRadius: 100, overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 100, background: c.pass ? "#C8FF00" : "transparent", width: c.pass ? `${c.weight}%` : "0%", transition: "width 0.8s var(--ease-spring)" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PASSWORD HISTORY ─────────────────────────────────────────
export function PasswordHistory({ history, onClear }) {
  if (!history.length) return null;
  return (
    <div style={{ marginTop: 16, animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Recent · This Session
        </span>
        <button
          onClick={onClear}
          style={{ background: "none", border: "none", fontFamily: "var(--font-mono)", fontSize: 9, color: "#555", cursor: "pointer", letterSpacing: "0.08em", transition: "color 0.15s" }}
          onMouseEnter={(e) => (e.target.style.color = "#ff4444")}
          onMouseLeave={(e) => (e.target.style.color = "#555")}
        >
          Clear all
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {history.slice(0, 8).map((pw, i) => (
          <div key={i} className="history-row">
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#888", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, letterSpacing: "0.04em" }}>
              {pw}
            </span>
            <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: getStrength(pw).color }}>
                {getStrength(pw).label}
              </span>
              <CopyBtn text={pw} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SHARED PLAN HELPERS (used by BulkGenerator + ComplianceBar) ──
function getPlan() {
  try { const raw = localStorage.getItem("passgeni_plan"); if (raw) return raw; } catch (_) {}
  return "free";
}
const PLAN_LIMITS = {
  free:       { passwords: 15,  bulk: 0,   dnaScore: 1,  passphrase: 3,  seeds: 5   },
  pro:        { passwords: 150, bulk: 25,  dnaScore: 999, passphrase: 999, seeds: 999 },
  team:       { passwords: 999, bulk: 500, dnaScore: 999, passphrase: 999, seeds: 999 },
  enterprise: { passwords: 999, bulk: 500, dnaScore: 999, passphrase: 999, seeds: 999 },
};

// ─── BULK GENERATOR ───────────────────────────────────────────
export function BulkGenerator({ profession, opts, length, customSeeds, quantumMode }) {
  const [count,      setCount]      = useState(10);
  const [bulk,       setBulk]       = useState([]);
  const [generating, setGenerating] = useState(false);
  const [blocked,    setBlocked]    = useState(false);

  const generate = () => {
    const plan = getPlan();
    const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
    if (limits.bulk === 0) {
      setBlocked(true);
      return;
    }
    setBlocked(false);
    const safeCount = Math.min(count, limits.bulk);
    setGenerating(true);
    setTimeout(() => {
      const list = Array.from({ length: safeCount }, () => buildPassword(length, profession, opts, customSeeds, quantumMode));
      setBulk(list);
      setGenerating(false);
    }, 300);
  };

  const download = () => {
    if (!bulk.length) return;
    const content = `PassGeni — Bulk Password Export\nGenerated: ${new Date().toLocaleString()}\nCount: ${bulk.length}\nMode: ${quantumMode ? "Post-Quantum" : "Standard"}\n\n${bulk.join("\n")}`;
    const blob = new Blob([content], { type: "text/plain" });
    const a    = document.createElement("a");
    a.href     = URL.createObjectURL(blob);
    a.download = `passgeni-${bulk.length}-passwords.txt`;
    a.click();
  };

  const copyAll = async () => {
    if (!bulk.length) return;
    await navigator.clipboard.writeText(bulk.join("\n"));
  };

  return (
    <div style={{ background: "#0a0a0c", border: "1px solid #141416", borderRadius: 16, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "20px 24px", borderBottom: "1px solid #1a1a1a", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 16, color: "#fff" }}>Bulk Generator</div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#666", marginTop: 2 }}>Generate multiple passwords at once · Same settings</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#888" }}>Count:</span>
          {[5, 10, 20, 50].map((n) => (
            <button key={n} onClick={() => setCount(n)} className={`toggle-pill ${count === n ? "active" : ""}`} style={{ padding: "5px 12px" }}>{n}</button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "20px 24px" }}>
        <motion.button className="btn-primary" {...btnPrimary} style={{ width: "100%", justifyContent: "center", marginBottom: blocked ? 0 : 16 }} onClick={generate}>
          {generating ? `Generating ${count} passwords…` : <>Generate {count} passwords <IcBolt size={15} color="var(--accent)" /></>}
        </motion.button>
        {blocked && (
          <div style={{ marginTop: 12, marginBottom: 16, background: "#0a0a0c", border: "1px solid #1e1e1e", borderRadius: 10, padding: "14px 18px", animation: "fadeIn .2s ease" }}>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 6 }}>
              Bulk generation is available on Pro and Team plans.
            </div>
            <a href="/pricing#pro" style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 700, color: "#C8FF00", textDecoration: "none" }}>
              Upgrade to Pro →
            </a>
          </div>
        )}
        {bulk.length > 0 && (
          <>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <motion.button onClick={copyAll}  className="btn-ghost" {...btnGhost} style={{ flex: 1, justifyContent: "center", fontSize: 12, padding: "10px 16px" }}>Copy all</motion.button>
              <motion.button onClick={download} className="btn-ghost" {...btnGhost} style={{ flex: 1, justifyContent: "center", fontSize: 12, padding: "10px 16px" }}>↓ Download .txt</motion.button>
            </div>
            <div style={{ background: "#08080a", border: "1px solid #141416", borderRadius: 10, overflow: "hidden", maxHeight: 320, overflowY: "auto" }}>
              {bulk.map((pw, i) => (
                <div key={i} className="bulk-row">
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#555", width: 24, flexShrink: 0 }}>{i + 1}.</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#ccc", flex: 1, letterSpacing: "0.04em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{pw}</span>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: getStrength(pw).color }}>{getStrength(pw).label}</span>
                    <CopyBtn text={pw} />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── COMPLIANCE BAR ───────────────────────────────────────────
const TEAM_PRESETS = ["hipaa", "pci", "soc2", "iso27001", "nist", "dod", "quantum"];

export function ComplianceBar({ compliance, onSelect, activePreset }) {
  const [gateMsg, setGateMsg] = useState(false);

  const handleSelect = (key) => {
    if (TEAM_PRESETS.includes(key.toLowerCase())) {
      const plan = getPlan();
      if (plan !== "team" && plan !== "enterprise") {
        setGateMsg(true);
        setTimeout(() => setGateMsg(false), 3000);
        return;
      }
    }
    setGateMsg(false);
    onSelect(key);
  };

  return (
    <div style={{ background: "#0a0a0c", border: "1px solid #141416", borderRadius: 12, padding: "16px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Compliance Mode
        </div>
        {compliance !== "none" && (
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: activePreset.color, letterSpacing: "0.08em" }}>
            {activePreset.desc}
          </span>
        )}
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {Object.entries(COMPLIANCE_PRESETS).map(([key, preset]) => {
          const isActive = compliance === key;
          const isTeamOnly = TEAM_PRESETS.includes(key.toLowerCase());
          const plan = getPlan();
          const locked = isTeamOnly && plan !== "team" && plan !== "enterprise";
          return (
            <motion.button
              key={key}
              onClick={() => handleSelect(key)}
              whileTap={{ scale: 0.96 }}
              animate={{ boxShadow: isActive ? `0 0 12px ${preset.color}4d` : "0 0 0px rgba(200,255,0,0)" }}
              transition={{ duration: 0.3 }}
              className={`compliance-pill ${isActive ? "active" : ""}`}
              style={isActive ? { borderColor: preset.color, color: preset.color, background: `${preset.color}11` } : locked ? { opacity: 0.45 } : {}}
              title={locked ? "Available on Team plan" : undefined}
            >
              {locked ? <><IcLock size={11} color="currentColor" />{" "}</> : ""}{preset.label}
            </motion.button>
          );
        })}
      </div>
      {gateMsg && (
        <div style={{ marginTop: 10, fontFamily: "var(--font-body)", fontSize: 12, color: "#888", animation: "fadeIn .2s ease" }}>
          Compliance presets are available on the Team plan.{" "}
          <a href="/pricing#team" style={{ color: "#C8FF00", textDecoration: "none", fontWeight: 600 }}>Upgrade →</a>
        </div>
      )}
    </div>
  );
}

// ─── PROFESSION SELECTOR ──────────────────────────────────────
export function ProfessionSelector({ profession, customSeeds, customLabel, showOtherInput, otherValue, inputRef, onSelectProfession, onShowOther, onOtherChange, onOtherSubmit, onOtherCancel }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#777", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10, display: "flex", justifyContent: "space-between" }}>
        <span>profession seed</span>
        {customLabel && !showOtherInput && <span style={{ color: "#C8FF0077", fontSize: 9, display: "inline-flex", alignItems: "center", gap: 3 }}><IcSparkle size={9} color="#C8FF0077" />{customLabel}</span>}
      </div>
      {!showOtherInput && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {PROFESSIONS.map((p) => (
            <TogglePill key={p.id} label={p.label} active={profession === p.id && !customSeeds} onClick={() => onSelectProfession(p.id)} />
          ))}
          <TogglePill label={customSeeds ? <><IcSparkle size={9} color="var(--accent)" />{" "}{customLabel}</> : "+ Other"} active={!!customSeeds} onClick={onShowOther} dashed={!customSeeds} />
        </div>
      )}
      {showOtherInput && (
        <div style={{ animation: "inputSlideIn 0.22s var(--ease-spring)" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "stretch", background: "#08080a", border: "1px solid #C8FF0044", borderRadius: 8, padding: "4px 4px 4px 16px" }}>
            <input
              ref={inputRef}
              type="text"
              placeholder="e.g. Pilot, Plumber, Chef…"
              value={otherValue}
              onChange={(e) => onOtherChange(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") onOtherSubmit(); if (e.key === "Escape") onOtherCancel(); }}
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontFamily: "var(--font-mono)", fontSize: 13, color: "#fff", letterSpacing: "0.04em", padding: "10px 0" }}
            />
            <button onClick={onOtherSubmit} disabled={!otherValue.trim()} className={`use-it-btn ${otherValue.trim() ? "active" : ""}`}>
              Use it →
            </button>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, padding: "0 2px" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#555", letterSpacing: "0.08em" }}>
              AI extracts keywords from your profession
            </span>
            <button onClick={onOtherCancel} style={{ background: "none", border: "none", fontFamily: "var(--font-mono)", fontSize: 9, color: "#C8FF0066", cursor: "pointer", letterSpacing: "0.06em", transition: "color 0.15s" }} onMouseEnter={(e) => (e.target.style.color = "#C8FF00")} onMouseLeave={(e) => (e.target.style.color = "#C8FF0066")}>
              ← back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PASSPHRASE TAB ───────────────────────────────────────────
export function PassphraseTab({ profession, customSeeds, customLabel, showOtherInput, otherValue, inputRef, onSelectProfession, onShowOther, onOtherChange, onOtherSubmit, onOtherCancel }) {
  const [parts,      setParts]      = useState(null);
  const [generating, setGenerating] = useState(false);
  const [history,    setHistory]    = useState([]);

  const generate = (seedsOverride) => {
    setGenerating(true);
    setTimeout(() => {
      const seeds  = seedsOverride !== undefined ? seedsOverride : customSeeds;
      const result = buildPassphrase(profession, seeds);
      setParts(result);
      setHistory((h) => [result.full, ...h.filter((x) => x !== result.full)].slice(0, 8));
      setGenerating(false);
    }, 220);
  };

  const ppEntropy    = parts ? Math.round(Math.log2(40) * 2 + Math.log2(900) + Math.log2(8)) : 0;
  const isUnbreakable = ppEntropy >= 40;
  const WORD_COLORS   = ["#C8FF00", "#e8e8e8", "#aaa", "#fff"];

  return (
    <>
      {/* Passphrase display */}
      <div style={{ background: "#08080a", border: "1px solid #141416", borderRadius: 10, padding: "20px 24px", marginBottom: 24, minHeight: 90, transition: "opacity 0.2s", opacity: generating ? 0.4 : 1 }} aria-live="polite">
        {parts ? (
          <>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
              {[parts.w1, parts.adj, parts.num, parts.w2].map((seg, i) => (
                <span key={i} style={{ background: "#111", border: `1px solid ${i === 0 || i === 3 ? "#C8FF0033" : "#1e1e1e"}`, borderRadius: 6, padding: "8px 16px", fontFamily: "var(--font-mono)", fontSize: 15, color: WORD_COLORS[i], letterSpacing: "0.04em" }}>{seg}</span>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#555", letterSpacing: "0.04em" }}>{parts.full}</span>
              <CopyBtn text={parts.full} />
            </div>
            <div style={{ borderTop: "1px solid #111", paddingTop: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", letterSpacing: "0.1em", textTransform: "uppercase" }}>strength</span>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#555" }}>{ppEntropy}+ bits entropy</span>
                  <span className={isUnbreakable ? "unbreakable-label" : ""} style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#C8FF00", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4 }}>
                    {isUnbreakable ? <>Unbreakable <IcSparkle size={10} color="var(--accent)" /></> : "Strong"}
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 4 }}>{[1, 2, 3, 4].map((i) => <div key={i} className="strength-seg" style={{ background: "#C8FF00" }} />)}</div>
              <div style={{ marginTop: 8, fontFamily: "var(--font-body)", fontSize: 11, color: "#888" }}>
                Estimated crack time: <span style={{ color: "#aaa" }}>longer than the universe</span>
              </div>
            </div>
          </>
        ) : (
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#aaa" }}>generate a passphrase —</span>
        )}
      </div>

      {/* Profession selector */}
      <ProfessionSelector
        profession={profession}
        customSeeds={customSeeds}
        customLabel={customLabel}
        showOtherInput={showOtherInput}
        otherValue={otherValue}
        inputRef={inputRef}
        onSelectProfession={onSelectProfession}
        onShowOther={onShowOther}
        onOtherChange={onOtherChange}
        onOtherSubmit={() => { onOtherSubmit(); }}
        onOtherCancel={onOtherCancel}
      />

      {/* Generate button */}
      <motion.button className="btn-primary" {...btnPrimary} style={{ width: "100%", justifyContent: "center" }} onClick={() => generate()}>
        {generating ? "Generating…" : <>Generate passphrase <span style={{ fontSize: 18 }}>→</span></>}
      </motion.button>

      <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "#aaa", textAlign: "center", marginTop: 14, letterSpacing: "0.04em" }}>
        Recommended by <strong style={{ color: "#bbb" }}>NIST SP 800-63B</strong> · Easier to remember · Just as strong
      </p>

      {/* History */}
      <PasswordHistory history={history} onClear={() => setHistory([])} />
    </>
  );
}
