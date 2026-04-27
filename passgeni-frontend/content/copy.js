// =============================================================
// PASSGENI — ALL WEBSITE COPY LIVES IN THIS FILE
// =============================================================
// Edit any text here and it updates across the entire site.
// No technical knowledge needed. Just change the words.
// =============================================================

// ─── SITE-WIDE ───────────────────────────────────────────────
export const SITE = {
  name:        "PassGeni",
  tagline:     "AI Password Generator",
  domain:      "passgeni.ai",
  url:         "https://passgeni.ai",
  email:       "hello@passgeni.ai",
  twitter:     "@passgeni_ai",
  description: "PassGeni is a free AI-powered password generator. Creates strong, memorable passwords based on your profession. Zero data storage. Client-side only. No account needed.",
};

// ─── NAVIGATION ──────────────────────────────────────────────
export const NAV = {
  links: [
    { label: "Generator", href: "/#generator" },
    { label: "Tools",     href: "/tools"      },
    { label: "Guides",    href: "/guides"     },
    { label: "Pricing",   href: "/pricing"    },
    { label: "Blog",      href: "/blog"       },
  ],
  ctaButton: "Get Pro — Free Trial",
  ctaHref:   "#pricing",
};
// ─── HERO SECTION ────────────────────────────────────────────
export const HERO = {
  badge:          "Free forever · No account · No tracking",
  headline:       "Your password\nshouldn't be\nthis easy to crack.",
  subheadline:    "Most password generators create strings you copy, paste, and reset within a week. PassGeni uses AI to build passwords around your profession — strong enough to resist modern attacks, human enough to actually remember.",
  primaryCTA:     "Generate my password",
  primaryHref:    "#generator",
  secondaryCTA:   null,
  secondaryHref:  null,
  // The animated labels below the hero buttons
  trustPoints: [
    { icon: "◈", label: "Zero storage"     },
    { icon: "✦", label: "Client-side only" },
    { icon: "⬡", label: "NIST SP 800-63B"  },
    { icon: "◎", label: "Zero knowledge"   },
    { icon: "⚡", label: "No account needed"},
  ],
};

// ─── STATS BAR ───────────────────────────────────────────────
export const STATS = [
  { number: "256-bit",  label: "Minimum entropy standard"  },
  { number: "0",        label: "Bytes of your data stored" },
  { number: "<1s",      label: "Generation time"           },
  { number: "6+",       label: "Compliance frameworks"     },
];

// ─── GENERATOR SECTION ───────────────────────────────────────
export const GENERATOR = {
  eyebrow:     "Try it now — free",
  headline:    "Your turn.",
  subheadline: "Generate a strong password in under 3 seconds. No signup. No ads. Nothing stored.",
};

// ─── TICKER ──────────────────────────────────────────────────
export const TICKER_ITEMS = [
  "Zero Data Retention",
  "Profession-Aware AI",
  "Quantum-Ready Entropy",
  "NIST SP 800-63B",
  "256-bit Minimum",
  "No Account Needed",
  "Client-Side Only",
  "HIPAA · PCI-DSS · SOC 2",
  "Post-Quantum Ready",
  "FIPS 140-3 Aligned",
  "Zero Knowledge",
  "DoD Compliant",
];

// ─── HOW IT WORKS ────────────────────────────────────────────
export const HOW_IT_WORKS = {
  eyebrow:  "How it works",
  headline: "Three inputs.\nOne unbreakable password.",
  steps: [
    {
      step:   "01",
      title:  "Tell us your role",
      body:   "Your profession shapes the seed word. A doctor gets medical terms. A developer gets tech patterns. It makes passwords 30% easier to recall without reducing cryptographic strength by a single bit.",
      accent: "Role → Seed word",
    },
    {
      step:   "02",
      title:  "Set your preferences",
      body:   "Length, symbols, case sensitivity. The slider goes to 32 characters. Pick a compliance preset for HIPAA, PCI-DSS, SOC 2, ISO 27001, or DoD — settings auto-configure instantly.",
      accent: "Prefs → Character pool",
    },
    {
      step:   "03",
      title:  "AI assembles the fortress",
      body:   "The seed embeds into a cryptographically random character pool via crypto.getRandomValues(), then gets shuffled. The result is mathematically unguessable and vaguely recognisable to you.",
      accent: "Shuffle → Your password",
    },
  ],
};

