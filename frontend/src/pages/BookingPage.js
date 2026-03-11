import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useApp }  from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const SERVICES = [
  "Post-Surgery Care",
  "Elderly Care",
  "ICU at Home",
  "Medication Management",
  "Physiotherapy",
  "Dementia Care",
];

export default function BookingPage() {
  const { submitBooking, loading } = useApp();
  const { user }   = useAuth();
  const theme      = useTheme();
  const navigate   = useNavigate();
  const [form, setForm] = useState({
    patientName: user?.name || "",
    service: "",
    date: "",
    phone: user?.phone || "",
    address: "",
  });
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await submitBooking(form);
      setSuccess(res);
    } catch {
      alert("Booking failed. Please try again.");
    }
  };

  const inp = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 12,
    border: `1.5px solid ${theme.border}`,
    background: theme.bgSecondary,
    color: theme.text,
    /* 16px prevents iOS auto-zoom on focus */
    fontSize: 16,
    fontFamily: "'DM Sans', sans-serif",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
    WebkitAppearance: "none",
    appearance: "none",
  };

  const lbl = {
    display: "block",
    fontSize: 13,
    fontWeight: 700,
    color: theme.textMuted,
    marginBottom: 8,
    fontFamily: "'DM Sans', sans-serif",
  };

  return (
    <div style={{ background: theme.bg, minHeight: "100vh", paddingTop: 64 }}>

      {/* ── Hero ── */}
      <div style={{
        background: "#0B1D3A",
        padding: "clamp(40px,8vw,80px) clamp(16px,4vw,40px) clamp(64px,10vw,120px)",
      }}>
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            style={{
              fontSize: "clamp(28px,6vw,52px)",
              fontWeight: 900, color: "#fff",
              fontFamily: "'Playfair Display', Georgia, serif",
              lineHeight: 1.15,
            }}
          >
            Book a Nurse
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
            style={{
              color: "rgba(255,255,255,0.65)",
              fontSize: "clamp(15px,2vw,18px)",
              marginTop: 12,
              fontFamily: "'DM Sans', sans-serif",
              lineHeight: 1.6,
            }}
          >
            Fill out the form below. A nurse will arrive within 2–4 hours.
          </motion.p>

          {user && (
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(0,169,157,0.15)",
                border: "1px solid rgba(0,169,157,0.30)",
                borderRadius: 40, padding: "6px 16px", marginTop: 18,
              }}
            >
              <span style={{
                fontSize: 13, color: "#00CEC3",
                fontFamily: "'DM Sans', sans-serif",
              }}>
                ✓ Logged in as <strong>{user.name}</strong>
              </span>
            </motion.div>
          )}
        </div>
      </div>

      {/* ── Form card — overlaps hero ── */}
      <div style={{
        maxWidth: 680,
        margin: "-48px auto 0",
        padding: "0 clamp(12px,4vw,16px) clamp(48px,8vw,96px)",
      }}>
        <motion.div
          initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{
            background: theme.bgCard,
            borderRadius: "clamp(16px,3vw,28px)",
            padding: "clamp(20px,5vw,48px)",
            boxShadow: theme.shadowLg,
            border: `1px solid ${theme.border}`,
          }}
        >
          <AnimatePresence mode="wait">

            {/* ── Success state ── */}
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: "center", padding: "16px 0" }}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.5 }}
                  style={{ fontSize: 64 }}
                >🎉</motion.div>
                <h2 style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "clamp(24px,5vw,32px)", color: theme.text,
                  margin: "16px 0 8px",
                }}>
                  Booking Confirmed!
                </h2>
                <p style={{ color: theme.textMuted, fontFamily: "'DM Sans', sans-serif", marginBottom: 6 }}>
                  Your Booking ID:
                </p>
                <p style={{ color: "#00A99D", fontSize: "clamp(16px,3vw,22px)", fontWeight: 900, fontFamily: "'DM Sans', sans-serif", marginBottom: 8 }}>
                  {success.booking.id}
                </p>
                <p style={{ color: theme.textMuted, fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>
                  A verified nurse arrives within 2–4 hours.
                </p>
                <div style={{
                  display: "flex", gap: 12, justifyContent: "center",
                  marginTop: 28, flexWrap: "wrap",
                }}>
                  <motion.button whileTap={{ scale: 0.96 }} onClick={() => navigate("/caregivers")}
                    style={{
                      background: "#00A99D", color: "#fff", border: "none",
                      borderRadius: 12, padding: "12px 24px",
                      fontSize: 14, fontWeight: 700, cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif",
                      minHeight: 48,
                    }}>
                    Browse Caregivers
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.96 }} onClick={() => navigate("/")}
                    style={{
                      background: "transparent", color: theme.text,
                      border: `1px solid ${theme.border}`,
                      borderRadius: 12, padding: "12px 24px",
                      fontSize: 14, fontWeight: 600, cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif",
                      minHeight: 48,
                    }}>
                    Back to Home
                  </motion.button>
                </div>
              </motion.div>
            ) : (

              /* ── Booking form ── */
              <motion.div key="form">
                <h2 style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "clamp(20px,4vw,28px)", color: theme.text,
                  margin: "0 0 24px",
                }}>
                  Patient Details
                </h2>

                <form onSubmit={handleSubmit}>

                  {/* Row 1: Name + Phone */}
                  <div className="grid-2" style={{ marginBottom: 16 }}>
                    <div>
                      <label style={lbl}>Patient Name *</label>
                      <input
                        type="text" placeholder="Full name" required
                        value={form.patientName}
                        onChange={e => setForm(f => ({ ...f, patientName: e.target.value }))}
                        style={inp}
                      />
                    </div>
                    <div>
                      <label style={lbl}>Phone Number *</label>
                      <input
                        type="tel" placeholder="+91 xxxxxxxxxx" required
                        value={form.phone}
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        style={inp}
                      />
                    </div>
                  </div>

                  {/* Service */}
                  <div style={{ marginBottom: 16 }}>
                    <label style={lbl}>Service Required *</label>
                    <select
                      required value={form.service}
                      onChange={e => setForm(f => ({ ...f, service: e.target.value }))}
                      style={{ ...inp, cursor: "pointer" }}
                    >
                      <option value="">Select a service...</option>
                      {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  {/* Row 2: Date + Address */}
                  <div className="grid-2" style={{ marginBottom: 28 }}>
                    <div>
                      <label style={lbl}>Preferred Date</label>
                      <input
                        type="date" value={form.date}
                        onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                        style={inp}
                      />
                    </div>
                    <div>
                      <label style={lbl}>Home Address</label>
                      <input
                        type="text" placeholder="Street, City"
                        value={form.address}
                        onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                        style={inp}
                      />
                    </div>
                  </div>

                  <motion.button
                    type="submit" disabled={loading}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      width: "100%",
                      background: loading
                        ? "#6B7C93"
                        : "linear-gradient(135deg,#00A99D,#00CEC3)",
                      color: "#fff", border: "none",
                      borderRadius: 14,
                      padding: "clamp(14px,3vw,17px)",
                      fontSize: "clamp(15px,2vw,17px)",
                      fontWeight: 800,
                      cursor: loading ? "not-allowed" : "pointer",
                      fontFamily: "'DM Sans', sans-serif",
                      boxShadow: "0 8px 24px rgba(0,169,157,0.30)",
                      minHeight: 52,
                    }}
                  >
                    {loading ? "⏳ Booking..." : "Confirm Booking →"}
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}