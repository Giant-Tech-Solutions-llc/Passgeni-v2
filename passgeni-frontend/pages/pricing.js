import Head from "next/head";
import { useState } from "react";
import { motion } from "framer-motion";
import Header from "../components/layout/Header.js";
import Footer from "../components/layout/Footer.js";
import { btnPrimary, btnGhost, heroEntrance, sectionHeadReveal, bcCard } from "../lib/motion.js";
import { IcCheck, IcStar } from "../lib/icons.js";

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
      "Unlimited password generation",
      "NIST SP 800-63B compliance standard",
      "3 compliance certificates per month",
      "Certificate sharing + QR codes",
      "Post-Quantum mode (1/day)",
      "k-Anonymity breach check",
      "Secure password sharing",
      "Zero data retention — always",
    ],
  },
  {
    name: "Assurance",
    monthly: "$19",
    annual: "$179",
    period: "/month",
    annualPeriod: "/year",
    annualNote: "Save 21%",
    tagline: "For security professionals who certify daily and need full compliance coverage.",
    cta: "Start 14-day free trial",
    ctaMonthly: "/auth/signin?callbackUrl=%2Fcheckout%3Fplan%3Dassurance%26billing%3Dmonthly",
    ctaAnnual: "/auth/signin?callbackUrl=%2Fcheckout%3Fplan%3Dassurance%26billing%3Dannual",
    badge: "Most Popular",
    featured: true,
    trialNote: "14 days free — no card required",
    features: [
      "Unlimited compliance certificates",
      "All 6 standards: HIPAA · PCI-DSS · SOC 2 · ISO 27001 · NIST · FIPS 140-3",
      "Certificate verification page + QR codes",
      "REST API — 1,000 calls/day",
      "Bulk generator — 50 at once",
      "Priority support",
    ],
  },
  {
    name: "Authority",
    monthly: "$59",
    annual: "$539",
    period: "/month",
    annualPeriod: "/year",
    annualNote: "Save 24%",
    tagline: "For compliance teams and enterprises that need API scale, audit logs, and team seats.",
    cta: "Start 14-day free trial",
    ctaMonthly: "/auth/signin?callbackUrl=%2Fcheckout%3Fplan%3Dauthority%26billing%3Dmonthly",
    ctaAnnual: "/auth/signin?callbackUrl=%2Fcheckout%3Fplan%3Dauthority%26billing%3Dannual",
    featured: false,
    trialNote: "14 days free — no card required",
    features: [
      "Everything in Assurance",
      "REST API — 10,000 calls/day",
      "Bulk generator — 500 at once",
      "10 team seats",
      "CSV export + full audit logs",
      "Password policy generator",
      "Rotation reminders",
      "Dedicated support channel",
    ],
  },
  {
    name: "Enterprise",
    monthly: "Custom",
    annual: "Custom",
    period: "",
    tagline: "For large orgs needing unlimited scale, SSO, and a dedicated compliance partner.",
    cta: "Contact us",
    ctaHref: "/contact",
    featured: false,
    features: [
      "Everything in Authority",
      "Unlimited API calls",
      "Unlimited team seats",
      "SSO / SAML",
      "On-premise deployment option",
      "Dedicated Slack channel",
      "Custom SLA",
      "Invoice billing via Paddle",
    ],
  },
];

const COMPARISON_ROWS = [
  { feature: "Compliance certificates/mo",  free: "3",    assurance: "Unlimited", authority: "Unlimited" },
  { feature: "Compliance standards",        free: "NIST", assurance: "All 6",     authority: "All 6" },
  { feature: "Certificate verification page", free: true, assurance: true,        authority: true },
  { feature: "QR code + shareable URL",     free: true,   assurance: true,        authority: true },
  { feature: "Post-Quantum mode",           free: "1/day", assurance: true,       authority: true },
  { feature: "k-Anonymity breach check",    free: true,   assurance: true,        authority: true },
  { feature: "Secure password sharing",     free: true,   assurance: true,        authority: true },
  { feature: "REST API",                    free: false,  assurance: "1,000/day", authority: "10,000/day" },
  { feature: "Bulk generator",              free: false,  assurance: "50",        authority: "500" },
  { feature: "CSV export",                  free: false,  assurance: false,       authority: true },
  { feature: "Audit logs",                  free: false,  assurance: false,       authority: true },
  { feature: "Team seats",                  free: "1",    assurance: "1",         authority: "10" },
  { feature: "Password policy generator",   free: false,  assurance: false,       authority: true },
  { feature: "Rotation reminders",          free: false,  assurance: false,       authority: true },
  { feature: "Zero data retention",         free: true,   assurance: true,        authority: true },
  { feature: "14-day free trial",           free: false,  assurance: true,        authority: true },
  { feature: "Priority support",            free: false,  assurance: true,        authority: "Dedicated" },
];

