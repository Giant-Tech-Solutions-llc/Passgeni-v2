import{useState,useEffect}from"react";
import{motion}from"framer-motion";
import{HERO}from"../../content/copy.js";
import{btnPrimary,heroEntrance}from"../../lib/motion.js";

const PASSWORDS=["nX9#kT2@mP5!qR8$","cortex-vault-442-helix","Bz7!deploy#K3@stack","helix-neon-881-pulse","pixel-stark-357-render","Kq#delta88!yield@Zn"];
const PASSPHRASES=["correct-horse-battery-staple","neural-quantum-drift-pulse","cobalt-ridge-echo-seven"];
const ALL=[...PASSWORDS,...PASSPHRASES];

function TypeWriter(){
  const[idx,setIdx]=useState(0);
  const[txt,setTxt]=useState("");
  const[ph,setPh]=useState("in");
  useEffect(()=>{
    const pw=ALL[idx];let t;
    if(ph==="in"){if(txt.length<pw.length)t=setTimeout(()=>setTxt(pw.slice(0,txt.length+1)),60);else t=setTimeout(()=>setPh("hold"),2000);}
    else if(ph==="hold"){t=setTimeout(()=>setPh("out"),500);}
    else{if(txt.length>0)t=setTimeout(()=>setTxt(txt.slice(0,-1)),30);else{setIdx((idx+1)%ALL.length);setPh("in");}}
    return()=>clearTimeout(t);
  },[txt,ph,idx]);// eslint-disable-line
  return(
    <span style={{fontFamily:"var(--font-mono)",fontWeight:400,fontSize:"clamp(12px,2vw,16px)",letterSpacing:".04em",lineHeight:1,display:"flex",alignItems:"center",flexWrap:"wrap",gap:1}}>
      <span style={{color:"var(--text)"}}>{txt}</span>
      <span style={{display:"inline-block",width:2,height:"1.1em",background:"var(--text)",marginLeft:3,opacity:0.6,verticalAlign:"middle"}}/>
    </span>
  );
}

export default function HeroSection(){
  return(
    <section className="hero-section" aria-labelledby="hero-headline"
      style={{textAlign:"left",alignItems:"flex-start",padding:"clamp(80px,10vw,120px) var(--pad) clamp(60px,6vw,80px)"}}>

      {/* Static noise texture — no animation */}
      <div aria-hidden style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(200,255,0,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(200,255,0,0.025) 1px,transparent 1px)",backgroundSize:"80px 80px",pointerEvents:"none",opacity:0.6}}/>
      <div aria-hidden style={{position:"absolute",top:"50%",left:"60%",width:"min(60vw,700px)",height:"min(60vw,700px)",background:"radial-gradient(circle,rgba(200,255,0,0.05) 0%,transparent 65%)",transform:"translate(-30%,-50%)",pointerEvents:"none"}}/>

      <div style={{position:"relative",zIndex:10,width:"100%",maxWidth:760}}>
        {/* Badge — delay 0s */}
        <motion.div {...heroEntrance(0)} style={{display:"inline-flex",alignItems:"center",gap:10,background:"rgba(13,13,16,0.9)",border:"1px solid rgba(200,255,0,0.15)",borderRadius:100,padding:"7px clamp(14px,2.5vw,20px)",marginBottom:"clamp(24px,4vw,40px)"}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:"var(--accent)",flexShrink:0}}/>
          <span style={{fontFamily:"var(--font-mono)",fontSize:"clamp(9px,1.2vw,10px)",fontWeight:400,color:"rgba(200,255,0,.8)",letterSpacing:".14em",textTransform:"uppercase"}}>{HERO.badge}</span>
        </motion.div>

        {/* Headline — delay 0.1s */}
        <motion.h1 id="hero-headline" className="hero-headline"
          {...heroEntrance(0.1)}
          style={{marginBottom:"clamp(16px,2.5vw,24px)",textAlign:"left",maxWidth:720}}
        >
          {HERO.headline.split("\n")[0]}{"\n"}
          <span style={{color:"var(--accent)"}}>{HERO.headline.split("\n")[1]}</span>{"\n"}
          <span style={{color:"var(--text)"}}>{HERO.headline.split("\n")[2]}</span>
        </motion.h1>

        {/* Subheadline — delay 0.2s */}
        <motion.p className="hero-sub"
          {...heroEntrance(0.2)}
          style={{marginBottom:"clamp(28px,4vw,48px)",textAlign:"left",margin:"0 0 clamp(28px,4vw,48px) 0"}}
        >
          {HERO.subheadline}
        </motion.p>

        {/* CTA — delay 0.3s */}
        <motion.div
          {...heroEntrance(0.3)}
          style={{marginBottom:"clamp(32px,5vw,56px)",display:"flex",gap:12,flexWrap:"wrap",alignItems:"center"}}
        >
          <motion.a href={HERO.primaryHref} className="btn-primary"
            {...btnPrimary}
            style={{fontSize:"clamp(12px,1.4vw,14px)",padding:"clamp(14px,1.6vw,18px) clamp(32px,4vw,56px)"}}
          >{HERO.primaryCTA}</motion.a>
        </motion.div>

        {/* Gen capsule — delay 0.4s */}
        <motion.div {...heroEntrance(0.4)} style={{display:"flex",alignItems:"center",gap:14,marginBottom:"clamp(24px,3vw,40px)"}}>
          <div className="gen-capsule" style={{maxWidth:480}}>
            <span style={{fontFamily:"var(--font-mono)",fontSize:"clamp(8px,1vw,9px)",fontWeight:400,color:"rgba(200,255,0,.5)",letterSpacing:".18em",textTransform:"uppercase",whiteSpace:"nowrap",flexShrink:0}}>GEN →</span>
            <TypeWriter/>
          </div>
        </motion.div>

        {/* Trust points — delay 0.45s */}
        <motion.div className="hero-trust" {...heroEntrance(0.45)} style={{justifyContent:"flex-start"}}>
          {HERO.trustPoints.map(({icon,label})=>(
            <div key={label} style={{display:"flex",alignItems:"center",gap:7}}>
              <span aria-hidden style={{color:"rgba(200,255,0,.5)",fontSize:"clamp(10px,1.3vw,12px)"}}>{icon}</span>
              <span style={{fontFamily:"var(--font-body)",fontSize:"clamp(9px,1.1vw,11px)",fontWeight:600,color:"var(--muted)",letterSpacing:".08em",textTransform:"uppercase"}}>{label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
