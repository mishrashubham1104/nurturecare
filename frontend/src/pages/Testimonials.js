import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { COLORS, API_BASE, fadeUp, stagger } from "../constants";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/testimonials`)
      .then((r) => r.json())
      .then((d) => { setTestimonials(d.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ paddingTop: 72, minHeight: "100vh", background: COLORS.cream }}>
      <div style={{ background: COLORS.navy, padding: "80px 48px 60px" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
          <span style={{ color: COLORS.teal, fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: 2, fontFamily: "'DM Sans', sans-serif" }}>Testimonials</span>
          <h1 style={{ fontSize: 56, fontWeight: 900, color: COLORS.white, margin: "12px 0 16px", fontFamily: "'Playfair Display', Georgia, serif" }}>What Families Say</h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans', sans-serif" }}>Real stories from real families across India.</p>
        </motion.div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 48px" }}>
        {/* Overall rating */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: COLORS.navy, borderRadius: 24, padding: 40, textAlign: "center", marginBottom: 60 }}>
          <div style={{ fontSize: 80, fontWeight: 900, color: COLORS.teal, fontFamily: "'DM Sans', sans-serif" }}>4.9</div>
          <div style={{ fontSize: 36, margin: "8px 0" }}>⭐⭐⭐⭐⭐</div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans', sans-serif", fontSize: 16 }}>Based on 1,200+ verified reviews</div>
          <div style={{ display: "flex", gap: 32, justifyContent: "center", marginTop: 24 }}>
            {[["98%", "Recommended"], ["4.8★", "Nurse Expertise"], ["4.9★", "Punctuality"], ["4.9★", "Communication"]].map(([v, l]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.teal, fontFamily: "'DM Sans', sans-serif" }}>{v}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans', sans-serif" }}>{l}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px", fontSize: 48 }}>🩺</div>
        ) : (
          <motion.div variants={stagger} initial="hidden" animate="show" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {testimonials.map((t) => (
              <motion.div key={t.id} variants={fadeUp} whileHover={{ y: -6, boxShadow: "0 20px 50px rgba(0,0,0,0.1)" }}
                style={{ background: COLORS.white, borderRadius: 20, padding: 32, border: "1px solid rgba(0,0,0,0.05)" }}>
                <div style={{ marginBottom: 16, fontSize: 20 }}>{"⭐".repeat(t.stars)}</div>
                <p style={{ fontSize: 17, color: COLORS.navy, lineHeight: 1.7, margin: "0 0 20px", fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic" }}>"{t.text}"</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 800, color: COLORS.navy, fontFamily: "'DM Sans', sans-serif" }}>{t.name}</div>
                    <div style={{ color: COLORS.slate, fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>📍 {t.city} · {t.date}</div>
                  </div>
                  <span style={{ background: COLORS.cream, color: COLORS.teal, fontSize: 12, fontWeight: 700, borderRadius: 8, padding: "4px 12px", fontFamily: "'DM Sans', sans-serif" }}>{t.service}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