const PRICING_FAQS = [
  { q: "Can I cancel anytime?", a: "Yes. Cancel from your billing portal at any time — no questions asked. Annual plans receive a prorated refund for unused months." },
  { q: "Is the 14-day trial really free?", a: "Completely free — no credit card required. You get full Assurance or Authority access for 14 days. If you don't upgrade, your account reverts to the Free plan automatically." },
  { q: "What payment methods do you accept?", a: "All major credit and debit cards (Visa, Mastercard, Amex), Apple Pay, and Google Pay — processed securely via Paddle." },
  { q: "Can I upgrade from Assurance to Authority?", a: "Yes. Upgrade anytime from your dashboard. We prorate the difference so you only pay for what you use going forward." },
  { q: "Is there an annual discount?", a: "Assurance annual saves 21% ($179/yr vs $228). Authority annual saves 24% ($539/yr vs $708). Billed once per year." },
  { q: "Do you store passwords on the server?", a: "Never. All password generation happens in your browser. Only the compliance parameters (length, character classes, entropy) are sent to our servers to generate the certificate. The actual password is never transmitted." },
  { q: "What compliance standards are included?", a: "Assurance and Authority include all 6 standards: NIST SP 800-63B, HIPAA §164.312, PCI-DSS v4.0, SOC 2 CC6.1, ISO/IEC 27001:2022, and FIPS PUB 140-3. Free users get NIST only." },
  { q: "What is a compliance certificate?", a: "A cryptographically signed ES256 JWT that attests your password met a specific compliance standard's requirements at the time of generation. Each certificate has a unique verification URL you can share with auditors." },
];

function Check({ value }) {
  if (value === true) return <IcCheck size={13} color="#C8FF00" />;
  if (value === false) return <span style={{ color: "#2a2a2a", fontSize: 14, fontWeight: 700 }}>—</span>;
  return <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#aaa" }}>{value}</span>;
}

