import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { COLORS, API_BASE, fadeUp, stagger } from "../constants";
import { useApp } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

/* ── Avatar initials fallback ─────────────────────────── */
function Avatar({ name, size = 80 }) {
  const initials = name
    ? name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()
    : "?";
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: "linear-gradient(135deg,#00A99D,#00CEC3)",
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontWeight: 900,
      fontSize: size * 0.35,
      fontFamily: "'DM Sans', sans-serif",
      flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

/* ── Availability badge ───────────────────────────────── */
function AvailBadge({ isAvailable, hours, theme }) {
  return (
    <div style={{
      background: isAvailable
        ? (theme.isDark ? "rgba(39,103,73,0.3)" : "#F0FFF4")
        : (theme.isDark ? "rgba(116,66,16,0.3)" : "#FFFBEB"),
      color: isAvailable ? "#48BB78" : "#F0A500",
      borderRadius: 8, padding: "6px 12px",
      fontSize: 12, fontWeight: 700, textAlign: "center",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {isAvailable ? "🟢" : "🟡"} {isAvailable ? (hours || "Available") : "Busy"}
    </div>
  );
}

/* ─────────────────────────────────────────────────────── */
export default function CaregiversPage() {
  const { id } = useParams();
  const { caregivers, fetchCaregivers } = useApp();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const theme    = useTheme();

  // For direct-booking from profile page
  const [booking, setBooking] = useState({ open: false, cg: null, sent: false, loading: false, error: "" });

  useEffect(() => { fetchCaregivers(); }, [fetchCaregivers]);

  /* ── Find the right caregiver by _id ── */
  const caregiver = (id && caregivers?.length)
    ? caregivers.find(c => String(c._id) === String(id) || String(c.id) === String(id))
    : null;

  /* ── Book directly ── */
  const handleBook = async (cg) => {
    if (!isLoggedIn) { navigate("/login"); return; }
    setBooking({ open: true, cg, sent: false, loading: false, error: "" });
  };

  const submitBooking = async () => {
    const cg = booking.cg;
    setBooking(b => ({ ...b, loading: true, error: "" }));
    try {
      await axios.post(`${API_BASE}/bookings`, {
        patientName: "Self",
        service: cg.specializations?.[0] || cg.role || "Home Care",
        phone: "—",
        nurseId: cg.caregiverId,
        nurseName: cg.name,
        notes: `Requested caregiver: ${cg.name}`,
      });
      setBooking(b => ({ ...b, sent: true, loading: false }));
    } catch (err) {
      setBooking(b => ({ ...b, loading: false, error: err.response?.data?.error || "Booking failed." }));
    }
  };

  /* ══════════════════════════════════════════════════
     DETAIL VIEW — single caregiver profile
  ══════════════════════════════════════════════════ */
  if (id) {
    if (!caregiver && caregivers?.length > 0) {
      return (
        <div style={{ background: theme.bg, minHeight: "100vh", paddingTop: 140, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>😕</div>
          <h2 style={{ color: theme.text, fontFamily: "'Playfair Display',serif" }}>Caregiver not found</h2>
          <button onClick={() => navigate("/caregivers")}
            style={{ marginTop: 20, background: COLORS.teal, color: "#fff", border: "none", borderRadius: 12, padding: "12px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
            ← Back to Caregivers
          </button>
        </div>
      );
    }

    if (!caregiver) return (
      <div style={{ background: theme.bg, minHeight: "100vh", paddingTop: 140, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 36, height: 36, border: "3px solid rgba(0,169,157,0.2)", borderTopColor: COLORS.teal, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );

    return (
      <div style={{ background: theme.bg, minHeight: "100vh", paddingTop: 100, transition: "background 0.3s" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px clamp(16px,4vw,24px)" }}>

          {/* Back button */}
          <motion.button initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate("/caregivers")}
            style={{ background: "none", border: "none", color: COLORS.teal, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", marginBottom: 28, display: "flex", alignItems: "center", gap: 6 }}>
            ← Back to Caregivers
          </motion.button>

          {/* Profile card */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: theme.bgCard, borderRadius: 28, padding: "clamp(24px,4vw,40px)", border: `1px solid ${theme.border}`, display: "grid", gridTemplateColumns: "clamp(140px,28%,200px) 1fr", gap: "clamp(20px,4vw,40px)", transition: "background 0.3s" }}>

            {/* Left — avatar + meta */}
            <div style={{ textAlign: "center" }}>
              <div style={{ margin: "0 auto 16px", width: "fit-content" }}>
                <Avatar name={caregiver.name} size={130} />
              </div>
              {/* Verified badge */}
              {caregiver.status === "verified" && (
                <div style={{ background: "rgba(0,169,157,0.15)", color: COLORS.teal, fontSize: 11, fontWeight: 700, borderRadius: 20, padding: "4px 12px", display: "inline-block", fontFamily: "'DM Sans',sans-serif", marginBottom: 12 }}>
                  ✅ Verified
                </div>
              )}
              <div style={{ fontSize: 18, fontWeight: 800, color: theme.text, fontFamily: "'DM Sans',sans-serif" }}>{caregiver.name}</div>
              <div style={{ color: COLORS.teal, fontSize: 14, fontFamily: "'DM Sans',sans-serif", marginTop: 4 }}>{caregiver.role}</div>
              <div style={{ color: theme.textMuted, fontSize: 13, fontFamily: "'DM Sans',sans-serif", marginTop: 4 }}>
                {caregiver.experience ? `${caregiver.experience} experience` : ""}
              </div>
              {caregiver.rating > 0 && (
                <>
                  <div style={{ margin: "10px 0 4px", fontSize: 16 }}>{"⭐".repeat(Math.round(caregiver.rating))}</div>
                  <div style={{ fontSize: 13, color: theme.textMuted, fontFamily: "'DM Sans',sans-serif" }}>
                    {caregiver.rating} ({caregiver.reviews} reviews)
                  </div>
                </>
              )}
              <div style={{ marginTop: 16 }}>
                <AvailBadge isAvailable={caregiver.isAvailable} hours={caregiver.availableHours} theme={theme} />
              </div>
              {caregiver.availableDays?.length > 0 && (
                <div style={{ marginTop: 8, fontSize: 12, color: theme.textMuted, fontFamily: "'DM Sans',sans-serif" }}>
                  {caregiver.availableDays.join(" · ")}
                </div>
              )}
            </div>

            {/* Right — details */}
            <div>
              <h2 style={{ fontSize: "clamp(20px,4vw,30px)", fontWeight: 900, color: theme.text, fontFamily: "'Playfair Display',Georgia,serif", margin: "0 0 12px" }}>
                About {caregiver.name}
              </h2>
              <p style={{ fontSize: 15, color: theme.textMuted, lineHeight: 1.75, fontFamily: "'DM Sans',sans-serif", marginBottom: 24 }}>
                {caregiver.bio || `${caregiver.name} is a verified ${caregiver.role} on NurtureCare with ${caregiver.experience || "professional"} experience in home nursing care.`}
              </p>

              {caregiver.specializations?.length > 0 && (
                <>
                  <h4 style={{ fontSize: 15, fontWeight: 800, color: theme.text, fontFamily: "'DM Sans',sans-serif", marginBottom: 10 }}>Specializations</h4>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
                    {caregiver.specializations.map(s => (
                      <span key={s} style={{ background: theme.isDark ? "rgba(0,169,157,0.15)" : "#E8F6FF", color: COLORS.teal, borderRadius: 20, padding: "5px 14px", fontSize: 13, fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>{s}</span>
                    ))}
                  </div>
                </>
              )}

              {caregiver.languages?.length > 0 && (
                <>
                  <h4 style={{ fontSize: 15, fontWeight: 800, color: theme.text, fontFamily: "'DM Sans',sans-serif", marginBottom: 10 }}>Languages</h4>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
                    {caregiver.languages.map(l => (
                      <span key={l} style={{ background: theme.bgSecondary, color: theme.textMuted, borderRadius: 20, padding: "5px 14px", fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans',sans-serif" }}>{l}</span>
                    ))}
                  </div>
                </>
              )}

              {caregiver.serviceAreas?.length > 0 && (
                <>
                  <h4 style={{ fontSize: 15, fontWeight: 800, color: theme.text, fontFamily: "'DM Sans',sans-serif", marginBottom: 10 }}>Service Areas</h4>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
                    {caregiver.serviceAreas.map(a => (
                      <span key={a} style={{ background: theme.bgSecondary, color: theme.textMuted, borderRadius: 20, padding: "5px 14px", fontSize: 13, fontFamily: "'DM Sans',sans-serif" }}>📍 {a}</span>
                    ))}
                  </div>
                </>
              )}

              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                onClick={() => handleBook(caregiver)}
                style={{ background: COLORS.teal, color: "#fff", border: "none", borderRadius: 12, padding: "15px 36px", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", boxShadow: "0 8px 24px rgba(0,169,157,0.3)" }}>
                Book {caregiver.name?.split(" ")[0]} Now
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Booking confirm modal */}
        {booking.open && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
            onClick={() => !booking.loading && setBooking(b => ({ ...b, open: false }))}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              onClick={e => e.stopPropagation()}
              style={{ background: theme.bgCard, borderRadius: 24, padding: "clamp(24px,5vw,40px)", maxWidth: 460, width: "100%", border: `1px solid ${theme.border}` }}>
              {booking.sent ? (
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                  <h3 style={{ color: theme.text, fontFamily: "'Playfair Display',serif", marginBottom: 8 }}>Booking Requested!</h3>
                  <p style={{ color: theme.textMuted, fontFamily: "'DM Sans',sans-serif", fontSize: 14 }}>
                    Your request for {booking.cg?.name} has been sent. We'll confirm shortly.
                  </p>
                  <button onClick={() => { setBooking(b => ({ ...b, open: false })); navigate("/my-bookings"); }}
                    style={{ marginTop: 20, background: COLORS.teal, color: "#fff", border: "none", borderRadius: 12, padding: "12px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                    View My Bookings →
                  </button>
                </div>
              ) : (
                <>
                  <h3 style={{ color: theme.text, fontFamily: "'Playfair Display',serif", margin: "0 0 8px", fontSize: 22 }}>Confirm Booking</h3>
                  <p style={{ color: theme.textMuted, fontFamily: "'DM Sans',sans-serif", fontSize: 14, marginBottom: 20 }}>
                    You're about to request <strong style={{ color: theme.text }}>{booking.cg?.name}</strong> ({booking.cg?.role}).
                  </p>
                  {booking.error && (
                    <div style={{ background: "rgba(255,107,138,0.1)", border: "1px solid rgba(255,107,138,0.3)", borderRadius: 10, padding: "10px 14px", color: "#FF6B8A", fontSize: 13, fontFamily: "'DM Sans',sans-serif", marginBottom: 16 }}>
                      ⚠️ {booking.error}
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={() => setBooking(b => ({ ...b, open: false }))}
                      style={{ flex: 1, padding: "13px", borderRadius: 12, background: theme.bgSecondary, border: `1px solid ${theme.border}`, color: theme.textMuted, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                      Cancel
                    </button>
                    <button onClick={submitBooking} disabled={booking.loading}
                      style={{ flex: 1, padding: "13px", borderRadius: 12, background: COLORS.teal, border: "none", color: "#fff", fontSize: 14, fontWeight: 700, cursor: booking.loading ? "not-allowed" : "pointer", fontFamily: "'DM Sans',sans-serif", opacity: booking.loading ? 0.7 : 1 }}>
                      {booking.loading ? "Booking…" : "Confirm →"}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </div>
    );
  }

  /* ══════════════════════════════════════════════════
     LIST VIEW — all caregivers
  ══════════════════════════════════════════════════ */
  return (
    <div style={{ background: theme.bg, minHeight: "100vh", paddingTop: 100, transition: "background 0.3s" }}>

      {/* Header */}
      <div style={{ background: COLORS.navy, padding: "clamp(48px,8vw,80px) clamp(20px,5vw,48px) clamp(60px,10vw,96px)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: "clamp(32px,6vw,56px)", fontWeight: 900, color: COLORS.white, fontFamily: "'Playfair Display',Georgia,serif", margin: "0 0 16px" }}>
            Our Caregivers
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ fontSize: "clamp(14px,2vw,18px)", color: "rgba(255,255,255,0.65)", fontFamily: "'DM Sans',sans-serif" }}>
            Every nurse is background-verified, licensed, and deeply trained in patient care.
          </motion.p>
        </div>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: 1200, margin: "-32px auto 0", padding: "0 clamp(16px,4vw,24px) 96px" }}>
        {caregivers?.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0", color: theme.textMuted, fontFamily: "'DM Sans',sans-serif" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>👩‍⚕️</div>
            No verified caregivers yet. Check back soon!
          </div>
        )}
        <motion.div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24 }}
          initial="hidden" animate="show" variants={stagger}>
          {caregivers?.map((cg, i) => (
            <motion.div key={cg._id || cg.id || i} variants={fadeUp}
              whileHover={{ y: -8, boxShadow: theme.shadowLg }}
              style={{ background: theme.bgCard, borderRadius: 20, padding: 24, border: `1px solid ${theme.border}`, transition: "background 0.3s", display: "flex", flexDirection: "column" }}>

              {/* Avatar */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 16 }}>
                <Avatar name={cg.name} size={80} />
                {cg.status === "verified" && (
                  <span style={{ marginTop: 8, background: "rgba(0,169,157,0.12)", color: COLORS.teal, fontSize: 10, fontWeight: 700, borderRadius: 20, padding: "3px 10px", fontFamily: "'DM Sans',sans-serif" }}>✅ Verified</span>
                )}
              </div>

              <h3 style={{ fontSize: 17, fontWeight: 800, color: theme.text, margin: "0 0 4px", textAlign: "center", fontFamily: "'DM Sans',sans-serif" }}>{cg.name}</h3>
              <p style={{ fontSize: 13, color: COLORS.teal, fontWeight: 600, margin: "0 0 4px", textAlign: "center", fontFamily: "'DM Sans',sans-serif" }}>{cg.role}</p>
              {cg.experience && (
                <p style={{ fontSize: 12, color: theme.textMuted, margin: "0 0 10px", textAlign: "center", fontFamily: "'DM Sans',sans-serif" }}>{cg.experience} experience</p>
              )}
              {cg.rating > 0 && (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 6, marginBottom: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: theme.text, fontFamily: "'DM Sans',sans-serif" }}>⭐ {cg.rating}</span>
                  <span style={{ fontSize: 12, color: theme.textMuted, fontFamily: "'DM Sans',sans-serif" }}>({cg.reviews})</span>
                </div>
              )}

              <div style={{ marginBottom: 16 }}>
                <AvailBadge isAvailable={cg.isAvailable} hours={cg.availableHours} theme={theme} />
              </div>

              {/* Specialization pills */}
              {cg.specializations?.length > 0 && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center", marginBottom: 16 }}>
                  {cg.specializations.slice(0, 2).map(s => (
                    <span key={s} style={{ background: theme.isDark ? "rgba(0,169,157,0.12)" : "#E8F6FF", color: COLORS.teal, borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>{s}</span>
                  ))}
                  {cg.specializations.length > 2 && (
                    <span style={{ color: theme.textMuted, fontSize: 11, fontFamily: "'DM Sans',sans-serif", padding: "3px 6px" }}>+{cg.specializations.length - 2}</span>
                  )}
                </div>
              )}

              <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
                <motion.button whileHover={{ opacity: 0.85 }}
                  onClick={() => navigate(`/caregivers/${cg._id || cg.id}`)}
                  style={{ flex: 1, background: COLORS.navy, color: COLORS.white, border: "none", borderRadius: 10, padding: "10px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                  View Profile
                </motion.button>
                <motion.button whileHover={{ opacity: 0.85 }}
                  onClick={() => handleBook(cg)}
                  style={{ flex: 1, background: COLORS.teal, color: COLORS.white, border: "none", borderRadius: 10, padding: "10px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                  Book Now
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Booking modal for list view */}
      {booking.open && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
          onClick={() => !booking.loading && setBooking(b => ({ ...b, open: false }))}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            onClick={e => e.stopPropagation()}
            style={{ background: theme.bgCard, borderRadius: 24, padding: "clamp(24px,5vw,40px)", maxWidth: 460, width: "100%", border: `1px solid ${theme.border}` }}>
            {booking.sent ? (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <h3 style={{ color: theme.text, fontFamily: "'Playfair Display',serif", marginBottom: 8 }}>Booking Requested!</h3>
                <p style={{ color: theme.textMuted, fontFamily: "'DM Sans',sans-serif", fontSize: 14 }}>Your request has been sent. We'll confirm shortly.</p>
                <button onClick={() => { setBooking(b => ({ ...b, open: false })); navigate("/my-bookings"); }}
                  style={{ marginTop: 20, background: COLORS.teal, color: "#fff", border: "none", borderRadius: 12, padding: "12px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                  View My Bookings →
                </button>
              </div>
            ) : (
              <>
                <h3 style={{ color: theme.text, fontFamily: "'Playfair Display',serif", margin: "0 0 8px", fontSize: 22 }}>Confirm Booking</h3>
                <p style={{ color: theme.textMuted, fontFamily: "'DM Sans',sans-serif", fontSize: 14, marginBottom: 20 }}>
                  Book <strong style={{ color: theme.text }}>{booking.cg?.name}</strong> — {booking.cg?.role}
                </p>
                {booking.error && (
                  <div style={{ background: "rgba(255,107,138,0.1)", border: "1px solid rgba(255,107,138,0.3)", borderRadius: 10, padding: "10px 14px", color: "#FF6B8A", fontSize: 13, marginBottom: 16, fontFamily: "'DM Sans',sans-serif" }}>
                    ⚠️ {booking.error}
                  </div>
                )}
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setBooking(b => ({ ...b, open: false }))}
                    style={{ flex: 1, padding: "13px", borderRadius: 12, background: theme.bgSecondary, border: `1px solid ${theme.border}`, color: theme.textMuted, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                    Cancel
                  </button>
                  <button onClick={submitBooking} disabled={booking.loading}
                    style={{ flex: 1, padding: "13px", borderRadius: 12, background: COLORS.teal, border: "none", color: "#fff", fontSize: 14, fontWeight: 700, cursor: booking.loading ? "not-allowed" : "pointer", fontFamily: "'DM Sans',sans-serif", opacity: booking.loading ? 0.7 : 1 }}>
                    {booking.loading ? "Booking…" : "Confirm →"}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}