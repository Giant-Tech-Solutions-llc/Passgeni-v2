// =============================================================
// PASSGENI — GUIDES INDEX PAGE
// passgeni.ai/guides
// =============================================================

import { motion } from "framer-motion";
import { btnPrimary } from "../../lib/motion.js";
import PageLayout from "../../components/layout/PageLayout.js";
import { COMPLIANCE_GUIDES, PROFESSION_GUIDES, CONCEPT_GUIDES, COMPARISON_GUIDES } from "../../content/guides.js";

const TIERS = [
  { label: "Compliance Frameworks",   guides: COMPLIANCE_GUIDES,  desc: "Exact requirements for HIPAA, PCI-DSS, SOC 2, ISO 27001, NIST 800-63B, and FIPS 140-3. Primary sources only — no guessing." },
  { label: "By Profession",           guides: PROFESSION_GUIDES,  desc: "Password security and compliance tailored to your role — healthcare, legal, DevOps, SRE, security engineering, and more." },
  { label: "Core Concepts",           guides: CONCEPT_GUIDES,     desc: "Entropy, compliance certificates, auditor proof, passphrases, zero-knowledge, and post-quantum — explained with the math." },
  { label: "Comparisons & Rankings",  guides: COMPARISON_GUIDES,  desc: "Head-to-head comparisons and ranked lists to help you choose the right tool for generation, storage, and certification." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] } }),
};

function GuideCard({ guide, index }) {
  return (
    <motion.a
      href={`/guides/${guide.slug}`}
      className="bc bc-a"
      custom={index}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      style={{ display: "flex", flexDirection: "column", textDecoration: "none", minHeight: 140 }}
    >
      <div className="bc-line" />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: guide.badgeColor, background: `${guide.badgeColor}15`, border: `1px solid ${guide.badgeColor}33`, borderRadius: 100, padding: "3px 10px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          {guide.badge}
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted-2)" }}>
          {guide.readTime} min
        </span>
      </div>
      <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "clamp(14px,1.5vw,16px)", color: "var(--text)", lineHeight: 1.4, marginBottom: 10, flex: 1 }}>
        {guide.title}
      </h3>
      <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)", lineHeight: 1.75, margin: 0 }}>
        {guide.excerpt.slice(0, 100)}…
      </p>
    </motion.a>
  );
}

const schema = {
  "@context":    "https://schema.org",
  "@type":       "CollectionPage",
  "name":        "Password Security & Compliance Guides — PassGeni",
  "description": "Comprehensive guides on password security, compliance certificates, and credential best practices. HIPAA, PCI-DSS, SOC 2, ISO 27001, NIST 800-63B, FIPS 140-3, and compliance audit evidence.",
  "url":         "https://passgeni.ai/guides",
};

export default function GuidesIndexPage() {
  const totalGuides = COMPLIANCE_GUIDES.length + PROFESSION_GUIDES.length + CONCEPT_GUIDES.length + COMPARISON_GUIDES.length;

  return (
    <PageLayout
      title="Password Security & Compliance Guides — HIPAA, NIST, SOC 2, FIPS 140-3 | PassGeni"
      description="Reference-grade guides on password compliance: HIPAA, PCI-DSS v4.0, SOC 2, ISO 27001, NIST 800-63B, FIPS 140-3. Plus compliance certificates, audit evidence, and role-specific playbooks."
      canonical="https://passgeni.ai/guides"
      schema={schema}
    >
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "80px var(--page-pad) 120px" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: 80 }}
        >
          <nav aria-label="Breadcrumb" style={{ marginBottom: 24 }}>
            <a href="/" style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--muted-2)", textDecoration: "none", transition: "color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--muted)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--muted-2)"}
            >PassGeni</a>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--border-2)", margin: "0 8px" }}>→</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent)" }}>Guides</span>
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <span style={{ display: "block", width: 18, height: 1, background: "var(--accent)", opacity: 0.6 }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--accent)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
              {totalGuides} guides · updated regularly
            </span>
          </div>

          <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(36px,5.5vw,64px)", color: "#fff", letterSpacing: "-0.03em", marginBottom: 20, lineHeight: 1.05 }}>
            Security guides.<br /><span style={{ color: "var(--accent)" }}>Written to rank.</span>
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(16px,1.6vw,18px)", color: "var(--muted)", maxWidth: 540, lineHeight: 1.85, margin: 0 }}>
            Comprehensive, reference-grade guides on password security. Every guide cites primary sources — NIST, HHS, PCI Council, ISO. No filler. No guessing.
          </p>
        </motion.div>

        {/* Tiers */}
        {TIERS.map((tier, ti) => (
          <section key={tier.label} style={{ marginBottom: 72 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{ marginBottom: 28 }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(18px,2.5vw,26px)", color: "#fff", letterSpacing: "-0.02em" }}>
                  {tier.label}
                </h2>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--muted-2)" }}>
                  {tier.guides.length} guides
                </span>
              </div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(14px,1.5vw,16px)", color: "var(--muted)", margin: 0, lineHeight: 1.75 }}>
                {tier.desc}
              </p>
            </motion.div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
              {tier.guides.map((g, i) => <GuideCard key={g.slug} guide={g} index={i} />)}
            </div>
          </section>
        ))}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="bc bc-feat"
          style={{ textAlign: "center", padding: "48px 40px" }}
        >
          <div className="bc-line" />
          <div className="eyebrow" style={{ justifyContent: "center" }}>More coming weekly</div>
          <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(22px,3vw,30px)", color: "#fff", marginBottom: 14, letterSpacing: "-0.02em" }}>
            Can't find what you're looking for?
          </h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(14px,1.5vw,16px)", color: "var(--muted)", marginBottom: 28, maxWidth: 440, margin: "0 auto 28px", lineHeight: 1.8 }}>
            We publish new guides weekly. Join the list and we'll email you when guides relevant to your industry go live.
          </p>
          <motion.a href="/#waitlist" className="btn-primary" {...btnPrimary} style={{ fontSize: 14, padding: "13px 28px" }}>
            Get notified →
          </motion.a>
        </motion.div>

      </main>
    </PageLayout>
  );
}
