// =============================================================
// PASSGENI — SIGN IN PAGE
// passgeni.ai/auth/signin
// =============================================================
// Magic-link email auth. No password. Just email → link → in.
// =============================================================

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { btnPrimary } from "../../lib/motion.js";
import PageLayout from "../../components/layout/PageLayout.js";
import { IcLock, IcArrow, IcCheck } from "../../lib/icons.js";

export default function SignInPage() {
  const router      = useRouter();
  const { status }  = useSession();
  const [email,    setEmail]    = useState("");
  const [sent,     setSent]     = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const callbackUrl = router.query.callbackUrl || "/dashboard";

  // Already signed in → redirect
  useEffect(() => {
    if (status === "authenticated") {
      router.push(callbackUrl);
    }
  }, [status, callbackUrl, router]);

  const handleSubmit = async () => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await signIn("email", {
        email:      email.trim().toLowerCase(),
        callbackUrl,
        redirect:   false,
      });
      if (result?.error) {
        setError("Couldn't send the link. Please try again.");
      } else {
        setSent(true);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const schema = {
    "@context": "https://schema.org",
    "@type":    "WebPage",
    "noIndex":  true,
  };

  return (
    <PageLayout
      title="Sign In — PassGeni Dashboard"
      description="Sign in to your PassGeni Team dashboard."
      schema={schema}
    >
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg)",
          padding: "40px var(--page-pad)",
        }}
      >
        {/* Wordmark */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          style={{ marginBottom: 36, textAlign: "center" }}
        >
          <a
            href="/"
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 800,
              fontSize: 28,
              color: "var(--accent)",
              textDecoration: "none",
              letterSpacing: "-0.03em",
              display: "inline-block",
            }}
          >
            PassGeni
          </a>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
          className="bc"
          style={{
            width: "100%",
            maxWidth: 420,
            padding: "40px 36px",
            position: "relative",
          }}
        >
          <div className="bc-line" />

          {!sent ? (
            <>
              {/* Header */}
              <div style={{ marginBottom: 28 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: "rgba(200,255,0,0.08)",
                    border: "1px solid rgba(200,255,0,0.18)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 20,
                  }}
                >
                  <IcLock size={20} color="var(--accent)" />
                </div>
                <h1
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontWeight: 800,
                    fontSize: 22,
                    color: "var(--text)",
                    marginBottom: 8,
                    letterSpacing: "-0.025em",
                    lineHeight: 1.2,
                  }}
                >
                  Sign in to your dashboard.
                </h1>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 14,
                    color: "var(--muted)",
                    lineHeight: 1.75,
                    margin: 0,
                  }}
                >
                  Enter your email and we&apos;ll send a magic link. No password needed.
                </p>
              </div>

              {/* Email field */}
              <label
                style={{
                  display: "block",
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "var(--muted)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Email address
              </label>
              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                autoFocus
                style={{
                  width: "100%",
                  background: "#060608",
                  border: `1px solid ${error ? "rgba(255,68,68,0.35)" : "#1e1e22"}`,
                  borderRadius: 8,
                  padding: "13px 16px",
                  fontFamily: "var(--font-body)",
                  fontSize: 15,
                  color: "var(--text)",
                  outline: "none",
                  marginBottom: 16,
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e)  => (e.target.style.borderColor = "rgba(200,255,0,0.35)")}
                onBlur={(e)   => (e.target.style.borderColor = error ? "rgba(255,68,68,0.35)" : "#1e1e22")}
              />

              {error && (
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    color: "#ff6644",
                    marginBottom: 14,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  {error}
                </p>
              )}

              <motion.button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary"
                {...btnPrimary}
                style={{
                  width: "100%",
                  justifyContent: "center",
                  fontSize: 15,
                  animation: "none",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Sending link…" : (
                  <span style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                    Send magic link
                    <IcArrow size={14} color="#050507" />
                  </span>
                )}
              </motion.button>

              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 12,
                  color: "#444",
                  marginTop: 20,
                  textAlign: "center",
                  lineHeight: 1.7,
                }}
              >
                Need a plan?{" "}
                <a href="/pricing" style={{ color: "var(--accent)", textDecoration: "none" }}>
                  View pricing
                </a>
              </p>
            </>
          ) : (
            /* Sent state */
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "rgba(200,255,0,0.08)",
                  border: "1px solid rgba(200,255,0,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 24px",
                }}
              >
                <IcCheck size={24} color="var(--accent)" />
              </div>
              <h1
                style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 800,
                  fontSize: 22,
                  color: "var(--accent)",
                  marginBottom: 12,
                  letterSpacing: "-0.025em",
                }}
              >
                Check your inbox.
              </h1>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 14,
                  color: "var(--muted)",
                  lineHeight: 1.8,
                  marginBottom: 24,
                }}
              >
                We sent a magic link to{" "}
                <strong style={{ color: "var(--text)" }}>{email}</strong>.
                Click the link to sign in — it expires in 10 minutes.
              </p>
              <div
                style={{
                  background: "#060608",
                  border: "1px solid #1a1a1e",
                  borderRadius: 10,
                  padding: "14px 18px",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    color: "#555",
                    margin: 0,
                    lineHeight: 1.7,
                  }}
                >
                  Don&apos;t see it? Check your spam folder, or{" "}
                  <button
                    onClick={() => setSent(false)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "rgba(200,255,0,0.55)",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      fontSize: "inherit",
                      padding: 0,
                      textDecoration: "underline",
                    }}
                  >
                    try a different email
                  </button>
                  .
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          style={{
            marginTop: 24,
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "#333",
            letterSpacing: "0.1em",
            textAlign: "center",
          }}
        >
          Zero-knowledge. No passwords stored.
        </motion.p>
      </main>
    </PageLayout>
  );
}

export async function getServerSideProps() { return { props: {} }; }
