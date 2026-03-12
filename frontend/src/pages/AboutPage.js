import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { COLORS, fadeUp, stagger } from "../constants";
import { useTheme } from "../context/ThemeContext";

const TEAM = [
  { name: "Dr. Aakash Mehta",  role: "Co-Founder & CEO",        img: "👨‍💼", bio: "Former cardiologist turned entrepreneur, Aakash built NurtureCare after his own family struggled to find reliable home nursing." },
  { name: "Neha Gupta",        role: "Co-Founder & COO",        img: "👩‍💼", bio: "Healthcare operations veteran with 15 years scaling medical services across India's top hospital chains." },
  { name: "Rohan Verma",       role: "CTO",                     img: "👨‍💻", bio: "Ex-Practo engineering lead who built the tech platform powering real-time nurse matching and health reporting." },
  { name: "Dr. Shalini Nair",  role: "Chief Nursing Officer",   img: "👩‍⚕️", bio: "ICU nurse turned clinical director, Shalini oversees quality standards and caregiver training across all cities." },
];

const MILESTONES = [
  { year: "2018", title: "Founded in Mumbai",        desc: "NurtureCare started with 5 nurses and a simple mission: bring hospital-quality care to your home." },
  { year: "2019", title: "100 Nurses. 3 Cities.",    desc: "Expanded to Delhi and Bangalore. Crossed 1,000 patients served in the first year." },
  { year: "2021", title: "Series A Funding",          desc: "Raised ₹45 Cr to scale operations and build our proprietary health-monitoring app." },
  { year: "2022", title: "35 Cities. 10,000+ Nurses.", desc: "Became India's largest home nursing network with 4.9-star average rating." },
  { year: "2024", title: "50,000+ Families Served",  desc: "Today we serve over 50,000 families across India with round-the-clock professional care." },
];

const VALUES = [
  { icon: "❤️", title: "Compassion First",         desc: "Every patient is treated with the dignity, kindness, and respect they deserve." },
  { icon: "🔒", title: "Safety & Trust",            desc: "100% background-verified nurses with regular quality audits and patient feedback reviews." },
  { icon: "⚡", title: "Speed & Reliability",       desc: "Nurses dispatched within 2–4 hours. We never miss a shift." },
  { icon: "📈", title: "Continuous Improvement",    desc: "Regular training, certifications, and feedback loops keep our care standards at the top." },
];

function Section({ children, style = {} }) {
  return (
    <motion.section initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} variants={stagger}
      style={{ padding: "clamp(48px,7vw,80px) clamp(16px,4vw,24px)", ...style }}>{children}</motion.section>
  );
}

