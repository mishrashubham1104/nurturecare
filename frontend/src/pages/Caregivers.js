import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { COLORS, API_BASE, fadeUp, stagger } from "../constants";

export default function Caregivers() {
  const [caregivers, setCaregivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE}/caregivers`)
      .then((r) => r.json())
      .then((d) => { setCaregivers(d.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const roles = ["All", ...new Set(caregivers.map((c) => c.role.split(" ")[0]))];
  const filtered = filter === "All" ? caregivers : caregivers.filter((c) => c.role.startsWith(filter));

  return (
    <div style={{ paddingTop: 72, minHeight: "100vh", background: COLORS.cream }}>
      {/* Header */}
      <div style={{ background: COLORS.navy, padding: "80px 48px 60px" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
          <span style={{ color: COLORS.teal, fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: 2, fontFamily: "'DM Sans', sans-serif" }}>Our Team</span>
          <h1 style={{ fontSize: 56, fontWeight: 900, color: COLORS.white, margin: "12px 0 16px", fontFamily: "'Playfair Display', Georgia, serif" }}>Meet Our Caregivers</h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.6)", maxWidth: 560, margin: "0 auto", fontFamily: "'DM Sans', sans-serif" }}>Every caregiver is background-verified, licensed, and deeply trained. Click any profile to learn more.</p>
        </motion.div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "64px 48px" }}>
        {/* Filter */}
        <div style={{ display: "flex", gap: 12, marginBottom: 40, flexWrap: "wrap", justifyContent: "center" }}>
          {roles.map((role) => (
            <motion.button key={role} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={() => setFilter(role)}
              style={{ background: filter === role ? COLORS.teal : COLORS.white, color: filter === role ? COLORS.white : COLORS.navy, border: `2px solid ${filter === role ? COLORS.teal : "#E5E7EB"}`, borderRadius: 40, padding: "8px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              {role}
            </motion.button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "80px", fontSize: 48 }}>🩺</div>
        ) : (
          <motion.div variants={stagger} initial="hidden" animate="show" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}>
            {filtered.map((cg) => (
              <motion.div key={cg.id} variants={fadeUp}
                whileHover={{ y: -8, boxShadow: "0 24px 60px rgba(0,0,0,0.12)" }}
                onClick={() => navigate(`/caregivers/${cg.id}`)}
                style={{ background: COLORS.white, borderRadius: 24, padding: 32, cursor: "pointer", border: "1px solid rgba(0,0,0,0.06)", textAlign: "center" }}>
                <div style={{ position: "relative", display: "inline-block", marginBottom: 20 }}>
                  <div style={{ width: 88, height: 88, borderRadius: "50%", background: "linear-gradient(135deg, #E8F6FF, #EFF9F8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52, margin: "0 auto" }}>{cg.img}</div>
                  <div style={{ position: "absolute", bottom: 2, right: 2, background: cg.available ? "#48BB78" : COLORS.slate, width: 16, height: 16, borderRadius: "50%", border: "2px solid white" }} />
                </div>
                <div style={{ background: COLORS.teal, color: COLORS.white, fontSize: 11, fontWeight: 700, borderRadius: 20, padding: "3px 12px", display: "inline-block", marginBottom: 12, fontFamily: "'DM Sans', sans-serif" }}>{cg.badge}</div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: COLORS.navy, margin: "0 0 4px", fontFamily: "'DM Sans', sans-serif" }}>{cg.name}</h3>
                <p style={{ fontSize: 14, color: COLORS.teal, fontWeight: 600, margin: "0 0 6px", fontFamily: "'DM Sans', sans-serif" }}>{cg.role}</p>
                <p style={{ fontSize: 13, color: COLORS.slate, margin: "0 0 16px", fontFamily: "'DM Sans', sans-serif" }}>{cg.exp} exp · {cg.city}</p>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: COLORS.navy, fontFamily: "'DM Sans', sans-serif" }}>⭐ {cg.rating}</span>
                  <span style={{ fontSize: 13, color: COLORS.slate, fontFamily: "'DM Sans', sans-serif" }}>({cg.reviews} reviews)</span>
                </div>
                <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 16 }}>
                  {cg.specialties.slice(0, 2).map((s) => (
                    <span key={s} style={{ background: COLORS.cream, color: COLORS.navy, fontSize: 11, fontWeight: 600, borderRadius: 8, padding: "3px 10px", fontFamily: "'DM Sans', sans-serif" }}>{s}</span>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <motion.button whileHover={{ background: COLORS.tealLight }} whileTap={{ scale: 0.97 }}
                    style={{ flex: 1, background: COLORS.teal, color: COLORS.white, border: "none", borderRadius: 10, padding: "10px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                    Book Now
                  </motion.button>
                  <motion.button whileHover={{ background: COLORS.cream }} whileTap={{ scale: 0.97 }}
                    style={{ flex: 1, background: "transparent", color: COLORS.navy, border: `2px solid ${COLORS.navy}`, borderRadius: 10, padding: "10px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                    View Profile
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
