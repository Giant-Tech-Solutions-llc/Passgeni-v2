import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { jwtVerify } from "jose";
import { IcCheck } from "../lib/icons.js";

export async function getServerSideProps({ query }) {
  const { token } = query;
  if (!token) {
    return { redirect: { destination: "/pricing?invite=invalid", permanent: false } };
  }

  try {
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);
    const { payload } = await jwtVerify(token, secret);

    if (payload.type !== "team_invite" || !payload.email || !payload.customerId) {
      return { redirect: { destination: "/pricing?invite=invalid", permanent: false } };
    }

    return {
      props: {
        inviteEmail:    payload.email,
        customerId:     payload.customerId,
        token,
      },
    };
  } catch {
    return { redirect: { destination: "/pricing?invite=invalid", permanent: false } };
  }
}

export default function AcceptInvitePage({ inviteEmail, token }) {
  const { data: session, status } = useSession();
  const router  = useRouter();
  const [state, setState] = useState("idle"); // idle | accepting | success | error | wrong_account
  const [error, setError]  = useState(null);

  const isCorrectEmail =
    session?.user?.email?.toLowerCase() === inviteEmail?.toLowerCase();

  // Auto-accept when signed in with correct email
  useEffect(() => {
    if (status !== "authenticated") return;
    if (!isCorrectEmail) { setState("wrong_account"); return; }
    if (state !== "idle") return;

    setState("accepting");
    fetch("/api/team/accept", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ token }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setState("success");
          setTimeout(() => router.replace("/dashboard/team"), 1800);
        } else {
          setState("error");
          setError(data.error || "Invite could not be accepted.");
        }
      })
      .catch(() => { setState("error"); setError("Network error. Please try again."); });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, isCorrectEmail]);

  return (
    <div style={{
      minHeight:       "100vh",
      background:      "#060608",
      display:         "flex",
      alignItems:      "center",
      justifyContent:  "center",
      padding:         24,
      fontFamily:      "var(--font-body)",
    }}>
      <div style={{
        background:   "#0a0a0c",
        border:       "1px solid rgba(200,255,0,0.2)",
        borderRadius: 16,
        maxWidth:     440,
        width:        "100%",
        overflow:     "hidden",
      }}>
        {/* accent line */}
        <div style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(200,255,0,.5),transparent)" }} />

        <div style={{ padding: "32px 32px 28px" }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#C8FF00", marginBottom: 20 }}>PassGeni</div>

          {status === "loading" && (
            <p style={{ color: "#666", fontSize: 14 }}>Loading…</p>
          )}

          {status !== "loading" && state === "wrong_account" && (
            <>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 12 }}>Wrong account</h2>
              <p style={{ fontSize: 13, color: "#888", lineHeight: 1.7, marginBottom: 20 }}>
                This invite was sent to <strong style={{ color: "#fff" }}>{inviteEmail}</strong>.<br />
                You are signed in as <strong style={{ color: "#fff" }}>{session?.user?.email}</strong>.
              </p>
              <button
                onClick={() => signOut({ callbackUrl: `/accept-invite?token=${encodeURIComponent(token)}` })}
                style={btnStyle}
              >
                Sign out and use correct account
              </button>
            </>
          )}

          {status === "unauthenticated" && (
            <>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 12 }}>You've been invited</h2>
              <p style={{ fontSize: 13, color: "#888", lineHeight: 1.7, marginBottom: 8 }}>
                This invite was sent to:
              </p>
              <div style={{ background: "rgba(200,255,0,0.06)", border: "1px solid rgba(200,255,0,0.15)", borderRadius: 8, padding: "10px 14px", fontSize: 14, fontWeight: 700, color: "#C8FF00", marginBottom: 20 }}>
                {inviteEmail}
              </div>
              <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6, marginBottom: 24 }}>
                Click below to receive a magic link at that address. After signing in, your membership will be activated automatically.
              </p>
              <button
                onClick={() => signIn("email", {
                  email:       inviteEmail,
                  callbackUrl: `/accept-invite?token=${encodeURIComponent(token)}`,
                })}
                style={btnStyle}
              >
                Continue with Magic Link →
              </button>
            </>
          )}

          {(state === "idle" || state === "accepting") && status === "authenticated" && isCorrectEmail && (
            <>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 12 }}>Accepting invite…</h2>
              <p style={{ fontSize: 13, color: "#666" }}>Please wait while we activate your membership.</p>
            </>
          )}

          {state === "success" && (
            <>
              <div style={{ marginBottom: 12 }}><IcCheck size={32} color="#C8FF00" /></div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#C8FF00", marginBottom: 8 }}>You're in!</h2>
              <p style={{ fontSize: 13, color: "#666" }}>Redirecting to your team dashboard…</p>
            </>
          )}

          {state === "error" && (
            <>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#ff6b6b", marginBottom: 12 }}>Something went wrong</h2>
              <p style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>{error}</p>
              <a href="/auth/signin" style={{ ...btnStyle, display: "inline-block", textDecoration: "none", textAlign: "center" }}>
                Try signing in again
              </a>
            </>
          )}
        </div>

        <div style={{ padding: "14px 32px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <span style={{ fontSize: 11, color: "#333" }}>passgeni.ai — compliance password infrastructure</span>
        </div>
      </div>
    </div>
  );
}

const btnStyle = {
  display:        "block",
  width:          "100%",
  padding:        "13px 0",
  borderRadius:   8,
  background:     "#C8FF00",
  color:          "#000",
  fontWeight:     800,
  fontSize:       14,
  border:         "none",
  cursor:         "pointer",
  textAlign:      "center",
};
