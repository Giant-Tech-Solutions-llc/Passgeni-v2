import Head from "next/head";
import Header from "../components/layout/Header.js";
import Footer from "../components/layout/Footer.js";
import { useRef, useState, useEffect, useCallback } from "react";
import { useSession, signIn } from "next-auth/react";
import { motion, useInView } from "framer-motion";
import dynamic from "next/dynamic";
import { getSiteSchema, getFAQSchema, getHowToSchema } from "../seo/schema.js";
import { FAQ } from "../content/copy.js";

/* ─── SVG Icon library (brand-aligned, solid style) ─────────────────────── */
const IC = "var(--accent)"; // default brand accent

const IconCheck = ({ size = 12, color = "#4ade80" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ display:"inline-block", flexShrink:0, verticalAlign:"middle" }}>
    <path d="M20 6L9 17l-5-5" />
  </svg>
);
const IconX = ({ size = 12, color = "#ff6b6b" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ display:"inline-block", flexShrink:0, verticalAlign:"middle" }}>
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);
const IconLock = ({ size = 16, color = IC }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ display:"inline-block", flexShrink:0, verticalAlign:"middle" }}>
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);
const IconCert = ({ size = 14, color = "#4ade80" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ display:"inline-block", flexShrink:0, verticalAlign:"middle" }}>
    <path d="M12 1L9.5 8.5H2l6 4.5-2.5 7.5L12 16l6.5 4.5-2.5-7.5 6-4.5h-7.5z" />
  </svg>
);
const IconMonitor = ({ size = 18, color = IC }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ display:"inline-block", flexShrink:0 }}>
    <rect x="1" y="3" width="22" height="14" rx="2" />
    <path d="M8 21h8M12 17v4" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const IconBan = ({ size = 18, color = "#ff6b6b" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" style={{ display:"inline-block", flexShrink:0 }}>
    <circle cx="12" cy="12" r="9" />
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
  </svg>
);
const IconBox = ({ size = 18, color = "rgba(255,255,255,0.4)" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display:"inline-block", flexShrink:0 }}>
    <polyline points="21 8 21 21 3 21 3 8" /><rect x="1" y="3" width="22" height="5" rx="1" /><line x1="10" y1="12" x2="14" y2="12" />
  </svg>
);
const IconAntenna = ({ size = 18, color = IC }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display:"inline-block", flexShrink:0 }}>
    <path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><line x1="12" y1="20" x2="12" y2="20" strokeWidth="3" />
  </svg>
);
const IconSign = ({ size = 18, color = IC }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display:"inline-block", flexShrink:0 }}>
    <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);
const IconDatabase = ({ size = 18, color = IC }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display:"inline-block", flexShrink:0 }}>
    <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
  </svg>
);
const IconBolt = ({ size = 20, color = IC }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ display:"inline-block", flexShrink:0 }}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
const IconFile = ({ size = 20, color = IC }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ display:"inline-block", flexShrink:0 }}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);
const IconBarChart = ({ size = 20, color = IC }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ display:"inline-block", flexShrink:0 }}>
    <rect x="18" y="3" width="4" height="18" rx="1" /><rect x="10" y="8" width="4" height="13" rx="1" /><rect x="2" y="13" width="4" height="8" rx="1" />
  </svg>
);
const IconPlug = ({ size = 20, color = IC }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display:"inline-block", flexShrink:0 }}>
    <path d="M18 6L6 18" /><path d="M10 2v6M14 2v6" /><path d="M8 22v-4a4 4 0 0 1 8 0v4" />
  </svg>
);
const IconUsers = ({ size = 20, color = IC }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display:"inline-block", flexShrink:0 }}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
/* ── Standard icons (solid filled) ─── */
const IconMedical = ({ size = 22, color = IC }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ display:"inline-block", flexShrink:0 }}>
    <path d="M22 12h-4V8h-4v4H10v4h4v4h4v-4h4z" /><path d="M10 2H6a2 2 0 0 0-2 2v2H2v4h2v8a2 2 0 0 0 2 2h4" fill="none" stroke={color} strokeWidth="0" /><rect x="2" y="2" width="20" height="20" rx="3" fill={color} fillOpacity="0.15" /><path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7z" fill="#000" fillOpacity="0.45" />
  </svg>
);
const IconCard = ({ size = 22, color = IC }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ display:"inline-block", flexShrink:0 }}>
    <rect x="1" y="4" width="22" height="16" rx="2" />
    <rect x="1" y="9" width="22" height="4" fill="rgba(0,0,0,0.3)" />
  </svg>
);
const IconCloud = ({ size = 22, color = IC }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ display:"inline-block", flexShrink:0 }}>
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
  </svg>
);
const IconGlobe = ({ size = 22, color = IC }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ display:"inline-block", flexShrink:0 }}>
    <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="1.5" />
  </svg>
);
const IconFlag = ({ size = 22, color = IC }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ display:"inline-block", flexShrink:0 }}>
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const IconBuilding = ({ size = 22, color = IC }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ display:"inline-block", flexShrink:0 }}>
    <path d="M3 22V9l9-7 9 7v13H3z" /><rect x="9" y="12" width="6" height="10" fill="rgba(0,0,0,0.3)" /><path d="M2 9h20" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
  </svg>
);

/* ─── helpers ────────────────────────────────────────────────────────────── */
const CHARSET_BASE = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
function genPassword(len = 20) {
  const arr = new Uint32Array(len);
  crypto.getRandomValues(arr);
  return Array.from(arr, (n) => CHARSET_BASE[n % CHARSET_BASE.length]).join("");
}
function calcEntropy(pw) {
  let pool = 0;
  if (/[a-z]/.test(pw)) pool += 26;
  if (/[A-Z]/.test(pw)) pool += 26;
  if (/[0-9]/.test(pw)) pool += 10;
  if (/[^a-zA-Z0-9]/.test(pw)) pool += 32;
  return pool > 0 ? Math.floor(pw.length * Math.log2(pool)) : 0;
}

