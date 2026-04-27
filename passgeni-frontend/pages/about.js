// =============================================================
// PASSGENI — ABOUT PAGE
// passgeni.ai/about
// =============================================================

import Head from "next/head";
import { motion } from "framer-motion";
import Header from "../components/layout/Header.js";
import Footer from "../components/layout/Footer.js";
import { sectionHeadReveal, bcCard, heroEntrance, btnPrimary, btnGhost } from "../lib/motion.js";
import { IcStar, IcShield, IcBolt, IcLock, IcCheck } from "../lib/icons.js";

// ── CHARS for background streams ──────────────────────────────
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
function Stream({ left, delay, dur, op }) {
  const txt = Array.from({ length: 22 }, () =>
    CHARS[Math.floor(Math.random() * CHARS.length)]
  ).join("");
  return (
    <div
      aria-hidden
      style={{
        position: "absolute", left: left + "%", top: "100%",
        fontFamily: "var(--font-body)", fontSize: 11,
        color: "var(--accent)", opacity: op,
        letterSpacing: ".05em", lineHeight: 2.2,
        writingMode: "vertical-rl",
        animation: `passwordStream ${dur}s ${delay}s linear infinite`,
        pointerEvents: "none", userSelect: "none",
      }}
    >
      {txt}
    </div>
  );
}

const STREAMS = [
  { left: 4,  delay: 0,   dur: 14, op: .04 },
  { left: 14, delay: 3,   dur: 18, op: .03 },
  { left: 26, delay: 1,   dur: 12, op: .05 },
  { left: 40, delay: 5,   dur: 16, op: .03 },
  { left: 56, delay: 2,   dur: 20, op: .04 },
  { left: 68, delay: 7,   dur: 13, op: .03 },
  { left: 80, delay: 4,   dur: 17, op: .05 },
  { left: 92, delay: 1.5, dur: 15, op: .03 },
];

// Icon helper for trust chips
function TrustIcon({ type }) {
  if (type === "star")   return <IcStar size={12} color="rgba(200,255,0,0.5)" />;
  if (type === "shield") return <IcShield size={12} color="rgba(200,255,0,0.5)" />;
  if (type === "bolt")   return <IcBolt size={12} color="rgba(200,255,0,0.5)" />;
  if (type === "lock")   return <IcLock size={12} color="rgba(200,255,0,0.5)" />;
  if (type === "check")  return <IcCheck size={12} color="rgba(200,255,0,0.5)" />;
  return <IcStar size={12} color="rgba(200,255,0,0.5)" />;
}

const TRUST_POINTS = [
  { iconType: "lock",   label: "Zero storage" },
  { iconType: "star",   label: "Client-side only" },
  { iconType: "check",  label: "NIST SP\u00a0800-63B" },
  { iconType: "shield", label: "Zero knowledge" },
  { iconType: "bolt",   label: "No account needed" },
];

const HOW_STEPS = [
  {
    step: "01",
    title: "You set your preferences",
    body: "Pick your profession, length, and options. Your choices stay in the browser tab. They are never transmitted — not even to check compliance requirements.",
    accent: "Local only",
  },
  {
    step: "02",
    title: "crypto.getRandomValues() runs",
    body: "The same cryptographic primitive used in HTTPS, banking infrastructure, and government systems. Not Math.random(). Not a server call. The gold standard, running on your device.",
    accent: "FIPS 140-3 entropy",
  },
  {
    step: "03",
    title: "Your password appears",
    body: "Open DevTools. Go to the Network tab. Generate a password. Watch nothing happen. That is not a marketing claim. That is verifiable architecture you can confirm yourself right now.",
    accent: "Verify it yourself",
  },
  {
    step: "04",
    title: "Need a certificate? Certified Mode activates.",
    body: "When you request a compliance certificate, only your generation parameters — length, character classes, compliance standard — are sent to our server. Never the password itself. The server validates the parameters and signs a certificate. Two modes, one guarantee: your password never travels.",
    accent: "Zero-knowledge by design",
  },
];

