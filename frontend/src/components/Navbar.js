import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

/* ── All 6 services — kept in sync with backend ─────────── */
const SERVICE_ITEMS = [
  { icon: "🏥", title: "Post-Surgery Care",      desc: "Recovery support after hospital discharge",   slug: "post-surgery"   },
  { icon: "👴", title: "Elderly Care",            desc: "Daily assistance & companionship for seniors", slug: "elderly-care"   },
  { icon: "🧑‍⚕️", title: "ICU at Home",           desc: "Critical care with advanced equipment",        slug: "icu-at-home"    },
  { icon: "💊", title: "Medication Management",  desc: "Safe, timely medication administration",       slug: "medication"     },
  { icon: "🩺", title: "Physiotherapy",          desc: "In-home rehab & mobility recovery",            slug: "physiotherapy"  },
  { icon: "🧠", title: "Dementia Care",           desc: "Specialist support for memory conditions",     slug: "dementia-care"  },
];

function ServicesDropdown({ active, navigate }) {
  const [open, setOpen] = useState(false);
  const ref             = useRef(null);
  const closeTimer      = useRef(null);

  const handleMouseEnter = () => {
    clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const handleMouseLeave = () => {
    /* Small delay so cursor can move into the dropdown panel */
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  return (
    <div
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ position: "relative" }}
    >
      {/* Trigger */}
      <div
        onClick={() => navigate("/services")}
        style={{
          display: "flex", alignItems: "center", gap: 5,
          color: active ? "#00CEC3" : "rgba(255,255,255,0.85)",
          fontSize: 14, fontWeight: active ? 700 : 500,
          fontFamily: "'DM Sans', sans-serif",
          cursor: "pointer", whiteSpace: "nowrap",
          transition: "color 0.2s",
          userSelect: "none",
        }}
      >
        Services
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ fontSize: 9, opacity: 0.7, display: "inline-block" }}
        >
          ▼
        </motion.span>
      </div>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{    opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            style={{
              position: "absolute",
              top: "calc(100% + 16px)",
              left: "50%",
              transform: "translateX(-50%)",
              width: 480,
              background: "rgba(11,29,58,0.98)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(0,169,157,0.25)",
              borderRadius: 20,
              padding: 16,
              boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
              zIndex: 300,
            }}
          >
            {/* Arrow pointer */}
            <div style={{
              position: "absolute", top: -7, left: "50%",
              transform: "translateX(-50%)",
              width: 14, height: 14,
              background: "rgba(11,29,58,0.98)",
              border: "1px solid rgba(0,169,157,0.25)",
              borderRight: "none", borderBottom: "none",
              rotate: "45deg",
            }} />

            {/* Header */}
            <div style={{ padding: "4px 8px 12px", borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#00A99D", letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>
                Our Services
              </span>
            </div>

            {/* 2-col grid of service items */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
              {SERVICE_ITEMS.map((s) => (
                <motion.div
                  key={s.slug}
                  whileHover={{ background: "rgba(0,169,157,0.12)", x: 2 }}
                  onClick={() => { navigate(`/services/${s.slug}`); setOpen(false); }}
                  style={{
                    display: "flex", alignItems: "flex-start", gap: 12,
                    padding: "11px 12px", borderRadius: 12, cursor: "pointer",
                    background: "rgba(0,0,0,0)",
                    transition: "background 0.15s",
                  }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: "rgba(0,169,157,0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 18,
                  }}>
                    {s.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", fontFamily: "'DM Sans', sans-serif", marginBottom: 2 }}>
                      {s.title}
                    </div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.4 }}>
                      {s.desc}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer CTA */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", marginTop: 8, paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 8px 4px" }}>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif" }}>
                All services include verified nurses
              </span>
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                onClick={() => { navigate("/services"); setOpen(false); }}
                style={{
                  background: "#00A99D", color: "#fff", border: "none",
                  borderRadius: 8, padding: "7px 16px", fontSize: 12,
                  fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                }}
              >
                View All →
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [userMenu,  setUserMenu]  = useState(false);
  const [isMobile,  setIsMobile]  = useState(false);
  const theme                     = useTheme();
  const { user, isLoggedIn, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const isHome    = location.pathname === "/";

  /* ── Scroll listener ── */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* ── Mobile detection — JS-driven, 100% reliable ── */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 900);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ── Close menus on route change ── */
  useEffect(() => { setMenuOpen(false); setUserMenu(false); }, [location.pathname]);

  /* ── Close drawer on outside click ── */
  useEffect(() => {
    if (!menuOpen) return;
    const fn = (e) => {
      if (!e.target.closest(".mobile-drawer") && !e.target.closest(".hamburger-btn")) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [menuOpen]);

  const navLinks = [
    { label: "Services",     path: "/services"     },
    { label: "How It Works", path: "/how-it-works" },
    { label: "Caregivers",   path: "/caregivers"   },
    { label: "Testimonials", path: "/testimonials" },
    { label: "Pricing",      path: "/pricing"      },
    { label: "Contact",      path: "/contact"      },
  ];

  const navBg = scrolled || !isHome
    ? theme.isDark ? "rgba(13,17,23,0.97)" : "rgba(11,29,58,0.97)"
    : "transparent";

  return (
    <>
      <motion.nav
        initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.6 }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          background: navBg,
          backdropFilter: scrolled ? "blur(14px)" : "none",
          boxShadow: scrolled ? "0 2px 24px rgba(0,0,0,0.25)" : "none",
          transition: "all 0.3s ease",
          padding: isMobile ? "0 16px" : "0 32px",
          display: "flex", alignItems: "center",
          justifyContent: "space-between", height: 68,
        }}
      >
        {/* ── Logo ── */}
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <motion.div whileHover={{ scale: 1.07 }} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, background: "linear-gradient(135deg,#00A99D,#00CEC3)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🩺</div>
            <span style={{ fontSize: isMobile ? 17 : 20, fontWeight: 800, color: "#fff", fontFamily: "'Playfair Display', Georgia, serif" }}>NurtureCare</span>
          </motion.div>
        </Link>

        {/* ── Desktop nav links ── */}
        {!isMobile && (
          <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
            {navLinks.map(({ label, path }) =>
              label === "Services"
                ? <ServicesDropdown key={path} active={location.pathname.startsWith("/services")} navigate={navigate} />
                : (
                  <Link key={path} to={path} style={{ textDecoration: "none" }}>
                    <motion.span
                      whileHover={{ color: "#00CEC3" }}
                      style={{
                        color: location.pathname === path ? "#00CEC3" : "rgba(255,255,255,0.85)",
                        fontSize: 14, fontWeight: location.pathname === path ? 700 : 500,
                        fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
                        whiteSpace: "nowrap", transition: "color 0.2s",
                      }}
                    >
                      {label}
                    </motion.span>
                  </Link>
                )
            )}
          </div>
        )}

        {/* ── Right actions ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

          {/* Theme toggle — always visible */}
          <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={theme.toggle}
            style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
          >
            {theme.isDark ? "☀️" : "🌙"}
          </motion.button>

          {/* Desktop auth buttons */}
          {!isMobile && (
            isLoggedIn ? (
              <div style={{ position: "relative" }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setUserMenu(v => !v)}
                  style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(0,169,157,0.2)", border: "1px solid rgba(0,169,157,0.4)", borderRadius: 20, padding: "6px 14px 6px 6px", cursor: "pointer" }}
                >
                  <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#00A99D,#00CEC3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ color: "#fff", fontSize: 13, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", maxWidth: 90, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {user?.name?.split(" ")[0]}
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 10 }}>▼</span>
                </motion.button>
                <AnimatePresence>
                  {userMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, background: theme.bgCard, borderRadius: 16, padding: 8, minWidth: 180, boxShadow: theme.shadowLg, border: `1px solid ${theme.border}`, zIndex: 200 }}
                    >
                      <div style={{ padding: "10px 14px", borderBottom: `1px solid ${theme.border}`, marginBottom: 4 }}>
                        <div style={{ fontSize: 14, fontWeight: 800, color: theme.text, fontFamily: "'DM Sans', sans-serif" }}>{user?.name}</div>
                        <div style={{ fontSize: 12, color: theme.textMuted, fontFamily: "'DM Sans', sans-serif" }}>{user?.email}</div>
                      </div>
                      {[["📅 My Bookings", "/my-bookings"], ["👤 Profile", "/profile"]].map(([label, path]) => (
                        <button key={path} onClick={() => { navigate(path); setUserMenu(false); }}
                          style={{ display: "block", width: "100%", padding: "10px 14px", background: "none", border: "none", textAlign: "left", color: theme.text, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", borderRadius: 10 }}>
                          {label}
                        </button>
                      ))}
                      <button onClick={() => { logout(); navigate("/"); }}
                        style={{ display: "block", width: "100%", padding: "10px 14px", background: "none", border: "none", textAlign: "left", color: "#FF6B8A", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", borderRadius: 10 }}>
                        🚪 Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 8 }}>
                <motion.button whileHover={{ scale: 1.04 }} onClick={() => navigate("/login")}
                  style={{ background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 10, padding: "8px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                  Sign In
                </motion.button>
                <motion.button whileHover={{ scale: 1.04 }} onClick={() => navigate("/book")}
                  style={{ background: "#00A99D", color: "#fff", border: "none", borderRadius: 10, padding: "8px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                  Book Now
                </motion.button>
              </div>
            )
          )}

          {/* ── Hamburger — only on mobile, JS-driven ── */}
          {isMobile && (
            <button
              className="hamburger-btn"
              onClick={() => setMenuOpen(v => !v)}
              style={{
                width: 42, height: 42, borderRadius: 10,
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.2)",
                cursor: "pointer", display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: 5,
                flexShrink: 0,
              }}
            >
              <span style={{
                display: "block", width: 22, height: 2, background: "#fff", borderRadius: 2,
                transformOrigin: "center",
                transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none",
                transition: "transform 0.25s ease",
              }} />
              <span style={{
                display: "block", width: 22, height: 2, background: "#fff", borderRadius: 2,
                opacity: menuOpen ? 0 : 1,
                transition: "opacity 0.2s ease",
              }} />
              <span style={{
                display: "block", width: 22, height: 2, background: "#fff", borderRadius: 2,
                transformOrigin: "center",
                transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none",
                transition: "transform 0.25s ease",
              }} />
            </button>
          )}
        </div>
      </motion.nav>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {menuOpen && isMobile && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 98 }}
            />

            {/* Drawer panel */}
            <motion.div
              key="drawer"
              className="mobile-drawer"
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              style={{
                position: "fixed", top: 0, right: 0, bottom: 0,
                width: "78%", maxWidth: 310,
                background: theme.bgCard,
                zIndex: 99,
                display: "flex", flexDirection: "column",
                overflowY: "auto",
              }}
            >
              {/* Drawer header */}
              <div style={{ padding: "20px 20px 12px", borderBottom: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 30, height: 30, background: "linear-gradient(135deg,#00A99D,#00CEC3)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>🩺</div>
                  <span style={{ fontSize: 16, fontWeight: 800, color: theme.text, fontFamily: "'Playfair Display', Georgia, serif" }}>NurtureCare</span>
                </div>
                <button onClick={() => setMenuOpen(false)}
                  style={{ width: 32, height: 32, borderRadius: 8, background: theme.bgSecondary, border: `1px solid ${theme.border}`, cursor: "pointer", fontSize: 16, color: theme.text, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  ✕
                </button>
              </div>

              {/* Nav links */}
              <div style={{ padding: "12px 12px", flex: 1 }}>
                {navLinks.map(({ label, path }) => (
                  <Link key={path} to={path} style={{ textDecoration: "none" }} onClick={() => setMenuOpen(false)}>
                    <div style={{
                      padding: "13px 16px", borderRadius: 12, marginBottom: 4,
                      fontSize: 15, fontWeight: location.pathname === path ? 800 : 600,
                      color: location.pathname === path ? "#00A99D" : theme.text,
                      background: location.pathname === path ? "rgba(0,169,157,0.1)" : "transparent",
                      fontFamily: "'DM Sans', sans-serif",
                      borderLeft: location.pathname === path ? "3px solid #00A99D" : "3px solid transparent",
                      transition: "all 0.15s",
                    }}>
                      {label}
                    </div>
                  </Link>
                ))}
              </div>

              {/* Auth footer */}
              <div style={{ padding: "12px 12px 28px", borderTop: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", gap: 10 }}>
                {isLoggedIn ? (
                  <>
                    <div style={{ padding: "12px 16px", background: "rgba(0,169,157,0.08)", borderRadius: 12, border: "1px solid rgba(0,169,157,0.2)" }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: theme.text, fontFamily: "'DM Sans', sans-serif" }}>👤 {user?.name}</div>
                      <div style={{ fontSize: 11, color: theme.textMuted, fontFamily: "'DM Sans', sans-serif" }}>{user?.email}</div>
                    </div>
                    <button onClick={() => { navigate("/my-bookings"); setMenuOpen(false); }}
                      style={{ padding: "13px", borderRadius: 12, background: theme.bgSecondary, border: `1px solid ${theme.border}`, color: theme.text, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                      📅 My Bookings
                    </button>
                    <button onClick={() => { logout(); navigate("/"); setMenuOpen(false); }}
                      style={{ padding: "13px", borderRadius: 12, background: "rgba(255,107,138,0.1)", border: "1px solid rgba(255,107,138,0.3)", color: "#FF6B8A", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { navigate("/login"); setMenuOpen(false); }}
                      style={{ padding: "13px", borderRadius: 12, background: "transparent", border: `1px solid ${theme.border}`, color: theme.text, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                      Sign In
                    </button>
                    <button onClick={() => { navigate("/book"); setMenuOpen(false); }}
                      style={{ padding: "13px", borderRadius: 12, background: "#00A99D", border: "none", color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                      Book a Nurse 🩺
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}