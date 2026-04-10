import Head from "next/head";
import { useState } from "react";
import { motion } from "framer-motion";
import Header from "../components/layout/Header.js";
import Footer from "../components/layout/Footer.js";

const PLANS = [
  {
    name: "Free",
    monthly: "$0",
    annual: "$0",
    period: "forever",
    tagline: "For individuals who value security without the friction.",
    cta: "Start generating",
    ctaHref: "/#generator",
    featured: false,
    features: [
      "15 passwords per day",
      "All 6 profession seeds (5/day limit)",
      "Passphrase mode (NIST 800-63B)",
      "Basic password strength meter",
      "DNA Score (1 per day)",
      "Post-Quantum mode (1 per day)",
      "Zero data retention — always",
      "Secure Password Sharing",
    ],
  },
  {
    name: "Pro",
    monthly: "$9",
    annual: "$89",
    period: "/month",
    annualPeriod: "/year",
    annualNote: "Save 17%",
    tagline: "For power users who generate daily and need compliance tools.",
    cta: "Get Pro",
    ctaMonthly: "/auth/signin?callbackUrl=/checkout?plan=pro&billing=monthly",
    ctaAnnual: "/auth/signin?callbackUrl=/checkout?plan=pro&billing=annual",
    featured: false,
    features: [
      "150 passwords per day",
      "All seeds + custom AI profession",
      "Unlimited DNA Score",
      "Password history (last 20)",
      "Bulk generator — 25 at once",
      "Breach Checker",
      "Strength Checker",
      "Unlimited Secure Sharing",
    ],
  },
  {
    name: "Team",
    monthly: "$29",
    annual: "$249",
    period: "/month",
    annualPeriod: "/year",
    annualNote: "Save 28%",
    tagline: "For teams that need compliance, API access, and audit-ready outputs.",
    badge: "⭐ Most Popular",
    cta: "Start 14-day free trial",
    ctaMonthly: "/auth/signin?callbackUrl=/checkout?plan=team&billing=monthly",
    ctaAnnual: "/auth/signin?callbackUrl=/checkout?plan=team&billing=annual",
    featured: true,
    features: [
      "Unlimited password generation",
      "All 8 seeds + custom vocabulary",
      "All compliance presets (HIPAA · PCI-DSS · SOC 2 · ISO 27001 · NIST · DoD · Post-Quantum)",
      "Bulk generator — 500 at once",
      "REST API — 5,000 calls/day",
      "CSV export",
      "5 team seats",
      "All 6 security tools",
      "Rotation reminders",
      "Priority support",
    ],
    trialNote: "14 days free — no card required",
  },
  {
    name: "Enterprise",
    monthly: "Custom",
    annual: "Custom",
    period: "",
    tagline: "For large orgs needing unlimited scale, SSO, and dedicated support.",
    cta: "Contact us",
    ctaHref: "/contact",
    featured: false,
    features: [
      "Everything in Team",
      "Unlimited API calls",
      "Unlimited seats",
      "SSO / SAML",
      "On-premise deployment",
      "Dedicated Slack channel",
      "Custom SLA",
      "Paddle invoice billing",
    ],
  },
];

const COMPARISON_ROWS = [
  { feature: "Passwords per day",            free: "15",  pro: "150",   team: "Unlimited" },
  { feature: "Profession seeds",             free: "6 (5/day)", pro: "6 + custom AI", team: "8 + custom" },
  { feature: "Passphrase mode",             free: true,  pro: true,    team: true },
  { feature: "Password DNA Score",          free: "1/day", pro: true,  team: true },
  { feature: "Post-Quantum mode",           free: "1/day", pro: true,  team: true },
  { feature: "Compliance presets",          free: false, pro: false,   team: true },
  { feature: "Bulk generator",             free: false, pro: "25",    team: "500" },
  { feature: "Password history",           free: false, pro: "Last 20", team: "Last 20" },
  { feature: "Breach Checker",             free: false, pro: true,    team: true },
  { feature: "Strength Checker",           free: false, pro: true,    team: true },
  { feature: "Secure Password Sharing",    free: true,  pro: true,    team: true },
  { feature: "Password Policy Generator",  free: false, pro: false,   team: true },
  { feature: "Password Audit Tool",        free: false, pro: false,   team: true },
  { feature: "REST API",                   free: false, pro: false,   team: "5,000/day" },
  { feature: "CSV export",                 free: false, pro: false,   team: true },
  { feature: "Team seats",                 free: "1",   pro: "1",     team: "5" },
  { feature: "Rotation reminders",         free: false, pro: false,   team: true },
  { feature: "Zero data retention",        free: true,  pro: true,    team: true },
  { feature: "Priority support",           free: false, pro: false,   team: true },
];

