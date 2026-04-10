import{useState}from"react";
import{motion,AnimatePresence}from"framer-motion";
import{HOW_IT_WORKS,FEATURES,TOOLS_PREVIEW,PRICING,TESTIMONIALS,FAQ,WAITLIST,BOTTOM_CTA}from"../../content/copy.js";
import{Headline}from"../ui/index.js";

const LOGOS=["Microsoft","Google","Amazon","Stripe","Shopify","Cloudflare","GitHub","Atlassian","Twilio","Okta","Datadog","HashiCorp","Vercel","MongoDB","Elastic"];

/* StatsBar removed — stats shown inside generator section */

/* ── LOGOS TRUST STRIP ── */
export function LogosStrip(){
  return(
    <div style={{borderTop:"1px solid rgba(200,255,0,0.05)",paddingTop:24,paddingBottom:24,overflow:"hidden",position:"relative"}}>
      <div style={{textAlign:"center",marginBottom:14}}>
        <span style={{fontFamily:"var(--font-body)",fontSize:11,fontWeight:500,color:"var(--muted-2)",letterSpacing:".12em",textTransform:"uppercase"}}>Trusted by security teams at</span>
      </div>
      <div style={{position:"relative"}}>
        <div style={{position:"absolute",left:0,top:0,bottom:0,width:80,background:"linear-gradient(to right,var(--bg),transparent)",zIndex:2,pointerEvents:"none"}}/>
        <div style={{position:"absolute",right:0,top:0,bottom:0,width:80,background:"linear-gradient(to left,var(--bg),transparent)",zIndex:2,pointerEvents:"none"}}/>
        <div
          className="logos-track"
          onMouseEnter={e=>e.currentTarget.style.animationPlayState="paused"}
          onMouseLeave={e=>e.currentTarget.style.animationPlayState="running"}
        >
          {[...LOGOS,...LOGOS].map((name,i)=>(
            <span key={i} className="logo-item">{name}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

const sectionHeadReveal={initial:{opacity:0,y:30},whileInView:{opacity:1,y:0},viewport:{once:true,margin:"-80px"},transition:{duration:0.6,ease:"easeOut"}};
const cardReveal=(i)=>({initial:{opacity:0,y:20},whileInView:{opacity:1,y:0},viewport:{once:true},transition:{duration:0.4,ease:"easeOut",delay:i*0.1}});

/* ── HOW IT WORKS ── */
export function HowItWorks(){
  return(
    <section id="how" style={{padding:"var(--section) var(--pad)",maxWidth:1200,margin:"0 auto"}}>
      <div className="section-header">
        <div className="eyebrow" style={{justifyContent:"center"}}>{HOW_IT_WORKS.eyebrow}</div>
        <motion.h2 {...sectionHeadReveal} style={{fontFamily:"var(--font-heading)",fontWeight:800,fontSize:"clamp(26px,5vw,52px)",color:"var(--text)",letterSpacing:"-.03em",lineHeight:1.05,maxWidth:520,margin:"0 auto",whiteSpace:"pre-line"}}>{HOW_IT_WORKS.headline}</motion.h2>
      </div>
      <div className="grid-cards">
        {HOW_IT_WORKS.steps.map((step,i)=>(
          <motion.article key={step.step} {...cardReveal(i)} className="bc bc-a">
            <div className="bc-line"/>
            <div style={{fontFamily:"var(--font-body)",fontSize:10,fontWeight:700,color:"var(--accent)",letterSpacing:".14em",marginBottom:16,textTransform:"uppercase"}}>{step.step}</div>
            <h3 style={{fontFamily:"var(--font-heading)",fontWeight:800,fontSize:"clamp(16px,2.5vw,20px)",color:"var(--text)",marginBottom:12,letterSpacing:"-.02em"}}>{step.title}</h3>
            <p style={{fontSize:"var(--text-base)",color:"var(--muted)",lineHeight:1.8,flex:1,marginBottom:20}}>{step.body}</p>
            <div style={{display:"inline-block",background:"rgba(200,255,0,0.06)",border:"1px solid rgba(200,255,0,0.15)",borderRadius:6,padding:"5px 12px",fontFamily:"var(--font-body)",fontSize:10,fontWeight:600,color:"rgba(200,255,0,.7)",letterSpacing:".06em"}}>{step.accent}</div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

/* ── FEATURES ── */
export function FeaturesSection(){
  return(
    <section id="features" style={{padding:"0 var(--pad) var(--section)",maxWidth:1200,margin:"0 auto"}}>
      <div className="section-header">
        <div className="eyebrow" style={{justifyContent:"center"}}>{FEATURES.eyebrow}</div>
        <motion.h2 {...sectionHeadReveal} style={{fontFamily:"var(--font-heading)",fontWeight:800,fontSize:"clamp(26px,5vw,52px)",color:"var(--text)",letterSpacing:"-.03em"}}>
          Not just random.<br/><span style={{color:"var(--accent)"}}>Reasoned.</span>
        </motion.h2>
      </div>
      <div className="grid-cards">
        {FEATURES.items.slice(0,6).map((item,i)=>(
          <motion.article key={item.title} {...cardReveal(i)} className="bc bc-a">
            <div className="bc-line"/>
            <div style={{fontSize:"clamp(22px,3.5vw,28px)",marginBottom:16,color:"var(--accent)",lineHeight:1}}>{item.icon}</div>
            <h3 style={{fontFamily:"var(--font-heading)",fontWeight:800,fontSize:"clamp(15px,2vw,17px)",color:"var(--text)",marginBottom:10,letterSpacing:"-.02em",lineHeight:1.3}}>{item.title}</h3>
            <p style={{fontSize:"var(--text-base)",color:"var(--muted)",lineHeight:1.8}}>{item.body}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

/* ── TOOLS ── */
export function ToolsPreview(){
  return(
    <section style={{padding:"0 var(--pad) var(--section)",maxWidth:1200,margin:"0 auto"}}>
      <div className="section-header">
        <div className="eyebrow" style={{justifyContent:"center"}}>{TOOLS_PREVIEW.eyebrow}</div>
        <motion.h2 {...sectionHeadReveal} style={{fontFamily:"var(--font-heading)",fontWeight:800,fontSize:"clamp(26px,5vw,52px)",color:"var(--text)",letterSpacing:"-.03em"}}>
          Everything you need.<br/><span style={{color:"var(--accent)"}}>Nothing you don't.</span>
        </motion.h2>
      </div>
      <div className="grid-cards">
        {TOOLS_PREVIEW.items.slice(0,6).map((item,i)=>(
          <motion.a key={item.title} {...cardReveal(i)} href={item.href} className="bc bc-a" style={{textDecoration:"none"}}>
            <div className="bc-line"/>
            <div style={{fontSize:"clamp(22px,3.5vw,28px)",marginBottom:14,lineHeight:1}}>{item.icon}</div>
            <h3 style={{fontFamily:"var(--font-heading)",fontWeight:800,fontSize:"clamp(15px,2vw,17px)",color:"var(--text)",marginBottom:8,flex:1}}>{item.title}</h3>
            <p style={{fontSize:"var(--text-base)",color:"var(--muted)",lineHeight:1.75,marginBottom:14}}>{item.body}</p>
            <span style={{fontFamily:"var(--font-body)",fontSize:12,fontWeight:600,color:"var(--accent)",letterSpacing:".04em"}}>{item.label} →</span>
          </motion.a>
        ))}
      </div>
    </section>
  );
}

/* ── PRICING ── */
export function PricingSection(){
  return(
    <section id="pricing" style={{padding:"var(--section) var(--pad)",maxWidth:1200,margin:"0 auto"}}>
      <div className="section-header">
        <div className="eyebrow" style={{justifyContent:"center"}}>{PRICING.eyebrow}</div>
        <h2 style={{fontFamily:"var(--font-heading)",fontWeight:800,fontSize:"clamp(26px,5vw,52px)",color:"var(--text)",letterSpacing:"-.03em",marginBottom:14,whiteSpace:"pre-line"}}>{PRICING.headline}</h2>
        <p style={{fontFamily:"var(--font-body)",fontSize:"var(--text-md)",color:"var(--muted)",maxWidth:440,margin:"0 auto"}}>{PRICING.subheadline}</p>
      </div>
      <div className="pricing-grid">
        {PRICING.plans.map((plan,i)=>(
          <div key={plan.name} style={{
            background:i===1?"linear-gradient(135deg,rgba(13,13,16,.9) 0%,rgba(200,255,0,.05) 100%)":"rgba(13,13,16,.75)",
            border:i===1?"1px solid rgba(200,255,0,.28)":"1px solid rgba(200,255,0,.08)",
            borderRadius:"var(--radius-l)",padding:"clamp(24px,3vw,36px)",
            display:"flex",flexDirection:"column",position:"relative",
            backdropFilter:"blur(12px)",transition:"border-color .3s,transform .3s",
          }}
            onMouseEnter={e=>{if(i!==1)e.currentTarget.style.borderColor="rgba(200,255,0,.2)";e.currentTarget.style.transform="translateY(-2px)";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=i===1?"rgba(200,255,0,.28)":"rgba(200,255,0,.08)";e.currentTarget.style.transform="translateY(0)";}}
          >
            {i===1&&<div style={{position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(200,255,0,.6),transparent)"}}/>}
            {plan.badge&&(
              <div style={{position:"absolute",top:-1,left:"50%",transform:"translateX(-50%)",background:"var(--accent)",color:"#000",fontFamily:"var(--font-body)",fontSize:9,fontWeight:700,letterSpacing:".12em",padding:"5px 18px",borderRadius:"0 0 10px 10px",whiteSpace:"nowrap"}}>
                {plan.badge}
              </div>
            )}
            <div style={{marginBottom:24,paddingTop:plan.badge?20:0}}>
              <div style={{fontFamily:"var(--font-body)",fontSize:11,fontWeight:700,color:plan.color||"var(--accent)",letterSpacing:".1em",textTransform:"uppercase",marginBottom:10}}>{plan.name}</div>
              <div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:8,flexWrap:"wrap"}}>
                <span style={{fontFamily:"var(--font-heading)",fontWeight:800,fontSize:"clamp(38px,6vw,56px)",color:"var(--text)",letterSpacing:"-.04em",lineHeight:1}}>{plan.price}</span>
                {plan.period&&<span style={{fontFamily:"var(--font-body)",fontSize:"var(--text-base)",color:"var(--muted)"}}>{plan.period}</span>}
              </div>
              <p style={{fontFamily:"var(--font-body)",fontSize:"var(--text-base)",color:"var(--muted)",lineHeight:1.6}}>{plan.tagline}</p>
            </div>
            <a href={plan.ctaHref} className={plan.featured?"btn-primary":"btn-ghost"}
              style={{width:"100%",justifyContent:"center",marginBottom:24,display:"flex",boxSizing:"border-box"}}
            >{plan.cta}</a>
            <div style={{borderTop:"1px solid rgba(200,255,0,0.08)",paddingTop:16,flex:1}}>
              {plan.features.map((f,fi)=>(
                <div key={fi} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:9}}>
                  <span style={{color:"var(--accent)",fontSize:12,marginTop:3,flexShrink:0}}>✓</span>
                  <span style={{fontFamily:"var(--font-body)",fontSize:"var(--text-base)",color:"var(--text)",lineHeight:1.5}}>{f}</span>
                </div>
              ))}
              {plan.missing?.slice(0,2).map((f,fi)=>(
                <div key={fi} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:9,opacity:.3}}>
                  <span style={{fontSize:12,color:"var(--muted)",marginTop:3,flexShrink:0}}>—</span>
                  <span style={{fontFamily:"var(--font-body)",fontSize:"var(--text-base)",color:"var(--muted)",lineHeight:1.5}}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p style={{textAlign:"center",fontFamily:"var(--font-body)",fontSize:11,color:"var(--muted-2)",marginTop:24,letterSpacing:".08em"}}>{PRICING.footer}</p>
    </section>
  );
}

/* ── TESTIMONIALS ── */
const FEATURED_TESTIMONIALS=["James K.","Pia R.","Mei L."];
export function TestimonialsSection(){
  const featured=TESTIMONIALS.items.filter(t=>FEATURED_TESTIMONIALS.includes(t.name));
  return(
    <section style={{padding:"0 var(--pad) var(--section)"}}>
      <div style={{maxWidth:1200,margin:"0 auto"}}>
        <div style={{marginBottom:"clamp(32px,5vw,52px)",textAlign:"center"}}>
          <div className="eyebrow" style={{justifyContent:"center"}}>{TESTIMONIALS.eyebrow}</div>
          <Headline>{TESTIMONIALS.headline}</Headline>
        </div>
        <div style={{maxWidth:860,margin:"0 auto"}}>
          {/* Top row — 2 cards */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"clamp(12px,2vw,20px)",marginBottom:"clamp(12px,2vw,20px)"}}>
            {featured.slice(0,2).map((t,i)=>(
              <motion.article key={i}
                whileHover={{y:-4,borderColor:"rgba(200,255,0,0.25)"}}
                transition={{duration:0.2}}
                style={{background:"#0a0a0c",border:"1px solid #1e1e1e",borderRadius:14,padding:28,display:"flex",flexDirection:"column",cursor:"default"}}
              >
                <div style={{display:"flex",gap:2,marginBottom:12}}>
                  {Array(t.stars||5).fill("★").map((s,si)=><span key={si} style={{color:"#C8FF00",fontSize:13}}>{s}</span>)}
                </div>
                <p style={{fontFamily:"var(--font-body)",fontSize:"var(--text-base)",color:"#aaa",lineHeight:1.8,marginBottom:16,flex:1,fontStyle:"italic"}}>"{t.text}"</p>
                <div>
                  <div style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:15,color:"#fff"}}>{t.name}</div>
                  <div style={{fontFamily:"var(--font-body)",fontSize:12,color:"#555",marginTop:3}}>{t.role}</div>
                </div>
              </motion.article>
            ))}
          </div>
          {/* Bottom row — 1 card centred */}
          <div style={{display:"flex",justifyContent:"center"}}>
            {featured.slice(2,3).map((t,i)=>(
              <motion.article key={i}
                whileHover={{y:-4,borderColor:"rgba(200,255,0,0.25)"}}
                transition={{duration:0.2}}
                style={{background:"#0a0a0c",border:"1px solid #1e1e1e",borderRadius:14,padding:28,width:"calc(50% - 10px)",display:"flex",flexDirection:"column",cursor:"default"}}
              >
                <div style={{display:"flex",gap:2,marginBottom:12}}>
                  {Array(t.stars||5).fill("★").map((s,si)=><span key={si} style={{color:"#C8FF00",fontSize:13}}>{s}</span>)}
                </div>
                <p style={{fontFamily:"var(--font-body)",fontSize:"var(--text-base)",color:"#aaa",lineHeight:1.8,marginBottom:16,flex:1,fontStyle:"italic"}}>"{t.text}"</p>
                <div>
                  <div style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:15,color:"#fff"}}>{t.name}</div>
                  <div style={{fontFamily:"var(--font-body)",fontSize:12,color:"#555",marginTop:3}}>{t.role}</div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── FAQ ── */
export function FAQSection(){
  const[open,setOpen]=useState(null);
  return(
    <section id="faq" style={{padding:"0 var(--pad) var(--section)",maxWidth:1200,margin:"0 auto"}}>
      <div className="section-header">
        <div className="eyebrow" style={{justifyContent:"center"}}>{FAQ.eyebrow}</div>
        <Headline>{FAQ.headline}</Headline>
      </div>
      <div style={{maxWidth:720,margin:"0 auto"}}>
        {FAQ.items.map((item,i)=>(
          <div key={i} className="faq-item" onClick={()=>setOpen(open===i?null:i)}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:"clamp(12px,3vw,24px)"}}>
              <div style={{display:"flex",gap:"clamp(12px,2vw,18px)",alignItems:"center"}}>
                <span style={{fontFamily:"var(--font-body)",fontSize:11,fontWeight:700,color:"rgba(200,255,0,.45)",letterSpacing:".1em",flexShrink:0,minWidth:24}}>{String(i+1).padStart(2,"0")}</span>
                <h3 style={{fontFamily:"var(--font-heading)",fontSize:"clamp(14px,2.5vw,17px)",fontWeight:700,color:open===i?"var(--accent)":"var(--text)",margin:0,lineHeight:1.4}}>{item.question}</h3>
              </div>
              <motion.span
                animate={{rotate:open===i?45:0}}
                transition={{duration:0.2}}
                style={{color:"var(--accent)",fontSize:"clamp(18px,2.5vw,22px)",flexShrink:0,display:"block",originX:"50%",originY:"50%"}}
              >+</motion.span>
            </div>
            <AnimatePresence initial={false}>
              {open===i&&(
                <motion.div
                  key="answer"
                  initial={{height:0,opacity:0}}
                  animate={{height:"auto",opacity:1}}
                  exit={{height:0,opacity:0}}
                  transition={{duration:0.3,ease:"easeOut"}}
                  style={{overflow:"hidden"}}
                >
                  <p style={{fontFamily:"var(--font-body)",fontSize:"var(--text-base)",color:"var(--muted)",lineHeight:1.85,marginTop:14,paddingLeft:"clamp(26px,4vw,42px)"}}>
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── BLOG ── */
export function FeaturedBlogSection(){
  const posts=[
    {slug:"pci-dss-v4-password-changes-explained",title:"PCI-DSS v4.0 Raised the Password Bar. Here's What You Missed.",excerpt:"The March 2024 deadline passed. Here is what changed and what auditors will check.",category:"Compliance",color:"#ffb74d",readTime:6,date:"Jan 10, 2025"},
    {slug:"why-password-complexity-rules-backfire",title:"Why Password Complexity Rules Make You Less Secure",excerpt:"Requiring uppercase, a number, and a symbol teaches users to choose P@ssw0rd.",category:"Research",color:"#ce93d8",readTime:5,date:"Jan 14, 2025"},
    {slug:"announcing-passgeni-v2",title:"PassGeni V2: DNA Score, Compliance Presets, and 6 New Tools",excerpt:"Everything that shipped in V2 — DNA Score, six new free tools, HIPAA and PCI-DSS presets.",category:"Product",color:"#81c784",readTime:4,date:"Jan 20, 2025"},
  ];
  return(
    <section style={{padding:"0 var(--pad) var(--section)",maxWidth:1200,margin:"0 auto"}}>
      <div className="section-header">
        <div className="eyebrow" style={{justifyContent:"center"}}>From the blog</div>
        <h2 style={{fontFamily:"var(--font-heading)",fontWeight:800,fontSize:"clamp(24px,5vw,44px)",color:"var(--text)",letterSpacing:"-.03em"}}>Latest posts.</h2>
      </div>
      <div className="grid-cards">
        {posts.map(p=>(
          <a key={p.slug} href={`/blog/${p.slug}`} className="bc bc-a" style={{textDecoration:"none"}}>
            <div className="bc-line"/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:8}}>
              <span style={{fontFamily:"var(--font-body)",fontSize:9,fontWeight:700,color:p.color,letterSpacing:".12em",textTransform:"uppercase",background:p.color+"18",padding:"4px 12px",borderRadius:100}}>{p.category}</span>
              <span style={{fontFamily:"var(--font-body)",fontSize:11,color:"var(--muted-2)"}}>{p.readTime} min · {p.date}</span>
            </div>
            <h3 style={{fontFamily:"var(--font-heading)",fontWeight:800,fontSize:"clamp(15px,2vw,17px)",color:"var(--text)",lineHeight:1.35,marginBottom:10,flex:1}}>{p.title}</h3>
            <p style={{fontSize:"var(--text-base)",color:"var(--muted)",lineHeight:1.75,marginBottom:16}}>{p.excerpt}</p>
            <span style={{fontFamily:"var(--font-body)",fontSize:12,fontWeight:600,color:"var(--accent)",letterSpacing:".04em"}}>Read more →</span>
          </a>
        ))}
      </div>
      <div style={{textAlign:"center",marginTop:"clamp(24px,4vw,36px)"}}>
        <motion.a href="/blog"
          whileHover={{scale:1.02}}
          whileTap={{scale:0.98}}
          transition={{duration:0.2}}
          style={{fontFamily:"var(--font-body)",fontSize:13,fontWeight:600,color:"var(--accent)",letterSpacing:".04em",display:"inline-flex",alignItems:"center",gap:8,padding:"clamp(10px,1.5vw,12px) clamp(20px,3vw,28px)",border:"1px solid rgba(200,255,0,.2)",borderRadius:8,transition:"border-color .2s,background .2s"}}
          onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(200,255,0,.4)";e.currentTarget.style.background="rgba(200,255,0,.04)";}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(200,255,0,.2)";e.currentTarget.style.background="transparent";}}
        >View all posts →</motion.a>
      </div>
    </section>
  );
}

/* ── BOTTOM CTA (digest + PDF) ── */
export function WaitlistSection(){
  const[email,setEmail]=useState("");
  const[submitted,setSubmitted]=useState(false);
  const[loading,setLoading]=useState(false);

  async function handleSubmit(e){
    e.preventDefault();
    if(!email||loading)return;
    setLoading(true);
    try{
      await fetch("/api/waitlist",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,type:"digest"})});
    }catch(_){}
    setSubmitted(true);
    setLoading(false);
  }

  const cardStyle={
    background:"#0a0a0c",border:"1px solid #1e1e1e",borderRadius:14,
    padding:"clamp(28px,4vw,40px)",flex:"1 1 280px",display:"flex",flexDirection:"column",
  };
  const eyebrowStyle={
    fontFamily:"var(--font-body)",fontSize:10,fontWeight:700,color:"#C8FF00",
    letterSpacing:".14em",textTransform:"uppercase",marginBottom:14,
  };
  const disclaimerStyle={
    fontFamily:"var(--font-body)",fontSize:11,color:"#444",marginTop:12,lineHeight:1.5,
  };

  return(
    <section style={{margin:"0 auto clamp(60px,10vw,120px)",padding:"0 var(--pad)",maxWidth:1200}}>
      <div style={{display:"flex",gap:"clamp(16px,3vw,24px)",flexWrap:"wrap"}}>
        {/* Card 1 — Weekly Digest */}
        <div style={cardStyle}>
          <div style={eyebrowStyle}>{BOTTOM_CTA.digest.eyebrow}</div>
          <h2 style={{fontFamily:"var(--font-heading)",fontWeight:800,fontSize:"clamp(20px,3vw,28px)",color:"var(--text)",letterSpacing:"-.03em",marginBottom:12,lineHeight:1.15}}>{BOTTOM_CTA.digest.headline}</h2>
          <p style={{fontFamily:"var(--font-body)",fontSize:"var(--text-base)",color:"var(--muted)",lineHeight:1.75,marginBottom:24,flex:1}}>{BOTTOM_CTA.digest.body}</p>
          {submitted?(
            <div style={{fontFamily:"var(--font-body)",fontSize:14,fontWeight:600,color:"#C8FF00",padding:"12px 0"}}>{BOTTOM_CTA.digest.success}</div>
          ):(
            <form onSubmit={handleSubmit} style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <input
                type="email" required value={email} onChange={e=>setEmail(e.target.value)}
                placeholder={BOTTOM_CTA.digest.inputPlaceholder}
                style={{flex:1,minWidth:160,background:"rgba(255,255,255,0.04)",border:"1px solid #2a2a2a",borderRadius:8,padding:"10px 14px",fontFamily:"var(--font-body)",fontSize:14,color:"var(--text)",outline:"none"}}
              />
              <motion.button type="submit" disabled={loading} className="btn-primary"
                whileHover={{scale:1.03,boxShadow:"0 0 24px rgba(200,255,0,0.35)"}}
                whileTap={{scale:0.97}}
                transition={{duration:0.2}}
                style={{whiteSpace:"nowrap",padding:"10px 18px",fontSize:13}}
              >
                {loading?"…":BOTTOM_CTA.digest.cta}
              </motion.button>
            </form>
          )}
          <p style={disclaimerStyle}>{BOTTOM_CTA.digest.disclaimer}</p>
        </div>

        {/* Card 2 — PDF Download */}
        <div style={cardStyle}>
          <div style={eyebrowStyle}>{BOTTOM_CTA.pdf.eyebrow}</div>
          <h2 style={{fontFamily:"var(--font-heading)",fontWeight:800,fontSize:"clamp(20px,3vw,28px)",color:"var(--text)",letterSpacing:"-.03em",marginBottom:12,lineHeight:1.15}}>{BOTTOM_CTA.pdf.headline}</h2>
          <p style={{fontFamily:"var(--font-body)",fontSize:"var(--text-base)",color:"var(--muted)",lineHeight:1.75,marginBottom:24,flex:1}}>{BOTTOM_CTA.pdf.body}</p>
          <motion.a href={BOTTOM_CTA.pdf.href} target="_blank" rel="noopener noreferrer" className="btn-primary"
            whileHover={{scale:1.03,boxShadow:"0 0 24px rgba(200,255,0,0.35)"}}
            whileTap={{scale:0.97}}
            transition={{duration:0.2}}
            style={{display:"inline-flex",alignItems:"center",justifyContent:"center",padding:"12px 22px",fontSize:14,width:"fit-content"}}
          >
            {BOTTOM_CTA.pdf.cta}
          </motion.a>
          <p style={disclaimerStyle}>{BOTTOM_CTA.pdf.disclaimer}</p>
        </div>
      </div>
    </section>
  );
}

/* Keep StatsBar export as no-op so existing imports don't break */
export function StatsBar(){return null;}