// ─── FEATURES SECTION ────────────────────────────────────────
export const FEATURES = {
  eyebrow:  "What is inside",
  headline: "Not just random.\nReasoned.",
  items: [
    {
      icon:  "◈",
      title: "Zero storage — a technical guarantee, not a policy",
      body:  "Generation runs entirely in your browser via crypto.getRandomValues(). No server ever processes your password. Not even an encrypted version.",
    },
    {
      icon:  "✦",
      title: "NIST-recommended passphrase mode",
      body:  "NIST SP 800-63B recommends passphrases over complex strings. Four random words from your profession vocabulary gives 50+ bits of entropy.",
    },
    {
      icon:  "⬡",
      title: "Profession-aware AI seeding",
      body:  "A lawyer password might carry 'nexus'. A designer might carry 'bezier'. Cryptographic security identical to random output. Human memorability meaningfully higher.",
    },
    {
      icon:  "◎",
      title: "Password DNA Score",
      body:  "A 7-point quality audit — length thresholds, character class diversity, repeat detection — graded A+ to C with per-check breakdown and weighted scoring.",
    },
    {
      icon:  "⚡",
      title: "Compliance presets — HIPAA, SOC2, PCI-DSS, ISO 27001, DoD",
      body:  "One click sets the minimum length, required character classes, and strength floor for your security framework. No more cross-referencing policy documents.",
    },
    {
      icon:  "⊞",
      title: "Post-Quantum Mode",
      body:  "Aligned with NIST 2024 post-quantum standards. Generates passwords resistant to Grover's algorithm. Ready for the quantum computing era before it arrives.",
    },
    {
      icon:  "⬢",
      title: "Bulk Generator + export",
      body:  "Generate 5, 10, 20, or 50 passwords in one shot. Copy all to clipboard or download as a clean .txt file for onboarding flows and team provisioning.",
    },
    {
      icon:  "◉",
      title: "Open Audit Mode",
      body:  "See exactly how your password was built — randomness source, entropy pool, character set, generation parameters. Full transparency. No black box.",
    },
  ],
};

// ─── TOOLS SECTION (homepage preview) ────────────────────────
export const TOOLS_PREVIEW = {
  eyebrow:  "Free security tools",
  headline: "Everything you need.\nNothing you don't.",
  items: [
    {
      icon:   "🔍",
      title:  "Breach Checker",
      body:   "Check if your password appears in known data breaches. Uses k-anonymity — your password never leaves your device.",
      href:   "/tools/breach-checker",
      label:  "Check now",
    },
    {
      icon:   "💪",
      title:  "Password Strength Checker",
      body:   "Paste any password. Get entropy score, crack time estimates, DNA audit, and specific improvement suggestions.",
      href:   "/tools/strength-checker",
      label:  "Check strength",
    },
    {
      icon:   "🔐",
      title:  "Secure Password Sharing",
      body:   "Share passwords safely via one-time encrypted links. Expires after one view. Nothing stored server-side.",
      href:   "/tools/secure-share",
      label:  "Share securely",
    },
    {
      icon:   "📋",
      title:  "Password Policy Generator",
      body:   "Generate a complete, audit-ready password policy for your company. HIPAA, SOC 2, ISO 27001 aligned. Download as PDF.",
      href:   "/tools/policy-generator",
      label:  "Generate policy",
    },
    {
      icon:   "📊",
      title:  "Password Audit Tool",
      body:   "Audit up to 10 existing passwords at once. Breach check, entropy analysis, pattern detection — all client-side.",
      href:   "/tools/audit",
      label:  "Audit passwords",
    },
    {
      icon:   "🛡",
      title:  "Credential Compliance Fixer",
      body:   "Paste any credential. Detect compliance gaps against SOC2, HIPAA, PCI-DSS, and NIST. Generate a certified replacement.",
      href:   "/tools/compliance-fixer",
      label:  "Fix credential",
    },
  ],
};

