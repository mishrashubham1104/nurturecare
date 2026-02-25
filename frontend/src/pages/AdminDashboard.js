import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { API_BASE } from "../constants";

const TABS = ["Analytics","Caregivers","Users","Bookings","Complaints","Messages"];

function StatCard({ icon, label, value, sub, color="#00A99D", theme }) {
  return (
    <motion.div whileHover={{y:-4}} style={{ background:theme.bgCard, borderRadius:20, padding:"24px 20px", border:`1px solid ${theme.border}`, boxShadow:theme.shadow }}>
      <div style={{ width:48, height:48, borderRadius:14, background:`${color}20`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, marginBottom:14 }}>{icon}</div>
      <div style={{ fontSize:30, fontWeight:900, color:theme.text, fontFamily:"'DM Sans',sans-serif" }}>{value}</div>
      <div style={{ fontSize:13, fontWeight:700, color:theme.textMuted, fontFamily:"'DM Sans',sans-serif" }}>{label}</div>
      {sub && <div style={{ fontSize:12, color, fontWeight:700, marginTop:4, fontFamily:"'DM Sans',sans-serif" }}>{sub}</div>}
    </motion.div>
  );
}

function Badge({ status }) {
  const map = { pending:"#F0A500", verified:"#00A99D", rejected:"#FF6B8A", suspended:"#6B7C93", open:"#FF6B8A", resolved:"#00A99D", confirmed:"#3B82F6", completed:"#00A99D", cancelled:"#FF6B8A", in_progress:"#F0A500", patient:"#3B82F6", caregiver:"#00A99D", admin:"#F0A500" };
  const color = map[status] || "#6B7C93";
  return <span style={{ background:`${color}20`, color, border:`1px solid ${color}40`, borderRadius:20, padding:"3px 12px", fontSize:11, fontWeight:700, fontFamily:"'DM Sans',sans-serif", textTransform:"capitalize", whiteSpace:"nowrap" }}>{status?.replace("_"," ")}</span>;
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

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3500); };

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
      if (s.status==="fulfilled")  setStats(s.value.data);
      if (cg.status==="fulfilled") setCaregivers(cg.value.data.caregivers||[]);
      if (u.status==="fulfilled")  setUsers(u.value.data.users||[]);
      if (b.status==="fulfilled")  setBookings(b.value.data.bookings||[]);
      if (cp.status==="fulfilled") setComplaints(cp.value.data.complaints||[]);
      if (ct.status==="fulfilled") setContacts(ct.value.data.contacts||[]);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const verifyCaregiver = async (id, status) => {
    setActionLoading(true);
    try {
      await axios.patch(`${API_BASE}/admin/caregivers/${id}/verify`, { status, verificationNote: verifyNote });
      showToast(`✅ Caregiver ${status}`); setVerifyModal(null); setVerifyNote(""); loadAll();
    } catch (err) { showToast("❌ " + (err.response?.data?.error||"Failed")); }
    setActionLoading(false);
  };

  const toggleUser = async (userId, isActive) => {
    try { await axios.patch(`${API_BASE}/admin/users/${userId}`, { isActive }); showToast(`✅ User ${isActive?"activated":"suspended"}`); loadAll(); }
    catch { showToast("❌ Failed"); }
  };

  const resolveComplaint = async (bookingId) => {
    try { await axios.patch(`${API_BASE}/admin/complaints/${bookingId}/resolve`); showToast("✅ Complaint resolved"); loadAll(); }
    catch { showToast("❌ Failed"); }
  };

  const resolveContact = async (id) => {
    try { await axios.patch(`${API_BASE}/admin/contacts/${id}/resolve`); showToast("✅ Message resolved"); loadAll(); }
    catch { showToast("❌ Failed"); }
  };

  const filteredCG   = caregivers.filter(c => (filterCG==="all"||c.status===filterCG) && (!searchCG||c.name.toLowerCase().includes(searchCG.toLowerCase())||c.email.toLowerCase().includes(searchCG.toLowerCase())));
  const filteredUsers = users.filter(u => !searchUser || u.name.toLowerCase().includes(searchUser.toLowerCase()) || u.email.toLowerCase().includes(searchUser.toLowerCase()));
  const filteredBook  = bookings.filter(b => filterBook==="all"||b.status===filterBook);

  const cardSt = { background:theme.bgCard, borderRadius:20, border:`1px solid ${theme.border}`, overflow:"hidden" };
  const thSt   = { padding:"12px 16px", fontSize:12, fontWeight:700, color:theme.textMuted, textAlign:"left", fontFamily:"'DM Sans',sans-serif", borderBottom:`1px solid ${theme.border}`, background:theme.bgSecondary, whiteSpace:"nowrap" };
  const tdSt   = { padding:"14px 16px", fontSize:13, color:theme.text, fontFamily:"'DM Sans',sans-serif", borderBottom:`1px solid ${theme.border}`, verticalAlign:"middle" };
  const inp    = { padding:"10px 14px", borderRadius:10, border:`1.5px solid ${theme.border}`, background:theme.bgSecondary, color:theme.text, fontSize:13, fontFamily:"'DM Sans',sans-serif", outline:"none" };
  const sel    = { ...inp, cursor:"pointer" };

  if (loading) return <div style={{ minHeight:"100vh", background:theme.bg, display:"flex", alignItems:"center", justifyContent:"center", paddingTop:80 }}><div style={{ fontSize:40 }}>⏳</div></div>;

  return (
    <div style={{ background:theme.bg, minHeight:"100vh", paddingTop:80 }}>
      {/* Toast */}
      <AnimatePresence>{toast && <motion.div initial={{y:-60,opacity:0}} animate={{y:0,opacity:1}} exit={{y:-60,opacity:0}} style={{ position:"fixed", top:80, right:24, background:theme.bgCard, border:`1px solid ${theme.border}`, borderRadius:12, padding:"12px 20px", zIndex:500, fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:700, color:theme.text, boxShadow:theme.shadowLg }}>{toast}</motion.div>}</AnimatePresence>

      {/* Header */}
      <div style={{ background:"#0B1D3A", padding:"clamp(28px,4vw,48px) clamp(16px,4vw,40px)" }}>
        <div style={{ maxWidth:1300, margin:"0 auto", display:"flex", flexWrap:"wrap", gap:12, justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <h1 style={{ color:"#fff", fontSize:"clamp(22px,4vw,32px)", fontWeight:900, fontFamily:"'Playfair Display',Georgia,serif", margin:"0 0 4px" }}>Admin Dashboard 🛡️</h1>
            <p style={{ color:"rgba(255,255,255,0.5)", fontSize:14, margin:0, fontFamily:"'DM Sans',sans-serif" }}>NurtureCare Control Panel • {user?.email}</p>
          </div>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            {stats?.complaints?.open > 0 && <span style={{ background:"rgba(255,107,138,0.2)", color:"#FF6B8A", border:"1px solid rgba(255,107,138,0.3)", borderRadius:20, padding:"6px 14px", fontSize:13, fontWeight:700, fontFamily:"'DM Sans',sans-serif" }}>🚨 {stats.complaints.open} Open Complaint{stats.complaints.open>1?"s":""}</span>}
            {stats?.caregivers?.pending > 0 && <span style={{ background:"rgba(240,165,0,0.2)", color:"#F0A500", border:"1px solid rgba(240,165,0,0.3)", borderRadius:20, padding:"6px 14px", fontSize:13, fontWeight:700, fontFamily:"'DM Sans',sans-serif" }}>⏳ {stats.caregivers.pending} Pending Verification</span>}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background:theme.bgCard, borderBottom:`1px solid ${theme.border}`, overflowX:"auto" }}>
        <div style={{ maxWidth:1300, margin:"0 auto", display:"flex", padding:"0 clamp(16px,4vw,40px)" }}>
          {TABS.map(t => (
            <button key={t} onClick={()=>setTab(t)} style={{ padding:"16px clamp(12px,2vw,24px)", background:"none", border:"none", borderBottom:`3px solid ${tab===t?"#00A99D":"transparent"}`, color:tab===t?"#00A99D":theme.textMuted, fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", whiteSpace:"nowrap", transition:"all 0.2s" }}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth:1300, margin:"0 auto", padding:"clamp(20px,4vw,40px) clamp(16px,4vw,40px)" }}>

        {/* ─── ANALYTICS ─── */}
        {tab==="Analytics" && stats && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}}>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:16, marginBottom:32 }}>
              <StatCard icon="👥" label="Total Patients"   value={stats.users?.total||0}           color="#3B82F6"  theme={theme} />
              <StatCard icon="👩‍⚕️" label="Caregivers"      value={stats.caregivers?.total||0}       color="#00A99D"  sub={`${stats.caregivers?.pending||0} pending`} theme={theme} />
              <StatCard icon="📋" label="Total Bookings"   value={stats.bookings?.total||0}          color="#00A99D"  theme={theme} />
              <StatCard icon="✅" label="Completed"        value={stats.bookings?.completed||0}      color="#00A99D"  theme={theme} />
              <StatCard icon="🚨" label="Open Complaints"  value={stats.complaints?.open||0}         color="#FF6B8A"  theme={theme} />
              <StatCard icon="📩" label="Pending Messages" value={stats.contacts?.pending||0}        color="#F0A500"  theme={theme} />
              <StatCard icon="⭐" label="Avg Rating"       value={stats.feedback?.avgRating||"—"}    color="#F0A500"  theme={theme} />
              <StatCard icon="❌" label="Cancelled"        value={stats.bookings?.cancelled||0}      color="#FF6B8A"  theme={theme} />
            </div>

            {/* Recent activity */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:20 }}>
              <div style={cardSt}>
                <div style={{ padding:"18px 20px", borderBottom:`1px solid ${theme.border}` }}><h3 style={{ color:theme.text, fontFamily:"'DM Sans',sans-serif", fontSize:15, fontWeight:800, margin:0 }}>📋 Recent Bookings</h3></div>
                {(stats.recentBookings||[]).map(b => (
                  <div key={b._id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 20px", borderBottom:`1px solid ${theme.border}`, gap:8 }}>
                    <div><div style={{ fontSize:14, fontWeight:700, color:theme.text, fontFamily:"'DM Sans',sans-serif" }}>{b.patientName}</div><div style={{ fontSize:12, color:theme.textMuted, fontFamily:"'DM Sans',sans-serif" }}>{b.service}</div></div>
                    <Badge status={b.status} />
                  </div>
                ))}
              </div>
              <div style={cardSt}>
                <div style={{ padding:"18px 20px", borderBottom:`1px solid ${theme.border}` }}><h3 style={{ color:theme.text, fontFamily:"'DM Sans',sans-serif", fontSize:15, fontWeight:800, margin:0 }}>⏳ Pending Verification</h3></div>
                {(stats.recentCaregivers||[]).length===0 ? <p style={{ padding:"20px", color:theme.textMuted, fontFamily:"'DM Sans',sans-serif", fontSize:13 }}>No pending caregivers.</p> : (stats.recentCaregivers||[]).map(cg => (
                  <div key={cg._id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 20px", borderBottom:`1px solid ${theme.border}`, gap:8 }}>
                    <div><div style={{ fontSize:14, fontWeight:700, color:theme.text, fontFamily:"'DM Sans',sans-serif" }}>{cg.name}</div><div style={{ fontSize:12, color:theme.textMuted, fontFamily:"'DM Sans',sans-serif" }}>{cg.role} • {cg.experience}</div></div>
                    <motion.button whileHover={{scale:1.05}} onClick={()=>{setVerifyModal(cg);setTab("Caregivers")}} style={{ background:"rgba(0,169,157,0.15)", color:"#00A99D", border:"1px solid rgba(0,169,157,0.3)", borderRadius:8, padding:"6px 12px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>Review</motion.button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── CAREGIVERS ─── */}
        {tab==="Caregivers" && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}}>
            <div style={{ display:"flex", flexWrap:"wrap", gap:12, marginBottom:20, alignItems:"center" }}>
              <h2 style={{ color:theme.text, fontFamily:"'Playfair Display',Georgia,serif", fontSize:22, margin:0, flex:1 }}>Caregiver Management</h2>
              <input placeholder="🔍 Search name or email..." value={searchCG} onChange={e=>setSearchCG(e.target.value)} style={{...inp, minWidth:200}} />
              <select value={filterCG} onChange={e=>setFilterCG(e.target.value)} style={sel}>
                {["all","pending","verified","rejected","suspended"].map(v=><option key={v} value={v}>{v.charAt(0).toUpperCase()+v.slice(1)}</option>)}
              </select>
            </div>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", background:theme.bgCard, borderRadius:20, overflow:"hidden", border:`1px solid ${theme.border}` }}>
                <thead><tr>{["Name","Role","Experience","Areas","Status","Actions"].map(h=><th key={h} style={thSt}>{h}</th>)}</tr></thead>
                <tbody>
                  {filteredCG.length===0 ? <tr><td colSpan={6} style={{...tdSt, textAlign:"center", padding:32, color:theme.textMuted}}>No caregivers found.</td></tr> : filteredCG.map(cg => (
                    <tr key={cg._id}>
                      <td style={tdSt}><div style={{ fontWeight:700 }}>{cg.name}</div><div style={{ fontSize:12, color:theme.textMuted }}>{cg.email}</div></td>
                      <td style={tdSt}>{cg.role||"—"}</td>
                      <td style={tdSt}>{cg.experience||"—"}</td>
                      <td style={tdSt}><span style={{ fontSize:12 }}>{cg.serviceAreas?.slice(0,2).join(", ")||"—"}</span></td>
                      <td style={tdSt}><Badge status={cg.status} /></td>
                      <td style={tdSt}>
                        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                          {cg.status==="pending" && <>
                            <button onClick={()=>setVerifyModal(cg)} style={{ background:"rgba(0,169,157,0.15)", color:"#00A99D", border:"1px solid rgba(0,169,157,0.3)", borderRadius:8, padding:"6px 12px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>✅ Verify</button>
                            <button onClick={()=>{setVerifyModal({...cg,forceReject:true})}} style={{ background:"rgba(255,107,138,0.1)", color:"#FF6B8A", border:"1px solid rgba(255,107,138,0.3)", borderRadius:8, padding:"6px 12px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>❌ Reject</button>
                          </>}
                          {cg.status==="verified" && <button onClick={()=>verifyCaregiver(cg._id,"suspended")} style={{ background:"rgba(107,124,147,0.15)", color:"#6B7C93", border:"1px solid rgba(107,124,147,0.3)", borderRadius:8, padding:"6px 12px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>⏸ Suspend</button>}
                          {(cg.status==="rejected"||cg.status==="suspended") && <button onClick={()=>verifyCaregiver(cg._id,"verified")} style={{ background:"rgba(0,169,157,0.15)", color:"#00A99D", border:"1px solid rgba(0,169,157,0.3)", borderRadius:8, padding:"6px 12px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>↩ Reinstate</button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* ─── USERS ─── */}
        {tab==="Users" && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}}>
            <div style={{ display:"flex", flexWrap:"wrap", gap:12, marginBottom:20, alignItems:"center" }}>
              <h2 style={{ color:theme.text, fontFamily:"'Playfair Display',Georgia,serif", fontSize:22, margin:0, flex:1 }}>User Management</h2>
              <input placeholder="🔍 Search users..." value={searchUser} onChange={e=>setSearchUser(e.target.value)} style={{...inp, minWidth:200}} />
            </div>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", background:theme.bgCard, borderRadius:20, overflow:"hidden", border:`1px solid ${theme.border}` }}>
                <thead><tr>{["Name","Email","Phone","Role","Joined","Status","Actions"].map(h=><th key={h} style={thSt}>{h}</th>)}</tr></thead>
                <tbody>
                  {filteredUsers.length===0 ? <tr><td colSpan={7} style={{...tdSt, textAlign:"center", padding:32, color:theme.textMuted}}>No users found.</td></tr> : filteredUsers.map(u => (
                    <tr key={u._id}>
                      <td style={tdSt}><div style={{ fontWeight:700 }}>{u.name}</div></td>
                      <td style={tdSt}><span style={{ fontSize:12 }}>{u.email}</span></td>
                      <td style={tdSt}>{u.phone||"—"}</td>
                      <td style={tdSt}><Badge status={u.role} /></td>
                      <td style={tdSt}><span style={{ fontSize:12 }}>{new Date(u.createdAt).toLocaleDateString()}</span></td>
                      <td style={tdSt}><span style={{ color: u.isActive ? "#00A99D":"#FF6B8A", fontWeight:700, fontSize:12 }}>{u.isActive?"Active":"Suspended"}</span></td>
                      <td style={tdSt}>
                        <button onClick={()=>toggleUser(u._id, !u.isActive)} style={{ background: u.isActive ? "rgba(255,107,138,0.1)" : "rgba(0,169,157,0.1)", color: u.isActive ? "#FF6B8A":"#00A99D", border:`1px solid ${u.isActive ? "rgba(255,107,138,0.3)":"rgba(0,169,157,0.3)"}`, borderRadius:8, padding:"6px 12px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>
                          {u.isActive ? "Suspend":"Activate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* ─── BOOKINGS ─── */}
        {tab==="Bookings" && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}}>
            <div style={{ display:"flex", flexWrap:"wrap", gap:12, marginBottom:20, alignItems:"center" }}>
              <h2 style={{ color:theme.text, fontFamily:"'Playfair Display',Georgia,serif", fontSize:22, margin:0, flex:1 }}>Booking Management</h2>
              <select value={filterBook} onChange={e=>setFilterBook(e.target.value)} style={sel}>
                {["all","confirmed","accepted","in_progress","completed","cancelled"].map(v=><option key={v} value={v}>{v.replace("_"," ")}</option>)}
              </select>
            </div>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", background:theme.bgCard, borderRadius:20, overflow:"hidden", border:`1px solid ${theme.border}` }}>
                <thead><tr>{["Booking ID","Patient","Service","Nurse","Date","Status","Complaint"].map(h=><th key={h} style={thSt}>{h}</th>)}</tr></thead>
                <tbody>
                  {filteredBook.length===0 ? <tr><td colSpan={7} style={{...tdSt, textAlign:"center", padding:32, color:theme.textMuted}}>No bookings found.</td></tr> : filteredBook.map(b => (
                    <tr key={b._id}>
                      <td style={tdSt}><span style={{ fontSize:12, color:"#00A99D", fontWeight:700 }}>{b.bookingId}</span></td>
                      <td style={tdSt}><div style={{ fontWeight:700 }}>{b.patientName}</div><div style={{ fontSize:12, color:theme.textMuted }}>{b.phone}</div></td>
                      <td style={tdSt}><span style={{ fontSize:13 }}>{b.service}</span></td>
                      <td style={tdSt}>{b.nurseName||<span style={{ color:theme.textMuted, fontSize:12 }}>Unassigned</span>}</td>
                      <td style={tdSt}><span style={{ fontSize:12 }}>{b.date||"ASAP"}</span></td>
                      <td style={tdSt}><Badge status={b.status} /></td>
                      <td style={tdSt}>{b.hasComplaint ? <span style={{ color:"#FF6B8A", fontWeight:700, fontSize:12 }}>🚨 {b.complaintStatus}</span> : <span style={{ color:theme.textMuted, fontSize:12 }}>None</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* ─── COMPLAINTS ─── */}
        {tab==="Complaints" && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}}>
            <h2 style={{ color:theme.text, fontFamily:"'Playfair Display',Georgia,serif", fontSize:22, marginBottom:20 }}>Disputes & Complaints</h2>
            {complaints.length===0 ? (
              <div style={{ background:theme.bgCard, borderRadius:20, padding:48, textAlign:"center", border:`1px solid ${theme.border}` }}>
                <div style={{ fontSize:56 }}>🎉</div>
                <h3 style={{ color:theme.text, fontFamily:"'DM Sans',sans-serif", marginTop:16 }}>No open complaints!</h3>
                <p style={{ color:theme.textMuted, fontFamily:"'DM Sans',sans-serif" }}>All disputes have been resolved.</p>
              </div>
            ) : complaints.map(c => (
              <motion.div key={c._id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} style={{ background:theme.bgCard, borderRadius:20, padding:24, border:`1px solid ${c.complaintStatus==="open"?"rgba(255,107,138,0.4)":theme.border}`, marginBottom:16, boxShadow:theme.shadow }}>
                <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"space-between", gap:12, marginBottom:14 }}>
                  <div>
                    <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:6 }}><span style={{ fontSize:13, color:"#00A99D", fontWeight:700, fontFamily:"'DM Sans',sans-serif" }}>{c.bookingId}</span><Badge status={c.complaintStatus} /></div>
                    <h3 style={{ color:theme.text, fontFamily:"'DM Sans',sans-serif", fontSize:17, fontWeight:800, margin:"0 0 4px" }}>{c.patientName}</h3>
                    <p style={{ color:theme.textMuted, fontSize:13, margin:0, fontFamily:"'DM Sans',sans-serif" }}>{c.service} {c.nurseName ? `• Nurse: ${c.nurseName}`:""}</p>
                  </div>
                  {c.complaintStatus==="open" && (
                    <motion.button whileHover={{scale:1.04}} onClick={()=>resolveComplaint(c.bookingId)} style={{ background:"rgba(0,169,157,0.15)", color:"#00A99D", border:"1px solid rgba(0,169,157,0.3)", borderRadius:12, padding:"10px 20px", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", alignSelf:"flex-start" }}>✅ Resolve</motion.button>
                  )}
                </div>
                <div style={{ background:"rgba(255,107,138,0.08)", borderRadius:12, padding:"14px 16px", border:"1px solid rgba(255,107,138,0.2)" }}>
                  <p style={{ color:"#FF6B8A", fontFamily:"'DM Sans',sans-serif", fontSize:14, margin:0, lineHeight:1.6 }}>🚨 {c.complaint}</p>
                </div>
                {c.careNotes && <div style={{ marginTop:10, background:"rgba(0,169,157,0.08)", borderRadius:12, padding:"12px 16px" }}><p style={{ color:"#00A99D", fontSize:13, fontFamily:"'DM Sans',sans-serif", margin:0 }}>🩺 Caregiver notes: {c.careNotes}</p></div>}
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* ─── MESSAGES ─── */}
        {tab==="Messages" && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}}>
            <h2 style={{ color:theme.text, fontFamily:"'Playfair Display',Georgia,serif", fontSize:22, marginBottom:20 }}>Contact Messages</h2>
            {contacts.length===0 ? (
              <div style={{ background:theme.bgCard, borderRadius:20, padding:48, textAlign:"center", border:`1px solid ${theme.border}` }}>
                <div style={{ fontSize:56 }}>📭</div><h3 style={{ color:theme.text, fontFamily:"'DM Sans',sans-serif", marginTop:16 }}>No messages.</h3>
              </div>
            ) : contacts.map(c => (
              <motion.div key={c._id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} style={{ background:theme.bgCard, borderRadius:20, padding:24, border:`1px solid ${c.resolved?theme.border:"rgba(240,165,0,0.4)"}`, marginBottom:14, opacity:c.resolved?0.65:1 }}>
                <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"space-between", gap:12 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:8 }}>
                      <span style={{ fontWeight:800, color:theme.text, fontFamily:"'DM Sans',sans-serif", fontSize:16 }}>{c.name}</span>
                      <Badge status={c.resolved?"resolved":"open"} />
                    </div>
                    <p style={{ color:theme.textMuted, fontSize:13, margin:"0 0 10px", fontFamily:"'DM Sans',sans-serif" }}>📧 {c.email} {c.phone ? `• 📞 ${c.phone}`:""} • {new Date(c.createdAt).toLocaleDateString()}</p>
                    <p style={{ color:theme.text, fontSize:14, lineHeight:1.7, margin:0, fontFamily:"'DM Sans',sans-serif" }}>{c.message}</p>
                  </div>
                  {!c.resolved && <motion.button whileHover={{scale:1.04}} onClick={()=>resolveContact(c._id)} style={{ background:"rgba(0,169,157,0.15)", color:"#00A99D", border:"1px solid rgba(0,169,157,0.3)", borderRadius:12, padding:"10px 18px", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", alignSelf:"flex-start" }}>✅ Resolve</motion.button>}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Verify Modal */}
      <AnimatePresence>
        {verifyModal && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setVerifyModal(null)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.65)", zIndex:300, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
            <motion.div initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.9}} onClick={e=>e.stopPropagation()} style={{ background:theme.bgCard, borderRadius:24, padding:36, maxWidth:520, width:"100%", border:`1px solid ${theme.border}`, maxHeight:"90vh", overflowY:"auto" }}>
              <h3 style={{ color:theme.text, fontFamily:"'Playfair Display',Georgia,serif", fontSize:24, marginBottom:6 }}>Review Caregiver</h3>
              <p style={{ color:theme.textMuted, fontFamily:"'DM Sans',sans-serif", marginBottom:20 }}>{verifyModal.name} • {verifyModal.role}</p>
              {[["Experience",verifyModal.experience],["License",verifyModal.licenseNumber||"—"],["Specializations",verifyModal.specializations?.join(", ")||"—"],["Languages",verifyModal.languages?.join(", ")||"—"],["Service Areas",verifyModal.serviceAreas?.join(", ")||"—"]].map(([k,v])=>(
                <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:`1px solid ${theme.border}`, gap:12 }}>
                  <span style={{ fontSize:13, color:theme.textMuted, fontFamily:"'DM Sans',sans-serif" }}>{k}</span>
                  <span style={{ fontSize:13, fontWeight:700, color:theme.text, fontFamily:"'DM Sans',sans-serif", textAlign:"right" }}>{v}</span>
                </div>
              ))}
              {verifyModal.bio && <p style={{ color:theme.textMuted, fontSize:13, fontFamily:"'DM Sans',sans-serif", marginTop:14, lineHeight:1.7 }}>{verifyModal.bio}</p>}
              <div style={{ marginTop:20 }}>
                <label style={{ display:"block", fontSize:12, fontWeight:700, color:theme.textMuted, marginBottom:8, fontFamily:"'DM Sans',sans-serif" }}>Verification Note (optional)</label>
                <textarea rows={3} placeholder="Add a note for the caregiver..." value={verifyNote} onChange={e=>setVerifyNote(e.target.value)} style={{ width:"100%", padding:"12px", borderRadius:10, border:`1.5px solid ${theme.border}`, background:theme.bgSecondary, color:theme.text, fontSize:13, fontFamily:"'DM Sans',sans-serif", outline:"none", resize:"vertical", boxSizing:"border-box" }} />
              </div>
              <div style={{ display:"flex", gap:10, marginTop:20, flexWrap:"wrap" }}>
                {!verifyModal.forceReject && <button disabled={actionLoading} onClick={()=>verifyCaregiver(verifyModal._id,"verified")} style={{ flex:1, background:"#00A99D", color:"#fff", border:"none", borderRadius:12, padding:"13px", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>✅ {actionLoading?"...":"Verify & Onboard"}</button>}
                <button disabled={actionLoading} onClick={()=>verifyCaregiver(verifyModal._id,"rejected")} style={{ flex:1, background:"rgba(255,107,138,0.12)", color:"#FF6B8A", border:"1px solid rgba(255,107,138,0.3)", borderRadius:12, padding:"13px", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>❌ {actionLoading?"...":"Reject"}</button>
                <button onClick={()=>setVerifyModal(null)} style={{ padding:"13px 18px", background:theme.bgSecondary, color:theme.textMuted, border:`1px solid ${theme.border}`, borderRadius:12, fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
