import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
// import instagramLogo from "../assets/instagram.png";
// import facebookLogo  from "../assets/facebook.png";

const SOCIAL = [
  // { name: "Facebook",  img: facebookLogo,  url: "https://facebook.com/nurturecare",           bg: "#1877F2" },
  // { name: "Instagram", img: instagramLogo, url: "https://instagram.com/nurturecare",          bg: "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)" },
  { name: "Twitter",   emoji: "𝕏",         url: "https://twitter.com/nurturecare",            bg: "#000" },
  { name: "LinkedIn",  emoji: "in",         url: "https://linkedin.com/company/nurturecare",   bg: "#0A66C2" },
];

const COLS = [
  ["Quick Links", [["Services", "/services"], ["How It Works", "/how-it-works"], ["Caregivers", "/caregivers"], ["Pricing", "/pricing"], ["Book a Nurse", "/book"]]],
  ["Company",     [["About Us", "/about"],    ["Careers", "/careers"],            ["Blog", "/blog"],            ["Contact", "/contact"], ["Partners", "/contact"]]],
  ["Support",     [["Help Center", "/help"],  ["Privacy Policy", "/privacy"],     ["Terms of Use", "/terms"],   ["Feedback", "/feedback"], ["Testimonials", "/testimonials"]]],
];

export default function Footer() {
  const theme = useTheme();
  const bg    = theme.isDark ? "#0d1117" : "#0B1D3A";
  const dim   = "rgba(255,255,255,0.38)";
  const bdr   = "rgba(255,255,255,0.07)";

  return (
    <footer style={{
      background: bg,
      padding: "clamp(36px,6vw,64px) clamp(16px,4vw,48px) 0",
      borderTop: `1px solid ${bdr}`,
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* ── Main grid ─────────────────────────────────── */}
        {/* Mobile: 1 col stacked; tablet 2 col; desktop 4 col */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "clamp(28px,5vw,48px)",
          marginBottom: "clamp(36px,5vw,56px)",
        }}>
          {/* Brand column */}
          <div>
            <Link to="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ width: 34, height: 34, background: "linear-gradient(135deg,#00A99D,#00CEC3)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>🩺</div>
              <span style={{ fontSize: 19, fontWeight: 800, color: "#fff", fontFamily: "'Playfair Display', Georgia, serif" }}>NurtureCare</span>
            </Link>
            <p style={{ color: dim, fontSize: 13, lineHeight: 1.75, maxWidth: 260, fontFamily: "'DM Sans', sans-serif", marginBottom: 22 }}>
              India's most trusted home nursing platform — professional, verified, and compassionate.
            </p>

            {/* Social icons */}
            <p style={{ color: "rgba(255,255,255,0.22)", fontSize: 11, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12 }}>
              Follow Us
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {SOCIAL.map(s => (
                <motion.a
                  key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
                  whileHover={{ scale: 1.12, y: -2 }} whileTap={{ scale: 0.90 }}
                  title={s.name}
                  style={{
                    width: 40, height: 40, borderRadius: 11,
                    background: s.bg,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    overflow: "hidden",
                    boxShadow: "0 3px 10px rgba(0,0,0,0.28)",
                    textDecoration: "none", flexShrink: 0,
                    /* minimum touch target */
                    minWidth: 40, minHeight: 40,
                  }}
                >
                  {s.img
                    ? <img src={s.img} alt={s.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <span style={{ color: "#fff", fontSize: s.emoji === "in" ? 14 : 13, fontWeight: 900, fontFamily: "'DM Sans', sans-serif" }}>{s.emoji}</span>
                  }
                </motion.a>
              ))}
            </div>
          </div>

          {/* Nav columns — shown in a sub-grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
            gap: "clamp(20px,4vw,40px)",
          }}>
            {COLS.map(([title, links]) => (
              <div key={title}>
                <h4 style={{ color: "#fff", fontSize: 13, fontWeight: 800, margin: "0 0 14px", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: 0.5 }}>
                  {title}
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                  {links.map(([label, path]) => (
                    <Link key={label} to={path} style={{ textDecoration: "none" }}>
                      <span style={{
                        color: dim, fontSize: 13, fontFamily: "'DM Sans', sans-serif",
                        cursor: "pointer", display: "block", transition: "color 0.2s",
                        lineHeight: 1.4,
                      }}>
                        {label}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div style={{
          borderTop: `1px solid ${bdr}`,
          padding: "20px 0 clamp(20px,4vw,28px)",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
        }}>
          <p style={{ color: "rgba(255,255,255,0.22)", fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>
            © {new Date().getFullYear()} NurtureCare. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "clamp(12px,3vw,20px)", flexWrap: "wrap" }}>
            {[["Privacy Policy", "/privacy"], ["Terms of Use", "/terms"], ["Feedback", "/feedback"]].map(([label, path]) => (
              <Link key={label} to={path} style={{ textDecoration: "none" }}>
                <span style={{ color: "rgba(255,255,255,0.22)", fontSize: 12, fontFamily: "'DM Sans', sans-serif", transition: "color 0.2s" }}>
                  {label}
                </span>
              </Link>
            ))}
          </div>
          <p style={{ color: "rgba(255,255,255,0.22)", fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>
            Made with ❤️ for India
          </p>
        </div>
      </div>

      {/* Desktop: override footer grid to 4 cols */}
      <style>{`
        @media (min-width: 768px) {
          footer > div > div:first-child {
            grid-template-columns: 1.4fr 2fr !important;
          }
        }
        @media (min-width: 1024px) {
          footer > div > div:first-child {
            grid-template-columns: 1.4fr 2.4fr !important;
          }
        }
      `}</style>
    </footer>
  );
}