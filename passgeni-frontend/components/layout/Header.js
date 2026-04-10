import{useState,useEffect,useRef}from"react";
import{motion,useScroll,useTransform}from"framer-motion";
import{useSession}from"next-auth/react";
import{NAV}from"../../content/copy.js";
import PassGeniLogo from"./Logo.js";

const TICKER_ITEMS=[
  "Zero Data Retention","Quantum-Ready Entropy","256-bit Minimum",
  "Client-Side Only","Post-Quantum Ready","Zero Knowledge",
  "NIST SP 800-63B","FIPS 140-3 Aligned","No Account Needed","DoD Compliant"
];

const TOOLS_MENU={
  columns:[
    {label:"Security",items:[
      {label:"Breach Checker",desc:"Check if your password appeared in a data breach",href:"/tools/breach-checker"},
      {label:"Secure Password Sharing",desc:"Share credentials via encrypted one-time links",href:"/tools/secure-share"},
    ]},
    {label:"Analysis",items:[
      {label:"Password Strength Checker",desc:"Entropy score, crack time, DNA grade",href:"/tools/strength-checker"},
      {label:"Password Audit Tool",desc:"Audit multiple passwords at once",href:"/tools/audit",business:true},
    ]},
    {label:"Business",items:[
      {label:"Password Policy Generator",desc:"Generate a compliant written password policy",href:"/tools/policy-generator",business:true},
    ]},
    {label:"Utility",items:[
      {label:"WiFi QR Generator",desc:"Create a scannable QR code for your WiFi",href:"/tools/wifi-qr",business:true},
    ]},
  ],
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
    {label:"Fundamentals",items:[
      {label:"What is Password Entropy",href:"/guides/what-is-password-entropy"},
      {label:"Passphrase vs Password",href:"/guides/passphrase-vs-password"},
      {label:"Zero-Knowledge Security",href:"/guides/zero-knowledge-security"},
      {label:"Post-Quantum Passwords",href:"/guides/post-quantum-passwords"},
    ]},
  ],
  footer:{label:"Browse all guides →",href:"/guides"},
};

const DROPDOWN_STYLE={
  position:"absolute",top:"calc(100% + 8px)",left:0,
  background:"rgba(8,8,10,0.98)",border:"1px solid rgba(200,255,0,0.1)",
  borderRadius:12,backdropFilter:"blur(20px)",boxShadow:"0 24px 64px rgba(0,0,0,0.6)",
  zIndex:200,padding:"24px",minWidth:520,
};

function ToolsDropdown(){
  return(
    <div style={DROPDOWN_STYLE}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:16}}>
        {TOOLS_MENU.columns.map(col=>(
          <div key={col.label}>
            <div style={{fontFamily:"var(--font-body)",fontSize:9,fontWeight:700,color:"rgba(200,255,0,.45)",letterSpacing:".12em",textTransform:"uppercase",marginBottom:10}}>{col.label}</div>
            {col.items.map(item=>(
              <a key={item.label} href={item.href} style={{display:"block",textDecoration:"none",padding:"7px 8px",borderRadius:8,marginBottom:2,transition:"background .15s"}}
                onMouseEnter={e=>e.currentTarget.style.background="rgba(200,255,0,0.05)"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}
              >
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                  <span style={{fontFamily:"var(--font-body)",fontSize:13,fontWeight:700,color:"#fff"}}>{item.label}</span>
                  {item.business&&<span style={{background:"rgba(255,255,255,0.06)",color:"#666",fontSize:9,borderRadius:100,padding:"2px 7px",fontFamily:"var(--font-body)",fontWeight:600}}>🏢</span>}
                </div>
                <div style={{fontFamily:"var(--font-body)",fontSize:11,color:"#555",lineHeight:1.4}}>{item.desc}</div>
              </a>
            ))}
          </div>
        ))}
      </div>
      <div style={{borderTop:"1px solid rgba(200,255,0,0.06)",paddingTop:12}}>
        <a href={TOOLS_MENU.footer.href} style={{fontFamily:"var(--font-body)",fontSize:12,fontWeight:600,color:"rgba(200,255,0,.6)",textDecoration:"none",letterSpacing:".03em"}}>{TOOLS_MENU.footer.label}</a>
      </div>
    </div>
  );
}

