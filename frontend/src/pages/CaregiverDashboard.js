import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { API_BASE } from "../constants";

const TABS = ["Overview","Requests","Availability","Earnings","Profile"];
const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

function StatCard({ icon, label, value, color = "#00A99D", theme }) {
  return (
    <div style={{ background: theme.bgCard, borderRadius: 16, padding: "clamp(14px,3vw,22px)", border: `1px solid ${theme.border}` }}>
      <div style={{ fontSize: "clamp(20px,3.5vw,26px)", marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: "clamp(20px,4vw,28px)", fontWeight: 900, color: theme.text, fontFamily: "'DM Sans',sans-serif" }}>{value}</div>
      <div style={{ fontSize: 12, fontWeight: 700, color: theme.textMuted, fontFamily: "'DM Sans',sans-serif", marginTop: 3 }}>{label}</div>
    </div>
  );
}

function Badge({ status }) {
  const map = { pending:"#F0A500", verified:"#00A99D", rejected:"#FF6B8A", suspended:"#6B7C93",
    accepted:"#00A99D", in_progress:"#F0A500", completed:"#00A99D", cancelled:"#FF6B8A", confirmed:"#3B82F6" };
  const color = map[status] || "#6B7C93";
  return (
    <span style={{ background: `${color}20`, color, border: `1px solid ${color}40`, borderRadius: 20,
      padding: "3px 10px", fontSize: 11, fontWeight: 700, fontFamily: "'DM Sans',sans-serif",
      textTransform: "capitalize", display: "inline-block", whiteSpace: "nowrap" }}>
      {status?.replace(/_/g, " ")}
    </span>
  );
}

