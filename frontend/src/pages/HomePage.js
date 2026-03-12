import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { COLORS, fadeUp, stagger, STATS } from "../constants";
import { useApp } from "../context/AppContext";
import BookingModal from "../components/BookingModal";

function Section({ children, id, style = {} }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section id={id} ref={ref} variants={stagger} initial="hidden" animate={inView ? "show" : "hidden"}
      style={{ padding: "96px 24px", ...style }}>{children}</motion.section>
  );
}

export default function HomePage() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 120]);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const { fetchServices, services, fetchTestimonials, testimonials } = useApp();

  useEffect(() => { fetchServices(); fetchTestimonials(); }, []);

  const [activeTestimonial, setActiveTestimonial] = useState(0);
  useEffect(() => {
    if (!testimonials.length) return;
    const t = setInterval(() => setActiveTestimonial(a => (a + 1) % testimonials.length), 4000);
    return () => clearInterval(t);
  }, [testimonials]);

  return (
    <div>
      {/* HERO */}
      <div style={{ position: "relative", minHeight: "100vh", background: COLORS.navy, overflow: "hidden", display: "flex", alignItems: "center" }}>
        {[...Array(5)].map((_, i) => (
          <motion.div key={i}
            animate={{ y: [0, -20, 0], x: [0, 10, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 4 + i * 1.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }}
            style={{ position: "absolute", width: [320,200,480,150,280][i], height: [320,200,480,150,280][i],
              borderRadius: "50%", background: ["radial-gradient(circle,rgba(0,169,157,0.18),transparent)","radial-gradient(circle,rgba(0,206,195,0.12),transparent)","radial-gradient(circle,rgba(240,165,0,0.08),transparent)","radial-gradient(circle,rgba(255,107,138,0.12),transparent)","radial-gradient(circle,rgba(0,169,157,0.1),transparent)"][i],
              top: ["10%","60%","-10%","75%","40%"][i], left: ["60%","80%","-5%","10%","50%"][i] }} />
        ))}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0,169,157,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,169,157,0.04) 1px,transparent 1px)", backgroundSize: "48px 48px" }} />

        <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center", position: "relative", zIndex: 2 }}>
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.div variants={fadeUp} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,169,157,0.15)", border: "1px solid rgba(0,169,157,0.3)", borderRadius: 40, padding: "6px 16px", marginBottom: 24 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.teal, display: "inline-block" }} />
              <span style={{ color: COLORS.tealLight, fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>India's Most Trusted Home Care</span>
            </motion.div>
            <motion.h1 variants={fadeUp} style={{ fontSize: 64, fontWeight: 900, color: COLORS.white, lineHeight: 1.1, margin: "0 0 20px", fontFamily: "'Playfair Display', Georgia, serif" }}>
              Expert Nursing<br /><span style={{ color: COLORS.teal }}>Care at Home</span>
            </motion.h1>
            <motion.p variants={fadeUp} style={{ fontSize: 18, color: "rgba(255,255,255,0.68)", lineHeight: 1.7, maxWidth: 480, margin: "0 0 40px", fontFamily: "'DM Sans', sans-serif" }}>
              Professional, verified, and compassionate nurses delivered to your doorstep within hours.
            </motion.p>
            <motion.div variants={fadeUp} style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 48 }}>
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => setModalOpen(true)}
                style={{ background: COLORS.teal, color: COLORS.white, border: "none", borderRadius: 12, padding: "16px 32px", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 8px 32px rgba(0,169,157,0.35)" }}>
                Book a Nurse →
              </motion.button>
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => navigate("/how-it-works")}
                style={{ background: "transparent", color: COLORS.white, border: "2px solid rgba(255,255,255,0.25)", borderRadius: 12, padding: "16px 32px", fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                ▶ Watch How It Works
              </motion.button>
            </motion.div>
            <motion.div variants={fadeUp} style={{ display: "flex", gap: 32 }}>
              {["50K+ Patients", "1200+ Nurses", "4.9★ Rated"].map(s => (
                <div key={s} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: COLORS.white, fontFamily: "'DM Sans', sans-serif" }}>{s.split(" ")[0]}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans', sans-serif" }}>{s.split(" ").slice(1).join(" ")}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div className="hero-card-col" style={{ y: heroY }} initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
            <div style={{ position: "relative" }}>
              <div style={{ background: "linear-gradient(135deg,rgba(0,169,157,0.15) 0%,rgba(11,29,58,0.8) 100%)", border: "1px solid rgba(0,169,157,0.25)", borderRadius: 24, padding: 32, backdropFilter: "blur(20px)" }}>
                <div style={{ fontSize: 96, textAlign: "center", marginBottom: 16 }}>👩‍⚕️</div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.white, fontFamily: "'Playfair Display', Georgia, serif" }}>Dr. Priya Sharma</div>
                  <div style={{ color: COLORS.teal, fontSize: 14, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", marginTop: 4 }}>ICU Specialist · 12 yrs exp</div>
                  <div style={{ display: "flex", justifyContent: "center", gap: 4, marginTop: 12, fontSize: 20 }}>⭐⭐⭐⭐⭐</div>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginTop: 4, fontFamily: "'DM Sans', sans-serif" }}>238 reviews</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 24 }}>
                  {[["Background Verified ✓", COLORS.teal],["Available 24/7 ✓", COLORS.gold],["Covid-Safe ✓","#48BB78"],["Insured ✓", COLORS.rose]].map(([text, color]) => (
                    <div key={text} style={{ background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: "10px 12px", fontSize: 12, fontWeight: 600, color, fontFamily: "'DM Sans', sans-serif", border: "1px solid rgba(255,255,255,0.08)" }}>{text}</div>
                  ))}
                </div>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => navigate("/caregivers")}
                  style={{ width: "100%", marginTop: 20, background: COLORS.teal, color: COLORS.white, border: "none", borderRadius: 12, padding: "14px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                  View All Caregivers
                </motion.button>
              </div>
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2.5, repeat: Infinity }}
                style={{ position: "absolute", top: -20, right: -20, background: COLORS.gold, borderRadius: 12, padding: "10px 16px", fontSize: 13, fontWeight: 700, color: COLORS.navy, boxShadow: "0 8px 24px rgba(240,165,0,0.35)", fontFamily: "'DM Sans', sans-serif" }}>
                🔥 10 bookings today
              </motion.div>
              <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                style={{ position: "absolute", bottom: -20, left: -20, background: COLORS.white, borderRadius: 12, padding: "10px 16px", fontSize: 13, fontWeight: 700, color: COLORS.navy, boxShadow: "0 8px 24px rgba(0,0,0,0.15)", fontFamily: "'DM Sans', sans-serif" }}>
                ✅ Arrives in 2 hours
              </motion.div>
            </div>
          </motion.div>
        </div>

        <div style={{ position: "absolute", bottom: -2, left: 0, right: 0 }}>
          <svg viewBox="0 0 1440 80" fill="none" style={{ display: "block" }}>
            <path d="M0 80V40C240 0 480 80 720 40S1200 0 1440 40V80H0Z" fill={COLORS.cream} />
          </svg>
        </div>
      </div>

      {/* STATS */}
      <div style={{ background: COLORS.teal, padding: "32px 48px" }}>
        <div className="stats-grid" style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 }}>
          {STATS.map(({ value, label }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: COLORS.white, fontFamily: "'DM Sans', sans-serif" }}>{value}</div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", fontFamily: "'DM Sans', sans-serif" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SERVICES PREVIEW */}
      <Section id="services-preview" style={{ background: COLORS.cream }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <motion.div variants={fadeUp} style={{ textAlign: "center", marginBottom: 64 }}>
            <span style={{ color: COLORS.teal, fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: 2, fontFamily: "'DM Sans', sans-serif" }}>What We Offer</span>
            <h2 style={{ fontSize: 48, fontWeight: 900, color: COLORS.navy, margin: "12px 0 16px", fontFamily: "'Playfair Display', Georgia, serif" }}>Comprehensive Home Care</h2>
          </motion.div>
          <div className="services-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
            {(services.length ? services : [{icon:"🏥",title:"Post-Surgery Care",desc:"Professional at-home recovery support.",color:"#E8F6FF"},{icon:"👴",title:"Elderly Care",desc:"Compassionate daily living assistance.",color:"#FFF0F5"},{icon:"🧑‍⚕️",title:"ICU at Home",desc:"Critical care at home.",color:"#F0FFF4"},{icon:"💊",title:"Medication Management",desc:"Timely medication administration.",color:"#FFFBEB"},{icon:"🩺",title:"Physiotherapy",desc:"In-home physiotherapy sessions.",color:"#F5F0FF"},{icon:"🧠",title:"Dementia Care",desc:"Specialized memory care.",color:"#FFF5F0"}]).map((svc, i) => (
              <motion.div key={svc.title} variants={fadeUp} whileHover={{ y: -8, boxShadow: "0 24px 60px rgba(0,0,0,0.12)" }}
                onClick={() => navigate(`/services/${svc.slug || svc.title.toLowerCase().replace(/\s+/g,"-")}`)}
                style={{ background: svc.color, borderRadius: 20, padding: 32, cursor: "pointer", border: "1px solid rgba(0,0,0,0.05)" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>{svc.icon}</div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: COLORS.navy, margin: "0 0 10px", fontFamily: "'DM Sans', sans-serif" }}>{svc.title}</h3>
                <p style={{ fontSize: 15, color: COLORS.slate, lineHeight: 1.6, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>{svc.desc}</p>
                <motion.div whileHover={{ x: 4 }} style={{ marginTop: 20, color: COLORS.teal, fontWeight: 700, fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>Learn more →</motion.div>
              </motion.div>
            ))}
          </div>
          <motion.div variants={fadeUp} style={{ textAlign: "center", marginTop: 48 }}>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => navigate("/services")}
              style={{ background: COLORS.teal, color: COLORS.white, border: "none", borderRadius: 12, padding: "16px 40px", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              View All Services →
            </motion.button>
          </motion.div>
        </div>
      </Section>

      {/* TESTIMONIALS PREVIEW */}
      {testimonials.length > 0 && (
        <Section style={{ background: "linear-gradient(135deg,#0B1D3A 0%,#0d2d4a 100%)" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
            <motion.div variants={fadeUp}>
              <h2 style={{ fontSize: 48, fontWeight: 900, color: COLORS.white, margin: "0 0 48px", fontFamily: "'Playfair Display', Georgia, serif" }}>Families Trust NurtureCare</h2>
            </motion.div>
            <AnimatePresence mode="wait">
              <motion.div key={activeTestimonial} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }}
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24, padding: 48 }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>{"⭐".repeat(testimonials[activeTestimonial].stars)}</div>
                <p style={{ fontSize: 22, color: COLORS.white, lineHeight: 1.7, margin: "0 0 28px", fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic" }}>
                  "{testimonials[activeTestimonial].text}"
                </p>
                <div style={{ fontWeight: 800, color: COLORS.teal, fontFamily: "'DM Sans', sans-serif" }}>{testimonials[activeTestimonial].name}</div>
                <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>{testimonials[activeTestimonial].city}</div>
              </motion.div>
            </AnimatePresence>
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 28 }}>
              {testimonials.map((_, i) => (
                <motion.button key={i} onClick={() => setActiveTestimonial(i)}
                  animate={{ width: i === activeTestimonial ? 28 : 8 }}
                  style={{ height: 8, borderRadius: 4, background: i === activeTestimonial ? COLORS.teal : "rgba(255,255,255,0.2)", border: "none", cursor: "pointer", padding: 0 }} />
              ))}
            </div>
            <motion.button variants={fadeUp} whileHover={{ scale: 1.04 }} onClick={() => navigate("/testimonials")}
              style={{ marginTop: 32, background: "transparent", color: COLORS.tealLight, border: `2px solid ${COLORS.teal}`, borderRadius: 12, padding: "12px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              Read More Reviews →
            </motion.button>
          </div>
        </Section>
      )}

      {/* CTA */}
      <Section style={{ background: COLORS.teal, padding: "72px 24px" }}>
        <motion.div variants={fadeUp} style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 48, fontWeight: 900, color: COLORS.white, margin: "0 0 16px", fontFamily: "'Playfair Display', Georgia, serif" }}>Ready to Book Care?</h2>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.8)", margin: "0 0 40px", fontFamily: "'DM Sans', sans-serif" }}>Get a verified nurse at your door within 2–4 hours. Available 24/7, 365 days.</p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={() => setModalOpen(true)}
              style={{ background: COLORS.white, color: COLORS.teal, border: "none", borderRadius: 12, padding: "16px 36px", fontSize: 16, fontWeight: 800, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              📅 Book Now
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={() => navigate("/contact")}
              style={{ background: "transparent", color: COLORS.white, border: "2px solid rgba(255,255,255,0.6)", borderRadius: 12, padding: "16px 36px", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              Contact Us →
            </motion.button>
          </div>
        </motion.div>
      </Section>

      <BookingModal open={modalOpen} onClose={() => setModalOpen(false)} />

      {/* Floating CTA */}
      <motion.button initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 2 }}
        whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }} onClick={() => setModalOpen(true)}
        style={{ position: "fixed", bottom: 32, right: 32, background: COLORS.teal, color: COLORS.white,
          border: "none", borderRadius: 20, padding: "14px 24px", fontSize: 15, fontWeight: 800,
          cursor: "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 8px 32px rgba(0,169,157,0.45)", zIndex: 99 }}>
        📅 Quick Book
      </motion.button>
    </div>
  );
}