const VALUES = [
  {
    iconType: "lock",
    title: "Zero Storage — Always",
    body: "We don't store your passwords. We can't — the architecture makes it technically impossible. Even a full breach of our servers reveals nothing about any password ever generated.",
  },
  {
    iconType: "star",
    title: "No Dark Patterns — Ever",
    body: "No countdown timers. No hiding the free tier behind friction. No ads. No selling access to your behavior. If something feels manipulative, we won't build it.",
  },
  {
    iconType: "bolt",
    title: "Honest Limits — Upfront",
    body: "The free tier is real. Unlimited password generation, no account required, no data collected. Compliance certificates are limited to 3 per month on the free plan. We make money from Assurance and Authority plans — not from monetizing your security choices.",
  },
];

const PLEDGES = [
  {
    title: "We will never sell your data",
    body: "Because we don't have any. Generation happens in your browser. We have no record of what you generated, when, or for which account.",
  },
  {
    title: "We will never add analytics to the generation event",
    body: "If we ever need to understand usage, we use aggregated non-identifying metrics — never anything touching generation itself.",
  },
  {
    title: "We will tell you when the architecture changes",
    body: "Any change to how PassGeni generates passwords is disclosed in our changelog before it ships, with a technical explanation of what changed and why.",
  },
  {
    title: "We will always maintain a genuinely free tier",
    body: "The free tier exists because everyone deserves strong password generation. If that changes, we will give 90 days notice.",
  },
];