export default function CaregiverDashboard() {
  const theme    = useTheme();
  const { user } = useAuth();
  const [tab, setTab]             = useState("Overview");
  const [profile, setProfile]     = useState(null);
  const [requests, setRequests]   = useState([]);
  const [earnings, setEarnings]   = useState(null);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [toast, setToast]         = useState("");
  const [avail, setAvail]         = useState({ isAvailable: true, availableDays: ["Mon","Tue","Wed","Thu","Fri"], availableHours: "9AM–6PM" });
  const [noteModal, setNoteModal] = useState(null);
  const [careNote, setCareNote]   = useState("");
  const [regForm, setRegForm]     = useState({ role: "", experience: "", bio: "", licenseNumber: "", specializations: "", languages: "", serviceAreas: "" });
  const [registering, setRegistering] = useState(false);

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const load = async () => {
    setLoading(true);
    try {
      const [pRes, rRes, eRes] = await Promise.allSettled([
        axios.get(`${API_BASE}/caregiver/profile`),
        axios.get(`${API_BASE}/caregiver/requests`),
        axios.get(`${API_BASE}/caregiver/earnings`),
      ]);
      if (pRes.status === "fulfilled") {
        setProfile(pRes.value.data);
        const d = pRes.value.data;
        setAvail({ isAvailable: d.isAvailable, availableDays: d.availableDays, availableHours: d.availableHours });
      }
      if (rRes.status === "fulfilled") setRequests(rRes.value.data.requests || []);
      if (eRes.status === "fulfilled") setEarnings(eRes.value.data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleRegister = async (e) => {
    e.preventDefault(); setRegistering(true);
    try {
      await axios.post(`${API_BASE}/caregiver/register`, {
        ...regForm,
        specializations: regForm.specializations.split(",").map(s => s.trim()).filter(Boolean),
        languages:       regForm.languages.split(",").map(s => s.trim()).filter(Boolean),
        serviceAreas:    regForm.serviceAreas.split(",").map(s => s.trim()).filter(Boolean),
      });
      showToast("✅ Profile submitted! Pending admin verification."); load();
    } catch(err) { showToast("❌ " + (err.response?.data?.error || "Failed")); }
    setRegistering(false);
  };

  const handleAvailability = async () => {
    setSaving(true);
    try { await axios.patch(`${API_BASE}/caregiver/availability`, avail); showToast("✅ Availability updated!"); }
    catch { showToast("❌ Failed to update."); }
    setSaving(false);
  };

  const handleRequestAction = async (bookingId, status, notes) => {
    try {
      await axios.patch(`${API_BASE}/caregiver/requests/${bookingId}`, { status, ...(notes ? { careNotes: notes } : {}) });
      showToast(`✅ Request ${status}`); setNoteModal(null); setCareNote(""); load();
    } catch { showToast("❌ Failed"); }
  };

  const inp = { width: "100%", padding: "12px 13px", borderRadius: 10, border: `1.5px solid ${theme.border}`,
    background: theme.bgSecondary, color: theme.text, fontSize: 16,
    fontFamily: "'DM Sans',sans-serif", outline: "none", boxSizing: "border-box",
    WebkitAppearance: "none" };
  const lbl = { display: "block", fontSize: 12, fontWeight: 700, color: theme.textMuted, marginBottom: 6, fontFamily: "'DM Sans',sans-serif" };

  if (loading) return (
    <div style={{ minHeight: "100dvh", background: theme.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        style={{ width: 40, height: 40, border: `3px solid ${theme.border}`, borderTopColor: "#00A99D", borderRadius: "50%" }} />
    </div>
  );

  return (
    <div style={{ background: theme.bg, minHeight: "100dvh" }}>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -60, opacity: 0 }}
            className="nc-toast" style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, color: theme.text }}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div style={{ background: "#0B1D3A", padding: "clamp(20px,4vw,40px) clamp(16px,4vw,40px)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg,#00A99D,#00CEC3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 900, color: "#fff", flexShrink: 0 }}>
                {user?.name?.charAt(0)}
              </div>
              <div>
                <h1 style={{ color: "#fff", fontSize: "clamp(18px,4vw,26px)", fontWeight: 900, fontFamily: "'Playfair Display',Georgia,serif", margin: 0 }}>
                  Welcome, {user?.name?.split(" ")[0]} 👋
                </h1>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, margin: 0, fontFamily: "'DM Sans',sans-serif" }}>Caregiver Dashboard</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {profile && <Badge status={profile.status} />}
              {profile && (
                <span style={{ background: profile.isAvailable ? "rgba(0,169,157,0.2)" : "rgba(255,107,138,0.2)", color: profile.isAvailable ? "#00CEC3" : "#FF6B8A", border: `1px solid ${profile.isAvailable ? "rgba(0,169,157,0.4)" : "rgba(255,107,138,0.4)"}`, borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>
                  {profile.isAvailable ? "🟢 Available" : "🔴 Busy"}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs — horizontal scroll on mobile */}
      <div style={{ background: theme.bgCard, borderBottom: `1px solid ${theme.border}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="nc-tab-bar" style={{ padding: "0 clamp(12px,3vw,40px)" }}>
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)}
                style={{ padding: "14px clamp(12px,2vw,20px)", background: "none", border: "none",
                  borderBottom: `3px solid ${tab === t ? "#00A99D" : "transparent"}`,
                  color: tab === t ? "#00A99D" : theme.textMuted,
                  fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
                  whiteSpace: "nowrap", flexShrink: 0, transition: "all 0.2s" }}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(16px,3vw,32px) clamp(16px,4vw,40px)" }}>

        {/* No profile prompt */}
        {!profile && tab !== "Profile" && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: theme.bgCard, borderRadius: 20, padding: "clamp(28px,5vw,48px)", textAlign: "center", border: `1px solid ${theme.border}` }}>
            <div style={{ fontSize: 56 }}>📋</div>
            <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", color: theme.text, fontSize: "clamp(20px,4vw,28px)", margin: "14px 0 10px" }}>Complete Your Profile</h2>
            <p style={{ color: theme.textMuted, fontFamily: "'DM Sans',sans-serif", marginBottom: 22, fontSize: 14, lineHeight: 1.6 }}>Submit your details for admin verification to start accepting bookings.</p>
            <button onClick={() => setTab("Profile")}
              style={{ background: "#00A99D", color: "#fff", border: "none", borderRadius: 12, padding: "13px 26px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
              Complete Profile →
            </button>
          </motion.div>
        )}

        {/* ─── OVERVIEW ─── */}
        {tab === "Overview" && profile && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="nc-stats-row" style={{ marginBottom: 24 }}>
              <StatCard icon="📋" label="Total Requests"  value={requests.length}                                     theme={theme} />
              <StatCard icon="✅" label="Completed"       value={requests.filter(r => r.status === "completed").length} color="#00A99D" theme={theme} />
              <StatCard icon="⏳" label="Pending"         value={requests.filter(r => r.status === "confirmed").length} color="#F0A500" theme={theme} />
              <StatCard icon="💰" label="Earnings"        value={`₹${(earnings?.totalEarnings || 0).toLocaleString()}`} color="#00A99D" theme={theme} />
              <StatCard icon="⭐" label="Rating"          value={profile.rating ? profile.rating.toFixed(1) : "New"}  color="#F0A500" theme={theme} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))", gap: 16 }}>
              <div style={{ background: theme.bgCard, borderRadius: 18, border: `1px solid ${theme.border}`, overflow: "hidden" }}>
                <div style={{ padding: "16px 18px", borderBottom: `1px solid ${theme.border}` }}>
                  <h3 style={{ color: theme.text, fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 800, margin: 0 }}>🔔 Recent Requests</h3>
                </div>
                {requests.slice(0, 4).length === 0 ? (
                  <p style={{ padding: "18px", color: theme.textMuted, fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>No requests yet.</p>
                ) : requests.slice(0, 4).map(r => (
                  <div key={r._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 18px", borderBottom: `1px solid ${theme.border}`, gap: 8 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: theme.text, fontFamily: "'DM Sans',sans-serif" }}>{r.patientName}</div>
                      <div style={{ fontSize: 12, color: theme.textMuted, fontFamily: "'DM Sans',sans-serif" }}>{r.service}</div>
                    </div>
                    <Badge status={r.status} />
                  </div>
                ))}
              </div>

              <div style={{ background: theme.bgCard, borderRadius: 18, border: `1px solid ${theme.border}`, overflow: "hidden" }}>
                <div style={{ padding: "16px 18px", borderBottom: `1px solid ${theme.border}` }}>
                  <h3 style={{ color: theme.text, fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 800, margin: 0 }}>👤 Profile Summary</h3>
                </div>
                {[["Role", profile.role], ["Experience", profile.experience], ["Areas", profile.serviceAreas?.join(", ") || "—"], ["Status", profile.status]].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 18px", borderBottom: `1px solid ${theme.border}`, gap: 8 }}>
                    <span style={{ fontSize: 13, color: theme.textMuted, fontFamily: "'DM Sans',sans-serif" }}>{k}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: theme.text, fontFamily: "'DM Sans',sans-serif", textAlign: "right" }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── REQUESTS ─── */}
        {tab === "Requests" && profile && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 style={{ color: theme.text, fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(18px,3vw,22px)", marginBottom: 18 }}>Service Requests</h2>
            {requests.length === 0 ? (
              <div style={{ background: theme.bgCard, borderRadius: 20, padding: 48, textAlign: "center", border: `1px solid ${theme.border}` }}>
                <div style={{ fontSize: 48 }}>📭</div>
                <p style={{ color: theme.textMuted, fontFamily: "'DM Sans',sans-serif", marginTop: 14 }}>No requests assigned yet.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {requests.map(r => (
                  <motion.div key={r._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    style={{ background: theme.bgCard, borderRadius: 18, padding: "clamp(16px,3vw,22px)", border: `1px solid ${theme.border}` }}>
                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 10, marginBottom: 14 }}>
                      <div>
                        <h3 style={{ color: theme.text, fontFamily: "'DM Sans',sans-serif", fontSize: "clamp(15px,2.5vw,18px)", fontWeight: 800, margin: "0 0 4px" }}>{r.patientName}</h3>
                        <p style={{ color: theme.textMuted, fontSize: 13, margin: 0, fontFamily: "'DM Sans',sans-serif" }}>{r.service} • {r.date || "ASAP"}</p>
                        <p style={{ color: theme.textMuted, fontSize: 13, margin: "3px 0 0", fontFamily: "'DM Sans',sans-serif" }}>📞 {r.phone}{r.address ? ` • ${r.address}` : ""}</p>
                        {r.notes     && <p style={{ color: "#F0A500", fontSize: 12, margin: "5px 0 0", fontFamily: "'DM Sans',sans-serif" }}>📝 {r.notes}</p>}
                        {r.careNotes && <p style={{ color: "#00A99D",  fontSize: 12, margin: "4px 0 0", fontFamily: "'DM Sans',sans-serif" }}>🩺 {r.careNotes}</p>}
                      </div>
                      <Badge status={r.status} />
                    </div>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      {r.status === "confirmed" && <>
                        <button onClick={() => handleRequestAction(r.bookingId, "accepted")} style={{ flex: 1, minWidth: 100, background: "#00A99D", color: "#fff", border: "none", borderRadius: 10, padding: "10px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>✅ Accept</button>
                        <button onClick={() => handleRequestAction(r.bookingId, "rejected")} style={{ flex: 1, minWidth: 100, background: "rgba(255,107,138,0.1)", color: "#FF6B8A", border: "1px solid rgba(255,107,138,0.3)", borderRadius: 10, padding: "10px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>❌ Reject</button>
                      </>}
                      {r.status === "accepted" && <button onClick={() => handleRequestAction(r.bookingId, "in_progress")} style={{ flex: 1, minWidth: 120, background: "#F0A500", color: "#fff", border: "none", borderRadius: 10, padding: "10px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>▶️ Start Service</button>}
                      {r.status === "in_progress" && <button onClick={() => setNoteModal(r)} style={{ flex: 1, minWidth: 120, background: "#00A99D", color: "#fff", border: "none", borderRadius: 10, padding: "10px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>✅ Mark Complete</button>}
                      <button onClick={() => setNoteModal({ ...r, noteOnly: true })} style={{ background: "none", color: theme.textMuted, border: `1px solid ${theme.border}`, borderRadius: 10, padding: "10px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>📝 Notes</button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ─── AVAILABILITY ─── */}
        {tab === "Availability" && profile && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 style={{ color: theme.text, fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(18px,3vw,22px)", marginBottom: 18 }}>Manage Availability</h2>
            <div style={{ background: theme.bgCard, borderRadius: 20, padding: "clamp(20px,4vw,32px)", border: `1px solid ${theme.border}`, maxWidth: 560 }}>

              {/* Toggle */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22, padding: "14px 18px", background: avail.isAvailable ? "rgba(0,169,157,0.08)" : "rgba(255,107,138,0.08)", borderRadius: 13 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: theme.text, fontFamily: "'DM Sans',sans-serif" }}>{avail.isAvailable ? "🟢 Available" : "🔴 Unavailable"}</div>
                  <div style={{ fontSize: 12, color: theme.textMuted, fontFamily: "'DM Sans',sans-serif" }}>Toggle your live status</div>
                </div>
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => setAvail(a => ({ ...a, isAvailable: !a.isAvailable }))}
                  style={{ width: 50, height: 27, borderRadius: 14, border: "none", cursor: "pointer", background: avail.isAvailable ? "#00A99D" : "#6B7C93", position: "relative", transition: "background 0.25s", flexShrink: 0 }}>
                  <motion.div animate={{ x: avail.isAvailable ? 25 : 3 }} transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    style={{ position: "absolute", top: 4, width: 19, height: 19, borderRadius: "50%", background: "#fff" }} />
                </motion.button>
              </div>

              {/* Days */}
              <div style={{ marginBottom: 18 }}>
                <label style={lbl}>Available Days</label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {DAYS.map(d => (
                    <button key={d} onClick={() => setAvail(a => ({ ...a, availableDays: a.availableDays.includes(d) ? a.availableDays.filter(x => x !== d) : [...a.availableDays, d] }))}
                      style={{ padding: "9px 14px", borderRadius: 10, border: `1.5px solid ${avail.availableDays.includes(d) ? "#00A99D" : theme.border}`, background: avail.availableDays.includes(d) ? "rgba(0,169,157,0.12)" : theme.bgSecondary, color: avail.availableDays.includes(d) ? "#00A99D" : theme.textMuted, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "all 0.2s", minHeight: 44 }}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hours */}
              <div style={{ marginBottom: 22 }}>
                <label style={lbl}>Working Hours</label>
                <input value={avail.availableHours} onChange={e => setAvail(a => ({ ...a, availableHours: e.target.value }))} placeholder="e.g. 9AM–6PM" style={inp} />
              </div>

              <button disabled={saving} onClick={handleAvailability}
                style={{ width: "100%", background: saving ? "#6B7C93" : "#00A99D", color: "#fff", border: "none", borderRadius: 12, padding: "14px", fontSize: 15, fontWeight: 800, cursor: saving ? "not-allowed" : "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                {saving ? "Saving…" : "Save Availability"}
              </button>
            </div>
          </motion.div>
        )}

        {/* ─── EARNINGS ─── */}
        {tab === "Earnings" && profile && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 style={{ color: theme.text, fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(18px,3vw,22px)", marginBottom: 18 }}>Earnings & Work History</h2>
            <div className="nc-stats-row" style={{ marginBottom: 24 }}>
              <StatCard icon="💰" label="Total Earned"   value={`₹${(earnings?.totalEarnings || 0).toLocaleString()}`} color="#00A99D" theme={theme} />
              <StatCard icon="✅" label="Jobs Completed" value={earnings?.totalJobs || 0}                               color="#00A99D" theme={theme} />
              <StatCard icon="⭐" label="Rating"         value={profile.rating ? profile.rating.toFixed(1) : "—"}      color="#F0A500" theme={theme} />
            </div>

            <div style={{ background: theme.bgCard, borderRadius: 18, border: `1px solid ${theme.border}`, overflow: "hidden" }}>
              <div style={{ padding: "16px 18px", borderBottom: `1px solid ${theme.border}` }}>
                <h3 style={{ color: theme.text, fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 800, margin: 0 }}>Completed Jobs</h3>
              </div>
              {(earnings?.completedJobs || []).length === 0 ? (
                <div style={{ padding: 40, textAlign: "center" }}>
                  <div style={{ fontSize: 40 }}>💼</div>
                  <p style={{ color: theme.textMuted, fontFamily: "'DM Sans',sans-serif", marginTop: 12 }}>No completed jobs yet.</p>
                </div>
              ) : (earnings?.completedJobs || []).map((j, i) => (
                <div key={j._id} style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", borderBottom: i < earnings.completedJobs.length - 1 ? `1px solid ${theme.border}` : "none", gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: theme.text, fontFamily: "'DM Sans',sans-serif" }}>{j.patientName}</div>
                    <div style={{ fontSize: 12, color: theme.textMuted, fontFamily: "'DM Sans',sans-serif" }}>{j.service} • {new Date(j.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: "#00A99D", fontFamily: "'DM Sans',sans-serif" }}>₹{(j.earnings || 999).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ─── PROFILE ─── */}
        {tab === "Profile" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 style={{ color: theme.text, fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(18px,3vw,22px)", marginBottom: 18 }}>
              {profile ? "Your Profile" : "Complete Registration"}
            </h2>
            {profile ? (
              <div style={{ background: theme.bgCard, borderRadius: 18, border: `1px solid ${theme.border}`, overflow: "hidden", maxWidth: 600 }}>
                {[["Full Name",profile.name],["Email",profile.email],["Phone",profile.phone],["Role",profile.role],["Experience",profile.experience],["License",profile.licenseNumber],["Specializations",profile.specializations?.join(", ")],["Languages",profile.languages?.join(", ")],["Service Areas",profile.serviceAreas?.join(", ")],["Status",profile.status],["Verification Note",profile.verificationNote||"—"]].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "12px 18px", borderBottom: `1px solid ${theme.border}`, gap: 16, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13, color: theme.textMuted, fontFamily: "'DM Sans',sans-serif" }}>{k}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: theme.text, fontFamily: "'DM Sans',sans-serif", textAlign: "right", wordBreak: "break-word" }}>{v || "—"}</span>
                  </div>
                ))}
                {profile.bio && <p style={{ margin: "0", padding: "16px 18px", color: theme.textMuted, fontFamily: "'DM Sans',sans-serif", fontSize: 14, lineHeight: 1.7 }}>{profile.bio}</p>}
              </div>
            ) : (
              <div style={{ background: theme.bgCard, borderRadius: 18, padding: "clamp(20px,4vw,32px)", border: `1px solid ${theme.border}`, maxWidth: 600 }}>
                <p style={{ color: theme.textMuted, fontFamily: "'DM Sans',sans-serif", marginBottom: 22, lineHeight: 1.7, fontSize: 14 }}>
                  Fill in your professional details. Admin will review and verify your profile before you can accept bookings.
                </p>
                <form onSubmit={handleRegister}>
                  {[["Role / Designation","text","role","e.g. Registered Nurse"],["Experience","text","experience","e.g. 5 years"],["License Number","text","licenseNumber","Nursing license number"]].map(([l, t, k, p]) => (
                    <div key={k} style={{ marginBottom: 14 }}>
                      <label style={lbl}>{l}</label>
                      <input type={t} placeholder={p} required value={regForm[k]} onChange={e => setRegForm(f => ({ ...f, [k]: e.target.value }))} style={inp} />
                    </div>
                  ))}
                  {[["Specializations (comma-separated)","specializations","Post-Surgery, Elderly Care"],["Languages","languages","Hindi, English"],["Service Areas","serviceAreas","Mumbai, Thane"]].map(([l, k, p]) => (
                    <div key={k} style={{ marginBottom: 14 }}>
                      <label style={lbl}>{l}</label>
                      <input type="text" placeholder={p} value={regForm[k]} onChange={e => setRegForm(f => ({ ...f, [k]: e.target.value }))} style={inp} />
                    </div>
                  ))}
                  <div style={{ marginBottom: 22 }}>
                    <label style={lbl}>Bio / About You</label>
                    <textarea placeholder="Describe your experience and approach to patient care..." rows={4}
                      value={regForm.bio} onChange={e => setRegForm(f => ({ ...f, bio: e.target.value }))}
                      style={{ ...inp, resize: "vertical", minHeight: 100 }} />
                  </div>
                  <button type="submit" disabled={registering}
                    style={{ width: "100%", background: "#00A99D", color: "#fff", border: "none", borderRadius: 12, padding: "15px", fontSize: 16, fontWeight: 800, cursor: registering ? "not-allowed" : "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                    {registering ? "Submitting…" : "Submit for Verification →"}
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* ─── Care Notes Modal — bottom sheet on mobile ─── */}
      <AnimatePresence>
        {noteModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setNoteModal(null)}
            className="nc-modal-backdrop">
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              className="nc-modal"
              style={{ background: theme.bgCard, border: `1px solid ${theme.border}` }}>
              <h3 style={{ color: theme.text, fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(18px,4vw,22px)", marginBottom: 6 }}>
                {noteModal.noteOnly ? "Update Care Notes" : "Complete & Add Notes"}
              </h3>
              <p style={{ color: theme.textMuted, fontFamily: "'DM Sans',sans-serif", fontSize: 14, marginBottom: 18 }}>
                Patient: <strong style={{ color: theme.text }}>{noteModal.patientName}</strong>
              </p>
              <textarea placeholder="Add care notes, observations, medications given..." rows={5}
                value={careNote} onChange={e => setCareNote(e.target.value)}
                style={{ ...inp, resize: "vertical", marginBottom: 16, minHeight: 100 }} />
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {!noteModal.noteOnly && (
                  <button onClick={() => handleRequestAction(noteModal.bookingId, "completed", careNote)}
                    style={{ flex: 1, minWidth: 120, background: "#00A99D", color: "#fff", border: "none", borderRadius: 11, padding: "13px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                    ✅ Complete Job
                  </button>
                )}
                {noteModal.noteOnly && (
                  <button onClick={() => handleRequestAction(noteModal.bookingId, noteModal.status, careNote)}
                    style={{ flex: 1, minWidth: 100, background: "#00A99D", color: "#fff", border: "none", borderRadius: 11, padding: "13px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                    Save Notes
                  </button>
                )}
                <button onClick={() => setNoteModal(null)}
                  style={{ padding: "13px 18px", background: theme.bgSecondary, color: theme.textMuted, border: `1px solid ${theme.border}`, borderRadius: 11, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}