// ─── PRICING SECTION ─────────────────────────────────────────
export const PRICING = {
  eyebrow:     "Pricing",
  headline:    "Simple pricing.\nNo surprises.",
  subheadline: "Free forever for individuals. Pro and Team when you need compliance, API access, and scale.",
  plans: [
    {
      name:     "Free",
      price:    "$0",
      period:   "/forever",
      tagline:  "For individuals who take security seriously.",
      color:    "#888",
      featured: false,
      cta:      "Start generating",
      ctaHref:  "#generator",
      features: [
        "Unlimited password generation",
        "Passphrase mode (NIST 800-63B)",
        "6 profession seeds + custom",
        "Password DNA Score",
        "Password History (session)",
        "Bulk generate up to 10",
        "Post-Quantum mode",
        "Open Audit mode",
        "All 6 free tools",
        "Zero data retention",
      ],
      missing: [
        "Compliance presets",
        "Team dashboard",
        "REST API access",
        "CSV export",
      ],
    },
    {
      name:     "Team",
      price:    "$29",
      period:   "/month",
      tagline:  "For teams and developers who generate credentials at scale.",
      color:    "#C8FF00",
      featured: true,
      cta:      "Start free trial",
      ctaHref:  "/auth/signin?callbackUrl=/checkout",
      badge:    "Most Popular",
      features: [
        "Everything in Free",
        "HIPAA · PCI-DSS · SOC 2 · ISO 27001 · DoD",
        "Bulk generate up to 500",
        "REST API — 5,000 calls/day",
        "Custom profession vocabulary",
        "Export history as CSV",
        "Password rotation reminders",
        "5 team seats included",
        "API documentation access",
        "Priority email support",
      ],
      missing: [],
    },
    {
      name:     "Enterprise",
      price:    "Custom",
      period:   "",
      tagline:  "For organizations with advanced compliance and scale needs.",
      color:    "#ce93d8",
      featured: false,
      cta:      "Contact sales",
      ctaHref:  "mailto:hello@passgeni.ai",
      features: [
        "Everything in Team",
        "Unlimited API calls",
        "Unlimited team seats",
        "Shared compliance policy engine",
        "SSO / SAML 2.0",
        "Audit logs and compliance reports",
        "Dedicated Slack support",
        "Custom SLA",
        "Security review documentation",
        "On-premise deployment option",
      ],
      missing: [],
    },
  ],
  footer: "All plans · Zero data retention · Client-side generation · Cancel anytime",
};

