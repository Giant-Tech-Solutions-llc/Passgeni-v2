import{useState,useEffect,useRef,useCallback}from"react";
import{createPortal}from"react-dom";
import{motion,AnimatePresence,useScroll,useTransform}from"framer-motion";
import{useSession}from"next-auth/react";
import{NAV}from"../../content/copy.js";
import PassGeniLogo from"./Logo.js";
import{btnPrimary,btnGhost}from"../../lib/motion.js";
import { IcSearch, IcLink, IcBarChart, IcShield, IcClipboard, IcBolt, IcCompass } from "../../lib/icons.js";

// ─── Menu Data ────────────────────────────────────────────────
const TOOLS_MENU={
  columns:[
    {label:"Security",items:[
      {icon:<IcSearch size={18} color="var(--accent)" />,label:"Breach Checker",desc:"See if your password appeared in any known data breach",href:"/tools/breach-checker"},
      {icon:<IcLink size={18} color="var(--accent)" />,label:"Secure Password Sharing",desc:"Send credentials via AES-256 encrypted one-time links",href:"/tools/secure-share"},
    ]},
    {label:"Analysis",items:[
      {icon:<IcBarChart size={18} color="var(--accent)" />,label:"Password Strength Checker",desc:"Entropy bits, crack time estimate, DNA grade A–F",href:"/tools/strength-checker"},
      {icon:<IcShield size={18} color="var(--accent)" />,label:"Password Audit Tool",desc:"Audit multiple passwords at once for your whole team",href:"/tools/audit",business:true},
    ]},
    {label:"Compliance",items:[
      {icon:<IcShield size={18} color="var(--accent)" />,label:"Credential Compliance Fixer",desc:"Fix non-compliant credentials — detect gaps, generate certified replacement",href:"/tools/compliance-fixer",business:true},
      {icon:<IcClipboard size={18} color="var(--accent)" />,label:"Password Policy Generator",desc:"Generate a written, HIPAA/PCI/SOC2-aligned password policy",href:"/tools/policy-generator",business:true},
    ]},
  ],
  featured:{
    label:"Try the Generator",
    desc:"Profession-aware AI password generation. Zero data storage. No account needed.",
    href:"/#generator",
    stat1:{n:"256-bit",l:"Minimum entropy"},
    stat2:{n:"0 bytes",l:"Data stored"},
    stat3:{n:"FIPS 140-3",l:"Entropy source"},
  },
  footer:{label:"New to PassGeni? Start with the generator →",href:"/#generator"},
};

const GUIDES_MENU={
  columns:[
    {label:"Compliance",items:[
      {label:"HIPAA Password Requirements",href:"/guides/hipaa-password-requirements"},
      {label:"PCI-DSS v4.0 Guide",href:"/guides/pci-dss-v4-password-requirements"},
      {label:"SOC 2 Requirements",href:"/guides/soc2-password-requirements"},
      {label:"ISO 27001 Controls",href:"/guides/iso-27001-password-controls"},
      {label:"NIST 800-63B Plain English",href:"/guides/nist-800-63b-password-guide"},
      {label:"DoD / Gov Requirements",href:"/guides/dod-password-requirements"},
    ]},
    {label:"By Profession",items:[
      {label:"Doctors & Healthcare",href:"/guides/healthcare-password-security"},
      {label:"Developers & DevOps",href:"/guides/developer-password-security"},
      {label:"Finance & Legal",href:"/guides/finance-legal-password-security"},
      {label:"Educators & HR",href:"/guides/education-hr-password-security"},
    ]},
    {label:"Reference",items:[
      {label:"What is Password Entropy",href:"/guides/what-is-password-entropy"},
      {label:"Passphrase vs Password",href:"/guides/passphrase-vs-password"},
      {label:"Compliance Certificate Explained",href:"/password-compliance-certificate"},
      {label:"Security Glossary",href:"/glossary"},
    ]},
  ],
  featured:{
    label:"Why PassGeni?",
    desc:"Built after realising most generators produce strings nobody can actually remember — and that compliance teams had no reliable free tool.",
    href:"/about",
    links:[
      {label:"Our Mission",href:"/about#mission"},
      {label:"How it's different",href:"/about#difference"},
      {label:"The team",href:"/about#team"},
    ],
  },
  footer:{label:"Browse all guides →",href:"/guides"},
};

