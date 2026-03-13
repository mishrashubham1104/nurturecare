import { useState } from "react";
import { motion } from "framer-motion";
import { COLORS, API_BASE, fadeUp, stagger } from "../constants";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    if (!form.name || !form.email || !form.message) { setError("Please fill in all required fields."); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) setSuccess(true);
      else setError(data.message);
    } catch { setError("Server error. Please try again."); }
    setLoading(false);
  };

  return (
    <div style={{ paddingTop: 72, minHeight: "100vh", background: COLORS.cream }}>
      <div style={{ background: COLORS.navy, padding: "80px 48px 60px" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
          <span style={{ color: COLORS.teal, fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: 2, fontFamily: "'DM Sans', sans-serif" }}>Get In Touch</span>
          <h1 style={{ fontSize: 56, fontWeight: 900, color: COLORS.white, margin: "12px 0 16px", fontFamily: "'Playfair Display', Georgia, serif" }}>Contact Us</h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans', sans-serif" }}>We're here 24/7. Reach out anytime.</p>
        </motion.div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 48px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60 }}>
        {/* Info */}
        <motion.div variants={stagger} initial="hidden" animate="show">
          <motion.div variants={fadeUp} style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 36, fontWeight: 900, color: COLORS.navy, margin: "0 0 16px", fontFamily: "'Playfair Display', Georgia, serif" }}>Let's Talk</h2>
            <p style={{ fontSize: 16, color: COLORS.slate, lineHeight: 1.8, fontFamily: "'DM Sans', sans-serif" }}>Whether you need to book emergency care, have questions about our services, or want to join our caregiver network — we're ready to help.</p>
          </motion.div>

          {[
            { icon: "📞", title: "Helpline", value: "1800-NURTURE-C", sub: "Available 24/7" },
            { icon: "📧", title: "Email", value: "care@NurtureCare.in", sub: "Response within 2 hours" },
            { icon: "📍", title: "Head Office", value: "Bandra West, Mumbai", sub: "Maharashtra, 400050" },
            { icon: "⏰", title: "Hours", value: "24 × 7 × 365", sub: "We never sleep" },
          ].map((item) => (
            <motion.div key={item.title} variants={fadeUp} whileHover={{ x: 6 }} style={{ display: "flex", gap: 16, alignItems: "flex-start", padding: "16px 0", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(0,169,157,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{item.icon}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.teal, fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: 1 }}>{item.title}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: COLORS.navy, fontFamily: "'DM Sans', sans-serif" }}>{item.value}</div>
                <div style={{ fontSize: 13, color: COLORS.slate, fontFamily: "'DM Sans', sans-serif" }}>{item.sub}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Form */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <div style={{ background: COLORS.white, borderRadius: 24, padding: 40, boxShadow: "0 8px 40px rgba(0,0,0,0.08)" }}>
            {success ? (
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ fontSize: 72, marginBottom: 20 }}>✅</div>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, color: COLORS.navy, marginBottom: 12 }}>Message Sent!</h3>
                <p style={{ color: COLORS.slate, fontFamily: "'DM Sans', sans-serif", fontSize: 16 }}>We'll get back to you within 24 hours.</p>
              </motion.div>
            ) : (
              <>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, color: COLORS.navy, margin: "0 0 24px" }}>Send a Message</h3>
                {error && <div style={{ background: "#FFF0F0", border: "1px solid #FFB3B3", borderRadius: 10, padding: "10px 14px", color: "#C0392B", fontSize: 14, marginBottom: 16, fontFamily: "'DM Sans', sans-serif" }}>{error}</div>}

                {[["Full Name *", "text", "name", "Your full name"], ["Email Address *", "email", "email", "your@email.com"], ["Phone Number", "tel", "phone", "+91 xxxxxxxxxx"]].map(([label, type, key, placeholder]) => (
                  <div key={key} style={{ marginBottom: 16 }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: COLORS.navy, marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>{label}</label>
                    <input type={type} placeholder={placeholder} value={form[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid #E5E7EB", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box" }} />
                  </div>
                ))}

                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: COLORS.navy, marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>Message *</label>
                  <textarea placeholder="How can we help you?" value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={5}
                    style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid #E5E7EB", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box", resize: "vertical" }} />
                </div>

                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleSubmit} disabled={loading}
                  style={{ width: "100%", background: loading ? "#ccc" : COLORS.teal, color: COLORS.white, border: "none", borderRadius: 12, padding: "16px", fontSize: 16, fontWeight: 800, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                  {loading ? "Sending..." : "Send Message →"}
                </motion.button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
