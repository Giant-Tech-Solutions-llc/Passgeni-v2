import { useState, useMemo } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../../components/Layout';
import BlogHeroSVG from '../../components/BlogHeroSVG';
import { BLOG_POSTS } from '../../data/blogPosts';
import { IcSearch } from '../../lib/icons.js';

const POSTS_PER_PAGE = 9;

const CATEGORIES = ['All', 'SECURITY', 'COMPLIANCE', 'RESEARCH', 'HOW-TO', 'DEVELOPER', 'TOOLS', 'PRODUCT'];

const CAT_COLORS = {
  SECURITY:   { color: '#ff6b6b', bg: '#ff6b6b18' },
  COMPLIANCE: { color: '#C8FF00', bg: '#C8FF0015' },
  RESEARCH:   { color: '#7bc8ff', bg: '#7bc8ff15' },
  'HOW-TO':   { color: '#ffb347', bg: '#ffb34715' },
  DEVELOPER:  { color: '#a78bfa', bg: '#a78bfa15' },
  TOOLS:      { color: '#34d399', bg: '#34d39915' },
  PRODUCT:    { color: '#f472b6', bg: '#f472b615' },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.48, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] },
  }),
};

function CategoryBadge({ cat }) {
  const style = CAT_COLORS[cat] || { color: '#888', bg: '#88888815' };
  return (
    <span style={{
      fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700,
      letterSpacing: '0.14em', textTransform: 'uppercase',
      color: style.color, background: style.bg,
      padding: '3px 8px', borderRadius: 4,
    }}>
      {cat}
    </span>
  );
}

