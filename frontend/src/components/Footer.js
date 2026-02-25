
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
// import instagramLogo from "../assets/instagram.png";
// import facebookLogo  from "../assets/facebook.png";

const SOCIAL = [
  // { name: "Facebook",  img: facebookLogo,  url: "https://facebook.com/nurturecare",  bg: "#1877F2" },
  // { name: "Instagram", img: instagramLogo, url: "https://instagram.com/nurturecare", bg: "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)" },
  { name: "Twitter",   emoji: "𝕏",         url: "https://twitter.com/nurturecare",   bg: "#000" },
  { name: "LinkedIn",  emoji: "in",         url: "https://linkedin.com/company/nurturecare", bg: "#0A66C2" },
];

const COL = [
  ["Quick Links", [["Services","/services"],["How It Works","/how-it-works"],["Caregivers","/caregivers"],["Pricing","/pricing"],["Book a Nurse","/book"]]],
  ["Company",     [["About Us","/about"],["Careers","/careers"],["Blog","/blog"],["Contact","/contact"],["Partners","/contact"]]],
  ["Support",     [["Help Center","/help"],["Privacy Policy","/privacy"],["Terms of Use","/terms"],["Feedback","/feedback"],["Testimonials","/testimonials"]]],
];

export default function Footer() {
  const theme = useTheme();
  const bg    = theme.isDark ? "#0d1117" : "#0B1D3A";
  const muted = "rgba(255,255,255,0.4)";
  const bdr   = "rgba(255,255,255,0.08)";

  return (
    <footer style={{ background: bg, padding: "clamp(40px,6vw,64px) clamp(16px,4vw,48px) 28px", borderTop: `1px solid ${bdr}` }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* Main grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "clamp(28px,4vw,48px)", marginBottom: 48 }}>

          {/* Brand column */}
          <div style={{ gridColumn: "span 1" }}>
            <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ width: 36, height: 36, background: "linear-gradient(135deg,#00A99D,#00CEC3)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🩺</div>
              <span style={{ fontSize: 20, fontWeight: 800, color: "#fff", fontFamily: "'Playfair Display', Georgia, serif" }}>NurtureCare</span>
            </Link>
            <p style={{ color: muted, fontSize: 13, lineHeight: 1.7, maxWidth: 240, fontFamily: "'DM Sans', sans-serif", marginBottom: 20 }}>
              India's most trusted home nursing care platform — professional, verified, and compassionate.
            </p>

            {/* Social icons */}
            <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 11, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12 }}>
              Follow Us
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {SOCIAL.map(s => (
                <motion.a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
                  whileHover={{ scale: 1.15, y: -3 }} whileTap={{ scale: 0.92 }} title={s.name}
                  style={{ width: 40, height: 40, borderRadius: 11, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.3)", textDecoration: "none", flexShrink: 0 }}>
                  {s.img
                    ? <img src={s.img} alt={s.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <span style={{ color: "#fff", fontSize: s.emoji === "in" ? 14 : 13, fontWeight: 900, fontFamily: "'DM Sans', sans-serif" }}>{s.emoji}</span>
                  }
                </motion.a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {COL.map(([title, links]) => (
            <div key={title}>
              <h4 style={{ color: "#fff", fontSize: 14, fontWeight: 800, margin: "0 0 14px", fontFamily: "'DM Sans', sans-serif" }}>{title}</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {links.map(([label, path]) => (
                  <Link key={label} to={path} style={{ textDecoration: "none" }}>
                    <motion.span whileHover={{ color: "#00CEC3", x: 3 }}
                      style={{ color: muted, fontSize: 13, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", display: "block", transition: "color 0.2s" }}>
                      {label}
                    </motion.span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: `1px solid ${bdr}`, paddingTop: 22, display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>
            © 2024 NurtureCare. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {[["Privacy Policy","/privacy"],["Terms of Use","/terms"],["Feedback","/feedback"]].map(([label, path]) => (
              <Link key={label} to={path} style={{ textDecoration: "none" }}>
                <motion.span whileHover={{ color: "#00CEC3" }}
                  style={{ color: "rgba(255,255,255,0.25)", fontSize: 12, fontFamily: "'DM Sans', sans-serif", transition: "color 0.2s" }}>
                  {label}
                </motion.span>
              </Link>
            ))}
          </div>
          <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>
            Made with ❤️ for India's families
          </p>
        </div>
      </div>
    </footer>
  );
}
