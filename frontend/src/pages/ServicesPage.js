
import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { COLORS, fadeUp, stagger } from "../constants";
import { useApp } from "../context/AppContext";

export default function ServicesPage() {
  const { slug } = useParams();
  const { services, fetchServices } = useApp();
  const navigate = useNavigate();
  useEffect(() => { fetchServices(); }, []);

  const service = slug ? services.find(s => s.slug === slug) : null;

  if (slug && service) {
    return (
      <div style={{ background: COLORS.cream, minHeight: "100vh", paddingTop: 100 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
          <motion.button initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate("/services")}
            style={{ background: "none", border: "none", color: COLORS.teal, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginBottom: 32, display: "flex", alignItems: "center", gap: 6 }}>
            ← Back to Services
          </motion.button>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            style={{ background: service.color, borderRadius: 28, padding: 48, marginBottom: 32 }}>
            <div style={{ fontSize: 80 }}>{service.icon}</div>
            <h1 style={{ fontSize: 48, fontWeight: 900, color: COLORS.navy, margin: "16px 0 16px", fontFamily: "'Playfair Display', Georgia, serif" }}>{service.title}</h1>
            <p style={{ fontSize: 20, color: COLORS.slate, lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif", maxWidth: 600 }}>{service.desc}</p>
            <div style={{ display: "flex", gap: 16, marginTop: 24, flexWrap: "wrap" }}>
              <div style={{ background: COLORS.teal, color: COLORS.white, borderRadius: 10, padding: "8px 20px", fontSize: 14, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>From {service.price}</div>
              <div style={{ background: "rgba(11,29,58,0.1)", color: COLORS.navy, borderRadius: 10, padding: "8px 20px", fontSize: 14, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>⏱ {service.duration}</div>
            </div>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              style={{ background: COLORS.white, borderRadius: 20, padding: 32 }}>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: COLORS.navy, margin: "0 0 20px", fontFamily: "'DM Sans', sans-serif" }}>What's Included</h3>
              {service.features?.map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: COLORS.slate }}>
                  <span style={{ color: COLORS.teal, fontWeight: 800, fontSize: 18 }}>✓</span> {f}
                </div>
              ))}
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              style={{ background: COLORS.navy, borderRadius: 20, padding: 32 }}>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: COLORS.white, margin: "0 0 20px", fontFamily: "'DM Sans', sans-serif" }}>Book This Service</h3>
              <p style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans', sans-serif", marginBottom: 24, lineHeight: 1.6 }}>Get a qualified nurse for {service.title.toLowerCase()} at your doorstep within hours.</p>
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/book")}
                style={{ width: "100%", background: COLORS.teal, color: COLORS.white, border: "none", borderRadius: 12, padding: "16px", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                Book Now — {service.price}
              </motion.button>
              <motion.button whileHover={{ scale: 1.04 }} onClick={() => navigate("/caregivers")}
                style={{ width: "100%", marginTop: 12, background: "transparent", color: COLORS.tealLight, border: `2px solid ${COLORS.teal}`, borderRadius: 12, padding: "14px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                Browse Caregivers →
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: COLORS.cream, minHeight: "100vh", paddingTop: 100 }}>
      <div style={{ background: COLORS.navy, padding: "80px 48px 96px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: 56, fontWeight: 900, color: COLORS.white, fontFamily: "'Playfair Display', Georgia, serif", margin: "0 0 16px" }}>
            Our Services
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ fontSize: 18, color: "rgba(255,255,255,0.65)", fontFamily: "'DM Sans', sans-serif" }}>
            Comprehensive home nursing care tailored to every patient's needs.
          </motion.p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "-32px auto 0", padding: "0 24px 96px" }}>
        <motion.div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }} initial="hidden" animate="show" variants={stagger}>
          {(services.length ? services : []).map(svc => (
            <motion.div key={svc.id} variants={fadeUp} whileHover={{ y: -8, boxShadow: "0 24px 60px rgba(0,0,0,0.12)" }}
              onClick={() => navigate(`/services/${svc.slug}`)}
              style={{ background: svc.color, borderRadius: 20, padding: 32, cursor: "pointer", border: "1px solid rgba(0,0,0,0.05)" }}>
              <div style={{ fontSize: 52, marginBottom: 16 }}>{svc.icon}</div>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: COLORS.navy, margin: "0 0 8px", fontFamily: "'DM Sans', sans-serif" }}>{svc.title}</h3>
              <p style={{ fontSize: 15, color: COLORS.slate, lineHeight: 1.6, margin: "0 0 16px", fontFamily: "'DM Sans', sans-serif" }}>{svc.desc}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: COLORS.teal, fontWeight: 800, fontFamily: "'DM Sans', sans-serif" }}>{svc.price}</span>
                <span style={{ color: COLORS.teal, fontWeight: 700, fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>View Details →</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
