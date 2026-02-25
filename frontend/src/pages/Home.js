import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
import { COLORS, fadeUp, stagger } from "../constants";
import BookingModal from "../components/BookingModal";

const SERVICES_PREVIEW = [
  { id: "post-surgery", icon: "🏥", title: "Post-Surgery Care", desc: "Professional at-home recovery support after hospital discharge.", color: "#E8F6FF" },
  { id: "elderly-care", icon: "👴", title: "Elderly Care", desc: "Compassionate daily living assistance and health monitoring for seniors.", color: "#FFF0F5" },
  { id: "icu-at-home", icon: "🧑‍⚕️", title: "ICU at Home", desc: "Critical care services at home with trained ICU nurses and equipment.", color: "#F0FFF4" },
  { id: "medication-management", icon: "💊", title: "Medication Management", desc: "Timely administration and side-effect monitoring by licensed nurses.", color: "#FFFBEB" },
  { id: "physiotherapy", icon: "🩺", title: "Physiotherapy", desc: "In-home physiotherapy to restore mobility and accelerate rehabilitation.", color: "#F5F0FF" },
  { id: "dementia-care", icon: "🧠", title: "Dementia Care", desc: "Specialized memory care with behavioral support and family guidance.", color: "#FFF5F0" },
];

const STATS = [
  { value: "50,000+", label: "Patients Served" },
  { value: "1,200+", label: "Verified Nurses" },
  { value: "35+", label: "Cities Covered" },
  { value: "4.9★", label: "Average Rating" },
];

const STEPS = [
  { step: "01", title: "Book Online", desc: "Share patient details, care needs, and schedule preferences in our easy form." },
  { step: "02", title: "Match a Nurse", desc: "We match you with a verified, background-checked nurse suited to your needs." },
  { step: "03", title: "Receive Care", desc: "Your dedicated caregiver arrives on time, equipped and ready to help." },
  { step: "04", title: "Track Progress", desc: "Monitor health updates, reports, and billing from your dashboard." },
];

