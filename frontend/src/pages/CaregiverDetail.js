import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { COLORS, API_BASE, fadeUp, stagger } from "../constants";
import BookingModal from "../components/BookingModal";

export default function CaregiverDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cg, setCg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/caregivers/${id}`)
      .then((r) => r.json())
      .then((d) => { setCg(d.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ paddingTop: 120, textAlign: "center", fontSize: 64 }}>🩺</div>;
  if (!cg) return <div style={{ paddingTop: 120, textAlign: "center" }}>Caregiver not found.</div>;

  return (
    <div style={{ paddingTop: 72, minHeight: "100vh", background: COLORS.cream }}>
      <div style={{ background: COLORS.navy, padding: "80px 48px 60px" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: 1200, margin: "0 auto" }}>
          <button onClick={() => navigate("/caregivers")} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "rgba(255,255,255,0.7)", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginBottom: 24, fontSize: 14 }}>← Back to Caregivers</button>
          <div style={{ display: "flex", gap: 40, alignItems: "center" }}>
            <div style={{ width: 120, height: 120, borderRadius: "50%", background: "linear-gradient(135deg, rgba(0,169,157,0.3), rgba(0,169,157,0.1))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 72, border: `3px solid ${COLORS.teal}` }}>{cg.img}</div>
            <div>
              <div style={{ display: "flex", gap: 12, marginBottom: 8, alignItems: "center" }}>
                <span style={{ background: COLORS.teal, color: COLORS.white, fontSize: 12, fontWeight: 700, borderRadius: 20, padding: "4px 14px", fontFamily: "'DM Sans', sans-serif" }}>{cg.badge}</span>
                <span style={{ background: cg.available ? "#48BB78" : COLORS.slate, color: COLORS.white, fontSize: 12, fontWeight: 700, borderRadius: 20, padding: "4px 14px", fontFamily: "'DM Sans', sans-serif" }}>{cg.available ? "✅ Available" : "⏳ Busy"}</span>
              </div>
              <h1 style={{ fontSize: 48, fontWeight: 900, color: COLORS.white, margin: "0 0 8px", fontFamily: "'Playfair Display', Georgia, serif" }}>{cg.name}</h1>
              <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
                <span style={{ color: COLORS.teal, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>{cg.role}</span>
                <span style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans', sans-serif" }}>·</span>
                <span style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans', sans-serif" }}>{cg.exp} experience</span>
                <span style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans', sans-serif" }}>·</span>
                <span style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans', sans-serif" }}>📍 {cg.city}</span>
                <span style={{ background: COLORS.gold, color: COLORS.navy, fontSize: 12, fontWeight: 800, borderRadius: 20, padding: "3px 12px", fontFamily: "'DM Sans', sans-serif" }}>⭐ {cg.rating} ({cg.reviews} reviews)</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "64px 48px", display: "grid", gridTemplateColumns: "2fr 1fr", gap: 48 }}>
        <motion.div variants={stagger} initial="hidden" animate="show">
          <motion.div variants={fadeUp} style={{ background: COLORS.white, borderRadius: 20, padding: 36, marginBottom: 28 }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: COLORS.navy, margin: "0 0 16px", fontFamily: "'Playfair Display', Georgia, serif" }}>About {cg.name.split(" ")[0]}</h2>
            <p style={{ fontSize: 16, color: COLORS.slate, lineHeight: 1.8, fontFamily: "'DM Sans', sans-serif" }}>{cg.bio}</p>
          </motion.div>

          <motion.div variants={fadeUp} style={{ background: COLORS.white, borderRadius: 20, padding: 36, marginBottom: 28 }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: COLORS.navy, margin: "0 0 20px", fontFamily: "'Playfair Display', Georgia, serif" }}>Specializations</h2>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {cg.specialties.map((s) => (
                <span key={s} style={{ background: "linear-gradient(135deg, #E8F6FF, #EFF9F8)", color: COLORS.navy, fontSize: 14, fontWeight: 700, borderRadius: 12, padding: "10px 18px", fontFamily: "'DM Sans', sans-serif", border: `1px solid rgba(0,169,157,0.2)` }}>{s}</span>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} style={{ background: COLORS.white, borderRadius: 20, padding: 36 }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: COLORS.navy, margin: "0 0 16px", fontFamily: "'Playfair Display', Georgia, serif" }}>Languages</h2>
            <div style={{ display: "flex", gap: 10 }}>
              {cg.languages.map((lang) => (
                <span key={lang} style={{ background: COLORS.cream, color: COLORS.navy, fontSize: 14, fontWeight: 600, borderRadius: 10, padding: "8px 16px", fontFamily: "'DM Sans', sans-serif" }}>🗣 {lang}</span>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Sidebar */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <div style={{ background: COLORS.navy, borderRadius: 20, padding: 32, position: "sticky", top: 96 }}>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: COLORS.white, margin: "0 0 20px", fontFamily: "'Playfair Display', Georgia, serif" }}>Book {cg.name.split(" ")[0]}</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
              {[["Experience", cg.exp], ["Availability", cg.available ? "Available Now" : "Busy"], ["Location", cg.city], ["Rating", `⭐ ${cg.rating}/5`]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>{k}</span>
                  <span style={{ color: COLORS.white, fontSize: 13, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>{v}</span>
                </div>
              ))}
            </div>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => setModalOpen(true)}
              disabled={!cg.available}
              style={{ width: "100%", background: cg.available ? COLORS.teal : COLORS.slate, color: COLORS.white, border: "none", borderRadius: 12, padding: "16px", fontSize: 16, fontWeight: 800, cursor: cg.available ? "pointer" : "not-allowed", fontFamily: "'DM Sans', sans-serif", marginBottom: 12 }}>
              {cg.available ? "Book Now →" : "Currently Unavailable"}
            </motion.button>
            <motion.button whileHover={{ scale: 1.03 }} onClick={() => navigate("/caregivers")}
              style={{ width: "100%", background: "transparent", color: "rgba(255,255,255,0.6)", border: "2px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "12px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              Browse Other Nurses
            </motion.button>
          </div>
        </motion.div>
      </div>

      <BookingModal open={modalOpen} onClose={() => setModalOpen(false)} nurseId={cg.id} nurseName={cg.name} />
    </div>
  );
}
