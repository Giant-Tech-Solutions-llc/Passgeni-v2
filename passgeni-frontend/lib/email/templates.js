// =============================================================
// PASSGENI — EMAIL TEMPLATES  (lib/email/templates.js)
// =============================================================
// All HTML email templates for PassGeni.
// Import the relevant function and call with the required data.
//
// Templates:
//   waitlistWelcome(email)          — Waitlist confirmation
//   waitlistDay3(email)             — Day 3 nurture: free tools overview
//   waitlistDay7(email)             — Day 7 nurture: compliance guide
//   waitlistLaunch(email)           — Launch announcement
//   teamWelcome(email, rawKey)      — Team subscription provisioned
//   teamTrialReminder(email, days)  — 3 days before trial end
//   teamPaymentFailed(email)        — Payment failure notification
//   teamCancellation(email)         — Cancellation confirmation
//   teamApiLimitWarning(email, pct) — 80% / 100% usage alerts
// =============================================================

const BRAND = {
  name:    "PassGeni",
  url:     "https://passgeni.ai",
  email:   "hello@passgeni.ai",
  color:   "#C8FF00",
  bg:      "#060608",
  card:    "#0a0a0c",
  border:  "#141416",
  text:    "#e0e0e0",
  muted:   "#aaa",
  dim:     "#555",
};

// ─── SHARED PRIMITIVES ───────────────────────────────────────

function wrapper(content) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="dark">
  <style>
    body { background:${BRAND.bg}; color:${BRAND.text}; font-family:'DM Sans',Arial,sans-serif; margin:0; padding:40px 20px; -webkit-font-smoothing:antialiased; }
    a { color:${BRAND.color}; text-decoration:none; }
    a:hover { text-decoration:underline; }
  </style>
</head>
<body>
  <div style="max-width:560px;margin:0 auto;">
    ${logo()}
    ${content}
    ${footer()}
  </div>
