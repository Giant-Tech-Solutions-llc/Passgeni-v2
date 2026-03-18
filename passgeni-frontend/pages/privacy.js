import PageLayout from "../components/layout/PageLayout.js";

const LINK = { color: "#C8FF00", textDecoration: "none" };
const H2   = { fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(20px,2.5vw,28px)", color: "#fff", letterSpacing: "-0.02em", marginBottom: 16, marginTop: 48 };
const P    = { fontFamily: "var(--font-body)", fontSize: 16, color: "#bbb", lineHeight: 1.85, marginBottom: 20 };
const LI   = { fontFamily: "var(--font-body)", fontSize: 16, color: "#bbb", lineHeight: 1.85, marginBottom: 10 };

export default function PrivacyPage() {
  return (
    <PageLayout
      title="Privacy Policy — PassGeni"
      description="PassGeni's privacy policy. We collect nothing about your passwords. Zero data retention by design."
      canonical="https://passgeni.ai/privacy"
    >
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "80px var(--page-pad) 120px" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#555", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16 }}>Legal</div>
        <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(28px,4vw,48px)", color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 12 }}>Privacy Policy</h1>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#555", marginBottom: 48 }}>Last updated: March 2026 · Effective immediately</p>

        <p style={P}>PassGeni is built on a simple principle: <strong style={{ color: "#fff" }}>we can't leak what we never collect.</strong> Your passwords are generated entirely in your browser. They never touch our servers. This policy explains exactly what we do and don't collect.</p>

        <h2 style={H2}>What we do NOT collect</h2>
        <ul style={{ paddingLeft: 24, marginBottom: 24 }}>
          {["Your passwords — ever", "Your passphrase words", "Your compliance preset selections", "Your profession seed inputs", "Your password history (stored only in your browser session)", "Keystroke or typing data", "Browser fingerprint"].map(item => <li key={item} style={LI}>{item}</li>)}
        </ul>

        <h2 style={H2}>What we collect (minimal)</h2>
        <p style={P}>For the <strong style={{ color: "#fff" }}>free tools</strong> (generator, breach checker, strength checker, secure share, WiFi QR, audit, policy generator): we collect nothing. Zero. Your browser does all the work.</p>
        <p style={P}>For the <strong style={{ color: "#fff" }}>Team API plan</strong>, we collect:</p>
        <ul style={{ paddingLeft: 24, marginBottom: 24 }}>
          {["Your email address (for account authentication via magic link)", "Billing information processed by Paddle — we never see your card number", "API call counts per day (not the passwords generated, just the count)", "API key hashes (we store only the SHA-256 hash, never the raw key)"].map(item => <li key={item} style={LI}>{item}</li>)}
        </ul>

        <h2 style={H2}>Breach checker privacy</h2>
        <p style={P}>When you use our breach checker, we implement <strong style={{ color: "#fff" }}>k-anonymity</strong>. Only the first 5 characters of your password's SHA-1 hash are sent to the Have I Been Pwned API. The full hash never leaves your browser. HIBP cannot know which password you checked.</p>

        <h2 style={H2}>Secure Share</h2>
        <p style={P}>When you use Secure Share, the AES-256 decryption key is embedded in the URL fragment (#). Fragments are never transmitted to servers by browsers — this is a fundamental browser guarantee. Our servers receive only the encrypted payload, which is meaningless without the key.</p>

        <h2 style={H2}>Cookies</h2>
        <p style={P}>We use no advertising cookies, no tracking cookies, and no analytics cookies. The only cookies used are strictly necessary session cookies for authenticated Team plan users (NextAuth session). We do not use Google Analytics, Facebook Pixel, or any third-party tracking scripts.</p>

        <h2 style={H2}>Data retention</h2>
        <p style={P}>Free tool usage: zero retention. Team plan accounts: we retain your email, API usage counts, and billing records for as long as your account is active, plus 90 days after cancellation for dispute resolution. You may request deletion at any time.</p>

        <h2 style={H2}>Your rights</h2>
        <p style={P}>You have the right to access, correct, export, or delete any personal data we hold. Email us at <a href="mailto:privacy@passgeni.ai" style={LINK}>privacy@passgeni.ai</a> and we will respond within 5 business days.</p>

        <h2 style={H2}>Changes to this policy</h2>
        <p style={P}>If we make material changes, we'll update the date at the top of this page and notify Team plan users by email. Continued use of PassGeni after changes constitutes acceptance.</p>

        <h2 style={H2}>Contact</h2>
        <p style={P}>Questions? Email <a href="mailto:privacy@passgeni.ai" style={LINK}>privacy@passgeni.ai</a> or visit our <a href="/contact" style={LINK}>contact page</a>.</p>
      </main>
    </PageLayout>
  );
}
