// =============================================================
// PASSGENI — SIGN IN PAGE
// passgeni.ai/auth/signin
// =============================================================
// Magic-link email auth. No password. Just email → link → in.
// =============================================================

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import PageLayout from "../../components/layout/PageLayout.js";

export default function SignInPage() {
  const router        = useRouter();
  const { data: session, status } = useSession();
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
      <main style={{ maxWidth: 440, margin: "0 auto", padding: "100px var(--page-pad) 120px" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <a href="/" style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 22, color: "#C8FF00", textDecoration: "none", letterSpacing: "-0.02em" }}>
            PassGeni
          </a>
        </div>

        {!sent ? (
          <div style={{ background: "#0a0a0c", border: "1px solid #141416", borderRadius: 16, padding: "36px 32px" }}>
            <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 24, color: "#fff", marginBottom: 8, letterSpacing: "-0.02em" }}>
              Sign in to your dashboard.
            </h1>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#888", lineHeight: 1.8, marginBottom: 28 }}>
              Enter your email and we'll send you a magic link. No password needed.
            </p>

            <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>
              Email address
            </label>
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              autoFocus
              style={{ width: "100%", background: "#060608", border: `1px solid ${error ? "#ff444444" : "#1e1e1e"}`, borderRadius: 8, padding: "13px 16px", fontFamily: "var(--font-body)", fontSize: 14, color: "#fff", outline: "none", marginBottom: 16, boxSizing: "border-box", transition: "border-color 0.2s" }}
              onFocus={(e) => (e.target.style.borderColor = "#C8FF0044")}
              onBlur={(e)  => (e.target.style.borderColor = error ? "#ff444444" : "#1e1e1e")}
            />

            {error && (
              <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#ff6644", marginBottom: 12 }}>
                {error}
              </p>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary"
              style={{ width: "100%", justifyContent: "center", fontSize: 15, animation: "none", opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Sending link…" : "Send magic link →"}
            </button>

            <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#555", marginTop: 20, textAlign: "center", lineHeight: 1.7 }}>
              Only Team subscribers can access the dashboard.{" "}
              <a href="/#pricing" style={{ color: "#C8FF00", textDecoration: "none" }}>Get Team plan →</a>
            </p>
          </div>
        ) : (
          /* ── Sent state ── */
          <div style={{ background: "#050f05", border: "1px solid #C8FF0033", borderRadius: 16, padding: "40px 32px", textAlign: "center", animation: "fadeIn 0.4s ease" }}>
            <div style={{ fontSize: 40, marginBottom: 20 }}>✉️</div>
            <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 22, color: "#C8FF00", marginBottom: 12, letterSpacing: "-0.02em" }}>
              Check your inbox.
            </h1>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#aaa", lineHeight: 1.8, marginBottom: 24 }}>
              We sent a magic link to <strong style={{ color: "#fff" }}>{email}</strong>.
              Click the link to sign in — it expires in 10 minutes.
            </p>
            <div style={{ background: "#0a0a0c", borderRadius: 10, padding: "14px 18px", marginBottom: 20 }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#777", margin: 0, lineHeight: 1.7 }}>
                Don't see it? Check your spam folder, or{" "}
                <button
                  onClick={() => setSent(false)}
                  style={{ background: "none", border: "none", color: "#C8FF0077", cursor: "pointer", fontFamily: "inherit", fontSize: "inherit", padding: 0, textDecoration: "underline" }}
                >
                  try a different email
                </button>.
              </p>
            </div>
          </div>
        )}
      </main>
    </PageLayout>
  );
}

export async function getServerSideProps() { return { props: {} }; }