const PRICING_FAQS = [
  { q: "Can I cancel anytime?", a: "Yes. Cancel from your dashboard at any time — no questions asked. If you're on an annual plan, we issue a prorated refund for unused months." },
  { q: "Is the 14-day Team trial really free?", a: "Completely free — no credit card required to start. You get full Team plan access for 14 days. If you don't upgrade, your account reverts to Free automatically." },
  { q: "What payment methods do you accept?", a: "All major credit and debit cards (Visa, Mastercard, Amex), Apple Pay, and Google Pay — processed securely via Paddle." },
  { q: "Can I upgrade from Pro to Team later?", a: "Yes. Upgrade anytime from your dashboard. We'll prorate the difference so you only pay for what you use." },
  { q: "Is there an annual discount?", a: "Pro annual saves 17% vs monthly ($89/yr vs $108). Team annual saves 28% vs monthly ($249/yr vs $348). Billed once per year." },
  { q: "Do you store passwords on the server?", a: "Never. All password generation happens client-side in your browser. Zero data is sent to our servers. This is an architectural guarantee, not a policy." },
  { q: "What compliance presets does Team include?", a: "HIPAA, PCI-DSS v4.0, SOC 2, ISO 27001, NIST SP 800-63B, DoD / Government, and Post-Quantum. Each preset auto-configures the correct minimum length, character classes, and complexity rules." },
  { q: "What is the Password DNA Score?", a: "A 7-point cryptographic quality metric that grades your password A to F. It checks length thresholds, character class diversity, repeat-character patterns, and entropy — weighted by security impact." },
];

function Check({ value }) {
  if (value === true) return <span style={{ color: "#C8FF00", fontSize: 15 }}>✓</span>;
  if (value === false) return <span style={{ color: "#333", fontSize: 14 }}>—</span>;
  return <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#aaa" }}>{value}</span>;
}

