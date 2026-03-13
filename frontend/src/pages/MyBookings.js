import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE, COLORS } from "../constants";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const STATUS_COLOR = {
  confirmed:   { bg: "rgba(59,130,246,0.12)",  text: "#3B82F6"  },
  pending:     { bg: "rgba(240,165,0,0.12)",    text: "#F0A500"  },
  accepted:    { bg: "rgba(0,169,157,0.12)",    text: "#00A99D"  },
  in_progress: { bg: "rgba(240,165,0,0.15)",    text: "#D97706"  },
  completed:   { bg: "rgba(0,169,157,0.12)",    text: "#00A99D"  },
  cancelled:   { bg: "rgba(255,107,138,0.12)",  text: "#FF6B8A"  },
  rejected:    { bg: "rgba(255,107,138,0.12)",  text: "#FF6B8A"  },
};

function StatusBadge({ status }) {
  const s = STATUS_COLOR[status] || { bg: "rgba(107,124,147,0.12)", text: "#6B7C93" };
  return (
    <span style={{
      background: s.bg, color: s.text,
      border: `1px solid ${s.text}40`,
      borderRadius: 20, padding: "4px 12px",
      fontSize: 12, fontWeight: 700,
      fontFamily: "'DM Sans', sans-serif",
      textTransform: "capitalize", whiteSpace: "nowrap",
    }}>
      {status?.replace("_", " ")}
    </span>
  );
}

export default function MyBookings() {
  const theme    = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [filter, setFilter]     = useState("all");

  useEffect(() => {
    const load = async () => {
      setLoading(true); setError("");
      try {
        const { data } = await axios.get(`${API_BASE}/bookings`);
        setBookings(Array.isArray(data.bookings) ? data.bookings : []);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load bookings.");
      } finally { setLoading(false); }
    };
    load();
  }, []);

  const filtered = filter === "all"
    ? bookings
    : bookings.filter(b => b.status === filter);

  const tabs = ["all", "confirmed", "in_progress", "completed", "cancelled"];

  return (
    <div style={{ background: theme.bg, minHeight: "100vh", paddingTop: 100, transition: "background 0.3s" }}>

      {/* Header */}
      <div style={{ background: COLORS.navy, padding: "clamp(32px,5vw,56px) clamp(16px,5vw,48px) clamp(40px,6vw,64px)" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 style={{ fontSize: "clamp(26px,5vw,42px)", fontWeight: 900, color: "#fff", fontFamily: "'Playfair Display', Georgia, serif", margin: "0 0 8px" }}>
              My Bookings
            </h1>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>
              Hello {user?.name?.split(" ")[0]} · {bookings.length} total booking{bookings.length !== 1 ? "s" : ""}
            </p>
          </motion.div>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "clamp(20px,4vw,40px) clamp(16px,4vw,24px)" }}>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setFilter(t)}
              style={{
                padding: "8px 16px", borderRadius: 20, border: "none", cursor: "pointer",
                fontSize: 13, fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
                background: filter === t ? COLORS.teal : theme.bgCard,
                color:      filter === t ? "#fff"       : theme.textMuted,
                border:     `1px solid ${filter === t ? COLORS.teal : theme.border}`,
                transition: "all 0.2s",
              }}>
              {t === "all" ? "All" : t.replace("_", " ")}
              {t === "all"
                ? ` (${bookings.length})`
                : ` (${bookings.filter(b => b.status === t).length})`}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              style={{ width: 36, height: 36, border: "3px solid rgba(0,169,157,0.2)", borderTopColor: COLORS.teal, borderRadius: "50%", margin: "0 auto 16px" }} />
            <p style={{ color: theme.textMuted, fontFamily: "'DM Sans', sans-serif" }}>Loading your bookings…</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div style={{ background: "rgba(255,107,138,0.1)", border: "1px solid rgba(255,107,138,0.3)", borderRadius: 14, padding: "20px 24px", color: "#FF6B8A", fontFamily: "'DM Sans', sans-serif", textAlign: "center" }}>
            ⚠️ {error}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filtered.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: "center", padding: "60px 24px", background: theme.bgCard, borderRadius: 24, border: `1px solid ${theme.border}` }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
            <h3 style={{ color: theme.text, fontFamily: "'Playfair Display', Georgia, serif", marginBottom: 8 }}>
              {filter === "all" ? "No bookings yet" : `No ${filter.replace("_", " ")} bookings`}
            </h3>
            <p style={{ color: theme.textMuted, fontSize: 14, fontFamily: "'DM Sans', sans-serif", marginBottom: 24 }}>
              {filter === "all" ? "Book a nurse to get started." : "Try a different filter."}
            </p>
            {filter === "all" && (
              <motion.button whileHover={{ scale: 1.04 }} onClick={() => navigate("/caregivers")}
                style={{ background: COLORS.teal, color: "#fff", border: "none", borderRadius: 12, padding: "12px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                Browse Caregivers →
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Booking cards */}
        <AnimatePresence>
          {!loading && !error && filtered.map((b, i) => (
            <motion.div key={b._id || b.bookingId}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{
                background: theme.bgCard, borderRadius: 20,
                border: `1px solid ${theme.border}`,
                padding: "clamp(16px,3vw,24px)",
                marginBottom: 14, boxShadow: theme.shadow,
                transition: "background 0.3s",
              }}
            >
              {/* Top row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: "clamp(15px,2vw,18px)", fontWeight: 800, color: theme.text, fontFamily: "'DM Sans', sans-serif", marginBottom: 4 }}>
                    {b.service}
                  </div>
                  <div style={{ fontSize: 12, color: theme.textMuted, fontFamily: "'DM Sans', sans-serif" }}>
                    #{b.bookingId}
                  </div>
                </div>
                <StatusBadge status={b.status} />
              </div>

              {/* Details grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "10px 20px", padding: "14px 0", borderTop: `1px solid ${theme.border}`, borderBottom: `1px solid ${theme.border}`, marginBottom: 14 }}>
                {[
                  ["👤 Patient",   b.patientName],
                  ["📅 Date",      b.date || "Flexible"],
                  ["📞 Phone",     b.phone],
                  ["📍 Address",   b.address || "—"],
                  ["👩‍⚕️ Nurse",    b.nurseName || "To be assigned"],
                  ["🗓️ Booked",    new Date(b.createdAt).toLocaleDateString("en-IN")],
                ].map(([label, val]) => (
                  <div key={label}>
                    <div style={{ fontSize: 11, color: theme.textMuted, fontFamily: "'DM Sans', sans-serif", marginBottom: 2 }}>{label}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: theme.text, fontFamily: "'DM Sans', sans-serif" }}>{val}</div>
                  </div>
                ))}
              </div>

              {/* Notes */}
              {b.notes && (
                <div style={{ fontSize: 13, color: theme.textMuted, fontFamily: "'DM Sans', sans-serif", fontStyle: "italic" }}>
                  📝 {b.notes}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

      </div>
    </div>
  );
}