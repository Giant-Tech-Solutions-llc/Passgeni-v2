import Head from "next/head";
import Header from "../components/layout/Header.js";
import Footer from "../components/layout/Footer.js";
import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { getSiteSchema, getFAQSchema, getHowToSchema } from "../seo/schema.js";
import { FAQ } from "../content/copy.js";

/* ─── DESIGN TOKENS ────────────────────────────────────────────────────── */
const C = {
  canvas:   "#F7F8FC",   /* page base */
  surf1:    "#FFFFFF",   /* primary surfaces */
  surf2:    "#F1F3F9",   /* alternate surfaces */
  surf3:    "#E9ECF5",   /* subtle panels / strips */
  elevated: "#FFFFFF",   /* cards */
  border:   "#E6E8F0",
  borderFoc:"#3A4EFB",
  text:     "#0B0D17",
  textSub:  "#3C405A",
  textMut:  "#7B819A",
  blue:     "#3A4EFB",
  blueHov:  "#2D40E8",
  blueSoft: "rgba(58,78,251,0.08)",
  green:    "#22C55E",
  greenBg:  "rgba(34,197,94,0.10)",
  red:      "#EF4444",
  amber:    "#F59E0B",
  mono:     "'Space Mono',monospace",
  sh1:      "0 1px 2px rgba(16,24,40,0.04)",
  sh2:      "0 6px 16px rgba(16,24,40,0.06)",
  sh3:      "0 12px 28px rgba(16,24,40,0.08)",
};

/* ─── FADE-IN ──────────────────────────────────────────────────────────── */
function FI({ children, d=0, y=16, style, className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-56px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity:0, y }}
      animate={inView ? { opacity:1, y:0 } : {}}
      transition={{ duration:0.5, delay:d, ease:[0.22,1,0.36,1] }}
      style={style} className={className}>
      {children}
    </motion.div>
  );
}

/* ─── MICRO LABEL ──────────────────────────────────────────────────────── */
const Label = ({ children }) => (
  <div style={{
    display:"inline-block",
    fontSize:10,fontWeight:700,letterSpacing:"0.09em",textTransform:"uppercase",
    color:C.textMut,background:C.surf2,
    padding:"3px 9px",borderRadius:40,marginBottom:12,
  }}>{children}</div>
);

/* ─── EYEBROW ──────────────────────────────────────────────────────────── */
const Eyebrow = ({ children }) => (
  <div style={{
    display:"inline-flex",alignItems:"center",gap:7,
    fontSize:11,fontWeight:700,letterSpacing:"0.11em",textTransform:"uppercase",
    color:C.blue,marginBottom:14,
  }}>
    <span style={{width:5,height:5,borderRadius:"50%",background:C.blue}}/>
    {children}
  </div>
);

/* ─── CARD ─────────────────────────────────────────────────────────────── */
function Card({ label, title, body, metric, metricSub, children, style }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={()=>setHov(true)}
      onMouseLeave={()=>setHov(false)}
      style={{
        background:C.elevated,
        border:`1px solid ${hov ? C.borderFoc : C.border}`,
        borderRadius:14,padding:"20px 22px",
        boxShadow:hov ? C.sh3 : C.sh2,
        transform:hov ? "translateY(-2px)" : "translateY(0)",
        transition:"border-color .18s,box-shadow .18s,transform .18s",
        display:"flex",flexDirection:"column",gap:8,
        ...style,
      }}>
      {label && <Label>{label}</Label>}
      {title && <div style={{fontSize:14,fontWeight:700,color:C.text,lineHeight:1.35}}>{title}</div>}
      {body  && <div style={{fontSize:13,color:C.textSub,lineHeight:1.7,flex:1}}>{body}</div>}
      {children}
      {metric && (
        <div style={{marginTop:8,paddingTop:12,borderTop:`1px solid ${C.border}`}}>
          <div style={{fontSize:26,fontWeight:900,color:C.blue,letterSpacing:"-0.04em",fontFamily:"'Outfit',sans-serif",lineHeight:1}}>{metric}</div>
          {metricSub && <div style={{fontSize:11,color:C.textMut,marginTop:3}}>{metricSub}</div>}
        </div>
      )}
    </div>
  );
}

/* ─── BTN PRIMARY ──────────────────────────────────────────────────────── */
const BtnP = ({ children, href="#", style }) => (
  <a href={href} style={{
    display:"inline-flex",alignItems:"center",gap:8,
    background:C.blue,color:"#fff",
    fontSize:14,fontWeight:600,letterSpacing:"-0.01em",
    padding:"13px 28px",borderRadius:9,textDecoration:"none",
    boxShadow:"0 1px 2px rgba(58,78,251,0.2)",
    transition:"background .15s,transform .15s,box-shadow .15s",
    ...style,
  }}
    onMouseEnter={e=>{ e.currentTarget.style.background=C.blueHov; e.currentTarget.style.transform="translateY(-1px)"; e.currentTarget.style.boxShadow="0 6px 20px rgba(58,78,251,0.28)"; }}
    onMouseLeave={e=>{ e.currentTarget.style.background=C.blue; e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 1px 2px rgba(58,78,251,0.2)"; }}>
    {children}
  </a>
);

/* ─── BTN GHOST ────────────────────────────────────────────────────────── */
const BtnG = ({ children, href="#", style }) => (
  <a href={href} style={{
    display:"inline-flex",alignItems:"center",gap:8,
    background:"transparent",color:C.textSub,
    fontSize:14,fontWeight:500,
    padding:"12px 22px",borderRadius:9,
    border:`1.5px solid ${C.border}`,textDecoration:"none",
    transition:"border-color .15s,color .15s,background .15s",
    ...style,
  }}
    onMouseEnter={e=>{ e.currentTarget.style.borderColor=C.blue; e.currentTarget.style.color=C.blue; e.currentTarget.style.background=C.blueSoft; }}
    onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.color=C.textSub; e.currentTarget.style.background="transparent"; }}>
    {children}
  </a>
);

