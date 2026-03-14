// =============================================================
// PASSGENI — HEADER / NAVIGATION (Redesign V2)
// Frosted glass · live dot · scroll-aware border · mobile drawer
// =============================================================
import { useState, useEffect } from "react";
import { NAV } from "../../content/copy.js";
import PassGeniLogo from "./Logo.js";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close drawer on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 900) setMobileOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header>
      <nav
        className={`nav-root ${scrolled ? "scrolled" : ""}`}
        aria-label="Main navigation"
      >
        {/* ── Left: Logo + live dot ── */}
        <a href="/" className="nav-logo" aria-label="PassGeni home">
          <PassGeniLogo height="30px" />
          <div className="nav-logo-dot" aria-hidden="true" />
        </a>

        {/* ── Center: Nav links (desktop) ── */}
        <div className="nav-links-row" role="list">
          {NAV.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="nav-link"
              role="listitem"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* ── Right: CTA + mobile hamburger ── */}
        <div className="nav-right">
          <a
            href={NAV.ctaHref}
            className="btn-primary"
            style={{ padding: "9px 20px", fontSize: 11 }}
          >
            {NAV.ctaButton}
          </a>
          <button
            className={`nav-hamburger ${mobileOpen ? "open" : ""}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* ── Mobile drawer ── */}
      <div
        className={`mobile-nav-drawer ${mobileOpen ? "open" : ""}`}
        aria-hidden={!mobileOpen}
      >
        {NAV.links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="mobile-nav-link"
            onClick={() => setMobileOpen(false)}
          >
            {link.label}
          </a>
        ))}
        <a
          href={NAV.ctaHref}
          className="btn-primary"
          style={{ marginTop: 24, justifyContent: "center", fontSize: 13, padding: "14px 28px" }}
          onClick={() => setMobileOpen(false)}
        >
          {NAV.ctaButton}
        </a>
      </div>
    </header>
  );
}
