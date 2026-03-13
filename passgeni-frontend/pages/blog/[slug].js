// =============================================================
// PASSGENI — BLOG POST PAGE TEMPLATE
// passgeni.ai/blog/[slug]
// =============================================================

import PageLayout from "../../components/layout/PageLayout.js";
import { ALL_POSTS, getPostBySlug, getRelatedPosts } from "../../content/blog.js";
import { getFAQSchema } from "../../seo/schema.js";

function PostMeta({ post }) {
  return (
    <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap", marginBottom: 32 }}>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: post.categoryColor, background: `${post.categoryColor}15`, border: `1px solid ${post.categoryColor}33`, borderRadius: 100, padding: "4px 12px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
        {post.categoryLabel}
      </span>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#555" }}>
        {new Date(post.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
      </span>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#555" }}>
        {post.readTime} min read
      </span>
    </div>
  );
}

function BlogFAQ({ items }) {
  if (!items?.length) return null;
  return (
    <section aria-label="Frequently asked questions" style={{ marginTop: 56, paddingTop: 40, borderTop: "1px solid #141416" }}>
      <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 22, color: "#fff", marginBottom: 28, letterSpacing: "-0.02em" }}>
        Frequently asked questions
      </h2>
      {items.map(({ q, a }, i) => (
        <div key={i} style={{ borderBottom: "1px solid #111", padding: "18px 0" }}>
          <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 16, color: "#fff", marginBottom: 8 }}>{q}</h3>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "#aaa", lineHeight: 1.8, margin: 0 }}>{a}</p>
        </div>
      ))}
    </section>
  );
}

function RelatedPosts({ posts }) {
  if (!posts?.length) return null;
  return (
    <section style={{ marginTop: 64, paddingTop: 40, borderTop: "1px solid #141416" }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>More posts</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {posts.map((p) => (
          <a key={p.slug} href={`/blog/${p.slug}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", background: "#0a0a0c", border: "1px solid #141416", borderRadius: 10, textDecoration: "none", transition: "border-color 0.2s", gap: 16 }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#C8FF0033")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#141416")}
          >
            <span style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#ccc" }}>{p.title}</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#C8FF00", flexShrink: 0 }}>{p.readTime} min →</span>
          </a>
        ))}
      </div>
    </section>
  );
}

export default function BlogPostPage({ post, related, contentHtml }) {
  if (!post) {
    return (
      <PageLayout title="Post Not Found | PassGeni" description="" canonical="https://passgeni.ai/blog">
        <div style={{ maxWidth: 760, margin: "120px auto", padding: "0 var(--page-pad)", textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 40, color: "#fff", marginBottom: 16 }}>404</div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 16, color: "#888" }}>This post doesn't exist.</p>
          <a href="/blog" className="btn-primary" style={{ marginTop: 24, display: "inline-flex" }}>← All posts</a>
        </div>
      </PageLayout>
    );
  }

  const schema = [
    {
      "@context": "https://schema.org", "@type": "BlogPosting",
      "headline": post.title, "description": post.metaDescription,
      "url": `https://passgeni.ai/blog/${post.slug}`,
      "datePublished": post.publishedAt, "dateModified": post.publishedAt,
      "author": { "@type": "Organization", "name": "PassGeni", "url": "https://passgeni.ai" },
      "publisher": { "@type": "Organization", "name": "PassGeni", "logo": { "@type": "ImageObject", "url": "https://passgeni.ai/logo.png" } },
    },
    ...(post.faq?.length ? [getFAQSchema(post.faq)] : []),
  ];

  return (
    <PageLayout title={post.metaTitle} description={post.metaDescription} canonical={`https://passgeni.ai/blog/${post.slug}`} schema={schema}>
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "60px var(--page-pad) 80px" }}>
        <nav aria-label="Breadcrumb" style={{ marginBottom: 28 }}>
          <a href="/" style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#888", textDecoration: "none" }}>PassGeni</a>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#444", margin: "0 8px" }}>→</span>
          <a href="/blog" style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#888", textDecoration: "none" }}>Blog</a>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#444", margin: "0 8px" }}>→</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#C8FF00" }}>{post.categoryLabel}</span>
        </nav>

        <PostMeta post={post} />

        <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(24px,3.5vw,40px)", color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: 20 }}>
          {post.title}
        </h1>

        <p style={{ fontFamily: "var(--font-body)", fontSize: 17, color: "#999", lineHeight: 1.8, marginBottom: 40, paddingBottom: 40, borderBottom: "1px solid #141416" }}>
          {post.excerpt}
        </p>

        <article>
          {contentHtml
            ? <div className="guide-body" dangerouslySetInnerHTML={{ __html: contentHtml }} />
            : (
              <div style={{ background: "#0c0c0e", border: "1px dashed #1e1e1e", borderRadius: 10, padding: "24px" }}>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#555", margin: 0 }}>
                  ✏️ Post content: <code style={{ color: "#C8FF0066" }}>content/blog/{post.slug}.js</code>
                </p>
              </div>
            )
          }
        </article>

        <BlogFAQ items={post.faq} />
        <RelatedPosts posts={related} />

        <div style={{ marginTop: 56, textAlign: "center" }}>
          <a href="/blog" className="btn-ghost" style={{ marginRight: 12 }}>← All posts</a>
          <a href="/#generator" className="btn-primary" style={{ animation: "none" }}>Generate password →</a>
        </div>
      </main>
    </PageLayout>
  );
}

export async function getStaticPaths() {
  return { paths: ALL_POSTS.map((p) => ({ params: { slug: p.slug } })), fallback: false };
}

export async function getStaticProps({ params }) {
  const post    = getPostBySlug(params.slug);
  const related = getRelatedPosts(params.slug, 3);
  let contentHtml = null;
  try {
    const mod = require(`../../content/blog/${params.slug}.js`);
    contentHtml = mod.contentHtml || null;
  } catch {}
  return { props: { post: post || null, related, contentHtml } };
}