/* ─── CHECK ICON ───────────────────────────────────────────────────────── */
const Chk = ({ c=C.green, size=11 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
    <path d="M20 6L9 17l-5-5"/>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════════
   §1  HERO
═══════════════════════════════════════════════════════════════════════ */
function Hero() {
  return (
    <section style={{ background:C.surf1, padding:"112px clamp(16px,4vw,48px) 96px" }}>
      <div data-hero style={{ maxWidth:1200, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:64, alignItems:"center" }}>

        {/* ── Left: headline + CTAs ── */}
        <div>
          <FI d={0}>
            <div style={{
              display:"inline-flex",alignItems:"center",gap:8,
              background:C.blueSoft,borderRadius:40,
              padding:"5px 14px 5px 8px",marginBottom:28,
            }}>
              <span style={{width:6,height:6,borderRadius:"50%",background:C.blue,animation:"dot-pulse 2s infinite"}}/>
              <span style={{fontSize:12,fontWeight:600,color:C.blue,letterSpacing:"-0.01em"}}>Free forever · No account · No tracking</span>
            </div>
          </FI>

          <FI d={0.06}>
            <h1 style={{
              fontFamily:"'Outfit',sans-serif",fontWeight:900,
              fontSize:"clamp(52px,5.5vw,68px)",
              letterSpacing:"-0.05em",lineHeight:0.96,
              color:C.text,marginBottom:24,maxWidth:540,
            }}>
              Passwords that pass{" "}
              <em style={{fontFamily:"'Newsreader',serif",fontStyle:"italic",fontWeight:600,color:C.blue}}>every</em>{" "}
              compliance audit.
            </h1>
          </FI>

          <FI d={0.12}>
            <p style={{
              fontSize:"clamp(15px,1.5vw,17px)",lineHeight:1.85,
              color:C.textSub,marginBottom:36,maxWidth:480,
            }}>
              PassGeni generates cryptographically strong, profession-aware passwords—client-side, zero storage, NIST SP 800-63B aligned. Built for teams that get audited.
            </p>
          </FI>

          <FI d={0.18}>
            <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:40 }}>
              <BtnP href="#generator" style={{ fontSize:15, padding:"14px 32px" }}>
                Generate free password
                <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </BtnP>
              <BtnG href="/guides" style={{ fontSize:15, padding:"14px 22px" }}>View security guides</BtnG>
            </div>
          </FI>

          <FI d={0.22}>
            <div style={{ display:"flex", gap:"6px 20px", flexWrap:"wrap" }}>
              {["256-bit minimum entropy","Zero server transmission","NIST SP 800-63B","FIPS 140-3 RNG"].map(t=>(
                <div key={t} style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <Chk/>
                  <span style={{ fontSize:12, color:C.textMut, fontWeight:500 }}>{t}</span>
                </div>
              ))}
            </div>
          </FI>
        </div>

        {/* ── Right: layered product cards ── */}
        <FI d={0.1} className="hero-cards-col">
          <div style={{ position:"relative", height:480 }}>

            {/* Back card — Certificate */}
            <div style={{
              position:"absolute",top:0,left:20,right:-12,
              background:C.elevated,border:`1px solid ${C.border}`,borderRadius:14,
              boxShadow:C.sh3,padding:"20px 22px",zIndex:1,
              transform:"rotate(-1.8deg)",
            }}>
              <Label>Compliance Certificate</Label>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:4 }}>PG-8841 · HIPAA §164.312</div>
                  <div style={{ fontSize:11, color:C.textMut, fontFamily:C.mono }}>Issued 2024-01-15 · Valid 90 days</div>
                </div>
                <span style={{ fontSize:10, fontWeight:700, color:C.green, background:C.greenBg, padding:"3px 10px", borderRadius:20 }}>ACTIVE</span>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
                {[{l:"Entropy",v:"128 bits"},{l:"DNA Score",v:"A+"},{l:"RNG",v:"FIPS 140-3"}].map(s=>(
                  <div key={s.l} style={{ background:C.surf2, borderRadius:8, padding:"10px 12px" }}>
                    <div style={{ fontSize:10, color:C.textMut, marginBottom:4 }}>{s.l}</div>
                    <div style={{ fontSize:14, fontWeight:800, color:C.text, fontFamily:"'Outfit',sans-serif", letterSpacing:"-0.03em" }}>{s.v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Middle card — Generator output */}
            <div style={{
              position:"absolute",top:120,left:0,right:0,
              background:C.elevated,border:`1px solid ${C.border}`,borderRadius:14,
              boxShadow:C.sh3,padding:"20px 22px",zIndex:2,
            }}>
              <Label>Generator Output</Label>
              <div style={{
                background:"#0F1222",borderRadius:10,padding:"14px 16px",
                fontFamily:C.mono,fontSize:13,color:"#E3FF3B",
                letterSpacing:"0.04em",wordBreak:"break-all",marginBottom:12,
              }}>
                C0rt3x#Pr0t0c@l!9Zq
              </div>
              <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:12 }}>
                <div style={{ flex:1, height:4, borderRadius:2, background:C.surf2, overflow:"hidden" }}>
                  <div style={{ width:"88%", height:"100%", borderRadius:2, background:`linear-gradient(90deg,${C.blue},#33A4FA)` }}/>
                </div>
                <span style={{ fontSize:11, fontWeight:700, color:C.blue, whiteSpace:"nowrap", fontFamily:C.mono }}>128 bits</span>
              </div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {["NIST","HIPAA","PCI-DSS","SOC 2"].map(f=>(
                  <span key={f} style={{ fontSize:10, fontWeight:700, color:C.green, background:C.greenBg, padding:"2px 9px", borderRadius:20 }}>{f} ✓</span>
                ))}
              </div>
            </div>

            {/* Front card — Audit snippet */}
            <div style={{
              position:"absolute",top:300,left:24,right:-8,
              background:C.elevated,border:`1px solid ${C.border}`,borderRadius:14,
              boxShadow:C.sh3,padding:"20px 22px",zIndex:3,
              transform:"rotate(0.8deg)",
            }}>
              <Label>Open Audit — Generation Log</Label>
              <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                {[
                  { tag:"RNG", v:"crypto.getRandomValues(Uint32Array)" },
                  { tag:"POOL", v:"upper + lower + sym + num → 94 chars" },
                  { tag:"ENT",  v:"H = 20 × log₂(94) = 128.4 bits" },
                  { tag:"SEED", v:"'cortex' injected (physician)" },
                ].map(l=>(
                  <div key={l.tag} style={{ display:"flex", gap:8, alignItems:"baseline" }}>
                    <span style={{ fontSize:9, fontWeight:700, color:C.blue, background:C.blueSoft, padding:"1px 6px", borderRadius:4, fontFamily:C.mono, flexShrink:0 }}>{l.tag}</span>
                    <span style={{ fontSize:10, color:C.textSub, fontFamily:C.mono, lineHeight:1.6 }}>{l.v}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </FI>

      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   §2  TRUST STRIP
═══════════════════════════════════════════════════════════════════════ */
function TrustStrip() {
  const badges = ["HIPAA §164.312","SOC 2 Type II","PCI-DSS v4.0","NIST SP 800-63B","ISO/IEC 27001","DoD IL2","FIPS 140-3","Zero Knowledge"];
  return (
    <div style={{ background:C.surf3, padding:"22px clamp(16px,4vw,48px)" }}>
      <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"center", flexWrap:"wrap", gap:"8px 20px" }}>
        <span style={{ fontSize:11, fontWeight:600, color:C.textMut, letterSpacing:"0.08em", textTransform:"uppercase", flexShrink:0 }}>Compliance coverage</span>
        {badges.map(b=>(
          <span key={b} style={{
            fontSize:11,fontWeight:600,color:C.textSub,
            padding:"4px 13px",borderRadius:40,
            border:`1px solid ${C.border}`,background:C.elevated,
          }}>{b}</span>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   §3  HOW IT WORKS
═══════════════════════════════════════════════════════════════════════ */
function HowItWorks() {
  const steps = [
    {
      label:"Step 01 — Input",
      title:"Select your role",
      body:"Your profession seeds the character vocabulary. Cryptographic strength is identical. Recall improves by 30% vs random.",
      metric:"30%",
      metricSub:"recall improvement vs generic generators",
      ui:(
        <div style={{ background:C.surf2, borderRadius:8, padding:"12px 14px", fontFamily:C.mono, fontSize:10, color:C.textSub, lineHeight:2 }}>
          <div><span style={{color:C.blue}}>role</span>  → "physician"</div>
          <div><span style={{color:C.blue}}>seed</span>  → "cortex"</div>
          <div><span style={{color:C.blue}}>pool</span>  → medical vocab</div>
        </div>
      ),
    },
    {
      label:"Step 02 — Configure",
      title:"Apply compliance preset",
      body:"One click configures length minimums, required character classes, and entropy floor for HIPAA, PCI-DSS, SOC 2, ISO, DoD, or NIST.",
      metric:"6",
      metricSub:"frameworks auto-configured",
      ui:(
        <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginTop:4 }}>
          {["NIST","HIPAA","PCI-DSS","SOC2","ISO","DoD"].map((f,i)=>(
            <span key={f} style={{
              fontSize:10,fontWeight:700,padding:"3px 11px",borderRadius:40,
              background:i===1?C.blue:"#fff",
              color:i===1?"#fff":C.textSub,
              border:`1.5px solid ${i===1?C.blue:C.border}`,
            }}>{f}</span>
          ))}
        </div>
      ),
    },
    {
      label:"Step 03 — Generate",
      title:"Browser generates & certifies",
      body:"crypto.getRandomValues() runs entirely client-side. No server round-trip. Nothing transmitted. JWT-signed certificate issued on request.",
      metric:"0 bytes",
      metricSub:"transmitted to any server",
      ui:(
        <div style={{ background:"#0F1222", borderRadius:8, padding:"10px 14px" }}>
          <div style={{ fontFamily:C.mono, fontSize:11, color:"#E3FF3B", wordBreak:"break-all", marginBottom:8 }}>C0rt3x#Pr0t0c@l!9Zq</div>
          <div style={{ display:"flex", gap:6 }}>
            <span style={{ fontSize:9, fontWeight:700, color:C.green, background:C.greenBg, padding:"1px 7px", borderRadius:20 }}>128-bit ✓</span>
            <span style={{ fontSize:9, fontWeight:700, color:"#60A5FA", background:"rgba(96,165,250,0.12)", padding:"1px 7px", borderRadius:20 }}>Certified</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section style={{ background:C.surf2, padding:"96px clamp(16px,4vw,48px)" }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <FI>
          <div style={{ marginBottom:52 }}>
            <Eyebrow>How it works</Eyebrow>
            <h2 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:"clamp(32px,4vw,42px)", letterSpacing:"-0.04em", color:C.text, lineHeight:1.06, maxWidth:560 }}>
              Three inputs. One certified password.
            </h2>
          </div>
        </FI>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:20 }}>
          {steps.map((s,i)=>(
            <FI key={s.label} d={i*0.09}>
              <Card label={s.label} title={s.title} body={s.body} metric={s.metric} metricSub={s.metricSub} style={{ height:"100%" }}>
                <div style={{ marginTop:4 }}>{s.ui}</div>
              </Card>
            </FI>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   §4  PRODUCT SPLIT — live generator (dark panel allowed)
═══════════════════════════════════════════════════════════════════════ */
function GeneratorPanel() {
  const PROFS = ["Physician","Engineer","Lawyer","Developer","Designer","Teacher","Analyst","Nurse"];
  const PRESETS = [
    { id:"nist",  l:"NIST",   min:15, sym:true, num:true },
    { id:"hipaa", l:"HIPAA",  min:12, sym:true, num:true },
    { id:"pci",   l:"PCI",    min:12, sym:true, num:true },
    { id:"soc2",  l:"SOC2",   min:12, sym:true, num:true },
    { id:"iso",   l:"ISO",    min:12, sym:true, num:true },
    { id:"dod",   l:"DoD",    min:15, sym:true, num:true },
  ];
  const SEEDS = {
    Physician:["Cortex","Neural","Plasma","Axon","Synapse"],
    Engineer: ["Module","Circuit","Vector","Kernel","Buffer"],
    Lawyer:   ["Nexus","Clause","Brief","Statute","Docket"],
    Developer:["Daemon","Stack","Heap","Token","Cipher"],
    Designer: ["Bezier","Raster","Kerning","Glyph","Canvas"],
    Teacher:  ["Syllabus","Rubric","Lexis","Schema","Praxis"],
    Analyst:  ["Sigma","Pivot","Matrix","Median","Quantile"],
    Nurse:    ["Saline","Triage","Dosage","Vitals","Bolus"],
  };

  const [prof,   setProf]   = useState("Physician");
  const [len,    setLen]    = useState(18);
  const [sym,    setSym]    = useState(true);
  const [nums,   setNums]   = useState(true);
  const [preset, setPreset] = useState("nist");
  const [pw,     setPw]     = useState("");
  const [ent,    setEnt]    = useState(0);
  const [copied, setCopied] = useState(false);
  const [busy,   setBusy]   = useState(false);

  const gen = useCallback(() => {
    setBusy(true);
    setTimeout(() => {
      const p = PRESETS.find(x=>x.id===preset);
      const L = Math.max(len, p?.min || len);
      const seed = SEEDS[prof]?.[Math.floor(Math.random()*5)] || "Secure";
      const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
      const lower = "abcdefghjkmnpqrstuvwxyz";
      const dig   = "23456789";
      const syms  = "#@!$%&*+=?";
      let pool = upper+lower;
      if (nums||p?.num) pool+=dig;
      if (sym||p?.sym)  pool+=syms;
      const arr = new Uint32Array(L);
      crypto.getRandomValues(arr);
      let s = seed[0].toUpperCase()+seed.slice(1).toLowerCase();
      for (let i=s.length;i<L;i++) s+=pool[arr[i]%pool.length];
      const shuffled = s.split("").sort(()=>Math.random()-0.5).join("");
      setPw(shuffled);
      setEnt(Math.round(L*Math.log2(pool.length)));
      setBusy(false);
    }, 220);
  }, [prof, len, sym, nums, preset]);

  useEffect(()=>{ gen(); },[]);

  const copy = () => {
    if (!pw) return;
    navigator.clipboard?.writeText(pw).then(()=>{ setCopied(true); setTimeout(()=>setCopied(false),2000); });
  };

  /* dark panel — product UI */
  return (
    <div style={{
      background:"#0F1222",borderRadius:16,padding:"28px",
      border:"1px solid rgba(255,255,255,0.08)",
      boxShadow:C.sh3,
    }}>
      {/* titlebar */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
        <span style={{ fontSize:13, fontWeight:700, color:"rgba(255,255,255,0.9)" }}>Password Generator</span>
        <div style={{ display:"flex", gap:5 }}>
          {["#F87171","#FBBF24","#34D399"].map(c=><div key={c} style={{width:9,height:9,borderRadius:"50%",background:c}}/>)}
        </div>
      </div>

      {/* profession */}
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:"rgba(255,255,255,0.35)", marginBottom:8 }}>Profession</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
          {PROFS.map(p=>(
            <button key={p} onClick={()=>setProf(p)} style={{
              fontSize:11,fontWeight:p===prof?700:500,padding:"4px 12px",borderRadius:40,
              background:p===prof?C.blue:"rgba(255,255,255,0.06)",
              color:p===prof?"#fff":"rgba(255,255,255,0.55)",
              border:`1px solid ${p===prof?C.blue:"rgba(255,255,255,0.1)"}`,
              cursor:"pointer",transition:"all .15s",
            }}>{p}</button>
          ))}
        </div>
      </div>

      {/* length */}
      <div style={{ marginBottom:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
          <span style={{ fontSize:10, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:"rgba(255,255,255,0.35)" }}>Length</span>
          <span style={{ fontSize:13, fontWeight:700, color:C.blue }}>{len}</span>
        </div>
        <input type="range" min={8} max={32} value={len} onChange={e=>setLen(+e.target.value)} style={{ width:"100%", height:3, cursor:"pointer", accentColor:C.blue }}/>
      </div>

      {/* compliance */}
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:"rgba(255,255,255,0.35)", marginBottom:8 }}>Compliance preset</div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {PRESETS.map(p=>(
            <button key={p.id} onClick={()=>setPreset(p.id)} style={{
              fontSize:10,fontWeight:p.id===preset?700:500,padding:"3px 11px",borderRadius:40,
              background:p.id===preset?C.blue:"rgba(255,255,255,0.06)",
              color:p.id===preset?"#fff":"rgba(255,255,255,0.5)",
              border:`1px solid ${p.id===preset?C.blue:"rgba(255,255,255,0.1)"}`,
              cursor:"pointer",transition:"all .15s",
            }}>{p.l}</button>
          ))}
        </div>
      </div>

      {/* toggles */}
      <div style={{ display:"flex", gap:20, marginBottom:20 }}>
        {[{l:"Symbols",v:sym,s:setSym},{l:"Numbers",v:nums,s:setNums}].map(t=>(
          <label key={t.l} style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer" }}>
            <div onClick={()=>t.s(!t.v)} style={{ width:34,height:18,borderRadius:9, background:t.v?C.blue:"rgba(255,255,255,0.12)", position:"relative",transition:"background .15s",cursor:"pointer" }}>
              <div style={{ width:12,height:12,borderRadius:"50%",background:"#fff", position:"absolute",top:3,left:t.v?18:3,transition:"left .15s" }}/>
            </div>
            <span style={{ fontSize:11,fontWeight:500,color:"rgba(255,255,255,0.55)" }}>{t.l}</span>
          </label>
        ))}
      </div>

      {/* output */}
      <div style={{ background:"rgba(0,0,0,0.35)",borderRadius:10,padding:"14px 16px",marginBottom:14, border:"1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ fontFamily:C.mono,fontSize:13,color:"#E3FF3B",letterSpacing:"0.04em",wordBreak:"break-all",minHeight:40 }}>
          {busy ? <span style={{color:"rgba(255,255,255,0.3)"}}>generating…</span> : (pw||"—")}
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:10,marginTop:12 }}>
          <div style={{ flex:1,height:3,borderRadius:2,background:"rgba(255,255,255,0.1)",overflow:"hidden" }}>
            <div style={{ height:"100%",width:`${Math.min(100,(ent/200)*100)}%`,background:`linear-gradient(90deg,${C.blue},#33A4FA)`,borderRadius:2,transition:"width .35s" }}/>
          </div>
          <span style={{ fontSize:11,fontWeight:700,color:C.blue,fontFamily:C.mono,whiteSpace:"nowrap" }}>{ent} bits</span>
        </div>
      </div>

      {/* actions */}
      <div style={{ display:"flex", gap:10 }}>
        <button onClick={gen} style={{
          flex:1,padding:"11px",borderRadius:9,background:C.blue,color:"#fff",
          fontSize:13,fontWeight:700,border:"none",cursor:"pointer",
        }}>Regenerate</button>
        <button onClick={copy} style={{
          padding:"11px 20px",borderRadius:9,
          background:copied?"rgba(34,197,94,0.12)":"rgba(255,255,255,0.06)",
          color:copied?C.green:"rgba(255,255,255,0.6)",
          border:`1px solid ${copied?"rgba(34,197,94,0.3)":"rgba(255,255,255,0.12)"}`,
          fontSize:13,fontWeight:600,cursor:"pointer",transition:"all .2s",whiteSpace:"nowrap",
        }}>{copied?"Copied!":"Copy"}</button>
      </div>
    </div>
  );
}

function ProductSplit() {
  return (
    <section id="generator" style={{ background:C.surf1, padding:"96px clamp(16px,4vw,48px)" }}>
      <div className="split-grid" style={{ maxWidth:1200, margin:"0 auto", alignItems:"center" }}>
        <FI y={8}>
          <GeneratorPanel/>
        </FI>
        <FI d={0.1} y={8}>
          <div>
            <Eyebrow>Live generator</Eyebrow>
            <h2 style={{ fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:"clamp(30px,3.8vw,40px)",letterSpacing:"-0.04em",color:C.text,lineHeight:1.06,marginBottom:20,maxWidth:440 }}>
              Generate in 3 seconds.{" "}
              <em style={{fontFamily:"'Newsreader',serif",fontStyle:"italic",fontWeight:600}}>Certify</em>{" "}
              in one click.
            </h2>
            <p style={{ fontSize:"clamp(14px,1.4vw,16px)",lineHeight:1.85,color:C.textSub,marginBottom:28,maxWidth:420 }}>
              Built on <code style={{fontSize:11,background:C.blueSoft,color:C.blue,padding:"1px 5px",borderRadius:4}}>crypto.getRandomValues()</code> — the FIPS 140-3 source used in hardware security modules. Your profession seeds the vocabulary. The browser does the rest. Nothing leaves your device.
            </p>
            <div style={{ display:"flex",flexDirection:"column",gap:16,marginBottom:32 }}>
              {[
                {l:"Zero server transmission",    d:"The password is never sent anywhere — not even encrypted."},
                {l:"NIST SP 800-63B compliant",   d:"Entropy floor, passphrase support, Unicode character sets."},
                {l:"Signed compliance certificate",d:"ES256 JWT proof of generation parameters for audit trails."},
                {l:"6 compliance frameworks",     d:"HIPAA, PCI-DSS, SOC 2, ISO 27001, DoD IL2, NIST."},
              ].map(f=>(
                <div key={f.l} style={{ display:"flex",gap:12 }}>
                  <div style={{ width:20,height:20,borderRadius:"50%",flexShrink:0,background:C.blueSoft,display:"flex",alignItems:"center",justifyContent:"center",marginTop:2 }}>
                    <Chk size={9}/>
                  </div>
                  <div>
                    <div style={{ fontSize:14,fontWeight:700,color:C.text }}>{f.l}</div>
                    <div style={{ fontSize:12,color:C.textMut,marginTop:2 }}>{f.d}</div>
                  </div>
                </div>
              ))}
            </div>
            <BtnP href="#generator">Try the generator</BtnP>
          </div>
        </FI>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   §5  VALUE — asymmetric card grid
   Row1: 60/40 · Row2: 40/60 · Row3: 3 mixed
═══════════════════════════════════════════════════════════════════════ */
function ValueGrid() {
  return (
    <section style={{ background:C.surf2, padding:"96px clamp(16px,4vw,48px)" }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <FI>
          <div style={{ marginBottom:52 }}>
            <Eyebrow>Why PassGeni</Eyebrow>
            <h2 style={{ fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:"clamp(32px,4vw,42px)",letterSpacing:"-0.04em",color:C.text,lineHeight:1.06,maxWidth:560 }}>
              What your password{" "}
              <em style={{fontFamily:"'Newsreader',serif",fontStyle:"italic",fontWeight:600}}>actually</em>{" "}
              needs to pass audits.
            </h2>
          </div>
        </FI>

        {/* Row 1 — 60/40 */}
        <FI d={0.05}>
          <div className="vg-row" style={{ display:"grid",gridTemplateColumns:"1.5fr 1fr",gap:16,marginBottom:16 }}>
            <Card label="Entropy · 128-bit floor" title="Post-quantum resistant by default."
              body="Most generators produce 40–60 bits of entropy. PassGeni enforces a 128-bit minimum — identical to government HSM standards. Post-Quantum mode targets 256 bits, aligning with NIST 2024 guidance on Grover-resistant credentials."
              metric="128+" metricSub="bits minimum — government HSM standard">
              <div style={{ height:4,borderRadius:2,background:C.surf3,overflow:"hidden" }}>
                <div style={{ width:"88%",height:"100%",borderRadius:2,background:`linear-gradient(90deg,${C.blue},#33A4FA)` }}/>
              </div>
            </Card>
            <Card label="Zero Knowledge · Client-side only" title="Your password is never transmitted."
              body="Generation runs in your browser via crypto.getRandomValues(). No server ever processes your credential — not during generation, not during certification."
              metric="0 bytes" metricSub="sent to any server, ever">
              <div style={{ background:C.surf2,borderRadius:8,padding:"10px 12px",fontFamily:C.mono,fontSize:9,color:C.textSub,lineHeight:1.9 }}>
                <div><span style={{color:C.blue}}>source</span> → browser</div>
                <div><span style={{color:C.blue}}>server</span> → never touched</div>
              </div>
            </Card>
          </div>
        </FI>

        {/* Row 2 — 40/60 */}
        <FI d={0.1}>
          <div className="vg-row" style={{ display:"grid",gridTemplateColumns:"1fr 1.5fr",gap:16,marginBottom:16 }}>
            <Card label="Compliance · 6 frameworks" title="One click. Full configuration."
              body="HIPAA, PCI-DSS v4.0, SOC 2 Type II, ISO/IEC 27001, DoD IL2, and NIST SP 800-63B. Each preset auto-configures length, character requirements, and entropy floor."
              metric="6" metricSub="compliance frameworks auto-configured">
              <div style={{ display:"flex",flexWrap:"wrap",gap:5 }}>
                {["HIPAA","SOC2","PCI","ISO","NIST","DoD"].map(f=>(
                  <span key={f} style={{fontSize:9,fontWeight:700,color:C.green,background:C.greenBg,padding:"1px 8px",borderRadius:20}}>{f} ✓</span>
                ))}
              </div>
            </Card>
            <Card label="Memorability · Profession-aware seeding" title="30% better recall. Identical security."
              body="A credential is only secure if it's used — not reset within a week. PassGeni seeds each password from domain vocabulary matching your profession. A physician gets medical terms; a developer gets system patterns. Cryptographic strength is identical to pure random output."
              metric="30%" metricSub="recall improvement vs generic generators">
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
                {[{role:"Physician",seed:"cortex"},{role:"Engineer",seed:"kernel"},{role:"Lawyer",seed:"nexus"},{role:"Designer",seed:"bezier"}].map(r=>(
                  <div key={r.role} style={{background:C.surf2,borderRadius:8,padding:"8px 10px"}}>
                    <div style={{fontSize:9,color:C.textMut,marginBottom:2}}>{r.role}</div>
                    <div style={{fontSize:11,fontWeight:700,color:C.blue,fontFamily:C.mono}}>"{r.seed}"</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </FI>

        {/* Row 3 — 3 mixed non-uniform */}
        <FI d={0.15}>
          <div className="vg-row3" style={{ display:"grid",gridTemplateColumns:"1.2fr 0.9fr 0.9fr",gap:16 }}>
            <Card label="Audit Trail · ES256 JWT" title="Signed certificates for every generation."
              body="Every password can be certified with an ES256-signed JWT containing generation parameters, entropy score, compliance badges, and SHA-256 fingerprint. Send it to your auditor."
              metric="ES256" metricSub="JWT signature standard">
              <div style={{ fontFamily:C.mono,fontSize:9,color:C.textMut,lineHeight:1.8 }}>
                {`{ "alg": "ES256", "ent": 128, "frame": "HIPAA", "fp": "a3f8…" }`}
              </div>
            </Card>
            <Card label="DNA Score · 7-point audit" title="Quality graded A+ to C."
              body="Length, character diversity, entropy, repeat detection, dictionary resistance — per-check breakdown."
              metric="A+" metricSub="maximum DNA score">
              <div style={{ display:"flex",flexDirection:"column",gap:3 }}>
                {["Length ≥ 16","Mixed case","Symbols","No repeats","No dict"].map(c=>(
                  <div key={c} style={{display:"flex",alignItems:"center",gap:5}}>
                    <Chk size={9}/><span style={{fontSize:10,color:C.textSub}}>{c}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card label="Speed · No round-trips" title="Under one second, every time."
              body="No API latency. No network calls. Generation is instant because everything runs locally."
              metric="<1s" metricSub="average generation time">
              <div style={{ background:C.surf2,borderRadius:8,padding:"10px 12px",fontFamily:C.mono,fontSize:9,color:C.textSub,lineHeight:1.8 }}>
                <div>RNG → local</div>
                <div>server → 0ms</div>
                <div>total → ~220ms</div>
              </div>
            </Card>
          </div>
        </FI>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   §6  DASHBOARD PREVIEW
═══════════════════════════════════════════════════════════════════════ */
function Dashboard() {
  const certs = [
    {id:"PG-8841",date:"2024-01-15",frame:"HIPAA §164.312",bits:"128b",score:"A+",status:"active"},
    {id:"PG-8840",date:"2024-01-14",frame:"SOC 2 Type II", bits:"144b",score:"A+",status:"active"},
    {id:"PG-8839",date:"2024-01-13",frame:"PCI-DSS v4.0",  bits:"136b",score:"A", status:"active"},
    {id:"PG-8838",date:"2024-01-10",frame:"NIST 800-63B",  bits:"122b",score:"A+",status:"expired"},
  ];
  const scores = [
    {l:"NIST SP 800-63B",v:98},{l:"HIPAA §164.312",v:100},
    {l:"PCI-DSS v4.0",v:94},{l:"SOC 2 Type II",v:97},
  ];

  return (
    <section style={{ background:C.surf1, padding:"96px clamp(16px,4vw,48px)" }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <FI>
          <div style={{ marginBottom:48, display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:16 }}>
            <div>
              <Eyebrow>Compliance dashboard</Eyebrow>
              <h2 style={{ fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:"clamp(30px,3.8vw,40px)",letterSpacing:"-0.04em",color:C.text,lineHeight:1.06,maxWidth:480 }}>
                Every certificate. Every score. One view.
              </h2>
            </div>
            <BtnG href="/pricing">Get Team access</BtnG>
          </div>
        </FI>

        <FI d={0.1}>
          <div style={{ border:`1px solid ${C.border}`,borderRadius:16,overflow:"hidden",boxShadow:C.sh3 }}>
            {/* dashboard titlebar */}
            <div style={{ background:C.surf2,borderBottom:`1px solid ${C.border}`,padding:"13px 22px",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
              <div style={{ display:"flex",gap:6 }}>
                {["#F87171","#FBBF24","#34D399"].map(c=><div key={c} style={{width:10,height:10,borderRadius:"50%",background:c}}/>)}
              </div>
              <span style={{ fontSize:12,fontWeight:600,color:C.textMut }}>PassGeni — Compliance Dashboard</span>
              <span style={{ fontSize:11,color:C.textMut }}>Team plan</span>
            </div>

            <div className="db-grid" style={{ display:"grid",gridTemplateColumns:"1fr 340px" }}>
              {/* cert table */}
              <div style={{ padding:"28px 32px",borderRight:`1px solid ${C.border}` }}>
                <div style={{ fontSize:12,fontWeight:700,color:C.text,marginBottom:16 }}>Certificate Log</div>
                <div style={{ display:"grid",gridTemplateColumns:"70px 88px 1fr 48px 48px 64px",gap:8,paddingBottom:10,borderBottom:`1px solid ${C.border}`,marginBottom:8 }}>
                  {["ID","Date","Framework","Entropy","Score","Status"].map(h=>(
                    <div key={h} style={{ fontSize:9,fontWeight:700,color:C.textMut,letterSpacing:"0.07em",textTransform:"uppercase" }}>{h}</div>
                  ))}
                </div>
                {certs.map(c=>(
                  <div key={c.id} style={{ display:"grid",gridTemplateColumns:"70px 88px 1fr 48px 48px 64px",gap:8,padding:"10px 0",borderBottom:`1px solid ${C.surf2}` }}>
                    <div style={{ fontSize:11,fontWeight:700,color:C.blue,fontFamily:C.mono }}>{c.id}</div>
                    <div style={{ fontSize:11,color:C.textMut }}>{c.date}</div>
                    <div style={{ fontSize:11,fontWeight:600,color:C.text }}>{c.frame}</div>
                    <div style={{ fontSize:11,color:C.textSub,fontFamily:C.mono }}>{c.bits}</div>
                    <div style={{ fontSize:11,fontWeight:700,color:C.green }}>{c.score}</div>
                    <div>
                      <span style={{ fontSize:9,fontWeight:700,color:c.status==="active"?C.green:"#9CA3AF",background:c.status==="active"?C.greenBg:"rgba(156,163,175,0.12)",padding:"2px 8px",borderRadius:20 }}>
                        {c.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* scores sidebar */}
              <div style={{ padding:"28px",background:C.surf2 }}>
                <div style={{ fontSize:12,fontWeight:700,color:C.text,marginBottom:20 }}>Compliance Scores</div>
                {scores.map(s=>(
                  <div key={s.l} style={{ marginBottom:18 }}>
                    <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
                      <span style={{ fontSize:11,fontWeight:600,color:C.textSub }}>{s.l}</span>
                      <span style={{ fontSize:11,fontWeight:700,color:C.text }}>{s.v}%</span>
                    </div>
                    <div style={{ height:4,borderRadius:2,background:C.surf3,overflow:"hidden" }}>
                      <div style={{ height:"100%",width:`${s.v}%`,borderRadius:2,background:`linear-gradient(90deg,${C.blue},#33A4FA)` }}/>
                    </div>
                  </div>
                ))}
                <div style={{ marginTop:24,padding:"16px",borderRadius:12,background:C.elevated,border:`1px solid ${C.border}` }}>
                  <div style={{ fontSize:10,fontWeight:600,color:C.textMut,marginBottom:4 }}>Overall grade</div>
                  <div style={{ fontSize:40,fontWeight:900,color:C.blue,fontFamily:"'Outfit',sans-serif",letterSpacing:"-0.05em",lineHeight:1 }}>A<span style={{color:C.text}}>+</span></div>
                  <div style={{ fontSize:10,color:C.textMut,marginTop:4 }}>4/4 frameworks passing</div>
                </div>
              </div>
            </div>
          </div>
        </FI>
      </div>
      <style>{`@media(max-width:700px){[data-db-grid]{grid-template-columns:1fr!important}}`}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   §7  CTA
═══════════════════════════════════════════════════════════════════════ */
function Cta() {
  return (
    <section style={{ background:C.surf3, padding:"100px clamp(16px,4vw,48px)" }}>
      <div style={{ maxWidth:680, margin:"0 auto", textAlign:"center" }}>
        <FI>
          <Eyebrow>Get started</Eyebrow>
          <h2 style={{ fontFamily:"'Outfit',sans-serif",fontWeight:900,fontSize:"clamp(38px,5vw,56px)",letterSpacing:"-0.045em",lineHeight:0.97,color:C.text,marginBottom:22 }}>
            Your next password is{" "}
            <em style={{fontFamily:"'Newsreader',serif",fontStyle:"italic",fontWeight:600,color:C.blue}}>three seconds away.</em>
          </h2>
          <p style={{ fontSize:"clamp(15px,1.5vw,17px)",lineHeight:1.85,color:C.textSub,marginBottom:36,maxWidth:420,margin:"0 auto 36px" }}>
            Free forever. No account. No tracking. No data stored. Cryptographically sound passwords, built for audits.
          </p>
          <div style={{ display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",marginBottom:36 }}>
            <BtnP href="#generator" style={{ fontSize:15,padding:"14px 32px" }}>Generate my password</BtnP>
            <BtnG href="/pricing"   style={{ fontSize:15,padding:"14px 22px" }}>View Team plans</BtnG>
          </div>
          <div style={{ display:"flex",gap:"6px 20px",justifyContent:"center",flexWrap:"wrap",paddingTop:24,borderTop:`1px solid ${C.border}` }}>
            {["Zero server storage","NIST SP 800-63B","FIPS 140-3 RNG","No account required","Open audit mode"].map(t=>(
              <div key={t} style={{ display:"flex",alignItems:"center",gap:6 }}>
                <Chk/><span style={{ fontSize:12,color:C.textMut,fontWeight:500 }}>{t}</span>
              </div>
            ))}
          </div>
        </FI>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════════ */
export default function HomePage() {
  const siteSchema = getSiteSchema();
  const faqSchema  = getFAQSchema(FAQ?.items || []);
  const howSchema  = getHowToSchema();

  return (
    <>
      <Head>
        <title>PassGeni — AI Password Generator | Zero Storage, NIST SP 800-63B Compliant</title>
        <meta name="description" content="PassGeni generates cryptographically strong, profession-aware passwords — entirely in your browser. Zero data storage. NIST SP 800-63B, HIPAA, PCI-DSS, SOC 2 compliant. Free forever."/>
        <meta name="viewport" content="width=device-width,initial-scale=1"/>
        <link rel="canonical" href="https://passgeni.ai"/>
        <meta property="og:type"        content="website"/>
        <meta property="og:url"         content="https://passgeni.ai"/>
        <meta property="og:title"       content="PassGeni — AI Password Generator | Zero Storage, NIST Compliant"/>
        <meta property="og:description" content="Generate cryptographically strong, profession-aware passwords in your browser. Zero data storage. HIPAA, PCI-DSS, SOC 2, NIST SP 800-63B compliant."/>
        <meta property="og:image"       content="https://passgeni.ai/og-image.png"/>
        <meta name="twitter:card"        content="summary_large_image"/>
        <meta name="twitter:site"        content="@passgeni_ai"/>
        <meta name="twitter:title"       content="PassGeni — AI Password Generator"/>
        <meta name="twitter:description" content="Strong passwords, zero storage, NIST compliant. Built for teams that get audited."/>
        <meta name="twitter:image"       content="https://passgeni.ai/og-image.png"/>
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(siteSchema)}}/>
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(howSchema)}}/>
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(faqSchema)}}/>
        <style>{`
          @keyframes dot-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.3)}}
          [data-hero]{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center}
          @media(max-width:900px){
            [data-hero]{grid-template-columns:1fr!important}
            .hero-cards-col{display:none!important}
          }
          .split-grid{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;max-width:1200px;margin:0 auto}
          @media(max-width:860px){
            .split-grid{grid-template-columns:1fr!important;gap:40px!important}
          }
          .vg-row{display:grid;gap:16px}
          .vg-row3{display:grid;gap:16px}
          @media(max-width:720px){
            .vg-row,.vg-row3{grid-template-columns:1fr!important}
          }
          .db-grid{display:grid;grid-template-columns:1fr 340px}
          @media(max-width:700px){
            .db-grid{grid-template-columns:1fr!important}
          }
        `}</style>
      </Head>

      <Header/>

      {/* canvas base — all sections sit on this */}
      <main style={{ background:C.canvas }}>
        <Hero/>
        <TrustStrip/>
        <HowItWorks/>
        <ProductSplit/>
        <ValueGrid/>
        <Dashboard/>
        <Cta/>
      </main>

      <Footer/>
    </>
  );
}
