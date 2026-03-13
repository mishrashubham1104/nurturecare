import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { COLORS} from "../constants";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const theme    = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = () => {
    setLoggingOut(true);
    logout();
    navigate("/");
  };

  const rows = [
    ["👤 Full Name",   user?.name  || "—"],
    ["📧 Email",       user?.email || "—"],
    ["📞 Phone",       user?.phone || "—"],
    ["🎭 Role",        user?.role  || "—"],
  ];

  return (
    <div style={{ background: theme.bg, minHeight: "100vh", paddingTop: 100, transition: "background 0.3s" }}>

      {/* Header */}
      <div style={{ background: COLORS.navy, padding: "clamp(32px,5vw,56px) clamp(16px,5vw,48px) clamp(40px,6vw,72px)" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            style={{
              width: 80, height: 80, borderRadius: "50%",
              background: "linear-gradient(135deg,#00A99D,#00CEC3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 32, fontWeight: 900, color: "#fff",
              fontFamily: "'DM Sans', sans-serif",
              margin: "0 auto 16px", boxShadow: "0 8px 32px rgba(0,169,157,0.4)",
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{ fontSize: "clamp(22px,5vw,36px)", fontWeight: 900, color: "#fff", fontFamily: "'Playfair Display', Georgia, serif", margin: "0 0 6px" }}
          >
            {user?.name || "My Profile"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, fontFamily: "'DM Sans', sans-serif", textTransform: "capitalize" }}
          >
            {user?.role || "Patient"} Account
          </motion.p>
        </div>
      </div>

      {/* Card */}
      <div style={{ maxWidth: 560, margin: "-32px auto 0", padding: "0 clamp(16px,5vw,24px) 60px" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          style={{
            background: theme.bgCard, borderRadius: 24,
            border: `1px solid ${theme.border}`,
            boxShadow: theme.shadowLg, overflow: "hidden",
            transition: "background 0.3s",
          }}
        >
          {/* Info rows */}
          <div style={{ padding: "clamp(20px,4vw,32px)" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.teal, textTransform: "uppercase", letterSpacing: 1.5, fontFamily: "'DM Sans', sans-serif", marginBottom: 16 }}>
              Account Details
            </div>
            {rows.map(([label, val]) => (
              <div key={label} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "13px 0", borderBottom: `1px solid ${theme.border}`,
                gap: 12, flexWrap: "wrap",
              }}>
                <span style={{ fontSize: 13, color: theme.textMuted, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>{label}</span>
                <span style={{ fontSize: 14, color: theme.text, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, textTransform: "capitalize", textAlign: "right" }}>{val}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div style={{ padding: "clamp(16px,4vw,24px)", borderTop: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", gap: 10 }}>
            {user?.role === "caregiver" && (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/caregiver/dashboard")}
                style={{ width: "100%", padding: "14px", borderRadius: 14, background: "rgba(0,169,157,0.1)", border: "1px solid rgba(0,169,157,0.3)", color: COLORS.teal, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                📊 Go to Caregiver Dashboard
              </motion.button>
            )}
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/my-bookings")}
              style={{ width: "100%", padding: "14px", borderRadius: 14, background: theme.bgSecondary, border: `1px solid ${theme.border}`, color: theme.text, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              📅 My Bookings
            </motion.button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={handleLogout} disabled={loggingOut}
              style={{ width: "100%", padding: "14px", borderRadius: 14, background: "rgba(255,107,138,0.1)", border: "1px solid rgba(255,107,138,0.3)", color: "#FF6B8A", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              {loggingOut ? "Signing out…" : "🚪 Sign Out"}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}