import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { COLORS } from "../constants";
import { useApp } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const EXTRA = [
  { id: 101, name: "Deepa Menon",    city: "Kochi",     stars: 5, service: "Post-Surgery Care", text: "After my father's bypass surgery, we were terrified about home care. NurtureCare assigned a nurse who was not just skilled but truly compassionate." },
  { id: 102, name: "Amit Chowdhury", city: "Kolkata",   stars: 5, service: "Elderly Care",      text: "My 85-year-old grandmother has been in the care of NurtureCare for 6 months now. She's happier, healthier, and we have total peace of mind." },
  { id: 103, name: "Pooja Iyer",     city: "Hyderabad", stars: 4, service: "Physiotherapy",     text: "Rajesh's physiotherapy sessions helped my husband regain 80% mobility after his stroke. Truly remarkable results." },
  { id: 104, name: "Karan Mehta",    city: "Pune",      stars: 5, service: "ICU at Home",       text: "When my mother needed ICU-level care at home, NurtureCare delivered. The nurse was outstanding — calm, skilled, and endlessly patient." },
  { id: 105, name: "Sunita Rao",     city: "Chennai",   stars: 5, service: "Dementia Care",     text: "Caring for a parent with dementia is overwhelming. NurtureCare's specialist was a blessing — gentle, knowledgeable, and always present." },
];

