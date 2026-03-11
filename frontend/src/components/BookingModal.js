import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useApp }  from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function BookingModal({ open, onClose, preService, preNurse }) {
  const { submitBooking, loading } = useApp();
  const { isLoggedIn, user }       = useAuth();
  const theme                      = useTheme();
  const navigate                   = useNavigate();

  const [form, setForm]     = useState({
    patientName: user?.name || "",
    service:     preService || "",
    date:        "",
    phone:       user?.phone || "",
    address:     "",
  });
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await submitBooking({
        ...form,
        nurseId:   preNurse?.id,
        nurseName: preNurse?.name,
      });
      setSuccess(res);
    } catch {
      alert("Booking failed. Please try again.");
    }
  };

  const handleClose = () => {
    setSuccess(null);
    setForm({ patientName: user?.name || "", service: preService || "", date: "", phone: user?.phone || "", address: "" });
    onClose();
  };

  /* 16px prevents iOS zoom */
  const inp = {
    width: "100%", padding: "12px 14px", borderRadius: 10,
    border: `1.5px solid ${theme.border}`,
    background: theme.bgSecondary, color: theme.text,
    fontSize: 16, fontFamily: "'DM Sans', sans-serif",
    outline: "none", boxSizing: "border-box",
    WebkitAppearance: "none", appearance: "none",
  };
  const lbl = {
    display: "block", fontSize: 13, fontWeight: 700,
    color: theme.textMuted, marginBottom: 6,
    fontFamily: "'DM Sans', sans-serif",
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={handleClose}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.65)",
            zIndex: 200, display: "flex", alignItems: "flex-end",
            justifyContent: "center",
            padding: 0,
          }}
        >
          {/* On desktop: centered card; on mobile: bottom sheet */}
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 260 }}
            onClick={e => e.stopPropagation()}
            style={{
              background: theme.bgCard,
              /* full width on mobile, max 520px on desktop */
              width: "100%",
              maxWidth: 520,
              /* On desktop → centered via margin auto; on mobile → bottom sheet */
              borderRadius: "20px 20px 0 0",
              padding: "clamp(20px,4vw,36px)",
              maxHeight: "92vh",
              overflowY: "auto",
              border: `1px solid ${theme.border}`,
              paddingBottom: "max(clamp(20px,4vw,36px), env(safe-area-inset-bottom))",
            }}
          >
            {/* drag handle — mobile UX */}
            <div style={{ width: 36, height: 4, borderRadius: 2, background: theme.border, margin: "0 auto 20px" }} />

            {/* ── Not logged in ── */}
            {!isLoggedIn ? (
              <div style={{ textAlign: "center", padding: "12px 0 8px" }}>
                <div style={{ fontSize: 56, marginBottom: 14 }}>🔐</div>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(20px,4vw,26px)", color: theme.text, margin: "0 0 10px" }}>
                  Login Required
                </h3>
                <p style={{ color: theme.textMuted, fontFamily: "'DM Sans', sans-serif", marginBottom: 24, lineHeight: 1.6, fontSize: 15 }}>
                  Please sign in or create a free account to book a nurse.
                </p>
                <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                  <motion.button whileTap={{ scale: 0.96 }}
                    onClick={() => { handleClose(); navigate("/login"); }}
                    style={{ background: "#00A99D", color: "#fff", border: "none", borderRadius: 12, padding: "13px 28px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", minHeight: 50 }}>
                    Sign In
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.96 }} onClick={handleClose}
                    style={{ background: "transparent", color: theme.textMuted, border: `1px solid ${theme.border}`, borderRadius: 12, padding: "13px 28px", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", minHeight: 50 }}>
                    Cancel
                  </motion.button>
                </div>
              </div>

            /* ── Success ── */
            ) : success ? (
              <div style={{ textAlign: "center", padding: "12px 0 8px" }}>
                <div style={{ fontSize: 56 }}>✅</div>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(20px,4vw,26px)", color: theme.text, margin: "14px 0 8px" }}>
                  Booking Confirmed!
                </h3>
                <p style={{ color: theme.textMuted, fontFamily: "'DM Sans', sans-serif" }}>
                  Booking ID: <strong style={{ color: "#00A99D" }}>{success.booking.id}</strong>
                </p>
                <p style={{ color: theme.textMuted, fontSize: 13, fontFamily: "'DM Sans', sans-serif", marginTop: 8 }}>
                  A nurse will arrive within 2–4 hours.
                </p>
                <motion.button whileTap={{ scale: 0.96 }} onClick={handleClose}
                  style={{ marginTop: 22, background: "#00A99D", color: "#fff", border: "none", borderRadius: 12, padding: "13px 36px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", minHeight: 50 }}>
                  Done
                </motion.button>
              </div>

            /* ── Form ── */
            ) : (
              <>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(20px,4vw,24px)", color: theme.text, margin: "0 0 4px" }}>
                  Book a Nurse
                </h3>
                {preNurse && (
                  <p style={{ color: "#00A99D", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", marginBottom: 18, fontSize: 14 }}>
                    with {preNurse.name}
                  </p>
                )}

                <form onSubmit={handleSubmit}>
                  {[
                    ["Patient Name",     "text", "patientName", "Enter patient name",   true],
                    ["Service Required", "text", "service",     "e.g. Post-Surgery Care", true],
                    ["Preferred Date",   "date", "date",        "",                     false],
                    ["Phone Number",     "tel",  "phone",       "+91 xxxxxxxxxx",        true],
                    ["Address",         "text",  "address",     "Home address",          false],
                  ].map(([label, type, key, placeholder, required]) => (
                    <div key={key} style={{ marginBottom: 14 }}>
                      <label style={lbl}>{label}{required && " *"}</label>
                      <input
                        type={type} placeholder={placeholder} required={required}
                        value={form[key]}
                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                        style={inp}
                      />
                    </div>
                  ))}

                  <motion.button type="submit" disabled={loading} whileTap={{ scale: 0.97 }}
                    style={{
                      width: "100%",
                      background: loading ? "#6B7C93" : "#00A99D",
                      color: "#fff", border: "none", borderRadius: 12,
                      padding: "15px", fontSize: 16, fontWeight: 800,
                      cursor: loading ? "not-allowed" : "pointer",
                      fontFamily: "'DM Sans', sans-serif", marginTop: 6,
                      minHeight: 52,
                    }}>
                    {loading ? "Booking..." : "Confirm Booking"}
                  </motion.button>
                </form>

                <button onClick={handleClose}
                  style={{
                    background: "none", border: "none", color: theme.textMuted,
                    cursor: "pointer", display: "block",
                    margin: "14px auto 0", fontSize: 14,
                    fontFamily: "'DM Sans', sans-serif",
                    minHeight: 44, padding: "0 16px",
                  }}>
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