function Section({ children, id, style = {} }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section id={id} ref={ref} variants={stagger} initial="hidden" animate={inView ? "show" : "hidden"} style={{ padding: "96px 24px", ...style }}>
      {children}
    </motion.section>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 120]);

  return (
    <div>
      {/* HERO */}
      <div style={{ position: "relative", minHeight: "100vh", background: COLORS.navy, overflow: "hidden", display: "flex", alignItems: "center" }}>
        {[...Array(5)].map((_, i) => (
          <motion.div key={i}
            animate={{ y: [0, -20, 0], x: [0, 10, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 4 + i * 1.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }}
            style={{ position: "absolute", width: [320, 200, 480, 150, 280][i], height: [320, 200, 480, 150, 280][i], borderRadius: "50%", background: ["radial-gradient(circle, rgba(0,169,157,0.18), transparent)", "radial-gradient(circle, rgba(0,206,195,0.12), transparent)", "radial-gradient(circle, rgba(240,165,0,0.08), transparent)", "radial-gradient(circle, rgba(255,107,138,0.12), transparent)", "radial-gradient(circle, rgba(0,169,157,0.1), transparent)"][i], top: ["10%", "60%", "-10%", "75%", "40%"][i], left: ["60%", "80%", "-5%", "10%", "50%"][i] }}
          />
        ))}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0,169,157,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,169,157,0.04) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center", position: "relative", zIndex: 2, width: "100%" }}>
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.div variants={fadeUp} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,169,157,0.15)", border: "1px solid rgba(0,169,157,0.3)", borderRadius: 40, padding: "6px 16px", marginBottom: 24 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.teal, display: "inline-block" }} />
              <span style={{ color: COLORS.tealLight, fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>India's Most Trusted Home Care</span>
            </motion.div>

            <motion.h1 variants={fadeUp} style={{ fontSize: 62, fontWeight: 900, color: COLORS.white, lineHeight: 1.1, margin: "0 0 20px", fontFamily: "'Playfair Display', Georgia, serif" }}>
              Expert Nursing<br />
              <span style={{ color: COLORS.teal }}>Care at Home</span>
            </motion.h1>

            <motion.p variants={fadeUp} style={{ fontSize: 18, color: "rgba(255,255,255,0.68)", lineHeight: 1.7, maxWidth: 480, margin: "0 0 40px", fontFamily: "'DM Sans', sans-serif" }}>
              Professional, verified, and compassionate nurses delivered to your doorstep within hours. Trusted by 50,000+ families across India.
            </motion.p>

            <motion.div variants={fadeUp} style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 48 }}>
              <motion.button whileHover={{ scale: 1.04, background: COLORS.tealLight }} whileTap={{ scale: 0.97 }}
                onClick={() => setModalOpen(true)}
                style={{ background: COLORS.teal, color: COLORS.white, border: "none", borderRadius: 12, padding: "16px 32px", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 8px 32px rgba(0,169,157,0.35)" }}>
                Book a Nurse →
              </motion.button>
              <motion.button whileHover={{ scale: 1.04, background: "rgba(255,255,255,0.1)" }} whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/how-it-works")}
                style={{ background: "transparent", color: COLORS.white, border: "2px solid rgba(255,255,255,0.25)", borderRadius: 12, padding: "16px 32px", fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                ▶ Watch How It Works
              </motion.button>
            </motion.div>

            <motion.div variants={fadeUp} style={{ display: "flex", gap: 32 }}>
              {["50K+ Patients", "1200+ Nurses", "4.9★ Rated"].map((stat) => (
                <div key={stat} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: COLORS.white, fontFamily: "'DM Sans', sans-serif" }}>{stat.split(" ")[0]}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans', sans-serif" }}>{stat.split(" ").slice(1).join(" ")}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero Card */}
          <motion.div style={{ y: heroY }} initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}>
            <div style={{ position: "relative" }}>
              <div style={{ background: "linear-gradient(135deg, rgba(0,169,157,0.15) 0%, rgba(11,29,58,0.8) 100%)", border: "1px solid rgba(0,169,157,0.25)", borderRadius: 24, padding: 32, backdropFilter: "blur(20px)" }}>
                <div style={{ fontSize: 96, textAlign: "center", marginBottom: 16 }}>👩‍⚕️</div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.white, fontFamily: "'Playfair Display', Georgia, serif" }}>Dr. Priya Sharma</div>
                  <div style={{ color: COLORS.teal, fontSize: 14, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", marginTop: 4 }}>ICU Specialist · 12 yrs exp</div>
                  <div style={{ display: "flex", justifyContent: "center", gap: 4, marginTop: 12, fontSize: 20 }}>{"⭐".repeat(5)}</div>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginTop: 4, fontFamily: "'DM Sans', sans-serif" }}>238 reviews</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 24 }}>
                  {[["Background Verified ✓", COLORS.teal], ["Available 24/7 ✓", COLORS.gold], ["Covid-Safe ✓", "#48BB78"], ["Insured ✓", COLORS.rose]].map(([text, color]) => (
                    <div key={text} style={{ background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: "10px 12px", fontSize: 12, fontWeight: 600, color, fontFamily: "'DM Sans', sans-serif", border: "1px solid rgba(255,255,255,0.08)" }}>{text}</div>
                  ))}
                </div>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/caregivers/1")}
                  style={{ width: "100%", marginTop: 20, background: COLORS.teal, color: COLORS.white, border: "none", borderRadius: 12, padding: "14px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                  Book This Nurse
                </motion.button>
              </div>
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} style={{ position: "absolute", top: -20, right: -20, background: COLORS.gold, borderRadius: 12, padding: "10px 16px", fontSize: 13, fontWeight: 700, color: COLORS.navy, boxShadow: "0 8px 24px rgba(240,165,0,0.35)", fontFamily: "'DM Sans', sans-serif" }}>🔥 10 bookings today</motion.div>
              <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }} style={{ position: "absolute", bottom: -20, left: -20, background: COLORS.white, borderRadius: 12, padding: "10px 16px", fontSize: 13, fontWeight: 700, color: COLORS.navy, boxShadow: "0 8px 24px rgba(0,0,0,0.15)", fontFamily: "'DM Sans', sans-serif" }}>✅ Arrives in 2 hours</motion.div>
            </div>
          </motion.div>
        </div>

        <div style={{ position: "absolute", bottom: -2, left: 0, right: 0 }}>
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
            <path d="M0 80V40C240 0 480 80 720 40S1200 0 1440 40V80H0Z" fill={COLORS.cream} />
          </svg>
        </div>
      </div>

      {/* STATS */}
      <div style={{ background: COLORS.teal, padding: "32px 48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
          {STATS.map(({ value, label }) => (
            <motion.div key={label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: COLORS.white, fontFamily: "'DM Sans', sans-serif" }}>{value}</div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", fontFamily: "'DM Sans', sans-serif" }}>{label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* SERVICES */}
      <Section id="services" style={{ background: COLORS.cream }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <motion.div variants={fadeUp} style={{ textAlign: "center", marginBottom: 64 }}>
            <span style={{ color: COLORS.teal, fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: 2, fontFamily: "'DM Sans', sans-serif" }}>What We Offer</span>
            <h2 style={{ fontSize: 48, fontWeight: 900, color: COLORS.navy, margin: "12px 0 16px", fontFamily: "'Playfair Display', Georgia, serif" }}>Comprehensive Home Care Services</h2>
            <p style={{ fontSize: 18, color: COLORS.slate, maxWidth: 560, margin: "0 auto", fontFamily: "'DM Sans', sans-serif" }}>From recovery to daily assistance — click any service to learn more.</p>
          </motion.div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {SERVICES_PREVIEW.map((svc) => (
              <motion.div key={svc.id} variants={fadeUp} whileHover={{ y: -8, boxShadow: "0 24px 60px rgba(0,0,0,0.12)", cursor: "pointer" }}
                onClick={() => navigate(`/services/${svc.id}`)}
                style={{ background: svc.color, borderRadius: 20, padding: 32, border: "1px solid rgba(0,0,0,0.05)", cursor: "pointer" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>{svc.icon}</div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: COLORS.navy, margin: "0 0 10px", fontFamily: "'DM Sans', sans-serif" }}>{svc.title}</h3>
                <p style={{ fontSize: 15, color: COLORS.slate, lineHeight: 1.6, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>{svc.desc}</p>
                <motion.div whileHover={{ x: 4 }} style={{ marginTop: 20, color: COLORS.teal, fontWeight: 700, fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>Learn more →</motion.div>
              </motion.div>
            ))}
          </div>
          <motion.div variants={fadeUp} style={{ textAlign: "center", marginTop: 48 }}>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => navigate("/services")}
              style={{ background: COLORS.navy, color: COLORS.white, border: "none", borderRadius: 12, padding: "14px 32px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              View All Services →
            </motion.button>
          </motion.div>
        </div>
      </Section>

      {/* HOW IT WORKS */}
      <Section id="how-it-works" style={{ background: COLORS.navy }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <motion.div variants={fadeUp} style={{ textAlign: "center", marginBottom: 72 }}>
            <span style={{ color: COLORS.teal, fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: 2, fontFamily: "'DM Sans', sans-serif" }}>Process</span>
            <h2 style={{ fontSize: 48, fontWeight: 900, color: COLORS.white, margin: "12px 0 16px", fontFamily: "'Playfair Display', Georgia, serif" }}>Care in 4 Simple Steps</h2>
          </motion.div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32, position: "relative" }}>
            <div style={{ position: "absolute", top: 40, left: "12.5%", right: "12.5%", height: 2, background: "linear-gradient(90deg, transparent, rgba(0,169,157,0.4), rgba(0,169,157,0.4), transparent)", zIndex: 0 }} />
            {STEPS.map((step) => (
              <motion.div key={step.step} variants={fadeUp} whileHover={{ scale: 1.03, cursor: "pointer" }} onClick={() => navigate("/how-it-works")} style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
                <motion.div whileHover={{ background: COLORS.teal }} style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(0,169,157,0.15)", border: "2px solid rgba(0,169,157,0.4)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 24, fontWeight: 900, color: COLORS.teal, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", transition: "all 0.3s" }}>
                  {step.step}
                </motion.div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: COLORS.white, margin: "0 0 10px", fontFamily: "'DM Sans', sans-serif" }}>{step.title}</h3>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
          <motion.div variants={fadeUp} style={{ textAlign: "center", marginTop: 48 }}>
            <motion.button whileHover={{ scale: 1.04 }} onClick={() => navigate("/how-it-works")}
              style={{ background: COLORS.teal, color: COLORS.white, border: "none", borderRadius: 12, padding: "14px 32px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              See Full Process →
            </motion.button>
          </motion.div>
        </div>
      </Section>

      {/* CTA */}
      <Section style={{ background: COLORS.teal, padding: "72px 24px" }}>
        <motion.div variants={fadeUp} style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 48, fontWeight: 900, color: COLORS.white, margin: "0 0 16px", fontFamily: "'Playfair Display', Georgia, serif" }}>Ready to Book Care?</h2>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.8)", margin: "0 0 40px", fontFamily: "'DM Sans', sans-serif" }}>Get a verified nurse at your door within 2–4 hours. Available 24/7, 365 days.</p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={() => setModalOpen(true)}
              style={{ background: COLORS.white, color: COLORS.teal, border: "none", borderRadius: 12, padding: "16px 36px", fontSize: 16, fontWeight: 800, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              📞 Call 1800-NurtureC
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={() => setModalOpen(true)}
              style={{ background: "transparent", color: COLORS.white, border: "2px solid rgba(255,255,255,0.6)", borderRadius: 12, padding: "16px 36px", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              Book Online →
            </motion.button>
          </div>
        </motion.div>
      </Section>

      <BookingModal open={modalOpen} onClose={() => setModalOpen(false)} />

      {/* Floating Button */}
      <motion.button initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 2 }}
        whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }} onClick={() => setModalOpen(true)}
        style={{ position: "fixed", bottom: 32, right: 32, background: COLORS.teal, color: COLORS.white, border: "none", borderRadius: 20, padding: "14px 24px", fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 8px 32px rgba(0,169,157,0.45)", zIndex: 99, display: "flex", alignItems: "center", gap: 8 }}>
        📅 Quick Book
      </motion.button>
    </div>
  );
}
