import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { COLORS, fadeUp, stagger } from "../constants";
import { useState } from "react";
import BookingModal from "../components/BookingModal";

const STEPS = [
  { step: "01", icon: "📋", title: "Share Patient Details", desc: "Fill in the patient's name, condition, preferred service, and care schedule through our simple online form or phone call. It takes less than 3 minutes.", duration: "3 minutes" },
  { step: "02", icon: "🔍", title: "We Match the Right Nurse", desc: "Our matching engine analyzes your requirements — experience needed, location, language preference, and availability — to shortlist the best-fit nurses.", duration: "15 minutes" },
  { step: "03", icon: "✅", title: "Confirm & Background Check", desc: "Review nurse profiles and ratings. Once confirmed, we send you the nurse's verified ID, certifications, and arrival ETA.", duration: "10 minutes" },
  { step: "04", icon: "🚀", title: "Nurse Arrives at Home", desc: "Your dedicated caregiver arrives fully equipped, on time. They introduce themselves, review the care plan, and begin providing professional care.", duration: "2–4 hours" },
  { step: "05", icon: "📊", title: "Daily Health Reports", desc: "Get real-time vitals, medication logs, and nursing notes on our family app. Your family doctor also gets weekly summaries.", duration: "Daily" },
  { step: "06", icon: "💬", title: "24/7 Support", desc: "Our care coordinators are available round the clock for any concerns, schedule changes, or emergency escalations.", duration: "Always" },
];

const FAQS = [
  { q: "How quickly can a nurse arrive?", a: "Most areas have nurse availability within 2–4 hours. For remote areas, this may extend to 6–8 hours. We'll confirm exact timing when you book." },
  { q: "Are the nurses background verified?", a: "Yes. Every nurse on NurtureCare undergoes police verification, license validation, reference checks, and in-person interviews before joining our platform." },
  { q: "Can I choose my nurse?", a: "Absolutely. You can browse caregiver profiles, read reviews, and choose who you want. You can also request a replacement at no extra charge." },
  { q: "What if I need to cancel?", a: "You can cancel up to 4 hours before the scheduled start for a full refund. We understand care needs change." },
];