function GuidesDropdown(){
  return(
    <div style={DROPDOWN_STYLE}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:16}}>
        {GUIDES_MENU.columns.map(col=>(
          <div key={col.label}>
            <div style={{fontFamily:"var(--font-body)",fontSize:9,fontWeight:700,color:"rgba(200,255,0,.45)",letterSpacing:".12em",textTransform:"uppercase",marginBottom:10}}>{col.label}</div>
            {col.items.map(item=>(
              <a key={item.label} href={item.href} style={{display:"block",textDecoration:"none",padding:"6px 8px",borderRadius:8,marginBottom:2,fontFamily:"var(--font-body)",fontSize:13,fontWeight:500,color:"#ccc",transition:"background .15s,color .15s"}}
                onMouseEnter={e=>{e.currentTarget.style.background="rgba(200,255,0,0.05)";e.currentTarget.style.color="#fff";}}
                onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="#ccc";}}
              >{item.label}</a>
            ))}
          </div>
        ))}
      </div>
      <div style={{borderTop:"1px solid rgba(200,255,0,0.06)",paddingTop:12}}>
        <a href={GUIDES_MENU.footer.href} style={{fontFamily:"var(--font-body)",fontSize:12,fontWeight:600,color:"rgba(200,255,0,.6)",textDecoration:"none",letterSpacing:".03em"}}>{GUIDES_MENU.footer.label}</a>
      </div>
    </div>
  );
}

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

  function openMega(key){
    clearTimeout(closeTimer.current);
    setMegaOpen(key);
  }
  function scheduleMegaClose(){
    closeTimer.current=setTimeout(()=>setMegaOpen(null),200);
  }

  const doubled=[...TICKER_ITEMS,...TICKER_ITEMS];

  return(
    <>
      {/* Scroll progress bar */}
      <motion.div style={{scaleX:scrollYProgress,transformOrigin:"0%",position:"fixed",top:0,left:0,right:0,height:2,background:"#C8FF00",boxShadow:"0 0 6px rgba(200,255,0,0.5)",zIndex:9999}}/>
      <motion.header style={{backgroundColor:headerBg,backdropFilter:headerBlur}}>
        {/* Main nav */}
        <nav className={`nav-root${scrolled?" scrolled":""}`} aria-label="Main navigation">
          <a href="/" className="nav-logo" aria-label="PassGeni home">
            <PassGeniLogo height="28px"/>
            <div className="nav-logo-dot" aria-hidden="true"/>
          </a>

          <div className="nav-links-row" role="list">
            {NAV.links.map(l=>{
              const isMega=l.label==="Tools"||l.label==="Guides";
              const key=l.label.toLowerCase();
              if(!isMega){
                return(
                  <a key={l.label} href={l.href}
                    className={`nav-link${active===l.href?" active":""}`}
                    role="listitem"
                    onClick={()=>setActive(l.href)}
                  >{l.label}</a>
                );
              }
              return(
                <div key={l.label} style={{position:"relative"}} role="listitem"
                  onMouseEnter={()=>openMega(key)}
                  onMouseLeave={scheduleMegaClose}
                >
                  <a href={l.href}
                    className={`nav-link${active===l.href?" active":""}`}
                    onClick={()=>setActive(l.href)}
                    style={{display:"flex",alignItems:"center",gap:4}}
                  >
                    {l.label}
                    <span style={{fontSize:8,opacity:.5,marginTop:1}}>▼</span>
                  </a>
                  {megaOpen===key&&(
                    <div onMouseEnter={()=>openMega(key)} onMouseLeave={scheduleMegaClose}>
                      {key==="tools"?<ToolsDropdown/>:<GuidesDropdown/>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="nav-right">
            <a href="/auth/signin" className="nav-signin">Sign In</a>
            {status!=="loading"&&session&&(
              <a href="/dashboard" className="btn-primary" style={{padding:"9px 18px",fontSize:12}}>Dashboard →</a>
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

        {/* Ticker strip */}
        <div className="ticker-wrap" style={{marginTop:60}} role="marquee" aria-label="Feature highlights">
          <div className="ticker-track">
            {doubled.map((item,i)=>(
              <span key={i} className="ticker-item">{item}</span>
            ))}
          </div>
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <nav
        className={`mobile-nav-drawer${open?" open":""}`}
        aria-hidden={!open}
        aria-label="Mobile navigation"
      >
        {NAV.links.map(l=>{
          const isMega=l.label==="Tools"||l.label==="Guides";
          const key=l.label.toLowerCase();
          if(!isMega){
            return(
              <a key={l.label} href={l.href} className="mobile-nav-link"
                onClick={()=>setOpen(false)}
              >{l.label}</a>
            );
          }
          return(
            <div key={l.label}>
              <button
                className="mobile-nav-link"
                style={{background:"none",border:"none",cursor:"pointer",width:"100%",textAlign:"left",display:"flex",justifyContent:"space-between",alignItems:"center"}}
                onClick={()=>setMobileExpanded(mobileExpanded===key?null:key)}
              >
                {l.label}
                <span style={{fontSize:10,opacity:.5}}>{mobileExpanded===key?"▲":"▼"}</span>
              </button>
              {mobileExpanded===key&&(
                <div style={{paddingLeft:16,marginBottom:8}}>
                  {(key==="tools"?TOOLS_MENU.columns:GUIDES_MENU.columns).map(col=>
                    col.items.map(item=>(
                      <a key={item.label} href={item.href} className="mobile-nav-link"
                        style={{fontSize:13,paddingTop:6,paddingBottom:6,opacity:.8}}
                        onClick={()=>setOpen(false)}
                      >{item.label}</a>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
        <div style={{marginTop:28,display:"flex",flexDirection:"column",gap:12}}>
          <a href="/auth/signin" className="btn-ghost"
            style={{justifyContent:"center",fontSize:15,padding:"14px"}}
            onClick={()=>setOpen(false)}
          >Sign In</a>
          {status!=="loading"&&session&&(
            <a href="/dashboard" className="btn-primary"
              style={{justifyContent:"center",fontSize:15,padding:"14px"}}
              onClick={()=>setOpen(false)}
            >Dashboard →</a>
          )}
        </div>
      </nav>
    </>
  );
}