// ─── Portal ───────────────────────────────────────────────────
function MegaMenuPortal({triggerRef,dropWidth,onMouseEnter,onMouseLeave,children}){
  const[mounted,setMounted]=useState(false);
  const[pos,setPos]=useState({top:0,left:0});
  const EDGE=16;
  useEffect(()=>{setMounted(true);},[]);
  useEffect(()=>{
    if(!mounted||!triggerRef.current)return;
    const r=triggerRef.current.getBoundingClientRect();
    const vw=window.innerWidth;
    const left=Math.max(EDGE,Math.min(r.left,vw-dropWidth-EDGE));
    setPos({top:r.bottom+10,left});
  },[mounted,triggerRef,dropWidth]);
  if(!mounted)return null;
  return createPortal(
    <div style={{position:"fixed",top:pos.top,left:pos.left,zIndex:9000,width:dropWidth,maxWidth:`calc(100vw - ${EDGE*2}px)`}}
      onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {children}
    </div>,
    document.body
  );
}

// ─── Shared shell ─────────────────────────────────────────────
const SHELL={
  background:"rgba(6,6,8,0.98)",
  border:"1px solid rgba(200,255,0,0.09)",
  borderRadius:18,
  backdropFilter:"blur(28px)",
  WebkitBackdropFilter:"blur(28px)",
  boxShadow:"0 40px 96px rgba(0,0,0,0.8),0 0 0 1px rgba(200,255,0,0.04),inset 0 1px 0 rgba(200,255,0,0.05)",
  overflow:"hidden",
  boxSizing:"border-box",
};

function ColLabel({children}){
  return(
    <div style={{fontFamily:"var(--font-body)",fontSize:10,fontWeight:700,color:"rgba(200,255,0,.45)",letterSpacing:".15em",textTransform:"uppercase",marginBottom:12,paddingBottom:10,borderBottom:"1px solid rgba(255,255,255,.05)"}}>
      {children}
    </div>
  );
}