function BlogCard({ post, featured = false, index = 0 }) {
  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      style={featured ? { gridColumn: 'span 2' } : {}}
    >
      <Link href={`/blog/${post.slug}`} className="blog-card" style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Hero image */}
        <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: featured ? '21/9' : '16/9', background: '#0c0c0e' }}>
          <BlogHeroSVG category={post.category} slug={post.slug} title={post.title}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, #060608cc 0%, transparent 60%)',
            pointerEvents: 'none',
          }} />
        </div>
        <div className="blog-card-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <CategoryBadge cat={post.category} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--muted-2)', letterSpacing: '0.06em' }}>
              {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <h2 className="blog-card-title" style={{ fontSize: featured ? 22 : 16, color: 'var(--text)' }}>{post.title}</h2>
          <p className="blog-card-excerpt">{post.excerpt}</p>
          <div className="blog-card-meta">
            <span style={{ color: 'var(--muted)' }}>{post.readTime} min read</span>
            <span style={{ color: 'var(--accent)', fontSize: 10 }}>→</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function Pagination({ current, total, onChange }) {
  const pages = useMemo(() => {
    const arr = [];
    for (let i = 1; i <= total; i++) arr.push(i);
    return arr;
  }, [total]);

  if (total <= 1) return null;

  return (
    <nav className="pagination" aria-label="Blog pagination">
      <button
        className="pagination-btn nav"
        onClick={() => onChange(Math.max(1, current - 1))}
        disabled={current === 1}
        style={{ opacity: current === 1 ? 0.3 : 1 }}
        aria-label="Previous page"
      >← Prev</button>

      {pages.map(p => {
        const show = p === 1 || p === total || (p >= current - 1 && p <= current + 1);
        const ellipsisBefore = p === current - 2 && current > 3;
        const ellipsisAfter  = p === current + 2 && current < total - 2;
        if (ellipsisBefore || ellipsisAfter) {
          return <span key={p} style={{ color: 'var(--muted-2)', fontFamily: 'var(--font-mono)', fontSize: 12, padding: '0 4px' }}>…</span>;
        }
        if (!show) return null;
        return (
          <button
            key={p}
            className={`pagination-btn${p === current ? ' active' : ''}`}
            onClick={() => onChange(p)}
            aria-label={`Page ${p}`}
            aria-current={p === current ? 'page' : undefined}
          >{p}</button>
        );
      })}

      <button
        className="pagination-btn nav"
        onClick={() => onChange(Math.min(total, current + 1))}
        disabled={current === total}
        style={{ opacity: current === total ? 0.3 : 1 }}
        aria-label="Next page"
      >Next →</button>
    </nav>
  );
}

export default function BlogIndex() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    return BLOG_POSTS
      .filter(p => {
        const matchesCat = activeCategory === 'All' || p.category === activeCategory;
        const q = searchQuery.toLowerCase();
        const matchesSearch = !q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q);
        return matchesCat && matchesSearch;
      })
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  }, [activeCategory, searchQuery]);

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const pagePosts  = filtered.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  const handleCategory = (cat) => { setActiveCategory(cat); setCurrentPage(1); };
  const handleSearch   = (e)   => { setSearchQuery(e.target.value); setCurrentPage(1); };

  const handlePageChange = (p) => {
    setCurrentPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const featuredPost = currentPage === 1 && activeCategory === 'All' && !searchQuery ? pagePosts[0] : null;
  const gridPosts    = featuredPost ? pagePosts.slice(1) : pagePosts;

  return (
    <Layout>
      <Head>
        <title>Blog — Password Security News and Analysis | PassGeni</title>
        <meta name="description" content="Password security news, compliance analysis, breach data, and practical advice from the PassGeni team." />
      </Head>

      {/* ── PAGE HEADER ── */}
      <section style={{ padding: 'clamp(72px,8vw,108px) clamp(20px,5vw,60px) 52px', maxWidth: 1200, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <span style={{ display: 'block', width: 18, height: 1, background: 'var(--accent)', opacity: 0.6 }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              the passgeni blog
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24, marginBottom: 44 }}>
            <div>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(32px,5vw,56px)', color: '#fff', marginBottom: 14, lineHeight: 1.05, letterSpacing: '-0.03em' }}>
                Real users. <span style={{ color: 'var(--accent)' }}>Real opinions.</span>
              </h1>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(15px,1.6vw,17px)', color: 'var(--muted)', maxWidth: 520, lineHeight: 1.85, margin: 0 }}>
                Password security news, compliance changes, breach analysis, and practical advice. No fluff.
              </p>
            </div>

            {/* Search */}
            <div style={{ position: 'relative' }}>
              <input
                type="search"
                placeholder="Search posts…"
                value={searchQuery}
                onChange={handleSearch}
                style={{
                  background: 'rgba(13,13,16,0.8)', border: '1px solid var(--border-2)', borderRadius: 8,
                  padding: '11px 16px 11px 38px', fontFamily: 'var(--font-body)', fontSize: 14,
                  color: 'var(--text)', outline: 'none', width: 220,
                  backdropFilter: 'blur(8px)', transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(200,255,0,0.4)'}
                onBlur={e => e.target.style.borderColor = 'var(--border-2)'}
              />
              <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-2)', display: 'flex' }}><IcSearch size={15} color="currentColor" /></span>
            </div>
          </div>

          {/* Category filter pills */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategory(cat)}
                className={`toggle-pill${activeCategory === cat ? ' active' : ''}`}
                style={{ fontSize: 11 }}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── BLOG GRID ── */}
      <section style={{ padding: '0 clamp(20px,5vw,60px) clamp(60px,8vw,100px)', maxWidth: 1200, margin: '0 auto' }}>

        <AnimatePresence mode="wait">
          {pagePosts.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ textAlign: 'center', padding: '80px 0', color: 'var(--muted-2)' }}
            >
              <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}><IcSearch size={40} color="var(--muted-2)" /></div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--muted)' }}>No posts match your search.</p>
            </motion.div>
          ) : (
            <motion.div key={`${activeCategory}-${currentPage}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              {/* Featured post (first on page 1) */}
              {featuredPost && (
                <div style={{ marginBottom: 20 }}>
                  <BlogCard post={featuredPost} featured index={0} />
                </div>
              )}

              {/* Grid */}
              <div className="blog-grid">
                {gridPosts.map((post, i) => (
                  <BlogCard key={post.slug} post={post} index={i + (featuredPost ? 1 : 0)} />
                ))}
              </div>

              {/* Post count */}
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted-2)', letterSpacing: '0.08em', textAlign: 'center', marginTop: 36 }}>
                Showing {((currentPage - 1) * POSTS_PER_PAGE) + 1}–{Math.min(currentPage * POSTS_PER_PAGE, filtered.length)} of {filtered.length} posts
              </p>

              <Pagination current={currentPage} total={totalPages} onChange={handlePageChange} />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── NEWSLETTER CTA ── */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ borderTop: '1px solid var(--border)', padding: 'clamp(48px,6vw,80px) clamp(20px,5vw,60px)', maxWidth: 1200, margin: '0 auto' }}
      >
        <div style={{ maxWidth: 500 }}>
          <div className="eyebrow">Newsletter</div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(22px,3vw,32px)', color: '#fff', marginBottom: 14, letterSpacing: '-0.02em' }}>
            Get new posts in your inbox.
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(14px,1.5vw,16px)', color: 'var(--muted)', marginBottom: 28, lineHeight: 1.85 }}>
            No spam. Security-relevant updates only. Unsubscribe any time.
          </p>
          <form
            onSubmit={e => { e.preventDefault(); }}
            style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}
          >
            <input
              type="email"
              placeholder="you@example.com"
              required
              style={{
                flex: 1, minWidth: 200,
                background: 'rgba(13,13,16,0.8)', border: '1px solid var(--border-2)', borderRadius: 6,
                padding: '13px 16px', fontFamily: 'var(--font-body)', fontSize: 14,
                color: 'var(--text)', outline: 'none', transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(200,255,0,0.4)'}
              onBlur={e => e.target.style.borderColor = 'var(--border-2)'}
            />
            <button type="submit" className="cta-primary" style={{ fontSize: 13, padding: '13px 24px' }}>
              Subscribe
            </button>
          </form>
        </div>
      </motion.section>
    </Layout>
  );
}