</body>
</html>`;
}

function logo() {
  return `<div style="margin-bottom:32px;">
    <a href="${BRAND.url}" style="font-size:22px;font-weight:800;color:${BRAND.color};letter-spacing:-0.02em;text-decoration:none;">${BRAND.name}</a>
  </div>`;
}

function footer(extra = "") {
  return `<div style="border-top:1px solid ${BRAND.border};padding-top:24px;margin-top:40px;">
    ${extra ? `<p style="font-size:13px;color:${BRAND.muted};line-height:1.6;margin:0 0 12px;">${extra}</p>` : ""}
    <p style="font-size:11px;color:${BRAND.dim};line-height:1.6;margin:0;">
      You're receiving this because you signed up at <a href="${BRAND.url}">${BRAND.url}</a>.<br>
      <a href="${BRAND.url}/unsubscribe" style="color:${BRAND.dim};">Unsubscribe</a> · <a href="${BRAND.url}/privacy" style="color:${BRAND.dim};">Privacy Policy</a>
    </p>
  </div>`;
}

function h1(text) {
  return `<h1 style="font-size:28px;font-weight:800;color:#fff;margin:0 0 16px;line-height:1.2;letter-spacing:-0.02em;">${text}</h1>`;
}

function p(text) {
  return `<p style="font-size:15px;color:${BRAND.muted};line-height:1.8;margin:0 0 16px;">${text}</p>`;
}

function card(content) {
  return `<div style="background:${BRAND.card};border:1px solid ${BRAND.border};border-radius:12px;padding:24px;margin:24px 0;">${content}</div>`;
}

function badge(text) {
  return `<span style="font-family:monospace;font-size:9px;color:${BRAND.color};background:${BRAND.color}18;border:1px solid ${BRAND.color}33;border-radius:100px;padding:3px 10px;letter-spacing:0.1em;text-transform:uppercase;">${text}</span>`;
}

function checkList(items) {
  return `<ul style="margin:0;padding:0;list-style:none;">
    ${items.map((item) => `<li style="display:flex;gap:10px;align-items:flex-start;margin-bottom:10px;">
      <span style="color:${BRAND.color};font-size:13px;flex-shrink:0;margin-top:1px;">✓</span>
      <span style="font-size:14px;color:#ccc;line-height:1.6;">${item}</span>
    </li>`).join("")}
  </ul>`;
}

function cta(text, url) {
  return `<div style="margin:28px 0;">
    <a href="${url}" style="display:inline-block;background:${BRAND.color};color:#000;font-weight:700;font-size:14px;padding:14px 28px;border-radius:8px;text-decoration:none;letter-spacing:-0.01em;">${text}</a>
  </div>`;
}

function divider() {
  return `<div style="border-top:1px solid ${BRAND.border};margin:28px 0;"></div>`;
}

// ─── WAITLIST WELCOME ─────────────────────────────────────────

export function waitlistWelcome(email) {
  return {
    subject: "You're on the PassGeni waitlist 🔐",
    html: wrapper(`
      ${h1("You're on the list.")}
      ${p("Thanks for signing up. We'll send you one email when PassGeni Pro launches — Team API access, compliance presets, 5,000 calls/day, and 5 team seats. Early users get 3 months free.")}
      ${card(`
        <p style="font-family:monospace;font-size:10px;color:#888;letter-spacing:0.12em;text-transform:uppercase;margin:0 0 16px;">What you're getting</p>
        ${checkList([
          "REST API — 5,000 calls/day",
          "HIPAA · PCI-DSS · SOC 2 · ISO 27001 · DoD presets",
          "Bulk generate up to 500 passwords per request",
          "Team dashboard with usage analytics",
          "5 team seats with role-based access",
          "<strong>3 months free</strong> for early users",
        ])}
      `)}
      ${p(`In the meantime, the free generator is live at <a href="${BRAND.url}">${BRAND.url}</a>. Zero storage. Client-side only. Works right now.`)}
    `),
  };
}

// ─── WAITLIST DAY 3: FREE TOOLS OVERVIEW ──────────────────────

export function waitlistDay3(email) {
  return {
    subject: "6 free security tools you can use right now",
    html: wrapper(`
      ${badge("Day 3")}
      <div style="margin-top:16px;"></div>
      ${h1("6 tools, all free, all client-side.")}
      ${p("While you're waiting for Pro, here are the six free tools that are already live:")}
      ${card(`
        <div style="display:grid;gap:14px;">
          ${[
            { name: "Breach Checker",     desc: "Check if a password appears in 900M+ known-breached credentials. k-anonymity — password never transmitted.",   path: "/tools/breach-checker"   },
            { name: "Strength Checker",   desc: "Entropy in bits, crack time estimates across MD5/bcrypt/Argon2, DNA Score.",                                    path: "/tools/strength-checker" },
            { name: "Password Audit",     desc: "Batch check up to 10 passwords simultaneously for entropy, breach status, and pattern detection.",              path: "/tools/audit"            },
            { name: "Policy Generator",   desc: "Generate a downloadable password policy document for HIPAA, PCI-DSS, SOC 2, ISO 27001, NIST, or DoD.",         path: "/tools/policy-generator" },
            { name: "Secure Share",       desc: "AES-256-GCM encrypted sharing. Key in URL fragment — never sent to any server, including ours.",                path: "/tools/secure-share"     },
            { name: "Compliance Fixer",    desc: "Detect compliance gaps in any credential. Generate a certified replacement meeting SOC2/HIPAA/PCI-DSS/NIST.",  path: "/tools/compliance-fixer" },
          ].map((tool) => `
            <div>
              <a href="${BRAND.url}${tool.path}" style="font-weight:700;font-size:14px;color:#fff;text-decoration:none;">${tool.name} →</a>
              <p style="font-size:13px;color:#777;margin:3px 0 0;line-height:1.5;">${tool.desc}</p>
            </div>
          `).join("")}
        </div>
      `)}
      ${cta("See all tools →", `${BRAND.url}/tools`)}
    `),
  };
}

// ─── WAITLIST DAY 7: COMPLIANCE GUIDE ────────────────────────

export function waitlistDay7(email) {
  return {
    subject: "What HIPAA actually requires for passwords",
    html: wrapper(`
      ${badge("Day 7")}
      <div style="margin-top:16px;"></div>
      ${h1("What HIPAA actually requires.")}
      ${p("HIPAA doesn't specify an exact minimum password length. What it specifies is an outcome: 'reasonable and appropriate' technical safeguards for ePHI. What that means in practice:")}
      ${card(`
        ${checkList([
          "Minimum 12 characters (HHS guidance baseline) — 8 is the floor, 12+ is expected",
          "MFA for remote access and EHR access — not explicitly required but practically mandatory in 2025",
          "Automatic logoff after 15–30 minutes inactivity",
          "Authentication event logging, retained for 6 years",
          "A written password policy — the documentation is as important as the controls",
        ])}
      `)}
      ${p("We wrote the full guide: exact requirements, audit checklist, policy template, and implementation details.")}
      ${cta("Read the HIPAA guide →", `${BRAND.url}/guides/hipaa-password-requirements`)}
      ${divider()}
      ${p(`More compliance guides: <a href="${BRAND.url}/guides/pci-dss-password-requirements">PCI-DSS v4.0</a> · <a href="${BRAND.url}/guides/soc2-password-requirements">SOC 2</a> · <a href="${BRAND.url}/guides/nist-800-63b-password-guidelines">NIST 800-63B</a>`)}
    `),
  };
}

// ─── WAITLIST LAUNCH ──────────────────────────────────────────

export function waitlistLaunch(email) {
  return {
    subject: "PassGeni Pro is live — 3 months free for early access",
    html: wrapper(`
      ${h1("It's live. Your 3 months free start now.")}
      ${p("PassGeni Pro is ready. As a waitlist member, you get 3 months free — no credit card required during the trial.")}
      ${card(`
        <p style="font-family:monospace;font-size:10px;color:#888;letter-spacing:0.12em;text-transform:uppercase;margin:0 0 16px;">Team plan — $29/month</p>
        ${checkList([
          "REST API with 5,000 calls/day",
          "All 6 compliance presets via API (HIPAA, PCI-DSS, SOC 2, ISO 27001, NIST, DoD)",
          "Bulk generation up to 500 passwords per request",
          "Team dashboard with usage analytics and 7-day history",
          "5 team seats",
          "3 months free for waitlist members",
        ])}
      `)}
      ${cta("Start your free 3 months →", `${BRAND.url}/#pricing`)}
      ${p("After the trial: $29/month. Cancel any time. No questions.")}
    `),
  };
}

// ─── TEAM WELCOME ─────────────────────────────────────────────

export function teamWelcome(email, rawKey) {
  return {
    subject: "Your PassGeni API key is ready",
    html: wrapper(`
      ${h1("You're in. Here's your API key.")}
      ${p("Your PassGeni Team plan is active. Save this key — it's shown once and never stored in plaintext.")}
      <div style="background:#000;border:1px solid ${BRAND.color}33;border-radius:8px;padding:18px 20px;margin:24px 0;">
        <p style="font-family:monospace;font-size:10px;color:#888;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 10px;">API Key</p>
        <p style="font-family:monospace;font-size:13px;color:${BRAND.color};word-break:break-all;margin:0;line-height:1.6;">${rawKey}</p>
      </div>
      ${card(`
        <p style="font-family:monospace;font-size:10px;color:#888;letter-spacing:0.12em;text-transform:uppercase;margin:0 0 14px;">Quick start</p>
        <div style="background:#000;border-radius:6px;padding:14px 16px;">
          <code style="font-family:monospace;font-size:12px;color:#ccc;white-space:pre-wrap;line-height:1.7;">curl https://passgeni.ai/api/v1/generate \\
  -H "X-API-Key: ${rawKey.substring(0, 10)}..." \\
  -d '{"compliance":"hipaa","count":1}'</code>
        </div>
      `)}
      ${checkList([
        `5,000 API calls/day`,
        `All 6 compliance presets (HIPAA, PCI-DSS, SOC 2, ISO 27001, NIST, DoD)`,
        `Bulk generation up to 500 per request`,
        `Usage dashboard at <a href="${BRAND.url}/dashboard">${BRAND.url}/dashboard</a>`,
      ])}
      ${cta("View API documentation →", `${BRAND.url}/api`)}
      ${divider()}
      ${p(`Questions? Reply to this email or reach us at <a href="mailto:${BRAND.email}">${BRAND.email}</a>.`)}
    `),
  };
}

// ─── TRIAL REMINDER ───────────────────────────────────────────

export function teamTrialReminder(email, daysRemaining) {
  return {
    subject: `Your PassGeni trial ends in ${daysRemaining} days`,
    html: wrapper(`
      ${h1(`${daysRemaining} days left on your trial.`)}
      ${p(`Your PassGeni Team trial ends in ${daysRemaining} days. After that, the plan is $29/month — or you can cancel before the trial ends with no charge.`)}
      ${card(`
        <p style="font-family:monospace;font-size:10px;color:#888;letter-spacing:0.12em;text-transform:uppercase;margin:0 0 14px;">Your team plan includes</p>
        ${checkList([
          "5,000 API calls/day",
          "All compliance presets (HIPAA, PCI-DSS, SOC 2, ISO 27001, NIST, DoD)",
          "Team dashboard and usage analytics",
          "5 team seats",
        ])}
      `)}
      ${cta("Manage subscription →", `${BRAND.url}/dashboard`)}
      ${p(`To cancel: go to <a href="${BRAND.url}/dashboard">your dashboard</a> → Billing. No penalty, no questions.`)}
    `),
  };
}

// ─── PAYMENT FAILED ──────────────────────────────────────────

export function teamPaymentFailed(email) {
  return {
    subject: "Action needed: PassGeni payment failed",
    html: wrapper(`
      ${h1("Your payment didn't go through.")}
      ${p("We couldn't process the payment for your PassGeni Team plan. Your API access remains active for 7 days while you update your billing details.")}
      ${cta("Update billing details →", `${BRAND.url}/dashboard`)}
      ${p("If you believe this is an error, reply to this email and we'll sort it out immediately.")}
      ${divider()}
      ${p(`After 7 days without a successful payment, API access will be paused. Your account and data will be retained for 30 days.`)}
    `),
  };
}

// ─── CANCELLATION ─────────────────────────────────────────────

export function teamCancellation(email) {
  return {
    subject: "Your PassGeni Team subscription is cancelled",
    html: wrapper(`
      ${h1("Subscription cancelled.")}
      ${p("Your PassGeni Team plan has been cancelled. Your API key will remain active until the end of the current billing period.")}
      ${p("After that, you'll automatically move to the free tier — 50 API calls/day, web generator with all presets, and all 6 security tools.")}
      ${card(`
        <p style="font-family:monospace;font-size:10px;color:#888;letter-spacing:0.12em;text-transform:uppercase;margin:0 0 14px;">What stays free</p>
        ${checkList([
          "Web generator with all compliance presets",
          "All 6 security tools",
          "50 API calls/day (no key required)",
          "All guide and blog content",
        ])}
      `)}
      ${p(`If you cancelled by mistake or want to resubscribe, you can do so any time at <a href="${BRAND.url}/#pricing">${BRAND.url}/#pricing</a>.`)}
      ${divider()}
      ${p(`We'd genuinely appreciate knowing why you cancelled — reply to this email if you have a minute. It directly shapes what we build next.`)}
    `),
  };
}

// ─── CERTIFICATE EXPIRY REMINDER ─────────────────────────────

export function certExpiryReminder(email, { certsExpiring, dashboardUrl }) {
  const count = certsExpiring.length;
  const isSingle = count === 1;
  return {
    subject: isSingle
      ? `Your PassGeni certificate expires in ${certsExpiring[0].daysLeft} days`
      : `${count} PassGeni certificates are expiring soon`,
    html: wrapper(`
      ${h1(isSingle
        ? `Your ${certsExpiring[0].standard} certificate expires in ${certsExpiring[0].daysLeft} days.`
        : `${count} certificates are expiring soon.`
      )}
      ${p("Re-certify now to keep your compliance record current. Expired certificates no longer provide audit evidence.")}
      ${card(`
        <p style="font-family:monospace;font-size:10px;color:#888;letter-spacing:0.12em;text-transform:uppercase;margin:0 0 14px;">Expiring certificates</p>
        ${certsExpiring.map((c) => `
          <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #141416;">
            <div>
              <span style="font-size:14px;font-weight:700;color:#fff;">${c.standard}</span>
              <span style="font-size:12px;color:#555;margin-left:10px;">Expires ${c.expiresAt}</span>
            </div>
            <span style="font-family:monospace;font-size:11px;color:${c.daysLeft <= 7 ? "#ff4444" : "#facc15"};">${c.daysLeft}d left</span>
          </div>
        `).join("")}
      `)}
      ${cta("Re-certify now →", dashboardUrl ?? `${BRAND.url}/dashboard/certify`)}
      ${p(`Re-certification takes under 60 seconds. Your new certificate will be valid for another year.`)}
      ${divider()}
      ${p(`Certificates that expire are not automatically renewed. Only your active, non-expired certificates count toward your compliance score.`)}
    `),
  };
}

// ─── API LIMIT WARNING ────────────────────────────────────────

export function teamApiLimitWarning(email, percentUsed) {
  const isAt100 = percentUsed >= 100;
  return {
    subject: isAt100
      ? "PassGeni API daily limit reached"
      : `PassGeni API: ${percentUsed}% of daily limit used`,
    html: wrapper(`
      ${h1(isAt100 ? "Daily API limit reached." : `You've used ${percentUsed}% of your daily limit.`)}
      ${isAt100
        ? p("Your PassGeni API has reached the 5,000 calls/day limit. New requests will return 429 (Too Many Requests) until midnight UTC when the limit resets.")
        : p(`Your PassGeni API has used ${percentUsed}% of the 5,000 daily call limit. At the current rate, you may reach the limit before midnight UTC.`)
      }
      ${card(`
        <p style="font-family:monospace;font-size:10px;color:#888;letter-spacing:0.12em;text-transform:uppercase;margin:0 0 14px;">What to know</p>
        ${checkList([
          "Daily limit resets at midnight UTC",
          "Current usage visible in your dashboard",
          "Need more capacity? Contact us — enterprise plans available",
          isAt100 ? "The 429 response includes a Retry-After header with the seconds until reset" : "Monitor live usage at your dashboard",
        ])}
      `)}
      ${cta("View usage dashboard →", `${BRAND.url}/dashboard`)}
      ${p(`Need a higher limit? Reply to this email — we can discuss enterprise options.`)}
    `),
  };
}
