import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { COLORS, API_BASE, fadeUp, stagger } from "../constants";
import BookingModal from "../components/BookingModal";

export default function Pricing() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalPlan, setModalPlan] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE}/pricing`)
      .then((r) => r.json())
      .then((d) => { setPlans(d.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ paddingTop: 72, minHeight: "100vh", background: COLORS.cream }}>
      <div style={{ background: COLORS.navy, padding: "80px 48px 60px" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
          <span style={{ color: COLORS.teal, fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: 2, fontFamily: "'DM Sans', sans-serif" }}>Pricing</span>
          <h1 style={{ fontSize: 56, fontWeight: 900, color: COLORS.white, margin: "12px 0 16px", fontFamily: "'Playfair Display', Georgia, serif" }}>Transparent, Affordable Plans</h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans', sans-serif" }}>No hidden fees. No surprises. Cancel anytime.</p>
        </motion.div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 48px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px", fontSize: 48 }}>🩺</div>
        ) : (
          <motion.div variants={stagger} initial="hidden" animate="show" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, alignItems: "stretch" }}>
            {plans.map((plan) => (
              <motion.div key={plan.id} variants={fadeUp} whileHover={{ y: -6 }}
                style={{ background: plan.highlight ? COLORS.navy : COLORS.white, borderRadius: 24, padding: "40px 32px", border: plan.highlight ? `2px solid ${COLORS.teal}` : "1px solid rgba(0,0,0,0.07)", position: "relative", boxShadow: plan.highlight ? "0 24px 60px rgba(0,169,157,0.2)" : "0 4px 20px rgba(0,0,0,0.05)" }}>
                {plan.highlight && (
                  <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: COLORS.teal, color: COLORS.white, fontSize: 12, fontWeight: 800, borderRadius: 20, padding: "4px 16px", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap" }}>✨ MOST POPULAR</div>
                )}
                <h3 style={{ fontSize: 22, fontWeight: 800, color: plan.highlight ? COLORS.white : COLORS.navy, margin: "0 0 4px", fontFamily: "'DM Sans', sans-serif" }}>{plan.name}</h3>
                <p style={{ fontSize: 13, color: plan.highlight ? "rgba(255,255,255,0.5)" : COLORS.slate, margin: "0 0 20px", fontFamily: "'DM Sans', sans-serif" }}>{plan.tagline}</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 28 }}>
                  <span style={{ fontSize: 48, fontWeight: 900, color: plan.highlight ? COLORS.teal : COLORS.navy, fontFamily: "'DM Sans', sans-serif" }}>{plan.price}</span>
                  <span style={{ color: plan.highlight ? "rgba(255,255,255,0.5)" : COLORS.slate, fontFamily: "'DM Sans', sans-serif" }}>{plan.period}</span>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: plan.highlight ? COLORS.teal : COLORS.navy, textTransform: "uppercase", letterSpacing: 1, fontFamily: "'DM Sans', sans-serif", marginBottom: 12 }}>INCLUDED</p>
                  {plan.features.map((f) => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                      <span style={{ color: "#48BB78", fontWeight: 800, fontSize: 16 }}>✓</span>
                      <span style={{ fontSize: 14, color: plan.highlight ? "rgba(255,255,255,0.8)" : COLORS.slate, fontFamily: "'DM Sans', sans-serif" }}>{f}</span>
                    </div>
                  ))}
                  {plan.notIncluded.map((f) => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, opacity: 0.4 }}>
                      <span style={{ color: COLORS.slate, fontWeight: 800, fontSize: 16 }}>✕</span>
                      <span style={{ fontSize: 14, color: plan.highlight ? "rgba(255,255,255,0.5)" : COLORS.slate, fontFamily: "'DM Sans', sans-serif", textDecoration: "line-through" }}>{f}</span>
                    </div>
                  ))}
                </div>

                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setModalPlan(plan.id)}
                  style={{ width: "100%", background: plan.highlight ? COLORS.teal : "transparent", color: plan.highlight ? COLORS.white : COLORS.teal, border: `2px solid ${COLORS.teal}`, borderRadius: 12, padding: "14px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                  Get Started →
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Guarantee strip */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ display: "flex", gap: 40, justifyContent: "center", marginTop: 56, flexWrap: "wrap" }}>
          {[["🔒", "100% Insured", "All nurses are insured"], ["↩️", "Free Cancellation", "Cancel up to 4hrs before"], ["📞", "24/7 Support", "Always here to help"], ["✅", "Verified Nurses", "Background checked"]].map(([icon, title, desc]) => (
            <div key={title} style={{ textAlign: "center", maxWidth: 140 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{icon}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: COLORS.navy, fontFamily: "'DM Sans', sans-serif" }}>{title}</div>
              <div style={{ fontSize: 12, color: COLORS.slate, fontFamily: "'DM Sans', sans-serif" }}>{desc}</div>
            </div>
          ))}
        </motion.div>
      </div>

      <BookingModal open={!!modalPlan} onClose={() => setModalPlan(null)} planId={modalPlan} />
    </div>
  );
}
