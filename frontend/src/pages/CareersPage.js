
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { COLORS, fadeUp, stagger } from "../constants";

const JOBS = [
  { id: 1, title: "Senior Registered Nurse – ICU Care", dept: "Clinical", location: "Mumbai / Delhi", type: "Full-Time", salary: "₹4–7 LPA", desc: "Join our elite ICU-at-home program. You'll provide critical care in patients' homes, supported by a 24/7 clinical coordinator team." },
  { id: 2, title: "Physiotherapist – Rehabilitation", dept: "Clinical", location: "Bangalore / Pune", type: "Full-Time", salary: "₹3.5–5.5 LPA", desc: "Conduct in-home physiotherapy sessions for post-surgical and stroke recovery patients. Flexible scheduling available." },
  { id: 3, title: "Elderly Care Specialist", dept: "Clinical", location: "Pan India", type: "Full-Time / Part-Time", salary: "₹2.5–4 LPA", desc: "Provide compassionate daily care for elderly patients. Experience in geriatric nursing or dementia care preferred." },
  { id: 4, title: "City Operations Manager", dept: "Operations", location: "Chennai / Hyderabad", type: "Full-Time", salary: "₹8–12 LPA", desc: "Lead ground operations in your city — nurse deployment, patient satisfaction, partner relations, and team management." },
  { id: 5, title: "Product Manager – Health Tech", dept: "Technology", location: "Remote / Mumbai", type: "Full-Time", salary: "₹15–22 LPA", desc: "Drive the product roadmap for our nurse-matching and health-monitoring platform used by 50,000+ patients." },
  { id: 6, title: "Customer Experience Associate", dept: "Support", location: "Remote", type: "Full-Time", salary: "₹3–4.5 LPA", desc: "Be the first point of contact for patients and families. Handle bookings, resolve concerns, and ensure exceptional experiences." },
];

const PERKS = [
  { icon: "💰", title: "Competitive Pay", desc: "Top-market salaries with performance bonuses" },
  { icon: "🏥", title: "Health Insurance", desc: "Comprehensive cover for you and your family" },
  { icon: "📚", title: "Learning Budget", desc: "₹30,000/year for certifications and courses" },
  { icon: "🏠", title: "Remote Options", desc: "Flexible work-from-home for non-clinical roles" },
  { icon: "🚀", title: "Fast Growth", desc: "Own projects from day one. Grow with the company." },
  { icon: "❤️", title: "Meaningful Work", desc: "Every day you directly improve patients' lives." },
];

export default function CareersPage() {
  const [openJob, setOpenJob] = useState(null);
  const [applied, setApplied] = useState(null);
  const navigate = useNavigate();

  return (
    <div style={{ background: COLORS.cream, minHeight: "100vh", paddingTop: 100 }}>
      {/* HERO */}
      <div style={{ background: COLORS.navy, padding: "80px 48px 96px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: 56, fontWeight: 900, color: COLORS.white, fontFamily: "'Playfair Display', Georgia, serif", margin: "0 0 16px" }}>
            Build the Future of<br /><span style={{ color: COLORS.teal }}>Home Healthcare</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            style={{ fontSize: 18, color: "rgba(255,255,255,0.65)", fontFamily: "'DM Sans', sans-serif", maxWidth: 550, margin: "0 auto" }}>
            Join 1,200+ nurses and 200+ team members on a mission to transform healthcare for Indian families.
          </motion.p>
          <div style={{ display: "flex", justifyContent: "center", gap: 40, marginTop: 40 }}>
            {[["200+","Team Members"],["35","Cities"],["4.6★","Glassdoor"]].map(([v,l]) => (
              <motion.div key={l} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: COLORS.teal, fontFamily: "'DM Sans', sans-serif" }}>{v}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans', sans-serif" }}>{l}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* PERKS */}
      <div style={{ maxWidth: 1100, margin: "-32px auto 0", padding: "0 24px 64px" }}>
        <motion.div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 64 }}
          initial="hidden" animate="show" variants={stagger}>
          {PERKS.map(p => (
            <motion.div key={p.title} variants={fadeUp}
              style={{ background: COLORS.white, borderRadius: 16, padding: 24, display: "flex", gap: 16 }}>
              <div style={{ fontSize: 36, flexShrink: 0 }}>{p.icon}</div>
              <div>
                <h4 style={{ fontSize: 16, fontWeight: 800, color: COLORS.navy, margin: "0 0 6px", fontFamily: "'DM Sans', sans-serif" }}>{p.title}</h4>
                <p style={{ fontSize: 13, color: COLORS.slate, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* JOBS */}
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ fontSize: 36, fontWeight: 900, color: COLORS.navy, fontFamily: "'Playfair Display', Georgia, serif", margin: "0 0 32px" }}>
          Open Positions
        </motion.h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {JOBS.map(job => (
            <motion.div key={job.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              style={{ background: COLORS.white, borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
              <div style={{ padding: "24px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
                onClick={() => setOpenJob(openJob === job.id ? null : job.id)}>
                <div>
                  <div style={{ display: "flex", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                    <span style={{ background: "#E8F6FF", color: COLORS.teal, fontSize: 11, fontWeight: 700, borderRadius: 20, padding: "3px 10px", fontFamily: "'DM Sans', sans-serif" }}>{job.dept}</span>
                    <span style={{ background: "#F8F5F0", color: COLORS.slate, fontSize: 11, fontWeight: 600, borderRadius: 20, padding: "3px 10px", fontFamily: "'DM Sans', sans-serif" }}>📍 {job.location}</span>
                    <span style={{ background: "#FFF0F5", color: COLORS.rose, fontSize: 11, fontWeight: 600, borderRadius: 20, padding: "3px 10px", fontFamily: "'DM Sans', sans-serif" }}>{job.type}</span>
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: COLORS.navy, margin: "0 0 4px", fontFamily: "'DM Sans', sans-serif" }}>{job.title}</h3>
                  <span style={{ fontSize: 14, color: COLORS.teal, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>{job.salary}</span>
                </div>
                <motion.div animate={{ rotate: openJob === job.id ? 180 : 0 }} style={{ fontSize: 20, color: COLORS.slate }}>▼</motion.div>
              </div>
              <AnimatePresence>
                {openJob === job.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    style={{ borderTop: "1px solid #F0F0F0", padding: "24px 28px", overflow: "hidden" }}>
                    <p style={{ color: COLORS.slate, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.7, marginBottom: 20 }}>{job.desc}</p>
                    {applied === job.id ? (
                      <div style={{ background: "#F0FFF4", color: "#276749", borderRadius: 10, padding: "12px 16px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>
                        ✅ Application submitted! We'll reach out within 3 business days.
                      </div>
                    ) : (
                      <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                        onClick={() => setApplied(job.id)}
                        style={{ background: COLORS.teal, color: COLORS.white, border: "none", borderRadius: 10, padding: "12px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                        Apply Now →
                      </motion.button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
