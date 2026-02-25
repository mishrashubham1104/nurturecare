
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [menuOpen, setMenuOpen]     = useState(false);
  const [userMenu, setUserMenu]     = useState(false);
  const theme                       = useTheme();
  const { user, isLoggedIn, logout} = useAuth();
  const navigate                    = useNavigate();
  const location                    = useLocation();
  const isHome                      = location.pathname === "/";

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Close menus on route change
  useEffect(() => { setMenuOpen(false); setUserMenu(false); }, [location.pathname]);

  const navLinks = [
    { label: "Services",      path: "/services" },
    { label: "How It Works",  path: "/how-it-works" },
    { label: "Caregivers",    path: "/caregivers" },
    { label: "Testimonials",  path: "/testimonials" },
    { label: "Pricing",       path: "/pricing" },
    { label: "Contact",       path: "/contact" },
  ];

  const navBg = scrolled || !isHome
    ? theme.isDark ? "rgba(13,17,23,0.97)" : "rgba(11,29,58,0.97)"
    : "transparent";

  return (
    <>
      <motion.nav initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.6 }}
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          background: navBg, backdropFilter: scrolled ? "blur(14px)" : "none",
          boxShadow: scrolled ? "0 2px 24px rgba(0,0,0,0.25)" : "none",
          transition: "all 0.3s ease", padding: "0 24px", display: "flex",
          alignItems: "center", justifyContent: "space-between", height: 68 }}>

        {/* Logo */}
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <motion.div whileHover={{ scale: 1.07 }} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, background: "linear-gradient(135deg,#00A99D,#00CEC3)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🩺</div>
            <span style={{ fontSize: 20, fontWeight: 800, color: "#fff", fontFamily: "'Playfair Display', Georgia, serif" }}>NurtureCare</span>
          </motion.div>
        </Link>

        {/* Desktop links */}
        <div style={{ display: "flex", gap: 28, alignItems: "center" }} className="desktop-nav">
          {navLinks.map(({ label, path }) => (
            <Link key={path} to={path} style={{ textDecoration: "none" }}>
              <motion.span whileHover={{ color: "#00CEC3" }}
                style={{ color: location.pathname === path ? "#00CEC3" : "rgba(255,255,255,0.8)",
                  fontSize: 14, fontWeight: location.pathname === path ? 700 : 500,
                  fontFamily: "'DM Sans', sans-serif", transition: "color 0.2s", cursor: "pointer" }}>
                {label}
              </motion.span>
            </Link>
          ))}
        </div>

        {/* Right side actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Dark / Light Toggle */}
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={theme.toggle}
            style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {theme.isDark ? "☀️" : "🌙"}
          </motion.button>

          {isLoggedIn ? (
            <div style={{ position: "relative" }}>
              <motion.button whileHover={{ scale: 1.05 }} onClick={() => setUserMenu(v => !v)}
                style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(0,169,157,0.2)", border: "1px solid rgba(0,169,157,0.4)", borderRadius: 20, padding: "6px 14px 6px 6px", cursor: "pointer" }}>
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
                  <motion.div initial={{ opacity: 0, y: -8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, background: theme.bgCard, borderRadius: 16, padding: 8, minWidth: 180, boxShadow: theme.shadowLg, border: `1px solid ${theme.border}`, zIndex: 200 }}>
                    <div style={{ padding: "10px 14px", borderBottom: `1px solid ${theme.border}`, marginBottom: 4 }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: theme.text, fontFamily: "'DM Sans', sans-serif" }}>{user?.name}</div>
                      <div style={{ fontSize: 12, color: theme.textMuted, fontFamily: "'DM Sans', sans-serif" }}>{user?.email}</div>
                    </div>
                    {[["📅 My Bookings", "/my-bookings"], ["👤 Profile", "/profile"]].map(([label, path]) => (
                      <button key={path} onClick={() => navigate(path)}
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
          )}

          {/* Hamburger */}
          <motion.button whileHover={{ scale: 1.1 }} onClick={() => setMenuOpen(v => !v)}
            style={{ display: "none", width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5 }}
            className="hamburger">
            {[0, 1, 2].map(i => (
              <motion.span key={i}
                animate={{ rotate: menuOpen && i === 0 ? 45 : menuOpen && i === 2 ? -45 : 0, y: menuOpen && i === 0 ? 8 : menuOpen && i === 2 ? -8 : 0, opacity: menuOpen && i === 1 ? 0 : 1 }}
                style={{ display: "block", width: 22, height: 2, background: "#fff", borderRadius: 2 }} />
            ))}
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 98 }} />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25 }}
              style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "80%", maxWidth: 320, background: theme.bgCard, zIndex: 99, padding: "80px 24px 40px", display: "flex", flexDirection: "column", gap: 4, overflowY: "auto" }}>
              {navLinks.map(({ label, path }) => (
                <Link key={path} to={path} style={{ textDecoration: "none" }} onClick={() => setMenuOpen(false)}>
                  <motion.div whileHover={{ x: 4 }}
                    style={{ padding: "14px 16px", borderRadius: 12, fontSize: 16, fontWeight: location.pathname === path ? 800 : 600,
                      color: location.pathname === path ? "#00A99D" : theme.text,
                      background: location.pathname === path ? "rgba(0,169,157,0.1)" : "transparent",
                      fontFamily: "'DM Sans', sans-serif" }}>
                    {label}
                  </motion.div>
                </Link>
              ))}
              <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
                {isLoggedIn ? (
                  <>
                    <div style={{ padding: "12px 16px", background: "rgba(0,169,157,0.1)", borderRadius: 12 }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: theme.text, fontFamily: "'DM Sans', sans-serif" }}>👤 {user?.name}</div>
                      <div style={{ fontSize: 12, color: theme.textMuted, fontFamily: "'DM Sans', sans-serif" }}>{user?.email}</div>
                    </div>
                    <button onClick={() => { logout(); navigate("/"); setMenuOpen(false); }}
                      style={{ padding: "14px", borderRadius: 12, background: "rgba(255,107,138,0.1)", border: "1px solid rgba(255,107,138,0.3)", color: "#FF6B8A", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { navigate("/login"); setMenuOpen(false); }}
                      style={{ padding: "14px", borderRadius: 12, background: "transparent", border: `1px solid ${theme.border}`, color: theme.text, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                      Sign In
                    </button>
                    <button onClick={() => { navigate("/book"); setMenuOpen(false); }}
                      style={{ padding: "14px", borderRadius: 12, background: "#00A99D", border: "none", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                      Book a Nurse
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .hamburger   { display: flex !important; }
        }
      `}</style>
    </>
  );
}
