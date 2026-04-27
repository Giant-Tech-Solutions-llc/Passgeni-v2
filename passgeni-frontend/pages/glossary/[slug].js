// =============================================================
// PASSGENI — GLOSSARY PAGE TEMPLATE
// passgeni.ai/glossary/[slug]
// =============================================================
// Renders a single glossary term page.
// Content sourced from content/glossary.js
// =============================================================

import { motion } from "framer-motion";
import { btnPrimary } from "../../lib/motion.js";
import PageLayout from "../../components/layout/PageLayout.js";
import { ALL_GLOSSARY_TERMS, getTermBySlug, getRelatedTerms } from "../../content/glossary.js";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function GlossaryTermPage({ term, relatedTermObjects }) {
  if (!term) return null;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "DefinedTerm",
        "@id": `https://passgeni.ai/glossary/${term.slug}`,
        "name": term.term,
        "description": term.definition,
        "inDefinedTermSet": {
          "@type": "DefinedTermSet",
          "name": "PassGeni Security Glossary",
          "url": "https://passgeni.ai/glossary",
        },
        "url": `https://passgeni.ai/glossary/${term.slug}`,
      },
      {
        "@type": "Article",
        "headline": term.metaTitle,
        "description": term.metaDescription,
        "url": `https://passgeni.ai/glossary/${term.slug}`,
        "datePublished": term.publishedAt,
        "dateModified": term.updatedAt,
        "author": { "@type": "Organization", "name": "PassGeni" },
        "publisher": {
          "@type": "Organization",
          "name": "PassGeni",
          "url": "https://passgeni.ai",
        },
      },
      {
        "@type": "FAQPage",
        "mainEntity": (term.faq || []).map(({ q, a }) => ({
          "@type": "Question",
          "name": q,
          "acceptedAnswer": { "@type": "Answer", "text": a },
        })),
      },
    ],
  };

  return (
    <PageLayout
      title={term.metaTitle}
      description={term.metaDescription}
      canonical={`https://passgeni.ai/glossary/${term.slug}`}
      schema={schema}
    >
      <main>
        <section style={{ maxWidth: 800, margin: "0 auto", padding: "64px var(--page-pad) 0" }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}>
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" style={{ marginBottom: 28 }}>
              <a href="/" style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#555", textDecoration: "none" }}>PassGeni</a>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#333", margin: "0 8px" }}>→</span>
              <a href="/glossary" style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#555", textDecoration: "none" }}>Glossary</a>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#333", margin: "0 8px" }}>→</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#C8FF00" }}>{term.term}</span>
            </nav>

            {/* Badge */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: term.badgeColor, background: `${term.badgeColor}15`, border: `1px solid ${term.badgeColor}33`, borderRadius: 100, padding: "3px 12px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                {term.badge}
              </span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#444" }}>
                {term.readTime} min · Updated {new Date(term.updatedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </span>
            </div>

            {/* Term heading */}
            <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(30px,4.5vw,50px)", color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.08, marginBottom: 20 }}>
              {term.term}
            </h1>

            {/* Excerpt */}
            <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(16px,1.6vw,18px)", color: "#888", lineHeight: 1.85, marginBottom: 0, maxWidth: 600 }}>
              {term.excerpt}
            </p>
          </motion.div>

          {/* Definition box */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            style={{ border: "1px solid rgba(200,255,0,0.2)", background: "rgba(200,255,0,0.04)", borderRadius: 14, padding: "22px 28px", margin: "36px 0 48px" }}
          >
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#C8FF0066", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12 }}>
              Definition
            </div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 16, color: "#ccc", lineHeight: 1.85, margin: 0 }}>
              {term.definition}
            </p>
            {term.formula && (
              <div style={{ marginTop: 18, background: "#050507", border: "1px solid #1a1a1a", borderRadius: 8, padding: "14px 18px" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 16, color: "#C8FF00", marginBottom: 6 }}>{term.formula}</div>
                {term.formulaExplained && (
                  <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#666", lineHeight: 1.7 }}>{term.formulaExplained}</div>
                )}
              </div>
            )}
          </motion.div>
        </section>

        {/* Article body */}
        <section style={{ maxWidth: 800, margin: "0 auto", padding: "0 var(--page-pad)" }}>
          {(term.sections || []).map((section, i) => (
            <motion.div
              key={section.heading}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              style={{ marginBottom: 40 }}
            >
              <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(18px,2.5vw,24px)", color: "#fff", letterSpacing: "-0.02em", marginBottom: 14, scrollMarginTop: 80 }}>
                {section.heading}
              </h2>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(14px,1.5vw,16px)", color: "#888", lineHeight: 1.9, margin: 0 }}>
                {section.body}
              </p>
            </motion.div>
          ))}

          {/* Related tools */}
          {term.relatedTools?.length > 0 && (
            <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} style={{ marginBottom: 48 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#555", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16 }}>
                Tools
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {term.relatedTools.map(({ label, href }) => (
                  <a key={href} href={href} style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#C8FF00", background: "rgba(200,255,0,0.06)", border: "1px solid rgba(200,255,0,0.2)", borderRadius: 8, padding: "8px 14px", textDecoration: "none", transition: "background 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(200,255,0,0.1)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(200,255,0,0.06)"}
                  >
                    {label} →
                  </a>
                ))}
              </div>
            </motion.section>
          )}

          {/* FAQ */}
          {term.faq?.length > 0 && (
            <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} style={{ marginBottom: 64 }}>
              <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(20px,2.5vw,26px)", color: "#fff", letterSpacing: "-0.02em", marginBottom: 28 }}>
                Frequently asked questions
              </h2>
              {term.faq.map(({ q, a }, i) => (
                <div key={i} style={{ borderBottom: "1px solid #141416", padding: "20px 0" }}>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "clamp(14px,1.6vw,16px)", color: "#ddd", marginBottom: 10, lineHeight: 1.4 }}>{q}</h3>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(13px,1.4vw,15px)", color: "#777", lineHeight: 1.9, margin: 0 }}>{a}</p>
                </div>
              ))}
            </motion.section>
          )}

          {/* Related guides */}
          {term.relatedGuides?.length > 0 && (
            <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} style={{ marginBottom: 48 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#555", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16 }}>
                Related guides
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {term.relatedGuides.map(({ label, href }) => (
                  <a key={href} href={href} style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#888", textDecoration: "none", display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "#0a0a0c", border: "1px solid #141416", borderRadius: 8, transition: "color 0.15s, border-color 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.color = "#C8FF00"; e.currentTarget.style.borderColor = "#C8FF0033"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "#888"; e.currentTarget.style.borderColor = "#141416"; }}
                  >
                    <span style={{ color: "#333" }}>→</span>
                    {label}
                  </a>
                ))}
              </div>
            </motion.section>
          )}

          {/* Related terms */}
          {relatedTermObjects?.length > 0 && (
            <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} style={{ marginBottom: 64 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#555", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16 }}>
                Related terms
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
                {relatedTermObjects.map(t => (
                  <a key={t.slug} href={`/glossary/${t.slug}`} style={{ display: "block", background: "#0a0a0c", border: "1px solid #141416", borderRadius: 10, padding: "16px 18px", textDecoration: "none", transition: "border-color 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "#C8FF0033"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "#141416"}
                  >
                    <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 14, color: "#C8FF00", marginBottom: 4 }}>{t.term}</div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#555", lineHeight: 1.5 }}>{t.excerpt.slice(0, 80)}…</div>
                  </a>
                ))}
              </div>
            </motion.section>
          )}
        </section>

        {/* CTA */}
        <section style={{ maxWidth: 800, margin: "0 auto 80px", padding: "0 var(--page-pad)" }}>
          <div style={{ background: "#0a0a0c", border: "1px solid #C8FF0022", borderRadius: 16, padding: "36px 40px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
              <div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#C8FF0066", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 10 }}>
                  Put it into practice
                </div>
                <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(18px,2.5vw,24px)", color: "#fff", marginBottom: 8, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                  Generate a compliant credential.
                </h2>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#666", lineHeight: 1.75 }}>
                  Free. Client-side. Zero storage.
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
                <motion.a href="/tools/compliance-fixer" className="btn-primary" {...btnPrimary} style={{ fontSize: 14, padding: "12px 24px", whiteSpace: "nowrap" }}>
                  Check compliance →
                </motion.a>
                <a href="/password-compliance-certificate" style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#444", textDecoration: "none", textAlign: "center", letterSpacing: "0.08em" }}>
                  What is a compliance certificate? →
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </PageLayout>
  );
}

export async function getStaticPaths() {
  const paths = ALL_GLOSSARY_TERMS.map((t) => ({ params: { slug: t.slug } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const term = getTermBySlug(params.slug);
  if (!term) return { notFound: true };

  const relatedTermObjects = getRelatedTerms(term.relatedTerms || []);

  return {
    props: {
      term,
      relatedTermObjects,
    },
  };
}