const schema = [
  {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About PassGeni",
    "description": "PassGeni was built on one conviction: your password should never touch a server.",
    "url": "https://passgeni.ai/about",
    "publisher": { "@type": "Organization", "name": "PassGeni", "url": "https://passgeni.ai" },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "PassGeni", "item": "https://passgeni.ai" },
      { "@type": "ListItem", "position": 2, "name": "About",    "item": "https://passgeni.ai/about" },
    ],
  },
];

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About PassGeni — Why We Built It, How It Works, and Who We Are</title>
        <meta name="description" content="PassGeni was built on one conviction: your password should never touch a server. Learn the story, the architecture, and the people behind zero-knowledge password generation." />
        <link rel="canonical" href="https://passgeni.ai/about" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </Head>

      <div style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
        <Header />

        {/* ── S1 · HERO ────────────────────────────────────────── */}
        <section className="hero-section" aria-labelledby="about-headline">
          {/* Grid */}
          <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(200,255,0,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(200,255,0,0.035) 1px,transparent 1px)", backgroundSize: "clamp(40px,8vw,80px) clamp(40px,8vw,80px)", animation: "gridPulse 6s ease infinite", pointerEvents: "none" }} />
          {/* Radial glow */}
          <div aria-hidden style={{ position: "absolute", top: "50%", left: "50%", width: "min(80vw,900px)", height: "min(80vw,900px)", background: "radial-gradient(circle,rgba(200,255,0,0.065) 0%,transparent 65%)", transform: "translate(-50%,-50%)", pointerEvents: "none" }} />
          {/* Rings */}
          {[0, 1.8, 3.6].map((d, i) => (
            <div key={i} aria-hidden style={{ position: "absolute", top: "50%", left: "50%", width: "min(600px,80vw)", height: "min(600px,80vw)", border: "1px solid rgba(200,255,0,0.09)", borderRadius: "50%", animation: `ringExpand 5.4s ${d}s ease-out infinite`, pointerEvents: "none" }} />
          ))}
          {/* Streams */}
          <div aria-hidden style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
            {STREAMS.map((s, i) => <Stream key={i} {...s} />)}
          </div>

          <div style={{ position: "relative", zIndex: 10, textAlign: "center", width: "100%", maxWidth: 920, margin: "0 auto" }}>
            {/* Badge */}
            <motion.div {...heroEntrance(0)} style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(13,13,16,0.9)", border: "1px solid rgba(200,255,0,0.15)", borderRadius: 100, padding: "8px clamp(16px,3vw,22px)", marginBottom: "clamp(28px,5vw,48px)" }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 12px var(--accent)", animation: "blink 2s ease infinite", flexShrink: 0 }} />
              <span style={{ fontFamily: "var(--font-body)", fontSize: "clamp(9px,1.4vw,11px)", fontWeight: 600, color: "rgba(200,255,0,.8)", letterSpacing: ".14em", textTransform: "uppercase" }}>Our Story</span>
            </motion.div>

            {/* H1 */}
            <motion.h1
              id="about-headline"
              className="hero-headline"
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
              style={{ marginBottom: 0 }}
            >
              We built PassGeni{"\n"}
              because we got tired{"\n"}
              <span style={{ color: "var(--accent)" }}>of trusting servers.</span>
            </motion.h1>

            {/* Sub */}
            <motion.p
              className="hero-sub"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
              style={{ marginTop: "clamp(20px,3vw,36px)", marginBottom: "clamp(28px,5vw,52px)" }}
            >
              Every password generator we tried was making network requests during generation.
              Some logged inputs. None disclosed it clearly.
              So we built something different.
            </motion.p>

            {/* Trust chips */}
            <motion.div className="hero-trust" {...heroEntrance(0.55)}>
              {TRUST_POINTS.map(({ iconType, label }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <TrustIcon type={iconType} />
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "clamp(9px,1.2vw,11px)", fontWeight: 600, color: "var(--muted)", letterSpacing: ".08em", textTransform: "uppercase" }}>{label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── S2 · ORIGIN STORY ───────────────────────────────── */}
        <section style={{ padding: "var(--section) var(--pad)", maxWidth: 1200, margin: "0 auto" }}>
          <div className="section-header">
            <div className="eyebrow" style={{ justifyContent: "center" }}>Where This Started</div>
            <motion.h2 {...sectionHeadReveal} style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(26px,5vw,52px)", color: "var(--text)", letterSpacing: "-.03em", lineHeight: 1.05, maxWidth: 640, margin: "0 auto" }}>
              A password generator that stores your passwords isn&apos;t a tool.{" "}
              <span style={{ color: "var(--accent)" }}>It&apos;s a liability.</span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.1 }}
            style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}
          >
            {[
              "In 2021, we were building internal security tooling for a small team. We tried every major generator. They were fine. Until we opened DevTools.",
              "Most were making network requests on generation. Some logged inputs. A few had third-party analytics running during the generation event itself.",
              "If a password generator's server gets breached, every password ever generated on that platform is potentially compromised. Not stored passwords — generated ones. The ones you're using right now on your bank account, your work systems, your email.",
              "That is the problem PassGeni exists to solve.",
            ].map((para, i) => (
              <p
                key={i}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-md)",
                  color: i === 3 ? "var(--text)" : "var(--muted)",
                  lineHeight: 1.85,
                  marginBottom: i === 3 ? 0 : 22,
                  fontWeight: i === 3 ? 600 : 400,
                }}
              >
                {para}
              </p>
            ))}
          </motion.div>
        </section>

        {/* ── S3 · MANIFESTO ───────────────────────────────────── */}
        <section style={{ background: "#0a0a0c", borderTop: "1px solid rgba(200,255,0,0.08)", borderBottom: "1px solid rgba(200,255,0,0.08)", padding: "80px var(--pad)" }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}
          >
            <blockquote style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "clamp(22px,3.5vw,36px)", color: "var(--text)", lineHeight: 1.35, letterSpacing: "-.02em", margin: "0 0 24px" }}>
              &ldquo;Zero storage isn&apos;t a feature.<br />
              It&apos;s a promise we made before<br />
              we wrote a single line of code.&rdquo;
            </blockquote>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)", margin: 0, fontStyle: "italic" }}>
              — The principle behind every decision PassGeni has made since day one
            </p>
          </motion.div>
        </section>

        {/* ── S4 · ARCHITECTURE ────────────────────────────────── */}
        <section style={{ padding: "var(--section) var(--pad)", maxWidth: 1200, margin: "0 auto" }}>
          <div className="section-header">
            <div className="eyebrow" style={{ justifyContent: "center" }}>The Architecture</div>
            <motion.h2 {...sectionHeadReveal} style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(26px,5vw,52px)", color: "var(--text)", letterSpacing: "-.03em", lineHeight: 1.05, maxWidth: 520, margin: "0 auto" }}>
              Your browser generates it.{"\n"}Your browser keeps it.{"\n"}
              <span style={{ color: "var(--accent)" }}>Nothing leaves.</span>
            </motion.h2>
          </div>
          <div className="grid-cards">
            {HOW_STEPS.map((step, i) => (
              <motion.article key={step.step} {...bcCard(i)} className="bc bc-a">
                <div className="bc-line" />
                <div style={{ fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700, color: "var(--accent)", letterSpacing: ".14em", marginBottom: 16, textTransform: "uppercase" }}>{step.step}</div>
                <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(16px,2.5vw,20px)", color: "var(--text)", marginBottom: 12, letterSpacing: "-.02em" }}>{step.title}</h3>
                <p style={{ fontSize: "var(--text-base)", color: "var(--muted)", lineHeight: 1.8, flex: 1, marginBottom: 20 }}>{step.body}</p>
                <div style={{ display: "inline-block", background: "rgba(200,255,0,0.06)", border: "1px solid rgba(200,255,0,0.15)", borderRadius: 6, padding: "5px 12px", fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 600, color: "rgba(200,255,0,.7)", letterSpacing: ".06em" }}>{step.accent}</div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* ── S5 · THREE NON-NEGOTIABLES ──────────────────────── */}
        <section style={{ padding: "0 var(--pad) var(--section)", maxWidth: 1200, margin: "0 auto" }}>
          <div className="section-header">
            <div className="eyebrow" style={{ justifyContent: "center" }}>How We Operate</div>
            <motion.h2 {...sectionHeadReveal} style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(26px,5vw,52px)", color: "var(--text)", letterSpacing: "-.03em" }}>
              Three things we will<br /><span style={{ color: "var(--accent)" }}>never compromise on.</span>
            </motion.h2>
          </div>
          <div className="grid-cards">
            {VALUES.map((card, i) => (
              <motion.article key={card.title} {...bcCard(i)} className="bc bc-a">
                <div className="bc-line" />
                <div style={{ marginBottom: 16, color: "var(--accent)", lineHeight: 1 }}>
                  <TrustIcon type={card.iconType} />
                </div>
                <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(15px,2vw,17px)", color: "var(--text)", marginBottom: 10, letterSpacing: "-.02em", lineHeight: 1.3 }}>{card.title}</h3>
                <p style={{ fontSize: "var(--text-base)", color: "var(--muted)", lineHeight: 1.8 }}>{card.body}</p>
              </motion.article>
            ))}
          </div>
        </section>

        {/* ── S6 · STATS BAR ───────────────────────────────────── */}
        <section style={{ padding: "0 var(--pad) var(--section)", maxWidth: 1200, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", background: "var(--border)", borderRadius: "var(--radius-l)", overflow: "hidden", gap: 1 }}
            className="about-stats"
          >
            {[
              { value: "256-bit",   label: "Minimum entropy" },
              { value: "0 bytes",   label: "of your data stored" },
              { value: "6+",        label: "Compliance frameworks" },
              { value: "<1 second", label: "Generation time" },
            ].map((s) => (
              <div key={s.value} style={{ background: "var(--bg)", padding: "clamp(24px,3vw,40px) clamp(20px,2.5vw,32px)", textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(22px,3vw,36px)", color: "var(--accent)", letterSpacing: "-.02em", marginBottom: 8, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: "clamp(11px,1.2vw,13px)", color: "var(--muted)", lineHeight: 1.5 }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
          <style>{`@media(max-width:560px){.about-stats{grid-template-columns:1fr 1fr!important}}`}</style>
        </section>

        {/* ── S7 · TEAM PHILOSOPHY ────────────────────────────── */}
        <section style={{ padding: "0 var(--pad) var(--section)", maxWidth: 1200, margin: "0 auto" }}>
          <div className="section-header">
            <div className="eyebrow" style={{ justifyContent: "center" }}>Who We Are</div>
            <motion.h2 {...sectionHeadReveal} style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(26px,5vw,52px)", color: "var(--text)", letterSpacing: "-.03em" }}>
              A small team with an unreasonable<br />
              <span style={{ color: "var(--accent)" }}>commitment to one thing.</span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}
          >
            {[
              "PassGeni is built by a small team of engineers and security researchers who believe that good security tooling should be auditable, honest, and boring in the best possible way.",
              "Boring meaning: it does exactly what it says. Nothing more. No surprise features. No hidden behavior. No pivot to an \u201cAI-powered insights platform\u201d that requires uploading your passwords to train a model.",
              "We're not trying to be your everything-security-platform. We're trying to be the one tool you reach for when you need a strong password — and trust completely when you do.",
              "That focus is the product. That restraint is the feature.",
            ].map((para, i) => (
              <p
                key={i}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-md)",
                  color: i === 3 ? "var(--text)" : "var(--muted)",
                  lineHeight: 1.85,
                  marginBottom: i === 3 ? 40 : 22,
                  fontWeight: i === 3 ? 600 : 400,
                }}
              >
                {para}
              </p>
            ))}

            <div className="hero-trust" style={{ justifyContent: "center", flexWrap: "wrap" }}>
              {[
                { iconType: "lock",   label: "Founded 2021" },
                { iconType: "star",   label: "Bootstrapped" },
                { iconType: "check",  label: "Client-side" },
                { iconType: "shield", label: "NIST SP\u00a0800-63B" },
                { iconType: "bolt",   label: "Zero breach history" },
              ].map(({ iconType, label }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <TrustIcon type={iconType} />
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "clamp(9px,1.2vw,11px)", fontWeight: 600, color: "var(--muted)", letterSpacing: ".08em", textTransform: "uppercase" }}>{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── S8 · TRANSPARENCY PLEDGE ────────────────────────── */}
        <section style={{ padding: "0 var(--pad) var(--section)", maxWidth: 1200, margin: "0 auto" }}>
          <div className="section-header">
            <div className="eyebrow" style={{ justifyContent: "center" }}>Our Commitment</div>
            <motion.h2 {...sectionHeadReveal} style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(26px,5vw,52px)", color: "var(--text)", letterSpacing: "-.03em" }}>
              Things we will tell you straight.
            </motion.h2>
          </div>

          <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: 0 }}>
            {PLEDGES.map((pledge, i) => (
              <motion.div
                key={pledge.title}
                {...bcCard(i)}
                style={{
                  textAlign: "center",
                  marginBottom: i < PLEDGES.length - 1 ? 36 : 0,
                }}
              >
                <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "clamp(15px,1.8vw,17px)", color: "var(--text)", marginBottom: 10, letterSpacing: "-.01em", lineHeight: 1.35 }}>
                  {pledge.title}
                </h3>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-base)", color: "var(--muted)", lineHeight: 1.85, margin: 0 }}>
                  {pledge.body}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── S9 · CTA CLOSE ───────────────────────────────────── */}
        <section style={{ padding: "0 var(--pad) var(--section)", maxWidth: 1200, margin: "0 auto" }}>
          <div className="section-header">
            <div className="eyebrow" style={{ justifyContent: "center" }}>Ready When You Are</div>
            <motion.h2 {...sectionHeadReveal} style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(26px,5vw,52px)", color: "var(--text)", letterSpacing: "-.03em" }}>
              Generate your first password.<br />
              <span style={{ color: "var(--accent)" }}>No account. No data. No catch.</span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.15 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "clamp(24px,4vw,36px)" }}
          >
            <div style={{ display: "flex", gap: "clamp(10px,1.5vw,14px)", justifyContent: "center", flexWrap: "wrap" }}>
              <motion.a href="/pricing" className="btn-ghost" {...btnGhost} style={{ fontSize: "clamp(13px,1.6vw,15px)", padding: "clamp(14px,1.8vw,16px) clamp(24px,3vw,36px)" }}>
                See plans →
              </motion.a>
            </div>

            <div className="hero-trust">
              {[
                { iconType: "lock",   label: "Zero storage" },
                { iconType: "star",   label: "Client-side only" },
                { iconType: "check",  label: "NIST SP\u00a0800-63B" },
                { iconType: "shield", label: "Free forever" },
              ].map(({ iconType, label }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <TrustIcon type={iconType} />
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "clamp(9px,1.2vw,11px)", fontWeight: 600, color: "var(--muted)", letterSpacing: ".08em", textTransform: "uppercase" }}>{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        <Footer />
      </div>
    </>
  );
}
