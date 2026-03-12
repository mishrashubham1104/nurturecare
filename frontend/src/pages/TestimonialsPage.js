import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { COLORS } from "../constants";
import { useApp } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";

/* ── Desktop card (grid layout) ───────────────────────────── */
function TestimonialCard({ t, index }) {
  const ref   = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const theme  = useTheme();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -6, boxShadow: theme.shadowLg }}
      style={{ background: theme.bgCard, borderRadius: 20, padding: 28,
        border: `1px solid ${theme.border}`, transition: "background 0.3s" }}
    >
      <CardBody t={t} theme={theme} />
    </motion.div>
  );
}

/* ── Shared card body ─────────────────────────────────────── */
function CardBody({ t, theme }) {
  return (
    <>
      <div style={{ fontSize: 22, marginBottom: 10 }}>{"⭐".repeat(t.stars)}</div>
      <div style={{ background: theme.isDark ? "rgba(0,169,157,0.15)" : "#E8F6FF", color: COLORS.teal,
        fontSize: 11, fontWeight: 700, borderRadius: 20, padding: "3px 10px",
        display: "inline-block", fontFamily: "'DM Sans', sans-serif", marginBottom: 14 }}>
        {t.service}
      </div>
      <p style={{ fontSize: 15, color: theme.text, lineHeight: 1.7,
        fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", margin: "0 0 20px" }}>
        "{t.text}"
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
          background: `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.tealLight})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: COLORS.white, fontWeight: 800, fontSize: 18, fontFamily: "'DM Sans', sans-serif" }}>
          {t.name.charAt(0)}
        </div>
        <div>
          <div style={{ fontWeight: 800, color: theme.text, fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>{t.name}</div>
          <div style={{ fontSize: 12, color: theme.textMuted, fontFamily: "'DM Sans', sans-serif" }}>{t.city}</div>
        </div>
      </div>
    </>
  );
}

/* ── Mobile snap carousel ─────────────────────────────────── */
function MobileCarousel({ all }) {
  const theme                     = useTheme();
  const [active, setActive]       = useState(0);
  const [direction, setDirection] = useState(0);
  const touchStartY               = useRef(null);
  const containerRef              = useRef(null);

  const goTo = (next) => {
    if (next < 0 || next >= all.length) return;
    setDirection(next > active ? 1 : -1);
    setActive(next);
  };

  /* touch swipe */
  const onTouchStart = (e) => { touchStartY.current = e.touches[0].clientY; };
  const onTouchEnd   = (e) => {
    if (touchStartY.current === null) return;
    const diff = touchStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(diff) > 40) goTo(diff > 0 ? active + 1 : active - 1);
    touchStartY.current = null;
  };

  /* wheel scroll */
  const onWheel = (e) => {
    e.preventDefault();
    goTo(e.deltaY > 0 ? active + 1 : active - 1);
  };

  const variants = {
    enter:  (d) => ({ y: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { y: 0, opacity: 1 },
    exit:   (d) => ({ y: d > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {/* Card viewport */}
      <div
        ref={containerRef}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onWheel={onWheel}
        style={{ position: "relative", overflow: "hidden", borderRadius: 20,
          minHeight: 320, touchAction: "none" }}
      >
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={active}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.38, ease: [0.32, 0.72, 0, 1] }}
            style={{ background: theme.bgCard, borderRadius: 20, padding: 28,
              border: `1px solid ${theme.border}`, transition: "background 0.3s" }}
          >
            <CardBody t={all[active]} theme={theme} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dot indicators */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 20 }}>
        {all.map((_, i) => (
          <button key={i} onClick={() => goTo(i)}
            style={{ width: i === active ? 24 : 8, height: 8, borderRadius: 4,
              background: i === active ? COLORS.teal : theme.border,
              border: "none", cursor: "pointer", padding: 0,
              transition: "all 0.3s ease" }} />
        ))}
      </div>

      {/* Prev / Next arrows */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, gap: 12 }}>
        <motion.button whileTap={{ scale: 0.93 }} onClick={() => goTo(active - 1)}
          disabled={active === 0}
          style={{ flex: 1, padding: "12px", borderRadius: 12, border: `1px solid ${theme.border}`,
            background: theme.bgCard, color: active === 0 ? theme.textMuted : theme.text,
            fontSize: 20, cursor: active === 0 ? "not-allowed" : "pointer",
            opacity: active === 0 ? 0.4 : 1, transition: "all 0.2s" }}>
          ↑ Prev
        </motion.button>
        <motion.button whileTap={{ scale: 0.93 }} onClick={() => goTo(active + 1)}
          disabled={active === all.length - 1}
          style={{ flex: 1, padding: "12px", borderRadius: 12, border: "none",
            background: active === all.length - 1 ? theme.bgSecondary : COLORS.teal,
            color: COLORS.white, fontSize: 16, fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
            cursor: active === all.length - 1 ? "not-allowed" : "pointer",
            opacity: active === all.length - 1 ? 0.5 : 1, transition: "all 0.2s" }}>
          Next ↓
        </motion.button>
      </div>

      {/* Counter */}
      <p style={{ textAlign: "center", marginTop: 12, fontSize: 13, color: theme.textMuted,
        fontFamily: "'DM Sans', sans-serif" }}>
        {active + 1} of {all.length}
      </p>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────── */
export default function TestimonialsPage() {
  const { testimonials, fetchTestimonials } = useApp();
  const theme = useTheme();
  useEffect(() => { fetchTestimonials(); }, []);

  const EXTRA = [
    { id: 10, name: "Deepa Menon",    city: "Kochi",     stars: 5, service: "Post-Surgery Care", text: "After my father's bypass surgery, we were terrified about home care. NurtureCare assigned a nurse who was not just skilled but truly compassionate." },
    { id: 11, name: "Amit Chowdhury", city: "Kolkata",   stars: 5, service: "Elderly Care",      text: "My 85-year-old grandmother has been in the care of NurtureCare for 6 months now. She's happier, healthier, and we have total peace of mind." },
    { id: 12, name: "Pooja Iyer",     city: "Hyderabad", stars: 4, service: "Physiotherapy",     text: "Rajesh's physiotherapy sessions helped my husband regain 80% mobility after his stroke. Truly remarkable results." },
  ];

  const all = [...testimonials, ...EXTRA];

  return (
    <div style={{ background: theme.bg, minHeight: "100vh", paddingTop: 100, transition: "background 0.3s" }}>

      {/* Hero */}
      <div style={{ background: COLORS.navy, padding: "clamp(48px,8vw,80px) clamp(20px,5vw,48px) clamp(60px,10vw,96px)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: "clamp(32px,6vw,56px)", fontWeight: 900, color: COLORS.white,
              fontFamily: "'Playfair Display', Georgia, serif", margin: "0 0 16px" }}>
            What Families Say
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ fontSize: "clamp(14px,2vw,18px)", color: "rgba(255,255,255,0.65)",
              fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6 }}>
            Real stories from real families who trusted NurtureCare.
          </motion.p>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "clamp(20px,5vw,40px)", marginTop: 32 }}>
            {[["4.9★","Average Rating"],["50K+","Happy Patients"],["98%","Would Recommend"]].map(([v,l]) => (
              <div key={l} style={{ textAlign: "center", minWidth: 80 }}>
                <div style={{ fontSize: "clamp(22px,4vw,32px)", fontWeight: 900, color: COLORS.teal, fontFamily: "'DM Sans', sans-serif" }}>{v}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans', sans-serif" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cards */}
      <div style={{ maxWidth: 1100, margin: "-32px auto 0", padding: "0 clamp(16px,4vw,24px) 96px" }}>

        {/* Desktop: 3-col grid */}
        <div className="t-desktop" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
          {all.map((t, i) => <TestimonialCard key={t.id ?? i} t={t} index={i} />)}
        </div>

        {/* Mobile: animated snap carousel — swipe up/down or tap Prev/Next */}
        <div className="t-mobile" style={{ display: "none" }}>
          <MobileCarousel all={all} />
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .t-desktop { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 600px) { .t-desktop { display: none !important; } .t-mobile { display: block !important; } }
      `}</style>
    </div>
  );
}