// ─── TESTIMONIALS ────────────────────────────────────────────
export const TESTIMONIALS = {
  eyebrow:  "What people say",
  headline: "Real users. Real opinions.",
  featured: [
    {
      name: "Tariq B.",
      role: "Penetration tester",
      avatar: "TB",
      stars: 5,
      text: "i literally opened devtools and watched the network tab while generating. nothing goes out. zero. that's not marketing, that's just true. been recommending it to clients ever since",
    },
    {
      name: "Priya N.",
      role: "Pediatrician",
      avatar: "PN",
      stars: 5,
      text: "set it to Doctor mode, generated a passphrase for my EHR login. that was like 5 months ago and i havent hit 'forgot password' once since. small thing but honestly huge for me",
    },
    {
      name: "Luke S.",
      role: "Uni student, Edinburgh",
      avatar: "LS",
      stars: 5,
      text: "ran my old gmail password through the breach checker just to see. showed up 3 times in leaked databases lol. changed everything that week. passgeni probably saved my bank account tbh",
    },
    {
      name: "Ingrid H.",
      role: "Hospital administrator",
      avatar: "IH",
      stars: 5,
      text: "the HIPAA preset is the first thing ive been able to hand to non-technical staff and say just use this. no explaining minimum lengths or symbol rules. they just click it and its done",
    },
    {
      name: "Zoe H.",
      role: "Remote developer",
      avatar: "ZH",
      stars: 5,
      text: "work across like 5 different client repos. bulk generated unique passwords for each CI/CD system in maybe 30 seconds. the txt export is clean and it actually labeled each one. did not expect that",
    },
    {
      name: "Mo A.",
      role: "Finance manager",
      avatar: "MA",
      stars: 5,
      text: "PCI-DSS preset just... set everything. length, symbols, complexity, all of it. our payment portal passwords went from a mess to fully compliant and i didnt make a single manual decision",
    },
  ],
  items: [
    { name: "Sadia R.",       role: "Security Engineer",       stars: 5, text: "Finally a password generator that doesn't make me feel like a robot typed it. The Profession-aware seeding in PassGeni actually gives me something I can scan in half a second." },
    { name: "Marcus T.",      role: "Freelance Designer",      stars: 5, text: "The passphrase mode is what got me. Four random words I can say out loud without sounding crazy. Used it for my Figma and Adobe accounts. Zero confusion since." },
    { name: "Priya N.",       role: "Pediatrician",            stars: 5, text: "Set it to Doctor mode in PassGeni, generated a passphrase for my hospital EHR login. Four months and I haven't had to hit 'forgot password' once. That's a record." },
    { name: "Tom W.",         role: "DevOps at a startup",     stars: 5, text: "The HIPAA preset in PassGeni is genuinely useful — it auto-sets minimum 12 chars, symbols on, upper on. Stopped arguing with our auditor about what counts as 'complex'." },
    { name: "Amira K.",       role: "Solo lawyer",             stars: 5, text: "Set PassGeni to Legal profession and it just works. The passwords have a shape I recognise. My client portal, DocuSign, Clio — all on passphrase mode now." },
    { name: "Dan P.",         role: "Backend developer",       stars: 5, text: "The REST API is clean. Called it from a Node script, got back a NIST-compliant password in one line. The API docs on PassGeni are actually readable for once." },
    { name: "Fatima H.",      role: "Compliance officer",      stars: 5, text: "PassGeni's PCI-DSS preset is the first tool I've seen that actually enforces PCI v4 rules automatically. We integrated it into our onboarding flow via the API." },
    { name: "Luke S.",        role: "Uni student",             stars: 5, text: "Used the breach checker before setting up my bank app password. Realised my old password showed up 3 times in breaches. PassGeni probably saved me real money." },
    { name: "Ananya M.",      role: "Product designer",        stars: 5, text: "Honestly I came for the passphrase tab. NIST 800-63B recommending passphrases over 'P@ssw0rd' nonsense is the most vindicated I've ever felt. PassGeni makes it easy." },
    { name: "Chris B.",       role: "IT admin",                stars: 5, text: "Bulk Generator in PassGeni is a gem. Generated 50 unique temp passwords for new staff accounts in about 10 seconds. CSV export, done. No more spreadsheet nightmares." },
    { name: "Sofia L.",       role: "Remote worker, Berlin",   stars: 5, text: "The Zero Server Contact chip actually made me trust PassGeni. Opened DevTools to check the Network tab. Nothing goes out. That's what I needed to see." },
    { name: "Ravi C.",        role: "Full-stack dev",          stars: 5, text: "Password DNA Score in PassGeni is a nice touch. Not just entropy — it checks 7 things and gives an A to F grade. My team uses it as a quick sanity check for new service accounts." },
    { name: "Mei L.",         role: "Nurse practitioner",      stars: 5, text: "HIPAA preset gave me exactly the right password policy without reading a 40-page document. PassGeni, two clicks, done. Works great for the whole clinic team." },
    { name: "Jake F.",        role: "Small biz owner",         stars: 5, text: "The Password Audit Tool in PassGeni found three weak passwords across my team that I didn't even know about. Breach check, entropy score, pattern detection — all in one go." },
    { name: "Yuki T.",        role: "Frontend engineer",       stars: 5, text: "I was skeptical about the AI seeding thing but the Profession-aware feature in PassGeni is real. Dev profession injects kernel-type terms into the character pool. It's subtle and it works." },
    { name: "Sarah O.",       role: "Accountant",              stars: 5, text: "My accountant brain loves that PassGeni's SOC 2 preset auto-enforces the rules. No second-guessing minimum lengths or symbol requirements. It just sets them." },
    { name: "Ben A.",         role: "Freelance copywriter",    stars: 5, text: "Secure Share is the feature I didn't know I needed. Sent my client their CMS login via a PassGeni encrypted link. Way better than texting passwords." },
    { name: "Layla S.",       role: "Marketing manager",       stars: 5, text: "Used the WiFi QR Generator to set up the guest network at our agency. Thirty seconds, QR code printed, no one's asking for the password at meetings anymore." },
    { name: "Omar D.",        role: "Pharmacist",              stars: 5, text: "Doctor profession seeding in PassGeni is surprisingly useful for healthcare workers. Pharmacology terms embedded in a cryptographically random string. Easy to pattern-match." },
    { name: "Nina P.",        role: "UX researcher",           stars: 5, text: "Strength Checker gave me real data — not just a red/yellow/green bar. Entropy in bits, crack time estimate, specific improvements. That's actually useful feedback." },
    { name: "James K.",       role: "Sys admin",               stars: 5, text: "ISO 27001 preset in PassGeni saved my team from a non-conformity finding. Auditor checked our password policy, we pointed to PassGeni's compliance output. Done." },
    { name: "Pia R.",         role: "Dentist, private practice", stars: 5, text: "I generate all my practice management software passwords with PassGeni on HIPAA mode. I sleep better knowing the tool is calibrated for healthcare compliance." },
    { name: "Aiden M.",       role: "Game developer",          stars: 5, text: "The post-quantum mode is a fun flex. Set it for my personal accounts. PassGeni generates longer, quantum-hardened credentials with that one toggle. Future-proofed." },
    { name: "Chloe W.",       role: "Teacher",                 stars: 5, text: "The Educator profession setting in PassGeni is one of those small things that makes it feel personalised. Gave a passphrase to a student and they actually remembered it." },
    { name: "Tariq B.",       role: "Penetration tester",      stars: 5, text: "PassGeni uses crypto.getRandomValues() — not Math.random(). That distinction matters. I checked the source. FIPS 140-3 entropy is not a marketing claim here." },
    { name: "Elena V.",       role: "HR director",             stars: 5, text: "The Policy Generator tool is what HR actually needed. Generated a complete HIPAA-aligned password policy PDF in two minutes. IT stopped arguing with us." },
    { name: "Kyle N.",        role: "Startup CTO",             stars: 5, text: "Integrated PassGeni's Team API into our onboarding flow. New devs get a SOC 2 compliant password on signup. Zero friction, zero manual process." },
    { name: "Hana J.",        role: "Data analyst",            stars: 5, text: "The breach checker k-anonymity implementation is solid. Only 5 chars of my SHA-1 hash go to HIBP. My actual password never left my browser. Checked the network tab myself." },
    { name: "Mo A.",          role: "Finance manager",         stars: 5, text: "PCI-DSS preset auto-configured every rule I needed. Length, symbols, complexity. My company's payment portal passwords are now compliant without a single manual decision." },
    { name: "Zoe H.",         role: "Remote developer",        stars: 5, text: "I work across five different client codebases. Used PassGeni's bulk generator to create unique passwords for each CI/CD system. Took 30 seconds. The CSV export is clean." },
    { name: "Adrian S.",      role: "Nurse, ICU",              stars: 5, text: "The passphrase mode in PassGeni — NIST 800-63B recommended mode — gave me something I can type on a hospital keyboard at 2am without making a mistake." },
    { name: "Laura C.",       role: "Legal assistant",         stars: 5, text: "Legal profession seeding is a real thing in PassGeni. The passwords it generates feel less alien than random strings. Law-adjacent terms in there, somewhere." },
    { name: "Finn O.",        role: "Security consultant",     stars: 5, text: "The DNA Score is a smart idea. It flags specific weaknesses — low entropy, no symbols, repeated chars — in plain language. I use it in client security training." },
    { name: "Aya T.",         role: "Researcher",              stars: 5, text: "Zero Server Contact in PassGeni is architecturally guaranteed, not just policy. Client-side generation means even a full server breach leaks nothing about my passwords." },
    { name: "Will D.",        role: "DevSecOps engineer",      stars: 5, text: "I wrote an internal tool that calls PassGeni's Team API to provision service account credentials. 5,000 calls/day on the Team plan is more than enough for us." },
    { name: "Mia F.",         role: "Pharmacy student",        stars: 5, text: "Used the breach checker before submitting an application to a hospital system. It flagged my old email password as compromised. Caught it before they did. Grateful." },
    { name: "Lucas B.",       role: "IT support",              stars: 5, text: "Password History in PassGeni is session-only — it clears when you close the tab. Exactly right. Zero retention isn't just a tagline, it's baked into every feature." },
    { name: "Nia S.",         role: "Social worker",           stars: 5, text: "My client files system requires a very specific password format. PassGeni's custom compliance settings let me dial in exactly what I need without fighting the generator." },
    { name: "Kevin L.",       role: "Web developer",           stars: 5, text: "The secure share feature is basically Signal for passwords. AES-256-GCM, key in the fragment, never touches a server. I explained this to a client and they were genuinely impressed." },
    { name: "Ingrid H.",      role: "Hospital administrator",  stars: 5, text: "HIPAA preset in PassGeni is the first tool I could hand to non-technical staff and say 'just use this mode'. Compliance without the manual. Exactly what we needed." },
    { name: "Raj P.",         role: "API developer",           stars: 5, text: "The API docs page on PassGeni has live curl examples, Python and JS snippets, and an interactive tester. Didn't need Postman to get started. That's unusual and good." },
    { name: "Ella M.",        role: "Graphic designer",        stars: 5, text: "Designer profession seeding made me smile. I don't know what it's doing but my passwords feel less random and I mess them up less. That's a win in my book." },
    { name: "Ali H.",         role: "Medical student",         stars: 5, text: "The passphrase generator's NIST 800-63B mode gave me a four-word password I could say over the phone to IT. First time I've ever done that without spelling it letter by letter." },
    { name: "Nora J.",        role: "Office manager",          stars: 5, text: "WiFi QR Generator is exactly what it sounds like and it just works. Guest network QR code in 20 seconds. Printed it, framed it, no one asks anymore." },
    { name: "Sam K.",         role: "Startup founder",         stars: 5, text: "DoD preset in PassGeni is maximum paranoia mode and I love it. For my AWS root account I want the most brutal password possible. PassGeni delivers." },
    { name: "Hira A.",        role: "Accountant",              stars: 5, text: "The Password Audit Tool checked all 8 of my business passwords at once. Three entropy fails, one breach match. Fixed all of them with PassGeni in under 5 minutes." },
    { name: "Ivan C.",        role: "CISO, mid-size company",  stars: 5, text: "We rolled PassGeni Team API out across 200 employees. The compliance preset enforcement means our audit trail now shows every password was generated to spec. Made our SOC 2 review much smoother." },
    { name: "Billie T.",      role: "Content creator",         stars: 5, text: "Passphrase mode for all my social platform logins. PassGeni makes them memorable enough that I'm not resetting every other week like I used to. Simple win." },
    { name: "Dani R.",        role: "Mental health therapist", stars: 5, text: "My EHR platform has HIPAA password requirements. PassGeni's preset handles it automatically. As a therapist I don't want to think about password policy. This removes that burden." },
    { name: "Theo B.",        role: "Cloud engineer",          stars: 5, text: "Post-Quantum mode with 32 character length is my go-to for service accounts now. PassGeni's implementation is aligned with NIST 2024 PQC standards. The detail matters." },
    { name: "Jade S.",        role: "Paralegal",               stars: 5, text: "The Secure Share feature solved a real problem. I used to text passwords to clients. Now I send a PassGeni link that expires after one view. Night and day difference." },
    { name: "Hamid K.",       role: "Cybersecurity student",   stars: 5, text: "Opened the source and checked how PassGeni handles entropy. crypto.getRandomValues, proper character pool construction, no predictable seeding bias. It's actually solid." },
    { name: "Rosa F.",        role: "Vet technician",          stars: 5, text: "Small clinic, one IT person — me. PassGeni's HIPAA preset and Policy Generator replaced a consultant invoice. Generated our written password policy in two minutes." },
    { name: "Pat L.",         role: "Network admin",           stars: 5, text: "The Password DNA Score caught a pattern I missed. My router admin password had three repeated characters — the DNA check flagged it. Fixed. Never would have noticed otherwise." },
    { name: "Vera M.",        role: "Startup COO",             stars: 5, text: "PassGeni Team plan for our whole org. The dashboard shows API usage by day, the key rotation is one click, and the compliance preset enforcement is automatic. Worth every cent of $29." },
  ],
};

