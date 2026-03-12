import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { COLORS, fadeUp, stagger } from "../constants";
import { useApp } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";
import BookingModal from "../components/BookingModal";

export default function CaregiversPage() {
  const { id } = useParams();
  const { caregivers, fetchCaregivers } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNurse, setSelectedNurse] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => { fetchCaregivers(); }, []);

  const caregiver = (id && caregivers) ? caregivers.find(c => String(c.id) === String(id)) : null;
  const openBooking = (nurse) => { setSelectedNurse(nurse); setModalOpen(true); };
  const isAvailableToday = (avail) => avail?.includes("Today") ?? false;

  if (id && caregiver) {
    return (
      <div style={{ background: theme.bg, minHeight: "100vh", paddingTop: 100, transition: "background 0.3s" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px clamp(16px,4vw,24px)" }}>
          <motion.button initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate("/caregivers")}
            style={{ background: "none", border: "none", color: COLORS.teal, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginBottom: 32 }}>
            ← Back to Caregivers
          </motion.button>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 32, background: theme.bgCard, borderRadius: 28, padding: "clamp(24px,4vw,40px)", border: `1px solid ${theme.border}`, transition: "background 0.3s" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 140, height: 140, borderRadius: "50%", background: theme.isDark ? "rgba(0,169,157,0.15)" : "#E8F6FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 80, margin: "0 auto 16px" }}>{caregiver.img}</div>
              <div style={{ background: COLORS.teal, color: COLORS.white, fontSize: 12, fontWeight: 700, borderRadius: 8, padding: "4px 12px", display: "inline-block", fontFamily: "'DM Sans', sans-serif", marginBottom: 12 }}>{caregiver.badge}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: theme.text, fontFamily: "'DM Sans', sans-serif" }}>{caregiver.name}</div>
              <div style={{ color: COLORS.teal, fontSize: 14, fontFamily: "'DM Sans', sans-serif", marginTop: 4 }}>{caregiver.role}</div>
              <div style={{ color: theme.textMuted, fontSize: 13, fontFamily: "'DM Sans', sans-serif", marginTop: 4 }}>{caregiver.exp} experience</div>
              <div style={{ margin: "12px 0", fontSize: 18 }}>{"⭐".repeat(Math.round(caregiver.rating || 0))}</div>
              <div style={{ fontSize: 14, color: theme.textMuted, fontFamily: "'DM Sans', sans-serif" }}>{caregiver.rating} ({caregiver.reviews} reviews)</div>
              <div style={{ marginTop: 16, background: isAvailableToday(caregiver.availability) ? (theme.isDark ? "rgba(39,103,73,0.3)" : "#F0FFF4") : (theme.isDark ? "rgba(116,66,16,0.3)" : "#FFFBEB"), color: isAvailableToday(caregiver.availability) ? "#48BB78" : "#F0A500", borderRadius: 8, padding: "8px 12px", fontSize: 13, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>
                🟢 {caregiver.availability || "Check Schedule"}
              </div>
            </div>

            <div>
              <h2 style={{ fontSize: "clamp(22px,4vw,32px)", fontWeight: 900, color: theme.text, fontFamily: "'Playfair Display', Georgia, serif", margin: "0 0 16px" }}>About {caregiver.name?.split(" ")[1] || "Caregiver"}</h2>
              <p style={{ fontSize: 16, color: theme.textMuted, lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif", marginBottom: 28 }}>{caregiver.bio}</p>
              <h4 style={{ fontSize: 16, fontWeight: 800, color: theme.text, fontFamily: "'DM Sans', sans-serif", marginBottom: 12 }}>Specializations</h4>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
                {caregiver.specializations?.map(s => (
                  <span key={s} style={{ background: theme.isDark ? "rgba(0,169,157,0.15)" : "#E8F6FF", color: COLORS.teal, borderRadius: 20, padding: "6px 14px", fontSize: 13, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>{s}</span>
                ))}
              </div>
              <h4 style={{ fontSize: 16, fontWeight: 800, color: theme.text, fontFamily: "'DM Sans', sans-serif", marginBottom: 12 }}>Languages</h4>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 32 }}>
                {caregiver.languages?.map(l => (
                  <span key={l} style={{ background: theme.bgSecondary, color: theme.textMuted, borderRadius: 20, padding: "6px 14px", fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>{l}</span>
                ))}
              </div>
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => openBooking(caregiver)}
                style={{ background: COLORS.teal, color: COLORS.white, border: "none", borderRadius: 12, padding: "16px 40px", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 8px 24px rgba(0,169,157,0.3)" }}>
                Book {caregiver.name?.split(" ")[0]} Now
              </motion.button>
            </div>
          </motion.div>
        </div>
        <BookingModal open={modalOpen} onClose={() => setModalOpen(false)} preNurse={selectedNurse} />
      </div>
    );
  }

  return (
    <div style={{ background: theme.bg, minHeight: "100vh", paddingTop: 100, transition: "background 0.3s" }}>
      <div style={{ background: COLORS.navy, padding: "clamp(48px,8vw,80px) clamp(20px,5vw,48px) clamp(60px,10vw,96px)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: "clamp(32px,6vw,56px)", fontWeight: 900, color: COLORS.white, fontFamily: "'Playfair Display', Georgia, serif", margin: "0 0 16px" }}>
            Our Caregivers
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ fontSize: 18, color: "rgba(255,255,255,0.65)", fontFamily: "'DM Sans', sans-serif" }}>
            Every nurse is background-verified, licensed, and deeply trained in patient care.
          </motion.p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "-32px auto 0", padding: "0 clamp(16px,4vw,24px) 96px" }}>
        <motion.div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }} initial="hidden" animate="show" variants={stagger}>
          {caregivers?.map((cg, i) => (
            <motion.div key={cg._id || cg.id || i} variants={fadeUp} whileHover={{ y: -8, boxShadow: theme.shadowLg }}
              style={{ background: theme.bgCard, borderRadius: 20, padding: 28, border: `1px solid ${theme.border}`, transition: "background 0.3s" }}>
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <div style={{ position: "relative", display: "inline-block" }}>
                  <div style={{ width: 80, height: 80, borderRadius: "50%", background: theme.isDark ? "rgba(0,169,157,0.15)" : "#E8F6FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48 }}>{cg.img}</div>
                  <div style={{ position: "absolute", bottom: 0, right: 0, background: COLORS.teal, color: COLORS.white, fontSize: 10, fontWeight: 700, borderRadius: 8, padding: "2px 6px", fontFamily: "'DM Sans', sans-serif" }}>{cg.badge}</div>
                </div>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: theme.text, margin: "0 0 4px", textAlign: "center", fontFamily: "'DM Sans', sans-serif" }}>{cg.name}</h3>
              <p style={{ fontSize: 13, color: COLORS.teal, fontWeight: 600, margin: "0 0 4px", textAlign: "center", fontFamily: "'DM Sans', sans-serif" }}>{cg.role}</p>
              <p style={{ fontSize: 12, color: theme.textMuted, margin: "0 0 12px", textAlign: "center", fontFamily: "'DM Sans', sans-serif" }}>{cg.exp} experience</p>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: theme.text, fontFamily: "'DM Sans', sans-serif" }}>⭐ {cg.rating}</span>
                <span style={{ fontSize: 12, color: theme.textMuted, fontFamily: "'DM Sans', sans-serif" }}>({cg.reviews})</span>
              </div>
              <div style={{ background: isAvailableToday(cg.availability) ? (theme.isDark ? "rgba(39,103,73,0.3)" : "#F0FFF4") : (theme.isDark ? "rgba(116,66,16,0.3)" : "#FFFBEB"), color: isAvailableToday(cg.availability) ? "#48BB78" : "#F0A500", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 700, textAlign: "center", fontFamily: "'DM Sans', sans-serif", marginBottom: 16 }}>
                🟢 {cg.availability || "N/A"}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <motion.button whileHover={{ opacity: 0.85 }} onClick={() => navigate(`/caregivers/${cg.id}`)}
                  style={{ flex: 1, background: COLORS.navy, color: COLORS.white, border: "none", borderRadius: 10, padding: "10px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                  View Profile
                </motion.button>
                <motion.button whileHover={{ opacity: 0.85 }} onClick={() => openBooking(cg)}
                  style={{ flex: 1, background: COLORS.teal, color: COLORS.white, border: "none", borderRadius: 10, padding: "10px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                  Book Now
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <BookingModal open={modalOpen} onClose={() => setModalOpen(false)} preNurse={selectedNurse} />
    </div>
  );
}