import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRemindDismissed } from "../../lib/useRemindDismissed.js";
import { IcCheck } from "../../lib/icons.js";

const PLANS = [
  {
    key:     "assurance",
    name:    "Assurance",
    price:   "$19/mo",
    badge:   null,
    features: [
      "Unlimited compliance certificates",
      "All 6 standards (HIPAA, PCI-DSS, SOC 2, ISO 27001, NIST, FIPS)",
      "Certificate sharing + QR codes",
      "JSON certificate export",
    ],
    href: "/auth/signin?callbackUrl=/checkout?plan=assurance&billing=monthly",
  },
  {
    key:     "authority",
    name:    "Authority",
    price:   "$59/mo",
    badge:   "Most Popular",
    features: [
      "Everything in Assurance",
      "REST API — 10,000 calls/day",
      "Bulk generator (500 at once)",
      "10 team seats",
      "CSV export + audit logs",
    ],
    href: "/auth/signin?callbackUrl=/checkout?plan=authority&billing=monthly",
  },
];

/**
 * UpgradeModal
 * Props:
 *   open      — boolean
 *   onClose   — () => void
 *   reason    — "LIMIT_REACHED" | "UPGRADE_REQUIRED"
 *   used      — number (certs used this month, only for LIMIT_REACHED)
 *   limit     — number
 */
export default function UpgradeModal({ open, onClose, reason, used, limit }) {
  const { data: session } = useSession();
  const overlayRef = useRef(null);
  const [remindDismissed, dismissRemind] = useRemindDismissed();

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const isLimit   = reason === "LIMIT_REACHED";
  const isTrialing = session?.user?.planStatus === "trialing";

  const headline = isLimit
    ? `You've used all ${limit ?? 3} free certificates this month.`
    : "This compliance standard requires a paid plan.";

  const subtext = isLimit
    ? "Upgrade to Assurance for unlimited certificates and all compliance standards."
    : "HIPAA, PCI-DSS, SOC 2, ISO 27001, and FIPS 140-3 are available on Assurance and Authority.";

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      style={{
        position:        "fixed",
        inset:           0,
        background:      "rgba(0,0,0,0.72)",
        backdropFilter:  "blur(8px)",
        zIndex:          1000,
        display:         "flex",
        alignItems:      "center",
        justifyContent:  "center",
        padding:         24,
        animation:       "fadeIn 0.18s ease",
      }}
    >
      <div style={{
        background:   "#0a0a0c",
        border:       "1px solid rgba(200,255,0,0.2)",
        borderRadius: 16,
        maxWidth:     640,
        width:        "100%",
        overflow:     "hidden",
        position:     "relative",
      }}>
        {/* top accent line */}
        <div style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(200,255,0,.5),transparent)" }} />

        {/* header */}
        <div style={{ padding: "28px 28px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div style={{ fontSize: 10, color: "#c8ff00", letterSpacing: "0.14em", fontWeight: 700 }}>
              {isLimit ? "CERTIFICATE LIMIT REACHED" : "PLAN UPGRADE REQUIRED"}
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", color: "#555", fontSize: 20, cursor: "pointer", lineHeight: 1, padding: "0 4px" }}>×</button>
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: 8, lineHeight: 1.3 }}>
            {headline}
          </h2>
          <p style={{ fontSize: 13, color: "#666", lineHeight: 1.65, marginBottom: 24 }}>
            {subtext}
          </p>
          {isTrialing && (
            <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(200,255,0,0.07)", border: "1px solid rgba(200,255,0,0.15)", fontSize: 12, color: "#c8ff00", marginBottom: 24 }}>
              Your 14-day Assurance trial includes 3 free NIST certificates. Upgrade to unlock all standards + unlimited certs.
            </div>
          )}
        </div>

        {/* plan cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: "0 28px 28px" }}>
          {PLANS.map((plan) => (
            <div key={plan.key} style={{
              position:     "relative",
              background:   plan.badge ? "rgba(200,255,0,0.04)" : "rgba(255,255,255,0.02)",
              border:       `1px solid ${plan.badge ? "rgba(200,255,0,0.25)" : "rgba(255,255,255,0.07)"}`,
              borderRadius: 12,
              padding:      "20px",
            }}>
              {plan.badge && (
                <div style={{ position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)", background: "#c8ff00", color: "#000", fontSize: 9, fontWeight: 700, letterSpacing: ".1em", padding: "4px 14px", borderRadius: "0 0 8px 8px" }}>
                  {plan.badge.toUpperCase()}
                </div>
              )}
              <div style={{ paddingTop: plan.badge ? 12 : 0 }}>
                <div style={{ fontSize: 11, color: "#888", fontWeight: 700, letterSpacing: ".08em", marginBottom: 6 }}>{plan.name.toUpperCase()}</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: "-.03em", marginBottom: 16 }}>{plan.price}</div>
                {plan.features.map((f, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 7 }}>
                    <span style={{ color: "var(--accent)", flexShrink: 0, marginTop: 2, display: "flex" }}><IcCheck size={12} color="var(--accent)" /></span>
                    <span style={{ fontSize: 12, color: "#aaa", lineHeight: 1.45 }}>{f}</span>
                  </div>
                ))}
                <a
                  href={session ? plan.href.replace("/auth/signin?callbackUrl=", "") : plan.href}
                  style={{
                    display:        "block",
                    marginTop:      18,
                    padding:        "10px 0",
                    borderRadius:   8,
                    textAlign:      "center",
                    fontWeight:     800,
                    fontSize:       13,
                    textDecoration: "none",
                    background:     plan.badge ? "#c8ff00" : "transparent",
                    color:          plan.badge ? "#000" : "#c8ff00",
                    border:         plan.badge ? "none" : "1px solid rgba(200,255,0,0.3)",
                  }}
                >
                  Get {plan.name} →
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* footer */}
        <div style={{ padding: "14px 28px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, color: "#444" }}>14-day free trial · No card required</span>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {isLimit && !remindDismissed && (
              <button
                onClick={() => { dismissRemind(); onClose(); }}
                style={{ background: "transparent", border: "none", fontSize: 12, color: "#444", cursor: "pointer", padding: "4px 8px" }}
              >
                Remind me next month
              </button>
            )}
            <a href="/pricing" style={{ fontSize: 12, color: "#555", textDecoration: "none" }}>Compare all plans →</a>
          </div>
        </div>
      </div>
    </div>
  );
}
