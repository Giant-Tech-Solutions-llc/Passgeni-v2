// =============================================================
// PASSGENI — PASSWORD POLICY GENERATOR
// passgeni.ai/tools/policy-generator
// =============================================================
// Generates a complete, audit-ready password policy document.
// Aligned with HIPAA, SOC 2, ISO 27001, PCI-DSS, NIST.
// Downloads as plain text or HTML. High backlink potential.
// =============================================================

import { useState } from "react";
import { motion } from "framer-motion";
import { btnPrimary, btnGhost } from "../../lib/motion.js";
import ToolPage from "../../components/tools/ToolPage.js";
import { IcCheck, IcCopy } from "../../lib/icons.js";

const FRAMEWORKS = [
  { id: "hipaa",  label: "HIPAA",        minLen: 12, complexity: true,  rotation: 90,  mfa: true },
  { id: "pci",    label: "PCI-DSS v4.0", minLen: 12, complexity: true,  rotation: 90,  mfa: true },
  { id: "soc2",   label: "SOC 2",        minLen: 16, complexity: true,  rotation: 180, mfa: true },
  { id: "iso",    label: "ISO 27001",    minLen: 14, complexity: true,  rotation: 90,  mfa: true },
  { id: "nist",   label: "NIST 800-63B", minLen: 15, complexity: false, rotation: 0,   mfa: false },
  { id: "custom", label: "Custom",       minLen: 12, complexity: true,  rotation: 90,  mfa: false },
];

const INDUSTRIES = ["Healthcare", "Financial Services", "Technology / SaaS", "Legal", "Education", "Government", "Retail / E-commerce", "Manufacturing", "Non-profit", "Other"];

