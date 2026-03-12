import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { COLORS } from "../constants";
import { useApp } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";

export default function FeedbackPage() {
  const { loading } = useApp();
  const theme = useTheme();
  const [form, setForm]         = useState({ name: "", email: "", rating: 0, category: "", feedback: "" });
  const [hover, setHover]       = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const CATEGORIES = ["Nurse Quality", "Booking Experience", "App / Website", "Payment", "Customer Support", "General Feedback"];

  const inputStyle = {
    width: "100%", padding: "12px 14px", borderRadius: 10,
    border: `1.5px solid ${theme.border}`, fontSize: 14,
    fontFamily: "'DM Sans', sans-serif", outline: "none",
    boxSizing: "border-box", background: theme.bg, color: theme.text, transition: "background 0.3s"
  };

  return (
    <div style={{ background: theme.bg, minHeight: "100vh", paddingTop: 100, transition: "background 0.3s" }}>
      <div style={{ background: COLORS.navy, padding: "clamp(48px,8vw,80px) clamp(20px,5vw,48px) clamp(60px,10vw,96px)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: "clamp(32px,6vw,56px)", fontWeight: 900, color: COLORS.white, fontFamily: "'Playfair Display', Georgia, serif", margin: "0 0 16px" }}>
            Share Your Feedback
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            style={{ fontSize: 18, color: "rgba(255,255,255,0.65)", fontFamily: "'DM Sans', sans-serif" }}>
            Your experience helps us improve care for thousands of families.
          </motion.p>
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: "-48px auto 0", padding: "0 clamp(16px,4vw,24px) 96px" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{ background: theme.bgCard, borderRadius: 28, padding: "clamp(24px,5vw,48px)", boxShadow: theme.shadowLg, border: `1px solid ${theme.border}`, transition: "background 0.3s" }}>
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: 72, marginBottom: 16 }}>🌟</div>
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 32, color: theme.text, margin: "0 0 12px" }}>Thank You!</h2>
                <p style={{ color: theme.textMuted, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.7 }}>
                  Your feedback has been received and shared with our team. We read every response and use it to improve our care standards.
                </p>
                <motion.button whileHover={{ scale: 1.04 }} onClick={() => { setSubmitted(false); setForm({ name: "", email: "", rating: 0, category: "", feedback: "" }); }}
                  style={{ marginTop: 28, background: COLORS.teal, color: COLORS.white, border: "none", borderRadius: 12, padding: "12px 28px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                  Submit Another
                </motion.button>
              </motion.div>
            ) : (
              <motion.div key="form">
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, color: theme.text, margin: "0 0 32px" }}>How was your experience?</h2>
                <div style={{ marginBottom: 28 }}>
                  <label style={{ display: "block", fontSize: 14, fontWeight: 700, color: theme.text, marginBottom: 12, fontFamily: "'DM Sans', sans-serif" }}>Overall Rating *</label>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <motion.button key={star} type="button" whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
                        onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(0)}
                        onClick={() => setForm(f => ({ ...f, rating: star }))}
                        style={{ fontSize: 36, background: "none", border: "none", cursor: "pointer", filter: star <= (hover || form.rating) ? "none" : "grayscale(1) opacity(0.3)", transition: "filter 0.15s" }}>
                        ⭐
                      </motion.button>
                    ))}
                    {form.rating > 0 && <span style={{ color: COLORS.teal, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", alignSelf: "center", marginLeft: 8 }}>
                      {["", "Poor", "Fair", "Good", "Great", "Excellent!"][form.rating]}
                    </span>}
                  </div>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); setTimeout(() => setSubmitted(true), 400); }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 16 }}>
                    {[["Name", "text", "name", "Your name", true], ["Email", "email", "email", "your@email.com", true]].map(([label, type, key, ph, req]) => (
                      <div key={key}>
                        <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: theme.text, marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>{label}{req ? " *" : ""}</label>
                        <input type={type} placeholder={ph} required={req} value={form[key]}
                          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} style={inputStyle} />
                      </div>
                    ))}
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: theme.text, marginBottom: 8, fontFamily: "'DM Sans', sans-serif" }}>Feedback Category</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {CATEGORIES.map(cat => (
                        <motion.button key={cat} type="button" whileHover={{ scale: 1.03 }}
                          onClick={() => setForm(f => ({ ...f, category: cat }))}
                          style={{ background: form.category === cat ? COLORS.teal : theme.bgSecondary, color: form.category === cat ? COLORS.white : theme.textMuted, border: `1px solid ${theme.border}`, borderRadius: 20, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" }}>
                          {cat}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginBottom: 24 }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: theme.text, marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>Your Feedback *</label>
                    <textarea placeholder="Tell us about your experience in detail..." required rows={5} value={form.feedback}
                      onChange={e => setForm(f => ({ ...f, feedback: e.target.value }))}
                      style={{ ...inputStyle, resize: "vertical" }} />
                  </div>
                  <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    style={{ width: "100%", background: COLORS.teal, color: COLORS.white, border: "none", borderRadius: 12, padding: "16px", fontSize: 16, fontWeight: 800, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                    Submit Feedback →
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}