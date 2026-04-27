import { useState } from "react";
import { motion } from "framer-motion";
import { btnPrimary } from "../lib/motion.js";
import PageLayout from "../components/layout/PageLayout.js";
import { IcUser, IcKey, IcLock, IcAlert, IcCheck } from "../lib/icons.js";

const LINK = { color: "#C8FF00", textDecoration: "none" };

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Since we have no contact form backend, mailto fallback
    window.location.href = `mailto:hello@passgeni.ai?subject=${encodeURIComponent(form.subject || "PassGeni inquiry")}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`;
    setTimeout(() => { setSent(true); setLoading(false); }, 500);
  };

  const INPUT = {
    width: "100%", background: "#060608", border: "1px solid #1a1a1a", borderRadius: 8,
    padding: "14px 18px", fontFamily: "var(--font-body)", fontSize: 15, color: "#fff",
    outline: "none", boxSizing: "border-box", marginBottom: 16,
  };

  const CONTACT_CARDS = [
    { Icon: IcUser,  label: "General questions",     email: "hello@passgeni.ai" },
    { Icon: IcKey,   label: "API & Team plan",        email: "api@passgeni.ai" },
    { Icon: IcKey,   label: "Billing & refunds",      email: "billing@passgeni.ai" },
    { Icon: IcLock,  label: "Security disclosures",   email: "security@passgeni.ai" },
  ];

  return (
    <PageLayout
      title="Contact PassGeni — Get in Touch"
      description="Contact the PassGeni team. Questions about the Team API, billing, security, or just want to say hi."
      canonical="https://passgeni.ai/contact"
    >
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "80px var(--page-pad) 120px" }}>
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="eyebrow">Get in touch</div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(32px,4.5vw,52px)", color: "#fff", letterSpacing: "-0.025em", lineHeight: 1.1, marginBottom: 18 }}>Contact us</h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(16px,1.6vw,18px)", color: "var(--muted)", lineHeight: 1.9, marginBottom: 52 }}>
            We&apos;re a small team and we read every email. Usually respond within 1 business day.
          </p>
        </motion.div>

        {/* Contact options */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 52 }}>
          {CONTACT_CARDS.map(({ Icon, label, email }, i) => (
            <motion.a
              key={email}
              href={`mailto:${email}`}
              className="bc bc-a"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              style={{ textDecoration: "none", display: "block" }}
            >
              <div className="bc-line" />
              <div style={{ marginBottom: 12, color: "var(--accent)" }}>
                <Icon size={22} color="var(--accent)" />
              </div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)", marginBottom: 6 }}>{label}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent)" }}>{email}</div>
            </motion.a>
          ))}
        </div>

        {/* Quick form */}
        <motion.div
          className="bc"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ padding: "36px" }}
        >
          <div className="bc-line" />
          <div className="eyebrow" style={{ marginBottom: 24 }}>
            Send a message
          </div>
          {sent ? (
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <div style={{ marginBottom: 16, display: "flex", justifyContent: "center" }}>
                <div style={{
                  width: 52, height: 52, borderRadius: "50%",
                  background: "rgba(200,255,0,0.08)",
                  border: "1px solid rgba(200,255,0,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <IcCheck size={22} color="var(--accent)" />
                </div>
              </div>
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 20, color: "#C8FF00", marginBottom: 8 }}>Message sent</div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "#888" }}>Your email client should have opened. If not, email us directly at <a href="mailto:hello@passgeni.ai" style={LINK}>hello@passgeni.ai</a>.</p>
            </div>
          ) : (
            <form onSubmit={submit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 0 }}>
                <input type="text" placeholder="Your name" value={form.name} onChange={update("name")} required style={INPUT} />
                <input type="email" placeholder="Your email" value={form.email} onChange={update("email")} required style={INPUT} />
              </div>
              <input type="text" placeholder="Subject" value={form.subject} onChange={update("subject")} style={INPUT} />
              <textarea placeholder="Your message…" value={form.message} onChange={update("message")} required rows={6}
                style={{ ...INPUT, resize: "vertical", lineHeight: 1.7 }} />
              <motion.button type="submit" className="btn-primary" {...btnPrimary} disabled={loading} style={{ fontSize: 15, padding: "14px 32px" }}>
                {loading ? "Opening mail client…" : "Send message →"}
              </motion.button>
            </form>
          )}
        </motion.div>

        <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted-2)", marginTop: 28, lineHeight: 1.8 }}>
          For security vulnerability disclosures, please use PGP if possible. Our security contact is <a href="mailto:security@passgeni.ai" style={LINK}>security@passgeni.ai</a>.
          We take all security reports seriously and aim to respond within 24 hours.
        </p>
      </main>
    </PageLayout>
  );
}
