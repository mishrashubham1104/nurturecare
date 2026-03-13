import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { COLORS } from "../constants";
import { useTheme } from "../context/ThemeContext";

const STEPS = [
  { step: "01", icon: "📋", title: "Share Your Needs", desc: "Fill out a quick form with patient details, care requirements, and your preferred schedule. Takes less than 2 minutes.", detail: "Tell us about the patient's condition, the type of care needed, and when you need care to start. Our smart matching system will find the best nurse for you." },
  { step: "02", icon: "🔍", title: "We Match a Nurse", desc: "Our team reviews your request and matches you with a verified, background-checked nurse with the right specialization.", detail: "Every nurse on our platform is background-verified, licensed, and trained. We match based on specialization, location, language preference, and availability." },
  { step: "03", icon: "✅", title: "Confirm & Schedule", desc: "Review the nurse's profile, confirm the booking, and get a guaranteed arrival time within 2–4 hours.", detail: "You'll receive a confirmation SMS with your nurse's details. Track their live location as they head to your home." },
  { step: "04", icon: "🏠", title: "Care Begins", desc: "Your dedicated caregiver arrives on time, equipped, and ready to provide exceptional care.", detail: "The nurse will do an initial assessment, review any doctor's notes, and begin care. You'll receive daily health reports via our app." },
  { step: "05", icon: "📊", title: "Track & Report", desc: "Monitor health updates, medication logs, vital signs, and billing all from your personal dashboard.", detail: "Get real-time updates, share reports with your doctor, and manage payments — all from one place." },
];

const FAQS = [
  { q: "How quickly can a nurse arrive?", a: "In most cities, we can dispatch a nurse within 2–4 hours of booking. For planned care, you can schedule in advance." },
  { q: "Are nurses background-verified?", a: "Yes, 100%. Every nurse undergoes police verification, license check, medical fitness test, and skills assessment before joining NurtureCare." },
  { q: "What if I'm not satisfied with the nurse?", a: "We offer a free replacement within 24 hours, no questions asked. Your satisfaction is our priority." },
  { q: "Is there a minimum booking duration?", a: "Our minimum booking is 4 hours. We offer hourly, daily, weekly, and monthly plans." },
  { q: "Can I book the same nurse repeatedly?", a: "Absolutely! You can request your preferred nurse for future bookings, subject to availability." },
];

export default function HowItWorksPage() {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <div style={{ background: theme.bg, minHeight: "100vh", paddingTop: 100, transition: "background 0.3s" }}>
      <div style={{ background: COLORS.navy, padding: "clamp(48px,8vw,80px) clamp(20px,5vw,48px) clamp(60px,10vw,96px)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: "clamp(32px,6vw,56px)", fontWeight: 900, color: COLORS.white, fontFamily: "'Playfair Display', Georgia, serif", margin: "0 0 16px" }}>
            How It Works
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ fontSize: 18, color: "rgba(255,255,255,0.65)", fontFamily: "'DM Sans', sans-serif" }}>
            Getting professional care at home is simple, fast, and transparent.
          </motion.p>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "clamp(40px,6vw,64px) clamp(16px,4vw,24px)" }}>
        {STEPS.map((step, i) => (
          <motion.div key={step.step} initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
            style={{ display: "flex", gap: 24, marginBottom: 40, alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ flexShrink: 0, width: 72, height: 72, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.tealLight})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, boxShadow: "0 8px 24px rgba(0,169,157,0.3)" }}>
              {step.icon}
            </div>
            <div style={{ background: theme.bgCard, borderRadius: 20, padding: "clamp(20px,3vw,28px)", flex: 1, minWidth: 240, boxShadow: theme.shadow, border: `1px solid ${theme.border}`, transition: "background 0.3s" }}>
              <div style={{ color: COLORS.teal, fontSize: 13, fontWeight: 800, fontFamily: "'DM Sans', sans-serif", marginBottom: 4 }}>STEP {step.step}</div>
              <h3 style={{ fontSize: "clamp(18px,2.5vw,24px)", fontWeight: 800, color: theme.text, margin: "0 0 8px", fontFamily: "'DM Sans', sans-serif" }}>{step.title}</h3>
              <p style={{ fontSize: 15, color: theme.textMuted, lineHeight: 1.6, margin: "0 0 10px", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>{step.desc}</p>
              <p style={{ fontSize: 14, color: theme.textMuted, lineHeight: 1.7, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>{step.detail}</p>
            </div>
          </motion.div>
        ))}

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ background: COLORS.navy, borderRadius: 24, padding: "clamp(32px,5vw,48px)", textAlign: "center", marginBottom: 64 }}>
          <h2 style={{ fontSize: "clamp(24px,4vw,36px)", fontWeight: 900, color: COLORS.white, fontFamily: "'Playfair Display', Georgia, serif", margin: "0 0 16px" }}>Ready to Get Started?</h2>
          <p style={{ color: "rgba(255,255,255,0.65)", fontFamily: "'DM Sans', sans-serif", marginBottom: 28 }}>Book your first nurse in under 2 minutes.</p>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => navigate("/book")}
            style={{ background: COLORS.teal, color: COLORS.white, border: "none", borderRadius: 12, padding: "16px 40px", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
            Book a Nurse Now →
          </motion.button>
        </motion.div>

        <div>
          <h2 style={{ fontSize: "clamp(24px,4vw,36px)", fontWeight: 900, color: theme.text, fontFamily: "'Playfair Display', Georgia, serif", margin: "0 0 32px" }}>Frequently Asked Questions</h2>
          {FAQS.map((faq, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              style={{ background: theme.bgCard, borderRadius: 16, padding: "24px 28px", marginBottom: 16, boxShadow: theme.shadow, border: `1px solid ${theme.border}`, transition: "background 0.3s" }}>
              <h4 style={{ fontSize: 17, fontWeight: 800, color: theme.text, margin: "0 0 10px", fontFamily: "'DM Sans', sans-serif" }}>{faq.q}</h4>
              <p style={{ fontSize: 15, color: theme.textMuted, lineHeight: 1.6, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}