
import { useEffect } from "react";
import { motion } from "framer-motion";
import { COLORS, fadeUp, stagger } from "../constants";
import { useApp } from "../context/AppContext";

export default function TestimonialsPage() {
  const { testimonials, fetchTestimonials } = useApp();
  useEffect(() => { fetchTestimonials(); }, []);

  const EXTRA = [
    { id: 10, name: "Deepa Menon", city: "Kochi", stars: 5, service: "Post-Surgery Care", text: "After my father's bypass surgery, we were terrified about home care. NurtureCare assigned a nurse who was not just skilled but truly compassionate." },
    { id: 11, name: "Amit Chowdhury", city: "Kolkata", stars: 5, service: "Elderly Care", text: "My 85-year-old grandmother has been in the care of NurtureCare for 6 months now. She's happier, healthier, and we have total peace of mind." },
    { id: 12, name: "Pooja Iyer", city: "Hyderabad", stars: 4, service: "Physiotherapy", text: "Rajesh's physiotherapy sessions helped my husband regain 80% mobility after his stroke. Truly remarkable results." },
  ];

  const all = [...testimonials, ...EXTRA];

  return (
    <div style={{ background: COLORS.cream, minHeight: "100vh", paddingTop: 100 }}>
      <div style={{ background: COLORS.navy, padding: "80px 48px 96px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: 56, fontWeight: 900, color: COLORS.white, fontFamily: "'Playfair Display', Georgia, serif", margin: "0 0 16px" }}>
            What Families Say
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ fontSize: 18, color: "rgba(255,255,255,0.65)", fontFamily: "'DM Sans', sans-serif" }}>
            Real stories from real families who trusted NurtureCare.
          </motion.p>
          <div style={{ display: "flex", justifyContent: "center", gap: 40, marginTop: 32 }}>
            {[["4.9★","Average Rating"],["50K+","Happy Patients"],["98%","Would Recommend"]].map(([v,l]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 32, fontWeight: 900, color: COLORS.teal, fontFamily: "'DM Sans', sans-serif" }}>{v}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans', sans-serif" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "-32px auto 0", padding: "0 24px 96px" }}>
        <motion.div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }} initial="hidden" animate="show" variants={stagger}>
          {all.map(t => (
            <motion.div key={t.id} variants={fadeUp} whileHover={{ y: -6, boxShadow: "0 20px 50px rgba(0,0,0,0.1)" }}
              style={{ background: COLORS.white, borderRadius: 20, padding: 32, border: "1px solid rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: 24, marginBottom: 12 }}>{"⭐".repeat(t.stars)}</div>
              <div style={{ background: "#E8F6FF", color: COLORS.teal, fontSize: 11, fontWeight: 700, borderRadius: 20, padding: "3px 10px", display: "inline-block", fontFamily: "'DM Sans', sans-serif", marginBottom: 14 }}>{t.service}</div>
              <p style={{ fontSize: 16, color: COLORS.navy, lineHeight: 1.7, fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", margin: "0 0 20px" }}>"{t.text}"</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.tealLight})`, display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.white, fontWeight: 800, fontFamily: "'DM Sans', sans-serif" }}>
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 800, color: COLORS.navy, fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: COLORS.slate, fontFamily: "'DM Sans', sans-serif" }}>{t.city}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
