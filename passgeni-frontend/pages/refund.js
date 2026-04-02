import PageLayout from "../components/layout/PageLayout.js";

const LINK = { color: "#C8FF00", textDecoration: "none" };
const H2   = { fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(20px,2.5vw,28px)", color: "#fff", letterSpacing: "-0.02em", marginBottom: 16, marginTop: 48 };
const P    = { fontFamily: "var(--font-body)", fontSize: 16, color: "#bbb", lineHeight: 1.85, marginBottom: 20 };

export default function RefundPage() {
  return (
    <PageLayout
      title="Refund Policy — PassGeni"
      description="PassGeni's refund policy. 14-day free trial. Full refunds within 14 days of your first charge, no questions asked."
      canonical="https://passgeni.ai/refund"
    >
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "80px var(--page-pad) 120px" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#555", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16 }}>Legal</div>
        <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(28px,4vw,48px)", color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 12 }}>Refund Policy</h1>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#555", marginBottom: 48 }}>Last updated: March 2026 · Effective immediately</p>

        <p style={P}>PassGeni is built on a simple principle: <strong style={{ color: "#fff" }}>you should never pay for something that doesn't work for you.</strong> We offer a 14-day free trial and a full 14-day refund window after your first charge.</p>

        <h2 style={H2}>14-day free trial</h2>
        <p style={P}>Every Team plan subscription starts with a <strong style={{ color: "#fff" }}>14-day free trial</strong>. Your payment method is collected at signup but you are not charged until the trial ends. You can cancel at any point during the trial — you will never be charged.</p>
        <p style={P}>Trial access includes the full Team plan: 5,000 API calls/day, 5 seats, bulk generation up to 500, and all compliance presets.</p>

        <h2 style={H2}>14-day refund window</h2>
        <p style={P}>If you are charged and decide PassGeni isn't right for you, contact us within <strong style={{ color: "#fff" }}>14 days of any charge</strong> and we will issue a full refund — no questions asked, no exceptions.</p>
        <p style={P}>This applies to your first charge and all subsequent billing cycles. If you are charged and request a refund within 14 days, you will receive a full refund.</p>

        <h2 style={H2}>How to request a refund</h2>
        <p style={P}>Email <a href="mailto:billing@passgeni.ai" style={LINK}>billing@passgeni.ai</a> with the subject line "Refund Request" and include the email address associated with your account. You do not need to provide a reason.</p>
        <p style={P}>Refunds are processed back to your original payment method within <strong style={{ color: "#fff" }}>5–10 business days</strong> depending on your bank or card issuer.</p>

        <h2 style={H2}>Cancellation</h2>
        <p style={P}>You can cancel your subscription at any time from your dashboard by clicking <strong style={{ color: "#fff" }}>Billing →</strong>. Cancellation stops all future charges. You retain full Team plan access until the end of your current billing period.</p>

        <h2 style={H2}>Disputes</h2>
        <p style={P}>We ask that you contact us before initiating a chargeback with your bank. We respond to every refund request within 2 business days and will always resolve the issue directly.</p>

        <h2 style={H2}>Changes to this policy</h2>
        <p style={P}>If we make material changes to this policy, we will update the date at the top of this page and notify active subscribers by email at least 14 days in advance.</p>

        <h2 style={H2}>Contact</h2>
        <p style={P}>Questions about billing or refunds? Email <a href="mailto:billing@passgeni.ai" style={LINK}>billing@passgeni.ai</a> or visit our <a href="/contact" style={LINK}>contact page</a>.</p>
      </main>
    </PageLayout>
  );
}