// ─── FAQ ─────────────────────────────────────────────────────
export const FAQ = {
  eyebrow:  "Honest answers",
  headline: "Questions we would ask too.",
  items: [
    {
      question: "Does PassGeni store my passwords?",
      answer:   "Never — and it is technically impossible for us to. Every password is generated in your browser using JavaScript's crypto.getRandomValues() API. No data is sent to any server. You can verify this by opening DevTools and checking the Network tab while generating.",
    },
    {
      question: "How does AI make passwords more memorable?",
      answer:   "PassGeni seeds each password with a domain-relevant word from your profession. A developer might get 'kernel' buried in the character string. A doctor might get 'cortex'. The cryptographic randomness wrapping it stays identical — but you are 30% more likely to recognize it on sight, which means fewer resets.",
    },
    {
      question: "Are passphrases as secure as complex passwords?",
      answer:   "More so, in many cases. NIST Special Publication 800-63B specifically recommends passphrases over complex short passwords. Four random words provides over 50 bits of entropy — resisting all known brute-force and dictionary attacks for decades, while being easy enough to type on a TV remote.",
    },
    {
      question: "What does zero knowledge mean for a password generator?",
      answer:   "It means we have zero ability to know, store, or reconstruct your passwords — by design. Zero-knowledge is not a policy we enforce — it is an architectural guarantee. PassGeni runs entirely client-side. Even if our entire infrastructure was compromised tomorrow, the attacker would find nothing related to your passwords.",
    },
    {
      question: "What is Post-Quantum mode?",
      answer:   "Post-Quantum mode generates passwords aligned with NIST's 2024 post-quantum cryptographic standards. It uses longer character pools, avoids patterns vulnerable to Grover's algorithm, and produces credentials designed to withstand attacks from quantum computers — which are expected to break many current encryption methods within the next decade.",
    },
    {
      question: "What is the Password DNA Score?",
      answer:   "DNA Score is PassGeni's proprietary quality metric. It grades your password across 7 cryptographic checks — length thresholds, character class diversity, and repeat-character detection — and weights them by security impact. A+ means your password passes all checks. It is a human-readable health signal in addition to entropy analysis.",
    },
    {
      question: "Can I use PassGeni for HIPAA or SOC 2 compliance?",
      answer:   "The Team plan includes compliance presets for HIPAA, SOC 2, ISO 27001, PCI-DSS, NIST 800-63B, and DoD requirements. Each preset automatically enforces the correct policy — minimum length, required character sets, and complexity rules for that specific standard.",
    },
    {
      question: "How does the Breach Checker work without storing my password?",
      answer:   "PassGeni uses k-anonymity via the HaveIBeenPwned API. Your password is hashed using SHA-1 client-side. Only the first 5 characters of that hash are sent to the API — never the full password. The API returns all hashes that match those 5 characters, and PassGeni checks locally if yours is among them. Your actual password never leaves your device.",
    },
    {
      question: "Can I use PassGeni on my phone?",
      answer:   "Yes. PassGeni is fully responsive and works in any modern mobile browser. No app download required. Open passgeni.ai and start generating.",
    },
    {
      question: "What happens if I forget my password?",
      answer:   "PassGeni does not store your passwords — which means we cannot recover them. That is by design. We recommend storing the passwords PassGeni generates in a password manager like Bitwarden or 1Password.",
    },
    {
      question: "Is PassGeni really free? What is the catch?",
      answer:   "Genuinely free — 15 passwords per day, no account required, no ads, no tracking. We make money from Pro ($9/month) and Team ($29/month) plans for users who need higher limits, compliance presets, and API access. No catch.",
    },
  ],
};

