import React from 'react';
import Link from 'next/link';

/**
 * ErrorBoundary — wraps Guide and Blog pages to catch client-side render errors
 * instead of showing "Application error: a client-side exception has occurred".
 *
 * Usage (in _app.js):
 *   <ErrorBoundary>
 *     <Component {...pageProps} />
 *   </ErrorBoundary>
 *
 * Or wrap individual pages:
 *   export default function GuidePage() {
 *     return <ErrorBoundary><GuideContent/></ErrorBoundary>;
 *   }
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[PassGeni ErrorBoundary]', error, info);
    }
    // TODO: add production error tracking here (e.g. Sentry)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(40px,8vw,80px) 20px',
          textAlign: 'center',
          background: '#060608',
        }}>
          {/* Icon */}
          <div style={{ fontSize: 40, marginBottom: 24, color: '#C8FF00', opacity: 0.6 }}>⬡</div>

          {/* Heading */}
          <h1 style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(22px,4vw,32px)',
            color: '#fff',
            marginBottom: 16,
            letterSpacing: '-0.02em',
          }}>
            Something went wrong
          </h1>

          {/* Message */}
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: 15,
            color: '#888',
            maxWidth: 440,
            lineHeight: 1.75,
            marginBottom: 36,
          }}>
            This page encountered an error while loading. Try refreshing, or head back to the home page.
          </p>

          {/* Error detail (dev only) */}
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <pre style={{
              background: '#0a0a0c',
              border: '1px solid #ff444422',
              borderRadius: 8,
              padding: '16px 20px',
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: '#ff6b6b',
              maxWidth: 600,
              width: '100%',
              textAlign: 'left',
              overflow: 'auto',
              marginBottom: 36,
              lineHeight: 1.7,
            }}>
              {this.state.error.toString()}
            </pre>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              style={{
                background: '#C8FF00',
                color: '#000',
                border: 'none',
                borderRadius: 4,
                padding: '12px 24px',
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 800,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              Try again
            </button>
            <Link href="/" style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '12px 24px',
              borderRadius: 4,
              border: '1px solid #2a2a2a',
              color: '#fff',
              textDecoration: 'none',
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              fontSize: 14,
            }}>
              ← Home
            </Link>
            <Link href="/guides" style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '12px 24px',
              borderRadius: 4,
              border: '1px solid #2a2a2a',
              color: '#aaa',
              textDecoration: 'none',
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              fontSize: 14,
            }}>
              All guides
            </Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
