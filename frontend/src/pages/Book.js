import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { COLORS, API_BASE, fadeUp, stagger } from "../constants";

export default function Book() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ patientName: "", service: "", date: "", phone: "", address: "", plan: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState("");

  const SERVICES = ["Post-Surgery Care", "Elderly Care", "ICU at Home", "Medication Management", "Physiotherapy", "Dementia Care", "Other"];
  const PLANS = ["Basic (₹999/day)", "Premium (₹1,799/day)", "24/7 Care (₹2,999/day)"];

  const handleSubmit = async () => {
    setError("");
    if (!form.patientName || !form.phone || !form.service) { setError("Please fill all required fields."); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/bookings`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) { setBooking(data.data); setStep(4); }
      else setError(data.message);
    } catch { setError("Server error. Please try again."); }
    setLoading(false);
  };

  return (
    <div style={{ paddingTop: 72, minHeight: "100vh", background: COLORS.cream }}>
      <div style={{ background: COLORS.navy, padding: "60px 48px 50px" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ fontSize: 48, fontWeight: 900, color: COLORS.white, margin: "0 0 8px", fontFamily: "'Playfair Display', Georgia, serif" }}>Book a Nurse</h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans', sans-serif" }}>Complete the form below — takes under 3 minutes.</p>
          {step < 4 && (
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 24 }}>
              {[1, 2, 3].map((s) => (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: step >= s ? COLORS.teal : "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: COLORS.white, fontFamily: "'DM Sans', sans-serif" }}>{s}</div>
                  {s < 3 && <div style={{ width: 40, height: 2, background: step > s ? COLORS.teal : "rgba(255,255,255,0.15)" }} />}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "60px 48px" }}>
        {step === 4 && booking ? (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ background: COLORS.white, borderRadius: 24, padding: 48, textAlign: "center", boxShadow: "0 8px 40px rgba(0,0,0,0.1)" }}>
            <div style={{ fontSize: 80, marginBottom: 20 }}>🎉</div>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 36, color: COLORS.navy, marginBottom: 8 }}>Booking Confirmed!</h2>
            <div style={{ display: "inline-block", background: COLORS.teal, color: COLORS.white, fontSize: 14, fontWeight: 700, borderRadius: 12, padding: "8px 20px", marginBottom: 24, fontFamily: "'DM Sans', sans-serif" }}>ID: {booking.id}</div>
            <p style={{ color: COLORS.slate, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.7, marginBottom: 32 }}>Our care coordinator will call <strong>{form.phone}</strong> within 30 minutes to confirm nurse assignment and arrival details.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <motion.button whileHover={{ scale: 1.04 }} onClick={() => navigate("/")}
                style={{ background: COLORS.navy, color: COLORS.white, border: "none", borderRadius: 12, padding: "14px 28px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Go Home</motion.button>
              <motion.button whileHover={{ scale: 1.04 }} onClick={() => navigate("/services")}
                style={{ background: "transparent", color: COLORS.teal, border: `2px solid ${COLORS.teal}`, borderRadius: 12, padding: "14px 28px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>View Services</motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: COLORS.white, borderRadius: 24, padding: 40, boxShadow: "0 8px 40px rgba(0,0,0,0.08)" }}>
            {error && <div style={{ background: "#FFF0F0", border: "1px solid #FFB3B3", borderRadius: 10, padding: "10px 14px", color: "#C0392B", fontSize: 14, marginBottom: 16, fontFamily: "'DM Sans', sans-serif" }}>{error}</div>}

            {step === 1 && (
              <motion.div variants={stagger} initial="hidden" animate="show">
                <motion.h3 variants={fadeUp} style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, color: COLORS.navy, margin: "0 0 24px" }}>Patient Details</motion.h3>
                {[["Patient Name *", "text", "patientName", "Full name of patient"], ["Phone Number *", "tel", "phone", "+91 xxxxxxxxxx"], ["Home Address", "text", "address", "Full delivery address"]].map(([label, type, key, ph]) => (
                  <motion.div key={key} variants={fadeUp} style={{ marginBottom: 16 }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: COLORS.navy, marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>{label}</label>
                    <input type={type} placeholder={ph} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid #E5E7EB", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box" }} />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div variants={stagger} initial="hidden" animate="show">
                <motion.h3 variants={fadeUp} style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, color: COLORS.navy, margin: "0 0 24px" }}>Care Requirements</motion.h3>
                <motion.div variants={fadeUp} style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: COLORS.navy, marginBottom: 10, fontFamily: "'DM Sans', sans-serif" }}>Service Required *</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {SERVICES.map((s) => (
                      <motion.div key={s} whileHover={{ scale: 1.02 }} onClick={() => setForm({ ...form, service: s })}
                        style={{ border: `2px solid ${form.service === s ? COLORS.teal : "#E5E7EB"}`, borderRadius: 12, padding: "12px 14px", cursor: "pointer", background: form.service === s ? "rgba(0,169,157,0.06)" : COLORS.white, fontSize: 14, fontWeight: 600, color: form.service === s ? COLORS.teal : COLORS.navy, fontFamily: "'DM Sans', sans-serif" }}>
                        {s}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
                <motion.div variants={fadeUp} style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: COLORS.navy, marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>Preferred Date</label>
                  <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                    style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid #E5E7EB", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box" }} />
                </motion.div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div variants={stagger} initial="hidden" animate="show">
                <motion.h3 variants={fadeUp} style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, color: COLORS.navy, margin: "0 0 24px" }}>Choose a Plan</motion.h3>
                {PLANS.map((p) => (
                  <motion.div key={p} variants={fadeUp} whileHover={{ scale: 1.01 }} onClick={() => setForm({ ...form, plan: p })}
                    style={{ border: `2px solid ${form.plan === p ? COLORS.teal : "#E5E7EB"}`, borderRadius: 14, padding: "16px 20px", cursor: "pointer", background: form.plan === p ? "rgba(0,169,157,0.06)" : COLORS.white, marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: form.plan === p ? COLORS.teal : COLORS.navy, fontFamily: "'DM Sans', sans-serif" }}>{p}</span>
                    {form.plan === p && <span style={{ color: COLORS.teal, fontSize: 20 }}>✓</span>}
                  </motion.div>
                ))}
                <motion.div variants={fadeUp} style={{ marginTop: 16 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: COLORS.navy, marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>Additional Notes</label>
                  <textarea placeholder="Any special instructions or conditions..." rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid #E5E7EB", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box", resize: "vertical" }} />
                </motion.div>
              </motion.div>
            )}

            <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
              {step > 1 && (
                <motion.button whileHover={{ scale: 1.03 }} onClick={() => setStep(step - 1)}
                  style={{ flex: 1, background: "transparent", color: COLORS.navy, border: `2px solid ${COLORS.navy}`, borderRadius: 12, padding: "14px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>← Back</motion.button>
              )}
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={step < 3 ? () => setStep(step + 1) : handleSubmit}
                disabled={loading}
                style={{ flex: 2, background: loading ? "#ccc" : COLORS.teal, color: COLORS.white, border: "none", borderRadius: 12, padding: "14px", fontSize: 15, fontWeight: 800, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                {loading ? "Booking..." : step < 3 ? "Next Step →" : "Confirm Booking 🎉"}
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
