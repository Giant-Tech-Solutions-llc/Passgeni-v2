// =============================================================
// PASSGENI — XML SITEMAP
// passgeni.ai/sitemap.xml
// =============================================================
// Auto-generates the sitemap including all guides and tools.
// Add a guide to content/guides.js → it appears here automatically.
// =============================================================

import { ALL_GUIDES } from "../content/guides.js";
import { ALL_POSTS }  from "../content/blog.js";
import { ALL_GLOSSARY_TERMS } from "../content/glossary.js";

const SITE_URL = "https://passgeni.ai";

const STATIC_PAGES = [
  { url: "/",                                  priority: "1.0",  changefreq: "weekly"  },
  { url: "/about",                             priority: "0.9",  changefreq: "monthly" },
  { url: "/pricing",                           priority: "0.9",  changefreq: "monthly" },
  { url: "/tools",                             priority: "0.9",  changefreq: "weekly"  },
  { url: "/guides",                            priority: "0.9",  changefreq: "weekly"  },
  { url: "/blog",                              priority: "0.8",  changefreq: "daily"   },
  { url: "/contact",                           priority: "0.6",  changefreq: "monthly" },
  { url: "/glossary",                          priority: "0.85", changefreq: "monthly" },
  { url: "/password-compliance-certificate",   priority: "0.95", changefreq: "monthly" },
  { url: "/tools/breach-checker",              priority: "0.85", changefreq: "monthly" },
  { url: "/tools/strength-checker",            priority: "0.85", changefreq: "monthly" },
  { url: "/tools/audit",                       priority: "0.8",  changefreq: "monthly" },
  { url: "/tools/policy-generator",            priority: "0.85", changefreq: "monthly" },
  { url: "/tools/secure-share",                priority: "0.8",  changefreq: "monthly" },
  { url: "/tools/compliance-fixer",            priority: "0.9",  changefreq: "monthly" },
  { url: "/refund",                            priority: "0.5",  changefreq: "monthly" },
  { url: "/privacy",                           priority: "0.5",  changefreq: "monthly" },
  { url: "/terms",                             priority: "0.5",  changefreq: "monthly" },
];

function buildSitemap() {
  const today = new Date().toISOString().split("T")[0];

  const staticEntries = STATIC_PAGES.map(({ url, priority, changefreq }) => `
  <url>
    <loc>${SITE_URL}${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join("");

  const blogEntries = ALL_POSTS.map((p) => `
  <url>
    <loc>${SITE_URL}/blog/${p.slug}</loc>
    <lastmod>${p.publishedAt}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join("");

  const guideEntries = ALL_GUIDES.map((g) => `
  <url>
    <loc>${SITE_URL}/guides/${g.slug}</loc>
    <lastmod>${g.updatedAt}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.75</priority>
  </url>`).join("");

  const glossaryEntries = ALL_GLOSSARY_TERMS.map((t) => `
  <url>
    <loc>${SITE_URL}/glossary/${t.slug}</loc>
    <lastmod>${t.updatedAt}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticEntries}
${guideEntries}
${glossaryEntries}
${blogEntries}
</urlset>`;
}

export default function Sitemap() {
  // This component never renders — getServerSideProps handles the response
  return null;
}

export async function getServerSideProps({ res }) {
  const sitemap = buildSitemap();

  res.setHeader("Content-Type", "text/xml");
  res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate");
  res.write(sitemap);
  res.end();

  return { props: {} };
}