// ─── POLICY GENERATOR ────────────────────────────────────────
function generatePolicy({ companyName, industry, framework, minLen, complexity, rotation, mfa, customNotes }) {
  const fw       = FRAMEWORKS.find((f) => f.id === framework) || FRAMEWORKS[0];
  const effMin   = framework === "custom" ? minLen : fw.minLen;
  const effComp  = framework === "custom" ? complexity : fw.complexity;
  const effRot   = framework === "custom" ? rotation   : fw.rotation;
  const effMfa   = framework === "custom" ? mfa        : fw.mfa;
  const date     = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const fwLabel  = fw.label;

  return `PASSWORD SECURITY POLICY
${companyName || "[Company Name]"}
${industry ? `Industry: ${industry}` : ""}
Effective Date: ${date}
Framework Alignment: ${fwLabel}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. PURPOSE

This policy establishes requirements for the creation, maintenance, and protection of passwords used to access ${companyName || "[Company Name]"} systems, data, and applications. The purpose is to ensure a consistent, auditable level of security aligned with ${fwLabel} requirements.

2. SCOPE

This policy applies to all employees, contractors, consultants, temporary staff, and third parties who have access to ${companyName || "[Company Name]"} systems or data. Compliance is mandatory.

3. PASSWORD REQUIREMENTS

3.1 Minimum Length
All user passwords must be a minimum of ${effMin} characters. Privileged account passwords (administrators, service accounts) must be a minimum of ${Math.max(effMin, 16)} characters.

3.2 Complexity Requirements
${effComp
  ? `Passwords must include characters from at least three of the following four categories:
   • Uppercase letters (A–Z)
   • Lowercase letters (a–z)  
   • Numbers (0–9)
   • Special characters (! @ # $ % ^ & * - _ = +)`
  : `In accordance with ${fwLabel} recommendations, password complexity requirements are replaced by minimum length requirements. Longer passwords without mandatory complexity are preferred. Passwords must be at least ${effMin} characters.`}

3.3 Prohibited Passwords
The following passwords are prohibited:
   • Passwords that have appeared in known data breach datasets
   • Passwords containing the user's name, username, or company name
   • Passwords based on dictionary words without sufficient modification
   • Sequential characters (abc, 123, qwerty)
   • Passwords used in the previous 12 months

3.4 Passphrases
Users are encouraged to use passphrases — sequences of four or more random words — as an alternative to complex short passwords. Passphrases of 20+ characters satisfy all requirements of this policy.

4. PASSWORD MANAGEMENT

4.1 Rotation
${effRot > 0
  ? `Passwords must be changed every ${effRot} days. Systems must enforce this rotation automatically. Users will be notified ${Math.round(effRot * 0.1)} days before expiration.`
  : `In accordance with NIST SP 800-63B, mandatory password rotation is NOT required unless there is evidence of compromise. Rotation is required immediately upon suspected or confirmed breach.`}

4.2 Account Lockout
Accounts must be locked after 5 consecutive failed login attempts. Lockout duration: 30 minutes minimum. Administrator reset is required after 10 consecutive failed attempts.

4.3 Password Storage
Passwords must never be stored in plaintext. Systems must use approved hashing algorithms: bcrypt, Argon2, or PBKDF2 with a minimum work factor of 10. Salting is mandatory.

4.4 Password Sharing
Password sharing between individuals is strictly prohibited. Where shared access to systems is required, shared service accounts with audit logging must be used.

5. MULTI-FACTOR AUTHENTICATION (MFA)
${effMfa
  ? `MFA is REQUIRED for:
   • All remote access (VPN, RDP, SSH)
   • All cloud service and SaaS application access
   • All privileged and administrator accounts
   • Any system accessing sensitive or regulated data
   
   Acceptable MFA methods: hardware security keys (FIDO2), authenticator apps (TOTP), or SMS (discouraged for high-security systems).`
  : `MFA is strongly recommended for all accounts. It is required for privileged accounts and remote access systems.`}

6. PASSWORD MANAGERS

Users are encouraged to use approved password managers to generate and store unique, strong passwords for each account. The following are approved for organizational use:
   • [Insert approved password manager here]
   
Storing passwords in browsers or unencrypted files is prohibited.

7. INCIDENT RESPONSE

If a password compromise is suspected or confirmed:
   1. Change the affected password immediately
   2. Notify the IT Security team within 1 hour
   3. Review access logs for unauthorized activity
   4. Change passwords on any other accounts where the same password was used
   5. Document the incident per the Incident Response Policy

8. ENFORCEMENT AND COMPLIANCE

Violations of this policy may result in disciplinary action up to and including termination. All systems must enforce technical controls where possible. Annual training on password security is mandatory for all staff.

9. REVIEW SCHEDULE

This policy must be reviewed and updated annually, or following any significant security incident. Policy owner: [IT Security / CISO].

${customNotes ? `10. ADDITIONAL NOTES\n\n${customNotes}` : ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Policy Version: 1.0
Generated: ${date}
Generated using PassGeni Policy Generator — passgeni.ai/tools/policy-generator
Framework: ${fwLabel} alignment

This document is provided as a template. Consult your legal and compliance team before adopting as official policy.`;
}

// ─── FORM ────────────────────────────────────────────────────
export default function PolicyGeneratorPage() {
  const [companyName,   setCompanyName]   = useState("");
  const [industry,      setIndustry]      = useState("");
  const [framework,     setFramework]     = useState("hipaa");
  const [minLen,        setMinLen]        = useState(12);
  const [complexity,    setComplexity]    = useState(true);
  const [rotation,      setRotation]      = useState(90);
  const [mfa,           setMfa]           = useState(true);
  const [customNotes,   setCustomNotes]   = useState("");
  const [policy,        setPolicy]        = useState("");
  const [copied,        setCopied]        = useState(false);

  const generate = () => {
    const text = generatePolicy({ companyName, industry, framework, minLen, complexity, rotation, mfa, customNotes });
    setPolicy(text);
    setTimeout(() => document.getElementById("policy-output")?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  const download = () => {
    if (!policy) return;
    const blob = new Blob([policy], { type: "text/plain" });
    const a    = document.createElement("a");
    a.href     = URL.createObjectURL(blob);
    a.download = `${(companyName || "company").replace(/\s+/g, "-").toLowerCase()}-password-policy.txt`;
    a.click();
  };

  const copy = async () => {
    await navigator.clipboard.writeText(policy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const schema = {
    "@context": "https://schema.org",
    "@type":    "WebApplication",
    "name":     "PassGeni Password Policy Generator",
    "description": "Generate a complete, audit-ready password policy for your company. HIPAA, SOC 2, ISO 27001, PCI-DSS, and NIST aligned. Download as text.",
    "url":      "https://passgeni.ai/tools/policy-generator",
    "applicationCategory": "SecurityApplication",
    "offers":   { "@type": "Offer", "price": "0" },
  };

  const isCustom = framework === "custom";

  return (
    <ToolPage
      title="Password Policy Generator — HIPAA, SOC 2, PCI-DSS, ISO 27001 | PassGeni"
      description="Generate a complete, audit-ready password policy for your organisation. Aligned with HIPAA, SOC 2, ISO 27001, PCI-DSS v4.0, and NIST 800-63B. Free download."
      canonical="https://passgeni.ai/tools/policy-generator"
      schema={schema}
      toolName="Policy Generator"
      testimonialKey="policy"
      eyebrow="Free compliance tool"
      headline="Generate your company password policy."
      subheadline="Fill in the form below and we'll generate a complete, audit-ready password policy document aligned with your compliance framework. Download as text."
    >
      {/* ── Form ── */}
      <div style={{ background: "#0a0a0c", border: "1px solid #141416", borderRadius: 16, padding: "28px 32px", marginBottom: 24 }}>

        {/* Company details */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
          <div>
            <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>
              Company name
            </label>
            <input
              type="text"
              placeholder="Acme Corp"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              style={{ width: "100%", background: "#060608", border: "1px solid #1a1a1a", borderRadius: 8, padding: "12px 16px", fontFamily: "var(--font-body)", fontSize: 14, color: "#fff", outline: "none", boxSizing: "border-box" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>
              Industry
            </label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              style={{ width: "100%", background: "#060608", border: "1px solid #1a1a1a", borderRadius: 8, padding: "12px 16px", fontFamily: "var(--font-body)", fontSize: 14, color: industry ? "#fff" : "#888", outline: "none", boxSizing: "border-box", cursor: "pointer" }}
            >
              <option value="">Select industry…</option>
              {INDUSTRIES.map((ind) => <option key={ind} value={ind}>{ind}</option>)}
            </select>
          </div>
        </div>

        {/* Framework selection */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>
            Compliance framework
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {FRAMEWORKS.map((fw) => (
              <button
                key={fw.id}
                onClick={() => setFramework(fw.id)}
                className={`compliance-pill ${framework === fw.id ? "active" : ""}`}
              >
                {fw.label}
              </button>
            ))}
          </div>
          {!isCustom && framework !== "custom" && (
            <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#666", marginTop: 10 }}>
              {framework === "nist" && "NIST SP 800-63B: Emphasises length over complexity. No mandatory rotation unless compromised."}
              {framework === "hipaa" && "HIPAA: Minimum 12 chars, full complexity, 90-day rotation, MFA required for ePHI access."}
              {framework === "pci"  && "PCI-DSS v4.0: Minimum 12 chars, 90-day rotation, MFA required for all console and remote access."}
              {framework === "soc2" && "SOC 2 CC6.1: Minimum 16 chars, 180-day rotation, MFA across all systems."}
              {framework === "iso"  && "ISO 27001:2022 Annex A.9: Minimum 14 chars, full complexity, 90-day rotation."}
            </p>
          )}
        </div>

        {/* Custom settings — only shown for Custom framework */}
        {isCustom && (
          <div style={{ background: "#060608", border: "1px solid #1a1a1a", borderRadius: 10, padding: "20px", marginBottom: 24 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
              Custom settings
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#666", letterSpacing: "0.1em", display: "block", marginBottom: 8 }}>
                  Min length: {minLen} chars
                </label>
                <input type="range" min={8} max={32} value={minLen} onChange={(e) => setMinLen(+e.target.value)} />
              </div>
              <div>
                <label style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#666", letterSpacing: "0.1em", display: "block", marginBottom: 8 }}>
                  Rotation days: {rotation === 0 ? "None" : `${rotation} days`}
                </label>
                <input type="range" min={0} max={365} step={30} value={rotation} onChange={(e) => setRotation(+e.target.value)} />
              </div>
              <label style={{ display: "flex", gap: 10, alignItems: "center", cursor: "pointer" }}>
                <input type="checkbox" checked={complexity} onChange={(e) => setComplexity(e.target.checked)} />
                <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#ccc" }}>Require complexity (uppercase, numbers, symbols)</span>
              </label>
              <label style={{ display: "flex", gap: 10, alignItems: "center", cursor: "pointer" }}>
                <input type="checkbox" checked={mfa} onChange={(e) => setMfa(e.target.checked)} />
                <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#ccc" }}>Require MFA</span>
              </label>
            </div>
          </div>
        )}

        {/* Additional notes */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>
            Additional notes (optional)
          </label>
          <textarea
            placeholder="Any additional requirements or context to include in the policy…"
            value={customNotes}
            onChange={(e) => setCustomNotes(e.target.value)}
            rows={3}
            style={{ width: "100%", background: "#060608", border: "1px solid #1a1a1a", borderRadius: 8, padding: "12px 16px", fontFamily: "var(--font-body)", fontSize: 13, color: "#fff", outline: "none", resize: "vertical", boxSizing: "border-box" }}
          />
        </div>

        <motion.button onClick={generate} className="btn-primary" {...btnPrimary} style={{ width: "100%", justifyContent: "center", fontSize: 15 }}>
          Generate policy document →
        </motion.button>
      </div>

      {/* ── Policy output ── */}
      {policy && (
        <div id="policy-output" style={{ animation: "fadeIn 0.4s ease" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 18, color: "#fff" }}>
              Your password policy
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <motion.button onClick={copy}     className="btn-ghost" {...btnGhost} style={{ fontSize: 13, padding: "10px 18px", display: "flex", alignItems: "center", gap: 6 }}>
                {copied ? <><IcCheck size={13} color="#4ade80" /> Copied</> : <><IcCopy size={13} color="currentColor" /> Copy text</>}
              </motion.button>
              <motion.button onClick={download} className="btn-primary" {...btnPrimary} style={{ fontSize: 13, padding: "10px 18px", animation: "none" }}>
                Download .txt
              </motion.button>
            </div>
          </div>
          <div style={{ background: "#08080a", border: "1px solid #141416", borderRadius: 12, padding: "28px", fontFamily: "var(--font-mono)", fontSize: 12, color: "#aaa", lineHeight: 1.9, whiteSpace: "pre-wrap", maxHeight: 600, overflowY: "auto" }}>
            {policy}
          </div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#555", marginTop: 12, lineHeight: 1.7 }}>
            This document is a template. Consult your legal and compliance team before adopting as official policy.
          </p>
        </div>
      )}

      {/* Compliance linkage */}
      <div style={{ marginTop: 48, background: "#0a0a0c", border: "1px solid #1e1e22", borderRadius: 14, padding: "24px 28px" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#555", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 14 }}>
          Policy + per-credential proof
        </div>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#777", lineHeight: 1.8, marginBottom: 18 }}>
          A written policy satisfies the documentation requirement. Per-credential{" "}
          <a href="/password-compliance-certificate" style={{ color: "#C8FF00", textDecoration: "none" }}>compliance certificates</a>{" "}
          satisfy the execution requirement. Auditors need both: your policy to show intent, certificates to show that each credential was actually generated to standard. Learn more about{" "}
          <a href="/glossary/authentication-policy" style={{ color: "#C8FF00", textDecoration: "none" }}>authentication policies</a>{" "}
          and{" "}<a href="/glossary/audit-trail" style={{ color: "#C8FF00", textDecoration: "none" }}>credential audit trails</a>.
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a href="/tools/compliance-fixer" style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#C8FF00", background: "rgba(200,255,0,0.06)", border: "1px solid rgba(200,255,0,0.2)", borderRadius: 8, padding: "9px 16px", textDecoration: "none" }}>
            Issue certificates →
          </a>
          <a href="/guides/hipaa-password-requirements" style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#888", background: "#050507", border: "1px solid #1a1a1a", borderRadius: 8, padding: "9px 16px", textDecoration: "none" }}>
            HIPAA guide →
          </a>
          <a href="/guides/pci-dss-password-requirements" style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#888", background: "#050507", border: "1px solid #1a1a1a", borderRadius: 8, padding: "9px 16px", textDecoration: "none" }}>
            PCI-DSS guide →
          </a>
        </div>
      </div>
    </ToolPage>
  );
}
