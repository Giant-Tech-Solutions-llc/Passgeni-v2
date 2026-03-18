// =============================================================
// PASSGENI — PADDLE CHECKOUT REDIRECT
// passgeni.ai/checkout
// =============================================================
// Bridge page between NextAuth sign-in and Paddle hosted checkout.
//
// Flow:
//   1. User clicks "Start free trial" → /auth/signin?callbackUrl=/checkout
//   2. User signs in → NextAuth redirects GET /checkout
//   3. This page reads session, POSTs to /api/paddle/checkout
//   4. Redirects to Paddle hosted checkout URL
//   5. After payment → Paddle redirects to /dashboard?status=success
// =============================================================

import { useEffect, useState } from "react";
import { useSession }          from "next-auth/react";
import { useRouter }           from "next/router";
import Head                    from "next/head";

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router  = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "loading") return;

    // Not signed in → send to sign-in with this as the callbackUrl
    if (status === "unauthenticated") {
      router.replace("/auth/signin?callbackUrl=/checkout");
      return;
    }

    // Signed in → create Paddle checkout
    async function startCheckout() {
      try {
        const res  = await fetch("/api/paddle/checkout", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ email: session.user.email }),
        });
        const data = await res.json();

        if (!res.ok || !data.url) {
          throw new Error(data.error || "No checkout URL returned");
        }

        window.location.href = data.url;
      } catch (err) {
        console.error("[checkout]", err);
        setError(err.message || "Could not create checkout. Please try again.");
      }
    }

    startCheckout();
  }, [status, session, router]);

  return (
    <>
      <Head>
        <title>Starting checkout… — PassGeni</title>
        <meta name="robots" content="noindex" />
      </Head>
      <main style={{
        minHeight: "100vh",
        background: "#060608",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        fontFamily: "'DM Sans', Arial, sans-serif",
      }}>
        <a href="/" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 22, color: "#C8FF00", textDecoration: "none", letterSpacing: "-0.02em", marginBottom: 40 }}>
          PassGeni
        </a>

        {!error ? (
          <div style={{ textAlign: "center" }}>
            {/* Animated spinner */}
            <div style={{ marginBottom: 24 }}>
              <svg width={40} height={40} viewBox="0 0 40 40" style={{ animation: "spin 1s linear infinite" }}>
                <circle cx={20} cy={20} r={16} fill="none" stroke="#1e1e1e" strokeWidth={3} />
                <path d="M20 4 A16 16 0 0 1 36 20" fill="none" stroke="#C8FF00" strokeWidth={3} strokeLinecap="round" />
              </svg>
            </div>
            <p style={{ color: "#888", fontSize: 15, margin: 0, lineHeight: 1.6 }}>
              Opening secure checkout…
            </p>
            <p style={{ color: "#555", fontSize: 13, marginTop: 8 }}>
              You'll be redirected to Paddle to complete your 14-day free trial.
            </p>
          </div>
        ) : (
          <div style={{ textAlign: "center", maxWidth: 420 }}>
            <div style={{ background: "#0a0a0c", border: "1px solid #ff444433", borderRadius: 14, padding: "28px 32px", marginBottom: 24 }}>
              <p style={{ fontFamily: "monospace", fontSize: 10, color: "#ff6644", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>Checkout error</p>
              <p style={{ color: "#ccc", fontSize: 14, lineHeight: 1.7, margin: 0 }}>{error}</p>
            </div>
            <button
              onClick={() => { setError(""); window.location.reload(); }}
              style={{ background: "#C8FF00", color: "#000", border: "none", borderRadius: 8, padding: "13px 28px", fontWeight: 700, fontSize: 14, cursor: "pointer", marginRight: 12 }}
            >Try again</button>
            <a href="mailto:hello@passgeni.ai" style={{ color: "#888", fontSize: 14 }}>Contact support</a>
          </div>
        )}

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </main>
    </>
  );
}

export async function getServerSideProps() { return { props: {} }; }
