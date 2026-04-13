// =============================================================
// PASSGENI — 404 NOT FOUND PAGE
// =============================================================

import { motion } from "framer-motion";
import { btnPrimary, btnGhost } from "../lib/motion.js";
import PageLayout from "../components/layout/PageLayout.js";

export default function NotFoundPage() {
  return (
    <PageLayout
      title="Page Not Found | PassGeni"
      description="This page doesn't exist."
      canonical="https://passgeni.ai"
    >
      <main style={{ maxWidth: 760, margin: "0 auto", padding: "120px var(--page-pad)", textAlign: "center" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#555", letterSpacing: "0.1em", marginBottom: 16 }}>ERROR 404</div>
        <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(40px,8vw,100px)", color: "#fff", letterSpacing: "-0.05em", lineHeight: 1, marginBottom: 24 }}>
          Not<br /><span style={{ color: "#C8FF00" }}>found.</span>
        </h1>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 16, color: "#888", marginBottom: 40, lineHeight: 1.8 }}>
          This page doesn't exist or was moved.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <motion.a href="/"       className="btn-primary" {...btnPrimary} style={{ animation: "none" }}>← Back to home</motion.a>
          <motion.a href="/guides" className="btn-ghost"   {...btnGhost}>Browse guides</motion.a>
          <motion.a href="/tools"  className="btn-ghost"   {...btnGhost}>View tools</motion.a>
        </div>
      </main>
    </PageLayout>
  );
}