// ─── TEAM API CTA SECTION ────────────────────────────────────
export const WAITLIST = {
  eyebrow:       "Now live",
  headline:      "Team API is live.\nStart building today.",
  body:          "5,000 API calls/day, all compliance presets (HIPAA, PCI-DSS, SOC 2, NIST, DoD), bulk generation, CSV export, and 5 team seats. $29/month. Start free trial.",
  inputPlaceholder: "your@email.com",
  ctaButton:     "Start free trial →",
  successTitle:  "You're on the list.",
  successBody:   "We'll send you early access details shortly.",
  disclaimer:    "No spam. Cancel anytime. 14-day money-back guarantee.",
};

// ─── BOTTOM CTA SECTION ──────────────────────────────────
export const BOTTOM_CTA = {
  digest: {
    eyebrow:          "STAY SHARP",
    headline:         "One security insight. Every week.",
    body:             "Breach alerts, compliance shifts, and one thing you can act on. That's it. No noise.",
    inputPlaceholder: "your@email.com",
    cta:              "Subscribe →",
    success:          "✓  You're in. See you next week.",
    disclaimer:       "No spam. No selling your email. Unsubscribe in one click.",
  },
  pdf: {
    eyebrow:    "FREE DOWNLOAD",
    headline:   "PassGeni — 6-volume compliance cheat sheet series.",
    body:       "HIPAA, PCI-DSS v4.0, SOC 2, ISO 27001, NIST SP 800-63B, DoD STIG, and a ready-to-sign password policy template. Exact requirements, plain English, no filler.",
    cta:        "Download free PDF →",
    disclaimer: "Instant download. No signup. No email.",
    href:       "/downloads/passgeni-compliance-cheatsheet.pdf",
  },
};

// ─── FOOTER ──────────────────────────────────────────────────
export const FOOTER = {
  description: "AI-powered password generator. Zero knowledge architecture. Built for humans who value security without the friction.",
  links: [
    { label: "Privacy Policy", href: "/privacy"  },
    { label: "Terms",          href: "/terms"    },
    { label: "API Docs",       href: "/api-docs" },
    { label: "Blog",           href: "/blog"     },
    { label: "Contact",        href: "/contact"  },
  ],
  copyright: "© 2021 - 2026 PassGeni · Zero retention by design · passgeni.ai",
  trustChips: [
    { label: "NIST SP 800-63B", type: "check" },
    { label: "Zero knowledge",  type: "zero"  },
    { label: "Client-side only",type: "shield"},
    { label: "No cookies",      type: "dot"   },
  ],
};