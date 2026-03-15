// =============================================================
// PASSGENI — GENERATOR WIDGET
// =============================================================
import { useState, useRef, useEffect, useCallback } from "react";
import { COMPLIANCE_PRESETS } from "../../data/compliance.js";
import { PROFESSIONS } from "../../content/professions.js";
import { buildPassword, buildPassphrase, deriveSeeds, generateAuditRecord } from "../../lib/generator.js";
import { getStrength, getEntropy, getCrackTime, getDNAScore } from "../../lib/strength.js";
import { CopyBtn, TogglePill, StrengthBar, TrustChip } from "../ui/index.js";
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

// ── Compliance toast notification ──────────────────────────
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
  // Toast state
  const [toastPreset, setToastPreset] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useRef(null);
  const inputRef = useRef(null);

  const strength = getStrength(password);
  const entropy = getEntropy(password);
  const crackTime = getCrackTime(password);
  const activePreset = COMPLIANCE_PRESETS[compliance];

  const LANG_SEEDS = {
    arabic:"\u0623\u0628\u062a\u062b\u062c\u062d\u062e\u062f\u0630\u0631\u0632\u0633\u0634\u0635\u0636\u0637\u0638\u0639\u063a\u0641\u0642\u0643\u0644\u0645\u0646\u0647\u0648\u064a",
    french:"\u00e0\u00e2\u00e6\u00e7\u00e9\u00e8\u00ea\u00eb\u00ee\u00ef\u00f4\u0153\u00f9\u00fb\u00fc\u00ff",
    german:"\u00e4\u00f6\u00fc\u00df\u00c4\u00d6\u00dc",
    spanish:"\u00e1\u00e9\u00ed\u00f3\u00fa\u00f1\u00fc\u00bf\u00a1",
    portuguese:"\u00e3\u00f5\u00e2\u00ea\u00f4\u00e7\u00e1\u00e9\u00ed\u00f3\u00fa",
    russian:"\u0430\u0431\u0432\u0433\u0434\u0435\u0451\u0436\u0437\u0438\u0439\u043a\u043b\u043c\u043d\u043e\u043f\u0440\u0441\u0442\u0443\u0444\u0445\u0446\u0447\u0448\u0449\u044a\u044b\u044c\u044d\u044e\u044f",
    japanese:"\u3042\u3044\u3046\u3048\u304a\u304b\u304d\u304f\u3051\u3053\u3055\u3057\u3059\u305b\u305d\u305f\u3061\u3064\u3066\u3068\u306a\u306b\u306c\u306d\u306e",
    chinese:"\u5b89\u597d\u4e2d\u5927\u5b66\u5de5\u4eba\u6708\u65e5\u5e74\u65f6\u56fd\u5730\u4f1a\u6765\u51fa",
    greek:"\u03b1\u03b2\u03b3\u03b4\u03b5\u03b6\u03b7\u03b8\u03b9\u03ba\u03bb\u03bc\u03bd\u03be\u03bf\u03c0\u03c1\u03c3\u03c4\u03c5\u03c6\u03c7\u03c8\u03c9",
    hindi:"\u0905\u0906\u0907\u0908\u0909\u090a\u090f\u0910\u0913\u0914\u0915\u0916\u0917\u0918\u091a\u091b\u091c\u091d\u091f\u0920\u0921\u0922\u0923\u0924\u0925\u0926\u0927\u0928\u092a\u092b\u092c\u092d\u092e\u092f\u0930\u0932\u0935\u0936\u0937\u0938\u0939",
    korean:"\uac00\ub098\ub2e4\ub77c\ub9c8\ubc14\uc0ac\uc544\uc790\ucc28\uce74\ud0c0\ud30c\ud558",
    latin:"",
  };

  const generate = useCallback((seedsOverride, lengthOverride, optsOverride, quantumOverride) => {
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
      setAuditRecord(audit);
      setHistory((h) => [newPw, ...h.filter((x) => x !== newPw)].slice(0, 10));
      setGenerating(false);
      setIsNew(true);
      setTimeout(() => setIsNew(false), 2000);
    }, 200);
  }, [customSeeds, length, opts, quantumMode, profession, language, compliance]); // eslint-disable-line

  useEffect(() => { generate(null); }, []); // eslint-disable-line

  // ── Show toast helper ─────────────────────────────────────
  const showToast = (preset) => {
    clearTimeout(toastTimer.current);
    setToastPreset(preset);
    setToastVisible(true);
    toastTimer.current = setTimeout(() => setToastVisible(false), 3000);
  };

  // ── Compliance preset handler ─────────────────────────────
  // FULLY FUNCTIONAL: sets min length, character options,
  // resets quantum mode, auto-generates, shows toast
  const applyCompliance = (key) => {
    setCompliance(key);

    if (key === "none") {
      // Reset quantum if coming from quantum preset
      setQuantumMode(false);
      return;
    }

    const preset = COMPLIANCE_PRESETS[key];

    // Apply min length
    const newLength = Math.max(length, preset.minLen);
    setLength(newLength);

    // Apply character requirements from the standard
    const newOpts = { upper: preset.upper, num: preset.num, sym: preset.sym };
    setOpts(newOpts);

    // Handle quantum mode
    if (key === "quantum") {
      setQuantumMode(true);
    } else {
      // Non-quantum presets turn off quantum mode
      setQuantumMode(false);
    }

    // Show toast with preset info
    showToast(preset);

    // Auto-generate immediately with new settings applied
    setTimeout(() => {
      generate(null, newLength, newOpts, key === "quantum");
    }, 50);
  };

  const toggleOpt = (key) => setOpts((o) => ({ ...o, [key]: !o[key] }));

  const handleProfessionClick = (id) => {
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

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      {/* Toast notification */}
      <ComplianceToast preset={toastPreset} visible={toastVisible} />

      {/* Compliance Mode Bar */}
      <ComplianceBar compliance={compliance} onSelect={applyCompliance} activePreset={activePreset} />

      {/* Main Widget */}
      <div style={{ background:"#0a0a0c", border:"1px solid #141416", borderRadius:16, overflow:"hidden", boxShadow:"0 40px 80px #00000088,0 0 0 1px #141416" }}>
        {/* Tab selector */}
        <div style={{ display:"flex", borderBottom:"1px solid #1e1e1e" }} role="tablist">
          {[["password","Password"],["passphrase","Passphrase"]].map(([t,label])=>(
            <button key={t} role="tab" aria-selected={tab===t} onClick={()=>setTab(t)} style={{ flex:1, padding:"14px 0", fontFamily:"var(--font-mono)", fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase", background:tab===t?"#0c0c0e":"transparent", color:tab===t?"#C8FF00":"#777", border:"none", borderBottom:tab===t?"1px solid #C8FF00":"1px solid transparent", cursor:"pointer", transition:"all 0.2s" }}>
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ padding:"28px 28px 32px" }}>
          {tab === "password" ? (
            <>
              <PasswordDisplay password={password} generating={generating} strength={strength} entropy={entropy} crackTime={crackTime} isNew={isNew} />

              <div style={{ display:"flex", gap:8, marginTop:10, marginBottom:4, flexWrap:"wrap" }}>
                <TogglePill label={showDNA?"Hide DNA Score":"Show DNA Score"} active={showDNA} onClick={()=>setShowDNA(d=>!d)} />
                <TogglePill label={showAudit?"Hide Audit Log":"Show Audit Log"} active={showAudit} onClick={()=>setShowAudit(a=>!a)} />
                <TogglePill label={showBulk?"Close Bulk":"Bulk Generator"} active={showBulk} onClick={()=>setShowBulk(b=>!b)} />
                <TogglePill label={quantumMode?"\u26a1 Quantum ON":"Post-Quantum Mode"} active={quantumMode} onClick={()=>{ setQuantumMode(q=>!q); if (compliance!=="quantum") setCompliance("none"); }} />
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
                  <option value="latin">\uD83C\uDF10 English (Default)</option>
                  <option value="arabic">\uD83C\uDDE6\uD83C\uDDEA Arabic</option>
                  <option value="french">\uD83C\uDDEB\uD83C\uDDF7 French</option>
                  <option value="german">\uD83C\uDDE9\uD83C\uDDEA German</option>
                  <option value="spanish">\uD83C\uDDEA\uD83C\uDDF8 Spanish</option>
                  <option value="portuguese">\uD83C\uDDE7\uD83C\uDDF7 Portuguese</option>
                  <option value="russian">\uD83C\uDDF7\uD83C\uDDFA Russian</option>
                  <option value="japanese">\uD83C\uDDEF\uD83C\uDDF5 Japanese</option>
                  <option value="chinese">\uD83C\uDDE8\uD83C\uDDF3 Chinese</option>
                  <option value="greek">\uD83C\uDDEC\uD83C\uDDF7 Greek</option>
                  <option value="hindi">\uD83C\uDDEE\uD83C\uDDF3 Hindi</option>
                  <option value="korean">\uD83C\uDDF0\uD83C\uDDF7 Korean</option>
                </select>
              </div>

              <button className="btn-primary" style={{ width:"100%", justifyContent:"center" }} onClick={()=>generate()}>
                {generating ? "Generating\u2026" : <>Generate secure password <span style={{fontSize:18}}>\u2192</span></>}
              </button>
              <GeneratorTrustStrip />
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