export default function AboutPage() {
  const navigate = useNavigate();
  const theme    = useTheme();

  return (
    <div style={{ background: theme.bg, minHeight: "100vh", paddingTop: 100, transition: "background 0.3s" }}>

      {/* HERO */}
      <div style={{ background: COLORS.navy, padding: "clamp(48px,8vw,80px) clamp(20px,5vw,48px) clamp(60px,10vw,96px)", position: "relative", overflow: "hidden" }}>
        {[...Array(3)].map((_, i) => (
          <motion.div key={i} animate={{ y: [0, -15, 0] }} transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
            style={{ position: "absolute", width: [300, 200, 400][i], height: [300, 200, 400][i], borderRadius: "50%",
              background: ["radial-gradient(circle,rgba(0,169,157,0.15),transparent)", "radial-gradient(circle,rgba(240,165,0,0.08),transparent)", "radial-gradient(circle,rgba(0,206,195,0.1),transparent)"][i],
              top: ["10%", "50%", "-10%"][i], right: ["5%", "20%", "40%"][i] }} />
        ))}
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,169,157,0.15)", border: "1px solid rgba(0,169,157,0.3)", borderRadius: 40, padding: "6px 16px", marginBottom: 24 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.teal, display: "inline-block" }} />
            <span style={{ color: COLORS.tealLight, fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>Est. 2018 · Mumbai, India</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{ fontSize: "clamp(30px,6vw,56px)", fontWeight: 900, color: COLORS.white, fontFamily: "'Playfair Display', Georgia, serif", margin: "0 0 20px" }}>
            Caring for India,<br /><span style={{ color: COLORS.teal }}>One Home at a Time</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ fontSize: "clamp(14px,2vw,19px)", color: "rgba(255,255,255,0.7)", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.7, maxWidth: 600, margin: "0 auto 40px" }}>
            NurtureCare was founded on a simple belief: every patient deserves the highest quality nursing care — right in the comfort of their own home.
          </motion.p>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "clamp(20px,5vw,48px)" }}>
            {[["2018", "Founded"], ["50K+", "Patients"], ["1,200+", "Nurses"], ["4.9★", "Rating"]].map(([v, l]) => (
              <motion.div key={l} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <div style={{ fontSize: "clamp(22px,4vw,32px)", fontWeight: 900, color: COLORS.teal, fontFamily: "'DM Sans', sans-serif" }}>{v}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans', sans-serif" }}>{l}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* MISSION */}
      <Section style={{ background: theme.bgCard }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "clamp(32px,5vw,64px)", alignItems: "center" }}>
          <motion.div variants={fadeUp}>
            <span style={{ color: COLORS.teal, fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: 2, fontFamily: "'DM Sans', sans-serif" }}>Our Mission</span>
            <h2 style={{ fontSize: "clamp(24px,4vw,42px)", fontWeight: 900, color: theme.text, margin: "12px 0 20px", fontFamily: "'Playfair Display', Georgia, serif" }}>
              Bridging the Gap Between Hospital & Home
            </h2>
            <p style={{ fontSize: 16, color: theme.textMuted, lineHeight: 1.8, fontFamily: "'DM Sans', sans-serif", marginBottom: 16 }}>
              When a loved one needs care after surgery, or an elderly parent requires daily assistance, families shouldn't have to navigate the healthcare system alone. NurtureCare exists to fill that gap.
            </p>
            <p style={{ fontSize: 16, color: theme.textMuted, lineHeight: 1.8, fontFamily: "'DM Sans', sans-serif" }}>
              We believe that healing happens best at home, surrounded by family, in a familiar environment. Our mission is to make that possible for every Indian family.
            </p>
          </motion.div>
          <motion.div variants={fadeUp} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {VALUES.map(v => (
              <div key={v.title} style={{ background: theme.bg, borderRadius: 16, padding: 24, border: `1px solid ${theme.border}` }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{v.icon}</div>
                <h4 style={{ fontSize: 16, fontWeight: 800, color: theme.text, margin: "0 0 8px", fontFamily: "'DM Sans', sans-serif" }}>{v.title}</h4>
                <p style={{ fontSize: 13, color: theme.textMuted, lineHeight: 1.6, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>{v.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* TIMELINE */}
      <Section style={{ background: theme.bg }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <motion.div variants={fadeUp} style={{ textAlign: "center", marginBottom: 56 }}>
            <span style={{ color: COLORS.teal, fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: 2, fontFamily: "'DM Sans', sans-serif" }}>Our Journey</span>
            <h2 style={{ fontSize: "clamp(24px,4vw,42px)", fontWeight: 900, color: theme.text, margin: "12px 0", fontFamily: "'Playfair Display', Georgia, serif" }}>From 5 Nurses to 1,200+</h2>
          </motion.div>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: 28, top: 0, bottom: 0, width: 2, background: `linear-gradient(to bottom, ${COLORS.teal}, transparent)` }} />
            {MILESTONES.map((m) => (
              <motion.div key={m.year} variants={fadeUp} style={{ display: "flex", gap: "clamp(16px,3vw,32px)", marginBottom: 40 }}>
                <div style={{ flexShrink: 0, width: 58, height: 58, borderRadius: "50%", background: COLORS.navy, border: `3px solid ${COLORS.teal}`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1 }}>
                  <span style={{ fontSize: 11, fontWeight: 900, color: COLORS.teal, fontFamily: "'DM Sans', sans-serif" }}>{m.year}</span>
                </div>
                <div style={{ background: theme.bgCard, borderRadius: 16, padding: "20px 24px", flex: 1, boxShadow: theme.shadow, border: `1px solid ${theme.border}` }}>
                  <h4 style={{ fontSize: 18, fontWeight: 800, color: theme.text, margin: "0 0 6px", fontFamily: "'DM Sans', sans-serif" }}>{m.title}</h4>
                  <p style={{ fontSize: 15, color: theme.textMuted, margin: 0, lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>{m.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* TEAM */}
      <Section style={{ background: theme.bgCard }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <motion.div variants={fadeUp} style={{ textAlign: "center", marginBottom: 56 }}>
            <span style={{ color: COLORS.teal, fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: 2, fontFamily: "'DM Sans', sans-serif" }}>Leadership</span>
            <h2 style={{ fontSize: "clamp(24px,4vw,42px)", fontWeight: 900, color: theme.text, margin: "12px 0", fontFamily: "'Playfair Display', Georgia, serif" }}>The Founders Behind NurtureCare</h2>
          </motion.div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 24 }}>
            {TEAM.map(t => (
              <motion.div key={t.name} variants={fadeUp} whileHover={{ y: -6 }}
                style={{ background: theme.bg, borderRadius: 20, padding: 28, textAlign: "center", border: `1px solid ${theme.border}` }}>
                <div style={{ fontSize: 56, marginBottom: 12 }}>{t.img}</div>
                <h4 style={{ fontSize: 17, fontWeight: 800, color: theme.text, margin: "0 0 4px", fontFamily: "'DM Sans', sans-serif" }}>{t.name}</h4>
                <p style={{ fontSize: 13, color: COLORS.teal, fontWeight: 700, margin: "0 0 12px", fontFamily: "'DM Sans', sans-serif" }}>{t.role}</p>
                <p style={{ fontSize: 13, color: theme.textMuted, lineHeight: 1.6, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>{t.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section style={{ background: COLORS.teal, padding: "clamp(48px,7vw,72px) clamp(16px,4vw,24px)" }}>
        <motion.div variants={fadeUp} style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(24px,4vw,42px)", fontWeight: 900, color: COLORS.white, margin: "0 0 16px", fontFamily: "'Playfair Display', Georgia, serif" }}>Join Our Mission</h2>
          <p style={{ color: "rgba(255,255,255,0.8)", fontFamily: "'DM Sans', sans-serif", marginBottom: 32, fontSize: 17 }}>Whether you're a patient, a caregiver, or a healthcare professional — there's a place for you at NurtureCare.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => navigate("/book")}
              style={{ background: COLORS.white, color: COLORS.teal, border: "none", borderRadius: 12, padding: "14px 28px", fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              Book a Nurse
            </motion.button>
            <motion.button whileHover={{ scale: 1.04 }} onClick={() => navigate("/careers")}
              style={{ background: "transparent", color: COLORS.white, border: "2px solid rgba(255,255,255,0.6)", borderRadius: 12, padding: "14px 28px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              View Careers →
            </motion.button>
          </div>
        </motion.div>
      </Section>
    </div>
  );
}