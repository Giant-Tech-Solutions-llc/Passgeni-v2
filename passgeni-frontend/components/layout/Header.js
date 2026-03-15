import{useState,useEffect}from"react";
import{NAV}from"../../content/copy.js";
import PassGeniLogo from"./Logo.js";
const TICKER=["Zero Data Retention","Quantum-Ready Entropy","256-bit Minimum","Client-Side Only","Post-Quantum Ready","Zero Knowledge","NIST SP 800-63B","FIPS 140-3 Aligned","No Account Needed","DoD Compliant"];
export default function Header(){
const[scrolled,setScrolled]=useState(false);
const[open,setOpen]=useState(false);
const[active,setActive]=useState("");
useEffect(()=>{const fn=()=>setScrolled(window.scrollY>24);window.addEventListener("scroll",fn,{passive:true});return()=>window.removeEventListener("scroll",fn);},[]);
useEffect(()=>{const fn=()=>{if(window.innerWidth>900)setOpen(false)};window.addEventListener("resize",fn);return()=>window.removeEventListener("resize",fn);},[]);
useEffect(()=>{document.body.style.overflow=open?"hidden":"";return()=>{document.body.style.overflow="";};},[open]);
const doubled=[...TICKER,...TICKER];
return(<>
<header>
<nav className={`nav-root${scrolled?" scrolled":""}`}>
<a href="/"className="nav-logo"><PassGeniLogo height="30px"/><div className="nav-logo-dot"/></a>
<div className="nav-links-row">
{NAV.links.map(l=>(<a key={l.label}href={l.href}className={`nav-link${active===l.href?" active":""}`}onClick={()=>setActive(l.href)}>{l.label}</a>))}
</div>
<div className="nav-right">
<a href="/auth/signin"className="nav-signin">Sign In</a>
<a href={NAV.ctaHref}className="btn-primary"style={{padding:"10px 22px",fontSize:12}}>Try Free</a>
<button className={`nav-hamburger${open?" open":""}`}onClick={()=>setOpen(v=>!v)}aria-label="Menu"><span/><span/><span/></button>
</div></nav>
<div className="ticker-wrap"style={{marginTop:64}}>
<div className="ticker-track">
{doubled.map((item,i)=>(<span key={i}className="ticker-item">{item}</span>))}
</div>
</div>
</header>
<nav className={`mobile-nav-drawer${open?" open":""}`}>
{NAV.links.map(l=>(<a key={l.label}href={l.href}className="mobile-nav-link"onClick={()=>setOpen(false)}>{l.label}</a>))}
<a href={NAV.ctaHref}className="btn-primary"style={{marginTop:32,justifyContent:"center",fontSize:14,padding:"16px"}}onClick={()=>setOpen(false)}>Try Free</a>
</nav>
</>);}
