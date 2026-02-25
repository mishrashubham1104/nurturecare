import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { COLORS, API_BASE, fadeUp, stagger } from "../constants";
import BookingModal from "../components/BookingModal";

export default function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/services/${id}`)
      .then((r) => r.json())
      .then((d) => { setService(d.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ paddingTop: 120, textAlign: "center", fontSize: 64 }}>🩺</div>;
  if (!service) return <div style={{ paddingTop: 120, textAlign: "center" }}>Service not found.</div>;

  return (
    <div style={{ paddingTop: 72, minHeight: "100vh", background: COLORS.cream }}>
      {/* Header */}
      <div style={{ background: COLORS.navy, padding: "80px 48px 60px" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: 1200, margin: "0 auto" }}>
          <button onClick={() => navigate("/services")} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "rgba(255,255,255,0.7)", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginBottom: 24, fontSize: 14 }}>← Back to Services</button>
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            <div style={{ fontSize: 80 }}>{service.icon}</div>
            <div>
              <h1 style={{ fontSize: 52, fontWeight: 900, color: COLORS.white, margin: "0 0 8px", fontFamily: "'Playfair Display', Georgia, serif" }}>{service.title}</h1>
              <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                <span style={{ color: COLORS.teal, fontSize: 16, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>{service.price}</span>
                <span style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans', sans-serif" }}>·</span>
                <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>{service.duration}</span>
                <span style={{ background: COLORS.teal, color: COLORS.white, fontSize: 12, fontWeight: 700, borderRadius: 20, padding: "3px 12px", fontFamily: "'DM Sans', sans-serif" }}>⭐ {service.rating} ({service.reviews} reviews)</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "64px 48px", display: "grid", gridTemplateColumns: "2fr 1fr", gap: 48 }}>
        {/* Main Content */}
        <motion.div variants={stagger} initial="hidden" animate="show">
          <motion.div variants={fadeUp} style={{ background: COLORS.white, borderRadius: 20, padding: 36, marginBottom: 28 }}>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: COLORS.navy, margin: "0 0 16px", fontFamily: "'Playfair Display', Georgia, serif" }}>About This Service</h2>
            <p style={{ fontSize: 16, color: COLORS.slate, lineHeight: 1.8, fontFamily: "'DM Sans', sans-serif" }}>{service.fullDesc}</p>
          </motion.div>

          <motion.div variants={fadeUp} style={{ background: COLORS.white, borderRadius: 20, padding: 36 }}>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: COLORS.navy, margin: "0 0 20px", fontFamily: "'Playfair Display', Georgia, serif" }}>What's Included</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {service.features.map((f) => (
                <motion.div key={f} whileHover={{ x: 4 }} style={{ display: "flex", alignItems: "center", gap: 10, background: COLORS.cream, borderRadius: 10, padding: "12px 16px" }}>
                  <span style={{ color: COLORS.teal, fontWeight: 800, fontSize: 18 }}>✓</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.navy, fontFamily: "'DM Sans', sans-serif" }}>{f}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Sidebar */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <div style={{ background: COLORS.navy, borderRadius: 20, padding: 32, position: "sticky", top: 96 }}>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: COLORS.white, margin: "0 0 8px", fontFamily: "'Playfair Display', Georgia, serif" }}>Book This Service</h3>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, fontFamily: "'DM Sans', sans-serif", marginBottom: 20 }}>Nurses available within 2–4 hours</p>
            <div style={{ background: "rgba(0,169,157,0.15)", border: "1px solid rgba(0,169,157,0.3)", borderRadius: 12, padding: 16, marginBottom: 20 }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: COLORS.teal, fontFamily: "'DM Sans', sans-serif" }}>{service.price}</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>{service.duration}</div>
            </div>
            <motion.button whileHover={{ scale: 1.03, background: COLORS.tealLight }} whileTap={{ scale: 0.97 }}
              onClick={() => setModalOpen(true)}
              style={{ width: "100%", background: COLORS.teal, color: COLORS.white, border: "none", borderRadius: 12, padding: "16px", fontSize: 16, fontWeight: 800, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginBottom: 12 }}>
              Book Now →
            </motion.button>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/caregivers")}
              style={{ width: "100%", background: "transparent", color: COLORS.white, border: "2px solid rgba(255,255,255,0.2)", borderRadius: 12, padding: "14px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              Browse Caregivers
            </motion.button>
            <div style={{ marginTop: 24, padding: "16px 0 0", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6 }}>✅ Background verified nurses<br />✅ 100% insured<br />✅ Free cancellation</p>
            </div>
          </div>
        </motion.div>
      </div>

      <BookingModal open={modalOpen} onClose={() => setModalOpen(false)} serviceId={service.title} />
    </div>
  );
}
