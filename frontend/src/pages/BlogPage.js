import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { COLORS, fadeUp, stagger } from "../constants";
import { useTheme } from "../context/ThemeContext";

const POSTS = [
  { id: 1, title: "5 Signs Your Elderly Parent Needs Professional Home Care", category: "Elderly Care",    date: "Feb 10, 2024", read: "5 min",  img: "👴", color: "#FFF0F5", excerpt: "Recognizing the right time to bring in professional nursing support can be challenging. Here are five key indicators that it's time to consider home care for your aging parent." },
  { id: 2, title: "What to Expect During Post-Surgery Home Recovery",          category: "Post-Surgery",   date: "Jan 28, 2024", read: "7 min",  img: "🏥", color: "#E8F6FF", excerpt: "Going home after surgery can be both relieving and overwhelming. A skilled nurse can make all the difference. Here's a complete guide to what post-surgical home care looks like." },
  { id: 3, title: "How to Choose the Right Home Nurse for Your Needs",         category: "Tips & Guides",  date: "Jan 15, 2024", read: "6 min",  img: "🩺", color: "#F0FFF4", excerpt: "With so many options available, selecting the right home caregiver can feel daunting. We break down the key qualifications and questions to ask before making your choice." },
  { id: 4, title: "Understanding ICU at Home: Is It Right for Your Patient?",  category: "ICU Care",       date: "Dec 20, 2023", read: "8 min",  img: "🧑‍⚕️", color: "#F5F0FF", excerpt: "ICU-at-home services have transformed critical care. Learn when this option is appropriate, what equipment is involved, and how to ensure the highest safety standards." },
  { id: 5, title: "Managing Dementia at Home: A Caregiver's Complete Guide",   category: "Dementia Care",  date: "Dec 5, 2023",  read: "10 min", img: "🧠", color: "#FFF5F0", excerpt: "Caring for someone with dementia at home requires patience, preparation, and the right professional support. This guide walks you through every aspect of dementia home care." },
  { id: 6, title: "Physiotherapy at Home vs. Clinic: Which is Better?",        category: "Physiotherapy",  date: "Nov 18, 2023", read: "5 min",  img: "💪", color: "#FFFBEB", excerpt: "Home physiotherapy is growing in popularity — and for good reason. We compare the benefits of in-home sessions versus clinic visits to help you decide what's best for recovery." },
];

const BODY_PARAS = [
  "Home nursing care has evolved dramatically over the past decade. What was once considered a luxury is now an accessible, often superior alternative to extended hospital stays or clinic visits.",
  "The key to successful home care begins with proper assessment. A qualified nurse will evaluate the patient's condition, review medical history, and create a personalized care plan aligned with the doctor's recommendations.",
  "Communication between the home nurse, the patient's physician, and family members is critical. NurtureCare's platform enables real-time health reporting, ensuring everyone stays informed and aligned.",
  "Safety at home is paramount. Our nurses are trained in emergency response, fall prevention, medication safety, and infection control — bringing clinical-grade safety protocols into the home environment.",
  "Finally, emotional wellbeing matters as much as physical health. Our caregivers are selected not only for their clinical skills but for their empathy and ability to provide genuine companionship and support.",
];

