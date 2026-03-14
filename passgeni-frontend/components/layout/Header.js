import{useState,useEffect}from"react";
import{NAV}from"../../content/copy.js";
import PassGeniLogo from"./Logo.js";
export default function Header(){
const[scrolled,setScrolled]=useState(false);
const[open,setOpen]=useState(false);
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
useEffect(()=>{document.body.style.overflow=open?"hidden":"";return()=>{document.body.style.overflow="";};},[open]);
return(
<header>
<nav className={`nav-root${scrolled?" scrolled":""}`} aria-label="Main navigation">
<a href="/" className="nav-logo" aria-label="PassGeni home">
<PassGeniLogo height="30px"/>
<div className="nav-logo-dot" aria-hidden="true"/>
</a>
<div className="nav-links-row">
{NAV.links.map(l=>(
<a key={l.label} href={l.href} className="nav-link">{l.label}</a>
))}
</div>
<div className="nav-right">
<a href={NAV.ctaHref} className="btn-primary" style={{padding:"9px 20px",fontSize:11}}>{NAV.ctaButton}</a>
<button className={`nav-hamburger${open?" open":""}`} onClick={()=>setOpen(v=>!v)} aria-label={open?"Close menu":"Open menu"} aria-expanded={open}>
<span/><span/><span/>
</button>
</div>
</nav>
<nav className={`mobile-nav-drawer${open?" open":""}`} aria-hidden={!open}>
{NAV.links.map(l=>(
<a key={l.label} href={l.href} className="mobile-nav-link" onClick={()=>setOpen(false)}>{l.label}</a>
))}
<a href={NAV.ctaHref} className="btn-primary" style={{marginTop:28,justifyContent:"center",fontSize:14,padding:"16px 32px"}} onClick={()=>setOpen(false)}>{NAV.ctaButton}</a>
</nav>
</header>
);}
