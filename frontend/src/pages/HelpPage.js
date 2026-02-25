
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { COLORS, fadeUp, stagger } from "../constants";

const CATEGORIES = [
  { icon: "📅", title: "Bookings", count: 8 },
  { icon: "👩‍⚕️", title: "Nurses & Caregivers", count: 6 },
  { icon: "💳", title: "Payments & Billing", count: 5 },
  { icon: "🏥", title: "Services & Care", count: 7 },
  { icon: "📱", title: "Using the App", count: 4 },
  { icon: "🔒", title: "Privacy & Safety", count: 5 },
];

const FAQS = [
  { q: "How do I book a nurse?", a: "You can book online via our website or app, or call us at 1800-NURTURE-C. Provide patient details, select a service, and we'll match you with the best available nurse." },
  { q: "How quickly will a nurse arrive?", a: "In most cities, we dispatch a nurse within 2–4 hours of booking. For planned or recurring care, you can schedule in advance at a preferred time." },
  { q: "Can I choose a specific nurse?", a: "Yes! After your first booking, you can request the same nurse for future appointments (subject to availability). You can also browse nurse profiles and select your preferred caregiver." },
  { q: "What if I'm not happy with my nurse?", a: "We offer a free replacement within 24 hours, no questions asked. Simply contact our support team and we'll arrange a new caregiver immediately." },
  { q: "Are all nurses background verified?", a: "Absolutely. Every nurse on our platform undergoes police verification, nursing license validation, medical fitness testing, and a clinical skills assessment before joining." },
  { q: "How do I pay?", a: "We accept UPI, credit/debit cards, net banking, and cash. You can pay per booking or subscribe to a weekly/monthly plan for discounts." },
  { q: "Can I cancel or reschedule?", a: "Yes, you can cancel or reschedule up to 2 hours before the scheduled visit at no charge. Late cancellations may incur a small fee." },
  { q: "How are nurses trained?", a: "All NurtureCare nurses complete a 40-hour onboarding program covering patient safety, emergency response, medical documentation, and care protocols before their first assignment." },
];

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filtered = FAQS.filter(f => !search || f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ background: COLORS.cream, minHeight: "100vh", paddingTop: 100 }}>
      <div style={{ background: COLORS.navy, padding: "80px 48px 96px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: 56, fontWeight: 900, color: COLORS.white, fontFamily: "'Playfair Display', Georgia, serif", margin: "0 0 16px" }}>
            Help Center
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            style={{ fontSize: 18, color: "rgba(255,255,255,0.65)", fontFamily: "'DM Sans', sans-serif", marginBottom: 32 }}>
            How can we help you today?
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <input type="text" placeholder="🔍  Search for answers..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: "100%", padding: "18px 24px", borderRadius: 16, border: "none", fontSize: 16, fontFamily: "'DM Sans', sans-serif", outline: "none", boxShadow: "0 8px 32px rgba(0,0,0,0.2)", maxWidth: 500 }} />
          </motion.div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "-32px auto 0", padding: "0 24px 96px" }}>
        {/* Categories */}
        <motion.div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 56 }} initial="hidden" animate="show" variants={stagger}>
          {CATEGORIES.map(cat => (
            <motion.div key={cat.title} variants={fadeUp} whileHover={{ y: -4, boxShadow: "0 12px 36px rgba(0,0,0,0.1)" }}
              style={{ background: COLORS.white, borderRadius: 16, padding: 24, display: "flex", alignItems: "center", gap: 16, cursor: "pointer" }}>
              <div style={{ fontSize: 36 }}>{cat.icon}</div>
              <div>
                <h4 style={{ fontSize: 16, fontWeight: 800, color: COLORS.navy, margin: "0 0 4px", fontFamily: "'DM Sans', sans-serif" }}>{cat.title}</h4>
                <p style={{ fontSize: 13, color: COLORS.slate, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>{cat.count} articles</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* FAQs */}
        <h2 style={{ fontSize: 32, fontWeight: 900, color: COLORS.navy, fontFamily: "'Playfair Display', Georgia, serif", margin: "0 0 24px" }}>
          {search ? `Results for "${search}"` : "Frequently Asked Questions"}
        </h2>
        {filtered.length === 0 ? (
          <div style={{ background: COLORS.white, borderRadius: 16, padding: 40, textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🤔</div>
            <p style={{ color: COLORS.slate, fontFamily: "'DM Sans', sans-serif" }}>No results found. Try a different search or <span style={{ color: COLORS.teal, fontWeight: 700, cursor: "pointer" }} onClick={() => navigate("/contact")}>contact our team</span>.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                style={{ background: COLORS.white, borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
                <div style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <h4 style={{ fontSize: 16, fontWeight: 800, color: COLORS.navy, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>{faq.q}</h4>
                  <motion.span animate={{ rotate: openFaq === i ? 180 : 0 }} style={{ color: COLORS.teal, fontSize: 18, flexShrink: 0, marginLeft: 16 }}>▼</motion.span>
                </div>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      style={{ overflow: "hidden", borderTop: "1px solid #F0F0F0" }}>
                      <p style={{ padding: "16px 24px", color: COLORS.slate, lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif", fontSize: 15, margin: 0 }}>{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ background: COLORS.navy, borderRadius: 20, padding: 40, marginTop: 48, textAlign: "center" }}>
          <h3 style={{ fontSize: 26, fontWeight: 900, color: COLORS.white, fontFamily: "'Playfair Display', Georgia, serif", margin: "0 0 12px" }}>Still need help?</h3>
          <p style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans', sans-serif", marginBottom: 24 }}>Our support team is available 24/7.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <motion.button whileHover={{ scale: 1.04 }} onClick={() => navigate("/contact")}
              style={{ background: COLORS.teal, color: COLORS.white, border: "none", borderRadius: 12, padding: "12px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              Contact Support
            </motion.button>
            <motion.button whileHover={{ scale: 1.04 }}
              style={{ background: "transparent", color: "rgba(255,255,255,0.8)", border: "2px solid rgba(255,255,255,0.2)", borderRadius: 12, padding: "12px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              📞 Call 1800-NURTURE-C
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