export default function BlogPage() {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();
  const theme    = useTheme();

  if (selected) {
    return (
      <div style={{ background: theme.bg, minHeight: "100vh", paddingTop: 100, transition: "background 0.3s" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px clamp(16px,4vw,24px)" }}>
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setSelected(null)}
            style={{ background: "none", border: "none", color: COLORS.teal, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginBottom: 32 }}>
            ← Back to Blog
          </motion.button>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ background: theme.isDark ? "rgba(0,169,157,0.1)" : selected.color, borderRadius: 20, padding: "clamp(24px,4vw,40px) clamp(20px,4vw,40px) clamp(20px,3vw,32px)", marginBottom: 32, border: `1px solid ${theme.border}` }}>
              <div style={{ fontSize: "clamp(48px,10vw,72px)", marginBottom: 12 }}>{selected.img}</div>
              <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
                <span style={{ background: COLORS.teal, color: COLORS.white, fontSize: 12, fontWeight: 700, borderRadius: 20, padding: "4px 12px", fontFamily: "'DM Sans', sans-serif" }}>{selected.category}</span>
                <span style={{ color: theme.textMuted, fontSize: 13, fontFamily: "'DM Sans', sans-serif", alignSelf: "center" }}>{selected.date} · {selected.read} read</span>
              </div>
              <h1 style={{ fontSize: "clamp(22px,4vw,38px)", fontWeight: 900, color: theme.text, fontFamily: "'Playfair Display', Georgia, serif", margin: 0 }}>{selected.title}</h1>
            </div>
            <div style={{ background: theme.bgCard, borderRadius: 20, padding: "clamp(24px,4vw,40px)", border: `1px solid ${theme.border}` }}>
              <p style={{ fontSize: "clamp(15px,2vw,18px)", color: theme.textMuted, lineHeight: 1.8, fontFamily: "'DM Sans', sans-serif", marginBottom: 24, fontStyle: "italic" }}>{selected.excerpt}</p>
              {BODY_PARAS.map((para, i) => (
                <p key={i} style={{ fontSize: 16, color: theme.textMuted, lineHeight: 1.8, fontFamily: "'DM Sans', sans-serif", marginBottom: 20 }}>{para}</p>
              ))}
              <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: 24, marginTop: 32, textAlign: "center" }}>
                <p style={{ fontWeight: 700, color: theme.text, fontFamily: "'DM Sans', sans-serif", marginBottom: 16 }}>Need professional nursing care at home?</p>
                <motion.button whileHover={{ scale: 1.04 }} onClick={() => navigate("/book")}
                  style={{ background: COLORS.teal, color: COLORS.white, border: "none", borderRadius: 12, padding: "14px 32px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                  Book a Nurse Today →
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: theme.bg, minHeight: "100vh", paddingTop: 100, transition: "background 0.3s" }}>
      <div style={{ background: COLORS.navy, padding: "clamp(48px,8vw,80px) clamp(20px,5vw,48px) clamp(60px,10vw,96px)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: "clamp(32px,6vw,56px)", fontWeight: 900, color: COLORS.white, fontFamily: "'Playfair Display', Georgia, serif", margin: "0 0 16px" }}>
            Health & Care Blog
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            style={{ fontSize: 18, color: "rgba(255,255,255,0.65)", fontFamily: "'DM Sans', sans-serif" }}>
            Expert insights, guides, and tips for patients and caregivers.
          </motion.p>
        </div>
      </div>
      <div style={{ maxWidth: 1100, margin: "-32px auto 0", padding: "0 clamp(16px,4vw,24px) 96px" }}>
        <motion.div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24 }} initial="hidden" animate="show" variants={stagger}>
          {POSTS.map(post => (
            <motion.div key={post.id} variants={fadeUp} whileHover={{ y: -6, boxShadow: theme.shadowLg }}
              onClick={() => setSelected(post)} style={{ background: theme.bgCard, borderRadius: 20, overflow: "hidden", cursor: "pointer", border: `1px solid ${theme.border}`, transition: "background 0.3s" }}>
              <div style={{ background: theme.isDark ? "rgba(0,169,157,0.1)" : post.color, padding: "32px", textAlign: "center" }}>
                <div style={{ fontSize: 64 }}>{post.img}</div>
              </div>
              <div style={{ padding: 24 }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{ background: theme.isDark ? "rgba(0,169,157,0.15)" : "#E8F6FF", color: COLORS.teal, fontSize: 11, fontWeight: 700, borderRadius: 20, padding: "3px 10px", fontFamily: "'DM Sans', sans-serif" }}>{post.category}</span>
                  <span style={{ fontSize: 12, color: theme.textMuted, fontFamily: "'DM Sans', sans-serif" }}>{post.read} read</span>
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: theme.text, margin: "0 0 10px", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.4 }}>{post.title}</h3>
                <p style={{ fontSize: 13, color: theme.textMuted, lineHeight: 1.6, margin: "0 0 16px", fontFamily: "'DM Sans', sans-serif" }}>{post.excerpt.substring(0, 100)}...</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: theme.textMuted, fontFamily: "'DM Sans', sans-serif" }}>{post.date}</span>
                  <span style={{ color: COLORS.teal, fontWeight: 700, fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>Read more →</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}