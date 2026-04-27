// =============================================================
// PASSGENI — GLOSSARY INDEX PAGE
// passgeni.ai/glossary
// =============================================================

import { motion } from "framer-motion";
import PageLayout from "../../components/layout/PageLayout.js";
import { ALL_GLOSSARY_TERMS } from "../../content/glossary.js";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] },
  }),
};

const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "DefinedTermSet",
  "name": "PassGeni Security Glossary",
  "description": "Definitions of key password security, compliance, and credential management terms — entropy, authentication policy, credential security, password compliance, audit trail.",
  "url": "https://passgeni.ai/glossary",
  "hasPart": ALL_GLOSSARY_TERMS.map(t => ({
    "@type": "DefinedTerm",
    "name": t.term,
    "description": t.definition,
    "url": `https://passgeni.ai/glossary/${t.slug}`,
  })),
};

export default function GlossaryIndexPage() {
  return (
    <PageLayout
      title="Password Security Glossary — Entropy, Compliance, Credentials | PassGeni"
      description="Definitions of key password security and compliance terms: entropy, authentication policy, credential security, password compliance, and audit trail. Written for security professionals and compliance teams."
      canonical="https://passgeni.ai/glossary"
      schema={SCHEMA}
    >
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "72px var(--page-pad) 120px" }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} style={{ marginBottom: 64 }}>
          <nav aria-label="Breadcrumb" style={{ marginBottom: 24 }}>
            <a href="/" style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#555", textDecoration: "none" }}>PassGeni</a>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#333", margin: "0 8px" }}>→</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#C8FF00" }}>Glossary</span>
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ width: 18, height: 1, background: "#C8FF00", opacity: 0.5, display: "block" }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#C8FF00", letterSpacing: "0.2em", textTransform: "uppercase" }}>
              {ALL_GLOSSARY_TERMS.length} terms defined
            </span>
          </div>

          <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(36px,5vw,58px)", color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: 18 }}>
            Security glossary.
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(16px,1.6vw,18px)", color: "#888", lineHeight: 1.85, maxWidth: 520, margin: 0 }}>
            Precise definitions of password security and compliance terms. Written for security teams, compliance officers, and developers — not marketing.
          </p>
        </motion.div>

        {/* Terms grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
          {ALL_GLOSSARY_TERMS.map((term, i) => (
            <motion.a
              key={term.slug}
              href={`/glossary/${term.slug}`}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              style={{ display: "block", background: "#0a0a0c", border: "1px solid #141416", borderRadius: 14, padding: "24px 26px", textDecoration: "none", transition: "border-color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#C8FF0033"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#141416"}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: term.badgeColor, background: `${term.badgeColor}15`, border: `1px solid ${term.badgeColor}33`, borderRadius: 100, padding: "3px 10px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  {term.badge}
                </span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#333" }}>{term.readTime} min</span>
              </div>

              <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(16px,1.8vw,20px)", color: "#fff", letterSpacing: "-0.02em", marginBottom: 10, lineHeight: 1.3 }}>
                {term.term}
              </h2>

              <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#666", lineHeight: 1.75, margin: 0 }}>
                {term.excerpt}
              </p>

              <div style={{ marginTop: 18, display: "flex", gap: 6, flexWrap: "wrap" }}>
                {(term.relatedTerms || []).slice(0, 3).map(slug => (
                  <span key={slug} style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#444", background: "#111", border: "1px solid #1a1a1a", borderRadius: 4, padding: "2px 8px", letterSpacing: "0.06em" }}>
                    {slug.replace(/-/g, " ")}
                  </span>
                ))}
              </div>
            </motion.a>
          ))}
        </div>

        {/* Related resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          style={{ marginTop: 80, padding: "36px 40px", background: "#0a0a0c", border: "1px solid #141416", borderRadius: 16 }}
        >
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#555", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 16 }}>
            Go deeper
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[
              { href: "/guides", label: "Compliance guides" },
              { href: "/tools", label: "Free security tools" },
              { href: "/password-compliance-certificate", label: "What is a compliance certificate?" },
              { href: "/tools/compliance-fixer", label: "Check your credentials" },
            ].map(({ href, label }) => (
              <a key={href} href={href} style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#888", textDecoration: "none", padding: "8px 14px", background: "#050507", border: "1px solid #1a1a1a", borderRadius: 8, transition: "color 0.15s, border-color 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#C8FF00"; e.currentTarget.style.borderColor = "#C8FF0033"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "#888"; e.currentTarget.style.borderColor = "#1a1a1a"; }}
              >
                {label} →
              </a>
            ))}
          </div>
        </motion.div>

      </main>
    </PageLayout>
  );
}
