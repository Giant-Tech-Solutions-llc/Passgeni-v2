// =============================================================
// PASSGENI — SEO UTILITIES
// =============================================================
// Generates meta tags, Open Graph, Twitter cards,
// and Schema.org structured data for every page type.
// =============================================================

import { SITE } from "../content/copy.js";

// ─── DEFAULT META ─────────────────────────────────────────────

export function getDefaultMeta() {
  return {
    title:       `${SITE.name} — AI Password Generator | Zero Storage, Zero Knowledge`,
    description: SITE.description,
    canonical:   SITE.url,
    ogImage:     `${SITE.url}/og-image.png`,
  };
}

// ─── PAGE-SPECIFIC META ───────────────────────────────────────

export function getPageMeta(page) {
  const defaults = getDefaultMeta();
  const pages = {
    home: {
      ...defaults,
    },
    guides: {
      title:       `Security Guides — ${SITE.name}`,
      description: "Comprehensive guides on password security, compliance requirements, and credential best practices. HIPAA, PCI-DSS, SOC 2, ISO 27001, and more.",
      canonical:   `${SITE.url}/guides`,
    },
    blog: {
      title:       `Blog — ${SITE.name}`,
      description: "Password security news, tips, and analysis from the PassGeni team.",
      canonical:   `${SITE.url}/blog`,
    },
    tools: {
      title:       `Free Security Tools — ${SITE.name}`,
      description: "Free password security tools: breach checker, strength checker, password audit, policy generator, secure sharing, and WiFi QR generator.",
      canonical:   `${SITE.url}/tools`,
    },
    api: {
      title:       `API Documentation — ${SITE.name}`,
      description: "PassGeni REST API for developers. Generate secure passwords programmatically. Free tier 50 calls/day. Team plan 5,000 calls/day.",
      canonical:   `${SITE.url}/api`,
    },
  };

  return { ...defaults, ...(pages[page] || {}) };
}

// ─── GUIDE PAGE META ──────────────────────────────────────────

export function getGuideMeta(guide) {
  return {
    title:       `${guide.title} — ${SITE.name}`,
    description: guide.metaDescription || guide.excerpt,
    canonical:   `${SITE.url}/guides/${guide.slug}`,
    ogImage:     `${SITE.url}/og-image.png`,
    type:        "article",
    publishedAt: guide.publishedAt,
    updatedAt:   guide.updatedAt,
  };
}

// ─── SCHEMA MARKUP ───────────────────────────────────────────

export function getSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type":               "SoftwareApplication",
        "name":                SITE.name,
        "applicationCategory": "SecurityApplication",
        "operatingSystem":     "Web Browser",
        "url":                 SITE.url,
        "description":         SITE.description,
        "offers": {
          "@type":         "Offer",
          "price":         "0",
          "priceCurrency": "USD",
        },
        "featureList": [
          "AI-powered password generation",
          "Zero data retention",
          "NIST SP 800-63B compliance",
          "HIPAA, PCI-DSS, SOC 2 presets",
          "Post-quantum password mode",
          "Password DNA Score",
        ],
      },
      {
        "@type": "WebSite",
        "name":  SITE.name,
        "url":   SITE.url,
        "potentialAction": {
          "@type":       "SearchAction",
          "target":      `${SITE.url}/guides?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type":       "Organization",
        "name":        SITE.name,
        "url":         SITE.url,
        "logo":        `${SITE.url}/logo.png`,
        "contactPoint": {
          "@type":       "ContactPoint",
          "email":       SITE.email,
          "contactType": "customer support",
        },
      },
    ],
  };
}

export function getGuideSchema(guide) {
  return {
    "@context": "https://schema.org",
    "@type":    "Article",
    "headline": guide.title,
    "description": guide.metaDescription || guide.excerpt,
    "url":      `${SITE.url}/guides/${guide.slug}`,
    "datePublished": guide.publishedAt,
    "dateModified":  guide.updatedAt || guide.publishedAt,
    "author": {
      "@type": "Organization",
      "name":  SITE.name,
      "url":   SITE.url,
    },
    "publisher": {
      "@type": "Organization",
      "name":  SITE.name,
      "logo": {
        "@type": "ImageObject",
        "url":   `${SITE.url}/logo.png`,
      },
    },
  };
}

export function getFAQSchema(faqItems) {
  return {
    "@context": "https://schema.org",
    "@type":    "FAQPage",
    "mainEntity": (faqItems || []).map((item) => ({
      "@type":          "Question",
      "name":           item.q || item.question || "",
      "acceptedAnswer": {
        "@type": "Answer",
        "text":  item.a || item.answer || "",
      },
    })),
  };
}

export function getHowToSchema() {
  return {
    "@context": "https://schema.org",
    "@type":    "HowTo",
    "name":     "How to Generate a Secure Password with PassGeni",
    "description": "Generate a cryptographically secure, profession-aware password in under 3 seconds.",
    "step": [
      {
        "@type": "HowToStep",
        "name":  "Select your profession",
        "text":  "Choose your profession from the preset buttons or type a custom one. PassGeni extracts relevant seed words from your role.",
      },
      {
        "@type": "HowToStep",
        "name":  "Set your preferences",
        "text":  "Adjust length, symbols, numbers, and uppercase. Optionally select a compliance preset for HIPAA, PCI-DSS, SOC 2, ISO 27001, or DoD.",
      },
      {
        "@type": "HowToStep",
        "name":  "Generate and copy",
        "text":  "Click Generate. Your password is built entirely in your browser — nothing is sent to any server. Copy it to your clipboard.",
      },
    ],
  };
}