/* ── Desktop grid card ───────────────────────────────────── */
function GridCard({ t, index }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const theme  = useTheme();
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      whileHover={{ y: -6, boxShadow: theme.shadowLg }}
      style={{
        background: theme.bgCard, borderRadius: 20, padding: 24,
        border: `1px solid ${theme.border}`, transition: "background 0.3s",
        display: "flex", flexDirection: "column",
      }}
    >
      <div style={{ fontSize: 18, marginBottom: 8 }}>{"⭐".repeat(Math.min(t.stars, 5))}</div>
      <div style={{
        background: theme.isDark ? "rgba(0,169,157,0.15)" : "#E8F6FF",
        color: COLORS.teal, fontSize: 11, fontWeight: 700,
        borderRadius: 20, padding: "3px 10px", display: "inline-block",
        fontFamily: "'DM Sans', sans-serif", marginBottom: 12,
      }}>
        {t.service}
      </div>
      <p style={{
        fontSize: 14, color: theme.text, lineHeight: 1.7,
        fontFamily: "'Playfair Display', Georgia, serif",
        fontStyle: "italic", margin: "0 0 16px", flex: 1,
      }}>
        "{t.text}"
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
          background: `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.tealLight})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontWeight: 800, fontSize: 15, fontFamily: "'DM Sans', sans-serif",
        }}>
          {t.name.charAt(0)}
        </div>
        <div>
          <div style={{ fontWeight: 800, color: theme.text, fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>{t.name}</div>
          <div style={{ fontSize: 11, color: theme.textMuted, fontFamily: "'DM Sans', sans-serif" }}>{t.city}</div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Page ─────────────────────────────────────────────────── */
export default function TestimonialsPage() {
  const { testimonials: ctxT, fetchTestimonials } = useApp();
  const theme = useTheme();
  const [all, setAll]                   = useState([]);
  const [activeTestimonial, setActive]  = useState(0);
  const timerRef                        = useRef(null);

  /* ── Load cards ── */
  useEffect(() => {
    fetchTestimonials();
    const load = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/testimonials`);
        const arr = Array.isArray(data) ? data
                  : Array.isArray(data?.data) ? data.data : [];
        const ids = new Set(arr.map(t => t.id));
        setAll([...arr, ...EXTRA.filter(e => !ids.has(e.id))]);
      } catch {
        const arr = Array.isArray(ctxT) ? ctxT : [];
        const ids = new Set(arr.map(t => t.id));
        setAll([...arr, ...EXTRA.filter(e => !ids.has(e.id))]);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (all.length === 0 && Array.isArray(ctxT) && ctxT.length > 0) {
      const ids = new Set(ctxT.map(t => t.id));
      setAll([...ctxT, ...EXTRA.filter(e => !ids.has(e.id))]);
    }
  }, [ctxT]);

  /* ── Auto-rotate — same 4s interval as HomePage ── */
  useEffect(() => {
    if (all.length === 0) return;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive(a => (a + 1) % all.length);
    }, 4000);
    return () => clearInterval(timerRef.current);
  }, [all.length]);

  const goTo = (i) => {
    setActive(i);
    /* reset timer so it doesn't immediately jump after manual tap */
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive(a => (a + 1) % all.length);
    }, 4000);
  };

  return (
    <div style={{ background: theme.bg, minHeight: "100vh", paddingTop: 100, transition: "background 0.3s" }}>

      {/* ── Hero ── */}
      <div style={{ background: COLORS.navy, padding: "clamp(40px,6vw,72px) clamp(20px,5vw,48px) clamp(48px,6vw,64px)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: "clamp(28px,6vw,56px)", fontWeight: 900, color: COLORS.white, fontFamily: "'Playfair Display', Georgia, serif", margin: "0 0 14px" }}
          >
            Families Trust NurtureCare
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            style={{ fontSize: "clamp(14px,2vw,18px)", color: "rgba(255,255,255,0.65)", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6, marginBottom: 32 }}
          >
            Real stories from real families who trusted us with their loved ones.
          </motion.p>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "clamp(20px,5vw,48px)" }}>
            {[["4.9★", "Average Rating"], ["50K+", "Happy Patients"], ["98%", "Would Recommend"]].map(([v, l]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "clamp(20px,4vw,32px)", fontWeight: 900, color: COLORS.teal, fontFamily: "'DM Sans', sans-serif" }}>{v}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", fontFamily: "'DM Sans', sans-serif" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          CAROUSEL SECTION — EXACT same look as HomePage
          "Families Trust NurtureCare" block.
          On MOBILE this is the ONLY view (grid is hidden).
          On DESKTOP this sits above the full grid.
          ════════════════════════════════════════════════════ */}
      <div style={{ background: "linear-gradient(135deg,#0B1D3A 0%,#0d2d4a 100%)", padding: "clamp(48px,7vw,96px) clamp(20px,5vw,48px)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>

          {all.length > 0 ? (
            <>
              {/* ── Active card — IDENTICAL markup to HomePage ── */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 24,
                    padding: "clamp(24px,5vw,48px)",
                  }}
                >
                  <div style={{ fontSize: 36, marginBottom: 16 }}>
                    {"⭐".repeat(Math.min(all[activeTestimonial].stars, 5))}
                  </div>
                  <p style={{
                    fontSize: "clamp(16px,2.5vw,22px)",
                    color: COLORS.white,
                    lineHeight: 1.7,
                    margin: "0 0 28px",
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontStyle: "italic",
                  }}>
                    "{all[activeTestimonial].text}"
                  </p>
                  <div style={{ fontWeight: 800, color: COLORS.teal, fontFamily: "'DM Sans', sans-serif", fontSize: 15 }}>
                    {all[activeTestimonial].name}
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, fontFamily: "'DM Sans', sans-serif", marginTop: 4 }}>
                    {all[activeTestimonial].city}
                    {all[activeTestimonial].service ? ` · ${all[activeTestimonial].service}` : ""}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* ── Dots — IDENTICAL to HomePage ── */}
              <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 28, flexWrap: "wrap" }}>
                {all.map((_, i) => (
                  <motion.button
                    key={i}
                    onClick={() => goTo(i)}
                    animate={{ width: i === activeTestimonial ? 28 : 8 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      height: 8, borderRadius: 4,
                      background: i === activeTestimonial ? COLORS.teal : "rgba(255,255,255,0.2)",
                      border: "none", cursor: "pointer", padding: 0,
                    }}
                  />
                ))}
              </div>
            </>
          ) : (
            <p style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif", padding: "40px 0" }}>Loading reviews…</p>
          )}
        </div>
      </div>

      {/* ── Full grid — hidden on mobile, visible on tablet+ ── */}
      <div className="t-grid-section" style={{ background: theme.bg, padding: "clamp(48px,6vw,80px) clamp(20px,5vw,48px)", transition: "background 0.3s" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: 36 }}
          >
            <span style={{ color: COLORS.teal, fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: 2, fontFamily: "'DM Sans', sans-serif" }}>All Reviews</span>
            <h2 style={{ fontSize: "clamp(22px,4vw,38px)", fontWeight: 900, color: theme.text, margin: "10px 0 0", fontFamily: "'Playfair Display', Georgia, serif" }}>
              Every Voice Matters
            </h2>
          </motion.div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
            {all.map((t, i) => <GridCard key={t.id ?? i} t={t} index={i} />)}
          </div>
        </div>
      </div>

      <style>{`
        /* On mobile: hide the full grid — carousel is enough */
        @media (max-width: 600px) {
          .t-grid-section { display: none !important; }
        }
      `}</style>

    </div>
  );
}