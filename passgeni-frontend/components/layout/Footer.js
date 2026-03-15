import{FOOTER}from"../../content/copy.js";
import PassGeniLogo from"./Logo.js";
const COLS=[
{h:"Product",links:[{l:"Generator",href:"#generator"},{l:"Tools",href:"/tools"},{l:"Guides",href:"/guides"},{l:"Blog",href:"/blog"},{l:"Changelog",href:"/changelog"}]},
{h:"Compliance",links:[{l:"HIPAA",href:"/guides/hipaa-password-policy"},{l:"PCI-DSS",href:"/guides/pci-dss-password-rules"},{l:"SOC 2",href:"/guides/soc2-password-standards"},{l:"Post-Quantum",href:"/guides/post-quantum-passwords"},{l:"NIST SP 800-63B",href:"/guides/nist-password-guidelines"}]},
{h:"Company",links:[{l:"Pricing",href:"#pricing"},{l:"API",href:"/api"},{l:"Privacy",href:"/privacy"},{l:"Terms",href:"/terms"},{l:"Contact",href:"mailto:hello@passgeni.ai"}]},
];
export default function Footer(){
return(<footer style={{position:"relative",overflow:"hidden",borderTop:"1px solid var(--border)"}}>
<div aria-hidden style={{position:"absolute",bottom:-20,left:"50%",transform:"translateX(-50%)",fontFamily:"var(--font-heading)",fontWeight:800,fontSize:"clamp(80px,14vw,200px)",color:"rgba(255,255,255,.018)",letterSpacing:"-.04em",whiteSpace:"nowrap",pointerEvents:"none",userSelect:"none",lineHeight:1}}>PassGeni</div>
<div style={{maxWidth:1200,margin:"0 auto",padding:"64px var(--pad) 40px",position:"relative",zIndex:1}}>
<div style={{display:"grid",gridTemplateColumns:"1.4fr repeat(3,1fr)",gap:"40px 48px",marginBottom:52,flexWrap:"wrap"}}>
<div>
<PassGeniLogo height="28px"/>
<p style={{fontFamily:"var(--font-body)",fontSize:13,color:"var(--muted)",maxWidth:240,lineHeight:1.75,marginTop:16}}>{FOOTER?.description||"AI-powered password generation. Zero storage. Client-side only."}</p>
<div style={{display:"flex",gap:8,marginTop:20,flexWrap:"wrap"}}>
{["NIST","FIPS","SOC 2","HIPAA","PCI-DSS"].map(b=>(<span key={b} style={{fontFamily:"var(--font-mono)",fontSize:9,fontWeight:600,letterSpacing:".1em",color:"var(--muted)",border:"1px solid var(--border)",borderRadius:4,padding:"3px 8px"}}>{b}</span>))}
</div>
</div>
{COLS.map(col=>(<div key={col.h}>
<div style={{fontFamily:"var(--font-mono)",fontSize:10,fontWeight:600,letterSpacing:".14em",textTransform:"uppercase",color:"var(--text)",marginBottom:20}}>{col.h}</div>
<div style={{display:"flex",flexDirection:"column",gap:12}}>
{col.links.map(link=>(<a key={link.l} href={link.href} style={{fontFamily:"var(--font-body)",fontSize:13,color:"var(--muted)",transition:"color .15s"}} onMouseEnter={e=>e.currentTarget.style.color="var(--text)"} onMouseLeave={e=>e.currentTarget.style.color="var(--muted)"}>{link.l}</a>))}
</div></div>))}
</div>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:24,borderTop:"1px solid var(--border)",flexWrap:"wrap",gap:16}}>
<div style={{fontFamily:"var(--font-mono)",fontSize:10,color:"var(--muted-2)",letterSpacing:".08em"}}>{FOOTER?.copyright||"© "+new Date().getFullYear()+" PassGeni. All rights reserved."}</div>
<div style={{display:"flex",gap:12,alignItems:"center"}}>
<span style={{fontFamily:"var(--font-mono)",fontSize:10,color:"var(--muted-2)"}}>Made with ♥ for security</span>
{[{l:"X",href:"https://x.com/passgeni_ai"},{l:"GH",href:"https://github.com/passgeni"}].map(s=>(<a key={s.l} href={s.href} style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--muted-2)",width:30,height:30,display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid var(--border)",borderRadius:6,transition:"color .15s,border-color .15s"}} onMouseEnter={e=>{e.currentTarget.style.color="var(--accent)";e.currentTarget.style.borderColor="rgba(200,255,0,.3)"}} onMouseLeave={e=>{e.currentTarget.style.color="var(--muted-2)";e.currentTarget.style.borderColor="var(--border)"}}>{s.l}</a>))}
</div>
</div></div></footer>);}