function MenuItem({href,icon,label,desc,badge}){
  return(
    <a href={href}
      style={{display:"flex",alignItems:"flex-start",gap:13,padding:"11px 12px",borderRadius:10,textDecoration:"none",transition:"background .15s",marginBottom:2}}
      onMouseEnter={e=>e.currentTarget.style.background="rgba(200,255,0,0.05)"}
      onMouseLeave={e=>e.currentTarget.style.background="transparent"}
    >
      <div style={{width:38,height:38,borderRadius:9,background:"rgba(200,255,0,0.06)",border:"1px solid rgba(200,255,0,0.1)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
        {icon||"⚙️"}
      </div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
          <span style={{fontFamily:"var(--font-body)",fontSize:14,fontWeight:600,color:"#f0f0f0",lineHeight:1.2}}>{label}</span>
          {badge&&<span style={{background:"rgba(200,255,0,0.08)",color:"rgba(200,255,0,0.5)",fontSize:9,borderRadius:100,padding:"2px 8px",fontFamily:"var(--font-body)",fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",flexShrink:0}}>Team</span>}
        </div>
        {desc&&<div style={{fontFamily:"var(--font-body)",fontSize:12,color:"#5a5a6a",lineHeight:1.5}}>{desc}</div>}
      </div>
    </a>
  );
}

function GuideLink({href,label}){
  const arrowRef=useRef(null);
  return(
    <a href={href}
      style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,padding:"9px 12px",borderRadius:8,textDecoration:"none",transition:"background .15s,color .15s",fontFamily:"var(--font-body)",fontSize:13,fontWeight:500,color:"#9090a8",lineHeight:1.4,marginBottom:2}}
      onMouseEnter={e=>{e.currentTarget.style.background="rgba(200,255,0,0.05)";e.currentTarget.style.color="#fff";if(arrowRef.current)arrowRef.current.style.opacity="1";}}
      onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="#9090a8";if(arrowRef.current)arrowRef.current.style.opacity="0";}}
    >
      {label}
      <span ref={arrowRef} style={{color:"rgba(200,255,0,.6)",fontSize:12,opacity:0,transition:"opacity .15s",flexShrink:0}}>→</span>
    </a>
  );
}

function ToolsFeaturedPanel({f}){
  return(
    <div style={{background:"rgba(200,255,0,0.03)",borderLeft:"1px solid rgba(200,255,0,0.07)",padding:"28px 24px",display:"flex",flexDirection:"column",justifyContent:"space-between",minHeight:"100%"}}>
      <div>
        <div style={{width:44,height:44,borderRadius:10,background:"rgba(200,255,0,0.08)",border:"1px solid rgba(200,255,0,0.15)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:16}}><IcBolt size={22} color="var(--accent)" /></div>
        <div style={{fontFamily:"var(--font-body)",fontSize:10,fontWeight:700,color:"rgba(200,255,0,.5)",letterSpacing:".14em",textTransform:"uppercase",marginBottom:10}}>{f.label}</div>
        <p style={{fontFamily:"var(--font-body)",fontSize:13,color:"#666",lineHeight:1.7,marginBottom:20}}>{f.desc}</p>
        <a href={f.href}
          style={{display:"inline-flex",alignItems:"center",gap:8,background:"var(--accent)",color:"#000",fontFamily:"var(--font-body)",fontSize:12,fontWeight:700,letterSpacing:".06em",textTransform:"uppercase",padding:"10px 20px",borderRadius:8,textDecoration:"none",transition:"opacity .15s"}}
          onMouseEnter={e=>e.currentTarget.style.opacity=".88"}
          onMouseLeave={e=>e.currentTarget.style.opacity="1"}
        >Try it free →</a>
      </div>
      <div style={{marginTop:24,display:"flex",flexDirection:"column",gap:10}}>
        {[f.stat1,f.stat2,f.stat3].map((s,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:"rgba(200,255,0,.4)",flexShrink:0}}/>
            <span style={{fontFamily:"var(--font-body)",fontSize:12,fontWeight:700,color:"rgba(200,255,0,.8)"}}>{s.n}</span>
            <span style={{fontFamily:"var(--font-body)",fontSize:11,color:"#444"}}>{s.l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function GuidesFeaturedPanel({f}){
  return(
    <div style={{background:"rgba(200,255,0,0.03)",borderLeft:"1px solid rgba(200,255,0,0.07)",padding:"28px 24px",display:"flex",flexDirection:"column",gap:20}}>
      <div>
        <div style={{width:44,height:44,borderRadius:10,background:"rgba(200,255,0,0.08)",border:"1px solid rgba(200,255,0,0.15)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:16}}><IcCompass size={22} color="var(--accent)" /></div>
        <div style={{fontFamily:"var(--font-body)",fontSize:10,fontWeight:700,color:"rgba(200,255,0,.5)",letterSpacing:".14em",textTransform:"uppercase",marginBottom:10}}>{f.label}</div>
        <p style={{fontFamily:"var(--font-body)",fontSize:13,color:"#666",lineHeight:1.7,marginBottom:20}}>{f.desc}</p>
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {f.links.map(l=>(
            <a key={l.label} href={l.href}
              style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:8,textDecoration:"none",background:"rgba(255,255,255,.02)",border:"1px solid rgba(255,255,255,.04)",fontFamily:"var(--font-body)",fontSize:13,fontWeight:500,color:"#aaa",transition:"all .15s"}}
              onMouseEnter={e=>{e.currentTarget.style.background="rgba(200,255,0,.05)";e.currentTarget.style.color="#fff";e.currentTarget.style.borderColor="rgba(200,255,0,.1)";}}
              onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,.02)";e.currentTarget.style.color="#aaa";e.currentTarget.style.borderColor="rgba(255,255,255,.04)";}}
            >
              <span style={{color:"rgba(200,255,0,.4)",fontSize:12}}>◈</span>{l.label}
            </a>
          ))}
        </div>
      </div>
      <a href={f.href}
        style={{marginTop:"auto",display:"inline-flex",alignItems:"center",gap:6,fontFamily:"var(--font-body)",fontSize:13,fontWeight:600,color:"rgba(200,255,0,.7)",textDecoration:"none",transition:"color .15s"}}
        onMouseEnter={e=>e.currentTarget.style.color="#C8FF00"}
        onMouseLeave={e=>e.currentTarget.style.color="rgba(200,255,0,.7)"}
      >About PassGeni →</a>
    </div>
  );
}

function ToolsDropdown(){
  const f=TOOLS_MENU.featured;
  return(
    <div style={{...SHELL,display:"grid",gridTemplateColumns:"1fr 220px"}}>
      {/* Left: columns */}
      <div style={{padding:"28px 24px 20px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",columnGap:16,rowGap:4,marginBottom:20}}>
          {TOOLS_MENU.columns.map(col=>(
            <div key={col.label} style={{marginBottom:8}}>
              <ColLabel>{col.label}</ColLabel>
              {col.items.map(item=>(
                <MenuItem key={item.label} href={item.href} icon={item.icon} label={item.label} desc={item.desc} badge={item.business}/>
              ))}
            </div>
          ))}
        </div>
        <div style={{borderTop:"1px solid rgba(255,255,255,.05)",paddingTop:14,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
          <span style={{fontFamily:"var(--font-body)",fontSize:11,color:"#333"}}>All tools free · No account needed</span>
          <a href={TOOLS_MENU.footer.href}
            style={{fontFamily:"var(--font-body)",fontSize:12,fontWeight:600,color:"rgba(200,255,0,.7)",textDecoration:"none",transition:"color .15s"}}
            onMouseEnter={e=>e.currentTarget.style.color="#C8FF00"}
            onMouseLeave={e=>e.currentTarget.style.color="rgba(200,255,0,.7)"}
          >{TOOLS_MENU.footer.label}</a>
        </div>
      </div>
      {/* Right: featured */}
      <ToolsFeaturedPanel f={f}/>
    </div>
  );
}

function GuidesDropdown(){
  const f=GUIDES_MENU.featured;
  return(
    <div style={{...SHELL,display:"grid",gridTemplateColumns:"1fr 220px"}}>
      {/* Left: columns */}
      <div style={{padding:"28px 24px 20px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",columnGap:12,rowGap:4,marginBottom:20}}>
          {GUIDES_MENU.columns.map(col=>(
            <div key={col.label} style={{marginBottom:8}}>
              <ColLabel>{col.label}</ColLabel>
              {col.items.map(item=>(
                <GuideLink key={item.label} href={item.href} label={item.label}/>
              ))}
            </div>
          ))}
        </div>
        <div style={{borderTop:"1px solid rgba(255,255,255,.05)",paddingTop:14,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
          <span style={{fontFamily:"var(--font-body)",fontSize:11,color:"#333"}}>Free compliance guides · Updated 2026</span>
          <a href={GUIDES_MENU.footer.href}
            style={{fontFamily:"var(--font-body)",fontSize:12,fontWeight:600,color:"rgba(200,255,0,.7)",textDecoration:"none",transition:"color .15s"}}
            onMouseEnter={e=>e.currentTarget.style.color="#C8FF00"}
            onMouseLeave={e=>e.currentTarget.style.color="rgba(200,255,0,.7)"}
          >{GUIDES_MENU.footer.label}</a>
        </div>
      </div>
      {/* Right: featured */}
      <GuidesFeaturedPanel f={f}/>
    </div>
  );
}

// ─── Main Header ──────────────────────────────────────────────
export default function Header(){
  const{data:session,status}=useSession();
  const{scrollY,scrollYProgress}=useScroll();
  const headerBg=useTransform(scrollY,[0,80],["rgba(6,6,8,0)","rgba(6,6,8,0.95)"]);
  const headerBlur=useTransform(scrollY,[0,80],["blur(0px)","blur(20px)"]);
  const[scrolled,setScrolled]=useState(false);
  const[open,setOpen]=useState(false);
  const[active,setActive]=useState("");
  const[megaOpen,setMegaOpen]=useState(null);
  const[mobileExpanded,setMobileExpanded]=useState(null);
  const closeTimer=useRef(null);
  const toolsRef=useRef(null);
  const guidesRef=useRef(null);

  useEffect(()=>{
    const fn=()=>setScrolled(window.scrollY>24);
    window.addEventListener("scroll",fn,{passive:true});
    return()=>window.removeEventListener("scroll",fn);
  },[]);

  useEffect(()=>{
    const fn=()=>{if(window.innerWidth>900)setOpen(false);};
    window.addEventListener("resize",fn);
    return()=>window.removeEventListener("resize",fn);
  },[]);

  useEffect(()=>{
    document.body.style.overflow=open?"hidden":"";
    return()=>{document.body.style.overflow="";};
  },[open]);

  useEffect(()=>{
    const fn=(e)=>{if(e.key==="Escape")setMegaOpen(null);};
    document.addEventListener("keydown",fn);
    return()=>document.removeEventListener("keydown",fn);
  },[]);

  const openMega=useCallback((key)=>{
    clearTimeout(closeTimer.current);
    setMegaOpen(key);
  },[]);
  const scheduleMegaClose=useCallback(()=>{
    closeTimer.current=setTimeout(()=>setMegaOpen(null),200);
  },[]);

  const MEGA_KEYS=["tools","guides"];
  const triggerRefs={tools:toolsRef,guides:guidesRef};
  const dropWidths={tools:780,guides:820};

  // All nav links including About
  const allLinks=[
    ...NAV.links,
    {label:"About",href:"/about"},
  ];

  return(
    <>
      <motion.div style={{scaleX:scrollYProgress,transformOrigin:"0%",position:"fixed",top:0,left:0,right:0,height:2,background:"#C8FF00",boxShadow:"0 0 6px rgba(200,255,0,0.5)",zIndex:9999}}/>

      <motion.header style={{backgroundColor:headerBg,backdropFilter:headerBlur,position:"fixed",top:0,left:0,right:0,zIndex:1000}}>
        <nav className={`nav-root${scrolled?" scrolled":""}`} aria-label="Main navigation">
          <a href="/" className="nav-logo" aria-label="PassGeni home">
            <PassGeniLogo height="28px"/>
            <div className="nav-logo-dot" aria-hidden="true"/>
          </a>

          <div className="nav-links-row" role="list">
            {allLinks.map(l=>{
              const key=l.label.toLowerCase();
              const isMega=MEGA_KEYS.includes(key);
              if(!isMega){
                return(
                  <a key={l.label} href={l.href}
                    className={`nav-link${active===l.href?" active":""}`}
                    role="listitem"
                    onClick={()=>setActive(l.href)}
                  >{l.label}</a>
                );
              }
              const tRef=triggerRefs[key];
              const isOpen=megaOpen===key;
              return(
                <div key={l.label} ref={tRef} style={{position:"relative"}} role="listitem"
                  onMouseEnter={()=>openMega(key)}
                  onMouseLeave={scheduleMegaClose}
                >
                  <a href={l.href}
                    className={`nav-link${active===l.href?" active":""}`}
                    onClick={()=>setActive(l.href)}
                    style={{display:"flex",alignItems:"center",gap:4}}
                  >
                    {l.label}
                    <motion.span
                      animate={{rotate:isOpen?180:0}}
                      transition={{duration:0.2}}
                      style={{fontSize:8,opacity:.5,display:"inline-block",marginTop:1}}
                    >▼</motion.span>
                  </a>
                  <AnimatePresence>
                    {isOpen&&(
                      <MegaMenuPortal
                        triggerRef={tRef}
                        dropWidth={dropWidths[key]}
                        onMouseEnter={()=>openMega(key)}
                        onMouseLeave={scheduleMegaClose}
                      >
                        <motion.div
                          initial={{opacity:0,y:10,scale:0.97}}
                          animate={{opacity:1,y:0,scale:1}}
                          exit={{opacity:0,y:4,scale:0.97}}
                          transition={{duration:0.2,ease:[0.22,1,0.36,1]}}
                        >
                          {key==="tools"?<ToolsDropdown/>:<GuidesDropdown/>}
                        </motion.div>
                      </MegaMenuPortal>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <div className="nav-right">
            <a href="/auth/signin" className="nav-signin">Sign In</a>
            {status!=="loading"&&session&&(
              <motion.a href="/dashboard" className="btn-primary" {...btnPrimary} style={{padding:"9px 18px",fontSize:12}}>Dashboard →</motion.a>
            )}
            <button
              className={`nav-hamburger${open?" open":""}`}
              onClick={()=>setOpen(v=>!v)}
              aria-label={open?"Close menu":"Open menu"}
              aria-expanded={open}
            >
              <span/><span/><span/>
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open&&(
          <motion.nav
            key="mobile-drawer"
            className="mobile-nav-drawer open"
            aria-label="Mobile navigation"
            initial={{opacity:0,y:-16}}
            animate={{opacity:1,y:0}}
            exit={{opacity:0,y:-10}}
            transition={{duration:0.3,ease:"easeOut"}}
          >
            {allLinks.map((l,li)=>{
              const key=l.label.toLowerCase();
              const isMega=MEGA_KEYS.includes(key);
              if(!isMega){
                return(
                  <motion.a key={l.label} href={l.href} className="mobile-nav-link"
                    initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}}
                    transition={{delay:li*0.05}}
                    onClick={()=>setOpen(false)}
                  >{l.label}</motion.a>
                );
              }
              const menuData=key==="tools"?TOOLS_MENU:GUIDES_MENU;
              const isExpanded=mobileExpanded===key;
              return(
                <div key={l.label} style={{borderBottom:"1px solid rgba(255,255,255,.06)"}}>
                  <motion.button
                    initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}}
                    transition={{delay:li*0.05}}
                    style={{background:"none",border:"none",cursor:"pointer",width:"100%",textAlign:"left",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"18px 0",fontFamily:"var(--font-body)",fontSize:20,fontWeight:600,color:isExpanded?"var(--accent)":"var(--muted)"}}
                    onClick={()=>setMobileExpanded(isExpanded?null:key)}
                  >
                    {l.label}
                    <motion.span
                      animate={{rotate:isExpanded?45:0}}
                      transition={{duration:0.2}}
                      style={{fontSize:20,lineHeight:1,color:"rgba(200,255,0,.5)",display:"inline-block"}}
                    >+</motion.span>
                  </motion.button>
                  <AnimatePresence>
                    {isExpanded&&(
                      <motion.div
                        initial={{height:0,opacity:0}}
                        animate={{height:"auto",opacity:1}}
                        exit={{height:0,opacity:0}}
                        transition={{duration:0.25,ease:"easeOut"}}
                        style={{overflow:"hidden"}}
                      >
                        <div style={{paddingBottom:20,display:"flex",flexDirection:"column",gap:20}}>
                          {menuData.columns.map(col=>(
                            <div key={col.label}>
                              <div style={{fontFamily:"var(--font-body)",fontSize:9,fontWeight:700,color:"rgba(200,255,0,.45)",letterSpacing:".14em",textTransform:"uppercase",marginBottom:10,paddingBottom:8,borderBottom:"1px solid rgba(255,255,255,.04)"}}>{col.label}</div>
                              {col.items.map(item=>(
                                <a key={item.label} href={item.href}
                                  style={{display:"flex",alignItems:"center",gap:12,padding:"11px 12px",borderRadius:10,textDecoration:"none",background:"rgba(255,255,255,.02)",marginBottom:4,border:"1px solid rgba(255,255,255,.04)",transition:"background .15s"}}
                                  onClick={()=>setOpen(false)}
                                  onTouchStart={e=>e.currentTarget.style.background="rgba(200,255,0,.06)"}
                                  onTouchEnd={e=>e.currentTarget.style.background="rgba(255,255,255,.02)"}
                                >
                                  {item.icon&&(
                                    <div style={{width:32,height:32,borderRadius:7,background:"rgba(200,255,0,0.06)",border:"1px solid rgba(200,255,0,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>
                                      {item.icon}
                                    </div>
                                  )}
                                  <div style={{flex:1,minWidth:0}}>
                                    <div style={{fontFamily:"var(--font-body)",fontSize:14,fontWeight:600,color:"#e8e8e8",lineHeight:1.3}}>{item.label}</div>
                                    {item.desc&&<div style={{fontFamily:"var(--font-body)",fontSize:11,color:"#555",marginTop:2,lineHeight:1.4}}>{item.desc}</div>}
                                  </div>
                                  {item.business&&<span style={{background:"rgba(200,255,0,.07)",color:"rgba(200,255,0,.45)",fontSize:9,borderRadius:100,padding:"2px 7px",fontFamily:"var(--font-body)",fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",whiteSpace:"nowrap",flexShrink:0}}>Team</span>}
                                  <span style={{color:"rgba(200,255,0,.25)",fontSize:13,flexShrink:0}}>›</span>
                                </a>
                              ))}
                            </div>
                          ))}
                          <a href={menuData.footer.href}
                            style={{fontFamily:"var(--font-body)",fontSize:13,fontWeight:600,color:"rgba(200,255,0,.65)",textDecoration:"none",padding:"8px 2px",display:"flex",alignItems:"center",gap:6}}
                            onClick={()=>setOpen(false)}
                          >{menuData.footer.label}</a>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
            <div style={{marginTop:28,display:"flex",flexDirection:"column",gap:12}}>
              <motion.a href="/auth/signin" className="btn-ghost"
                {...btnGhost}
                style={{justifyContent:"center",fontSize:15,padding:"14px"}}
                onClick={()=>setOpen(false)}
              >Sign In</motion.a>
              {status!=="loading"&&session&&(
                <motion.a href="/dashboard" className="btn-primary"
                  {...btnPrimary}
                  style={{justifyContent:"center",fontSize:15,padding:"14px"}}
                  onClick={()=>setOpen(false)}
                >Dashboard →</motion.a>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
