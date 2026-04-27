import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Layout from '../../components/Layout';
import BlogHeroSVG from '../../components/BlogHeroSVG';
import { BLOG_POSTS } from '../../data/blogPosts';
import { IcLink, IcCheck, IcCopy, IcShield, IcBarChart, IcArrow, IcBolt } from '../../lib/icons.js';

/* ─── Reading Progress Bar ─── */
function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0);
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  return (
    <div
      className="reading-progress"
      style={{ width: `${progress}%` }}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    />
  );
}

/* ─── Table of Contents ─── */
function TableOfContents({ headings }) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => { if (e.isIntersecting) setActiveId(e.target.id); });
      },
      { rootMargin: '-64px 0px -70% 0px' }
    );
    headings.forEach(h => {
      const el = document.getElementById(h.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav className="toc-sidebar" aria-label="Table of contents">
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#555', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 14 }}>
        Contents
      </div>
      {headings.map(h => (
        <a
          key={h.id}
          href={`#${h.id}`}
          className={`toc-item${activeId === h.id ? ' active' : ''}`}
          style={{ paddingLeft: h.level === 3 ? 24 : 12 }}
        >
          {h.text}
        </a>
      ))}
    </nav>
  );
}

/* ─── Social Share ─── */
function SocialShare({ title, url }) {
  const encoded = encodeURIComponent;
  const shares = [
    {
      key: 'twitter',
      label: 'Share on X',
      icon: '𝕏',
      href: `https://twitter.com/intent/tweet?text=${encoded(title)}&url=${encoded(url)}`,
    },
    {
      key: 'linkedin',
      label: 'LinkedIn',
      icon: 'in',
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encoded(url)}&title=${encoded(title)}`,
    },
    {
      key: 'whatsapp',
      label: 'WhatsApp',
      icon: 'wa',
      href: `https://wa.me/?text=${encoded(title + ' ' + url)}`,
    },
    {
      key: 'facebook',
      label: 'Facebook',
      icon: 'f',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encoded(url)}`,
    },
  ];

  const [copied, setCopied] = useState(false);
  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [url]);

  return (
    <div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted-2)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 14 }}>
        Share this post
      </div>
      <div className="social-share">
        {shares.map(s => (
          <a
            key={s.key}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`social-share-btn ${s.key}`}
            aria-label={s.label}
          >
            <span style={{ fontSize: 13, fontWeight: 700 }}>{s.icon}</span>
            <span>{s.label}</span>
          </a>
        ))}
        <button
          className={`social-share-btn copy-btn${copied ? ' copied' : ''}`}
          onClick={copyLink}
          aria-label="Copy link"
        >
          {copied
            ? <><IcCheck size={14} color="currentColor" />&nbsp;Copied!</>
            : <><IcLink size={14} color="currentColor" />&nbsp;Copy link</>
          }
        </button>
      </div>
    </div>
  );
}

/* ─── Blog FAQs ─── */
function BlogFAQs({ faqs }) {
  const [open, setOpen] = useState(null);
  if (!faqs || faqs.length === 0) return null;
  return (
    <section style={{ marginTop: 64, paddingTop: 48, borderTop: '1px solid var(--border)' }}>
      <div className="eyebrow">Frequently asked questions</div>
      <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(22px,3vw,32px)', color: '#fff', marginBottom: 32, letterSpacing: '-0.02em' }}>
        Questions about this topic
      </h2>
      <div style={{ maxWidth: 720 }}>
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="blog-faq-item"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24 }}>
              <h3 style={{
                fontFamily: 'var(--font-heading)', fontSize: 'clamp(14px,1.6vw,16px)', fontWeight: 700,
                color: open === i ? 'var(--accent)' : 'var(--text)', margin: 0, lineHeight: 1.45,
              }}>
                {faq.q}
              </h3>
              <span style={{
                color: 'var(--accent)', fontSize: 18, flexShrink: 0,
                transition: 'transform 0.2s',
                transform: open === i ? 'rotate(45deg)' : 'none',
              }}>+</span>
            </div>
            {open === i && (
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: 'clamp(14px,1.5vw,16px)', color: 'var(--muted)',
                lineHeight: 1.9, marginTop: 16, marginBottom: 0,
                animation: 'fadeIn 0.2s ease',
              }}>
                {faq.a}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Keyword Highlighter ─── */
function HighlightKeywords({ text, keywords }) {
  if (!keywords || keywords.length === 0) return <>{text}</>;
  const pattern = new RegExp(`(${keywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  const parts = text.split(pattern);
  return (
    <>
      {parts.map((part, i) =>
        keywords.some(k => k.toLowerCase() === part.toLowerCase())
          ? <mark key={i} className="keyword-highlight">{part}</mark>
          : part
      )}
    </>
  );
}

/* ─── Inline renderer: supports [text](url) links + keyword highlights ─── */
function renderInline(text, keywords = []) {
  const LINK = /\[([^\]]+)\]\(([^)]+)\)/g;
  const segments = [];
  let last = 0;
  let m;
  while ((m = LINK.exec(text)) !== null) {
    if (m.index > last) segments.push({ type: 'text', content: text.slice(last, m.index) });
    segments.push({ type: 'link', label: m[1], href: m[2] });
    last = m.index + m[0].length;
  }
  if (last < text.length) segments.push({ type: 'text', content: text.slice(last) });
  return segments.map((seg, i) => {
    if (seg.type === 'link') {
      const ext = seg.href.startsWith('http');
      return ext
        ? <a key={i} href={seg.href} target="_blank" rel="noopener noreferrer">{seg.label}</a>
        : <Link key={i} href={seg.href}>{seg.label}</Link>;
    }
    return <HighlightKeywords key={i} text={seg.content} keywords={keywords} />;
  });
}

/* ─── Reaction Widget ─── */
function ReactionWidget() {
  const [reactions, setReactions] = useState({ helpful: 0, interesting: 0, shared: 0 });
  const [voted, setVoted] = useState({});

  const react = (type) => {
    if (voted[type]) return;
    setReactions(r => ({ ...r, [type]: r[type] + 1 }));
    setVoted(v => ({ ...v, [type]: true }));
  };

  const options = [
    { key: 'helpful',     icon: <IcCheck size={15} color="currentColor" />,   label: 'Helpful' },
    { key: 'interesting', icon: <IcBolt size={15} color="currentColor" />,    label: 'Interesting' },
    { key: 'shared',      icon: <IcArrow size={15} color="currentColor" />,   label: 'Worth sharing' },
  ];

  return (
    <div style={{ marginTop: 48, padding: '28px 32px', background: '#0a0a0c', border: '1px solid #141416', borderRadius: 12 }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted-2)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 16 }}>
        Was this post useful?
      </div>
      <div className="reaction-widget">
        {options.map(({ key, icon, label }) => (
          <button
            key={key}
            className={`reaction-btn${voted[key] ? ' active' : ''}`}
            onClick={() => react(key)}
            disabled={voted[key]}
          >
            <span style={{ display: 'flex' }}>{icon}</span>
            <span>{label}</span>
            {reactions[key] > 0 && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#C8FF00', marginLeft: 4 }}>
                {reactions[key]}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Related Posts ─── */
function RelatedPosts({ currentSlug, category }) {
  const related = BLOG_POSTS
    .filter(p => p.slug !== currentSlug && p.category === category)
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section style={{ marginTop: 64, paddingTop: 48, borderTop: '1px solid #141416' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted-2)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>
        More posts
      </div>
      <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(20px,2.5vw,28px)', color: '#fff', marginBottom: 28 }}>
        Related reading
      </h2>
      <div className="related-posts-grid">
        {related.map(post => (
          <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
            <article style={{
              background: '#0a0a0c', border: '1px solid #141416', borderRadius: 10,
              overflow: 'hidden', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8FF0033'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#141416'; e.currentTarget.style.transform = 'none'; }}
            >
              <div style={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden', background: '#060608' }}>
                <BlogHeroSVG category={post.category} slug={post.slug} title={post.title} />
              </div>
              <div style={{ padding: '16px 18px' }}>
                <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 14, color: '#fff', lineHeight: 1.35, marginBottom: 8 }}>
                  {post.title}
                </p>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted-2)', letterSpacing: '0.06em' }}>
                  {post.readTime} min read →
                </span>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ─── Main Blog Post Page ─── */
export default function BlogPost({ post }) {
  if (!post) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '120px 20px' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: 32 }}>Post Not Found</h1>
          <p style={{ color: '#888', marginTop: 16 }}>This post doesn't exist.</p>
          <Link href="/blog" className="cta-primary" style={{ marginTop: 32, display: 'inline-flex' }}>← Back to Blog</Link>
        </div>
      </Layout>
    );
  }

  const postUrl = `https://passgeni.ai/blog/${post.slug}`;

  // Build headings for TOC — extract from contentHtml or use sections
  const headings = post.contentHtml
    ? Array.from(post.contentHtml.matchAll(/<h2[^>]*>(.*?)<\/h2>/gi)).map((m, i) => ({
        id: `h-${i}`,
        text: m[1].replace(/<[^>]+>/g, ''),
        level: 2,
      }))
    : (post.sections || []).map((s, i) => ({
        id: `section-${i}`,
        text: s.title,
        level: 2,
      }));

  return (
    <Layout>
      <Head>
        <title>{post.title} | PassGeni</title>
        <meta name="description" content={post.metaDescription || post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.heroImage || 'https://passgeni.ai/og-image.png'} />
        <meta property="og:url" content={postUrl} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href={postUrl} />
        {/* JSON-LD */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.excerpt,
            "image": post.heroImage,
            "datePublished": post.publishedAt,
            "author": { "@type": "Organization", "name": "PassGeni" },
            "publisher": { "@type": "Organization", "name": "PassGeni", "url": "https://passgeni.ai" },
          })
        }} />
      </Head>

      {/* Reading progress bar */}
      <ReadingProgressBar />

      {/* ── HERO IMAGE ── */}
      <div className="blog-post-hero">
        <BlogHeroSVG category={post.category} slug={post.slug} title={post.title} />
      </div>

      {/* ── CONTENT WRAPPER ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(16px,4vw,60px)' }}>

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" style={{ padding: '20px 0 0', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted-2)', letterSpacing: '0.08em', flexWrap: 'wrap' }}>
            <Link href="/" style={{ color: 'var(--muted-2)', textDecoration: 'none' }}>PassGeni</Link>
            <span style={{ color: 'var(--border-2)' }}>→</span>
            <Link href="/blog" style={{ color: 'var(--muted-2)', textDecoration: 'none' }}>Blog</Link>
            <span style={{ color: 'var(--border-2)' }}>→</span>
            <span style={{ color: 'var(--accent)', opacity: 0.7 }}>{post.category}</span>
          </div>
        </nav>

        <div className="blog-post-layout">

          {/* ── MAIN CONTENT ── */}
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Category + meta */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22, flexWrap: 'wrap' }}>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.14em',
                textTransform: 'uppercase', color: post.categoryColor || 'var(--accent)',
                background: `${post.categoryColor || '#C8FF00'}18`, padding: '3px 10px', borderRadius: 4,
              }}>
                {post.category}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted-2)', letterSpacing: '0.06em' }}>
                {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--border-2)' }}>·</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted-2)', letterSpacing: '0.06em' }}>
                {post.readTime} min read
              </span>
            </div>

            {/* Title */}
            <h1 style={{
              fontFamily: 'var(--font-heading)', fontWeight: 800,
              fontSize: 'clamp(28px,4vw,48px)', color: '#fff',
              marginBottom: 22, letterSpacing: '-0.025em', lineHeight: 1.1,
            }}>
              {post.title}
            </h1>

            {/* Excerpt / deck */}
            <p style={{ fontSize: 'clamp(15px,1.6vw,18px)', color: 'var(--muted)', lineHeight: 1.85, marginBottom: 36, borderLeft: '3px solid var(--accent)', paddingLeft: 20 }}>
              {post.excerpt}
            </p>

            {/* Top social share */}
            <div style={{ marginBottom: 48, paddingBottom: 36, borderBottom: '1px solid #141416' }}>
              <SocialShare title={post.title} url={postUrl} />
            </div>

            {/* ── POST BODY ── */}
            <div className="blog-content">
              {post.contentHtml
                ? <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
                : (post.sections || []).map((section, i) => (
                    <section key={i} id={`section-${i}`}>
                      <h2>{section.title}</h2>
                      {section.body.split('\n\n').map((para, j) => {
                        const keywords = post.keywords || [];
                        if (para.startsWith('- ') || para.startsWith('• ')) {
                          const items = para.split('\n').filter(Boolean).map(l => l.replace(/^[-•]\s*/, ''));
                          return (
                            <ul key={j}>
                              {items.map((item, k) => (
                                <li key={k}>{renderInline(item, keywords)}</li>
                              ))}
                            </ul>
                          );
                        }
                        return <p key={j}>{renderInline(para, keywords)}</p>;
                      })}
                    </section>
                  ))
              }
            </div>

            {/* Keyword scan tags */}
            {post.keywords && post.keywords.length > 0 && (
              <div style={{ marginTop: 40, paddingTop: 32, borderTop: '1px solid #141416' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#555', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 14 }}>
                  Key topics
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {post.keywords.map(kw => (
                    <span key={kw} className="keyword-highlight" style={{ cursor: 'default', userSelect: 'none' }}>
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Reaction widget */}
            <ReactionWidget />

            {/* Bottom social share */}
            <div style={{ marginTop: 40, paddingTop: 32, borderTop: '1px solid #141416' }}>
              <SocialShare title={post.title} url={postUrl} />
            </div>

            {/* FAQs */}
            <BlogFAQs faqs={post.faqs} />

            {/* Related posts */}
            <RelatedPosts currentSlug={post.slug} category={post.category} />

            {/* Back to blog */}
            <div style={{ marginTop: 60, paddingTop: 40, borderTop: '1px solid #141416' }}>
              <Link href="/blog" style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent)', textDecoration: 'none', letterSpacing: '0.06em', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                ← Back to all posts
              </Link>
            </div>
          </motion.article>

          {/* ── SIDEBAR ── */}
          <aside className="blog-post-sidebar" style={{ paddingTop: 8 }}>
            <TableOfContents headings={headings} />

            {/* PassGeni CTA card */}
            <div style={{ marginTop: 32, background: '#0a0a0c', border: '1px solid #C8FF0022', borderRadius: 12, padding: '24px 20px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#C8FF0066', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>
                Free tool
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 16, color: '#fff', marginBottom: 10 }}>
                Generate a strong password now
              </h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#888', lineHeight: 1.7, marginBottom: 16 }}>
                AI-seeded. Zero storage. NIST-compliant. Free forever.
              </p>
              <Link href="/#generator" className="cta-primary" style={{ fontSize: 12, padding: '10px 18px', width: '100%', justifyContent: 'center', display: 'flex' }}>
                Try it free →
              </Link>
            </div>

            {/* Free tools mentioned */}
            <div style={{ marginTop: 24, background: '#0a0a0c', border: '1px solid #141416', borderRadius: 12, padding: '20px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#555', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 14 }}>
                Related tools
              </div>
              {[
                { label: 'AI Password Generator', href: '/#generator' },
                { label: 'Password Strength Checker', href: '/tools/strength-checker' },
                { label: 'Breach Checker', href: '/tools/breach-checker' },
                { label: 'Passphrase Generator', href: '/#generator' },
              ].map(({ label, href }) => (
                <Link key={label} href={href} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  fontFamily: 'var(--font-body)', fontSize: 12, color: '#888',
                  textDecoration: 'none', padding: '8px 0', borderBottom: '1px solid #111',
                  transition: 'color 0.15s',
                }}
                  onMouseEnter={e => e.currentTarget.style.color = '#C8FF00'}
                  onMouseLeave={e => e.currentTarget.style.color = '#888'}
                >
                  {label}
                  <span style={{ color: '#C8FF0055', fontSize: 10 }}>→</span>
                </Link>
              ))}
            </div>
          </aside>

        </div>
      </div>

      {/* Extra bottom spacing */}
      <div style={{ height: 80 }} />
    </Layout>
  );
}

/* ── getStaticPaths + getStaticProps ── */
export async function getStaticPaths() {
  return {
    paths: BLOG_POSTS.map(p => ({ params: { slug: p.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const post = BLOG_POSTS.find(p => p.slug === params.slug) || null;
  if (!post) return { props: { post: null } };

  let contentHtml = null;
  try {
    const mod = require(`../../content/blog/${params.slug}.js`);
    if (mod.contentHtml) {
      // Inject id="h-N" into each <h2> so TOC anchor links work
      let idx = 0;
      contentHtml = mod.contentHtml.replace(/<h2([^>]*)>/gi, () => `<h2 id="h-${idx++}">`);
    }
  } catch (_) {}

  return { props: { post: { ...post, contentHtml } } };
}
