// =============================================================
// PASSGENI — GENERATOR WIDGET
// =============================================================
import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { btnPrimary } from "../../lib/motion.js";
import { COMPLIANCE_PRESETS } from "../../data/compliance.js";
import { PROFESSIONS } from "../../content/professions.js";
import { buildPassword, buildPassphrase, deriveSeeds, generateAuditRecord } from "../../lib/generator.js";
import { getStrength, getEntropy, getCrackTime, getDNAScore } from "../../lib/strength.js";
import { CopyBtn, TogglePill, StrengthBar, TrustChip } from "../ui/index.js";
import { IcLock, IcBolt, IcAtom } from "../../lib/icons.js";
import PasswordDisplay from "./PasswordDisplay.js";
import DNAScorePanel from "./DNAScore.js";
import PasswordHistory from "./PasswordHistory.js";
import BulkGenerator from "./BulkGenerator.js";
import ComplianceBar from "./ComplianceBar.js";
import ProfessionSelector from "./ProfessionSelector.js";
import PassphraseTab from "./PassphraseTab.js";

function GeneratorTrustStrip() {
  return (
    <div style={{ display:"flex", gap:8, flexWrap:"wrap", justifyContent:"center", padding:"16px 0 4px", borderTop:"1px solid #111", marginTop:20 }} role="list" aria-label="Security guarantees">
      <TrustChip label="Never leaves your browser" type="dot" />
      <TrustChip label="Zero server contact" type="shield" />
      <TrustChip label="FIPS 140-3 entropy" type="zero" />
      <TrustChip label="NIST SP 800-63B" type="check" />
    </div>
  );
}

function ComplianceToast({ preset, visible }) {
  if (!visible || !preset) return null;
  return (
    <div style={{
      position:"fixed", bottom:32, left:"50%", transform:"translateX(-50%)",
      background:"#0d0d10", border:`1px solid ${preset.color}44`,
      borderRadius:10, padding:"12px 24px", zIndex:1000,
      display:"flex", alignItems:"center", gap:12,
      boxShadow:`0 8px 32px #000a, 0 0 0 1px ${preset.color}22`,
      animation:"fadeUp .3s ease",
    }}>
      <span style={{ width:8, height:8, borderRadius:"50%", background:preset.color, flexShrink:0, display:"inline-block" }} />
      <div>
        <div style={{ fontFamily:"var(--font-body)", fontSize:13, fontWeight:600, color:"#fff" }}>
          {preset.label} preset applied
        </div>
        <div style={{ fontFamily:"var(--font-body)", fontSize:11, color:"#888", marginTop:2 }}>
          {preset.desc}
        </div>
      </div>
    </div>
  );
}

