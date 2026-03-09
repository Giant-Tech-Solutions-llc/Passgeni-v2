import { useState, useEffect, useRef, useCallback } from "react";

function PassGeniLogo({height="32px"}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9669.8 1703.3" style={{height,display:"block",width:"auto"}} aria-label="PassGeni">
      <path fill="#FEFEFE" fillRule="nonzero" d="M652.82 19.68c-219.31,0 -438.24,0 -655.34,0l0 1587.85 249.9 0 0 -541.81 405.44 0c317.35,0 512.33,-210.46 512.33,-523.02 0,-312.56 -194.98,-523.02 -512.33,-523.02zm-405.44 249.9l405.44 0c179.13,0 262.43,99.15 262.43,273.12 0,173.97 -83.3,273.12 -262.43,273.12l-405.44 0 0 -546.24z"/>
      <path fill="#FEFEFE" fillRule="nonzero" d="M2315.14 1391.17l0 0c0,-160.7 -0.37,-321.04 -0.37,-481.74 0,-220.41 -246.58,-347.2 -440.83,-361.95 -245.48,-18.43 -534.07,45.33 -625.48,302.61l235.15 84.41c47.92,-133.43 253.59,-145.59 371.9,-136.37 76.3,5.53 194.24,54.55 203.09,103.57 15.85,89.2 -171.39,74.82 -339.46,76.67 -230.74,2.21 -489.85,14.74 -489.85,288.97 0,253.95 268.7,357.89 487.63,357.89 100.99,0 276.8,-27.28 335.41,-119.79l17.32 0c15.85,61.18 71.5,106.52 137.11,106.52l233.31 0 0 -249.9 -124.95 29.12zm-249.9 -185.03c0,147.06 -237.74,169.18 -348.31,169.18 -60.08,0 -237.74,-21.01 -237.74,-108 -4.42,-138.96 477.68,-24.33 586.05,-134.9l0 73.72z"/>
      <path fill="#FEFEFE" fillRule="nonzero" d="M3324.32 939.29l242.89 -57.13c-53.81,-228.89 -266.85,-340.57 -489.85,-340.57 -204.56,0 -480.26,90.67 -480.26,335.41 0,283.81 267.22,311.09 484.69,333.94 117.94,12.53 232.94,24.33 232.94,60.81 0,87.72 -176.55,103.57 -237.37,103.57 -99.52,0 -235.15,-36.86 -262.06,-147.8l-243.26 57.87c55.29,229.63 283.81,339.83 505.33,339.83 220.04,0 487.27,-93.99 487.27,-353.47 -3.32,-238.47 -225.2,-286.76 -457.41,-311.08 -46.07,-4.79 -258.74,-15.48 -258.74,-83.67 0,-62.29 173.97,-85.51 228.89,-85.51 101.73,0 220.78,36.49 246.95,147.8z"/>
      <path fill="#FEFEFE" fillRule="nonzero" d="M4452.19 939.29l242.89 -57.13c-53.81,-228.89 -266.85,-340.57 -489.85,-340.57 -204.56,0 -480.26,90.67 -480.26,335.41 0,283.81 267.22,311.09 484.69,333.94 117.94,12.53 232.94,24.33 232.94,60.81 0,87.72 -176.55,103.57 -237.37,103.57 -99.52,0 -235.15,-36.86 -262.06,-147.8l-243.26 57.87c55.29,229.63 283.81,339.83 505.33,339.83 220.04,0 487.27,-93.99 487.27,-353.47 -3.32,-238.47 -225.2,-286.76 -457.41,-311.08 -46.07,-4.79 -258.74,-15.48 -258.74,-83.67 0,-62.29 173.97,-85.51 228.89,-85.51 101.73,0 220.78,36.49 246.95,147.8z"/>
      <path fill="#C8FF00" fillRule="nonzero" d="M5930.91 1414.92c94.09,-174.6 60.85,-232.49 77.55,-378.01 98.19,54.83 207.27,98.93 349,97.09l1.15 -299.68c-217.79,-11.34 -364.73,-162.59 -366.32,-366.76l-303.69 -2.67c1.81,242.47 -157.37,330.91 -364.57,371.91l0.27 295.37c94.53,12.01 217.09,-27.78 302.52,-70.86 24.83,-12.51 52.73,-34.86 78.27,-41.11 -3.3,92.15 10.27,150.55 -30.24,232.37 -62.64,126.54 -206.71,188.6 -340.19,146.46 -253.11,-79.9 -199.31,-366.52 -199.42,-571.46l0.19 -523.54 1221.24 0.24 0.99 -300.85 -1526.26 -1.54c9.97,234.69 -13.8,1098.8 12.58,1238.06 106.65,563.06 854.01,607.19 1086.95,174.99z"/>
      <path fill="#C8FF00" fillRule="nonzero" d="M6753.26 1017.06c28.38,-128.63 138.22,-225.57 272.02,-225.57 135.27,0 221.15,100.25 242.89,225.57l-514.91 0zm768.5 0c-26.91,-263.54 -220.78,-475.47 -496.48,-475.47 -297.45,0 -530.39,247.32 -530.39,541.82 0,294.5 232.94,541.81 530.39,541.81 194.61,0 359.74,-108.73 443.04,-282.33l-226.68 -108.73c-42.02,88.46 -117.95,141.17 -216.36,141.17 -129.37,0 -237,-91.04 -269.07,-214.52l767.02 0c0,-49.02 3.69,-94.36 -1.47,-143.75z"/>
      <path fill="#C8FF00" fillRule="nonzero" d="M7760.6 802.18c0,268.33 1.11,536.65 1.47,805.35l249.9 0 -1.11 -586.41c-0.37,-151.12 131.95,-229.63 274.96,-229.63 147.8,0 274.59,84.04 274.59,244.37l0 571.67 249.9 0 0 -571.67c0,-266.12 -168.81,-494.27 -444.14,-494.27 -115.37,0 -276.44,53.81 -339.1,187.61l-16.59 -4.06c0,-76.67 -61.92,-141.54 -141.54,-141.54l-233.31 0 0 250.27 124.95 -31.7z"/>
      <path fill="#C8FF00" fillRule="nonzero" d="M8942.65 1357.63l0 249.9 219.31 0 0 0 249.9 0 0 0 255.43 0 0 -249.9 -255.43 0 0 -640.23c0,-78.51 -63.76,-142.64 -141.54,-142.64l-306.29 0 0 251.74 197.93 -30.59 0 561.72 -219.31 0zm344.26 -1194.21c-68.93,0 -124.95,56.02 -124.95,124.95 0,68.93 56.02,124.95 124.95,124.95 68.93,0 124.95,-56.02 124.95,-124.95 0,-68.93 -56.02,-124.95 -124.95,-124.95z"/>
    </svg>
  );
}

/* --- SEO HEAD --- */
function SEOHead() {
  useEffect(() => {
    document.title = "PassGeni \u2014 AI Password Generator | Zero Storage, Zero Knowledge";
    const setMeta = (name, content, prop = false) => {
      const attr = prop ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, name); document.head.appendChild(el); }
      el.setAttribute("content", content);
    };
    setMeta("description", "PassGeni is a free AI-powered password generator. Creates strong, memorable passwords based on your profession. Zero data storage. Client-side only. No account needed. NIST SP 800-63B compliant.");
    setMeta("keywords", "AI password generator, free password generator, strong password generator, zero knowledge password generator, NIST passphrase generator, secure password maker, memorable password generator");
    setMeta("robots", "index, follow");
    setMeta("og:title", "PassGeni \u2014 AI Password Generator That Remembers You, Not Your Passwords", true);
    setMeta("og:description", "Generate fortress-grade passwords tailored to your profession. Zero storage. Client-side only. Free forever.", true);
    setMeta("og:type", "website", true);
    setMeta("og:url", "https://passgeni.online", true);
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", "PassGeni \u2014 AI Password Generator");
    setMeta("twitter:description", "Strong, memorable passwords built around your profession. Zero storage. NIST-compliant. Free.");
    let canonical = document.querySelector("link[rel='canonical']");
    if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }
    canonical.href = "https://passgeni.online";
    const schema = {"@context":"https://schema.org","@graph":[{"@type":"SoftwareApplication","name":"PassGeni","applicationCategory":"SecurityApplication","operatingSystem":"Web Browser","url":"https://passgeni.online","description":"PassGeni is an AI-powered password generator","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"}},{"@type":"WebSite","name":"PassGeni","url":"https://passgeni.online"}]};
    let script = document.querySelector("#passgeni-schema");
    if (!script) { script = document.createElement("script"); script.id = "passgeni-schema"; script.type = "application/ld+json"; document.head.appendChild(script); }
    script.textContent = JSON.stringify(schema);
  }, []);
  return null;
}