export default function PricingPage() {
  const [billing, setBilling] = useState("monthly");
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <>
      <Head>
        <title>Pricing — PassGeni | Free, Pro & Team Plans</title>
        <meta name="description" content="PassGeni pricing: Free forever, Pro at $9/month, Team at $29/month with 14-day free trial. Compliance presets, REST API, bulk generation and more." />
        <link rel="canonical" href="https://passgeni.ai/pricing" />
        <meta property="og:title" content="PassGeni Pricing — Free, Pro & Team" />
        <meta property="og:description" content="Start free. Upgrade when you need compliance presets, REST API, or team seats." />
      </Head>
      <div style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
        <Header />
        <main style={{ paddingTop: 80 }}>

          {/* Hero */}
          <section style={{ padding: "var(--section) var(--pad)", maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700, color: "var(--accent)", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 16 }}>Pricing</div>
            <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(32px,6vw,64px)", letterSpacing: "-.03em", lineHeight: 1.05, marginBottom: 16 }}>
              Free forever.<br /><span style={{ color: "var(--accent)" }}>Upgrade when you need more.</span>
            </h1>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-md)", color: "var(--muted)", maxWidth: 480, margin: "0 auto 32px" }}>
              No credit card for the free plan. No card for the Team trial. Pay only when you're ready.
            </p>

            {/* Billing toggle */}
            <div style={{ display: "inline-flex", background: "#0a0a0c", border: "1px solid #1e1e1e", borderRadius: 100, padding: 4, gap: 4 }}>
              {["monthly", "annual"].map(b => (
                <button key={b} onClick={() => setBilling(b)}
                  style={{
                    fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, padding: "8px 22px",
                    borderRadius: 100, border: "none", cursor: "pointer", transition: "background .2s,color .2s",
                    background: billing === b ? "#C8FF00" : "transparent",
                    color: billing === b ? "#000" : "var(--muted)",
                  }}
                >
                  {b === "monthly" ? "Monthly" : "Annual"}
                  {b === "annual" && <span style={{ marginLeft: 6, fontSize: 10, opacity: billing === "annual" ? .7 : .5 }}>Save up to 28%</span>}
                </button>
              ))}
            </div>
          </section>

          {/* Plan cards */}
          <section style={{ padding: "0 var(--pad) var(--section)", maxWidth: 1200, margin: "0 auto" }}>
            <div className="pricing-grid">
              {PLANS.map((plan) => {
                const price = billing === "annual" && plan.annual !== "Custom" ? plan.annual : plan.monthly;
                const period = billing === "annual" && plan.annualPeriod ? plan.annualPeriod : plan.period;
                const ctaHref = plan.ctaHref
                  ? plan.ctaHref
                  : (billing === "annual" ? plan.ctaAnnual : plan.ctaMonthly);
                return (
                  <div key={plan.name} style={{
                    background: plan.featured ? "linear-gradient(135deg,rgba(13,13,16,.9) 0%,rgba(200,255,0,.05) 100%)" : "rgba(13,13,16,.75)",
                    border: plan.featured ? "1px solid rgba(200,255,0,.28)" : "1px solid rgba(200,255,0,.08)",
                    borderRadius: "var(--radius-l)", padding: "clamp(24px,3vw,36px)",
                    display: "flex", flexDirection: "column", position: "relative",
                    backdropFilter: "blur(12px)", transition: "border-color .3s,transform .3s",
                  }}
                    onMouseEnter={e => { if (!plan.featured) e.currentTarget.style.borderColor = "rgba(200,255,0,.2)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = plan.featured ? "rgba(200,255,0,.28)" : "rgba(200,255,0,.08)"; e.currentTarget.style.transform = "translateY(0)"; }}
                  >
                    {plan.featured && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,rgba(200,255,0,.6),transparent)" }} />}
                    {plan.badge && (
                      <div style={{ position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)", background: "var(--accent)", color: "#000", fontFamily: "var(--font-body)", fontSize: 9, fontWeight: 700, letterSpacing: ".12em", padding: "5px 18px", borderRadius: "0 0 10px 10px", whiteSpace: "nowrap" }}>
                        {plan.badge}
                      </div>
                    )}
                    <div style={{ marginBottom: 24, paddingTop: plan.badge ? 20 : 0 }}>
                      <div style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, color: plan.featured ? "var(--accent)" : "var(--muted)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 10 }}>{plan.name}</div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8, flexWrap: "wrap" }}>
                        <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(38px,6vw,56px)", color: "var(--text)", letterSpacing: "-.04em", lineHeight: 1 }}>{price}</span>
                        {period && <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-base)", color: "var(--muted)" }}>{period}</span>}
                      </div>
                      {billing === "annual" && plan.annualNote && (
                        <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "#C8FF00", marginBottom: 8, fontWeight: 600 }}>{plan.annualNote}</div>
                      )}
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-base)", color: "var(--muted)", lineHeight: 1.6 }}>{plan.tagline}</p>
                    </div>
                    <a href={ctaHref} className={plan.featured ? "btn-primary" : "btn-ghost"}
                      style={{ width: "100%", justifyContent: "center", marginBottom: plan.trialNote ? 8 : 24, display: "flex", boxSizing: "border-box" }}
                    >{plan.cta}</a>
                    {plan.trialNote && (
                      <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--muted-2)", textAlign: "center", marginBottom: 16 }}>{plan.trialNote}</div>
                    )}
                    <div style={{ borderTop: "1px solid rgba(200,255,0,0.08)", paddingTop: 16, flex: 1 }}>
                      {plan.features.map((f, fi) => (
                        <div key={fi} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 9 }}>
                          <span style={{ color: "var(--accent)", fontSize: 12, marginTop: 3, flexShrink: 0 }}>✓</span>
                          <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-base)", color: "var(--text)", lineHeight: 1.5 }}>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Feature comparison table */}
          <section style={{ padding: "0 var(--pad) var(--section)", maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "clamp(24px,4vw,40px)" }}>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700, color: "var(--accent)", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 12 }}>Compare plans</div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(24px,4vw,40px)", letterSpacing: "-.03em" }}>Everything, side by side.</h2>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-body)" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "14px 16px", fontSize: 12, fontWeight: 700, color: "var(--muted-2)", letterSpacing: ".08em", textTransform: "uppercase", borderBottom: "1px solid #1e1e1e" }}>Feature</th>
                    {["Free", "Pro", "Team"].map(col => (
                      <th key={col} style={{ textAlign: "center", padding: "14px 16px", fontSize: 13, fontWeight: 700, color: col === "Team" ? "var(--accent)" : "var(--text)", borderBottom: "1px solid #1e1e1e", minWidth: 100 }}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_ROWS.map((row, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(200,255,0,0.02)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <td style={{ padding: "12px 16px", fontSize: 14, color: "var(--muted)", lineHeight: 1.4 }}>{row.feature}</td>
                      <td style={{ padding: "12px 16px", textAlign: "center" }}><Check value={row.free} /></td>
                      <td style={{ padding: "12px 16px", textAlign: "center" }}><Check value={row.pro} /></td>
                      <td style={{ padding: "12px 16px", textAlign: "center" }}><Check value={row.team} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* FAQ */}
          <section style={{ padding: "0 var(--pad) var(--section)", maxWidth: 720, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "clamp(24px,4vw,40px)" }}>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700, color: "var(--accent)", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 12 }}>FAQ</div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(24px,4vw,36px)", letterSpacing: "-.03em" }}>Common questions.</h2>
            </div>
            {PRICING_FAQS.map((item, i) => (
              <div key={i} className="faq-item" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "clamp(12px,3vw,24px)" }}>
                  <div style={{ display: "flex", gap: "clamp(12px,2vw,18px)", alignItems: "center" }}>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, color: "rgba(200,255,0,.45)", letterSpacing: ".1em", flexShrink: 0, minWidth: 24 }}>{String(i + 1).padStart(2, "0")}</span>
                    <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(14px,2.5vw,17px)", fontWeight: 700, color: openFaq === i ? "var(--accent)" : "var(--text)", margin: 0, lineHeight: 1.4 }}>{item.q}</h3>
                  </div>
                  <span style={{ color: "var(--accent)", fontSize: "clamp(18px,2.5vw,22px)", flexShrink: 0, transition: "transform .2s", transform: openFaq === i ? "rotate(45deg)" : "none", display: "block" }}>+</span>
                </div>
                {openFaq === i && (
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-base)", color: "var(--muted)", lineHeight: 1.85, marginTop: 14, paddingLeft: "clamp(26px,4vw,42px)", animation: "fadeIn .25s ease" }}>
                    {item.a}
                  </p>
                )}
              </div>
            ))}
          </section>

          {/* Bottom CTA */}
          <section style={{ padding: "0 var(--pad) var(--section)", maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
            <div className="bc bc-feat" style={{ padding: "clamp(40px,6vw,72px) var(--pad)" }}>
              <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(24px,4vw,44px)", letterSpacing: "-.03em", marginBottom: 24 }}>
                Start generating now.<br /><span style={{ color: "var(--accent)" }}>No account needed.</span>
              </h2>
              <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                <motion.a href="/#generator" className="btn-primary"
                  whileHover={{ scale: 1.03, boxShadow: "0 0 24px rgba(200,255,0,0.35)" }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                  style={{ fontSize: 15, padding: "14px 32px" }}
                >Generate Now — Free →</motion.a>
                <motion.a href="/auth/signin?callbackUrl=/checkout?plan=team" className="btn-ghost"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  style={{ fontSize: 15, padding: "14px 32px" }}
                >Start Team Trial</motion.a>
              </div>
            </div>
          </section>

        </main>
        <Footer />
      </div>
    </>
  );
}
