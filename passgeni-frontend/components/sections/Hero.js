import{useState,useEffect,useRef}from"react";
import{HERO}from"../../content/copy.js";
const CHARS="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
const PASSWORDS=["nX9#kT2@mP5!qR8$","cortex-vault-442-helix","Bz7!deploy#K3@stack","helix-neon-881-pulse","pixel-stark-357-render","Kq#delta88!yield@Zn","doctor-ridge-991-seal","marble-flux-227-crest"];
const PASSPHRASES=["correct-horse-battery-staple","neural-quantum-drift-pulse","cobalt-ridge-echo-seven","mirror-flare-north-dawn"];
function TypeWriter(){
const all=[...PASSWORDS,...PASSPHRASES];
const[idx,setIdx]=useState(0);const[txt,setTxt]=useState("");const[ph,setPh]=useState("in");
useEffect(()=>{
const pw=all[idx];let t;
if(ph==="in"){if(txt.length<pw.length)t=setTimeout(()=>setTxt(pw.slice(0,txt.length+1)),60);else t=setTimeout(()=>setPh("hold"),2000);}
else if(ph==="hold")t=setTimeout(()=>setPh("out"),500);
else{if(txt.length>0)t=setTimeout(()=>setTxt(txt.slice(0,-1)),30);else{setIdx((idx+1)%all.length);setPh("in");}}
return()=>clearTimeout(t);
},[txt,ph,idx]);// eslint-disable-line
const isPass=PASSPHRASES.includes(all[idx]);
return(<span style={{fontFamily:"var(--font-mono)",fontSize:"clamp(14px,1.8vw,18px)",letterSpacing:isPass?".03em":".06em",lineHeight:1,display:"flex",alignItems:"center",flexWrap:"wrap",gap:1}}>
{txt.split("").map((c,i)=>{let col="var(--text)";if("!@#$%^&*-_=+".includes(c))col="var(--accent)";else if("0123456789".includes(c))col="rgba(200,255,0,.6)";else if(c==="-")col="rgba(200,255,0,.5)";return<span key={i}style={{color:col}}>{c}</span>})}
<span style={{display:"inline-block",width:2,height:"1.1em",background:"var(--accent)",marginLeft:3,animation:"blink 1s step-end infinite",verticalAlign:"middle"}}/>
</span>);}
function Stream({left,delay,dur,op}){
const txt=Array.from({length:22},()=>CHARS[Math.floor(Math.random()*CHARS.length)]).join("");
return(<div aria-hidden style={{position:"absolute",left:left+"%",top:"100%",fontFamily:"var(--font-mono)",fontSize:11,color:"var(--accent)",opacity:op,letterSpacing:".05em",lineHeight:2.2,writingMode:"vertical-rl",animation:"passwordStream "+dur+"s "+delay+"s linear infinite",pointerEvents:"none",userSelect:"none"}}>{txt}</div>);}
export default function HeroSection(){
const streams=[{left:4,delay:0,dur:14,op:.04},{left:14,delay:3,dur:18,op:.03},{left:26,delay:1,dur:12,op:.05},{left:40,delay:5,dur:16,op:.03},{left:56,delay:2,dur:20,op:.04},{left:68,delay:7,dur:13,op:.03},{left:80,delay:4,dur:17,op:.05},{left:92,delay:1.5,dur:15,op:.03}];
return(<section style={{position:"relative",minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",overflow:"hidden",padding:"120px var(--pad) 80px"}}>
<div aria-hidden style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(200,255,0,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(200,255,0,0.035) 1px,transparent 1px)",backgroundSize:"80px 80px",animation:"gridPulse 6s ease infinite",pointerEvents:"none"}}/>
<div aria-hidden style={{position:"absolute",top:"50%",left:"50%",width:"80vw",height:"80vw",maxWidth:900,maxHeight:900,background:"radial-gradient(circle,rgba(200,255,0,0.065) 0%,transparent 65%)",transform:"translate(-50%,-50%)",pointerEvents:"none"}}/>
{[0,1.8,3.6].map((d,i)=>(<div key={i}aria-hidden style={{position:"absolute",top:"50%",left:"50%",width:"min(600px,80vw)",height:"min(600px,80vw)",border:"1px solid rgba(200,255,0,0.09)",borderRadius:"50%",animation:"ringExpand 5.4s "+d+"s ease-out infinite",pointerEvents:"none"}}/>))}
<div aria-hidden style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>{streams.map((s,i)=><Stream key={i}{...s}/>)}</div>
<div style={{position:"relative",zIndex:10,textAlign:"center",maxWidth:920}}>
<div className="fade-up"style={{display:"inline-flex",alignItems:"center",gap:10,background:"rgba(13,13,16,0.9)",border:"1px solid rgba(200,255,0,0.15)",borderRadius:100,padding:"9px 22px",marginBottom:48}}>
<div style={{width:7,height:7,borderRadius:"50%",background:"var(--accent)",boxShadow:"0 0 12px var(--accent)",animation:"blink 2s ease infinite",flexShrink:0}}/>
<span style={{fontFamily:"var(--font-mono)",fontSize:11,color:"rgba(200,255,0,.8)",letterSpacing:".14em",textTransform:"uppercase"}}>{HERO.badge}</span>
</div>
<h1 className="fade-up-2"style={{fontFamily:"var(--font-heading)",fontWeight:800,fontSize:"clamp(52px,8vw,112px)",lineHeight:.96,letterSpacing:"-.04em",color:"#fff",marginBottom:0,whiteSpace:"pre-line"}}>
{HERO.headline.split("\n")[0]}{"\n"}
<span style={{color:"transparent",WebkitTextStroke:"1.5px rgba(200,255,0,0.4)",backgroundImage:"linear-gradient(90deg,rgba(200,255,0,.4),rgba(200,255,0,.9),rgba(200,255,0,.4))",backgroundSize:"200% auto",WebkitBackgroundClip:"text",animation:"gradientSweep 3s linear infinite"}}>{HERO.headline.split("\n")[1]}</span>{"\n"}
<span style={{color:"var(--accent)"}}>{HERO.headline.split("\n")[2]}</span>
</h1>
<div className="fade-up-3"style={{display:"flex",justifyContent:"center",margin:"52px auto"}}>
<div className="gen-capsule">
<span style={{fontFamily:"var(--font-mono)",fontSize:9,color:"rgba(200,255,0,.5)",letterSpacing:".18em",textTransform:"uppercase",whiteSpace:"nowrap",flexShrink:0}}>GENERATING →</span>
<TypeWriter/>
</div>
</div>
<p className="fade-up-3"style={{fontSize:"clamp(15px,1.8vw,17px)",color:"var(--muted)",lineHeight:1.85,maxWidth:540,margin:"0 auto 52px"}}>{HERO.subheadline}</p>
<div className="fade-up-4"style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap",marginBottom:56}}>
<a href={HERO.primaryHref}className="btn-primary"style={{fontSize:15,padding:"17px 40px"}}onClick={e=>{e.currentTarget.classList.remove("btn-pulse");void e.currentTarget.offsetWidth;e.currentTarget.classList.add("btn-pulse")}}>{HERO.primaryCTA} ↓</a>
<a href={HERO.secondaryHref}className="btn-ghost"style={{fontSize:15}}>{HERO.secondaryCTA}</a>
</div>
<div className="fade-up-4"style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"clamp(14px,3vw,32px)",flexWrap:"wrap"}}>
{HERO.trustPoints.map(({icon,label})=>(<div key={label}style={{display:"flex",alignItems:"center",gap:8}}><span aria-hidden style={{color:"rgba(200,255,0,.5)",fontSize:13}}>{icon}</span><span style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--muted)",letterSpacing:".08em",textTransform:"uppercase"}}>{label}</span></div>))}
</div>
</div></section>);}
