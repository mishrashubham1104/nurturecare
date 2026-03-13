import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { COLORS } from "../constants";
import { useApp } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";

export default function ContactPage() {
  const { submitContact, loading } = useApp();
  const theme = useTheme();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [success, setSuccess] = useState(false);

  const inputStyle = {
    width: "100%", padding: "12px 14px", borderRadius: 10,
    border: `1.5px solid ${theme.border}`, fontSize: 14,
    fontFamily: "'DM Sans', sans-serif", outline: "none",
    boxSizing: "border-box", background: theme.bg,
    color: theme.text, transition: "background 0.3s, border 0.3s"
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await submitContact(form); setSuccess(true); }
    catch { alert("Failed to send. Please try again."); }
  };

  return (
    <div style={{ background: theme.bg, minHeight: "100vh", paddingTop: 100, transition: "background 0.3s" }}>
      <div style={{ background: COLORS.navy, padding: "clamp(48px,8vw,80px) clamp(20px,5vw,48px) clamp(60px,10vw,96px)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: "clamp(32px,6vw,56px)", fontWeight: 900, color: COLORS.white, fontFamily: "'Playfair Display', Georgia, serif", margin: "0 0 16px" }}>
            Contact Us
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ fontSize: 18, color: "rgba(255,255,255,0.65)", fontFamily: "'DM Sans', sans-serif" }}>
            We're here to help. Reach out anytime — our team responds within 1 hour.
          </motion.p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "-32px auto 0", padding: "0 clamp(16px,4vw,24px) 96px" }}>
        <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 32 }}>
          <div>
            {[["📞","Call Us","1800-NURTURE-C (1800-687-8873)","Available 24/7"],["📧","Email","hello@NurtureCare.in","Response within 1 hour"],["📍","Head Office","12th Floor, Lotus Tower, BKC, Mumbai 400051","Mon–Sat, 9AM–8PM"],["💬","WhatsApp","wa.me/918888NURTURE","Chat instantly"]].map(([icon,title,val,sub]) => (
              <motion.div key={title} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                style={{ background: theme.bgCard, borderRadius: 16, padding: 24, marginBottom: 16, display: "flex", gap: 16, alignItems: "flex-start", border: `1px solid ${theme.border}`, transition: "background 0.3s" }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: theme.isDark ? "rgba(0,169,157,0.15)" : "#E8F6FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{icon}</div>
                <div>
                  <div style={{ fontSize: 14, color: theme.textMuted, fontFamily: "'DM Sans', sans-serif" }}>{title}</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: theme.text, fontFamily: "'DM Sans', sans-serif" }}>{val}</div>
                  <div style={{ fontSize: 12, color: theme.textMuted, fontFamily: "'DM Sans', sans-serif" }}>{sub}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: theme.bgCard, borderRadius: 24, padding: "clamp(24px,4vw,40px)", border: `1px solid ${theme.border}`, transition: "background 0.3s" }}>
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
                  <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, color: theme.text, margin: "0 0 12px" }}>Message Sent!</h3>
                  <p style={{ color: theme.textMuted, fontFamily: "'DM Sans', sans-serif" }}>Our team will reach out within 1 hour.</p>
                  <motion.button whileHover={{ scale: 1.04 }} onClick={() => { setSuccess(false); setForm({ name:"",email:"",phone:"",message:"" }); }}
                    style={{ marginTop: 24, background: COLORS.teal, color: COLORS.white, border: "none", borderRadius: 12, padding: "12px 28px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                    Send Another
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div key="form">
                  <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, color: theme.text, margin: "0 0 24px" }}>Send a Message</h3>
                  <form onSubmit={handleSubmit}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                      {[["Full Name","text","name","John Doe",true],["Email","email","email","john@email.com",true]].map(([label,type,key,ph,req]) => (
                        <div key={key}>
                          <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: theme.text, marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>{label} {req && "*"}</label>
                          <input type={type} placeholder={ph} required={req} value={form[key]}
                            onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                            style={inputStyle} />
                        </div>
                      ))}
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: theme.text, marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>Phone</label>
                      <input type="tel" placeholder="+91 xxxxxxxxxx" value={form.phone}
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        style={inputStyle} />
                    </div>
                    <div style={{ marginBottom: 20 }}>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: theme.text, marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>Message *</label>
                      <textarea placeholder="Tell us how we can help..." required rows={5} value={form.message}
                        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                        style={{ ...inputStyle, resize: "vertical" }} />
                    </div>
                    <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      style={{ width: "100%", background: loading ? theme.textMuted : COLORS.teal, color: COLORS.white, border: "none", borderRadius: 12, padding: "16px", fontSize: 16, fontWeight: 800, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                      {loading ? "Sending..." : "Send Message →"}
                    </motion.button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}