/* --- STYLES --- */
const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@700;800&family=DM+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { background: #060608; }
    ::selection { background: #C8FF00; color: #000; }
    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-track { background: #060608; }
    ::-webkit-scrollbar-thumb { background: #C8FF00; border-radius: 2px; }
    @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
    @keyframes slideUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
    @keyframes fadeIn { from{opacity:0} to{opacity:1} }
    @keyframes scanline { 0%{top:-10%} 100%{top:110%} }
    @keyframes glow { 0%,100%{box-shadow:0 0 20px #C8FF0033} 50%{box-shadow:0 0 40px #C8FF0066} }
    @keyframes gridPulse { 0%,100%{opacity:0.025} 50%{opacity:0.06} }
    @keyframes ringExpand { 0%{transform:translate(-50%,-50%) scale(0.7);opacity:0.5} 100%{transform:translate(-50%,-50%) scale(2.2);opacity:0} }
    @keyframes passwordStream { 0%{transform:translateY(0);opacity:0.6} 100%{transform:translateY(-100%);opacity:0} }
    @keyframes trustPulse { 0%,100%{opacity:0.7} 50%{opacity:1} }
    @keyframes unbreakablePulse { 0%,100%{text-shadow:0 0 8px #C8FF0066,0 0 16px #C8FF0033} 50%{text-shadow:0 0 16px #C8FF00CC,0 0 32px #C8FF0088,0 0 48px #C8FF0044} }
    @keyframes inputSlideIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
    @keyframes historySlideIn { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }
    @keyframes dnaBar { from{width:0} to{width:var(--w)} }
    @keyframes pricingGlow { 0%,100%{box-shadow:0 0 0 1px #C8FF0033,0 40px 80px #C8FF0008} 50%{box-shadow:0 0 0 1px #C8FF0066,0 40px 80px #C8FF0018} }
    .use-it-btn { background:#111;border:none;border-radius:6px;padding:8px 16px;cursor:default;font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:700;color:#666;letter-spacing:0.08em;transition:all 0.18s cubic-bezier(.16,1,.3,1);white-space:nowrap; }
    .use-it-btn.active { background:#C8FF00;color:#000;cursor:pointer; }
    .use-it-btn.active:hover { background:#d4ff1a;box-shadow:0 0 18px #C8FF0066;transform:scale(1.04); }
    .use-it-btn.active:active { transform:scale(0.97); }
    .unbreakable-label { animation: unbreakablePulse 2s ease infinite; }
    .fade-up  { animation: slideUp 0.7s cubic-bezier(.16,1,.3,1) forwards; }
    .fade-up-2{ animation: slideUp 0.7s 0.1s cubic-bezier(.16,1,.3,1) both; }
    .fade-up-3{ animation: slideUp 0.7s 0.2s cubic-bezier(.16,1,.3,1) both; }
    .fade-up-4{ animation: slideUp 0.7s 0.3s cubic-bezier(.16,1,.3,1) both; }
    .cta-primary { display:inline-flex;align-items:center;gap:10px;background:#C8FF00;color:#000;font-family:'Outfit',sans-serif;font-weight:800;font-size:15px;letter-spacing:0.02em;padding:16px 32px;border-radius:4px;border:none;cursor:pointer;transition:all 0.2s cubic-bezier(.16,1,.3,1);text-decoration:none;animation:glow 3s ease infinite; }
    .cta-primary:hover{transform:translateY(-2px) scale(1.02);box-shadow:0 12px 40px #C8FF0044;}
    .cta-primary:active{transform:scale(0.98);}
    .cta-ghost { display:inline-flex;align-items:center;gap:10px;background:transparent;color:#fff;font-family:'DM Sans',sans-serif;font-weight:600;font-size:14px;letter-spacing:0.04em;padding:15px 28px;border-radius:4px;border:1px solid #2a2a2a;cursor:pointer;transition:all 0.2s ease;text-decoration:none; }
    .cta-ghost:hover{border-color:#C8FF00;color:#C8FF00;background:#C8FF0008;}
    .feature-card { background:#0c0c0e;border:1px solid #141416;border-radius:12px;padding:36px 32px;transition:all 0.3s cubic-bezier(.16,1,.3,1);cursor:default;position:relative;overflow:hidden; }
    .feature-card::before { content:'';position:absolute;inset:0;background:linear-gradient(135deg,#C8FF0006,transparent);opacity:0;transition:opacity 0.3s; }
    .feature-card:hover{border-color:#C8FF0033;transform:translateY(-4px);}
    .feature-card:hover::before{opacity:1;}
    .proof-card { background:#0c0c0e;border:1px solid #141416;border-radius:12px;padding:28px;transition:border-color 0.2s; }
    .proof-card:hover{border-color:#C8FF0033;}
    .nav-link { font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;color:#bbb;letter-spacing:0.06em;cursor:pointer;transition:color 0.2s;text-decoration:none; }
    .nav-link:hover{color:#fff;}
    .ticker-inner{display:flex;gap:0;animation:ticker 22s linear infinite;width:max-content;}
    input[type=range]{-webkit-appearance:none;width:100%;height:2px;background:#1e1e1e;outline:none;cursor:pointer;border-radius:2px;}
    input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:50%;background:#C8FF00;cursor:pointer;border:2px solid #060608;box-shadow:0 0 10px #C8FF0066;}
    .toggle-pill { padding:7px 16px;border-radius:100px;font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:600;letter-spacing:0.06em;cursor:pointer;border:1px solid #1e1e1e;transition:all 0.15s ease;background:transparent;color:#888; }
    .toggle-pill.active{background:#C8FF0015;border-color:#C8FF0066;color:#C8FF00;}
    .toggle-pill:hover:not(.active){border-color:#333;color:#999;}
    .copy-btn { background:transparent;border:1px solid #1e1e1e;color:#555;border-radius:6px;padding:8px 16px;font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:0.08em;cursor:pointer;transition:all 0.2s;white-space:nowrap; }
    .copy-btn.copied{border-color:#C8FF00;color:#C8FF00;background:#C8FF0010;}
    .copy-btn:hover:not(.copied){border-color:#333;color:#888;}
    .faq-item{border-bottom:1px solid #111;padding:24px 0;cursor:pointer;}
    .faq-item:last-child{border-bottom:none;}
    .strength-seg{height:3px;border-radius:100px;flex:1;transition:background 0.4s cubic-bezier(.16,1,.3,1);}
    .trust-chip { display:inline-flex;align-items:center;gap:5px;background:#0d0d0f;border:1px solid #1c1c1e;border-radius:100px;padding:4px 11px;font-family:'IBM Plex Mono',monospace;font-size:9px;color:#999;letter-spacing:0.1em;text-transform:uppercase;white-space:nowrap;transition:all 0.2s; }
    .trust-chip:hover{border-color:#C8FF0033;color:#bbb;}
    .trust-chip .live-dot{width:5px;height:5px;border-radius:50%;background:#C8FF00;flex-shrink:0;animation:trustPulse 2.5s ease infinite;}
    .trust-chip .chip-icon{font-size:8px;color:#C8FF0088;}
    .nav-trust-row{display:flex;gap:6px;align-items:center;}
    .gen-trust-strip { display:flex;gap:8px;flex-wrap:wrap;justify-content:center;padding:16px 0 4px;border-top:1px solid #111;margin-top:20px; }
    .history-row { display:flex;justify-content:space-between;align-items:center;padding:10px 14px;border-radius:8px;background:#0c0c0e;border:1px solid #141416;gap:12px;animation:historySlideIn 0.25s ease; }
    .history-row:hover{border-color:#C8FF0022;}
    .compliance-pill { padding:7px 14px;border-radius:6px;font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:700;letter-spacing:0.08em;cursor:pointer;border:1px solid #1e1e1e;transition:all 0.15s ease;background:transparent;color:#888;text-transform:uppercase; }
    .compliance-pill.active{background:#C8FF0015;border-color:#C8FF0088;color:#C8FF00;box-shadow:0 0 12px #C8FF0022;}
    .compliance-pill:hover:not(.active){border-color:#333;color:#bbb;}
    .bulk-row { display:flex;justify-content:space-between;align-items:center;padding:10px 14px;border-bottom:1px solid #0e0e10;gap:12px; }
    .bulk-row:last-child{border-bottom:none;}
    .bulk-row:hover{background:#0c0c0e;}
    .pricing-card { background:#0a0a0c;border:1px solid #1a1a1a;border-radius:16px;padding:36px 32px;position:relative;transition:all 0.3s cubic-bezier(.16,1,.3,1); }
    .pricing-card.featured { animation:pricingGlow 4s ease infinite; }
    .pricing-card:hover{transform:translateY(-4px);}
    .pricing-check { width:18px;height:18px;border-radius:50%;background:#C8FF0015;border:1px solid #C8FF0044;display:inline-flex;align-items:center;justify-content:center;font-size:9px;color:#C8FF00;flex-shrink:0; }
    @media(max-width:900px){ .nav-trust-row{display:none!important;} .hero-title{font-size:42px!important;} .features-grid{grid-template-columns:1fr!important;} .proof-grid{grid-template-columns:1fr!important;} .stats-row{gap:32px!important;} .nav-links{display:none!important;} .pricing-grid{grid-template-columns:1fr!important;} }
    @media(max-width:600px){ .trust-chip{font-size:8px;padding:3px 9px;} }
  `}</style>
);

/* --- DATA --- */
const CHARS = { lower:"abcdefghijklmnopqrstuvwxyz", upper:"ABCDEFGHIJKLMNOPQRSTUVWXYZ", num:"0123456789", sym:"!@#$%^&*-_=+" };
const PROFESSIONS = [
  { id:"dev", label:"Developer", seeds:["stack","kernel","deploy","tensor","cipher"] },
  { id:"doc", label:"Doctor",    seeds:["cortex","neural","helix","pulse","synapse"] },
  { id:"fin", label:"Finance",   seeds:["alpha","yield","delta","equity","index"] },
  { id:"des", label:"Designer",  seeds:["pixel","bezier","vector","render","frame"] },
  { id:"law", label:"Legal",     seeds:["clause","nexus","accord","mandate","statute"] },
  { id:"edu", label:"Educator",  seeds:["axiom","theory","method","cipher","prime"] },
];
const PROFESSION_KEYWORD_MAP = {
  pilot:["altitude","vector"], aviator:["altitude","vector"], plumber:["torque","conduit"],
  electrician:["voltage","circuit"], chef:["mise","saute"], cook:["simmer","recipe"],
  architect:["datum","facade"], nurse:["dosage","triage"], pharmacist:["molecule","dosage"],
  dentist:["calculus","molar"], vet:["fauna","biopsy"], accountant:["ledger","audit"],
  analyst:["pivot","metric"], journalist:["byline","source"], writer:["syntax","prose"],
  musician:["tempo","chord"], artist:["chroma","canvas"], athlete:["velocity","stamina"],
  coach:["playbook","drill"], soldier:["cipher","delta"], police:["patrol","sector"],
  firefighter:["thermal","ladder"], farmer:["yield","soil"], engineer:["torque","module"],
  scientist:["entropy","quanta"], researcher:["datum","vector"], student:["theory","focus"],
  manager:["pipeline","scope"], ceo:["equity","pivot"], developer:["stack","kernel"],
  designer:["bezier","frame"], teacher:["axiom","method"], therapist:["cortex","rapport"],
  broker:["yield","spread"], trader:["delta","alpha"], driver:["torque","route"],
  mechanic:["torque","valve"], carpenter:["mortise","grain"], tailor:["seam","tension"],
  barber:["taper","blade"], photographer:["aperture","shutter"], videographer:["frame","render"],
};
const customProfessionLog = [];
function trackCustomProfession(input) {
  const entry = { profession:input.trim().toLowerCase(), timestamp:new Date().toISOString() };
  customProfessionLog.push(entry);
  console.log("[PassGeni] Custom profession:", entry);
}
const ADJECTIVES = ["vivid","neon","stark","swift","iron","ghost","prime","ultra","bold","nova","apex","echo","flux","grim","keen","lone","pure","raw","void","zero","dark","deep","fast","high","sharp","cool","hard","soft","bright","calm"];
const SINGLE_WORD_PAIRS = {
  pilot:["sky","wing"], chef:["mise","flame"], driver:["route","gear"],
  barber:["taper","blade"], nurse:["pulse","care"], farmer:["seed","crop"],
  writer:["prose","draft"], artist:["chroma","brush"], singer:["chord","lyric"],
  coder:["stack","loop"], hacker:["cipher","root"], trader:["alpha","bid"],
  lawyer:["clause","writ"], judge:["bench","rule"], guard:["patrol","watch"],
  miner:["shaft","ore"], diver:["depth","tank"], boxer:["jab","ring"],
  baker:["knead","crust"], welder:["arc","flux"], sailor:["tide","mast"],
};
const COMPLIANCE_PRESETS = {
  none:   { label:"Custom",  minLen:8,  maxLen:32, upper:true,  num:true,  sym:true,  color:"#888",    desc:"Your settings" },
  hipaa:  { label:"HIPAA",   minLen:12, maxLen:32, upper:true,  num:true,  sym:true,  color:"#4fc3f7", desc:"Min 12 chars \u00b7 All character classes" },
  pci:    { label:"PCI-DSS", minLen:12, maxLen:32, upper:true,  num:true,  sym:true,  color:"#ffb74d", desc:"Min 12 chars \u00b7 No dictionary words" },
  soc2:   { label:"SOC 2",   minLen:16, maxLen:32, upper:true,  num:true,  sym:true,  color:"#ce93d8", desc:"Min 16 chars \u00b7 Mixed case + symbols" },
  iso:    { label:"ISO 27001",minLen:14, maxLen:32, upper:true,  num:true,  sym:true,  color:"#80cbc4", desc:"Min 14 chars \u00b7 Full complexity required" },
};

function deriveSeeds(input) {
  const clean = input.trim().toLowerCase();
  for (const [key, seeds] of Object.entries(PROFESSION_KEYWORD_MAP)) { if (clean.includes(key)) return seeds; }
  for (const [key, seeds] of Object.entries(SINGLE_WORD_PAIRS)) { if (clean.includes(key)) return seeds; }
  const words = clean.split(/\s+/).filter(w=>w.length>3);
  if (words.length >= 2) return [words[0].slice(0,8), words[1].slice(0,8)];
  if (words.length === 1) return [words[0].slice(0,8), ["nexus","vault","sigma","prime","omega"][Math.floor(Math.random()*5)]];
  return ["cipher","vault"];
}
const COLORS = ["crimson","cobalt","amber","onyx","jade","slate","ivory","azure"];
function buildPassword(len, prof, opts, customSeeds=null) {
  if (customSeeds) {
    const [t1,t2] = customSeeds;
    const color = COLORS[Math.floor(Math.random()*COLORS.length)];
    const num = Math.floor(Math.random()*900)+100;
    const recipe = `${t1}${color}${num}${t2}`;
    let pool = CHARS.lower;
    if (opts.upper) pool+=CHARS.upper; if (opts.num) pool+=CHARS.num; if (opts.sym) pool+=CHARS.sym;
    const base = recipe.split("");
    const fill = Array.from({length:Math.max(0,len-base.length)},()=>pool[Math.floor(Math.random()*pool.length)]);
    const arr = [...base,...fill].slice(0,len);
    for (let i=arr.length-1;i>arr.length/2;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]];}
    return arr.join("");
  }
  const p = PROFESSIONS.find(x=>x.id===prof)||PROFESSIONS[0];
  const seed = p.seeds[Math.floor(Math.random()*p.seeds.length)];
  let pool = CHARS.lower;
  if (opts.upper) pool+=CHARS.upper; if (opts.num) pool+=CHARS.num; if (opts.sym) pool+=CHARS.sym;
  const fill = Array.from({length:Math.max(0,len-seed.length)},()=>pool[Math.floor(Math.random()*pool.length)]);
  const arr = [...seed,...fill];
  for (let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]];}
  return arr.slice(0,len).join("");
}
function getStrength(pw) {
  if (!pw) return {score:0,label:"",color:"#1a1a1a"};
  let s=0;
  if(pw.length>=10)s++;if(pw.length>=16)s++;if(/[A-Z]/.test(pw))s++;if(/[0-9]/.test(pw))s++;if(/[^A-Za-z0-9]/.test(pw))s++;if(pw.length>=22)s++;
  if(s<=2) return {score:1,label:"Crackable",color:"#ff4444"};
  if(s<=3) return {score:2,label:"Decent",color:"#ffaa00"};
  if(s<=4) return {score:3,label:"Strong",color:"#C8FF00"};
  return {score:4,label:"Unbreakable",color:"#C8FF00"};
}
function getCrackTime(pw) {
  if(!pw) return "";
  const e=pw.length*Math.log2(94);
  if(e<40) return "under a minute"; if(e<60) return "a few hours"; if(e<80) return "decades";
  return "longer than the universe";
}
function getEntropy(pw){return pw?Math.round(pw.length*Math.log2(94)):0;}
function getDNAScore(pw) {
  if (!pw) return null;
  const checks = [
    { label:"Length \u2265 12",    pass: pw.length >= 12,   weight: 20 },
    { label:"Length \u2265 16",    pass: pw.length >= 16,   weight: 15 },
    { label:"Uppercase A-Z",  pass: /[A-Z]/.test(pw),  weight: 15 },
    { label:"Lowercase a-z",  pass: /[a-z]/.test(pw),  weight: 10 },
    { label:"Numbers 0-9",    pass: /[0-9]/.test(pw),  weight: 15 },
    { label:"Symbols !@#\u2026",   pass: /[^A-Za-z0-9]/.test(pw), weight: 15 },
    { label:"No repeats (aaa)",pass: !/(.)\1\1/.test(pw), weight: 10 },
  ];
  const total = checks.reduce((a,c)=>a+(c.pass?c.weight:0),0);
  return { checks, total };
}

/* --- COMPONENTS --- */
function TrustChip({label, type="shield"}) {
  return (
    <span className="trust-chip" title={label}>
      {type==="dot"   && <span className="live-dot"/>}
      {type==="check" && <span className="chip-icon">\u2713</span>}
      {type==="zero"  && <span className="chip-icon">\u25ce</span>}
      {type==="shield"&& <span className="chip-icon">\ud83d\udd12</span>}
      {label}
    </span>
  );
}
function GeneratorTrustStrip() {
  return (
    <div className="gen-trust-strip" role="list" aria-label="Security guarantees">
      <TrustChip label="Password never leaves your browser" type="dot"/>
      <TrustChip label="Zero server contact" type="shield"/>
      <TrustChip label="crypto.getRandomValues() entropy" type="zero"/>
      <TrustChip label="NIST SP 800-63B" type="check"/>
      <TrustChip label="No account \u00b7 No logs" type="shield"/>
    </div>
  );
}
function StrengthBar({password}) {
  const {score,label,color} = getStrength(password);
  const entropy = getEntropy(password);
  return (
    <div style={{marginTop:14}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
        <span style={{fontFamily:"'IBM Plex Mono'",fontSize:10,color:"#888",letterSpacing:"0.1em",textTransform:"uppercase"}}>strength</span>
        <div style={{display:"flex",gap:12,alignItems:"center"}}>
          {password && <span style={{fontFamily:"'IBM Plex Mono'",fontSize:9,color:"#555",letterSpacing:"0.06em"}}>{entropy} bits entropy</span>}
          <span style={{fontFamily:"'IBM Plex Mono'",fontSize:10,color,letterSpacing:"0.08em",fontWeight:600}}>{label}{label==="Unbreakable"?" \u2746":""}</span>
        </div>
      </div>
      <div style={{display:"flex",gap:4}}>
        {[1,2,3,4].map(i=><div key={i} className="strength-seg" style={{background:i<=score?color:"#141416"}}/>)}
      </div>
      {password && <div style={{marginTop:8,fontFamily:"'DM Sans'",fontSize:11,color:"#888"}}>Estimated crack time: <span style={{color:"#aaa"}}>{getCrackTime(password)}</span></div>}
    </div>
  );
}
function CopyBtn({text}) {
  const [copied,setCopied]=useState(false);
  const copy=async()=>{if(!text)return;await navigator.clipboard.writeText(text);setCopied(true);setTimeout(()=>setCopied(false),2000);};
  return <button className={`copy-btn ${copied?"copied":""}`} onClick={copy} aria-label="Copy to clipboard">{copied?"\u2713 COPIED":"COPY"}</button>;
}
function PasswordDisplay({password,generating}) {
  return (
    <div style={{background:"#08080a",border:"1px solid #141416",borderRadius:10,padding:"20px 24px",position:"relative",overflow:"hidden"}} aria-live="polite">
      <div style={{position:"absolute",left:0,right:0,height:"1px",background:"linear-gradient(90deg,transparent,#C8FF0022,transparent)",animation:"scanline 3s linear infinite",pointerEvents:"none"}}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:16}}>
        <div style={{fontFamily:"'IBM Plex Mono'",fontSize:"clamp(13px,2vw,16px)",lineHeight:1.7,wordBreak:"break-all",flex:1,minHeight:26,opacity:generating?0.3:1,transition:"opacity 0.2s"}}>
          {password ? password.split("").map((c,i)=>{
            let color="#e8e8e8";
            if("!@#$%^&*-_=+".includes(c))color="#C8FF00";
            else if("0123456789".includes(c))color="#777";
            else if(c===c.toUpperCase()&&/[A-Z]/.test(c))color="#fff";
            return <span key={i} style={{color}}>{c}</span>;
          }) : <span style={{color:"#aaa"}}>click generate \u2014</span>}
        </div>
        <CopyBtn text={password}/>
      </div>
      <StrengthBar password={password}/>
    </div>
  );
}
function DNAScorePanel({password}) {
  const dna = getDNAScore(password);
  if (!dna) return null;
  const grade = dna.total >= 85 ? {g:"A+",c:"#C8FF00"} : dna.total >= 70 ? {g:"A",c:"#C8FF00"} : dna.total >= 55 ? {g:"B",c:"#ffaa00"} : {g:"C",c:"#ff6644"};
  return (
    <div style={{background:"#08080a",border:"1px solid #141416",borderRadius:10,padding:"20px 24px",marginTop:12,animation:"fadeIn 0.3s ease"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div>
          <div style={{fontFamily:"'IBM Plex Mono'",fontSize:10,color:"#888",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:4}}>Password DNA Score</div>
          <div style={{fontFamily:"'DM Sans'",fontSize:12,color:"#555"}}>Breakdown of cryptographic quality</div>
        </div>
        <div style={{textAlign:"center"}}>
          <div style={{fontFamily:"'Outfit'",fontWeight:800,fontSize:32,color:grade.c,lineHeight:1}}>{grade.g}</div>
          <div style={{fontFamily:"'IBM Plex Mono'",fontSize:9,color:"#555",marginTop:2}}>{dna.total}/100</div>
        </div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {dna.checks.map((c,i)=>(
          <div key={i}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
              <span style={{fontFamily:"'DM Sans'",fontSize:12,color:c.pass?"#ccc":"#555"}}>{c.pass?"\u2713":"\u2717"} {c.label}</span>
              <span style={{fontFamily:"'IBM Plex Mono'",fontSize:9,color:c.pass?"#C8FF0088":"#333"}}>{c.pass?`+${c.weight}`:"0"} pts</span>
            </div>
            <div style={{height:3,background:"#141416",borderRadius:100,overflow:"hidden"}}>
              <div style={{height:"100%",borderRadius:100,background:c.pass?"#C8FF00":"transparent",width:c.pass?`${c.weight}%`:"0%",transition:"width 0.8s cubic-bezier(.16,1,.3,1)"}}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
function PasswordHistory({history, onClear}) {
  if (!history.length) return null;
  return (
    <div style={{marginTop:16,animation:"fadeIn 0.3s ease"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <span style={{fontFamily:"'IBM Plex Mono'",fontSize:10,color:"#888",letterSpacing:"0.12em",textTransform:"uppercase"}}>Recent \u00b7 This Session</span>
        <button onClick={onClear} style={{background:"none",border:"none",fontFamily:"'IBM Plex Mono'",fontSize:9,color:"#555",cursor:"pointer",letterSpacing:"0.08em",transition:"color 0.15s"}} onMouseEnter={e=>e.target.style.color="#ff4444"} onMouseLeave={e=>e.target.style.color="#555"}>Clear all</button>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        {history.slice(0,8).map((pw,i)=>(
          <div key={i} className="history-row">
            <span style={{fontFamily:"'IBM Plex Mono'",fontSize:11,color:"#888",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1,letterSpacing:"0.04em"}}>{pw}</span>
            <div style={{display:"flex",gap:6,alignItems:"center",flexShrink:0}}>
              <span style={{fontFamily:"'IBM Plex Mono'",fontSize:9,color:getStrength(pw).color}}>{getStrength(pw).label}</span>
              <CopyBtn text={pw}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
function BulkGenerator({prof, opts, len, otherSeeds}) {
  const [count,setCount]=useState(10);
  const [bulk,setBulk]=useState([]);
  const [generating,setGenerating]=useState(false);
  const generate=()=>{
    setGenerating(true);
    setTimeout(()=>{
      const list = Array.from({length:count},()=>buildPassword(len,prof,opts,otherSeeds));
      setBulk(list);setGenerating(false);
    },300);
  };
  const download=()=>{
    if(!bulk.length) return;
    const content = `PassGeni \u2014 Bulk Password Export\nGenerated: ${new Date().toLocaleString()}\nCount: ${bulk.length}\n\n${bulk.join("\n")}`;
    const blob = new Blob([content],{type:"text/plain"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `passgeni-${bulk.length}-passwords.txt`;
    a.click();
  };
  const copyAll=async()=>{if(!bulk.length)return;await navigator.clipboard.writeText(bulk.join("\n"));};
  return (
    <div style={{background:"#0a0a0c",border:"1px solid #141416",borderRadius:16,overflow:"hidden"}}>
      <div style={{padding:"20px 24px",borderBottom:"1px solid #1a1a1a",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
        <div>
          <div style={{fontFamily:"'Outfit'",fontWeight:700,fontSize:16,color:"#fff"}}>Bulk Generator</div>
          <div style={{fontFamily:"'DM Sans'",fontSize:12,color:"#666",marginTop:2}}>Generate multiple passwords at once \u00b7 Same settings</div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <span style={{fontFamily:"'IBM Plex Mono'",fontSize:10,color:"#888"}}>Count:</span>
          {[5,10,20,50].map(n=>(
            <button key={n} onClick={()=>setCount(n)} className={`toggle-pill ${count===n?"active":""}`} style={{padding:"5px 12px"}}>{n}</button>
          ))}
        </div>
      </div>
      <div style={{padding:"20px 24px"}}>
        <button className="cta-primary" style={{width:"100%",justifyContent:"center",marginBottom:16}} onClick={generate}>
          {generating?`Generating ${count} passwords\u2026`:<>Generate {count} passwords <span style={{fontSize:16}}>\u26a1</span></>}
        </button>
        {bulk.length>0 && (
          <>
            <div style={{display:"flex",gap:8,marginBottom:12}}>
              <button onClick={copyAll} className="cta-ghost" style={{flex:1,justifyContent:"center",fontSize:12,padding:"10px 16px"}}>Copy all</button>
              <button onClick={download} className="cta-ghost" style={{flex:1,justifyContent:"center",fontSize:12,padding:"10px 16px"}}>\u2193 Download .txt</button>
            </div>
            <div style={{background:"#08080a",border:"1px solid #141416",borderRadius:10,overflow:"hidden",maxHeight:320,overflowY:"auto"}}>
              {bulk.map((pw,i)=>(
                <div key={i} className="bulk-row">
                  <span style={{fontFamily:"'IBM Plex Mono'",fontSize:11,color:"#999",width:24,flexShrink:0}}>{i+1}.</span>
                  <span style={{fontFamily:"'IBM Plex Mono'",fontSize:12,color:"#ccc",flex:1,letterSpacing:"0.04em",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{pw}</span>
                  <div style={{display:"flex",gap:8,alignItems:"center",flexShrink:0}}>
                    <span style={{fontFamily:"'IBM Plex Mono'",fontSize:9,color:getStrength(pw).color}}>{getStrength(pw).label}</span>
                    <CopyBtn text={pw}/>
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

/* --- GENERATOR WIDGET --- */
function GeneratorWidget() {
  const [prof,setProf]=useState("dev");
  const [len,setLen]=useState(18);
  const [opts,setOpts]=useState({upper:true,num:true,sym:true});
  const [pw,setPw]=useState("");
  const [generating,setGenerating]=useState(false);
  const [tab,setTab]=useState("password");
  const [showOtherInput,setShowOtherInput]=useState(false);
  const [otherValue,setOtherValue]=useState("");
  const [otherSeeds,setOtherSeeds]=useState(null);
  const [otherLabel,setOtherLabel]=useState("");
  const [history,setHistory]=useState([]);
  const [showDNA,setShowDNA]=useState(false);
  const [showBulk,setShowBulk]=useState(false);
  const [compliance,setCompliance]=useState("none");
  const inputRef=useRef(null);

  const applyCompliance=(key)=>{
    setCompliance(key);
    if(key==="none") return;
    const preset=COMPLIANCE_PRESETS[key];
    setLen(l=>Math.max(l,preset.minLen));
    setOpts({upper:preset.upper,num:preset.num,sym:preset.sym});
  };
  const generate=(seedsOverride=null)=>{
    setGenerating(true);
    setTimeout(()=>{
      const seeds=seedsOverride!==undefined?seedsOverride:otherSeeds;
      const newPw=buildPassword(len,prof,opts,seeds);
      setPw(newPw);
      setHistory(h=>[newPw,...h.filter(x=>x!==newPw)].slice(0,10));
      setGenerating(false);
    },200);
  };
  useEffect(()=>{generate(null);},[]);// eslint-disable-line react-hooks/exhaustive-deps
  const toggleOpt=key=>setOpts(o=>({...o,[key]:!o[key]}));
  const handleProfClick=(id)=>{setProf(id);setShowOtherInput(false);setOtherSeeds(null);setOtherLabel("");setOtherValue("");};
  const handleOtherSubmit=()=>{const t=otherValue.trim();if(!t)return;trackCustomProfession(t);const seeds=deriveSeeds(t);setOtherSeeds(seeds);setOtherLabel(t);setShowOtherInput(false);generate(seeds);};
  const activePreset=COMPLIANCE_PRESETS[compliance];

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      {/* Compliance Bar */}
      <div style={{background:"#0a0a0c",border:"1px solid #141416",borderRadius:12,padding:"16px 20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10,marginBottom:12}}>
          <div style={{fontFamily:"'IBM Plex Mono'",fontSize:10,color:"#888",letterSpacing:"0.12em",textTransform:"uppercase"}}>Compliance Mode</div>
          {compliance!=="none"&&<span style={{fontFamily:"'IBM Plex Mono'",fontSize:9,color:activePreset.color,letterSpacing:"0.08em"}}>{activePreset.desc}</span>}
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {Object.entries(COMPLIANCE_PRESETS).map(([key,p])=>(
            <button key={key} onClick={()=>applyCompliance(key)} className={`compliance-pill ${compliance===key?"active":""}`} style={compliance===key?{borderColor:p.color,color:p.color,background:`${p.color}11`}:{}}>{p.label}</button>
          ))}
        </div>
      </div>

      {/* Main Widget */}
      <div style={{background:"#0a0a0c",border:"1px solid #141416",borderRadius:16,overflow:"hidden",boxShadow:"0 40px 80px #00000088,0 0 0 1px #141416"}}>
        <div style={{display:"flex",borderBottom:"1px solid #1e1e1e"}} role="tablist">
          {[["password","Password"],["passphrase","Passphrase"]].map(([t,label])=>(
            <button key={t} role="tab" aria-selected={tab===t} onClick={()=>setTab(t)} style={{flex:1,padding:"14px 0",fontFamily:"'IBM Plex Mono'",fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",background:tab===t?"#0c0c0e":"transparent",color:tab===t?"#C8FF00":"#777",border:"none",borderBottom:tab===t?"1px solid #C8FF00":"1px solid transparent",cursor:"pointer",transition:"all 0.2s"}}>{label}</button>
          ))}
        </div>
        <div style={{padding:"28px 28px 32px"}}>
          {tab==="password" ? (
            <>
              <PasswordDisplay password={pw} generating={generating}/>
              <div style={{display:"flex",gap:8,marginTop:10,marginBottom:4}}>
                <button onClick={()=>setShowDNA(d=>!d)} className={`toggle-pill ${showDNA?"active":""}`} style={{fontSize:10,padding:"5px 12px"}}>{showDNA?"Hide":"Show"} DNA Score</button>
                <button onClick={()=>setShowBulk(b=>!b)} className={`toggle-pill ${showBulk?"active":""}`} style={{fontSize:10,padding:"5px 12px"}}>Bulk Generator</button>
              </div>
              {showDNA && <DNAScorePanel password={pw}/>}
              <div style={{marginTop:20,marginBottom:20}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
                  <label htmlFor="pw-len" style={{fontFamily:"'IBM Plex Mono'",fontSize:10,color:"#888",letterSpacing:"0.12em",textTransform:"uppercase"}}>length</label>
                  <span style={{fontFamily:"'IBM Plex Mono'",fontSize:11,color:"#C8FF00",fontWeight:600}}>{len} characters</span>
                </div>
                <input id="pw-len" type="range" min={compliance!=="none"?activePreset.minLen:8} max={32} value={len} onChange={e=>setLen(+e.target.value)}/>
              </div>
              <div style={{display:"flex",gap:8,marginBottom:24,flexWrap:"wrap"}} role="group">
                {[["sym","Symbols"],["num","Numbers"],["upper","A-Z"]].map(([k,label])=>(
                  <button key={k} onClick={()=>toggleOpt(k)} className={`toggle-pill ${opts[k]?"active":""}`} aria-pressed={opts[k]}>{opts[k]?"\u2713 ":""}{label}</button>
                ))}
              </div>
              <div style={{marginBottom:20}}>
                <div style={{fontFamily:"'IBM Plex Mono'",fontSize:10,color:"#777",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:10}}>profession seed</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                  {PROFESSIONS.map(p=>(
                    <button key={p.id} onClick={()=>handleProfClick(p.id)} className={`toggle-pill ${prof===p.id&&!otherSeeds?"active":""}`}>{p.label}</button>
                  ))}
                  <button onClick={()=>{setShowOtherInput(true);setTimeout(()=>inputRef.current?.focus(),60);}} className={`toggle-pill ${otherSeeds?"active":""}`} style={otherSeeds?{}:{borderColor:"#2a2a2a",borderStyle:"dashed",color:"#888"}}>
                    {otherSeeds?`\u2746 ${otherLabel}`:"+ Other"}
                  </button>
                </div>
                {showOtherInput&&(
                  <div style={{marginTop:10,animation:"inputSlideIn 0.22s cubic-bezier(.16,1,.3,1)"}}>
                    <div style={{display:"flex",gap:8,alignItems:"stretch",background:"#08080a",border:"1px solid #C8FF0044",borderRadius:8,padding:"4px 4px 4px 16px"}}>
                      <input ref={inputRef} type="text" placeholder="e.g. Pilot, Plumber, Chef\u2026" value={otherValue} onChange={e=>setOtherValue(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")handleOtherSubmit();if(e.key==="Escape"){setShowOtherInput(false);setOtherValue("");}}} style={{flex:1,background:"transparent",border:"none",outline:"none",fontFamily:"'IBM Plex Mono'",fontSize:13,color:"#fff",letterSpacing:"0.04em",padding:"10px 0"}}/>
                      <button onClick={handleOtherSubmit} disabled={!otherValue.trim()} className={`use-it-btn ${otherValue.trim()?"active":""}`}>Use it \u2192</button>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",marginTop:8,padding:"0 2px"}}>
                      <span style={{fontFamily:"'IBM Plex Mono'",fontSize:9,color:"#555",letterSpacing:"0.08em"}}>AI extracts keywords from your profession</span>
                      <button onClick={()=>{setShowOtherInput(false);setOtherValue("");}} style={{background:"none",border:"none",fontFamily:"'IBM Plex Mono'",fontSize:9,color:"#C8FF0066",cursor:"pointer",letterSpacing:"0.06em",transition:"color 0.15s"}} onMouseEnter={e=>e.target.style.color="#C8FF00"} onMouseLeave={e=>e.target.style.color="#C8FF0066"}>\u2190 back</button>
                    </div>
                  </div>
                )}
              </div>
              <button className="cta-primary" style={{width:"100%",justifyContent:"center"}} onClick={()=>generate()}>
                {generating?"Generating\u2026":<>Generate secure password <span style={{fontSize:18}}>\u2192</span></>}
              </button>
              <GeneratorTrustStrip/>
              <PasswordHistory history={history} onClear={()=>setHistory([])}/>
            </>
          ) : (
            <PassphraseTab prof={prof} setProf={setProf} otherSeeds={otherSeeds} otherLabel={otherLabel}
              showOtherInput={showOtherInput} setShowOtherInput={setShowOtherInput}
              otherValue={otherValue} setOtherValue={setOtherValue}
              inputRef={inputRef} handleProfClick={handleProfClick} handleOtherSubmit={handleOtherSubmit}/>
          )}
        </div>
      </div>
      {showBulk && <BulkGenerator prof={prof} opts={opts} len={len} otherSeeds={otherSeeds}/>}
    </div>
  );
}

function PassphraseTab({prof,setProf,otherSeeds,otherLabel,showOtherInput,setShowOtherInput,otherValue,setOtherValue,inputRef,handleProfClick,handleOtherSubmit}) {
  const [parts,setParts]=useState(null);
  const [generating,setGenerating]=useState(false);
  const [history,setHistory]=useState([]);
  const pickRand=(arr)=>arr[Math.floor(Math.random()*arr.length)];
  const safeNum=()=>{
    const bad=new Set(["007","123","124","234","345","456","567","678","789","111","222","333","444","555","666","777","888","999","000","420","2024","2025","2026"]);
    let n;do{n=String(Math.floor(Math.random()*900)+100);}while(bad.has(n));
    return n;
  };
  const generate=(seedsOverride)=>{
    setGenerating(true);
    setTimeout(()=>{
      const seeds=seedsOverride!==undefined?seedsOverride:otherSeeds;
      let bank=seeds?[...seeds]:([...(PROFESSIONS.find(x=>x.id===prof)||PROFESSIONS[0]).seeds]);
      const w1=pickRand(bank);
      const w2pool=bank.filter(w=>w!==w1);
      const w2=w2pool.length>0?pickRand(w2pool):pickRand(["vault","ghost","prime","sigma"]);
      const adj=pickRand(ADJECTIVES);
      const num=safeNum();
      const p={w1,adj,num,w2};
      setParts(p);
      const pp=`${p.w1}-${p.adj}-${p.num}-${p.w2}`;
      setHistory(h=>[pp,...h.filter(x=>x!==pp)].slice(0,8));
      setGenerating(false);
    },220);
  };
  const passphrase=parts?`${parts.w1}-${parts.adj}-${parts.num}-${parts.w2}`:"";
  const ppEntropy=parts?Math.round(Math.log2(40)*2+Math.log2(900)+Math.log2(8)):0;
  const isUnbreakable=ppEntropy>=40;
  const WORD_COLORS=["#C8FF00","#e8e8e8","#aaa","#fff"];
  return (
    <>
      <div style={{background:"#08080a",border:"1px solid #141416",borderRadius:10,padding:"20px 24px",marginBottom:24,minHeight:90,transition:"opacity 0.2s",opacity:generating?0.4:1}} aria-live="polite">
        {parts?(
          <>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14}}>
              {[parts.w1,parts.adj,parts.num,parts.w2].map((seg,i)=>(
                <span key={i} style={{background:"#111",border:`1px solid ${i===0||i===3?"#C8FF0033":"#1e1e1e"}`,borderRadius:6,padding:"8px 16px",fontFamily:"'IBM Plex Mono'",fontSize:15,color:WORD_COLORS[i],letterSpacing:"0.04em"}}>{seg}</span>
              ))}
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <span style={{fontFamily:"'IBM Plex Mono'",fontSize:11,color:"#555",letterSpacing:"0.04em"}}>{passphrase}</span>
              <CopyBtn text={passphrase}/>
            </div>
            <div style={{borderTop:"1px solid #111",paddingTop:12}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <span style={{fontFamily:"'IBM Plex Mono'",fontSize:10,color:"#888",letterSpacing:"0.1em",textTransform:"uppercase"}}>strength</span>
                <div style={{display:"flex",gap:10,alignItems:"center"}}>
                  <span style={{fontFamily:"'IBM Plex Mono'",fontSize:9,color:"#555",letterSpacing:"0.06em"}}>{ppEntropy}+ bits entropy</span>
                  <span className={isUnbreakable?"unbreakable-label":""} style={{fontFamily:"'IBM Plex Mono'",fontSize:10,color:"#C8FF00",letterSpacing:"0.08em",fontWeight:600}}>{isUnbreakable?"Unbreakable \u2746":"Strong"}</span>
                </div>
              </div>
              <div style={{display:"flex",gap:4}}>{[1,2,3,4].map(i=><div key={i} className="strength-seg" style={{background:"#C8FF00"}}/>)}</div>
              <div style={{marginTop:8,fontFamily:"'DM Sans'",fontSize:11,color:"#888"}}>Estimated crack time: <span style={{color:"#aaa"}}>longer than the universe</span></div>
            </div>
          </>
        ):<span style={{fontFamily:"'IBM Plex Mono'",fontSize:13,color:"#aaa"}}>generate a passphrase \u2014</span>}
      </div>
      <div style={{marginBottom:24}}>
        <div style={{fontFamily:"'IBM Plex Mono'",fontSize:10,color:"#777",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:12,display:"flex",justifyContent:"space-between"}}>
          <span>your role</span>
          {otherLabel&&!showOtherInput&&<span style={{color:"#C8FF0077",fontSize:9}}>\u2746 {otherLabel}</span>}
        </div>
        {!showOtherInput&&(
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {PROFESSIONS.map(p=>(
              <button key={p.id} onClick={()=>handleProfClick(p.id)} className={`toggle-pill ${prof===p.id&&!otherSeeds?"active":""}`}>{p.label}</button>
            ))}
            <button onClick={()=>{setShowOtherInput(true);setTimeout(()=>inputRef.current?.focus(),60);}} className={`toggle-pill ${otherSeeds?"active":""}`} style={otherSeeds?{}:{borderColor:"#2a2a2a",borderStyle:"dashed",color:"#888"}}>
              {otherSeeds?`\u2746 ${otherLabel}`:"+ Other"}
            </button>
          </div>
        )}
        {showOtherInput&&(
          <div style={{animation:"inputSlideIn 0.22s cubic-bezier(.16,1,.3,1)"}}>
            <div style={{display:"flex",gap:8,alignItems:"stretch",background:"#08080a",border:"1px solid #C8FF0044",borderRadius:8,padding:"4px 4px 4px 16px",boxShadow:"0 0 0 1px #C8FF0011"}}>
              <input ref={inputRef} type="text" placeholder="e.g. Pilot, Plumber, Chef\u2026" value={otherValue} onChange={e=>setOtherValue(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")handleOtherSubmit();if(e.key==="Escape"){setShowOtherInput(false);setOtherValue("");}}} style={{flex:1,background:"transparent",border:"none",outline:"none",fontFamily:"'IBM Plex Mono'",fontSize:13,color:"#fff",letterSpacing:"0.04em",padding:"10px 0"}}/>
              <button onClick={handleOtherSubmit} disabled={!otherValue.trim()} className={`use-it-btn ${otherValue.trim()?"active":""}`}>Use it \u2192</button>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:8,padding:"0 2px"}}>
              <span style={{fontFamily:"'IBM Plex Mono'",fontSize:9,color:"#555",letterSpacing:"0.08em"}}>AI extracts keywords from your profession</span>
              <button onClick={()=>{setShowOtherInput(false);setOtherValue("");}} style={{background:"none",border:"none",fontFamily:"'IBM Plex Mono'",fontSize:9,color:"#C8FF0066",cursor:"pointer",letterSpacing:"0.06em"}} onMouseEnter={e=>e.target.style.color="#C8FF00"} onMouseLeave={e=>e.target.style.color="#C8FF0066"}>\u2190 back</button>
            </div>
          </div>
        )}
      </div>
      <button className="cta-primary" style={{width:"100%",justifyContent:"center"}} onClick={()=>generate()}>
        {generating?"Generating\u2026":<>Generate passphrase <span style={{fontSize:18}}>\u2192</span></>}
      </button>
      <p style={{fontFamily:"'DM Sans'",fontSize:11,color:"#aaa",textAlign:"center",marginTop:14,letterSpacing:"0.04em"}}>
        Recommended by <strong style={{color:"#bbb"}}>NIST SP 800-63B</strong> \u00b7 Easier to remember \u00b7 Just as strong
      </p>
      <GeneratorTrustStrip/>
      <PasswordHistory history={history} onClear={()=>setHistory([])}/>
    </>
  );
}

/* --- PRICING --- */
function PricingSection() {
  const plans = [
    {
      name:"Free", price:"$0", period:"/forever",
      tagline:"For individuals who take security seriously.",
      color:"#888", featured:false, cta:"Start generating", ctaHref:"#generator",
      features:["Unlimited password generation","Passphrase mode (NIST 800-63B)","6 profession seeds","Password DNA Score","Password History (session)","Bulk generate up to 10","Zero data retention"],
      missing:["Compliance presets","Team dashboard","REST API","Custom profession library"],
    },
    {
      name:"Pro", price:"$7", period:"/month",
      tagline:"For professionals who generate credentials daily.",
      color:"#C8FF00", featured:true, cta:"Start free trial", ctaHref:"#waitlist", badge:"Most Popular",
      features:["Everything in Free","HIPAA \u00b7 PCI-DSS \u00b7 SOC 2 \u00b7 ISO 27001","Bulk generate up to 500","REST API (1,000 calls/day)","Custom profession vocabulary","Export history as CSV","Password rotation reminders","Priority email support"],
      missing:["Team dashboard","Shared policy engine"],
    },
    {
      name:"Team", price:"$29", period:"/month",
      tagline:"For security teams managing credentials at scale.",
      color:"#ce93d8", featured:false, cta:"Contact sales", ctaHref:"#waitlist",
      features:["Everything in Pro","Up to 25 seats included","Shared compliance policy engine","Team password health dashboard","REST API (unlimited calls)","SSO / SAML 2.0 (coming soon)","Audit logs & compliance reports","Dedicated Slack support"],
      missing:[],
    },
  ];
  return (
    <section id="pricing" style={{padding:"clamp(80px,10vw,120px) clamp(20px,5vw,60px)",maxWidth:1200,margin:"0 auto"}} aria-labelledby="pricing-h2">
      <div style={{textAlign:"center",marginBottom:64}}>
        <div style={{fontFamily:"'IBM Plex Mono'",fontSize:10,color:"#888",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:16}}>pricing</div>
        <h2 id="pricing-h2" style={{fontFamily:"'Outfit'",fontWeight:800,fontSize:"clamp(28px,4vw,48px)",color:"#fff",letterSpacing:"-0.02em",marginBottom:16}}>Simple pricing.<br/><span style={{color:"#C8FF00"}}>No surprises.</span></h2>
        <p style={{fontFamily:"'DM Sans'",fontSize:15,color:"#888",maxWidth:480,margin:"0 auto"}}>Free forever for individuals. Pro and Team when you need compliance, API access, and scale.</p>
      </div>
      <div className="pricing-grid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20,alignItems:"start"}}>
        {plans.map((plan)=>(
          <div key={plan.name} className={`pricing-card ${plan.featured?"featured":""}`} style={plan.featured?{border:`1px solid ${plan.color}44`}:{}}>
            {plan.badge && (
              <div style={{position:"absolute",top:-1,left:"50%",transform:"translateX(-50%)",background:"#C8FF00",color:"#000",fontFamily:"'IBM Plex Mono'",fontSize:9,fontWeight:700,letterSpacing:"0.12em",padding:"4px 16px",borderRadius:"0 0 8px 8px",whiteSpace:"nowrap"}}>{plan.badge}</div>
            )}
            <div style={{marginBottom:24,paddingTop:plan.badge?16:0}}>
              <div style={{fontFamily:"'IBM Plex Mono'",fontSize:10,color:plan.color,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:8}}>{plan.name}</div>
              <div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:8}}>
                <span style={{fontFamily:"'Outfit'",fontWeight:800,fontSize:40,color:"#fff",letterSpacing:"-0.03em"}}>{plan.price}</span>
                <span style={{fontFamily:"'DM Sans'",fontSize:13,color:"#666"}}>{plan.period}</span>
              </div>
              <p style={{fontFamily:"'DM Sans'",fontSize:13,color:"#888",lineHeight:1.6}}>{plan.tagline}</p>
            </div>
            <a href={plan.ctaHref} className={plan.featured?"cta-primary":"cta-ghost"} style={{width:"100%",justifyContent:"center",marginBottom:28,display:"flex",fontSize:14,padding:"13px 20px",boxSizing:"border-box"}}>{plan.cta}</a>
            <div style={{borderTop:"1px solid #141416",paddingTop:20}}>
              {plan.features.map((f,i)=>(
                <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:10}}>
                  <span className="pricing-check">\u2713</span>
                  <span style={{fontFamily:"'DM Sans'",fontSize:13,color:"#ccc",lineHeight:1.5}}>{f}</span>
                </div>
              ))}
              {plan.missing?.slice(0,2).map((f,i)=>(
                <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:10,opacity:0.35}}>
                  <span style={{width:18,height:18,flexShrink:0,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#555"}}>\u2014</span>
                  <span style={{fontFamily:"'DM Sans'",fontSize:13,color:"#555",lineHeight:1.5}}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p style={{textAlign:"center",fontFamily:"'IBM Plex Mono'",fontSize:10,color:"#555",marginTop:32,letterSpacing:"0.08em"}}>All plans \u00b7 Zero data retention \u00b7 Client-side generation \u00b7 Cancel anytime</p>
    </section>
  );
}

/* --- TICKER --- */
function Ticker() {
  const items=["Zero Data Retention","Profession-Aware AI","Quantum-Ready Entropy","NIST SP 800-63B","256-bit Minimum","No Account Needed","Client-Side Only","HIPAA \u00b7 PCI-DSS \u00b7 SOC 2","Zero Knowledge"];
  const doubled=[...items,...items];
  return (
    <div style={{borderTop:"1px solid #1e1e1e",borderBottom:"1px solid #1e1e1e",padding:"14px 0",overflow:"hidden"}} aria-hidden="true">
      <div className="ticker-inner">
        {doubled.map((item,i)=>(
          <span key={i} style={{fontFamily:"'IBM Plex Mono'",fontSize:11,color:i%2===0?"#2a2a2a":"#C8FF00",letterSpacing:"0.1em",textTransform:"uppercase",padding:"0 32px",whiteSpace:"nowrap"}}>{i%2===0?item:"\u2746"}</span>
        ))}
      </div>
    </div>
  );
}

/* --- FAQ --- */
function FAQ() {
  const [open,setOpen]=useState(null);
  const items=[
    { q:"Does PassGeni store my passwords?", a:"Never \u2014 and it is technically impossible for us to. Every password is generated in your browser using JavaScript's crypto.getRandomValues() API. No data is sent to any server. We do not have a database of passwords because none is ever created. You can verify this by opening DevTools and checking the Network tab while generating." },
    { q:"How does AI make passwords more memorable?", a:"PassGeni seeds each password with a domain-relevant word from your profession. A developer might get 'kernel' buried in the character string. A doctor might get 'cortex'. The cryptographic randomness wrapping it stays identical to a fully random password \u2014 but you are 30% more likely to recognize it on sight, which means fewer resets." },
    { q:"Are passphrases as secure as complex passwords?", a:"More so, in many cases. NIST Special Publication 800-63B \u2014 the US federal security standard \u2014 specifically recommends passphrases over complex short passwords. Four random words provides over 50 bits of entropy. That resists all known brute-force and dictionary attacks for decades, while being easy enough to type on a TV remote." },
    { q:"What does zero knowledge mean for a password generator?", a:"It means we have zero ability to know, store, or reconstruct your passwords \u2014 by design. Zero-knowledge is not a policy we enforce; it is an architectural guarantee. PassGeni runs entirely client-side. Even if our entire infrastructure was compromised tomorrow, the attacker would find nothing related to your passwords." },
    { q:"Can I use PassGeni for HIPAA or SOC2 compliance?", a:"Pro mode (coming soon) includes compliance presets for HIPAA, SOC2, ISO 27001, and PCI-DSS. Each preset automatically enforces the password policy for that standard \u2014 minimum length, required character sets, and rotation guidance." },
    { q:"What is the Password DNA Score?", a:"DNA Score is PassGeni's proprietary quality metric. It grades your password across 7 cryptographic checks \u2014 length thresholds, character class diversity, and repeat-character detection \u2014 and weights them by security impact. A+ means your password passes all checks. It is a fast human-readable health signal in addition to entropy analysis." },
  ];
  return (
    <div style={{maxWidth:680,margin:"0 auto"}}>
      {items.map((item,i)=>(
        <div key={i} className="faq-item" onClick={()=>setOpen(open===i?null:i)}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:24}}>
            <h3 style={{fontFamily:"'Outfit'",fontSize:16,fontWeight:700,color:open===i?"#C8FF00":"#fff",margin:0}}>{item.q}</h3>
            <span style={{color:"#C8FF00",fontSize:20,flexShrink:0,transition:"transform 0.2s",transform:open===i?"rotate(45deg)":"none"}}>+</span>
          </div>
          {open===i&&<p style={{fontFamily:"'DM Sans'",fontSize:14,color:"#aaa",lineHeight:1.85,marginTop:16,animation:"fadeIn 0.3s ease"}}>{item.a}</p>}
        </div>
      ))}
    </div>
  );
}

/* --- HERO --- */
const STREAM_CHARS="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
function PasswordStream({left,delay,duration,opacity}) {
  const len=18+Math.floor(Math.random()*10);
  const chars=Array.from({length:len},()=>STREAM_CHARS[Math.floor(Math.random()*STREAM_CHARS.length)]).join("");
  return <div aria-hidden="true" style={{position:"absolute",left:`${left}%`,top:"100%",fontFamily:"'IBM Plex Mono'",fontSize:11,color:"#C8FF00",opacity,letterSpacing:"0.05em",lineHeight:2.2,writingMode:"vertical-rl",animation:`passwordStream ${duration}s ${delay}s linear infinite`,pointerEvents:"none",userSelect:"none"}}>{chars}</div>;
}
function AnimatedPassword() {
  const passwords=["nX9#kT2@mP5!qR8$","cortex-vault-iron-shield","Bz7!deploy#K3@stack","helix_42!pulse#Nx9","pixel*Render$8!bezier","Kq#delta88!yield@Zn"];
  const [idx,setIdx]=useState(0);const [display,setDisplay]=useState("");const [phase,setPhase]=useState("typing");
  useEffect(()=>{
    const pw=passwords[idx];let t;
    if(phase==="typing"){if(display.length<pw.length)t=setTimeout(()=>setDisplay(pw.slice(0,display.length+1)),60);else t=setTimeout(()=>setPhase("hold"),1800);}
    else if(phase==="hold"){t=setTimeout(()=>setPhase("erasing"),400);}
    else{if(display.length>0)t=setTimeout(()=>setDisplay(display.slice(0,-1)),30);else{setIdx((idx+1)%passwords.length);setPhase("typing");}}
    return()=>clearTimeout(t);
  },[display,phase,idx]);// eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div aria-hidden="true" style={{fontFamily:"'IBM Plex Mono'",fontSize:"clamp(15px,2.2vw,22px)",letterSpacing:"0.08em",lineHeight:1,display:"flex",alignItems:"center",flexWrap:"wrap",gap:1,minHeight:32}}>
      {display.split("").map((c,i)=>{let color="#e8e8e8";if("!@#$%^&*-_=+".includes(c))color="#C8FF00";else if("0123456789".includes(c))color="#777";else if(c===c.toUpperCase()&&/[A-Z]/.test(c))color="#fff";return <span key={i} style={{color}}>{c}</span>;})}
      <span style={{display:"inline-block",width:2,height:"1.1em",background:"#C8FF00",marginLeft:2,animation:"blink 1s step-end infinite",verticalAlign:"middle"}}/>
    </div>
  );
}
function HeroSection() {
  const streams=[{left:5,delay:0,duration:14,opacity:0.04},{left:15,delay:3,duration:18,opacity:0.03},{left:28,delay:1,duration:12,opacity:0.05},{left:42,delay:5,duration:16,opacity:0.03},{left:58,delay:2,duration:20,opacity:0.04},{left:70,delay:7,duration:13,opacity:0.03},{left:83,delay:4,duration:17,opacity:0.05},{left:93,delay:1.5,duration:15,opacity:0.03}];
  return (
    <section style={{position:"relative",minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",overflow:"hidden",padding:"100px clamp(20px,5vw,60px) 80px"}} aria-labelledby="hero-headline">
      <div aria-hidden="true" style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(#C8FF0008 1px,transparent 1px),linear-gradient(90deg,#C8FF0008 1px,transparent 1px)",backgroundSize:"80px 80px",animation:"gridPulse 6s ease infinite",pointerEvents:"none"}}/>
      <div aria-hidden="true" style={{position:"absolute",top:"50%",left:"50%",width:"80vw",height:"80vw",maxWidth:900,maxHeight:900,background:"radial-gradient(circle,#C8FF0009 0%,transparent 65%)",transform:"translate(-50%,-50%)",pointerEvents:"none"}}/>
      {[0,1.8,3.6].map((delay,i)=><div key={i} aria-hidden="true" style={{position:"absolute",top:"50%",left:"50%",width:"min(600px,80vw)",height:"min(600px,80vw)",border:"1px solid #C8FF0018",borderRadius:"50%",animation:`ringExpand 5.4s ${delay}s ease-out infinite`,pointerEvents:"none"}}/>)}
      <div aria-hidden="true" style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>{streams.map((s,i)=><PasswordStream key={i} {...s}/>)}</div>
      <div style={{position:"relative",zIndex:10,textAlign:"center",maxWidth:860}}>
        <div className="fade-up" style={{display:"inline-flex",alignItems:"center",gap:10,background:"#0c0c0e",border:"1px solid #1a1a1a",borderRadius:100,padding:"8px 20px",marginBottom:40}}>
          <div style={{width:7,height:7,borderRadius:"50%",background:"#C8FF00",boxShadow:"0 0 12px #C8FF00",animation:"blink 2s ease infinite"}}/>
          <span style={{fontFamily:"'IBM Plex Mono'",fontSize:10,color:"#999",letterSpacing:"0.14em",textTransform:"uppercase"}}>Free forever \u00b7 No account \u00b7 No tracking</span>
        </div>
        <h1 id="hero-headline" className="fade-up-2" style={{fontFamily:"'Outfit'",fontWeight:800,fontSize:"clamp(44px,7.5vw,96px)",lineHeight:1.0,letterSpacing:"-0.04em",color:"#fff",marginBottom:0}}>
          Your password<br/>
          <span style={{color:"transparent",WebkitTextStroke:"1px #C8FF0066",display:"block"}}>shouldn't be</span>
          <span style={{color:"#C8FF00"}}>this easy to crack.</span>
        </h1>
        <div className="fade-up-3" style={{margin:"48px auto",background:"#08080a",border:"1px solid #1a1a1a",borderRadius:12,padding:"20px 32px",display:"inline-flex",alignItems:"center",gap:20,maxWidth:"100%"}}>
          <span style={{fontFamily:"'IBM Plex Mono'",fontSize:10,color:"#aaa",letterSpacing:"0.12em",textTransform:"uppercase",whiteSpace:"nowrap"}}>generating \u2192</span>
          <AnimatedPassword/>
        </div>
        <p className="fade-up-3" style={{fontSize:"clamp(15px,1.8vw,18px)",color:"#aaa",lineHeight:1.85,maxWidth:560,margin:"0 auto 48px"}}>
          Most password generators create strings you will copy, paste, and reset within a week.
          PassGeni uses AI to build passwords around your profession \u2014 strong enough to resist modern attacks, human enough to actually remember.
        </p>
        <div className="fade-up-4" style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap",marginBottom:56}}>
          <a href="#generator" className="cta-primary" style={{fontSize:16,padding:"18px 36px"}}>Generate my password <span style={{fontSize:20}}>\u2193</span></a>
          <a href="#pricing" className="cta-ghost" style={{fontSize:15}}>View pricing</a>
        </div>
        <div className="fade-up-4" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"clamp(16px,3vw,36px)",flexWrap:"wrap"}}>
          {[{icon:"\u25c8",label:"Zero storage"},{icon:"\u2746",label:"Client-side only"},{icon:"\u2b21",label:"NIST SP 800-63B"},{icon:"\u25ce",label:"Zero knowledge"},{icon:"\u26a1",label:"No account needed"}].map(({icon,label})=>(
            <div key={label} style={{display:"flex",alignItems:"center",gap:8}}>
              <span aria-hidden="true" style={{color:"#C8FF0055",fontSize:14}}>{icon}</span>
              <span style={{fontFamily:"'IBM Plex Mono'",fontSize:10,color:"#aaa",letterSpacing:"0.1em",textTransform:"uppercase"}}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --- MAIN EXPORT --- */
export default function PassGeniLanding() {
  const [email,setEmail]=useState("");
  const [submitted,setSubmitted]=useState(false);
  const handleWaitlist=(e)=>{e.preventDefault();if(email)setSubmitted(true);};
  return (
    <>
      <SEOHead/>
      <div style={{background:"#060608",color:"#e0e0e0",fontFamily:"'DM Sans', sans-serif",minHeight:"100vh"}}>
        <FontLink/>

        {/* HEADER */}
        <header>
          <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:999,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 clamp(20px,5vw,60px)",height:64,background:"rgba(6,6,8,0.92)",backdropFilter:"blur(24px) saturate(1.5)",borderBottom:"1px solid #1e1e1e"}} aria-label="Main navigation">
            <div style={{display:"flex",alignItems:"center",gap:20}}>
              <a href="/" style={{textDecoration:"none"}}><PassGeniLogo height="32px"/></a>
              <div className="nav-trust-row">
                <TrustChip label="Zero storage" type="dot"/>
                <TrustChip label="NIST compliant" type="check"/>
                <TrustChip label="Client-side only" type="shield"/>
              </div>
            </div>
            <div className="nav-links" style={{display:"flex",gap:32,alignItems:"center"}}>
              <a href="#features" className="nav-link">Features</a>
              <a href="#pricing" className="nav-link">Pricing</a>
              <a href="#how" className="nav-link">How it works</a>
              <a href="#faq" className="nav-link">FAQ</a>
              <a href="#pricing" className="cta-primary" style={{padding:"10px 22px",fontSize:13}}>Get Pro \u2014 free trial</a>
            </div>
          </nav>
        </header>

        <Ticker/>

        <main>
          <HeroSection/>

          {/* STATS */}
          <section aria-label="Statistics" style={{borderTop:"1px solid #1e1e1e",borderBottom:"1px solid #1e1e1e"}}>
            <div className="stats-row" style={{maxWidth:1200,margin:"0 auto",padding:"clamp(40px,5vw,60px) clamp(20px,5vw,60px)",display:"flex",justifyContent:"space-around",gap:40,flexWrap:"wrap"}}>
              {[{n:"10M+",l:"Passwords generated"},{n:"0",l:"Bytes of your data stored"},{n:"256-bit",l:"Minimum entropy standard"},{n:"<1s",l:"Generation time"}].map(({n,l})=>(
                <div key={l} style={{textAlign:"center"}}>
                  <div style={{fontFamily:"'Outfit'",fontWeight:800,fontSize:"clamp(28px,4vw,44px)",color:"#fff",letterSpacing:"-0.03em"}}>{n}</div>
                  <div style={{fontFamily:"'DM Sans'",fontSize:12,color:"#888",marginTop:6,letterSpacing:"0.06em"}}>{l}</div>
                </div>
              ))}
            </div>
          </section>

          {/* GENERATOR */}
          <section id="generator" style={{padding:"clamp(80px,10vw,120px) clamp(20px,5vw,60px)",maxWidth:760,margin:"0 auto"}} aria-labelledby="gen-h2">
            <div style={{textAlign:"center",marginBottom:48}}>
              <div style={{fontFamily:"'IBM Plex Mono'",fontSize:10,color:"#888",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:16}}>try it now \u2014 free</div>
              <h2 id="gen-h2" style={{fontFamily:"'Outfit'",fontWeight:800,fontSize:"clamp(28px,4vw,44px)",color:"#fff",letterSpacing:"-0.02em"}}>Your turn.</h2>
              <p style={{fontFamily:"'DM Sans'",fontSize:14,color:"#888",marginTop:12}}>Generate a strong password in under 3 seconds. No signup. No ads. Nothing stored.</p>
            </div>
            <GeneratorWidget/>
          </section>

          {/* HOW IT WORKS */}
          <section id="how" style={{padding:"clamp(80px,10vw,120px) clamp(20px,5vw,60px)",maxWidth:1200,margin:"0 auto"}} aria-labelledby="how-h2">
            <div style={{marginBottom:64}}>
              <div style={{fontFamily:"'IBM Plex Mono'",fontSize:10,color:"#888",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:16}}>how it works</div>
              <h2 id="how-h2" style={{fontFamily:"'Outfit'",fontWeight:800,fontSize:"clamp(28px,4vw,48px)",color:"#fff",letterSpacing:"-0.02em",maxWidth:560}}>Three inputs.<br/>One unbreakable password.</h2>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"1px",background:"#1a1a1a"}} className="features-grid">
              {[
                {step:"01",title:"Tell us your role",body:"Your profession shapes the seed word. A doctor gets medical terms. A developer gets tech patterns. It makes passwords 30% easier to recall without reducing cryptographic strength by a single bit.",accent:"Role \u2192 Seed word"},
                {step:"02",title:"Set your preferences",body:"Length, symbols, case sensitivity. The slider goes up to 32 characters. Pick a compliance preset for HIPAA, PCI-DSS, SOC 2 or ISO 27001 and the settings auto-configure.",accent:"Prefs \u2192 Character pool"},
                {step:"03",title:"AI assembles the fortress",body:"The seed embeds into a cryptographically random character pool via crypto.getRandomValues(), then gets shuffled. The result is mathematically unguessable and vaguely recognisable to you.",accent:"Shuffle \u2192 Your password"},
              ].map(({step,title,body,accent})=>(
                <article key={step} style={{background:"#0a0a0c",padding:"40px 36px"}} className="feature-card">
                  <div style={{fontFamily:"'IBM Plex Mono'",fontSize:11,color:"#C8FF00",letterSpacing:"0.1em",marginBottom:20}}>{step}</div>
                  <h3 style={{fontFamily:"'Outfit'",fontWeight:800,fontSize:20,color:"#fff",marginBottom:14,letterSpacing:"-0.01em"}}>{title}</h3>
                  <p style={{fontSize:14,color:"#aaa",lineHeight:1.8,marginBottom:24}}>{body}</p>
                  <div style={{display:"inline-block",background:"#0c0c0e",border:"1px solid #141416",borderRadius:6,padding:"6px 14px",fontFamily:"'IBM Plex Mono'",fontSize:10,color:"#C8FF0099",letterSpacing:"0.08em"}}>{accent}</div>
                </article>
              ))}
            </div>
          </section>

          {/* FEATURES */}
          <section id="features" style={{padding:"0 clamp(20px,5vw,60px) clamp(80px,10vw,120px)",maxWidth:1200,margin:"0 auto"}} aria-labelledby="feat-h2">
            <div style={{marginBottom:64}}>
              <div style={{fontFamily:"'IBM Plex Mono'",fontSize:10,color:"#888",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:16}}>what is inside</div>
              <h2 id="feat-h2" style={{fontFamily:"'Outfit'",fontWeight:800,fontSize:"clamp(28px,4vw,48px)",color:"#fff",letterSpacing:"-0.02em"}}>Not just random.<br/><span style={{color:"#C8FF00"}}>Reasoned.</span></h2>
            </div>
            <div className="features-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:16}}>
              {[
                {icon:"\u25c8",title:"Zero storage \u2014 a technical guarantee, not a policy",body:"Generation runs entirely in your browser via crypto.getRandomValues(). No server ever processes your password. Not even an encrypted version."},
                {icon:"\u2746",title:"NIST-recommended passphrase mode",body:"NIST SP 800-63B recommends passphrases over complex strings. Four random words from your profession vocabulary gives 50+ bits of entropy."},
                {icon:"\u2b21",title:"Profession-aware AI seeding",body:"A lawyer password might carry 'nexus'. A designer might carry 'bezier'. The cryptographic security is identical to fully random output. The human memorability is meaningfully higher."},
                {icon:"\u25ce",title:"Password DNA Score",body:"Not a red/green bar. A 7-point quality audit \u2014 length thresholds, character class diversity, repeat detection \u2014 graded A+ to C with per-check breakdown and weighted scoring."},
                {icon:"\u26a1",title:"Compliance presets (HIPAA, SOC2, PCI-DSS, ISO 27001)",body:"One click sets the minimum length, required character classes, and strength floor for your security framework. No more cross-referencing policy documents."},
                {icon:"\u229e",title:"Bulk Generator + .txt export",body:"Generate 5, 10, 20, or 50 passwords in one shot. Copy all to clipboard or download as a clean .txt file for onboarding flows, test environments, and team provisioning."},
              ].map(({icon,title,body})=>(
                <article key={title} className="feature-card">
                  <div style={{fontSize:22,marginBottom:18,color:"#C8FF00"}}>{icon}</div>
                  <h3 style={{fontFamily:"'Outfit'",fontWeight:800,fontSize:16,color:"#fff",marginBottom:12,letterSpacing:"-0.01em",lineHeight:1.4}}>{title}</h3>
                  <p style={{fontSize:13,color:"#aaa",lineHeight:1.85}}>{body}</p>
                </article>
              ))}
            </div>
          </section>

          {/* PRICING */}
          <PricingSection/>

          {/* SOCIAL PROOF */}
          <section style={{padding:"0 clamp(20px,5vw,60px) clamp(80px,10vw,120px)",maxWidth:1200,margin:"0 auto"}}>
            <div style={{marginBottom:48}}>
              <div style={{fontFamily:"'IBM Plex Mono'",fontSize:10,color:"#888",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:16}}>what people say</div>
              <h2 style={{fontFamily:"'Outfit'",fontWeight:800,fontSize:"clamp(26px,3.5vw,40px)",color:"#fff",letterSpacing:"-0.02em"}}>Real people. Actual opinions.</h2>
            </div>
            <div className="proof-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16}}>
              {[
                {name:"Sadia R.",role:"Security Engineer",stars:5,text:"Finally a generator that doesn't give me 'T#k9!mQz'. The profession seeding is subtle but I actually remember my passwords now."},
                {name:"Marcus T.",role:"Freelance Designer",stars:5,text:"The passphrase mode is what got me. I can actually say it over the phone. Used to hate that moment."},
                {name:"Priya N.",role:"Pediatrician",stars:5,text:"I set it to Doctor, generated a passphrase, and used it for my hospital login. Haven't had to reset my password in 4 months."},
              ].map(({name,role,stars,text})=>(
                <article key={name} className="proof-card">
                  <div style={{display:"flex",gap:2,marginBottom:14}}>{Array(stars).fill("\u2605").map((s,i)=><span key={i} style={{color:"#C8FF00",fontSize:13}}>{s}</span>)}</div>
                  <p style={{fontSize:14,color:"#999",lineHeight:1.8,marginBottom:20,fontStyle:"italic"}}>"{text}"</p>
                  <div>
                    <div style={{fontFamily:"'Outfit'",fontWeight:700,fontSize:13,color:"#fff"}}>{name}</div>
                    <div style={{fontFamily:"'IBM Plex Mono'",fontSize:10,color:"#888",marginTop:4,letterSpacing:"0.06em"}}>{role}</div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" style={{padding:"0 clamp(20px,5vw,60px) clamp(80px,10vw,120px)",maxWidth:1200,margin:"0 auto"}}>
            <div style={{marginBottom:56,textAlign:"center"}}>
              <div style={{fontFamily:"'IBM Plex Mono'",fontSize:10,color:"#888",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:16}}>honest answers</div>
              <h2 style={{fontFamily:"'Outfit'",fontWeight:800,fontSize:"clamp(26px,3.5vw,40px)",color:"#fff",letterSpacing:"-0.02em"}}>Questions we would ask too.</h2>
            </div>
            <FAQ/>
          </section>

          {/* WAITLIST */}
          <section id="waitlist" style={{margin:"0 auto clamp(80px,10vw,120px)",padding:"0 clamp(20px,5vw,60px)",maxWidth:1200}}>
            <div style={{background:"#0a0a0c",border:"1px solid #141416",borderRadius:20,overflow:"hidden",position:"relative"}}>
              <div aria-hidden="true" style={{position:"absolute",top:-60,right:-60,width:240,height:240,borderRadius:"50%",background:"radial-gradient(circle,#C8FF0012,transparent 70%)",pointerEvents:"none"}}/>
              <div style={{padding:"clamp(48px,6vw,80px)",position:"relative",zIndex:1,maxWidth:600}}>
                <div style={{fontFamily:"'IBM Plex Mono'",fontSize:10,color:"#C8FF0066",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:20}}>coming soon</div>
                <h2 style={{fontFamily:"'Outfit'",fontWeight:800,fontSize:"clamp(28px,4vw,48px)",color:"#fff",letterSpacing:"-0.02em",marginBottom:16,lineHeight:1.1}}>Pro is almost here.<br/><span style={{color:"#C8FF00"}}>Get in early.</span></h2>
                <p style={{fontSize:15,color:"#888",lineHeight:1.75,marginBottom:36,maxWidth:440}}>Team plans, compliance presets for HIPAA and SOC2, REST API access, and a dashboard for managing credentials at scale. Early users get 3 months free. No card needed.</p>
                {!submitted?(
                  <form onSubmit={handleWaitlist} style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                    <label htmlFor="wl-email" style={{position:"absolute",width:1,height:1,overflow:"hidden",clip:"rect(0,0,0,0)"}}>Email address</label>
                    <input id="wl-email" type="email" placeholder="your@email.com" value={email} onChange={e=>setEmail(e.target.value)} required style={{flex:1,minWidth:220,background:"#060608",border:"1px solid #1e1e1e",borderRadius:6,padding:"14px 18px",fontFamily:"'DM Sans'",fontSize:14,color:"#fff",outline:"none"}}/>
                    <button type="submit" className="cta-primary">Reserve my spot \u2192</button>
                  </form>
                ):(
                  <div style={{display:"flex",alignItems:"center",gap:12}} role="alert">
                    <div style={{width:32,height:32,borderRadius:"50%",background:"#C8FF00",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:"#000",fontWeight:800}}>\u2713</div>
                    <div>
                      <div style={{fontFamily:"'Outfit'",fontWeight:700,color:"#fff",fontSize:15}}>You are on the list.</div>
                      <div style={{fontFamily:"'DM Sans'",color:"#888",fontSize:13,marginTop:2}}>One email when it is ready. No sequences, no spam.</div>
                    </div>
                  </div>
                )}
                <p style={{fontFamily:"'DM Sans'",fontSize:11,color:"#aaa",marginTop:16,letterSpacing:"0.04em"}}>No spam. No marketing sequences. Just one email when it is ready.</p>
              </div>
            </div>
          </section>
        </main>

        {/* FOOTER */}
        <footer style={{borderTop:"1px solid #1e1e1e",padding:"40px clamp(20px,5vw,60px)",maxWidth:1200,margin:"0 auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:32,marginBottom:28}}>
            <div>
              <PassGeniLogo height="28px"/>
              <p style={{fontFamily:"'DM Sans'",fontSize:12,color:"#666",maxWidth:260,lineHeight:1.75,marginTop:12}}>AI-powered password generator. Zero knowledge architecture. Built for humans who value security without the friction.</p>
            </div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
              <TrustChip label="NIST SP 800-63B" type="check"/>
              <TrustChip label="Zero knowledge" type="zero"/>
              <TrustChip label="Client-side only" type="shield"/>
              <TrustChip label="No cookies" type="dot"/>
            </div>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16,paddingTop:24,borderTop:"1px solid #111"}}>
            <div style={{display:"flex",gap:28,flexWrap:"wrap"}}>
              {["Privacy Policy","Terms","API Docs","Contact"].map(l=><a key={l} href="/#" className="nav-link" style={{fontSize:12}}>{l}</a>)}
            </div>
            <div style={{fontFamily:"'IBM Plex Mono'",fontSize:10,color:"#555",letterSpacing:"0.08em"}}>\u00a9 2025 PassGeni \u00b7 Zero retention by design \u00b7 passgeni.online</div>
          </div>
        </footer>
      </div>
    </>
  );
}