export default function PricingPage() {
  const [billing, setBilling] = useState("monthly");
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <>
      <Head>
        <title>Pricing — PassGeni | Free, Assurance & Authority Plans</title>
        <meta name="description" content="PassGeni pricing: Free forever, Assurance at $19/month, Authority at $59/month. Unlimited compliance certificates, REST API, team seats, and 14-day free trial." />
        <link rel="canonical" href="https://passgeni.ai/pricing" />
        <meta property="og:title" content="PassGeni Pricing — Free, Assurance & Authority" />
        <meta property="og:description" content="Start free. Upgrade when you need unlimited certificates, all 6 compliance standards, REST API, or team seats." />
      </Head>
      <div style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
        <Header />
        <main style={{ paddingTop: 80 }}>

          {/* Hero */}
          <section style={{ padding: "var(--section) var(--pad)", maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
            <div className="eyebrow" style={{ justifyContent: "center" }}>Pricing</div>
            <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(36px,6vw,68px)", letterSpacing: "-.03em", lineHeight: 1.05, marginBottom: 18 }}>
              Free forever.<br /><span style={{ color: "var(--accent)" }}>Upgrade when you need more.</span>
            </h1>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(16px,1.6vw,18px)", color: "var(--muted)", maxWidth: 500, margin: "0 auto 36px", lineHeight: 1.85 }}>
              No credit card for the free plan. No card for the Team trial. Pay only when you're ready.
            </p>
            </motion.div>

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
              {PLANS.map((plan, pi) => {
                const price = billing === "annual" && plan.annual !== "Custom" ? plan.annual : plan.monthly;
                const period = billing === "annual" && plan.annualPeriod ? plan.annualPeriod : plan.period;
                const ctaHref = plan.ctaHref
                  ? plan.ctaHref
                  : (billing === "annual" ? plan.ctaAnnual : plan.ctaMonthly);
                return (
                  <motion.div
                    key={plan.name}
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.5, delay: pi * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    style={{
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
                    <motion.a href={ctaHref} className={plan.featured ? "btn-primary" : "btn-ghost"}
                      {...(plan.featured ? btnPrimary : btnGhost)}
                      style={{ width: "100%", justifyContent: "center", marginBottom: plan.trialNote ? 8 : 24, display: "flex", boxSizing: "border-box" }}
                    >{plan.cta}</motion.a>
                    {plan.trialNote && (
                      <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--muted-2)", textAlign: "center", marginBottom: 16 }}>{plan.trialNote}</div>
                    )}
                    <div style={{ borderTop: "1px solid rgba(200,255,0,0.08)", paddingTop: 16, flex: 1 }}>
                      {plan.features.map((f, fi) => (
                        <div key={fi} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 9 }}>
                          <IcCheck size={11} color="var(--accent)" />
                          <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-base)", color: "var(--text)", lineHeight: 1.5 }}>{f}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* Feature comparison table */}
          <section style={{ padding: "0 var(--pad) var(--section)", maxWidth: 1200, margin: "0 auto" }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{ textAlign: "center", marginBottom: "clamp(24px,4vw,48px)" }}
            >
              <div className="eyebrow" style={{ justifyContent: "center" }}>Compare plans</div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(26px,4vw,42px)", letterSpacing: "-.03em" }}>Everything, side by side.</h2>
            </motion.div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-body)" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "14px 16px", fontSize: 12, fontWeight: 700, color: "var(--muted-2)", letterSpacing: ".08em", textTransform: "uppercase", borderBottom: "1px solid #1e1e1e" }}>Feature</th>
                    {["Free", "Assurance", "Authority"].map(col => (
                      <th key={col} style={{ textAlign: "center", padding: "14px 16px", fontSize: 13, fontWeight: 700, color: col === "Authority" ? "var(--accent)" : "var(--text)", borderBottom: "1px solid #1e1e1e", minWidth: 100 }}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_ROWS.map((row, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(200,255,0,0.02)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <td style={{ padding: "12px 16px", fontSize: "clamp(13px,1.4vw,15px)", color: "var(--muted)", lineHeight: 1.45 }}>{row.feature}</td>
                      <td style={{ padding: "12px 16px", textAlign: "center" }}><Check value={row.free} /></td>
                      <td style={{ padding: "12px 16px", textAlign: "center" }}><Check value={row.assurance} /></td>
                      <td style={{ padding: "12px 16px", textAlign: "center" }}><Check value={row.authority} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* FAQ */}
          <section style={{ padding: "0 var(--pad) var(--section)", maxWidth: 720, margin: "0 auto" }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{ textAlign: "center", marginBottom: "clamp(24px,4vw,48px)" }}
            >
              <div className="eyebrow" style={{ justifyContent: "center" }}>FAQ</div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(26px,4vw,38px)", letterSpacing: "-.03em" }}>Common questions.</h2>
            </motion.div>
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
                  {...btnPrimary}
                  style={{ fontSize: 15, padding: "14px 32px" }}
                >Generate Now — Free →</motion.a>
                <motion.a href="/auth/signin?callbackUrl=%2Fcheckout%3Fplan%3Dassurance%26billing%3Dmonthly" className="btn-ghost"
                  {...btnGhost}
                  style={{ fontSize: 15, padding: "14px 32px" }}
                >Start Free Trial</motion.a>
              </div>
            </div>
          </section>

          {/* ── SEO: Compliance guides ──────────────────────── */}
          <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 var(--page-pad) 64px" }}>
            <div style={{ borderTop: "1px solid rgba(200,255,0,0.07)", paddingTop: 40 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "rgba(200,255,0,0.3)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 20 }}>
                Compliance resources
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[
                  { href: "/password-compliance-certificate", label: "What is a compliance certificate?" },
                  { href: "/guides/hipaa-password-requirements", label: "HIPAA requirements" },
                  { href: "/guides/pci-dss-password-requirements", label: "PCI-DSS v4.0" },
                  { href: "/guides/soc2-password-requirements", label: "SOC 2 CC6.1" },
                  { href: "/guides/nist-800-63b-password-guidelines", label: "NIST 800-63B" },
                  { href: "/guides/iso-27001-password-requirements", label: "ISO 27001" },
                  { href: "/glossary/password-compliance", label: "Password compliance glossary" },
                  { href: "/glossary/audit-trail", label: "Audit trail glossary" },
                ].map(({ href, label }) => (
                  <a key={href} href={href} style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "rgba(255,255,255,0.3)", textDecoration: "none", padding: "7px 12px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 7, transition: "color 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.color = "rgba(200,255,0,0.7)"}
                    onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.3)"}
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </section>

        </main>
        <Footer />
      </div>
    </>
  );
}
