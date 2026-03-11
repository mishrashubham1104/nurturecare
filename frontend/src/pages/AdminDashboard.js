import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { API_BASE } from "../constants";

const TABS = ["Analytics","Caregivers","Users","Bookings","Complaints","Messages"];

function StatCard({ icon, label, value, sub, color = "#00A99D", theme }) {
  return (
    <motion.div whileHover={{ y: -3 }}
      style={{ background: theme.bgCard, borderRadius: 18, padding: "clamp(14px,3vw,22px)", border: `1px solid ${theme.border}` }}>
      <div style={{ width: 42, height: 42, borderRadius: 12, background: `${color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontSize: "clamp(20px,4vw,28px)", fontWeight: 900, color: theme.text, fontFamily: "'DM Sans',sans-serif" }}>{value}</div>
      <div style={{ fontSize: 12, fontWeight: 700, color: theme.textMuted, fontFamily: "'DM Sans',sans-serif", marginTop: 2 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color, fontWeight: 700, marginTop: 4, fontFamily: "'DM Sans',sans-serif" }}>{sub}</div>}
    </motion.div>
  );
}

function Badge({ status }) {
  const map = { pending:"#F0A500", verified:"#00A99D", rejected:"#FF6B8A", suspended:"#6B7C93",
    open:"#FF6B8A", resolved:"#00A99D", confirmed:"#3B82F6", completed:"#00A99D",
    cancelled:"#FF6B8A", in_progress:"#F0A500", patient:"#3B82F6", caregiver:"#00A99D", admin:"#F0A500" };
  const color = map[status] || "#6B7C93";
  return (
    <span style={{ background: `${color}20`, color, border: `1px solid ${color}40`, borderRadius: 20,
      padding: "3px 10px", fontSize: 11, fontWeight: 700, fontFamily: "'DM Sans',sans-serif",
      textTransform: "capitalize", whiteSpace: "nowrap", display: "inline-block" }}>
      {status?.replace(/_/g, " ")}
    </span>
  );
}

// Mobile card — replaces table row on small screens
function DataCard({ children, theme, accent }) {
  return (
    <div style={{ background: theme.bgCard, borderRadius: 14, padding: "14px 16px",
      border: `1px solid ${accent || theme.border}`, marginBottom: 10 }}>
      {children}
    </div>
  );
}

export default function AdminDashboard() {
  const theme    = useTheme();
  const { user } = useAuth();
  const [tab, setTab]               = useState("Analytics");
  const [stats, setStats]           = useState(null);
  const [caregivers, setCaregivers] = useState([]);
  const [users, setUsers]           = useState([]);
  const [bookings, setBookings]     = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [contacts, setContacts]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [toast, setToast]           = useState("");
  const [searchCG, setSearchCG]     = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [filterCG, setFilterCG]     = useState("all");
  const [filterBook, setFilterBook] = useState("all");
  const [verifyModal, setVerifyModal] = useState(null);
  const [verifyNote, setVerifyNote]   = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [isMobile, setIsMobile]     = useState(window.innerWidth < 768);

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(""), 3500); };

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [s, cg, u, b, cp, ct] = await Promise.allSettled([
        axios.get(`${API_BASE}/admin/stats`),
        axios.get(`${API_BASE}/admin/caregivers?limit=50`),
        axios.get(`${API_BASE}/admin/users?limit=50`),
        axios.get(`${API_BASE}/admin/bookings?limit=50`),
        axios.get(`${API_BASE}/admin/complaints`),
        axios.get(`${API_BASE}/admin/contacts`),
      ]);
      if (s.status  === "fulfilled") setStats(s.value.data);
      if (cg.status === "fulfilled") setCaregivers(cg.value.data.caregivers || []);
      if (u.status  === "fulfilled") setUsers(u.value.data.users || []);
      if (b.status  === "fulfilled") setBookings(b.value.data.bookings || []);
      if (cp.status === "fulfilled") setComplaints(cp.value.data.complaints || []);
      if (ct.status === "fulfilled") setContacts(ct.value.data.contacts || []);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const verifyCaregiver = async (id, status) => {
    setActionLoading(true);
    try {
      await axios.patch(`${API_BASE}/admin/caregivers/${id}/verify`, { status, verificationNote: verifyNote });
      showToast(`✅ Caregiver ${status}`); setVerifyModal(null); setVerifyNote(""); loadAll();
    } catch (err) { showToast("❌ " + (err.response?.data?.error || "Failed")); }
    setActionLoading(false);
  };

  const toggleUser = async (userId, isActive) => {
    try { await axios.patch(`${API_BASE}/admin/users/${userId}`, { isActive }); showToast(`✅ User ${isActive ? "activated" : "suspended"}`); loadAll(); }
    catch { showToast("❌ Failed"); }
  };

  const resolveComplaint = async (bookingId) => {
    try { await axios.patch(`${API_BASE}/admin/complaints/${bookingId}/resolve`); showToast("✅ Resolved"); loadAll(); }
    catch { showToast("❌ Failed"); }
  };

  const resolveContact = async (id) => {
    try { await axios.patch(`${API_BASE}/admin/contacts/${id}/resolve`); showToast("✅ Resolved"); loadAll(); }
    catch { showToast("❌ Failed"); }
  };

  const filteredCG    = caregivers.filter(c => (filterCG === "all" || c.status === filterCG) && (!searchCG || c.name.toLowerCase().includes(searchCG.toLowerCase()) || c.email.toLowerCase().includes(searchCG.toLowerCase())));
  const filteredUsers = users.filter(u => !searchUser || u.name.toLowerCase().includes(searchUser.toLowerCase()) || u.email.toLowerCase().includes(searchUser.toLowerCase()));
  const filteredBook  = bookings.filter(b => filterBook === "all" || b.status === filterBook);

  const thSt = { padding: "12px 14px", fontSize: 11, fontWeight: 700, color: theme.textMuted, textAlign: "left", fontFamily: "'DM Sans',sans-serif", borderBottom: `1px solid ${theme.border}`, background: theme.bgSecondary, whiteSpace: "nowrap" };
  const tdSt = { padding: "13px 14px", fontSize: 13, color: theme.text, fontFamily: "'DM Sans',sans-serif", borderBottom: `1px solid ${theme.border}`, verticalAlign: "middle" };
  const inp  = { padding: "10px 13px", borderRadius: 10, border: `1.5px solid ${theme.border}`, background: theme.bgSecondary, color: theme.text, fontSize: 14, fontFamily: "'DM Sans',sans-serif", outline: "none", width: "100%" };
  const sel  = { ...inp, cursor: "pointer" };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: theme.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} style={{ width: 40, height: 40, border: `3px solid ${theme.border}`, borderTopColor: "#00A99D", borderRadius: "50%" }} />
    </div>
  );

  return (
    <div style={{ background: theme.bg, minHeight: "100vh", minHeight: "100dvh" }}>

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
        <div style={{ maxWidth: 1300, margin: "0 auto" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <h1 style={{ color: "#fff", fontSize: "clamp(20px,4vw,30px)", fontWeight: 900, fontFamily: "'Playfair Display',Georgia,serif", margin: "0 0 4px" }}>
                Admin Dashboard 🛡️
              </h1>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, margin: 0, fontFamily: "'DM Sans',sans-serif" }}>
                {user?.email}
              </p>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {stats?.complaints?.open > 0 && (
                <span style={{ background: "rgba(255,107,138,0.2)", color: "#FF6B8A", border: "1px solid rgba(255,107,138,0.3)", borderRadius: 20, padding: "5px 12px", fontSize: 12, fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>
                  🚨 {stats.complaints.open} Complaint{stats.complaints.open > 1 ? "s" : ""}
                </span>
              )}
              {stats?.caregivers?.pending > 0 && (
                <span style={{ background: "rgba(240,165,0,0.2)", color: "#F0A500", border: "1px solid rgba(240,165,0,0.3)", borderRadius: 20, padding: "5px 12px", fontSize: 12, fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>
                  ⏳ {stats.caregivers.pending} Pending
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs — horizontal scroll on mobile */}
      <div style={{ background: theme.bgCard, borderBottom: `1px solid ${theme.border}` }}>
        <div style={{ maxWidth: 1300, margin: "0 auto" }}>
          <div className="nc-tab-bar" style={{ padding: "0 clamp(12px,3vw,40px)" }}>
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)}
                className="nc-tab-btn"
                style={{ padding: "14px clamp(12px,2vw,22px)", background: "none", border: "none",
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

      {/* Content */}
      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "clamp(16px,3vw,32px) clamp(16px,4vw,40px)" }}>

        {/* ─── ANALYTICS ─── */}
        {tab === "Analytics" && stats && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="nc-stats-row" style={{ marginBottom: 24 }}>
              <StatCard icon="👥" label="Patients"   value={stats.users?.total || 0}          color="#3B82F6" theme={theme} />
              <StatCard icon="👩‍⚕️" label="Caregivers" value={stats.caregivers?.total || 0}      color="#00A99D" sub={`${stats.caregivers?.pending || 0} pending`} theme={theme} />
              <StatCard icon="📋" label="Bookings"   value={stats.bookings?.total || 0}        color="#00A99D" theme={theme} />
              <StatCard icon="✅" label="Completed"  value={stats.bookings?.completed || 0}    color="#00A99D" theme={theme} />
              <StatCard icon="🚨" label="Complaints" value={stats.complaints?.open || 0}       color="#FF6B8A" theme={theme} />
              <StatCard icon="📩" label="Messages"   value={stats.contacts?.pending || 0}      color="#F0A500" theme={theme} />
              <StatCard icon="⭐" label="Avg Rating" value={stats.feedback?.avgRating || "—"}  color="#F0A500" theme={theme} />
              <StatCard icon="❌" label="Cancelled"  value={stats.bookings?.cancelled || 0}    color="#FF6B8A" theme={theme} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))", gap: 16 }}>
              <div style={{ background: theme.bgCard, borderRadius: 18, border: `1px solid ${theme.border}`, overflow: "hidden" }}>
                <div style={{ padding: "16px 18px", borderBottom: `1px solid ${theme.border}` }}>
                  <h3 style={{ color: theme.text, fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 800, margin: 0 }}>📋 Recent Bookings</h3>
                </div>
                {(stats.recentBookings || []).map(b => (
                  <div key={b._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 18px", borderBottom: `1px solid ${theme.border}`, gap: 8 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: theme.text, fontFamily: "'DM Sans',sans-serif" }}>{b.patientName}</div>
                      <div style={{ fontSize: 12, color: theme.textMuted, fontFamily: "'DM Sans',sans-serif" }}>{b.service}</div>
                    </div>
                    <Badge status={b.status} />
                  </div>
                ))}
              </div>

              <div style={{ background: theme.bgCard, borderRadius: 18, border: `1px solid ${theme.border}`, overflow: "hidden" }}>
                <div style={{ padding: "16px 18px", borderBottom: `1px solid ${theme.border}` }}>
                  <h3 style={{ color: theme.text, fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 800, margin: 0 }}>⏳ Awaiting Verification</h3>
                </div>
                {(stats.recentCaregivers || []).length === 0 ? (
                  <p style={{ padding: "18px", color: theme.textMuted, fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>No pending caregivers. 🎉</p>
                ) : (stats.recentCaregivers || []).map(cg => (
                  <div key={cg._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 18px", borderBottom: `1px solid ${theme.border}`, gap: 8 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: theme.text, fontFamily: "'DM Sans',sans-serif" }}>{cg.name}</div>
                      <div style={{ fontSize: 12, color: theme.textMuted, fontFamily: "'DM Sans',sans-serif" }}>{cg.role}</div>
                    </div>
                    <button onClick={() => { setVerifyModal(cg); setTab("Caregivers"); }}
                      style={{ background: "rgba(0,169,157,0.15)", color: "#00A99D", border: "1px solid rgba(0,169,157,0.3)", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", whiteSpace: "nowrap" }}>
                      Review
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── CAREGIVERS ─── */}
        {tab === "Caregivers" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 18, alignItems: "center" }}>
              <h2 style={{ color: theme.text, fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(18px,3vw,22px)", margin: 0, flex: 1, minWidth: 160 }}>Caregiver Management</h2>
              <input placeholder="🔍 Search..." value={searchCG} onChange={e => setSearchCG(e.target.value)} style={{ ...inp, maxWidth: 220, fontSize: 14 }} />
              <select value={filterCG} onChange={e => setFilterCG(e.target.value)} style={{ ...sel, maxWidth: 160 }}>
                {["all","pending","verified","rejected","suspended"].map(v => <option key={v} value={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</option>)}
              </select>
            </div>

            {/* Mobile cards */}
            {isMobile ? (
              <div>
                {filteredCG.length === 0 ? (
                  <DataCard theme={theme}><p style={{ color: theme.textMuted, fontFamily: "'DM Sans',sans-serif", fontSize: 14, textAlign: "center" }}>No caregivers found.</p></DataCard>
                ) : filteredCG.map(cg => (
                  <DataCard key={cg._id} theme={theme} accent={cg.status === "pending" ? "rgba(240,165,0,0.3)" : theme.border}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 800, color: theme.text, fontFamily: "'DM Sans',sans-serif" }}>{cg.name}</div>
                        <div style={{ fontSize: 12, color: theme.textMuted, fontFamily: "'DM Sans',sans-serif" }}>{cg.email}</div>
                        <div style={{ fontSize: 12, color: theme.textMuted, fontFamily: "'DM Sans',sans-serif", marginTop: 2 }}>{cg.role} • {cg.experience || "—"}</div>
                      </div>
                      <Badge status={cg.status} />
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {cg.status === "pending" && <>
                        <button onClick={() => setVerifyModal(cg)} style={{ flex: 1, background: "rgba(0,169,157,0.15)", color: "#00A99D", border: "1px solid rgba(0,169,157,0.3)", borderRadius: 8, padding: "8px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>✅ Verify</button>
                        <button onClick={() => setVerifyModal({ ...cg, forceReject: true })} style={{ flex: 1, background: "rgba(255,107,138,0.1)", color: "#FF6B8A", border: "1px solid rgba(255,107,138,0.3)", borderRadius: 8, padding: "8px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>❌ Reject</button>
                      </>}
                      {cg.status === "verified" && <button onClick={() => verifyCaregiver(cg._id, "suspended")} style={{ background: "rgba(107,124,147,0.15)", color: "#6B7C93", border: "1px solid rgba(107,124,147,0.3)", borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>⏸ Suspend</button>}
                      {["rejected","suspended"].includes(cg.status) && <button onClick={() => verifyCaregiver(cg._id, "verified")} style={{ background: "rgba(0,169,157,0.15)", color: "#00A99D", border: "1px solid rgba(0,169,157,0.3)", borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>↩ Reinstate</button>}
                    </div>
                  </DataCard>
                ))}
              </div>
            ) : (
              /* Desktop table */
              <div className="nc-table-wrap">
                <table className="nc-table" style={{ background: theme.bgCard, borderRadius: 18, border: `1px solid ${theme.border}` }}>
                  <thead><tr>{["Name","Role","Experience","Service Areas","Status","Actions"].map(h => <th key={h} style={thSt}>{h}</th>)}</tr></thead>
                  <tbody>
                    {filteredCG.length === 0 ? (
                      <tr><td colSpan={6} style={{ ...tdSt, textAlign: "center", padding: 32, color: theme.textMuted }}>No caregivers found.</td></tr>
                    ) : filteredCG.map(cg => (
                      <tr key={cg._id}>
                        <td style={tdSt}><div style={{ fontWeight: 700 }}>{cg.name}</div><div style={{ fontSize: 11, color: theme.textMuted }}>{cg.email}</div></td>
                        <td style={tdSt}>{cg.role || "—"}</td>
                        <td style={tdSt}>{cg.experience || "—"}</td>
                        <td style={tdSt}><span style={{ fontSize: 12 }}>{cg.serviceAreas?.slice(0,2).join(", ") || "—"}</span></td>
                        <td style={tdSt}><Badge status={cg.status} /></td>
                        <td style={tdSt}>
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            {cg.status === "pending" && <>
                              <button onClick={() => setVerifyModal(cg)} style={{ background: "rgba(0,169,157,0.15)", color: "#00A99D", border: "1px solid rgba(0,169,157,0.3)", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>✅ Verify</button>
                              <button onClick={() => setVerifyModal({ ...cg, forceReject: true })} style={{ background: "rgba(255,107,138,0.1)", color: "#FF6B8A", border: "1px solid rgba(255,107,138,0.3)", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>❌ Reject</button>
                            </>}
                            {cg.status === "verified" && <button onClick={() => verifyCaregiver(cg._id, "suspended")} style={{ background: "rgba(107,124,147,0.15)", color: "#6B7C93", border: "1px solid rgba(107,124,147,0.3)", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>⏸ Suspend</button>}
                            {["rejected","suspended"].includes(cg.status) && <button onClick={() => verifyCaregiver(cg._id, "verified")} style={{ background: "rgba(0,169,157,0.15)", color: "#00A99D", border: "1px solid rgba(0,169,157,0.3)", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>↩ Reinstate</button>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}

        {/* ─── USERS ─── */}
        {tab === "Users" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 18, alignItems: "center" }}>
              <h2 style={{ color: theme.text, fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(18px,3vw,22px)", margin: 0, flex: 1, minWidth: 160 }}>User Management</h2>
              <input placeholder="🔍 Search users..." value={searchUser} onChange={e => setSearchUser(e.target.value)} style={{ ...inp, maxWidth: 240 }} />
            </div>

            {isMobile ? (
              <div>
                {filteredUsers.length === 0 ? (
                  <DataCard theme={theme}><p style={{ color: theme.textMuted, fontFamily: "'DM Sans',sans-serif", fontSize: 14, textAlign: "center" }}>No users found.</p></DataCard>
                ) : filteredUsers.map(u => (
                  <DataCard key={u._id} theme={theme}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 800, color: theme.text, fontFamily: "'DM Sans',sans-serif" }}>{u.name}</div>
                        <div style={{ fontSize: 12, color: theme.textMuted, fontFamily: "'DM Sans',sans-serif" }}>{u.email}</div>
                        <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap", alignItems: "center" }}>
                          <Badge status={u.role} />
                          <span style={{ fontSize: 12, color: u.isActive ? "#00A99D" : "#FF6B8A", fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>{u.isActive ? "Active" : "Suspended"}</span>
                        </div>
                      </div>
                      <button onClick={() => toggleUser(u._id, !u.isActive)}
                        style={{ background: u.isActive ? "rgba(255,107,138,0.1)" : "rgba(0,169,157,0.1)", color: u.isActive ? "#FF6B8A" : "#00A99D", border: `1px solid ${u.isActive ? "rgba(255,107,138,0.3)" : "rgba(0,169,157,0.3)"}`, borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", whiteSpace: "nowrap" }}>
                        {u.isActive ? "Suspend" : "Activate"}
                      </button>
                    </div>
                  </DataCard>
                ))}
              </div>
            ) : (
              <div className="nc-table-wrap">
                <table className="nc-table" style={{ background: theme.bgCard, borderRadius: 18, border: `1px solid ${theme.border}` }}>
                  <thead><tr>{["Name","Email","Phone","Role","Joined","Status","Action"].map(h => <th key={h} style={thSt}>{h}</th>)}</tr></thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr><td colSpan={7} style={{ ...tdSt, textAlign: "center", padding: 32, color: theme.textMuted }}>No users found.</td></tr>
                    ) : filteredUsers.map(u => (
                      <tr key={u._id}>
                        <td style={tdSt}><div style={{ fontWeight: 700 }}>{u.name}</div></td>
                        <td style={tdSt}><span style={{ fontSize: 12 }}>{u.email}</span></td>
                        <td style={tdSt}>{u.phone || "—"}</td>
                        <td style={tdSt}><Badge status={u.role} /></td>
                        <td style={tdSt}><span style={{ fontSize: 12 }}>{new Date(u.createdAt).toLocaleDateString()}</span></td>
                        <td style={tdSt}><span style={{ color: u.isActive ? "#00A99D" : "#FF6B8A", fontWeight: 700, fontSize: 12 }}>{u.isActive ? "Active" : "Suspended"}</span></td>
                        <td style={tdSt}>
                          <button onClick={() => toggleUser(u._id, !u.isActive)}
                            style={{ background: u.isActive ? "rgba(255,107,138,0.1)" : "rgba(0,169,157,0.1)", color: u.isActive ? "#FF6B8A" : "#00A99D", border: `1px solid ${u.isActive ? "rgba(255,107,138,0.3)" : "rgba(0,169,157,0.3)"}`, borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                            {u.isActive ? "Suspend" : "Activate"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}

        {/* ─── BOOKINGS ─── */}
        {tab === "Bookings" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 18, alignItems: "center" }}>
              <h2 style={{ color: theme.text, fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(18px,3vw,22px)", margin: 0, flex: 1, minWidth: 160 }}>Bookings</h2>
              <select value={filterBook} onChange={e => setFilterBook(e.target.value)} style={{ ...sel, maxWidth: 200 }}>
                {["all","confirmed","accepted","in_progress","completed","cancelled"].map(v => <option key={v} value={v}>{v.replace("_", " ")}</option>)}
              </select>
            </div>

            {isMobile ? (
              <div>
                {filteredBook.length === 0 ? (
                  <DataCard theme={theme}><p style={{ color: theme.textMuted, fontFamily: "'DM Sans',sans-serif", fontSize: 14, textAlign: "center" }}>No bookings.</p></DataCard>
                ) : filteredBook.map(b => (
                  <DataCard key={b._id} theme={theme} accent={b.hasComplaint ? "rgba(255,107,138,0.3)" : theme.border}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <div>
                        <div style={{ fontSize: 13, color: "#00A99D", fontWeight: 700, fontFamily: "'DM Sans',sans-serif", marginBottom: 2 }}>{b.bookingId}</div>
                        <div style={{ fontSize: 15, fontWeight: 800, color: theme.text, fontFamily: "'DM Sans',sans-serif" }}>{b.patientName}</div>
                        <div style={{ fontSize: 12, color: theme.textMuted, fontFamily: "'DM Sans',sans-serif" }}>{b.service} • {b.date || "ASAP"}</div>
                        {b.nurseName && <div style={{ fontSize: 12, color: theme.textMuted, fontFamily: "'DM Sans',sans-serif" }}>👩‍⚕️ {b.nurseName}</div>}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
                        <Badge status={b.status} />
                        {b.hasComplaint && <span style={{ fontSize: 11, color: "#FF6B8A", fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>🚨 {b.complaintStatus}</span>}
                      </div>
                    </div>
                  </DataCard>
                ))}
              </div>
            ) : (
              <div className="nc-table-wrap">
                <table className="nc-table" style={{ background: theme.bgCard, borderRadius: 18, border: `1px solid ${theme.border}` }}>
                  <thead><tr>{["Booking ID","Patient","Service","Nurse","Date","Status","Complaint"].map(h => <th key={h} style={thSt}>{h}</th>)}</tr></thead>
                  <tbody>
                    {filteredBook.length === 0 ? (
                      <tr><td colSpan={7} style={{ ...tdSt, textAlign: "center", padding: 32, color: theme.textMuted }}>No bookings.</td></tr>
                    ) : filteredBook.map(b => (
                      <tr key={b._id}>
                        <td style={tdSt}><span style={{ fontSize: 12, color: "#00A99D", fontWeight: 700 }}>{b.bookingId}</span></td>
                        <td style={tdSt}><div style={{ fontWeight: 700 }}>{b.patientName}</div><div style={{ fontSize: 11, color: theme.textMuted }}>{b.phone}</div></td>
                        <td style={tdSt}>{b.service}</td>
                        <td style={tdSt}>{b.nurseName || <span style={{ color: theme.textMuted, fontSize: 12 }}>Unassigned</span>}</td>
                        <td style={tdSt}><span style={{ fontSize: 12 }}>{b.date || "ASAP"}</span></td>
                        <td style={tdSt}><Badge status={b.status} /></td>
                        <td style={tdSt}>{b.hasComplaint ? <span style={{ color: "#FF6B8A", fontWeight: 700, fontSize: 12 }}>🚨 {b.complaintStatus}</span> : <span style={{ color: theme.textMuted, fontSize: 12 }}>—</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}

        {/* ─── COMPLAINTS ─── */}
        {tab === "Complaints" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 style={{ color: theme.text, fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(18px,3vw,22px)", marginBottom: 20 }}>Disputes & Complaints</h2>
            {complaints.length === 0 ? (
              <div style={{ background: theme.bgCard, borderRadius: 20, padding: 48, textAlign: "center", border: `1px solid ${theme.border}` }}>
                <div style={{ fontSize: 48 }}>🎉</div>
                <h3 style={{ color: theme.text, fontFamily: "'DM Sans',sans-serif", marginTop: 14 }}>No open complaints!</h3>
                <p style={{ color: theme.textMuted, fontFamily: "'DM Sans',sans-serif", marginTop: 6 }}>All disputes resolved.</p>
              </div>
            ) : complaints.map(c => (
              <motion.div key={c._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                style={{ background: theme.bgCard, borderRadius: 18, padding: "clamp(16px,3vw,24px)", border: `1px solid ${c.complaintStatus === "open" ? "rgba(255,107,138,0.4)" : theme.border}`, marginBottom: 14 }}>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
                  <div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 12, color: "#00A99D", fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>{c.bookingId}</span>
                      <Badge status={c.complaintStatus} />
                    </div>
                    <h3 style={{ color: theme.text, fontFamily: "'DM Sans',sans-serif", fontSize: "clamp(15px,2.5vw,17px)", fontWeight: 800, margin: "0 0 4px" }}>{c.patientName}</h3>
                    <p style={{ color: theme.textMuted, fontSize: 13, margin: 0, fontFamily: "'DM Sans',sans-serif" }}>{c.service}{c.nurseName ? ` • Nurse: ${c.nurseName}` : ""}</p>
                  </div>
                  {c.complaintStatus === "open" && (
                    <button onClick={() => resolveComplaint(c.bookingId)}
                      style={{ background: "rgba(0,169,157,0.15)", color: "#00A99D", border: "1px solid rgba(0,169,157,0.3)", borderRadius: 11, padding: "9px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", alignSelf: "flex-start", whiteSpace: "nowrap" }}>
                      ✅ Resolve
                    </button>
                  )}
                </div>
                <div style={{ background: "rgba(255,107,138,0.08)", borderRadius: 11, padding: "12px 14px", border: "1px solid rgba(255,107,138,0.18)" }}>
                  <p style={{ color: "#FF6B8A", fontFamily: "'DM Sans',sans-serif", fontSize: 13, margin: 0, lineHeight: 1.6 }}>🚨 {c.complaint}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* ─── MESSAGES ─── */}
        {tab === "Messages" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 style={{ color: theme.text, fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(18px,3vw,22px)", marginBottom: 20 }}>Contact Messages</h2>
            {contacts.length === 0 ? (
              <div style={{ background: theme.bgCard, borderRadius: 20, padding: 48, textAlign: "center", border: `1px solid ${theme.border}` }}>
                <div style={{ fontSize: 48 }}>📭</div>
                <h3 style={{ color: theme.text, fontFamily: "'DM Sans',sans-serif", marginTop: 14 }}>No messages.</h3>
              </div>
            ) : contacts.map(c => (
              <motion.div key={c._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                style={{ background: theme.bgCard, borderRadius: 18, padding: "clamp(16px,3vw,22px)", border: `1px solid ${c.resolved ? theme.border : "rgba(240,165,0,0.35)"}`, marginBottom: 12, opacity: c.resolved ? 0.6 : 1 }}>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6, flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 800, color: theme.text, fontFamily: "'DM Sans',sans-serif", fontSize: 15 }}>{c.name}</span>
                      <Badge status={c.resolved ? "resolved" : "open"} />
                    </div>
                    <p style={{ color: theme.textMuted, fontSize: 12, margin: "0 0 8px", fontFamily: "'DM Sans',sans-serif" }}>📧 {c.email}{c.phone ? ` • 📞 ${c.phone}` : ""}</p>
                    <p style={{ color: theme.text, fontSize: 14, lineHeight: 1.65, margin: 0, fontFamily: "'DM Sans',sans-serif", wordBreak: "break-word" }}>{c.message}</p>
                  </div>
                  {!c.resolved && (
                    <button onClick={() => resolveContact(c._id)}
                      style={{ background: "rgba(0,169,157,0.15)", color: "#00A99D", border: "1px solid rgba(0,169,157,0.3)", borderRadius: 11, padding: "9px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", alignSelf: "flex-start", whiteSpace: "nowrap" }}>
                      ✅ Resolve
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* ─── Verify Modal — bottom sheet on mobile, centered on desktop ─── */}
      <AnimatePresence>
        {verifyModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setVerifyModal(null)}
            className="nc-modal-backdrop">
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              className="nc-modal"
              style={{ background: theme.bgCard, border: `1px solid ${theme.border}` }}>

              <h3 style={{ color: theme.text, fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(20px,4vw,24px)", marginBottom: 6 }}>Review Caregiver</h3>
              <p style={{ color: theme.textMuted, fontFamily: "'DM Sans',sans-serif", marginBottom: 18, fontSize: 14 }}>{verifyModal.name} • {verifyModal.role}</p>

              {[["Experience",verifyModal.experience],["License",verifyModal.licenseNumber||"—"],["Specializations",verifyModal.specializations?.join(", ")||"—"],["Languages",verifyModal.languages?.join(", ")||"—"],["Service Areas",verifyModal.serviceAreas?.join(", ")||"—"]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: `1px solid ${theme.border}`, gap: 10 }}>
                  <span style={{ fontSize: 13, color: theme.textMuted, fontFamily: "'DM Sans',sans-serif", flexShrink: 0 }}>{k}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: theme.text, fontFamily: "'DM Sans',sans-serif", textAlign: "right" }}>{v}</span>
                </div>
              ))}
              {verifyModal.bio && <p style={{ color: theme.textMuted, fontSize: 13, fontFamily: "'DM Sans',sans-serif", marginTop: 12, lineHeight: 1.7 }}>{verifyModal.bio}</p>}

              <div style={{ marginTop: 18 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: theme.textMuted, marginBottom: 7, fontFamily: "'DM Sans',sans-serif" }}>Verification Note (optional)</label>
                <textarea rows={3} placeholder="Add a note for the caregiver..."
                  value={verifyNote} onChange={e => setVerifyNote(e.target.value)}
                  style={{ width: "100%", padding: "11px 13px", borderRadius: 10, border: `1.5px solid ${theme.border}`, background: theme.bgSecondary, color: theme.text, fontSize: 14, fontFamily: "'DM Sans',sans-serif", outline: "none", resize: "vertical", boxSizing: "border-box" }} />
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
                {!verifyModal.forceReject && (
                  <button disabled={actionLoading} onClick={() => verifyCaregiver(verifyModal._id, "verified")}
                    style={{ flex: 1, background: "#00A99D", color: "#fff", border: "none", borderRadius: 11, padding: "13px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", minWidth: 120 }}>
                    {actionLoading ? "…" : "✅ Verify & Onboard"}
                  </button>
                )}
                <button disabled={actionLoading} onClick={() => verifyCaregiver(verifyModal._id, "rejected")}
                  style={{ flex: 1, background: "rgba(255,107,138,0.12)", color: "#FF6B8A", border: "1px solid rgba(255,107,138,0.3)", borderRadius: 11, padding: "13px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", minWidth: 100 }}>
                  {actionLoading ? "…" : "❌ Reject"}
                </button>
                <button onClick={() => setVerifyModal(null)}
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