import{useState,useEffect}from"react";
import{HERO}from"../../content/copy.js";
function AnimatedPassword(){
const passwords=["nX9#kT2@mP5!qR8$","cortex-vault-442-helix","Bz7!deploy#K3@stack","helix-neon-881-pulse","pixel-stark-357-render","Kq#delta88!yield@Zn"];
const[idx,setIdx]=useState(0);
const[display,setDisplay]=useState("");
const[phase,setPhase]=useState("typing");
useEffect(()=>{
const pw=passwords[idx];let t;
if(phase==="typing"){if(display.length<pw.length){t=setTimeout(()=>setDisplay(pw.slice(0,display.length+1)),55);}else{t=setTimeout(()=>setPhase("hold"),1800);}}
else if(phase==="hold"){t=setTimeout(()=>setPhase("erasing"),400);}
else{if(display.length>0){t=setTimeout(()=>setDisplay(display.slice(0,-1)),28);}else{setIdx((idx+1)%passwords.length);setPhase("typing");}}
return()=>clearTimeout(t);
},[display,phase,idx]);// eslint-disable-line
return(
<span style={{fontFamily:"var(--font-mono)",fontSize:"clamp(14px,2vw,20px)",letterSpacing:".08em",display:"flex",alignItems:"center",flexWrap:"wrap",gap:1}}>
{display.split("").map((c,i)=>{
let col="var(--t)";
if("!@#$%^&*-_=+".includes(c))col="var(--a)";
else if("0123456789".includes(c))col="var(--m)";
else if(c===c.toUpperCase()&&/[A-Z]/.test(c))col="#fff";
return<span key={i} style={{color:col}}>{c}</span>;
})}
<span style={{display:"inline-block",width:2,height:"1em",background:"var(--a)",marginLeft:3,animation:"blink 1s step-end infinite",verticalAlign:"middle"}}/>
</span>
);}
const CHARS="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
function Stream({left,delay,duration,opacity}){
const len=18+Math.floor(Math.random()*10);
const text=Array.from({length:len},()=>CHARS[Math.floor(Math.random()*CHARS.length)]).join("");
return<div aria-hidden="true" style={{position:"absolute",left:`${left}%`,top:"100%",fontFamily:"var(--font-mono)",fontSize:11,color:"var(--a)",opacity,letterSpacing:".05em",lineHeight:2.2,writingMode:"vertical-rl",animation:`passwordStream ${duration}s ${delay}s linear infinite`,pointerEvents:"none",userSelect:"none"}}>{text}</div>;
}
export default function HeroSection(){
const streams=[{left:4,delay:0,duration:14,opacity:.04},{left:14,delay:3,duration:18,opacity:.03},{left:26,delay:1,duration:12,opacity:.05},{left:40,delay:5,duration:16,opacity:.03},{left:56,delay:2,duration:20,opacity:.04},{left:68,delay:7,duration:13,opacity:.03},{left:80,delay:4,duration:17,opacity:.05},{left:92,delay:1.5,duration:15,opacity:.03}];
return(
<section style={{position:"relative",minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",overflow:"hidden",padding:"100px var(--pad) 80px"}} aria-labelledby="hero-headline">
<div aria-hidden="true" style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(200,255,0,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(200,255,0,0.04) 1px,transparent 1px)",backgroundSize:"80px 80px",animation:"gridPulse 6s ease infinite",pointerEvents:"none"}}/>
<div aria-hidden="true" style={{position:"absolute",top:"50%",left:"50%",width:"80vw",height:"80vw",maxWidth:1000,maxHeight:1000,background:"radial-gradient(circle,rgba(200,255,0,0.07) 0%,transparent 65%)",transform:"translate(-50%,-50%)",pointerEvents:"none"}}/>
{[0,1.8,3.6].map((delay,i)=>(
<div key={i} aria-hidden="true" style={{position:"absolute",top:"50%",left:"50%",width:"min(640px,82vw)",height:"min(640px,82vw)",border:"1px solid rgba(200,255,0,0.1)",borderRadius:"50%",animation:`ringExpand 5.4s ${delay}s ease-out infinite`,pointerEvents:"none"}}/>
))}
<div aria-hidden="true" style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
{streams.map((s,i)=><Stream key={i} {...s}/>)}
</div>
<div style={{position:"relative",zIndex:10,textAlign:"center",maxWidth:920}}>
<div className="fade-up" style={{display:"inline-flex",alignItems:"center",gap:10,background:"rgba(13,13,16,0.9)",border:"1px solid var(--b1)",borderRadius:100,padding:"8px 22px",marginBottom:48}}>
<div style={{width:7,height:7,borderRadius:"50%",background:"var(--a)",boxShadow:"0 0 12px var(--a)",animation:"blink 2s ease infinite",flexShrink:0}}/>
<span style={{fontFamily:"var(--font-mono)",fontSize:10,color:"#999",letterSpacing:".14em",textTransform:"uppercase"}}>{HERO.badge}</span>
</div>
<h1 id="hero-headline" className="fade-up-2" style={{fontFamily:"var(--font-heading)",fontWeight:800,fontSize:"clamp(52px,8vw,112px)",lineHeight:.95,letterSpacing:"-.05em",color:"#fff",marginBottom:0,whiteSpace:"pre-line"}}>
{HERO.headline.split("\n")[0]}{"\n"}
<span style={{color:"transparent",WebkitTextStroke:"1.5px rgba(200,255,0,0.55)"}}>{HERO.headline.split("\n")[1]}</span>{"\n"}
<span style={{color:"var(--a)"}}>{HERO.headline.split("\n")[2]}</span>
</h1>
<div className="fade-up-3 generation-box" style={{margin:"56px auto",background:"rgba(8,8,10,0.92)",padding:"22px 36px",display:"inline-flex",alignItems:"center",gap:28,maxWidth:"100%"}}>
<span style={{fontFamily:"var(--font-mono)",fontSize:10,color:"#555",letterSpacing:".14em",textTransform:"uppercase",whiteSpace:"nowrap",flexShrink:0}}>generating →</span>
<AnimatedPassword/>
</div>
<p className="fade-up-3" style={{fontSize:"clamp(15px,1.8vw,18px)",color:"var(--m)",lineHeight:1.85,maxWidth:560,margin:"0 auto 52px"}}>{HERO.subheadline}</p>
<div className="fade-up-4" style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap",marginBottom:60}}>
<a href={HERO.primaryHref} className="btn-primary" style={{fontSize:16,padding:"18px 40px"}}>{HERO.primaryCTA} ↓</a>
<a href={HERO.secondaryHref} className="btn-ghost" style={{fontSize:15}}>{HERO.secondaryCTA}</a>
</div>
<div className="fade-up-4" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"clamp(14px,3vw,36px)",flexWrap:"wrap"}}>
{HERO.trustPoints.map(({icon,label})=>(
<div key={label} style={{display:"flex",alignItems:"center",gap:8}}>
<span aria-hidden="true" style={{color:"rgba(200,255,0,0.5)",fontSize:13}}>{icon}</span>
<span style={{fontFamily:"var(--font-mono)",fontSize:10,color:"var(--m)",letterSpacing:".1em",textTransform:"uppercase"}}>{label}</span>
</div>
))}
</div>
</div>
</section>
);}