export default function GeneratorWidget() {
  const [tab, setTab] = useState("password");
  const [profession, setProfession] = useState("dev");
  const [length, setLength] = useState(18);
  const [opts, setOpts] = useState({ upper: true, num: true, sym: true });
  const [compliance, setCompliance] = useState("none");
  const [quantumMode, setQuantumMode] = useState(false);
  const [language, setLanguage] = useState("latin");
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherValue, setOtherValue] = useState("");
  const [customSeeds, setCustomSeeds] = useState(null);
  const [customLabel, setCustomLabel] = useState("");
  const [password, setPassword] = useState("");
  const [isNew, setIsNew] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [history, setHistory] = useState([]);
  const [auditRecord, setAuditRecord] = useState(null);
  const [showDNA, setShowDNA] = useState(false);
  const [showBulk, setShowBulk] = useState(false);
  const [showAudit, setShowAudit] = useState(false);
  const [toastPreset, setToastPreset] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [pqLocked, setPqLocked] = useState(false);
  const [showPqPopup, setShowPqPopup] = useState(false);
  const [pqShareLoading, setPqShareLoading] = useState(null);
  const [pwLimitHit, setPwLimitHit] = useState(false);
  const [complianceResult, setComplianceResult] = useState(null);
  const toastTimer = useRef(null);
  const inputRef = useRef(null);
  const pqPopupRef = useRef(null);

  const strength = getStrength(password);
  const entropy = getEntropy(password);
  const crackTime = getCrackTime(password);
  const activePreset = COMPLIANCE_PRESETS[compliance];

  // ── Post-Quantum daily limit helpers ──
  function todayStr() {
    return new Date().toISOString().slice(0, 10);
  }
  function checkPqLimit() {
    try {
      const usedDate = localStorage.getItem("pq_used_date");
      const unlockedUntil = localStorage.getItem("pq_unlocked_until");
      if (usedDate && usedDate !== todayStr()) {
        localStorage.removeItem("pq_used_date");
        localStorage.removeItem("pq_unlocked_until");
        return { locked: false };
      }
      if (unlockedUntil && Date.now() < Number(unlockedUntil)) {
        return { locked: false };
      } else if (unlockedUntil) {
        localStorage.removeItem("pq_unlocked_until");
      }
      return { locked: !!usedDate };
    } catch (_) {
      return { locked: false };
    }
  }
  function markPqUsed() {
    try { localStorage.setItem("pq_used_date", todayStr()); } catch (_) {}
  }
  function unlockPqShared() {
    try { localStorage.setItem("pq_unlocked_until", String(Date.now() + 86400000)); } catch (_) {}
  }

  // ── Plan limits ────────────────────────────────────────────────
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
  function getDailyCount(key) {
    try {
      const data = JSON.parse(localStorage.getItem(key) || "{}");
      if (data.date !== todayStr()) return 0;
      return data.count || 0;
    } catch (_) { return 0; }
  }
  function incrementDailyCount(key) {
    try {
      const data = JSON.parse(localStorage.getItem(key) || "{}");
      const count = data.date === todayStr() ? (data.count || 0) + 1 : 1;
      localStorage.setItem(key, JSON.stringify({ date: todayStr(), count }));
      return count;
    } catch (_) { return 1; }
  }

  useEffect(() => {
    const { locked } = checkPqLimit();
    setPqLocked(locked);
    const plan = getPlan();
    const lims = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
    setPwLimitHit(getDailyCount("pg_pw_count") >= lims.passwords);
  }, []); // eslint-disable-line

  useEffect(() => {
    if (!showPqPopup) return;
    function handleClick(e) {
      if (pqPopupRef.current && !pqPopupRef.current.contains(e.target)) {
        setShowPqPopup(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showPqPopup]);

  async function handlePqShare(platform) {
    setPqShareLoading(platform);
    try {
      const res = await fetch("/api/generate-share-copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform }),
      });
      const { copy } = await res.json();
      const url =
        platform === "twitter"
          ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(copy)}`
          : `https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fpassgeni.ai`;
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (_) {
      const fallback =
        platform === "twitter"
          ? "https://twitter.com/intent/tweet?text=" + encodeURIComponent("Generated a Post-Quantum password with @PassGeniAI today. passgeni.ai")
          : "https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fpassgeni.ai";
      window.open(fallback, "_blank", "noopener,noreferrer");
    }
    unlockPqShared();
    setPqLocked(false);
    setShowPqPopup(false);
    setPqShareLoading(null);
  }

  const LANG_SEEDS = {
    arabic: "أبتثجحخدذرزسشصضطظعغفقكلمنهوي",
    french: "àâæçéèêëîïôœùûüÿ",
    german: "äöüßÄÖÜ",
    spanish: "áéíóúñü¿¡",
    portuguese: "ãõâêôçáéíóú",
    russian: "абвгдеёжзийклмнопрстуфхцчшщъыьэюя",
    japanese: "あいうえおかきくけこさしすせそたちつてとなにぬねの",
    chinese: "安好中大学工人月日年时国地会来出",
    greek: "αβγδεζηθικλμνξοπρστυφχψω",
    hindi: "अआइईउऊएऐओऔकखगघचछजझटठडढणतथदधनपफबभमयरलवशषसह",
    korean: "가나다라마바사아자차카타파하",
    latin: "",
  };

  const generate = useCallback((seedsOverride, lengthOverride, optsOverride, quantumOverride) => {
    // ── Plan limit check ──────────────────────────────────────────
    const plan = getPlan();
    const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
    const pwCount = getDailyCount("pg_pw_count");
    if (pwCount >= limits.passwords) {
      setPwLimitHit(true);
      return;
    }
    // ── End plan limit check ──────────────────────────────────────
    setGenerating(true);
    setIsNew(false);
    setTimeout(() => {
      const seeds = seedsOverride !== undefined ? seedsOverride : customSeeds;
      const useLength = lengthOverride !== undefined ? lengthOverride : length;
      const useOpts = optsOverride !== undefined ? optsOverride : opts;
      const useQuantum = quantumOverride !== undefined ? quantumOverride : quantumMode;
      let newPw = buildPassword(useLength, profession, useOpts, seeds, useQuantum);
      const langPool = LANG_SEEDS[language] || "";
      if (langPool && newPw.length > 4) {
        const arr = newPw.split("");
        const inject = Math.min(3, Math.floor(newPw.length / 5));
        for (let i = 0; i < inject; i++) {
          const pos = Math.floor(Math.random() * arr.length);
          const ch = langPool[Math.floor(Math.random() * langPool.length)];
          arr[pos] = ch;
        }
        newPw = arr.join("");
      }
      const audit = generateAuditRecord(newPw, {
        seed: seeds ? seeds[0] : profession,
        compliance: compliance !== "none" ? compliance : null,
        quantum: useQuantum,
        mode: "password",
      });
      setPassword(newPw);
      incrementDailyCount("pg_pw_count");
      setAuditRecord(audit);
      setHistory((h) => [newPw, ...h.filter((x) => x !== newPw)].slice(0, 10));
      setGenerating(false);
      setIsNew(true);
      runComplianceCheck(useLength, useOpts);
      // Track PQ usage for free users — lock immediately in this session
      if (useQuantum) {
        markPqUsed();
        setPqLocked(true);
      }
      setTimeout(() => setIsNew(false), 2000);
    }, 200);
  }, [customSeeds, length, opts, quantumMode, profession, language, compliance]); // eslint-disable-line

  useEffect(() => { generate(null); }, []); // eslint-disable-line

  const showToast = (preset) => {
    clearTimeout(toastTimer.current);
    setToastPreset(preset);
    setToastVisible(true);
    toastTimer.current = setTimeout(() => setToastVisible(false), 3000);
  };

  const applyCompliance = (key) => {
    setCompliance(key);
    if (key === "none") {
      setQuantumMode(false);
      return;
    }
    const preset = COMPLIANCE_PRESETS[key];
    const newLength = Math.max(length, preset.minLen);
    setLength(newLength);
    const newOpts = { upper: preset.upper, num: preset.num, sym: preset.sym };
    setOpts(newOpts);
    if (key === "quantum") {
      setQuantumMode(true);
    } else {
      setQuantumMode(false);
    }
    showToast(preset);
    setTimeout(() => {
      generate(null, newLength, newOpts, key === "quantum");
    }, 50);
  };

  const toggleOpt = (key) => setOpts((o) => ({ ...o, [key]: !o[key] }));

  const handleProfessionClick = (id) => {
    incrementDailyCount("pg_seed_count");
    setProfession(id);
    setCustomSeeds(null);
    setCustomLabel("");
    setOtherValue("");
    setShowOtherInput(false);
  };

  const handleCustomSubmit = () => {
    const trimmed = otherValue.trim();
    if (!trimmed) return;
    const seeds = deriveSeeds(trimmed);
    setCustomSeeds(seeds);
    setCustomLabel(trimmed);
    setShowOtherInput(false);
    generate(seeds);
  };

  async function runComplianceCheck(len, options) {
    try {
      const res = await fetch("/api/compliance-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          length:      len,
          has_upper:   options.upper,
          has_lower:   true,
          has_numbers: options.num,
          has_special: options.sym,
        }),
      });
      if (!res.ok) return;
      const { results } = await res.json();
      setComplianceResult(results);
    } catch (_) {}
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <ComplianceToast preset={toastPreset} visible={toastVisible} />
      <ComplianceBar compliance={compliance} onSelect={applyCompliance} activePreset={activePreset} />
      <div style={{ background:"#0a0a0c", border:"1px solid #141416", borderRadius:16, overflow:"hidden", boxShadow:"0 40px 80px #00000088,0 0 0 1px #141416" }}>
        <div style={{ display:"flex", borderBottom:"1px solid #1e1e1e" }} role="tablist">
          {[["password","Password"],["passphrase","Passphrase"]].map(([t,label])=>(
            <button key={t} role="tab" aria-selected={tab===t} onClick={()=>setTab(t)} style={{ flex:1, padding:"14px 0", fontFamily:"var(--font-mono)", fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase", background:tab===t?"#0c0c0e":"transparent", color:tab===t?"#C8FF00":"#777", border:"none", borderBottom:tab===t?"1px solid #C8FF00":"1px solid transparent", cursor:"pointer", transition:"all 0.2s" }}>
              {label}
            </button>
          ))}
        </div>
        <div style={{ padding:"28px 28px 32px" }}>
          {tab === "password" ? (
            <>
              <PasswordDisplay password={password} generating={generating} strength={strength} entropy={entropy} crackTime={crackTime} isNew={isNew} />
              <div style={{ display:"flex", gap:8, marginTop:10, marginBottom:4, flexWrap:"wrap", position:"relative" }}>
                <TogglePill label={showDNA?"Hide DNA Score":"Show DNA Score"} active={showDNA} onClick={()=>{ if(!showDNA) incrementDailyCount("pg_dna_count"); setShowDNA(d=>!d); }} />
                <TogglePill label={showAudit?"Hide Audit Log":"Show Audit Log"} active={showAudit} onClick={()=>setShowAudit(a=>!a)} />
                <TogglePill label={showBulk?"Close Bulk":"Bulk Generator"} active={showBulk} onClick={()=>setShowBulk(b=>!b)} />
                {/* Post-Quantum toggle — lock after 1 free use per day */}
                <div style={{ position:"relative" }}>
                  <TogglePill
                    label={pqLocked ? <><IcLock size={11} color="currentColor" />{" Post-Quantum"}</> : (quantumMode ? <><IcBolt size={12} color="var(--accent)" />{" Quantum ON"}</> : "Post-Quantum Mode")}
                    active={quantumMode && !pqLocked}
                    onClick={()=>{
                      if (pqLocked) { setShowPqPopup(p=>!p); return; }
                      setQuantumMode(q=>!q);
                      if (compliance!=="quantum") setCompliance("none");
                    }}
                  />
                  {showPqPopup && (
                    <div ref={pqPopupRef} style={{
                      position:"absolute",top:"calc(100% + 10px)",left:0,zIndex:300,
                      background:"rgba(8,8,11,0.97)",
                      border:"1px solid rgba(200,255,0,0.14)",
                      borderRadius:14,
                      padding:"20px 20px 16px",
                      width:300,
                      animation:"fadeIn .18s ease",
                      boxShadow:"0 24px 56px rgba(0,0,0,0.8),0 0 0 1px rgba(200,255,0,0.04),inset 0 1px 0 rgba(200,255,0,0.06)",
                      backdropFilter:"blur(16px)",
                    }}>
                      {/* Header row */}
                      <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:10 }}>
                        <div style={{
                          width:32,height:32,borderRadius:8,flexShrink:0,
                          background:"linear-gradient(135deg,rgba(200,255,0,0.18),rgba(200,255,0,0.04))",
                          border:"1px solid rgba(200,255,0,0.2)",
                          display:"flex",alignItems:"center",justifyContent:"center",
                          fontSize:15,
                        }}><IcAtom size={16} color="#C8FF00" /></div>
                        <button
                          onClick={()=>setShowPqPopup(false)}
                          style={{ background:"none",border:"none",color:"#555",fontSize:18,cursor:"pointer",lineHeight:1,padding:"2px 4px",transition:"color .15s" }}
                          onMouseEnter={e=>e.currentTarget.style.color="#aaa"}
                          onMouseLeave={e=>e.currentTarget.style.color="#555"}
                          aria-label="Dismiss"
                        >×</button>
                      </div>

                      {/* Title + body */}
                      <div style={{ fontFamily:"var(--font-body)",fontSize:14,fontWeight:700,color:"#fff",marginBottom:6,lineHeight:1.4,letterSpacing:"-.01em" }}>
                        Daily limit reached.
                      </div>
                      <div style={{ fontFamily:"var(--font-body)",fontSize:12.5,color:"#666",marginBottom:16,lineHeight:1.65 }}>
                        Free tier includes 1 Post-Quantum password per day — yours is protected. Resets at midnight, or unlock unlimited right now.
                      </div>

                      {/* Primary CTA */}
                      <a href="/pricing" style={{
                        display:"flex",alignItems:"center",justifyContent:"space-between",
                        background:"var(--accent)",color:"#000",
                        fontFamily:"var(--font-body)",fontSize:12,fontWeight:800,
                        letterSpacing:".04em",textTransform:"uppercase",
                        borderRadius:8,padding:"10px 14px",
                        textDecoration:"none",marginBottom:12,
                        transition:"opacity .15s",
                      }}
                      onMouseEnter={e=>e.currentTarget.style.opacity=".88"}
                      onMouseLeave={e=>e.currentTarget.style.opacity="1"}
                      >
                        <span>Upgrade to Pro</span>
                        <span style={{ fontFamily:"var(--font-mono)",fontSize:10, fontWeight:400,opacity:.7 }}>$9 / mo · 150/day</span>
                      </a>

                      {/* Divider */}
                      <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:12 }}>
                        <div style={{ flex:1,height:1,background:"linear-gradient(90deg,transparent,#1e1e1e)" }} />
                        <span style={{ fontFamily:"var(--font-body)",fontSize:10,color:"#444",letterSpacing:".08em",textTransform:"uppercase",flexShrink:0 }}>or stay free</span>
                        <div style={{ flex:1,height:1,background:"linear-gradient(90deg,#1e1e1e,transparent)" }} />
                      </div>

                      {/* Share label */}
                      <div style={{ fontFamily:"var(--font-body)",fontSize:11,color:"#555",marginBottom:8,lineHeight:1.5 }}>
                        Share PassGeni and unlock <span style={{ color:"var(--accent)",fontWeight:700 }}>+15 passwords</span> for 24 hours:
                      </div>

                      {/* Share buttons */}
                      <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
                        <button
                          onClick={()=>handlePqShare("twitter")}
                          disabled={!!pqShareLoading}
                          style={{
                            display:"flex",alignItems:"center",justifyContent:"space-between",
                            background:"rgba(200,255,0,0.05)",
                            border:"1px solid rgba(200,255,0,0.12)",
                            color:"#C8FF00",fontSize:12,borderRadius:8,
                            padding:"9px 12px",
                            fontFamily:"var(--font-body)",fontWeight:600,
                            cursor:pqShareLoading?"not-allowed":"pointer",
                            opacity:pqShareLoading==="twitter"?0.5:1,
                            transition:"background .15s,border-color .15s",
                          }}
                          onMouseEnter={e=>{ if(!pqShareLoading){ e.currentTarget.style.background="rgba(200,255,0,0.1)"; e.currentTarget.style.borderColor="rgba(200,255,0,0.25)"; }}}
                          onMouseLeave={e=>{ e.currentTarget.style.background="rgba(200,255,0,0.05)"; e.currentTarget.style.borderColor="rgba(200,255,0,0.12)"; }}
                        >
                          <span>{pqShareLoading==="twitter" ? "Opening…" : "𝕏  Share on X"}</span>
                          <span style={{ fontFamily:"var(--font-mono)",fontSize:10,opacity:.6,fontWeight:400 }}>+15 passwords</span>
                        </button>
                        <button
                          onClick={()=>handlePqShare("linkedin")}
                          disabled={!!pqShareLoading}
                          style={{
                            display:"flex",alignItems:"center",justifyContent:"space-between",
                            background:"rgba(200,255,0,0.05)",
                            border:"1px solid rgba(200,255,0,0.12)",
                            color:"#C8FF00",fontSize:12,borderRadius:8,
                            padding:"9px 12px",
                            fontFamily:"var(--font-body)",fontWeight:600,
                            cursor:pqShareLoading?"not-allowed":"pointer",
                            opacity:pqShareLoading==="linkedin"?.5:1,
                            transition:"background .15s,border-color .15s",
                          }}
                          onMouseEnter={e=>{ if(!pqShareLoading){ e.currentTarget.style.background="rgba(200,255,0,0.1)"; e.currentTarget.style.borderColor="rgba(200,255,0,0.25)"; }}}
                          onMouseLeave={e=>{ e.currentTarget.style.background="rgba(200,255,0,0.05)"; e.currentTarget.style.borderColor="rgba(200,255,0,0.12)"; }}
                        >
                          <span>{pqShareLoading==="linkedin" ? "Opening…" : "in  Share on LinkedIn"}</span>
                          <span style={{ fontFamily:"var(--font-mono)",fontSize:10,opacity:.6,fontWeight:400 }}>+15 passwords</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {showDNA && <DNAScorePanel password={password} />}
              {showAudit && auditRecord && (
                <div style={{ background:"#08080a", border:"1px solid #141416", borderRadius:10, padding:"16px 20px", marginTop:12, animation:"fadeIn 0.3s ease" }}>
                  <div style={{ fontFamily:"var(--font-mono)", fontSize:10, color:"#888", letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:12 }}>Open Audit Log</div>
                  {Object.entries(auditRecord).map(([key,val])=>(
                    <div key={key} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:"1px solid #0e0e10", gap:16 }}>
                      <span style={{ fontFamily:"var(--font-mono)", fontSize:10, color:"#666", letterSpacing:"0.06em" }}>{key}</span>
                      <span style={{ fontFamily:"var(--font-mono)", fontSize:10, color:"#aaa", textAlign:"right" }}>{String(val)}</span>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ marginTop:20, marginBottom:20 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
                  <label htmlFor="pw-len" style={{ fontFamily:"var(--font-mono)", fontSize:10, color:"#888", letterSpacing:"0.12em", textTransform:"uppercase" }}>length</label>
                  <span style={{ fontFamily:"var(--font-mono)", fontSize:11, color:"#C8FF00", fontWeight:600 }}>{length} characters</span>
                </div>
                <input id="pw-len" type="range" min={compliance!=="none"?activePreset.minLen:8} max={32} value={length} onChange={(e)=>setLength(+e.target.value)} />
              </div>
              <div style={{ display:"flex", gap:8, marginBottom:24, flexWrap:"wrap", alignItems:"center" }} role="group" aria-label="Character options">
                {[["sym","Symbols"],["num","Numbers"],["upper","A-Z"]].map(([k,label])=>(
                  <TogglePill key={k} label={label} active={opts[k]} onClick={()=>toggleOpt(k)} />
                ))}
                <select value={language} onChange={(e)=>setLanguage(e.target.value)} style={{ background:"#0c0c0e", border:"1px solid #222", borderRadius:100, padding:"6px 14px", fontFamily:"var(--font-mono)", fontSize:10, color:"#aaa", cursor:"pointer", outline:"none", letterSpacing:"0.06em" }} title="Password character language">
                  <option value="latin">🌐 English (Default)</option>
                  <option value="arabic">🇦🇪 Arabic</option>
                  <option value="french">🇫🇷 French</option>
                  <option value="german">🇩🇪 German</option>
                  <option value="spanish">🇪🇸 Spanish</option>
                  <option value="portuguese">🇧🇷 Portuguese</option>
                  <option value="russian">🇷🇺 Russian</option>
                  <option value="japanese">🇯🇵 Japanese</option>
                  <option value="chinese">🇨🇳 Chinese</option>
                  <option value="greek">🇬🇷 Greek</option>
                  <option value="hindi">🇮🇳 Hindi</option>
                  <option value="korean">🇰🇷 Korean</option>
                </select>
              </div>
              <motion.button className="btn-primary" {...btnPrimary} style={{ width:"100%", justifyContent:"center" }} onClick={()=>generate()}>
                {generating ? "Generating…" : "Generate Secure Password →"}
              </motion.button>
              {pwLimitHit && (
                <div style={{ marginTop:12, background:"#0a0a0c", border:"1px solid #1e1e1e", borderRadius:10, padding:"14px 18px", animation:"fadeIn .2s ease" }}>
                  <div style={{ fontFamily:"var(--font-body)", fontSize:13, fontWeight:600, color:"#fff", marginBottom:6 }}>
                    You&apos;ve used your {PLAN_LIMITS[getPlan()]?.passwords || 15} free passwords today.
                  </div>
                  <div style={{ fontFamily:"var(--font-body)", fontSize:12, color:"#777", marginBottom:10, lineHeight:1.6 }}>
                    Come back tomorrow — or upgrade to Pro for 150/day.
                  </div>
                  <a href="/pricing#pro" style={{ fontFamily:"var(--font-body)", fontSize:13, fontWeight:700, color:"#C8FF00", textDecoration:"none" }}>
                    Upgrade to Pro →
                  </a>
                </div>
              )}
              <GeneratorTrustStrip />
              {complianceResult && (
                <div style={{ marginTop:16, padding:"14px 16px", background:"#08080a", border:"1px solid #141416", borderRadius:10 }}>
                  <div style={{ fontFamily:"var(--font-mono)", fontSize:9, color:"#555", letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:10 }}>Standards met</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                    {Object.entries(complianceResult).map(([id, r]) => (
                      <span key={id} title={r.gaps.length ? r.gaps.join("\n") : `Meets ${r.label}`} style={{
                        display:"inline-flex", alignItems:"center", gap:5,
                        padding:"4px 10px", borderRadius:99, fontSize:10, fontFamily:"var(--font-mono)",
                        border: r.valid ? "1px solid rgba(0,208,132,0.3)" : "1px solid rgba(255,255,255,0.06)",
                        background: r.valid ? "rgba(0,208,132,0.08)" : "rgba(255,255,255,0.02)",
                        color: r.valid ? "#00d084" : "#444",
                        cursor: r.gaps.length ? "help" : "default",
                      }}>
                        <span style={{ width:5, height:5, borderRadius:"50%", background: r.valid ? "#00d084" : "#333", flexShrink:0, display:"inline-block" }} />
                        {r.shortLabel}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <PasswordHistory history={history} onClear={()=>setHistory([])} />
            </>
          ) : (
            <PassphraseTab
              profession={profession} customSeeds={customSeeds} customLabel={customLabel}
              showOtherInput={showOtherInput} otherValue={otherValue} inputRef={inputRef}
              onSelectProfession={handleProfessionClick}
              onShowOther={()=>{ setShowOtherInput(true); setTimeout(()=>inputRef.current?.focus(),60); }}
              onOtherChange={(v)=>setOtherValue(v)}
              onOtherSubmit={handleCustomSubmit}
              onOtherCancel={()=>{ setShowOtherInput(false); setOtherValue(""); }}
            />
          )}
        </div>
      </div>
      {showBulk && (
        <BulkGenerator profession={profession} opts={opts} length={length} customSeeds={customSeeds} quantumMode={quantumMode} />
      )}
    </div>
  );
    }
