
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function BookingModal({ open, onClose, preService, preNurse }) {
  const { submitBooking, loading } = useApp();
  const { isLoggedIn, user }       = useAuth();
  const theme                      = useTheme();
  const navigate                   = useNavigate();
  const [form, setForm]            = useState({ patientName: user?.name || "", service: preService || "", date: "", phone: user?.phone || "", address: "" });
  const [success, setSuccess]      = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await submitBooking({ ...form, nurseId: preNurse?.id, nurseName: preNurse?.name });
      setSuccess(res);
    } catch { alert("Booking failed. Please try again."); }
  };

  const handleClose = () => {
    setSuccess(null);
    setForm({ patientName: user?.name || "", service: preService || "", date: "", phone: user?.phone || "", address: "" });
    onClose();
  };

  const inputStyle = {
    width: "100%", padding: "12px 14px", borderRadius: 10,
    border: `1.5px solid ${theme.border}`,
    background: theme.bgSecondary, color: theme.text,
    fontSize: 14, fontFamily: "'DM Sans', sans-serif",
    outline: "none", boxSizing: "border-box",
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleClose}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
            onClick={e => e.stopPropagation()}
            style={{ background: theme.bgCard, borderRadius: 24, padding: 40, maxWidth: 500, width: "100%", maxHeight: "90vh", overflowY: "auto", border: `1px solid ${theme.border}` }}>

            {/* Not logged in gate */}
            {!isLoggedIn ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>🔐</div>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 26, color: theme.text, margin: "0 0 12px" }}>Login Required</h3>
                <p style={{ color: theme.textMuted, fontFamily: "'DM Sans', sans-serif", marginBottom: 28, lineHeight: 1.6 }}>
                  Please sign in or create a free account to book a nurse.
                </p>
                <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                  <motion.button whileHover={{ scale: 1.04 }} onClick={() => { handleClose(); navigate("/login"); }}
                    style={{ background: "#00A99D", color: "#fff", border: "none", borderRadius: 12, padding: "12px 28px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                    Sign In
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.04 }} onClick={handleClose}
                    style={{ background: "transparent", color: theme.textMuted, border: `1px solid ${theme.border}`, borderRadius: 12, padding: "12px 28px", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                    Cancel
                  </motion.button>
                </div>
              </div>
            ) : success ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: 64 }}>✅</div>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 26, color: theme.text, margin: "16px 0 8px" }}>Booking Confirmed!</h3>
                <p style={{ color: theme.textMuted, fontFamily: "'DM Sans', sans-serif" }}>Booking ID: <strong style={{ color: "#00A99D" }}>{success.booking.id}</strong></p>
                <p style={{ color: theme.textMuted, fontSize: 14, fontFamily: "'DM Sans', sans-serif", marginTop: 8 }}>A nurse will arrive within 2–4 hours.</p>
                <motion.button whileHover={{ scale: 1.03 }} onClick={handleClose}
                  style={{ marginTop: 24, background: "#00A99D", color: "#fff", border: "none", borderRadius: 12, padding: "12px 32px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                  Done
                </motion.button>
              </div>
            ) : (
              <>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 26, color: theme.text, margin: "0 0 6px" }}>Book a Nurse</h3>
                {preNurse && <p style={{ color: "#00A99D", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", marginBottom: 20 }}>with {preNurse.name}</p>}
                <form onSubmit={handleSubmit}>
                  {[
                    ["Patient Name", "text", "patientName", "Enter patient name", true],
                    ["Service Required", "text", "service", "e.g. Post-Surgery Care", true],
                    ["Preferred Date", "date", "date", "", false],
                    ["Phone Number", "tel", "phone", "+91 xxxxxxxxxx", true],
                    ["Address", "text", "address", "Home address", false],
                  ].map(([label, type, key, placeholder, required]) => (
                    <div key={key} style={{ marginBottom: 14 }}>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: theme.textMuted, marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>{label}{required && " *"}</label>
                      <input type={type} placeholder={placeholder} required={required} value={form[key]}
                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                        style={inputStyle} />
                    </div>
                  ))}
                  <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    style={{ width: "100%", background: loading ? "#6B7C93" : "#00A99D", color: "#fff", border: "none", borderRadius: 12, padding: "15px", fontSize: 16, fontWeight: 800, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif", marginTop: 8 }}>
                    {loading ? "Booking..." : "Confirm Booking"}
                  </motion.button>
                </form>
                <button onClick={handleClose} style={{ background: "none", border: "none", color: theme.textMuted, cursor: "pointer", display: "block", margin: "12px auto 0", fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>
                  Cancel
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
