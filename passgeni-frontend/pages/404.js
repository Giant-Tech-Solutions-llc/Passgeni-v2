// =============================================================
// PASSGENI — 404 NOT FOUND PAGE
// =============================================================

import { motion } from "framer-motion";
import { btnPrimary, btnGhost } from "../lib/motion.js";
import PageLayout from "../components/layout/PageLayout.js";
import { IcArrow } from "../lib/icons.js";

export default function NotFoundPage() {
  return (
    <PageLayout
      title="Page Not Found | PassGeni"
      description="This page doesn't exist."
      canonical="https://passgeni.ai"
    >
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px var(--page-pad)",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Watermark */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontFamily: "var(--font-heading)",
            fontWeight: 900,
            fontSize: "clamp(200px,40vw,400px)",
            color: "rgba(200,255,0,0.025)",
            letterSpacing: "-0.05em",
            lineHeight: 1,
            userSelect: "none",
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          404
        </div>

        {/* Content */}
        <div style={{ position: "relative", zIndex: 10, maxWidth: 560 }}>
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "#444",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              Error
            </div>
            <div
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 900,
                fontSize: "clamp(120px,20vw,200px)",
                color: "var(--accent)",
                letterSpacing: "-0.06em",
                lineHeight: 0.9,
                marginBottom: 32,
              }}
            >
              404
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
          >
            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 800,
                fontSize: "clamp(20px,3vw,28px)",
                color: "var(--text)",
                letterSpacing: "-0.025em",
                marginBottom: 16,
                lineHeight: 1.2,
              }}
            >
              This page doesn&apos;t exist.
            </h1>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 16,
                color: "var(--muted)",
                lineHeight: 1.8,
                marginBottom: 40,
                maxWidth: 420,
                margin: "0 auto 40px",
              }}
            >
              Maybe it was moved, deleted, or never existed. The generator still works.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.28 }}
            style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}
          >
            <motion.a
              href="/"
              className="btn-primary"
              {...btnPrimary}
              style={{ animation: "none", display: "inline-flex", alignItems: "center", gap: 8 }}
            >
              <IcArrow size={14} color="#050507" dir="left" />
              Go Home
            </motion.a>
            <motion.a
              href="/#generator"
              className="btn-ghost"
              {...btnGhost}
            >
              Try the Generator
            </motion.a>
          </motion.div>
        </div>
      </main>
    </PageLayout>
  );
}
