import { useState, useMemo } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Layout from '../../components/Layout';
import BlogHeroSVG from '../../components/BlogHeroSVG';
import { BLOG_POSTS } from '../../data/blogPosts';  // centralised data

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

function BlogCard({ post, featured = false }) {
  return (
    <Link href={`/blog/${post.slug}`} className="blog-card" style={featured ? { gridColumn: 'span 2' } : {}}>
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
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#555', letterSpacing: '0.06em' }}>
            {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
        <h2 className="blog-card-title" style={{ fontSize: featured ? 22 : 16 }}>{post.title}</h2>
        <p className="blog-card-excerpt">{post.excerpt}</p>
        <div className="blog-card-meta">
          <span>{post.readTime} min read</span>
          <span style={{ color: '#C8FF00', fontSize: 10 }}>→</span>
        </div>
      </div>
    </Link>
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
        // Show first, last, current ±1, and ellipsis
        const show = p === 1 || p === total || (p >= current - 1 && p <= current + 1);
        const ellipsisBefore = p === current - 2 && current > 3;
        const ellipsisAfter  = p === current + 2 && current < total - 2;
        if (ellipsisBefore || ellipsisAfter) {
          return <span key={p} style={{ color: '#444', fontFamily: 'var(--font-mono)', fontSize: 12, padding: '0 4px' }}>…</span>;
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

  // Filter posts
  const filtered = useMemo(() => {
    return BLOG_POSTS.filter(p => {
      const matchesCat = activeCategory === 'All' || p.category === activeCategory;
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const pagePosts  = filtered.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  // Reset to page 1 on filter change
  const handleCategory = (cat) => { setActiveCategory(cat); setCurrentPage(1); };
  const handleSearch   = (e)   => { setSearchQuery(e.target.value); setCurrentPage(1); };

  // Scroll to top when page changes
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
      <section style={{ padding: 'clamp(60px,8vw,100px) clamp(20px,5vw,60px) 48px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#888', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>
          the passgeni blog
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24, marginBottom: 40 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(30px,5vw,52px)', color: '#fff', marginBottom: 12 }}>
              Real users. <span style={{ color: '#C8FF00' }}>Real opinions.</span>
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: '#888', maxWidth: 500, lineHeight: 1.75 }}>
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
                background: '#0c0c0e', border: '1px solid #1e1e1e', borderRadius: 8,
                padding: '10px 16px 10px 36px', fontFamily: 'var(--font-body)', fontSize: 13,
                color: '#e0e0e0', outline: 'none', width: 220,
              }}
              onFocus={e => e.target.style.borderColor = '#C8FF0044'}
              onBlur={e => e.target.style.borderColor = '#1e1e1e'}
            />
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#555', fontSize: 14 }}>⌕</span>
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
      </section>

      {/* ── BLOG GRID ── */}
      <section style={{ padding: '0 clamp(20px,5vw,60px) clamp(60px,8vw,100px)', maxWidth: 1200, margin: '0 auto' }}>

        {pagePosts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#555' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>⌕</div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 15 }}>No posts match your search.</p>
          </div>
        ) : (
          <>
            {/* Featured post (first on page 1) */}
            {featuredPost && (
              <div style={{ marginBottom: 20 }}>
                <BlogCard post={featuredPost} featured />
              </div>
            )}

            {/* Grid */}
            <div className="blog-grid">
              {gridPosts.map(post => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>

            {/* Post count */}
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#555', letterSpacing: '0.08em', textAlign: 'center', marginTop: 32 }}>
              Showing {((currentPage - 1) * POSTS_PER_PAGE) + 1}–{Math.min(currentPage * POSTS_PER_PAGE, filtered.length)} of {filtered.length} posts
            </p>

            <Pagination current={currentPage} total={totalPages} onChange={handlePageChange} />
          </>
        )}
      </section>

      {/* ── NEWSLETTER CTA ── */}
      <section style={{ borderTop: '1px solid #141416', padding: 'clamp(48px,6vw,80px) clamp(20px,5vw,60px)', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ maxWidth: 480 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#C8FF0066', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>newsletter</div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'clamp(22px,3vw,32px)', color: '#fff', marginBottom: 16 }}>
            Get new posts in your inbox.
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#888', marginBottom: 24, lineHeight: 1.75 }}>
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
                background: '#0c0c0e', border: '1px solid #1e1e1e', borderRadius: 6,
                padding: '12px 16px', fontFamily: 'var(--font-body)', fontSize: 14,
                color: '#e0e0e0', outline: 'none',
              }}
            />
            <button type="submit" className="cta-primary" style={{ fontSize: 13, padding: '12px 24px' }}>
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </Layout>
  );
}
