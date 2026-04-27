/**
 * /settings — Account & preferences settings page
 */

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import PageLayout from "../components/layout/PageLayout.js";

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

// ─── SECTION WRAPPER ─────────────────────────────────────────────────────────
function Section({ title, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: "easeOut" }}
      style={{
        background:   "#0a0a0c",
        border:       "1px solid rgba(255,255,255,0.07)",
        borderRadius: 14,
        overflow:     "hidden",
        marginBottom: 16,
      }}
    >
      <div style={{
        padding:      "16px 24px",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        fontFamily:   "var(--font-mono)",
        fontSize:     9,
        letterSpacing:"0.14em",
        textTransform:"uppercase",
        color:        "#555",
      }}>
        {title}
      </div>
      <div style={{ padding: "24px" }}>
        {children}
      </div>
    </motion.div>
  );
}

// ─── FIELD ROW ────────────────────────────────────────────────────────────────
function FieldRow({ label, value, action, danger }) {
  return (
    <div style={{
      display:       "flex",
      justifyContent:"space-between",
      alignItems:    "center",
      padding:       "12px 0",
      borderBottom:  "1px solid rgba(255,255,255,0.04)",
      gap:           16,
      flexWrap:      "wrap",
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, color: "#ccc", marginBottom: 2 }}>{label}</div>
        {value && <div style={{ fontSize: 12, color: "#555", fontFamily: "var(--font-mono)" }}>{value}</div>}
      </div>
      {action && (
        <button
          onClick={action.onClick}
          style={{
            background:  danger ? "transparent" : "transparent",
            border:      `1px solid ${danger ? "rgba(255,68,68,0.3)" : "rgba(255,255,255,0.1)"}`,
            borderRadius:6,
            padding:     "6px 14px",
            fontFamily:  "var(--font-body)",
            fontSize:    12,
            color:       danger ? "#ff6b6b" : "#888",
            cursor:      "pointer",
            transition:  "all 0.15s",
            whiteSpace:  "nowrap",
            flexShrink:  0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = danger ? "rgba(255,68,68,0.6)" : "rgba(255,255,255,0.25)";
            e.currentTarget.style.color = danger ? "#ff9999" : "#ccc";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = danger ? "rgba(255,68,68,0.3)" : "rgba(255,255,255,0.1)";
            e.currentTarget.style.color = danger ? "#ff6b6b" : "#888";
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [billing,      setBilling]      = useState(null);
  const [loadingBilling, setLoadingBilling] = useState(false);
  const [deleteConfirm,  setDeleteConfirm]  = useState(false);
  const [deleting,       setDeleting]       = useState(false);
  const [notification,   setNotification]   = useState(null); // { msg, type: 'ok'|'err' }

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/signin?callbackUrl=/settings");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    setLoadingBilling(true);
    fetch("/api/dashboard/summary")
      .then((r) => r.ok ? r.json() : null)
      .then((d) => {
        if (d) setBilling(d);
      })
      .finally(() => setLoadingBilling(false));
  }, [status]);

  const notify = (msg, type = "ok") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSignOut = () => signOut({ callbackUrl: "/" });

  const handleBillingPortal = async () => {
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.open(data.url, "_blank");
      else notify("Billing portal unavailable.", "err");
    } catch {
      notify("Could not open billing portal.", "err");
    }
  };

  const handleDeleteAccount = async () => {
    if (!deleteConfirm) { setDeleteConfirm(true); return; }
    setDeleting(true);
    try {
      const res = await fetch("/api/account/delete", { method: "DELETE" });
      if (res.ok) {
        await signOut({ callbackUrl: "/" });
      } else {
        const d = await res.json();
        notify(d.error ?? "Could not delete account. Contact support.", "err");
      }
    } catch {
      notify("Could not delete account. Contact support.", "err");
    }
    setDeleting(false);
    setDeleteConfirm(false);
  };

  if (status === "loading" || status === "unauthenticated") return null;

  const user = session?.user ?? {};
  const plan = billing?.plan ?? user?.plan_type ?? user?.plan ?? "free";
  const planLabel = { free: "Free", assurance: "Assurance", authority: "Authority" }[plan] ?? plan;
  const isPaid = plan !== "free";
  const isTrialing = billing?.planStatus === "trialing";

  return (
    <PageLayout
      title="Settings — PassGeni"
      description="Manage your PassGeni account, plan, and preferences."
    >
      <main style={{ maxWidth: 620, margin: "0 auto", padding: "56px var(--page-pad) 100px" }}>

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{ marginBottom: 32 }}
        >
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#555", letterSpacing: ".16em", textTransform: "uppercase", marginBottom: 10 }}>
            Account
          </div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(20px,3vw,28px)", color: "#fff", letterSpacing: "-0.02em", margin: 0, lineHeight: 1.1 }}>
            Settings
          </h1>
        </motion.div>

        {/* Toast notification */}
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding:     "12px 16px",
              borderRadius: 8,
              marginBottom: 16,
              background:  notification.type === "ok" ? "rgba(0,208,132,0.08)" : "rgba(255,68,68,0.08)",
              border:      `1px solid ${notification.type === "ok" ? "rgba(0,208,132,0.25)" : "rgba(255,68,68,0.25)"}`,
              fontSize:    13,
              color:       notification.type === "ok" ? "#00d084" : "#ff9999",
            }}
          >
            {notification.msg}
          </motion.div>
        )}

        {/* Account section */}
        <Section title="Account" delay={0}>
          <FieldRow label="Email" value={user.email ?? "—"} />
          <FieldRow
            label="Sign in method"
            value="Magic link (passwordless)"
          />
          <FieldRow
            label="Sign out of all sessions"
            action={{ label: "Sign out", onClick: handleSignOut }}
          />
        </Section>

        {/* Plan & billing */}
        <Section title="Plan & Billing" delay={0.06}>
          <FieldRow
            label="Current plan"
            value={isTrialing ? `${planLabel} — trial` : planLabel}
          />
          {billing?.trialEnd && isTrialing && (
            <FieldRow
              label="Trial ends"
              value={fmtDate(billing.trialEnd)}
              action={{ label: "Upgrade now →", onClick: () => router.push("/pricing") }}
            />
          )}
          {billing?.nextBillingDate && !isTrialing && (
            <FieldRow
              label="Next billing date"
              value={fmtDate(billing.nextBillingDate)}
            />
          )}
          {!isPaid ? (
            <div style={{ paddingTop: 16 }}>
              <a
                href="/pricing"
                style={{
                  display:     "inline-flex",
                  alignItems:  "center",
                  background:  "#c8ff00",
                  color:       "#000",
                  fontWeight:  700,
                  fontSize:    13,
                  padding:     "10px 22px",
                  borderRadius: 7,
                  textDecoration: "none",
                  letterSpacing: "-0.01em",
                }}
              >
                Upgrade to Assurance →
              </a>
            </div>
          ) : (
            <FieldRow
              label="Billing portal"
              value="Manage subscription, invoices, and payment method"
              action={{ label: "Open portal →", onClick: handleBillingPortal }}
            />
          )}
        </Section>

        {/* Quick links */}
        <Section title="Quick Links" delay={0.12}>
          {[
            { label: "Compliance Dashboard", href: "/dashboard" },
            { label: "Certificates",         href: "/dashboard/certs" },
            { label: "API Keys",             href: "/dashboard/api-keys" },
            { label: "Issue a certificate",  href: "/dashboard/certify" },
            { label: "API documentation",    href: "/api-docs" },
            { label: "Security & Privacy",   href: "/security" },
          ].map(({ label, href }) => (
            <div key={href} style={{ padding: "11px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <a
                href={href}
                style={{
                  display:      "flex",
                  justifyContent:"space-between",
                  alignItems:   "center",
                  fontSize:     13,
                  color:        "#888",
                  textDecoration:"none",
                  transition:   "color 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}
              >
                {label}
                <span style={{ color: "#333", fontSize: 12 }}>→</span>
              </a>
            </div>
          ))}
        </Section>

        {/* Danger zone */}
        <Section title="Danger Zone" delay={0.18}>
          <p style={{ fontSize: 13, color: "#555", lineHeight: 1.7, marginBottom: 20 }}>
            Deleting your account permanently removes all certificates, API keys, and billing associations.
            This cannot be undone.
          </p>
          {deleteConfirm ? (
            <div style={{ background: "rgba(255,68,68,0.06)", border: "1px solid rgba(255,68,68,0.2)", borderRadius: 10, padding: "16px 18px" }}>
              <p style={{ fontSize: 13, color: "#ff9999", marginBottom: 16, lineHeight: 1.6 }}>
                Are you sure? This will permanently delete your account and all data. There is no undo.
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  style={{
                    background:   "#ff4444",
                    color:        "#fff",
                    border:       "none",
                    borderRadius: 6,
                    padding:      "8px 18px",
                    fontSize:     13,
                    fontWeight:   700,
                    cursor:       deleting ? "not-allowed" : "pointer",
                    fontFamily:   "var(--font-body)",
                    opacity:      deleting ? 0.6 : 1,
                  }}
                >
                  {deleting ? "Deleting…" : "Yes, delete my account"}
                </button>
                <button
                  onClick={() => setDeleteConfirm(false)}
                  style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", color: "#666", padding: "8px 16px", borderRadius: 6, fontSize: 13, cursor: "pointer", fontFamily: "var(--font-body)" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setDeleteConfirm(true)}
              style={{
                background:  "transparent",
                border:      "1px solid rgba(255,68,68,0.3)",
                borderRadius: 7,
                padding:     "9px 18px",
                fontFamily:  "var(--font-body)",
                fontSize:    13,
                color:       "#ff6b6b",
                cursor:      "pointer",
                transition:  "all 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,68,68,0.6)"; e.currentTarget.style.color = "#ff9999"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,68,68,0.3)"; e.currentTarget.style.color = "#ff6b6b"; }}
            >
              Delete account
            </button>
          )}
        </Section>

      </main>
    </PageLayout>
  );
}

export async function getServerSideProps() { return { props: {} }; }
