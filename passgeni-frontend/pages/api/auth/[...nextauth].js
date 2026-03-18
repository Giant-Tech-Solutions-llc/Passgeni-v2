// =============================================================
// PASSGENI — NEXTAUTH CONFIGURATION
// pages/api/auth/[...nextauth].js
// =============================================================
// Magic-link email auth via Resend.
// No passwords. User enters email → receives link → clicks → logged in.
//
// Sessions are JWTs (stateless) for simplicity.
// Customer data is fetched from Supabase on each session load.
//
// Environment variables required:
//   NEXTAUTH_URL     — https://passgeni.ai (or http://localhost:3000)
//   NEXTAUTH_SECRET  — openssl rand -base64 32
//   RESEND_API_KEY   — re_xxxx (already set from Phase 2)
// =============================================================

import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { Resend } from "resend";
import { findCustomerByEmail } from "../../../lib/db/client.js";
import { SupabaseAdapter } from "../../../lib/auth/adapter.js";

// ─── RESEND EMAIL SENDER ─────────────────────────────────────
async function sendVerificationRequest({ identifier: email, url }) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from:    "PassGeni <hello@passgeni.ai>",
    to:      [email],
    subject: "Sign in to PassGeni Dashboard",
    html: `<!DOCTYPE html>
<html>
<body style="background:#060608;color:#e0e0e0;font-family:'DM Sans',Arial,sans-serif;margin:0;padding:40px 20px;">
  <div style="max-width:480px;margin:0 auto;">
    <div style="margin-bottom:28px;">
      <span style="font-size:22px;font-weight:800;color:#C8FF00;">PassGeni</span>
    </div>
    <h1 style="font-size:24px;font-weight:800;color:#fff;margin:0 0 16px;line-height:1.2;">
      Sign in to your dashboard.
    </h1>
    <p style="font-size:14px;color:#aaa;line-height:1.8;margin:0 0 28px;">
      Click the button below to sign in. This link expires in 10 minutes and can only be used once.
    </p>
    <a href="${url}" style="display:inline-block;background:#C8FF00;color:#000;font-weight:800;font-size:15px;padding:16px 32px;border-radius:8px;text-decoration:none;">
      Sign in &#8594;
    </a>
    <p style="font-size:12px;color:#555;margin-top:28px;line-height:1.6;">
      If you didn&apos;t request this, you can safely ignore this email.<br>
      This link was sent to ${email}
    </p>
  </div>
</body>
</html>`,
  });

  if (error) {
    console.error("[auth] Resend error:", JSON.stringify(error));
    throw new Error(error.message || "Failed to send sign-in email");
  }

  console.log("[auth] Magic link sent to", email, "id:", data?.id);
}

// ─── AUTH OPTIONS ────────────────────────────────────────────
export const authOptions = {
  adapter: SupabaseAdapter(),

  providers: [
    EmailProvider({
      // We use a custom sendVerificationRequest instead of SMTP
      from:                      "hello@passgeni.ai",
      sendVerificationRequest,
      maxAge:                    10 * 60, // 10 minutes
    }),
  ],

  // ── JWT sessions — stateless, no DB table needed for sessions ──
  session: { strategy: "jwt" },

  // ── Callbacks ────────────────────────────────────────────────
  callbacks: {
    // Add customer data to the JWT token on sign-in
    async jwt({ token, trigger }) {
      // On sign-in or explicit refresh, fetch customer from DB
      if (trigger === "signIn" || trigger === "update" || !token.customerId) {
        try {
          const customer = await findCustomerByEmail(token.email);
          if (customer) {
            token.customerId    = customer.id;
            token.plan          = customer.plan;
            token.planStatus    = customer.plan_status;
            token.trialEnd      = customer.trial_end;
            token.paddleCustomerId = customer.paddle_customer_id;
          } else {
            // Email doesn't have a customer record — free/unsubscribed
            token.customerId  = null;
            token.plan        = "free";
            token.planStatus  = "none";
          }
        } catch (e) {
          console.error("JWT callback DB error:", e);
        }
      }
      return token;
    },

    // Expose token fields to useSession() in the browser
    async session({ session, token }) {
      session.user.customerId     = token.customerId;
      session.user.plan           = token.plan;
      session.user.planStatus     = token.planStatus;
      session.user.trialEnd       = token.trialEnd;
      session.user.paddleCustomerId = token.paddleCustomerId;
      return session;
    },
  },

  // ── Pages ────────────────────────────────────────────────────
  pages: {
    signIn:  "/auth/signin",
    error:   "/auth/error",
    // verifyRequest is shown after email is sent — we handle this inline
  },

  // ── Secret ───────────────────────────────────────────────────
  secret: process.env.NEXTAUTH_SECRET || "dev-placeholder-not-for-production",
};

// Gracefully handle missing env vars in production
if (!process.env.NEXTAUTH_SECRET && process.env.NODE_ENV === "production") {
  console.error("NEXTAUTH_SECRET is not set — auth will not work correctly");
}

export default NextAuth(authOptions);
