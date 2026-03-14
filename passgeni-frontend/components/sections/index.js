import{useState}from"react";
import{STATS,HOW_IT_WORKS,FEATURES,TOOLS_PREVIEW,PRICING,TESTIMONIALS,FAQ,WAITLIST}from"../../content/copy.js";
import{Headline}from"../ui/index.js";
const E=({children,center})=><div className="eyebrow" style={center?{justifyContent:"center"}:{}}>{children}</div>;
export function StatsBar(){return(
<section style={{borderTop:"1px solid var(--b1)",borderBottom:"1px solid var(--b1)"}}>
<div style={{maxWidth:1200,margin:"0 auto",padding:"clamp(40px,5vw,60px) var(--pad)",display:"flex",justifyContent:"space-around",gap:40,flexWrap:"wrap"}}>
{STATS.map(({number,label})=>(
<div key={label} style={{textAlign:"center"}}>
<div style={{fontFamily:"var(--font-heading)",fontWeight:800,fontSize:"clamp(28px,4vw,52px)",color:"var(--t)",letterSpacing:"-.04em",lineHeight:1}}>{number}</div>
<div style={{fontFamily:"var(--font-mono)",fontSize:10,color:"var(--m)",marginTop:8,letterSpacing:".1em",textTransform:"uppercase"}}>{label}</div>
</div>))}
</div>
</section>);}
export function HowItWorks(){return(
<section id="how" style={{padding:"var(--sec) var(--pad)",maxWidth:1200,margin:"0 auto"}} aria-labelledby="how-h2">
<div style={{textAlign:"center",marginBottom:60}}>
<E center>{HOW_IT_WORKS.eyebrow}</E>
<h2 id="how-h2" style={{fontFamily:"var(--font-heading)",fontWeight:800,fontSize:"clamp(28px,4vw,56px)",color:"var(--t)",letterSpacing:"-.03em",lineHeight:1.05,maxWidth:540,margin:"0 auto",whiteSpace:"pre-line"}}>{HOW_IT_WORKS.headline}</h2>
</div>
<div className="bento">
{HOW_IT_WORKS.steps.map((step,i)=>(
<article key={step.step} className={`bc bc-a ${i===0?"b4c br2":"b2c"}`} style={{minHeight:i===0?300:150}}>
<div className="bc-line"/>
<div style={{fontFamily:"var(--font-mono)",fontSize:10,color:"var(--a)",letterSpacing:".14em",marginBottom:20,textTransform:"uppercase"}}>{step.step}</div>
<h3 style={{fontFamily:"var(--font-heading)",fontWeight:800,fontSize:i===0?24:18,color:"var(--t)",marginBottom:12,letterSpacing:"-.02em"}}>{step.title}</h3>
<p style={{fontSize:i===0?15:13,color:"var(--m)",lineHeight:1.8,flex:1,marginBottom:20}}>{step.body}</p>
<div style={{display:"inline-block",background:"var(--s2)",border:"1px solid var(--b1)",borderRadius:6,padding:"5px 12px",fontFamily:"var(--font-mono)",fontSize:10,color:"rgba(200,255,0,0.6)",letterSpacing:".06em"}}>{step.accent}</div>
</article>))}
</div>
</section>);}
export function FeaturesSection(){
const spans=["b4c br2","b2c br2","b2c","b2c","b3c","b3c"];
return(
<section id="features" style={{padding:"0 var(--pad) var(--sec)",maxWidth:1200,margin:"0 auto"}} aria-labelledby="feat-h2">
<div style={{textAlign:"center",marginBottom:60}}>
<E center>{FEATURES.eyebrow}</E>
<h2 id="feat-h2" style={{fontFamily:"var(--font-heading)",fontWeight:800,fontSize:"clamp(28px,4vw,56px)",color:"var(--t)",letterSpacing:"-.03em"}}>
Not just random.<br/><span style={{color:"var(--a)"}}>Reasoned.</span>
</h2>
</div>
<div className="bento">
{FEATURES.items.slice(0,spans.length).map((item,i)=>(
<article key={item.title} className={`bc bc-a ${spans[i]}`}>
<div className="bc-line"/>
<div style={{fontSize:i===0?40:26,marginBottom:20,color:"var(--a)",lineHeight:1}}>{item.icon}</div>
<h3 style={{fontFamily:"var(--font-heading)",fontWeight:800,fontSize:i===0?22:16,color:"var(--t)",marginBottom:12,letterSpacing:"-.02em",lineHeight:1.3}}>{item.title}</h3>
<p style={{fontSize:i===0?14:13,color:"var(--m)",lineHeight:1.8}}>{item.body}</p>
</article>))}
</div>
</section>);}
export function ToolsPreview(){
const spans=["b3c br2","b3c","b3c","b2c","b2c","b4c"];
return(
<section style={{padding:"0 var(--pad) var(--sec)",maxWidth:1200,margin:"0 auto"}}>
<div style={{textAlign:"center",marginBottom:60}}>
<E center>{TOOLS_PREVIEW.eyebrow}</E>
<h2 style={{fontFamily:"var(--font-heading)",fontWeight:800,fontSize:"clamp(28px,4vw,56px)",color:"var(--t)",letterSpacing:"-.03em"}}>
Everything you need.<br/><span style={{color:"var(--a)"}}>Nothing you don't.</span>
</h2>
</div>
<div className="bento">
{TOOLS_PREVIEW.items.slice(0,spans.length).map((item,i)=>(
<a key={item.title} href={item.href} className={`bc bc-a ${spans[i]}`} style={{textDecoration:"none"}}>
<div className="bc-line"/>
<div style={{fontSize:i===0?44:30,marginBottom:20,lineHeight:1}}>{item.icon}</div>
<h3 style={{fontFamily:"var(--font-heading)",fontWeight:800,fontSize:i===0?20:16,color:"var(--t)",marginBottom:10,flex:1}}>{item.title}</h3>
<p style={{fontSize:13,color:"var(--m)",lineHeight:1.75,marginBottom:20}}>{item.body}</p>
<span style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--a)",letterSpacing:".06em"}}>{item.label} →</span>
</a>))}
</div>
</section>);}
export function PricingSection(){
return(
<section id="pricing" style={{padding:"var(--sec) var(--pad)",maxWidth:1200,margin:"0 auto"}} aria-labelledby="pricing-h2">
<div style={{textAlign:"center",marginBottom:68}}>
<E center>{PRICING.eyebrow}</E>
<h2 id="pricing-h2" style={{fontFamily:"var(--font-heading)",fontWeight:800,fontSize:"clamp(28px,4vw,56px)",color:"var(--t)",letterSpacing:"-.03em",marginBottom:14,whiteSpace:"pre-line"}}>{PRICING.headline}</h2>
<p style={{fontFamily:"var(--font-body)",fontSize:15,color:"var(--m)",maxWidth:440,margin:"0 auto"}}>{PRICING.subheadline}</p>
</div>
<div className="bento" style={{alignItems:"start"}}>
{PRICING.plans.map((plan,i)=>{
const cls=i===0?"b2c":i===1?"b5c bc-feat":"b5c";
return(
<div key={plan.name} className={`bc ${cls}`} style={{display:"flex",flexDirection:"column"}}>
<div className="bc-line"/>
{plan.badge&&<div style={{position:"absolute",top:-1,left:"50%",transform:"translateX(-50%)",background:"var(--a)",color:"#000",fontFamily:"var(--font-mono)",fontSize:9,fontWeight:700,letterSpacing:".12em",padding:"4px 18px",borderRadius:"0 0 10px 10px",whiteSpace:"nowrap"}}>{plan.badge}</div>}
<div style={{marginBottom:24,paddingTop:plan.badge?18:0}}>
<div style={{fontFamily:"var(--font-mono)",fontSize:10,color:plan.color||"var(--a)",letterSpacing:".14em",textTransform:"uppercase",marginBottom:12}}>{plan.name}</div>
<div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:8}}>
<span style={{fontFamily:"var(--font-heading)",fontWeight:800,fontSize:56,color:"var(--t)",letterSpacing:"-.04em",lineHeight:1}}>{plan.price}</span>
{plan.period&&<span style={{fontFamily:"var(--font-body)",fontSize:13,color:"var(--m)"}}>{plan.period}</span>}
</div>
<p style={{fontFamily:"var(--font-body)",fontSize:13,color:"var(--m)",lineHeight:1.6}}>{plan.tagline}</p>
</div>
<a href={plan.ctaHref} className={plan.featured?"btn-primary":"btn-ghost"} style={{width:"100%",justifyContent:"center",marginBottom:24,display:"flex",fontSize:13,padding:"14px 20px",boxSizing:"border-box"}}>{plan.cta}</a>
<div style={{borderTop:"1px solid var(--b1)",paddingTop:20,flex:1}}>
{plan.features.map((f,fi)=>(
<div key={fi} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:10}}>
<span style={{color:"var(--a)",fontSize:12,marginTop:2,flexShrink:0}}>✓</span>
<span style={{fontFamily:"var(--font-body)",fontSize:13,color:"var(--t)",lineHeight:1.5}}>{f}</span>
</div>))}
{plan.missing?.slice(0,2).map((f,fi)=>(
<div key={fi} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:10,opacity:.3}}>
<span style={{fontSize:11,color:"var(--m)",marginTop:2,flexShrink:0}}>—</span>
<span style={{fontFamily:"var(--font-body)",fontSize:13,color:"var(--m)",lineHeight:1.5}}>{f}</span>
</div>))}
</div>
</div>);
})}
</div>
<p style={{textAlign:"center",fontFamily:"var(--font-mono)",fontSize:10,color:"var(--m2)",marginTop:32,letterSpacing:".08em"}}>{PRICING.footer}</p>
</section>);}
export function TestimonialsSection(){
const items=TESTIMONIALS.items;
const mid=Math.ceil(items.length/2);
const rows=[items.slice(0,mid),items.slice(mid)];
return(
<section style={{padding:"0 0 var(--sec)",overflow:"hidden"}}>
<div style={{maxWidth:1200,margin:"0 auto",padding:"0 var(--pad)",marginBottom:56,textAlign:"center"}}>
<E center>{TESTIMONIALS.eyebrow}</E>
<Headline>{TESTIMONIALS.headline}</Headline>
</div>
{rows.map((row,ri)=>{
const doubled=[...row,...row];
const dur=ri===0?44:58;
return(
<div key={ri} style={{marginBottom:14,position:"relative"}}>
<div style={{position:"absolute",left:0,top:0,bottom:0,width:120,background:"linear-gradient(to right,var(--bg),transparent)",zIndex:2,pointerEvents:"none"}}/>
<div style={{position:"absolute",right:0,top:0,bottom:0,width:120,background:"linear-gradient(to left,var(--bg),transparent)",zIndex:2,pointerEvents:"none"}}/>
<div style={{display:"flex",gap:14,width:"max-content",animation:`scrollLeft ${dur}s linear infinite`,animationDirection:ri===1?"reverse":"normal"}}
onMouseEnter={e=>e.currentTarget.style.animationPlayState="paused"}
onMouseLeave={e=>e.currentTarget.style.animationPlayState="running"}>
{doubled.map((t,i)=>(
<article key={i} className="bc" style={{width:310,flexShrink:0,padding:"24px 26px"}}
onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(200,255,0,0.22)"}
onMouseLeave={e=>e.currentTarget.style.borderColor="var(--b1)"}>
<div style={{display:"flex",gap:3,marginBottom:14}}>
{Array(t.stars||5).fill("★").map((s,si)=><span key={si} style={{color:"var(--a)",fontSize:12}}>{s}</span>)}
</div>
<p style={{fontFamily:"var(--font-body)",fontSize:13,color:"#aaa",lineHeight:1.8,marginBottom:18,flex:1}}>"{t.text}"</p>
<div>
<div style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:13,color:"var(--t)"}}>{t.name}</div>
<div style={{fontFamily:"var(--font-mono)",fontSize:10,color:"var(--m2)",marginTop:3,letterSpacing:".05em"}}>{t.role}</div>
</div>
</article>))}
</div>
</div>);
})}
</section>);}
export function FAQSection(){
const[open,setOpen]=useState(null);
return(
<section id="faq" style={{padding:"0 var(--pad) var(--sec)",maxWidth:1200,margin:"0 auto"}}>
<div style={{textAlign:"center",marginBottom:60}}>
<E center>{FAQ.eyebrow}</E>
<Headline>{FAQ.headline}</Headline>
</div>
<div style={{maxWidth:720,margin:"0 auto"}}>
{FAQ.items.map((item,i)=>(
<div key={i} className="faq-item" onClick={()=>setOpen(open===i?null:i)}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:24}}>
<div style={{display:"flex",gap:20,alignItems:"center"}}>
<span style={{fontFamily:"var(--font-mono)",fontSize:10,color:"rgba(200,255,0,0.45)",letterSpacing:".12em",flexShrink:0,width:28}}>{String(i+1).padStart(2,"0")}</span>
<h3 style={{fontFamily:"var(--font-heading)",fontSize:17,fontWeight:700,color:open===i?"var(--a)":"var(--t)",margin:0,lineHeight:1.4}}>{item.question}</h3>
</div>
<span style={{color:"var(--a)",fontSize:22,flexShrink:0,transition:"transform .2s",transform:open===i?"rotate(45deg)":"none",display:"block"}}>+</span>
</div>
{open===i&&<p style={{fontFamily:"var(--font-body)",fontSize:14,color:"var(--m)",lineHeight:1.9,marginTop:16,paddingLeft:48,animation:"fadeIn .25s ease"}}>{item.answer}</p>}
</div>))}
</div>
</section>);}
export function FeaturedBlogSection(){
const posts=[
{slug:"pci-dss-v4-password-changes-explained",title:"PCI-DSS v4.0 Raised the Password Bar. Here's What You Missed.",excerpt:"The March 2024 deadline passed. If you haven't updated your authentication controls for PCI-DSS v4.0, here is what changed and what auditors will check.",category:"Compliance",color:"#ffb74d",readTime:6,date:"Jan 10, 2025"},
{slug:"why-password-complexity-rules-backfire",title:"Why Password Complexity Rules Make You Less Secure",excerpt:"Requiring uppercase, a number, and a symbol teaches users to choose P@ssw0rd. The research on why complexity rules backfire.",category:"Research",color:"#ce93d8",readTime:5,date:"Jan 14, 2025"},
{slug:"announcing-passgeni-v2",title:"PassGeni V2: DNA Score, Compliance Presets, and 6 New Tools",excerpt:"Everything that shipped in V2 — the DNA Score, six new free tools, HIPAA and PCI-DSS presets, passphrase mode.",category:"Product",color:"#81c784",readTime:4,date:"Jan 20, 2025"},
];
return(
<section style={{padding:"0 var(--pad) var(--sec)",maxWidth:1200,margin:"0 auto"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:52,flexWrap:"wrap",gap:16}}>
<div><div className="eyebrow">From the blog</div><h2 style={{fontFamily:"var(--font-heading)",fontWeight:800,fontSize:"clamp(24px,3.5vw,48px)",color:"var(--t)",letterSpacing:"-.03em"}}>Latest posts.</h2></div>
<a href="/blog" style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--a)",letterSpacing:".08em",opacity:.8}}>View all posts →</a>
</div>
<div className="bento" style={{alignItems:"start"}}>
<a href={`/blog/${posts[0].slug}`} className="bc bc-a b4c br2" style={{textDecoration:"none"}}>
<div className="bc-line"/>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
<span style={{fontFamily:"var(--font-mono)",fontSize:9,color:posts[0].color,letterSpacing:".12em",textTransform:"uppercase",background:posts[0].color+"18",padding:"4px 12px",borderRadius:100}}>{posts[0].category}</span>
<span style={{fontFamily:"var(--font-mono)",fontSize:9,color:"var(--m2)"}}>{posts[0].readTime} min · {posts[0].date}</span>
</div>
<h3 style={{fontFamily:"var(--font-heading)",fontWeight:800,fontSize:"clamp(18px,2vw,26px)",color:"var(--t)",lineHeight:1.3,marginBottom:18,letterSpacing:"-.02em"}}>{posts[0].title}</h3>
<p style={{fontSize:14,color:"var(--m)",lineHeight:1.8,flex:1}}>{posts[0].excerpt}</p>
<span style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--a)",letterSpacing:".06em",marginTop:28}}>Read more →</span>
</a>
{posts.slice(1).map(p=>(
<a key={p.slug} href={`/blog/${p.slug}`} className="bc bc-a b4c" style={{textDecoration:"none"}}>
<div className="bc-line"/>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
<span style={{fontFamily:"var(--font-mono)",fontSize:9,color:p.color,letterSpacing:".12em",textTransform:"uppercase",background:p.color+"18",padding:"4px 12px",borderRadius:100}}>{p.category}</span>
<span style={{fontFamily:"var(--font-mono)",fontSize:9,color:"var(--m2)"}}>{p.readTime} min</span>
</div>
<h3 style={{fontFamily:"var(--font-heading)",fontWeight:800,fontSize:18,color:"var(--t)",lineHeight:1.35,marginBottom:12,flex:1}}>{p.title}</h3>
<span style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--a)",letterSpacing:".06em",marginTop:18}}>Read more →</span>
</a>))}
</div>
</section>);}
export function WaitlistSection(){return(
<section id="waitlist" style={{margin:"0 auto clamp(80px,10vw,120px)",padding:"0 var(--pad)",maxWidth:1200}}>
<div className="bc bc-feat" style={{overflow:"hidden",position:"relative",padding:"clamp(52px,7vw,88px)"}}>
<div aria-hidden="true" style={{position:"absolute",top:-80,right:-80,width:320,height:320,borderRadius:"50%",background:"radial-gradient(circle,rgba(200,255,0,.12),transparent 70%)",pointerEvents:"none"}}/>
<div aria-hidden="true" style={{position:"absolute",bottom:-60,left:-60,width:240,height:240,borderRadius:"50%",background:"radial-gradient(circle,rgba(200,255,0,.07),transparent 70%)",pointerEvents:"none"}}/>
<div style={{position:"relative",zIndex:1}}>
<div style={{fontFamily:"var(--font-mono)",fontSize:10,color:"var(--a)",letterSpacing:".2em",textTransform:"uppercase",marginBottom:22,display:"flex",alignItems:"center",gap:10}}>
<span className="live-dot"/>{WAITLIST.eyebrow}
</div>
<h2 style={{fontFamily:"var(--font-heading)",fontWeight:800,fontSize:"clamp(28px,4vw,56px)",color:"var(--t)",letterSpacing:"-.03em",marginBottom:18,lineHeight:1.0,maxWidth:600,whiteSpace:"pre-line"}}>{WAITLIST.headline}</h2>
<p style={{fontSize:16,color:"var(--m)",lineHeight:1.8,marginBottom:40,maxWidth:540}}>{WAITLIST.body}</p>
<div style={{display:"flex",gap:14,flexWrap:"wrap",alignItems:"center",marginBottom:32}}>
<a href="/auth/signin?callbackUrl=/api/stripe/checkout" className="btn-primary" style={{fontSize:15,padding:"17px 36px"}}>{WAITLIST.ctaButton}</a>
<a href="/api-docs" className="btn-ghost" style={{fontSize:13}}>View API docs →</a>
</div>
<div style={{display:"flex",gap:28,flexWrap:"wrap"}}>
{["$29/month","5,000 calls/day","14-day free trial","Cancel anytime"].map(item=>(
<div key={item} style={{display:"flex",alignItems:"center",gap:8}}>
<span style={{color:"var(--a)",fontSize:12}}>✓</span>
<span style={{fontFamily:"var(--font-body)",fontSize:13,color:"var(--m)"}}>{item}</span>
</div>))}
</div>
</div>
</div>
</section>);}