export default function HowItWorks() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div style={{ paddingTop: 72, minHeight: "100vh", background: COLORS.cream }}>
      {/* Header */}
      <div style={{ background: COLORS.navy, padding: "80px 48px 60px" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <span style={{ color: COLORS.teal, fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: 2, fontFamily: "'DM Sans', sans-serif" }}>Process</span>
          <h1 style={{ fontSize: 56, fontWeight: 900, color: COLORS.white, margin: "12px 0 16px", fontFamily: "'Playfair Display', Georgia, serif" }}>How NurtureCare Works</h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans', sans-serif" }}>Professional care at home — simple, transparent, and fast.</p>
        </motion.div>
      </div>

      {/* Steps */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "80px 48px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {STEPS.map((step, i) => (
            <motion.div key={step.step} initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{ display: "grid", gridTemplateColumns: "1fr 80px 1fr", alignItems: "center", gap: 32, marginBottom: 0 }}>
              {i % 2 === 0 ? (
                <>
                  <div style={{ background: COLORS.white, borderRadius: 20, padding: 32, boxShadow: "0 4px 20px rgba(0,0,0,0.07)", textAlign: "right" }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.teal, textTransform: "uppercase", letterSpacing: 1, fontFamily: "'DM Sans', sans-serif" }}>⏱ {step.duration}</span>
                    <h3 style={{ fontSize: 22, fontWeight: 800, color: COLORS.navy, margin: "8px 0 10px", fontFamily: "'Playfair Display', Georgia, serif" }}>{step.title}</h3>
                    <p style={{ fontSize: 15, color: COLORS.slate, lineHeight: 1.7, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>{step.desc}</p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: 56, height: 56, borderRadius: "50%", background: COLORS.teal, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, zIndex: 1, boxShadow: "0 4px 20px rgba(0,169,157,0.35)" }}>{step.icon}</div>
                    {i < STEPS.length - 1 && <div style={{ width: 2, height: 60, background: "linear-gradient(to bottom, rgba(0,169,157,0.5), rgba(0,169,157,0.1))" }} />}
                  </div>
                  <div style={{ color: COLORS.navy, fontWeight: 900, fontSize: 64, fontFamily: "'Playfair Display', Georgia, serif", opacity: 0.06 }}>{step.step}</div>
                </>
              ) : (
                <>
                  <div style={{ color: COLORS.navy, fontWeight: 900, fontSize: 64, fontFamily: "'Playfair Display', Georgia, serif", opacity: 0.06, textAlign: "right" }}>{step.step}</div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: 56, height: 56, borderRadius: "50%", background: COLORS.navy, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, zIndex: 1, boxShadow: "0 4px 20px rgba(11,29,58,0.35)" }}>{step.icon}</div>
                    {i < STEPS.length - 1 && <div style={{ width: 2, height: 60, background: "linear-gradient(to bottom, rgba(11,29,58,0.3), rgba(11,29,58,0.05))" }} />}
                  </div>
                  <div style={{ background: COLORS.white, borderRadius: 20, padding: 32, boxShadow: "0 4px 20px rgba(0,0,0,0.07)" }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.navy, textTransform: "uppercase", letterSpacing: 1, fontFamily: "'DM Sans', sans-serif" }}>⏱ {step.duration}</span>
                    <h3 style={{ fontSize: 22, fontWeight: 800, color: COLORS.navy, margin: "8px 0 10px", fontFamily: "'Playfair Display', Georgia, serif" }}>{step.title}</h3>
                    <p style={{ fontSize: 15, color: COLORS.slate, lineHeight: 1.7, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>{step.desc}</p>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>

        {/* FAQs */}
        <div style={{ marginTop: 80 }}>
          <h2 style={{ fontSize: 40, fontWeight: 900, color: COLORS.navy, margin: "0 0 40px", textAlign: "center", fontFamily: "'Playfair Display', Georgia, serif" }}>Frequently Asked Questions</h2>
          {FAQS.map((faq, i) => (
            <motion.div key={i} whileHover={{ x: 4 }}
              style={{ background: COLORS.white, borderRadius: 16, padding: "20px 24px", marginBottom: 12, cursor: "pointer", border: openFaq === i ? `2px solid ${COLORS.teal}` : "2px solid transparent", transition: "border 0.2s" }}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h4 style={{ fontSize: 17, fontWeight: 700, color: COLORS.navy, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>{faq.q}</h4>
                <motion.span animate={{ rotate: openFaq === i ? 180 : 0 }} style={{ color: COLORS.teal, fontSize: 20, fontWeight: 700 }}>↓</motion.span>
              </div>
              {openFaq === i && (
                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} style={{ margin: "12px 0 0", fontSize: 15, color: COLORS.slate, lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>{faq.a}</motion.p>
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginTop: 64, background: COLORS.navy, borderRadius: 24, padding: 48, textAlign: "center" }}>
          <h2 style={{ fontSize: 36, fontWeight: 900, color: COLORS.white, margin: "0 0 16px", fontFamily: "'Playfair Display', Georgia, serif" }}>Ready to Get Started?</h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans', sans-serif", marginBottom: 28 }}>Book a nurse in under 5 minutes.</p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
            <motion.button whileHover={{ scale: 1.04 }} onClick={() => setModalOpen(true)}
              style={{ background: COLORS.teal, color: COLORS.white, border: "none", borderRadius: 12, padding: "14px 32px", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Book a Nurse →</motion.button>
            <motion.button whileHover={{ scale: 1.04 }} onClick={() => navigate("/caregivers")}
              style={{ background: "transparent", color: COLORS.white, border: "2px solid rgba(255,255,255,0.3)", borderRadius: 12, padding: "14px 32px", fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Browse Caregivers</motion.button>
          </div>
        </motion.div>
      </div>
      <BookingModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
