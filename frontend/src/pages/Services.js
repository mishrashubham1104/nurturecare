import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { COLORS, API_BASE, fadeUp, stagger } from "../constants";

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE}/services`)
      .then((r) => r.json())
      .then((d) => { setServices(d.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ paddingTop: 72, minHeight: "100vh", background: COLORS.cream }}>
      {/* Header */}
      <div style={{ background: COLORS.navy, padding: "80px 48px 60px" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
          <span style={{ color: COLORS.teal, fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: 2, fontFamily: "'DM Sans', sans-serif" }}>What We Offer</span>
          <h1 style={{ fontSize: 56, fontWeight: 900, color: COLORS.white, margin: "12px 0 16px", fontFamily: "'Playfair Display', Georgia, serif" }}>Our Care Services</h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.6)", maxWidth: 560, margin: "0 auto", fontFamily: "'DM Sans', sans-serif" }}>Comprehensive home nursing services designed around your needs.</p>
        </motion.div>
      </div>

      {/* Services Grid */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "64px 48px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px", fontSize: 48 }}>🩺</div>
        ) : (
          <motion.div variants={stagger} initial="hidden" animate="show" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}>
            {services.map((svc) => (
              <motion.div key={svc.id} variants={fadeUp}
                whileHover={{ y: -8, boxShadow: "0 28px 64px rgba(0,0,0,0.13)" }}
                onClick={() => navigate(`/services/${svc.id}`)}
                style={{ background: svc.color, borderRadius: 24, padding: 36, cursor: "pointer", border: "1px solid rgba(0,0,0,0.05)", transition: "box-shadow 0.3s" }}>
                <div style={{ fontSize: 56, marginBottom: 20 }}>{svc.icon}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: COLORS.navy, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>{svc.title}</h3>
                  <span style={{ background: COLORS.teal, color: COLORS.white, fontSize: 11, fontWeight: 700, borderRadius: 20, padding: "3px 10px", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap", marginLeft: 8 }}>⭐ {svc.rating}</span>
                </div>
                <p style={{ fontSize: 15, color: COLORS.slate, lineHeight: 1.6, margin: "0 0 16px", fontFamily: "'DM Sans', sans-serif" }}>{svc.shortDesc}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.teal, fontFamily: "'DM Sans', sans-serif" }}>{svc.price}</span>
                  <motion.span whileHover={{ x: 4 }} style={{ color: COLORS.navy, fontWeight: 700, fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>Details →</motion.span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
