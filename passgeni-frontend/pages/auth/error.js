// =============================================================
// PASSGENI — AUTH ERROR PAGE
// passgeni.ai/auth/error
// =============================================================

import { useRouter } from "next/router";
import PageLayout from "../../components/layout/PageLayout.js";

const ERROR_MESSAGES = {
  Configuration:  "Server configuration error. Please contact hello@passgeni.ai.",
  AccessDenied:   "Access denied. Your account may not have an active Team subscription.",
  Verification:   "The sign-in link has expired or already been used. Please request a new one.",
  Default:        "An unexpected error occurred. Please try signing in again.",
};

export default function AuthErrorPage() {
  const router = useRouter();
  const code   = router.query.error || "Default";
  const msg    = ERROR_MESSAGES[code] || ERROR_MESSAGES.Default;

  return (
    <PageLayout title="Sign In Error — PassGeni" description="">
      <main style={{ maxWidth: 440, margin: "0 auto", padding: "100px var(--page-pad) 120px", textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 20 }}>⚠️</div>
        <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 24, color: "#fff", marginBottom: 12, letterSpacing: "-0.02em" }}>
          Sign in failed.
        </h1>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#aaa", lineHeight: 1.8, marginBottom: 28 }}>
          {msg}
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="/auth/signin" className="btn-primary" style={{ animation: "none" }}>
            Try again →
          </a>
          <a href="mailto:hello@passgeni.ai" className="btn-ghost">
            Contact support
          </a>
        </div>
        {code !== "Default" && (
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#333", marginTop: 24, letterSpacing: "0.1em" }}>
            Error code: {code}
          </p>
        )}
      </main>
    </PageLayout>
  );
}

export async function getServerSideProps() { return { props: {} }; }

export async function getServerSideProps() { return { props: {} }; }