/* ─── FadeIn ─────────────────────────────────────────────────────────────── */
function FadeIn({ children, delay = 0, y = 24, className, style }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ─── Hero Certificate Mockup (CSS-rendered) ─────────────────────────────── */
// Rendered client-side only — avoids any SSR/client hydration mismatch on date strings
// or any other dynamic content, regardless of what the browser has cached.
function HeroCertMockupImpl() {
  // Static dates — marketing mockup, avoids SSR/client hydration mismatch from new Date()
  const ISSUED = "Apr 22, 2026";
  const EXPIRES = "Apr 22, 2027";
  const STANDARDS_PILLS = ["NIST", "PCI-DSS", "SOC 2", "ISO 27001"];

  return (
    <div style={{ position: "relative", flex: "0 1 540px", minWidth: 0 }}>
      {/* Signature chip — top right */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        style={{
          position: "absolute", top: -16, right: -8,
          background: "rgba(15,15,18,0.95)", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 8, padding: "8px 14px", zIndex: 10,
          backdropFilter: "blur(12px)",
        }}
      >
        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", marginBottom: 3, letterSpacing: "0.1em" }}>Signature</div>
        <div style={{ fontFamily: "monospace", fontSize: 11, color: "var(--accent)", letterSpacing: "0.04em" }}>eyJhbGci0iJFUzI1NiJ9...</div>
      </motion.div>

      {/* Main cert window */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: "rgba(12,12,16,0.97)", border: "1px solid rgba(255,255,255,0.09)",
          borderRadius: 16, overflow: "hidden",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
        }}
      >
        {/* Window chrome */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", gap: 6 }}>
            {["#FF5F57","#FEBC2E","#28C840"].map((c) => (
              <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
            ))}
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>passgeni.ai/cert/a4f9c2d1...</div>
          <div style={{ width: 60 }} />
        </div>

        {/* Cert body */}
        <div style={{ padding: "24px 24px 20px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", marginBottom: 4 }}>PASSGENI AUTHORITY · ES256</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>Compliance Certificate</div>
            </div>
            <div style={{ background: "var(--accent)", borderRadius: 8, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 20px", marginBottom: 18 }}>
            {[
              { label: "STANDARD", value: "HIPAA §164.312(d)", accent: true },
              { label: "ENTROPY", value: "112.4 bits", accent: true },
              { label: "ISSUED", value: ISSUED, accent: false },
              { label: "EXPIRES", value: EXPIRES, accent: false },
              { label: "CHAR POOL", value: "90 chars", accent: false },
              { label: "ALGORITHM", value: "ES256 P-256", accent: false },
            ].map(({ label, value, accent }) => (
              <div key={label}>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", marginBottom: 3 }}>{label}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: accent ? "var(--accent)" : "#e0e0e0" }}>{value}</div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 14 }}>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", marginBottom: 8 }}>ALSO SATISFIES</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {STANDARDS_PILLS.map((s) => (
                <span key={s} style={{ padding: "4px 10px", borderRadius: 99, border: "1px solid rgba(255,255,255,0.15)", fontSize: 10, color: "rgba(255,255,255,0.6)" }}>{s}</span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating entropy chip */}
      <motion.div
        initial={{ opacity: 0, x: -20, y: 20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 0.75, duration: 0.5 }}
        style={{
          position: "absolute", bottom: 32, left: -20,
          background: "rgba(12,12,16,0.97)", border: "1px solid rgba(200,255,0,0.25)",
          borderRadius: 10, padding: "10px 16px", zIndex: 10,
          backdropFilter: "blur(12px)",
        }}
      >
        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", marginBottom: 4 }}>ENTROPY</div>
        <div style={{ fontSize: 20, fontWeight: 800, color: "var(--accent)", lineHeight: 1 }}>112 bits</div>
        <div style={{ fontSize: 10, color: "rgba(200,255,0,0.6)", marginTop: 4 }}>↑ Exceeds HIPAA</div>
      </motion.div>

      {/* Signature verified chip */}
      <motion.div
        initial={{ opacity: 0, x: 20, y: 20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 0.85, duration: 0.5 }}
        style={{
          position: "absolute", bottom: 52, right: 20,
          background: "rgba(0,180,80,0.12)", border: "1px solid rgba(0,180,80,0.3)",
          borderRadius: 8, padding: "8px 14px", zIndex: 10,
          backdropFilter: "blur(12px)",
        }}
      >
        <div style={{ fontSize: 11, color: "#4ade80", fontWeight: 600, letterSpacing: "0.05em", display:"flex", alignItems:"center", gap:5 }}><IconCheck size={11} color="#4ade80" /> SIGNATURE VERIFIED</div>
      </motion.div>
    </div>
  );
}
// CSR-only: server sends nothing → no HTML to mismatch against → hydration error impossible
const HeroCertMockup = dynamic(() => Promise.resolve({ default: HeroCertMockupImpl }), { ssr: false });

/* ─── Live Generator Demo ────────────────────────────────────────────────── */
function checkStandards(pw, entropyBits) {
  const len = pw.length;
  const hasUpper = /[A-Z]/.test(pw);
  const hasLower = /[a-z]/.test(pw);
  const hasNum   = /[0-9]/.test(pw);
  const hasSp    = /[^a-zA-Z0-9]/.test(pw);
  const hasAll   = hasUpper && hasLower && hasNum && hasSp;

  return [
    { id: "NIST",    label: "NIST",    pass: len >= 8 },
    { id: "HIPAA",   label: "HIPAA",   pass: len >= 12 && hasAll },
    { id: "PCI-DSS", label: "PCI-DSS", pass: len >= 12 && hasAll && entropyBits >= 40 },
    { id: "SOC2",    label: "SOC 2",   pass: len >= 16 && hasAll },
    { id: "ISO",     label: "ISO 27001", pass: len >= 14 && hasAll },
  ];
}

function GeneratorDemo() {
  const { data: session } = useSession();
  const [pw, setPw] = useState("");
  const [entropy, setEntropy] = useState(0);
  const [copied, setCopied] = useState(false);
  const [pulsing, setPulsing] = useState(false);
  const [standards, setStandards] = useState([]);

  const [certState, setCertState] = useState("idle");
  const [certResult, setCertResult] = useState(null);
  const [certError, setCertError] = useState(null);

  const generate = useCallback(() => {
    const next = genPassword(20);
    setPw(next);
    setEntropy(calcEntropy(next));
    setStandards(checkStandards(next, calcEntropy(next)));
    setPulsing(true);
    setCertState("idle");
    setCertResult(null);
    setCertError(null);
    setTimeout(() => setPulsing(false), 400);
  }, []);

  useEffect(() => { generate(); }, [generate]);

  const copy = () => {
    navigator.clipboard.writeText(pw).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  const handleCertify = async () => {
    if (!session) { signIn(undefined, { callbackUrl: "/dashboard/certify" }); return; }
    setCertState("checking");
    setCertError(null);

    const params = {
      compliance_standard: "nist",
      length: pw.length,
      has_upper: /[A-Z]/.test(pw),
      has_lower: /[a-z]/.test(pw),
      has_numbers: /[0-9]/.test(pw),
      has_special: /[^a-zA-Z0-9]/.test(pw),
      entropy_bits: entropy,
      char_pool_size: (() => { let p = 0; if (/[a-z]/.test(pw)) p += 26; if (/[A-Z]/.test(pw)) p += 26; if (/[0-9]/.test(pw)) p += 10; if (/[^a-zA-Z0-9]/.test(pw)) p += 32; return p; })(),
    };

    const r1 = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(params) });
    const d1 = await r1.json();
    if (!r1.ok) { setCertError(d1.error ?? "Session request failed"); setCertState("error"); return; }

    // Update live compliance badges from real server response
    if (d1.standards_met) {
      setStandards(prev => prev.map(s => ({
        ...s,
        pass: d1.standards_met.includes(s.id) || d1.standards_met.includes(s.label),
      })));
    }

    setCertState("certifying");
    const r2 = await fetch("/api/generate-certificate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ generation_session_id: d1.generation_session_id }) });
    const d2 = await r2.json();
    if (!r2.ok) { setCertError(d2.error ?? "Certificate generation failed"); setCertState("error"); return; }
    setCertResult(d2);
    setCertState("done");
  };

  const pct = Math.min(100, (entropy / 128) * 100);
  const barColor = entropy >= 80 ? "var(--accent)" : entropy >= 50 ? "#f59e0b" : "var(--danger)";

  return (
    <div style={{
      background: "rgba(12,12,16,0.97)", border: "1px solid rgba(255,255,255,0.09)",
      borderRadius: 16, overflow: "hidden",
      boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
    }}>
      {/* Window chrome */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {["#FF5F57","#FEBC2E","#28C840"].map((c) => <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />)}
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>passgeni.ai / Generate & Certify</div>
        <div style={{ width: 60 }} />
      </div>

      <div style={{ padding: "20px 24px 24px" }}>
        {/* password output */}
        <motion.div
          animate={pulsing ? { scale: [1, 1.012, 1] } : {}}
          transition={{ duration: 0.35 }}
          style={{
            background: "rgba(0,0,0,0.45)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 10, padding: "14px 16px",
            fontFamily: "var(--font-mono, monospace)", fontSize: 14, letterSpacing: "0.06em",
            color: "var(--accent)", wordBreak: "break-all", minHeight: 48,
            display: "flex", alignItems: "center", marginBottom: 14,
          }}
        >
          {pw || "—"}
        </motion.div>

        {/* entropy bar */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 5 }}>
            <span>Entropy</span>
            <span style={{ color: barColor, fontWeight: 600 }}>{entropy} bits</span>
          </div>
          <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 99 }}>
            <motion.div animate={{ width: `${pct}%` }} transition={{ duration: 0.5, ease: "easeOut" }} style={{ height: "100%", borderRadius: 99, background: barColor }} />
          </div>
        </div>

        {/* badges */}
        <div style={{ display: "flex", gap: 7, marginBottom: 18, flexWrap: "wrap" }}>
          {standards.map((s) => (
            <span
              key={s.id}
              style={{
                fontSize: 11, padding: "3px 9px", borderRadius: 99,
                background: s.pass ? "rgba(0,208,132,0.12)" : "rgba(255,68,68,0.10)",
                color: s.pass ? "#4ade80" : "#ff6b6b",
                border: `1px solid ${s.pass ? "rgba(0,208,132,0.25)" : "rgba(255,68,68,0.25)"}`,
                display: "inline-flex", alignItems: "center", gap: 4,
                transition: "all 0.25s",
              }}
            >
              {s.pass ? <IconCheck size={10} color="#4ade80" /> : <IconX size={10} color="#ff6b6b" />}
              {s.label}
            </span>
          ))}
          {certState !== "done" && (
            <span style={{ fontSize: 11, padding: "4px 10px", borderRadius: 99, background: "rgba(255,68,68,0.13)", color: "#ff6b6b", border: "1px solid rgba(255,68,68,0.3)", fontWeight: 600, display:"inline-flex", alignItems:"center", gap:4 }}>
              <IconX size={10} color="#ff6b6b" /> No compliance certificate attached
            </span>
          )}
          {certState === "done" && (
            <span style={{ fontSize: 11, padding: "3px 9px", borderRadius: 99, background: "rgba(200,255,0,0.12)", color: "var(--accent)", border: "1px solid rgba(200,255,0,0.3)", display:"inline-flex", alignItems:"center", gap:4 }}>
              <IconCheck size={10} color="var(--accent)" /> Certified
            </span>
          )}
        </div>

        {/* actions */}
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <button onClick={generate} className="btn-primary" style={{ flex: 1, fontSize: 13, padding: "10px 0" }}>Generate Password</button>
          <button onClick={copy} className="btn-ghost" style={{ fontSize: 13, padding: "10px 16px" }}>{copied ? "Copied!" : "Copy"}</button>
        </div>

        {certState === "done" && certResult ? (
          <div style={{ padding: "11px 14px", borderRadius: 8, background: "rgba(0,208,132,0.08)", border: "1px solid rgba(0,208,132,0.25)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, color: "#4ade80", display:"flex", alignItems:"center", gap:5 }}><IconCert size={13} color="#4ade80" /> Certificate issued</span>
            <a href={certResult.cert_url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>View →</a>
          </div>
        ) : (
          <button
            onClick={handleCertify}
            disabled={certState === "checking" || certState === "certifying"}
            style={{
              width: "100%", padding: "10px 0", fontSize: 13, borderRadius: 8,
              border: "1px solid rgba(200,255,0,0.35)",
              background: certState === "idle" ? "rgba(200,255,0,0.06)" : "rgba(200,255,0,0.1)",
              color: "rgba(200,255,0,0.85)", cursor: certState === "checking" || certState === "certifying" ? "wait" : "pointer", transition: "background 0.2s",
            }}
          >
            {certState === "idle" && <span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><IconLock size={13} color="rgba(200,255,0,0.85)" /> Certify This Password →</span>}
            {certState === "checking" && "Validating…"}
            {certState === "certifying" && "Issuing certificate…"}
            {certState === "error" && <span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><IconLock size={13} color="rgba(200,255,0,0.85)" /> Retry Certify →</span>}
          </button>
        )}

        {certError && (
          <div style={{ marginTop: 8, fontSize: 11, color: "#ff6b6b", lineHeight: 1.5 }}>
            {certError}
            {certError.includes("Upgrade") && <a href="/pricing" style={{ color: "var(--accent)", marginLeft: 6 }}>Upgrade →</a>}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Dashboard score mockup ─────────────────────────────────────────────── */
function DashboardMockup() {
  const certs = [
    { std: "HIPAA §164.312", bits: "112b", date: "Apr 2027", status: "VALID", statusColor: "#4ade80", statusBg: "rgba(0,208,132,0.12)" },
    { std: "NIST SP 800-63B", bits: "98b", date: "May 2026", status: "EXP SOON", statusColor: "#f59e0b", statusBg: "rgba(245,158,11,0.12)" },
    { std: "PCI-DSS v4.0", bits: "128b", date: "Mar 2027", status: "VALID", statusColor: "#4ade80", statusBg: "rgba(0,208,132,0.12)" },
  ];
  const bars = [{ label: "NIST", pct: 100, c: "#4ade80" }, { label: "HIPAA", pct: 75, c: "var(--accent)" }, { label: "SOC 2", pct: 50, c: "#f59e0b" }];

  return (
    <div style={{ background: "rgba(12,12,16,0.97)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 16, overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.5)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {["#FF5F57","#FEBC2E","#28C840"].map((c) => <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />)}
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>passgeni.ai / Dashboard</div>
        <div style={{ width: 60 }} />
      </div>
      <div style={{ padding: "20px 24px", display: "grid", gridTemplateColumns: "1fr 160px", gap: 20 }}>
        {/* cert table */}
        <div>
          {certs.map((c) => (
            <div key={c.std} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#e0e0e0" }}>{c.std}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{c.bits} · {c.date}</div>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 4, color: c.statusColor, background: c.statusBg, letterSpacing: "0.06em" }}>{c.status}</span>
            </div>
          ))}
        </div>
        {/* score ring */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <div style={{ position: "relative", width: 70, height: 70 }}>
            <svg width="70" height="70" viewBox="0 0 70 70">
              <circle cx="35" cy="35" r="28" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
              <circle cx="35" cy="35" r="28" fill="none" stroke="var(--accent)" strokeWidth="6" strokeLinecap="round" strokeDasharray={`${2*Math.PI*28*0.85} ${2*Math.PI*28}`} strokeDashoffset={2*Math.PI*28*0.25} transform="rotate(-90 35 35)" />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "#fff" }}>85%</div>
          </div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em" }}>SCORE</div>
          <div style={{ fontSize: 10, color: "var(--accent)", fontWeight: 600 }}>On track ↑</div>
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 6 }}>
            {bars.map((b) => (
              <div key={b.label}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "rgba(255,255,255,0.4)", marginBottom: 2 }}>
                  <span>{b.label}</span><span>{b.pct}%</span>
                </div>
                <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 99 }}>
                  <div style={{ width: `${b.pct}%`, height: "100%", background: b.c, borderRadius: 99 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Verification mockup ────────────────────────────────────────────────── */
function VerificationMockupImpl() {
  // Static dates — marketing mockup
  const ISSUED = "Apr 22, 2026";
  const EXPIRES = "Apr 22, 2027";

  return (
    <div style={{ background: "rgba(12,12,16,0.97)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 16, overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.5)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {["#FF5F57","#FEBC2E","#28C840"].map((c) => <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />)}
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>passgeni.ai/cert/a4f9c2d1</div>
        <div style={{ width: 60 }} />
      </div>
      <div style={{ padding: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <div style={{ width: 52, height: 52, borderRadius: 12, background: "rgba(0,208,132,0.15)", border: "2px solid rgba(0,208,132,0.4)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 2 }}>Certificate Verified</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em" }}>SIGNATURE VALID · ES256 P-256</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 16px" }}>
          {[
            { l: "STANDARD", v: "HIPAA §164.312", accent: true },
            { l: "ENTROPY", v: "112.4 bits", accent: true },
            { l: "ISSUED", v: ISSUED, accent: false },
            { l: "EXPIRES", v: EXPIRES, accent: false },
          ].map(({ l, v, accent }) => (
            <div key={l} style={{ padding: "10px 12px", background: "rgba(255,255,255,0.03)", borderRadius: 8 }}>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", marginBottom: 3 }}>{l}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: accent ? "var(--accent)" : "#e0e0e0" }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", marginBottom: 8 }}>ALSO SATISFIES</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["NIST 800-63B","PCI-DSS V4","SOC 2","ISO 27001"].map((s) => (
              <span key={s} style={{ padding: "4px 10px", borderRadius: 99, border: "1px solid rgba(255,255,255,0.15)", fontSize: 10, color: "rgba(255,255,255,0.55)" }}>{s}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
// CSR-only: server sends nothing → no HTML to mismatch against → hydration error impossible
const VerificationMockup = dynamic(() => Promise.resolve({ default: VerificationMockupImpl }), { ssr: false });

/* ─── Zero-Knowledge Diagram ─────────────────────────────────────────────── */
function ZeroKnowledgeDiagram() {
  const modes = [
    { label: "ZERO-KNOWLEDGE MODE", color: "rgba(200,255,0,0.1)", border: "rgba(200,255,0,0.2)", steps: ["Generate in browser", "No server call", "No record created"], icons: [<IconMonitor size={15} color="var(--accent)" />, <IconBan size={15} color="#ff6b6b" />, <IconBox size={15} color="rgba(255,255,255,0.35)" />] },
    { label: "CERTIFIED MODE", color: "rgba(100,100,255,0.06)", border: "rgba(100,100,255,0.15)", steps: ["Send parameters only", "Server signs JWT", "Certificate stored"], icons: [<IconAntenna size={15} color="var(--accent)" />, <IconSign size={15} color="var(--accent)" />, <IconDatabase size={15} color="var(--accent)" />] },
  ];

  return (
    <div style={{ background: "rgba(12,12,16,0.97)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 16, overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.5)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {["#FF5F57","#FEBC2E","#28C840"].map((c) => <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />)}
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>TWO MODES, SAME GUARANTEE</div>
        <div style={{ width: 60 }} />
      </div>
      <div style={{ padding: "20px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
          {modes.map((m) => (
            <div key={m.label} style={{ background: m.color, border: `1px solid ${m.border}`, borderRadius: 10, padding: "14px" }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.45)", letterSpacing: "0.1em", marginBottom: 10 }}>{m.label}</div>
              {m.steps.map((s, i) => (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "#ccc", marginBottom: 6 }}>
                  {m.icons[i]} {s}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ padding: "12px 16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, display: "flex", alignItems: "center", gap: 10 }}>
          <IconLock size={20} color="var(--accent)" />
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>Both modes: password never transmitted</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>Not a policy — a technical impossibility by architecture</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Standards strip ────────────────────────────────────────────────────── */
const STANDARDS_STRIP = [
  { icon: <IconMedical size={22} color="var(--accent)" />, name: "HIPAA",    sub: "§164.312" },
  { icon: <IconCard    size={22} color="var(--accent)" />, name: "PCI-DSS",  sub: "v4.0" },
  { icon: <IconCloud   size={22} color="var(--accent)" />, name: "SOC 2",    sub: "CC6.1" },
  { icon: <IconGlobe   size={22} color="var(--accent)" />, name: "ISO 27001",sub: ":2022" },
  { icon: <IconFlag    size={22} color="var(--accent)" />, name: "NIST",     sub: "800-63B" },
  { icon: <IconBuilding size={22} color="var(--accent)" />, name: "FIPS",    sub: "140-3" },
];

/* ─── Feature cards ──────────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: <IconBolt size={22} color="var(--accent)" />,
    title: "Compliance-preset generation",
    body: "Select HIPAA, PCI-DSS, or any standard. PassGeni generates a cryptographically strong password that meets every requirement — entropy, length, character pool, dictionary exclusion.",
    wide: false,
  },
  {
    icon: <IconFile size={22} color="var(--accent)" />,
    title: "ES256 signed certificates",
    body: "Every certificate is a tamper-evident ES256 JWT. Independently verifiable offline using PassGeni's published public key — no API call required.",
    wide: false,
  },
  {
    icon: <IconBarChart size={22} color="var(--accent)" />,
    title: "Compliance score dashboard",
    body: "Monitor your credential health. See compliance score per standard, expiry risks, and re-certification triggers in one view.",
    wide: false,
  },
  {
    icon: <IconPlug size={22} color="var(--accent)" />,
    title: "Developer API — ship compliance in one request",
    body: "POST to generate and certify programmatically. The same endpoints the dashboard uses, available to your application. Available on Authority plan.",
    wide: true,
  },
  {
    icon: <IconUsers size={22} color="var(--accent)" />,
    title: "Team compliance management",
    body: "Invite your security team, enforce org-wide compliance standards, and track every certificate across every seat — shared audit log included.",
    wide: false,
  },
];

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <>
      <Head>
        <title>PassGeni — Compliance Certificates for Every Credential</title>
        <meta name="description" content="PassGeni generates cryptographically strong passwords and issues verifiable compliance certificates for HIPAA, PCI-DSS, SOC 2, NIST SP 800-63B, and ISO 27001. Zero storage. Client-side only." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://passgeni.ai" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://passgeni.ai" />
        <meta property="og:title" content="PassGeni — Compliance Certificates for Every Credential" />
        <meta property="og:description" content="Generate passwords with compliance certificates for HIPAA, PCI-DSS, SOC 2, and NIST. Verifiable proof your auditors can check." />
        <meta property="og:image" content="https://passgeni.ai/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="PassGeni — Compliance Certificates for Every Credential" />
        <meta name="twitter:description" content="Passwords with verifiable compliance certificates. Zero storage. HIPAA, PCI-DSS, SOC 2, NIST." />
        <meta name="twitter:image" content="https://passgeni.ai/og-image.png" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getSiteSchema()) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getFAQSchema(FAQ.items)) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getHowToSchema()) }} />
      </Head>

      <div style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh", overflowX: "hidden" }}>
        <Header />
        <main>

          {/* ── HERO ─────────────────────────────────────────────────────── */}
          <section style={{ padding: "clamp(80px,10vw,120px) 0 clamp(60px,8vw,100px)" }}>
            <div className="container">
              <div style={{ display: "flex", gap: "clamp(40px,6vw,80px)", alignItems: "center", flexWrap: "wrap" }}>

                {/* Left: text */}
                <div style={{ flex: "1 1 360px", minWidth: 0 }}>
                  <FadeIn>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 99, border: "1px solid rgba(200,255,0,0.25)", background: "rgba(200,255,0,0.06)", marginBottom: 28 }}>
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--accent)", display: "inline-block" }} />
                      <span style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600, letterSpacing: "0.05em" }}>ES256 · Zero-knowledge · Auditor-ready</span>
                    </div>
                  </FadeIn>
                  <FadeIn delay={0.07}>
                    <h1 style={{ fontSize: "clamp(2.6rem,5.5vw,4.2rem)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: 22 }}>
                      Compliance<br />
                      certificates<br />
                      for <span style={{ color: "var(--accent)" }}>every credential</span>
                    </h1>
                  </FadeIn>
                  <FadeIn delay={0.13}>
                    <p style={{ fontSize: "clamp(1rem,1.6vw,1.15rem)", color: "var(--muted)", maxWidth: 460, marginBottom: 36, lineHeight: 1.65 }}>
                      PassGeni generates cryptographically signed compliance certificates for HIPAA, SOC 2, PCI-DSS, and more — proving your passwords meet policy without ever storing them.
                    </p>
                  </FadeIn>
                  <FadeIn delay={0.18}>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 28 }}>
                      <a href="/auth/signin" className="btn-primary" style={{ fontSize: 15, padding: "13px 28px" }}>Get your first certificate free →</a>
                      <a href="#how-it-works" className="btn-ghost" style={{ fontSize: 15, padding: "13px 22px" }}>See how it works</a>
                    </div>
                  </FadeIn>
                  <FadeIn delay={0.23}>
                    <div style={{ display: "flex", gap: 20, fontSize: 11, color: "rgba(255,255,255,0.35)", flexWrap: "wrap" }}>
                      {["No credit card", "No password stored", "Magic link sign-in"].map((t) => (
                        <span key={t}>· {t}</span>
                      ))}
                    </div>
                  </FadeIn>
                </div>

                {/* Right: certificate mockup */}
                <FadeIn delay={0.3} style={{ flex: "0 1 520px", minWidth: 0 }}>
                  <HeroCertMockup />
                </FadeIn>
              </div>
            </div>
          </section>

          {/* ── STANDARDS STRIP ──────────────────────────────────────────── */}
          <section style={{ borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "28px 0", background: "rgba(255,255,255,0.015)" }}>
            <div className="container">
              <FadeIn>
                <div style={{ textAlign: "center", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", marginBottom: 20 }}>
                  COMPLIANCE-READY FROM DAY ONE — ALL MAJOR STANDARDS BUILT IN
                </div>
              </FadeIn>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                {STANDARDS_STRIP.map((s, i) => (
                  <FadeIn key={s.name} delay={i * 0.05}>
                    <div style={{
                      display: "flex", alignItems: "center", gap: 8, padding: "10px 18px",
                      borderRadius: 99, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)",
                      fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.75)",
                      transition: "border-color 0.2s, background 0.2s",
                    }}>
                      {s.icon}
                      {s.name}
                      <span style={{ color: "rgba(255,255,255,0.35)", fontWeight: 400, fontSize: 11 }}>{s.sub}</span>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </section>

          {/* ── FEATURES GRID ─────────────────────────────────────────────── */}
          <section id="how-it-works" style={{ padding: "clamp(80px,10vw,120px) 0" }}>
            <div className="container">
              <FadeIn>
                <div style={{ textAlign: "center", marginBottom: 56 }}>
                  <div className="eyebrow" style={{ marginBottom: 12, justifyContent: "center" }}>WHAT PASSGENI DOES</div>
                  <h2 style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                    Everything your auditor<br />needs to see
                  </h2>
                  <p style={{ color: "var(--muted)", marginTop: 14, fontSize: 14, maxWidth: 460, margin: "14px auto 0" }}>
                    From generation to certificate to public verification — the complete compliance credential stack.
                  </p>
                </div>
              </FadeIn>

              {/* Feature grid — 12-col */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 16 }}>
                {/* Row 1: 3 × 4-col cards */}
                {FEATURES.slice(0, 3).map((f, i) => (
                  <FadeIn key={f.title} delay={i * 0.08} style={{ gridColumn: "span 4" }}>
                    <div className="bc" style={{ padding: "28px 24px", height: "100%", minHeight: 240 }}>
                      <div style={{ marginBottom: 14, lineHeight: 0 }}>{f.icon}</div>
                      <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 10 }}>{f.title}</h3>
                      <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.65 }}>{f.body}</p>
                    </div>
                  </FadeIn>
                ))}

                {/* Row 2: 8-col + 4-col */}
                <FadeIn delay={0.24} style={{ gridColumn: "span 8" }}>
                  <div className="bc" style={{ padding: "28px 24px", height: "100%", minHeight: 200 }}>
                    <div style={{ marginBottom: 14, lineHeight: 0 }}>{FEATURES[3].icon}</div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 10 }}>{FEATURES[3].title}</h3>
                    <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.65, maxWidth: 420 }}>{FEATURES[3].body}</p>
                    {/* Inline code block preview */}
                    <div style={{ marginTop: 20, background: "rgba(0,0,0,0.4)", borderRadius: 8, padding: "14px 16px", fontFamily: "monospace", fontSize: 11, color: "rgba(200,255,0,0.7)", lineHeight: 1.7, maxWidth: 480 }}>
                      <div style={{ color: "rgba(255,255,255,0.25)", marginBottom: 4 }}># Generate a HIPAA-compliant credential + certificate</div>
                      <div>curl https://passgeni.ai/api/v1/generate \</div>
                      <div>{"  "}-H <span style={{ color: "#fff" }}>"X-API-Key: pgk_live_••••••••••"</span> \</div>
                      <div>{"  "}-d <span style={{ color: "#fff" }}>'&#123;"compliance":"hipaa","certify":true&#125;'</span></div>
                    </div>
                  </div>
                </FadeIn>
                <FadeIn delay={0.32} style={{ gridColumn: "span 4" }}>
                  <div className="bc" style={{ padding: "28px 24px", height: "100%", minHeight: 200 }}>
                    <div style={{ marginBottom: 14, lineHeight: 0 }}>{FEATURES[4].icon}</div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 10 }}>{FEATURES[4].title}</h3>
                    <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.65 }}>{FEATURES[4].body}</p>
                    {/* Team member list */}
                    <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                      {[{ initials: "A", name: "alice@corp.com", role: "OWNER", certs: 12 }, { initials: "B", name: "bob@corp.com", role: "MEMBER", certs: 8 }].map((m) => (
                        <div key={m.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", background: "rgba(255,255,255,0.03)", borderRadius: 8 }}>
                          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(200,255,0,0.15)", border: "1px solid rgba(200,255,0,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "var(--accent)", flexShrink: 0 }}>{m.initials}</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 11, color: "#e0e0e0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.name}</div>
                          </div>
                          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.06em" }}>{m.role}</div>
                          <div style={{ fontSize: 11, color: "var(--accent)", fontWeight: 600 }}>{m.certs} certs</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </FadeIn>
              </div>
            </div>
          </section>

          {/* ── CORE LOOP — Generate & Certify ────────────────────────────── */}
          <section style={{ padding: "clamp(80px,10vw,120px) 0", background: "rgba(255,255,255,0.015)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="container">
              <div style={{ display: "flex", gap: "clamp(40px,6vw,80px)", alignItems: "center", flexWrap: "wrap" }}>
                {/* Left: text */}
                <div style={{ flex: "1 1 340px", minWidth: 0 }}>
                  <FadeIn>
                    <div className="eyebrow" style={{ marginBottom: 16 }}>THE CORE LOOP</div>
                    <h2 style={{ fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: 18, letterSpacing: "-0.02em" }}>
                      Generate → Certify →<br />Share in 60 seconds
                    </h2>
                    <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7, marginBottom: 28, maxWidth: 400 }}>
                      The entire product is built around one repeatable action. Generate a compliance-preset password, certify it with a cryptographic signature, and share the verification URL with your auditor.
                    </p>
                  </FadeIn>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[
                      { text: "Client-side generation using", code: "crypto.getRandomValues", suffix: "— passwords never leave your browser" },
                      { text: "One-click certification — a 60-second generation session token prevents certifying external passwords" },
                      { text: "Shareable", code: "/cert/[id]", suffix: "URL — your auditor can verify the signature without logging in" },
                      { text: "Re-certify when standards update or passwords rotate — history kept forever" },
                    ].map((item, i) => (
                      <FadeIn key={i} delay={i * 0.07}>
                        <div style={{ display: "flex", gap: 10, fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}>
                          <span style={{ color: "var(--accent)", flexShrink: 0, marginTop: 3 }}>✓</span>
                          <span>
                            {item.text}{item.code && <code style={{ background: "rgba(200,255,0,0.1)", color: "var(--accent)", padding: "1px 6px", borderRadius: 4, fontSize: 11, margin: "0 4px", fontFamily: "monospace" }}>{item.code}</code>}{item.suffix}
                          </span>
                        </div>
                      </FadeIn>
                    ))}
                  </div>
                  <FadeIn delay={0.3}>
                    <a href="/auth/signin" className="btn-primary" style={{ marginTop: 28, display: "inline-block", fontSize: 14, padding: "12px 24px" }}>Try the certify flow →</a>
                  </FadeIn>
                </div>

                {/* Right: live generator */}
                <FadeIn delay={0.15} style={{ flex: "0 1 500px", minWidth: 0 }}>
                  <GeneratorDemo />
                </FadeIn>
              </div>
            </div>
          </section>

          {/* ── DASHBOARD SECTION ─────────────────────────────────────────── */}
          <section style={{ padding: "clamp(80px,10vw,120px) 0" }}>
            <div className="container">
              <div style={{ display: "flex", gap: "clamp(40px,6vw,80px)", alignItems: "center", flexWrap: "wrap-reverse" }}>

                {/* Left: mockup */}
                <FadeIn delay={0.1} style={{ flex: "0 1 500px", minWidth: 0 }}>
                  <DashboardMockup />
                </FadeIn>

                {/* Right: text */}
                <div style={{ flex: "1 1 340px", minWidth: 0 }}>
                  <FadeIn>
                    <div className="eyebrow" style={{ marginBottom: 16 }}>COMPLIANCE DASHBOARD</div>
                    <h2 style={{ fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: 18, letterSpacing: "-0.02em" }}>
                      Your compliance<br />score, at a glance
                    </h2>
                    <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7, marginBottom: 28, maxWidth: 400 }}>
                      Monitor the health of every certificate you've ever issued. See risks, expiries, and re-certification triggers before your auditor does.
                    </p>
                  </FadeIn>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[
                      "Compliance score per standard — filtered to your most-used standard",
                      "Expiry risk panel — certs expiring in ≤30 days flagged in amber and red",
                      "One-click re-certify — deep-linked to the certify flow with standard pre-selected",
                      "Monthly usage bar — free tier shows 3-cert limit with upgrade prompt at 2/3 used",
                      "Standards coverage badges show which of the 6 standards you're certified against",
                    ].map((t, i) => (
                      <FadeIn key={i} delay={i * 0.07}>
                        <div style={{ display: "flex", gap: 10, fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}>
                          <span style={{ color: "var(--accent)", flexShrink: 0, marginTop: 3 }}>✓</span> {t}
                        </div>
                      </FadeIn>
                    ))}
                  </div>
                  <FadeIn delay={0.36}>
                    <a href="/auth/signin" className="btn-ghost" style={{ marginTop: 28, display: "inline-block", fontSize: 14, padding: "12px 24px" }}>View your dashboard →</a>
                  </FadeIn>
                </div>
              </div>
            </div>
          </section>

          {/* ── VERIFICATION SECTION ─────────────────────────────────────── */}
          <section style={{ padding: "clamp(80px,10vw,120px) 0", background: "rgba(255,255,255,0.015)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="container">
              <div style={{ display: "flex", gap: "clamp(40px,6vw,80px)", alignItems: "center", flexWrap: "wrap" }}>
                {/* Left: text */}
                <div style={{ flex: "1 1 340px", minWidth: 0 }}>
                  <FadeIn>
                    <div className="eyebrow" style={{ marginBottom: 16 }}>AUDITOR-READY VERIFICATION</div>
                    <h2 style={{ fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: 18, letterSpacing: "-0.02em" }}>
                      Share a URL.<br />Your auditor does the rest.
                    </h2>
                    <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7, marginBottom: 28, maxWidth: 400 }}>
                      Every certificate has a public, no-login verification page at <code style={{ background: "rgba(200,255,0,0.1)", color: "var(--accent)", padding: "2px 7px", borderRadius: 4, fontSize: 12, fontFamily: "monospace" }}>/cert/[id]</code>. Auditors can verify the ES256 signature against PassGeni's published public key — entirely offline.
                    </p>
                  </FadeIn>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[
                      "No account required to verify — just open the URL",
                      "Status badge shows VERIFIED / REVOKED / EXPIRED at a glance",
                      "QR code embedded — scannable for mobile auditor workflows",
                      "JWT fingerprint (SHA-256) for offline verification without calling PassGeni servers",
                      { text: "Offline verification via", code: "passgeni.ai/.well-known/jwks.json" },
                    ].map((item, i) => (
                      <FadeIn key={i} delay={i * 0.07}>
                        <div style={{ display: "flex", gap: 10, fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}>
                          <span style={{ color: "var(--accent)", flexShrink: 0, marginTop: 3 }}>✓</span>
                          {typeof item === "string" ? item : (
                            <span>{item.text} <code style={{ background: "rgba(200,255,0,0.1)", color: "var(--accent)", padding: "1px 6px", borderRadius: 4, fontSize: 11, fontFamily: "monospace" }}>{item.code}</code></span>
                          )}
                        </div>
                      </FadeIn>
                    ))}
                  </div>
                </div>

                {/* Right: verification mockup */}
                <FadeIn delay={0.15} style={{ flex: "0 1 480px", minWidth: 0 }}>
                  <VerificationMockup />
                </FadeIn>
              </div>
            </div>
          </section>

          {/* ── ZERO-KNOWLEDGE SECTION ───────────────────────────────────── */}
          <section style={{ padding: "clamp(80px,10vw,120px) 0" }}>
            <div className="container">
              <div style={{ display: "flex", gap: "clamp(40px,6vw,80px)", alignItems: "center", flexWrap: "wrap-reverse" }}>
                {/* Left: diagram */}
                <FadeIn delay={0.1} style={{ flex: "0 1 480px", minWidth: 0 }}>
                  <ZeroKnowledgeDiagram />
                </FadeIn>

                {/* Right: text */}
                <div style={{ flex: "1 1 340px", minWidth: 0 }}>
                  <FadeIn>
                    <div className="eyebrow" style={{ marginBottom: 16 }}>ZERO-KNOWLEDGE ARCHITECTURE</div>
                    <h2 style={{ fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: 18, letterSpacing: "-0.02em" }}>
                      PassGeni never sees<br />your password. Ever.
                    </h2>
                    <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7, marginBottom: 28, maxWidth: 420 }}>
                      This is not a privacy policy promise. It is a technical impossibility. Passwords are generated entirely in your browser using{" "}
                      <code style={{ background: "rgba(200,255,0,0.1)", color: "var(--accent)", padding: "2px 7px", borderRadius: 4, fontSize: 12, fontFamily: "monospace" }}>crypto.getRandomValues</code>
                      . The server only receives generation parameters — never the password itself.
                    </p>
                  </FadeIn>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[
                      "Zero-Knowledge Mode: password generated entirely client-side, nothing transmitted",
                      "Certified Mode: only parameters (length, standard, entropy target) go to the server",
                      "Certificate signs the parameters — not the password — so the proof is valid without the secret",
                      "Even PassGeni cannot recover the original password after certification",
                    ].map((t, i) => (
                      <FadeIn key={i} delay={i * 0.07}>
                        <div style={{ display: "flex", gap: 10, fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}>
                          <span style={{ color: "var(--accent)", flexShrink: 0, marginTop: 3 }}>✓</span> {t}
                        </div>
                      </FadeIn>
                    ))}
                  </div>
                  <FadeIn delay={0.32}>
                    <a href="/security" className="btn-ghost" style={{ marginTop: 28, display: "inline-block", fontSize: 14, padding: "12px 24px" }}>Read the security model →</a>
                  </FadeIn>
                </div>
              </div>
            </div>
          </section>

          {/* ── FINAL CTA ────────────────────────────────────────────────── */}
          <section style={{ padding: "clamp(100px,12vw,140px) 0", textAlign: "center", position: "relative", overflow: "hidden" }}>
            {/* Ambient glow */}
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 300, background: "radial-gradient(ellipse, rgba(200,255,0,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
            <div className="container" style={{ position: "relative" }}>
              <FadeIn>
                <div className="eyebrow" style={{ marginBottom: 20, justifyContent: "center" }}>START YOUR COMPLIANCE JOURNEY</div>
                <h2 style={{ fontSize: "clamp(2.2rem,5vw,3.8rem)", fontWeight: 900, lineHeight: 1.08, letterSpacing: "-0.03em", marginBottom: 22 }}>
                  Will you have <span style={{ color: "var(--accent)" }}>evidence</span>,<br />or just good intentions?
                </h2>
                <p style={{ fontSize: "clamp(1rem,1.6vw,1.15rem)", color: "var(--muted)", maxWidth: 500, margin: "0 auto 40px", lineHeight: 1.65 }}>
                  Auditors don't take your word for it. PassGeni gives you signed, verifiable proof that every password meets the standard — ready to hand over in seconds.
                </p>
                <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 20 }}>
                  <a href="/auth/signin" className="btn-primary" style={{ fontSize: 15, padding: "14px 32px" }}>Get your first certificate free →</a>
                  <a href="#pricing" className="btn-ghost" style={{ fontSize: 15, padding: "14px 24px" }}>See pricing</a>
                </div>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", fontFamily: "monospace", letterSpacing: "0.05em" }}>
                  No credit card · 14-day Assurance trial · Magic link sign-in · No password stored
                </p>
              </FadeIn>
            </div>
          </section>

        </main>
        <Footer />
      </div>
    </>
  );
}
