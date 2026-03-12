import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { COLORS, fadeUp, stagger } from "../constants";
import { useApp } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";
import BookingModal from "../components/BookingModal";

export default function PricingPage() {
  const { pricing, fetchPricing } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  useEffect(() => { fetchPricing(); }, []);

  return (
    <div style={{ background: theme.bg, minHeight: "100vh", paddingTop: 100, transition: "background 0.3s" }}>
      <div style={{ background: COLORS.navy, padding: "80px 48px 96px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: "clamp(32px,6vw,56px)", fontWeight: 900, color: COLORS.white, fontFamily: "'Playfair Display', Georgia, serif", margin: "0 0 16px" }}>
            Simple Pricing
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ fontSize: 18, color: "rgba(255,255,255,0.65)", fontFamily: "'DM Sans', sans-serif" }}>
            No hidden fees. No surprises. Just transparent, affordable care.
          </motion.p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "-32px auto 0", padding: "0 24px 64px" }}>
        <motion.div className="pricing-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24, alignItems: "stretch" }} initial="hidden" animate="show" variants={stagger}>
          {pricing.map(plan => (
            <motion.div key={plan.id} variants={fadeUp} whileHover={{ y: -6 }}
              style={{ background: plan.highlight ? COLORS.navy : theme.bgCard, borderRadius: 24, padding: "40px 32px", border: plan.highlight ? `2px solid ${COLORS.teal}` : `1px solid ${theme.border}`, position: "relative", boxShadow: plan.highlight ? "0 24px 60px rgba(0,169,157,0.2)" : theme.shadow, transition: "background 0.3s" }}>
              {plan.highlight && (
                <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: COLORS.teal, color: COLORS.white, fontSize: 12, fontWeight: 800, borderRadius: 20, padding: "4px 16px", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap" }}>
                  MOST POPULAR
                </div>
              )}
              <h3 style={{ fontSize: 22, fontWeight: 800, color: plan.highlight ? COLORS.white : theme.text, margin: "0 0 8px", fontFamily: "'DM Sans', sans-serif" }}>{plan.name}</h3>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 28 }}>
                <span style={{ fontSize: 48, fontWeight: 900, color: plan.highlight ? COLORS.teal : theme.text, fontFamily: "'DM Sans', sans-serif" }}>{plan.price}</span>
                <span style={{ color: plan.highlight ? "rgba(255,255,255,0.5)" : theme.textMuted, fontFamily: "'DM Sans', sans-serif" }}>{plan.period}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: plan.highlight ? "rgba(255,255,255,0.8)" : theme.textMuted }}>
                    <span style={{ color: COLORS.teal, fontWeight: 800 }}>✓</span> {f}
                  </div>
                ))}
              </div>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setModalOpen(true)}
                style={{ width: "100%", background: plan.highlight ? COLORS.teal : "transparent", color: plan.highlight ? COLORS.white : COLORS.teal, border: `2px solid ${COLORS.teal}`, borderRadius: 12, padding: "14px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                Get Started
              </motion.button>
            </motion.div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ background: theme.bgCard, borderRadius: 20, padding: 32, marginTop: 40, textAlign: "center", border: `1px solid ${theme.border}`, transition: "background 0.3s" }}>
          <h3 style={{ fontSize: 24, fontWeight: 800, color: theme.text, fontFamily: "'DM Sans', sans-serif", margin: "0 0 8px" }}>Need a custom plan?</h3>
          <p style={{ color: theme.textMuted, fontFamily: "'DM Sans', sans-serif", marginBottom: 20 }}>We offer customized plans for long-term care, corporate wellness, and hospital partnerships.</p>
          <motion.button whileHover={{ scale: 1.04 }} onClick={() => navigate("/contact")}
            style={{ background: COLORS.navy, color: COLORS.white, border: "none", borderRadius: 12, padding: "14px 32px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
            Contact Our Team →
          </motion.button>
        </motion.div>
      </div>

      <BookingModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}