import Head from "next/head";
import { useState } from "react";
import Header from "../components/layout/Header.js";
import Footer from "../components/layout/Footer.js";
import { IcCheck, IcX, IcShield, IcLock, IcStar, IcBolt, IcKey, IcAlert } from "../lib/icons.js";

const THREAT_MODEL = [
  {
    threat: "Forged certificate",
    mitigation: "ES256 (ECDSA P-256) signature. The private key never leaves PassGeni's servers. Any tampering invalidates the signature — verifiable offline against the public JWK.",
  },
  {
    threat: "Certificate replay",
    mitigation: "Each certificate has a unique JTI (JWT ID) and is tied to a specific user ID. The cert ID is immutable in the database.",
  },
  {
    threat: "Password extraction",
    mitigation: "Passwords are generated client-side and never transmitted to PassGeni servers. Only generation parameters (length, char classes, entropy) are sent for certification.",
  },
  {
    threat: "Account takeover",
    mitigation: "Passwordless sign-in via magic link (email). No password to steal or brute-force. Sessions expire and are revocable.",
  },
  {
    threat: "SQL injection",
    mitigation: "All database queries use parameterised Supabase SDK calls. No raw SQL string concatenation in the application layer.",
  },
  {
    threat: "CSRF",
    mitigation: "API routes require auth via session cookie (SameSite) or Bearer API key. No state-changing GET endpoints.",
  },
];

const DATA_STORE = [
  { stored: true,  item: "Certificate metadata (ID, compliance standard, entropy bits, generation params)" },
  { stored: true,  item: "Account email address" },
  { stored: true,  item: "Certificate view log (IP hash — not the IP itself)" },
  { stored: true,  item: "Usage events (cert generated, revoked — for anomaly detection)" },
  { stored: false, item: "Your passwords — ever, under any circumstance" },
  { stored: false, item: "Plaintext credentials of any kind" },
  { stored: false, item: "Password history" },
  { stored: false, item: "Raw IP addresses (only a 16-char HMAC hash)" },
];

