import{GENERATOR,STATS}from"../../content/copy.js";
import GeneratorWidget from"../generator/GeneratorWidget.js";
export default function GeneratorSection(){
return(<section id="generator" style={{padding:"var(--section) var(--pad)",maxWidth:1200,margin:"0 auto"}}>
<div style={{textAlign:"center",marginBottom:56}}>
<div style={{fontFamily:"var(--font-mono)",fontSize:10,fontWeight:600,letterSpacing:".18em",textTransform:"uppercase",color:"var(--accent)",marginBottom:14,display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
<span style={{display:"block",width:20,height:1,background:"var(--accent)",opacity:.6}}/>
{GENERATOR.eyebrow}
<span style={{display:"block",width:20,height:1,background:"var(--accent)",opacity:.6}}/>
</div>
<h2 style={{fontFamily:"var(--font-heading)",fontWeight:800,fontSize:"clamp(28px,4vw,52px)",color:"var(--text)",letterSpacing:"-.03em",lineHeight:1.05,marginBottom:12}}>{GENERATOR.headline}</h2>
<p style={{fontFamily:"var(--font-body)",fontSize:14,color:"var(--muted)",maxWidth:480,margin:"0 auto",lineHeight:1.75}}>{GENERATOR.subheadline}</p>
</div>
<div className="bento" style={{alignItems:"start"}}>
<div className="b4" style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--radius-l)",overflow:"hidden",boxShadow:"0 0 0 1px var(--border),0 32px 64px rgba(0,0,0,.6)"}}>
<GeneratorWidget/>
</div>
<div className="b2" style={{display:"flex",flexDirection:"column",gap:10}}>
<div className="bc" style={{padding:24}}>
<div className="bc-line"/>
<div style={{fontFamily:"var(--font-mono)",fontSize:10,color:"var(--accent)",letterSpacing:".14em",textTransform:"uppercase",marginBottom:20}}>Security stats</div>
<div style={{display:"flex",flexDirection:"column",gap:18}}>
{STATS.map(({number,label})=>(<div key={label}>
<div style={{fontFamily:"var(--font-heading)",fontWeight:800,fontSize:"clamp(22px,3vw,36px)",color:"var(--text)",letterSpacing:"-.03em",lineHeight:1}}>{number}</div>
<div style={{fontFamily:"var(--font-mono)",fontSize:10,color:"var(--muted)",marginTop:4,letterSpacing:".08em",textTransform:"uppercase"}}>{label}</div>
</div>))}
</div></div>
<div className="bc bc-feat" style={{padding:24}}>
<div className="bc-line"/>
<div style={{fontSize:28,marginBottom:14,lineHeight:1}}>🔒</div>
<h3 style={{fontFamily:"var(--font-heading)",fontWeight:800,fontSize:16,color:"var(--text)",marginBottom:10,letterSpacing:"-.01em"}}>Zero knowledge</h3>
<p style={{fontFamily:"var(--font-body)",fontSize:13,color:"var(--muted)",lineHeight:1.75}}>Everything runs in your browser. No passwords ever leave your device. Zero server contact.</p>
<div style={{display:"flex",gap:8,marginTop:16,flexWrap:"wrap"}}>
{["Client-side","No storage","No tracking"].map(t=>(<span key={t} style={{fontFamily:"var(--font-mono)",fontSize:9,fontWeight:600,letterSpacing:".1em",color:"var(--accent)",background:"var(--accent-dim)",border:"1px solid rgba(200,255,0,.2)",borderRadius:4,padding:"3px 8px"}}>{t}</span>))}
</div></div>
</div></div></section>);}
