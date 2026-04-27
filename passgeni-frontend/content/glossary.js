// =============================================================
// PASSGENI — GLOSSARY CONTENT REGISTRY
// =============================================================
// Each term has full metadata + content for SEO landing pages.
// Template: pages/glossary/[slug].js
// =============================================================

export const GLOSSARY_TERMS = [
  {
    slug:            "entropy",
    term:            "Entropy (Password)",
    metaTitle:       "Password Entropy: Definition, Calculation, and Security Thresholds | PassGeni",
    metaDescription: "Password entropy measures unpredictability in bits. Learn how it is calculated, why 60–80 bits is the minimum for compliance, and how to measure your credentials.",
    excerpt:         "Password entropy is a mathematical measure of unpredictability, expressed in bits. Higher entropy means a credential is harder to guess or crack by brute force.",
    publishedAt:     "2025-01-01",
    updatedAt:       "2026-04-26",
    readTime:        5,
    badge:           "Core Concept",
    badgeColor:      "#C8FF00",
    relatedTerms:    ["credential-security", "password-compliance", "authentication-policy"],
    relatedTools:    [
      { label: "Password Strength Checker", href: "/tools/strength-checker" },
      { label: "Credential Compliance Fixer", href: "/tools/compliance-fixer" },
    ],
    relatedGuides:   [
      { label: "NIST SP 800-63B Guide", href: "/guides/nist-800-63b-password-guidelines" },
      { label: "What Is a Compliance Certificate?", href: "/guides/what-is-a-compliance-certificate" },
    ],
    definition:      "Password entropy is a measure of unpredictability or randomness, expressed in bits. A credential with N bits of entropy requires, on average, 2^(N-1) guesses for a brute-force attacker to find it. Entropy depends on the size of the character set used and the length of the credential.",
    formula:         "H = L × log₂(N)",
    formulaExplained: "Where H is entropy in bits, L is password length, and N is the number of possible characters in the character set (e.g. 26 for lowercase only, 95 for all printable ASCII).",
    sections: [
      {
        heading: "How entropy is calculated",
        body: "Entropy is calculated using the formula H = L × log₂(N), where L is the password length and N is the character set size. A 12-character password using only lowercase letters (N=26) has 12 × log₂(26) ≈ 56.5 bits of entropy. The same length password using all ASCII printable characters (N=95) has 12 × log₂(95) ≈ 78.7 bits — a significant improvement. PassGeni's Strength Checker calculates entropy in real time and flags credentials that fall below compliance thresholds.",
      },
      {
        heading: "Entropy thresholds by compliance standard",
        body: "Different compliance frameworks set different minimum entropy requirements. NIST SP 800-63B requires at least 112 bits for federal cryptographic modules. PCI-DSS v4.0 implicitly requires ~78 bits via its 12-character + character diversity mandate. HIPAA guidance implies ~60–80 bits. SOC 2 auditors typically expect 80+ bits for admin accounts. PassGeni's compliance presets enforce these thresholds automatically.",
      },
      {
        heading: "Why character diversity matters more than length alone",
        body: "Increasing character set size has a compounding effect on entropy. Moving from lowercase only (N=26) to all printable ASCII (N=95) adds log₂(95/26) ≈ 1.87 bits per character. For a 12-character password, that is 22.4 additional bits — equivalent to adding 4–5 characters of length. This is why compliance standards require character diversity alongside minimum length.",
      },
      {
        heading: "Shannon entropy vs. practical entropy",
        body: "Theoretical entropy assumes uniform random generation. Practical entropy — what actually matters for security — accounts for patterns, dictionary words, keyboard walks, and repeated characters. A 12-character password that contains 'password123!' has high theoretical entropy but near-zero practical entropy due to predictability. PassGeni's DNA Score measures practical entropy by detecting patterns that reduce real-world resistance to attacks.",
      },
    ],
    faq: [
      { q: "What is a good entropy score for a password?", a: "For most compliance frameworks, 60–80 bits is the minimum acceptable range. NIST recommends 112+ bits for high-security systems. PassGeni flags anything under 60 bits as non-compliant." },
      { q: "Does length or character set matter more for entropy?", a: "Both contribute multiplicatively. Doubling the character set adds log₂(2)=1 bit per character. Adding one character to a 12-char ASCII password adds ~6.6 bits. In practice, length has a larger absolute impact, but character diversity ensures each additional character contributes maximally." },
      { q: "How does PassGeni calculate entropy?", a: "PassGeni uses Shannon entropy as the base measure: H = L × log₂(N) where N is the effective character set detected in the credential. The DNA Score then applies pattern penalties for repeated characters, dictionary words, keyboard walks, and date patterns." },
      { q: "Is there a difference between entropy and password strength?", a: "Yes. Entropy is a mathematical measure of unpredictability. Strength is a holistic assessment that includes entropy, resistance to dictionary attacks, resistance to pattern attacks, and whether the credential has appeared in breach databases." },
    ],
  },

  {
    slug:            "authentication-policy",
    term:            "Authentication Policy",
    metaTitle:       "Authentication Policy: Definition, Requirements, and Templates | PassGeni",
    metaDescription: "An authentication policy documents the rules governing credential creation, rotation, storage, and access. Required by HIPAA, PCI-DSS, SOC 2, and ISO 27001 for compliance audits.",
    excerpt:         "An authentication policy is a documented set of rules governing how credentials are created, stored, rotated, and revoked within an organisation. It is required evidence for HIPAA, PCI-DSS, SOC 2, and ISO 27001 audits.",
    publishedAt:     "2025-01-01",
    updatedAt:       "2026-04-26",
    readTime:        6,
    badge:           "Core Concept",
    badgeColor:      "#C8FF00",
    relatedTerms:    ["password-compliance", "credential-security", "audit-trail"],
    relatedTools:    [
      { label: "Password Policy Generator", href: "/tools/policy-generator" },
      { label: "Credential Compliance Fixer", href: "/tools/compliance-fixer" },
    ],
    relatedGuides:   [
      { label: "HIPAA Password Requirements", href: "/guides/hipaa-password-requirements" },
      { label: "SOC 2 Password Requirements", href: "/guides/soc2-password-requirements" },
      { label: "PCI-DSS Password Requirements", href: "/guides/pci-dss-password-requirements" },
    ],
    definition:      "An authentication policy is a formal document that defines an organisation's rules for credential creation, complexity, storage, rotation, and revocation. Compliance frameworks including HIPAA, PCI-DSS v4.0, SOC 2, and ISO 27001 require a documented authentication policy as evidence of formal access control procedures.",
    sections: [
      {
        heading: "What must an authentication policy cover?",
        body: "A compliant authentication policy must document: minimum password length and character requirements, prohibited password patterns (dictionary words, sequences), multi-factor authentication requirements, credential storage requirements (hashing algorithm, salt), rotation and expiry rules, account lockout thresholds, and procedures for credential compromise response. PassGeni's Policy Generator creates framework-specific documents covering all required elements.",
      },
      {
        heading: "Authentication policy vs. password policy",
        body: "These terms are often used interchangeably, but authentication policy is broader. A password policy covers credential rules specifically. An authentication policy covers all authentication methods: passwords, MFA, SSO tokens, biometrics, API keys, and service account credentials. Most compliance frameworks require the broader scope.",
      },
      {
        heading: "Which frameworks require a written authentication policy?",
        body: "HIPAA §164.308(a)(5)(ii)(D) explicitly requires written procedures for 'password management.' PCI-DSS Requirement 12.1 requires a documented information security policy covering all Requirement 8 controls. SOC 2 CC1.4 requires policies to be formalised, approved, communicated, and reviewed. ISO 27001 A.9.3.1 requires documented authentication information procedures. ISO 27001 requires the document to be reviewed annually.",
      },
      {
        heading: "How often should an authentication policy be reviewed?",
        body: "ISO 27001 requires annual review. PCI-DSS requires review at least annually and after significant changes. SOC 2 auditors check that the policy has been reviewed within the audit period. Best practice is annual review plus a triggered review after any security incident, technology change, or major organisational change.",
      },
    ],
    faq: [
      { q: "Is an authentication policy the same as a password policy?", a: "Not exactly. A password policy covers password-specific rules. An authentication policy covers all credential types: passwords, MFA tokens, API keys, biometrics, and session controls. Compliance frameworks typically require the broader authentication policy." },
      { q: "Who should approve an authentication policy?", a: "Under ISO 27001 and SOC 2, policies must be approved by management. HIPAA requires a designated Security Officer. PCI-DSS requires approval by executive management or a designated security officer (DSO)." },
      { q: "Can I use PassGeni's Policy Generator for a real compliance audit?", a: "Yes. PassGeni's Policy Generator produces framework-specific documents that cite the specific regulation clauses (e.g. HIPAA §164.308(a)(5)(ii)(D)). The output is a starting point — review it with your security officer or legal counsel before submitting to auditors." },
      { q: "Does NIST require a written authentication policy?", a: "NIST SP 800-63B is a guideline, not a mandate. However, federal agencies and organisations that follow NIST as their security standard typically formalise it in a written policy. For organisations subject to FISMA, a written authentication policy is required under SP 800-53 Control IA-5." },
    ],
  },

  {
    slug:            "credential-security",
    term:            "Credential Security",
    metaTitle:       "Credential Security: Definition, Best Practices, and Compliance | PassGeni",
    metaDescription: "Credential security covers the full lifecycle of authentication secrets: generation, storage, transmission, rotation, and revocation. Learn what compliance requires at each stage.",
    excerpt:         "Credential security is the practice of protecting authentication secrets — passwords, tokens, API keys — throughout their lifecycle: from secure generation to compliant storage, rotation, and revocation.",
    publishedAt:     "2025-01-01",
    updatedAt:       "2026-04-26",
    readTime:        7,
    badge:           "Core Concept",
    badgeColor:      "#C8FF00",
    relatedTerms:    ["entropy", "password-compliance", "audit-trail"],
    relatedTools:    [
      { label: "Breach Checker", href: "/tools/breach-checker" },
      { label: "Password Audit Tool", href: "/tools/audit" },
      { label: "Credential Compliance Fixer", href: "/tools/compliance-fixer" },
    ],
    relatedGuides:   [
      { label: "FIPS 140-3 Password Requirements", href: "/guides/fips-140-3-password-requirements" },
      { label: "NIST 800-63B Guide", href: "/guides/nist-800-63b-password-guidelines" },
    ],
    definition:      "Credential security refers to the practices, controls, and technologies used to protect authentication secrets — including passwords, API keys, tokens, and certificates — throughout their full lifecycle: generation, storage, transmission, use, rotation, and revocation.",
    sections: [
      {
        heading: "The credential lifecycle",
        body: "Secure credential management requires controls at every lifecycle stage. Generation: credentials must be produced by a CSPRNG (not typed, not incremented from a previous credential). Storage: credentials must be hashed with a memory-hard algorithm (Argon2id, bcrypt, scrypt) with per-credential salts. Transmission: credentials must only travel over TLS 1.2+ connections. Rotation: credentials must be rotated upon compromise suspicion, not on a rigid schedule (per NIST 800-63B). Revocation: compromised credentials must be invalidated immediately and the event logged.",
      },
      {
        heading: "CSPRNG: why generation method matters",
        body: "Credentials generated by humans or simple random number generators are predictable. A CSPRNG (Cryptographically Secure Pseudorandom Number Generator) — such as the Web Crypto API's crypto.getRandomValues() used by PassGeni — produces outputs that are computationally indistinguishable from true randomness. FIPS 140-3 and NIST SP 800-90A specify approved DRBG (Deterministic Random Bit Generator) algorithms for credential generation in federal systems.",
      },
      {
        heading: "Credential exposure: breach databases",
        body: "Even cryptographically generated credentials can become compromised through data breaches. PassGeni's Breach Checker uses the HaveIBeenPwned API via k-anonymity — sending only the first 5 characters of the SHA-1 hash, never the full credential — to check whether a password has appeared in any known breach database. Any credential that appears in a breach database should be treated as compromised regardless of its entropy score.",
      },
      {
        heading: "Service account credentials",
        body: "Service accounts present a distinct credential security challenge: they are shared, rarely rotated, and often excluded from standard password policies. PCI-DSS Requirement 8.2.2 prohibits shared generic accounts for CDE access. SOC 2 auditors scrutinise service account credential management. Best practice: generate service account credentials with a dedicated CSPRNG tool, store them in a secrets manager, rotate them after personnel changes, and certify them for audit evidence.",
      },
    ],
    faq: [
      { q: "What makes a credential 'secure'?", a: "A secure credential has four properties: generated by a CSPRNG (unpredictable), sufficient entropy (≥60 bits minimum), not present in any breach database, and stored using a memory-hard hashing algorithm. PassGeni's analysis tools check all four properties." },
      { q: "What is the difference between a credential and a password?", a: "A password is a specific type of credential — a human-memorisable secret. Credentials is the broader category: passwords, API keys, tokens, certificates, and biometric templates. Compliance frameworks use 'credentials' when the requirement applies to all authentication secrets, not just passwords." },
      { q: "How often should credentials be rotated?", a: "NIST SP 800-63B explicitly discourages mandatory periodic rotation, which causes users to make predictable substitutions. Rotate credentials when: a breach is suspected, a team member with access departs, a system is compromised, or a security audit finds the credential in breach databases. Rotate automatically on compromise detection." },
      { q: "What hashing algorithm should be used to store passwords?", a: "Argon2id is the NIST-recommended algorithm (SP 800-63B). bcrypt and scrypt are also acceptable. MD5 and SHA-1 are not acceptable for password storage — they are fast hashes, not memory-hard, and are vulnerable to GPU-based brute-force attacks." },
    ],
  },

  {
    slug:            "password-compliance",
    term:            "Password Compliance",
    metaTitle:       "Password Compliance: What It Means, What It Requires, and How to Prove It | PassGeni",
    metaDescription: "Password compliance means meeting the documented credential requirements of a specific security framework — HIPAA, PCI-DSS, SOC 2, NIST, ISO 27001. Learn what each standard requires and how to prove compliance to auditors.",
    excerpt:         "Password compliance means that your credential management practices meet the documented requirements of a specific security or regulatory framework — and that you can prove it to an auditor.",
    publishedAt:     "2025-01-01",
    updatedAt:       "2026-04-26",
    readTime:        6,
    badge:           "Core Concept",
    badgeColor:      "#C8FF00",
    relatedTerms:    ["entropy", "authentication-policy", "audit-trail", "credential-security"],
    relatedTools:    [
      { label: "Credential Compliance Fixer", href: "/tools/compliance-fixer" },
      { label: "Password Policy Generator", href: "/tools/policy-generator" },
      { label: "Password Audit Tool", href: "/tools/audit" },
    ],
    relatedGuides:   [
      { label: "HIPAA Password Requirements", href: "/guides/hipaa-password-requirements" },
      { label: "PCI-DSS v4.0 Password Requirements", href: "/guides/pci-dss-password-requirements" },
      { label: "SOC 2 Password Requirements", href: "/guides/soc2-password-requirements" },
    ],
    definition:      "Password compliance is the state of having credential management practices — generation, complexity, storage, rotation, and documentation — that satisfy the explicit requirements of an applicable regulatory or security framework, and being able to provide auditor-verifiable evidence of that compliance.",
    sections: [
      {
        heading: "Compliance vs. security: the distinction",
        body: "A credential can be cryptographically strong but not compliant. Compliance requires meeting a specific documented standard — not just being 'strong.' A 10-character random password is cryptographically sound by many measures but fails PCI-DSS v4.0's 12-character minimum. Compliance is a legal/regulatory bar, not just a technical one.",
      },
      {
        heading: "The two components of password compliance",
        body: "Technical compliance means your credentials actually meet the standard's requirements: minimum length, character diversity, entropy thresholds, breach-free status, and CSPRNG generation. Documentary compliance means you can prove it: written password policy, per-credential compliance certificates, audit logs, and policy review records. Both are required. A strong password without documentation fails an audit. A documented policy without strong credentials is equally insufficient.",
      },
      {
        heading: "Framework-specific requirements at a glance",
        body: "HIPAA requires minimum 12 characters, 2FA for remote access, written procedures, and a designated Security Officer. PCI-DSS v4.0 requires minimum 12 characters, character diversity, MFA for all CDE access, and documented Requirement 8.3.6 evidence. SOC 2 CC6.1 requires minimum 16 characters, MFA for privileged access, documented policy, and breach monitoring. ISO 27001 A.9.4.3 requires documented authentication procedures reviewed annually. NIST 800-63B requires minimum 8 characters (higher for federal), no mandatory rotation, breach credential checks.",
      },
      {
        heading: "How PassGeni supports password compliance",
        body: "PassGeni addresses both technical and documentary compliance. The generator produces CSPRNG credentials with standard-specific presets. The Compliance Fixer checks existing credentials against six standards and generates compliant replacements. The Policy Generator produces auditor-ready policy documents. The certification endpoint issues ES256-signed compliance certificates as per-credential audit evidence.",
      },
    ],
    faq: [
      { q: "Can I be compliant without a password manager?", a: "Password managers are not required by any compliance framework. They are strongly recommended as a control for storing credentials. What is required is that credentials meet minimum standards and that you can document compliance. PassGeni certificates provide the documentation; where you store the credentials is a separate decision." },
      { q: "What happens if passwords are non-compliant during an audit?", a: "Non-compliant credentials are a finding in an audit report. Depending on the framework: PCI-DSS findings can trigger card brand fines and remediation requirements. HIPAA findings can result in OCR investigations and civil monetary penalties. SOC 2 non-compliant findings result in a qualified or adverse audit opinion. The remediation path is to generate compliant credentials and obtain compliance certificates." },
      { q: "Does password compliance cover API keys and service accounts?", a: "Yes. All major frameworks apply credential requirements to all authentication secrets, not just user-facing passwords. PCI-DSS Requirement 8 applies to service accounts and system credentials. HIPAA applies to all ePHI system access credentials. When in doubt, treat all authentication secrets as in-scope for compliance." },
      { q: "Is there a universal password compliance standard?", a: "No universal standard exists. The closest is NIST SP 800-63B, which is used as a reference by many other frameworks (HIPAA uses it as a baseline, ISO 27001 recommends NIST guidelines). A credential that meets NIST 800-63B Level 2+ requirements will typically meet HIPAA and PCI-DSS requirements as well." },
    ],
  },

  {
    slug:            "audit-trail",
    term:            "Audit Trail (Credential)",
    metaTitle:       "Credential Audit Trail: What It Is and What Compliance Requires | PassGeni",
    metaDescription: "A credential audit trail is the documented record of all actions affecting authentication secrets: creation, modification, access, rotation, and revocation. Learn what HIPAA, PCI-DSS, and SOC 2 require.",
    excerpt:         "A credential audit trail is the documented record of all actions taken on authentication secrets — creation, access, modification, rotation, and revocation — required by HIPAA, PCI-DSS, SOC 2, and ISO 27001 as evidence of controlled access management.",
    publishedAt:     "2025-01-01",
    updatedAt:       "2026-04-26",
    readTime:        5,
    badge:           "Core Concept",
    badgeColor:      "#C8FF00",
    relatedTerms:    ["password-compliance", "authentication-policy", "credential-security"],
    relatedTools:    [
      { label: "Password Audit Tool", href: "/tools/audit" },
      { label: "Password Policy Generator", href: "/tools/policy-generator" },
      { label: "Credential Compliance Fixer", href: "/tools/compliance-fixer" },
    ],
    relatedGuides:   [
      { label: "HIPAA Password Requirements", href: "/guides/hipaa-password-requirements" },
      { label: "PCI-DSS v4.0 Password Requirements", href: "/guides/pci-dss-password-requirements" },
      { label: "SOC 2 Password Requirements", href: "/guides/soc2-password-requirements" },
    ],
    definition:      "A credential audit trail is a chronological, tamper-evident record of all significant events related to authentication secrets: creation, last use, modification, rotation, revocation, and associated compliance certification. Compliance frameworks require audit trails to demonstrate that access controls are operating as documented.",
    sections: [
      {
        heading: "What must a credential audit trail include?",
        body: "A complete credential audit trail includes: the credential identifier (hash, not plaintext), creation timestamp and method, the actor who created or modified the credential, the compliance standard used at creation, all access events (timestamp, actor, system), rotation events and reason, revocation events and reason, and the compliance certificate reference URL. Never include plaintext credentials in audit logs — if logs are exfiltrated, plaintext credentials are immediately exploitable.",
      },
      {
        heading: "Audit trail requirements by framework",
        body: "HIPAA §164.312(b) requires an audit control standard: hardware, software, and procedural mechanisms to record and examine activity in systems that contain ePHI. PCI-DSS Requirement 10 requires audit log retention for at least 12 months (3 months immediately available). SOC 2 CC7.2 requires that security events be detected, logged, and reviewed. ISO 27001 A.12.4.1 requires event logging for all privileged access and authentication events.",
      },
      {
        heading: "The role of compliance certificates in audit trails",
        body: "PassGeni compliance certificates function as point-in-time audit evidence for credential creation events. The certificate URL, when included in an audit trail record, allows auditors to verify independently that the credential was: generated via CSPRNG, met the required entropy threshold, and satisfied the named compliance standard. Certificates complement access logs — they cover the creation event; your identity management system covers subsequent access events.",
      },
      {
        heading: "How long must audit trails be retained?",
        body: "HIPAA requires 6 years. PCI-DSS requires 12 months (3 months immediately accessible). SOC 2 requires retention matching your audit period (typically 12 months). ISO 27001 requires retention as defined in your information security policy, typically 12–24 months. If you are subject to multiple frameworks, retain for the longest required period — typically 6 years for HIPAA-covered entities.",
      },
    ],
    faq: [
      { q: "Is an audit trail the same as an access log?", a: "Access logs record who accessed a system and when. An audit trail is broader — it covers all significant security events including access, modification, rotation, revocation, policy changes, and failed authentication attempts. Most compliance frameworks require both." },
      { q: "Can PassGeni certificates serve as audit trail evidence?", a: "Yes, in the specific sense of creation event evidence. A PassGeni certificate URL in your audit log proves that at a specific timestamp, a credential was created with a specific entropy score meeting a named standard. It does not replace access logs for subsequent events." },
      { q: "Do audit trails need to be immutable?", a: "Audit trails should be tamper-evident at minimum. PCI-DSS Requirement 10.3 explicitly requires that audit logs be protected against modification. SOC 2 auditors look for log integrity controls. Storing logs in a write-once system or using cryptographic log chaining (like PassGeni's ES256-signed certificates) satisfies this requirement." },
      { q: "What should not be included in an audit trail?", a: "Never include: plaintext passwords or credentials, full cryptographic keys, raw PII beyond what is necessary to identify the actor, or session tokens. Include credential hashes (SHA-256) for identification, never the credential itself." },
    ],
  },
];

export const ALL_GLOSSARY_TERMS = GLOSSARY_TERMS;

export function getTermBySlug(slug) {
  return GLOSSARY_TERMS.find((t) => t.slug === slug) || null;
}

export function getRelatedTerms(slugs) {
  return GLOSSARY_TERMS.filter((t) => slugs.includes(t.slug));
}