function Section({ eyebrow, title, children }) {
  return (
    <section style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px 72px" }}>
      {eyebrow && (
        <div style={{ fontSize: 10, letterSpacing: "0.18em", color: "#555", marginBottom: 12, fontFamily: "Space Mono, monospace" }}>
          {eyebrow}
        </div>
      )}
      <h2 style={{ fontSize: "clamp(22px,3.5vw,30px)", fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", marginBottom: 32 }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function SecurityPage() {
  const [openThreat, setOpenThreat] = useState(null);

  return (
    <>
      <Head>
        <title>Security & Privacy — PassGeni</title>
        <meta name="description" content="PassGeni's zero-knowledge architecture, certificate trust model, threat model, and data storage policy. We cannot misuse what we never have." />
        <meta property="og:title" content="Security & Privacy — PassGeni" />
        <meta property="og:description" content="How PassGeni's zero-knowledge architecture ensures your passwords stay private while compliance certificates stay auditable." />
      </Head>
      <Header />

      <main style={{ background: "#060608", color: "#e0e0e0", fontFamily: "Outfit, sans-serif", minHeight: "100vh" }}>

        {/* Hero */}
        <section style={{ maxWidth: 860, margin: "0 auto", padding: "80px 24px 72px", textAlign: "center" }}>
          <div style={{ fontSize: 10, letterSpacing: "0.18em", color: "#555", marginBottom: 16, fontFamily: "Space Mono, monospace" }}>
            SECURITY & PRIVACY
          </div>
          <h1 style={{ fontSize: "clamp(28px,5vw,46px)", fontWeight: 800, letterSpacing: "-0.03em", color: "#fff", marginBottom: 20, lineHeight: 1.1 }}>
            PassGeni is built on a simple principle:<br />
            <span style={{ color: "#c8ff00" }}>we cannot misuse what we never have.</span>
          </h1>
          <p style={{ fontSize: 16, color: "#666", maxWidth: 560, margin: "0 auto", lineHeight: 1.75 }}>
            Your passwords are generated in your browser and never transmitted to our servers.
            Compliance certificates are cryptographically signed proofs — not copies of your credentials.
          </p>
        </section>

        {/* Zero-Knowledge vs Certified Mode */}
        <Section eyebrow="HOW IT WORKS" title="Zero-Knowledge Mode vs Certified Mode">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            {[
              {
                label: "Zero-Knowledge Mode",
                accent: "#c8ff00",
                Icon: IcShield,
                items: [
                  "Password generated entirely in your browser",
                  "crypto.getRandomValues — FIPS 140-3 entropy source",
                  "No server call — PassGeni never sees the password",
                  "No record created anywhere",
                  "Password never leaves your device",
                ],
              },
              {
                label: "Certified Mode",
                accent: "#60a5fa",
                Icon: IcKey,
                items: [
                  "You request a compliance certificate",
                  "Client sends generation params only — NOT the password",
                  "Server validates params against the chosen standard",
                  "ES256 JWT signed and stored with metadata",
                  "Password is never transmitted at any point",
                ],
              },
            ].map((col) => (
              <div key={col.label} style={{ background: "#0a0a0c", border: `1px solid ${col.accent}22`, borderRadius: 14, padding: "28px 24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                  <col.Icon size={16} color={col.accent} />
                  <div style={{ fontSize: 12, fontWeight: 700, color: col.accent, fontFamily: "Space Mono, monospace", letterSpacing: "0.06em" }}>
                    {col.label}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {col.items.map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, fontSize: 13, color: "#aaa", lineHeight: 1.55 }}>
                      <span style={{ color: col.accent, flexShrink: 0, marginTop: 2 }}>
                        <IcStar size={10} color={col.accent} />
                      </span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* What PassGeni certifies */}
        <Section eyebrow="CERTIFICATION SCOPE" title="What PassGeni certifies — and what it doesn't">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            <div style={{ background: "rgba(0,208,132,0.04)", border: "1px solid rgba(0,208,132,0.2)", borderRadius: 14, padding: "28px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <IcCheck size={14} color="#00d084" />
                <div style={{ fontSize: 11, fontWeight: 700, color: "#00d084", fontFamily: "Space Mono, monospace", letterSpacing: "0.08em" }}>CERTIFIES</div>
              </div>
              <p style={{ fontSize: 13, color: "#aaa", lineHeight: 1.7, margin: 0 }}>
                A credential generated using PassGeni's engine with documented parameters — entropy source, character pool size, length, and compliance standard met.
                The certificate is proof that <em style={{ color: "#ccc" }}>PassGeni's generation engine produced a credential with these properties</em> at a specific point in time.
              </p>
            </div>
            <div style={{ background: "rgba(255,68,68,0.04)", border: "1px solid rgba(255,68,68,0.2)", borderRadius: 14, padding: "28px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <IcX size={14} color="#ff6b6b" />
                <div style={{ fontSize: 11, fontWeight: 700, color: "#ff6b6b", fontFamily: "Space Mono, monospace", letterSpacing: "0.08em" }}>DOES NOT CERTIFY</div>
              </div>
              <p style={{ fontSize: 13, color: "#aaa", lineHeight: 1.7, margin: 0 }}>
                External passwords typed or pasted by users. PassGeni cannot verify what it didn't generate.
                The generation session token mechanism enforces this — certificates require a server-signed token that can only be issued after PassGeni validates the generation parameters.
              </p>
            </div>
          </div>
        </Section>

        {/* Certificate trust model */}
        <Section eyebrow="CERTIFICATE TRUST MODEL" title="How certificate verification works">
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { num: "01", title: "Offline verification", body: "No PassGeni server is required to verify a certificate. Fetch the public JWK once from passgeni.ai/.well-known/jwks.json, then verify the ES256 signature locally with any standard JWT library (jose, jsonwebtoken, etc.)." },
              { num: "02", title: "Public key published", body: "PassGeni's signing public key is at passgeni.ai/.well-known/jwks.json in standard JWKS format. It can be fetched by any auditor, at any time, without authentication." },
              { num: "03", title: "Unforgeable signatures", body: "ES256 (ECDSA P-256 / SHA-256) — the private key never leaves PassGeni's servers. A certificate with a valid signature was issued by PassGeni. Any tampering with the certificate body invalidates the signature." },
              { num: "04", title: "Online revocation status", body: "Revocation is an online check — visit /cert/[id] for real-time status. Offline signature verification confirms authenticity only; it does not confirm the certificate hasn't been revoked by its owner." },
            ].map((step) => (
              <div key={step.num} style={{ display: "flex", gap: 20, background: "#0a0a0c", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "22px 24px", alignItems: "flex-start" }}>
                <div style={{ fontFamily: "Space Mono, monospace", fontSize: 22, fontWeight: 700, color: "rgba(200,255,0,0.25)", flexShrink: 0, lineHeight: 1 }}>{step.num}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 6 }}>{step.title}</div>
                  <div style={{ fontSize: 13, color: "#777", lineHeight: 1.7 }}>{step.body}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Threat model */}
        <Section eyebrow="THREAT MODEL" title="Threats and mitigations">
          <div style={{ border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, overflow: "hidden" }}>
            {THREAT_MODEL.map((row, i) => (
              <div
                key={row.threat}
                style={{ borderBottom: i < THREAT_MODEL.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", cursor: "pointer" }}
                onClick={() => setOpenThreat(openThreat === i ? null : i)}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", gap: 16, background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#facc15", flexShrink: 0, display: "inline-block" }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#ccc" }}>{row.threat}</span>
                  </div>
                  <span style={{ color: "#c8ff00", fontSize: 18, flexShrink: 0, lineHeight: 1, fontWeight: 300 }}>{openThreat === i ? "−" : "+"}</span>
                </div>
                {openThreat === i && (
                  <div style={{ padding: "0 24px 18px 46px", fontSize: 13, color: "#888", lineHeight: 1.75 }}>
                    {row.mitigation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>

        {/* Data storage */}
        <Section eyebrow="DATA STORAGE POLICY" title="What we store vs. what we never store">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {DATA_STORE.map((row) => (
              <div key={row.item} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <span style={{ flexShrink: 0, marginTop: 2 }}>
                  {row.stored
                    ? <IcCheck size={14} color="#00d084" />
                    : <IcX size={14} color="#ff6b6b" />}
                </span>
                <span style={{ fontSize: 13, color: row.stored ? "#aaa" : "#666", lineHeight: 1.6 }}>
                  {row.stored ? "" : <span style={{ fontWeight: 600, color: "#ff6b6b" }}>NEVER: </span>}
                  {row.item}
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/* Open source + contact */}
        <section style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px 100px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            <div style={{ background: "#0a0a0c", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "28px 24px" }}>
              <div style={{ fontSize: 11, color: "#555", fontFamily: "Space Mono, monospace", letterSpacing: "0.08em", marginBottom: 12 }}>OPEN REVIEW</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 10 }}>Certificate validation logic</h3>
              <p style={{ fontSize: 13, color: "#777", lineHeight: 1.7, marginBottom: 16 }}>
                The compliance validation engine and certificate signing logic are open for review on GitHub.
              </p>
              <a href="https://github.com/Giant-Tech-Solutions-llc/Passgeni-v2" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: "#c8ff00", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
                View on GitHub →
              </a>
            </div>
            <div style={{ background: "#0a0a0c", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "28px 24px" }}>
              <div style={{ fontSize: 11, color: "#555", fontFamily: "Space Mono, monospace", letterSpacing: "0.08em", marginBottom: 12 }}>RESPONSIBLE DISCLOSURE</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 10 }}>Found a vulnerability?</h3>
              <p style={{ fontSize: 13, color: "#777", lineHeight: 1.7, marginBottom: 16 }}>
                Please report security issues privately. We respond within 48 hours and credit researchers in our changelog.
              </p>
              <a href="mailto:security@passgeni.ai" style={{ fontSize: 13, color: "#c8ff00", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
                <IcAlert size={13} color="#c8ff00" />
                security@passgeni.ai →
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
