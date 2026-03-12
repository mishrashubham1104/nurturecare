import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth }  from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function LoginPage() {
  const [mode,    setMode]    = useState("login");
  const [role,    setRole]    = useState("patient");
  const [form,    setForm]    = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register }   = useAuth();
  const navigate              = useNavigate();
  const location              = useLocation();
  const theme                 = useTheme();
  const from = location.state?.from?.pathname || "/";

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (mode === "register" && form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      if (mode === "login") {
        const res = await login(form.email, form.password);
        if (res.user.role === "admin")          navigate("/admin/dashboard",     { replace: true });
        else if (res.user.role === "caregiver") navigate("/caregiver/dashboard", { replace: true });
        else                                    navigate(from,                   { replace: true });
      } else {
        const res = await register(form.name, form.email, form.password, form.phone, role);
        if (res.user.role === "caregiver") navigate("/caregiver/dashboard", { replace: true });
        else                               navigate(from,                   { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  /* 16px font-size on inputs prevents iOS auto-zoom */
  const inp = {
    width: "100%", padding: "14px 16px", borderRadius: 12,
    border: `1.5px solid ${theme.border}`,
    background: theme.bgSecondary, color: theme.text,
    fontSize: 16, fontFamily: "'DM Sans', sans-serif",
    outline: "none", boxSizing: "border-box",
    WebkitAppearance: "none", appearance: "none",
  };

  const lbl = {
    display: "block", fontSize: 13, fontWeight: 700,
    color: theme.textMuted, marginBottom: 6,
    fontFamily: "'DM Sans', sans-serif",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: theme.bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      /* top: clear navbar; sides: mobile-safe */
      padding: "clamp(80px,12vh,110px) clamp(12px,4vw,24px) clamp(32px,5vh,48px)",
    }}>

      {/* Animated background blobs */}
      <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
        {[
          { w: 360, c: "rgba(0,169,157,0.10)", t: "8%",  l: "65%" },
          { w: 280, c: "rgba(240,165,0,0.07)",  t: "58%", l: "2%"  },
          { w: 320, c: "rgba(0,206,195,0.08)",  t: "28%", l: "45%" },
        ].map((b, i) => (
          <motion.div key={i}
            animate={{ y: [0, -18, 0], x: [0, 10, 0] }}
            transition={{ duration: 5 + i * 1.5, repeat: Infinity, ease: "easeInOut", delay: i }}
            style={{
              position: "absolute",
              width: b.w, height: b.w, borderRadius: "50%",
              background: `radial-gradient(circle,${b.c},transparent)`,
              top: b.t, left: b.l,
            }}
          />
        ))}
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        style={{
          width: "100%", maxWidth: 460,
          background: theme.bgCard,
          borderRadius: "clamp(18px,3vw,28px)",
          padding: "clamp(24px,5vw,40px)",
          boxShadow: theme.shadowLg,
          border: `1px solid ${theme.border}`,
          position: "relative", zIndex: 1,
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10, marginBottom: 28, justifyContent: "center" }}>
          <div style={{ width: 38, height: 38, background: "linear-gradient(135deg,#00A99D,#00CEC3)", borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🩺</div>
          <span style={{ fontSize: 21, fontWeight: 800, color: theme.text, fontFamily: "'Playfair Display', Georgia, serif" }}>
            NurtureCare
          </span>
        </Link>

        {/* Mode tabs */}
        <div style={{ display: "flex", background: theme.bgSecondary, borderRadius: 14, padding: 4, marginBottom: 28 }}>
          {["login", "register"].map(m => (
            <button key={m} onClick={() => { setMode(m); setError(""); }}
              style={{
                flex: 1, padding: "10px", borderRadius: 10, border: "none",
                fontSize: 14, fontWeight: 700, cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                background: mode === m ? "#00A99D" : "transparent",
                color:      mode === m ? "#fff" : theme.textMuted,
                transition: "all 0.22s",
                minHeight: 44,
              }}>
              {m === "login" ? "Sign In" : "Create Account"}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, x: mode === "login" ? -16 : 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <h2 style={{ fontSize: "clamp(20px,4vw,26px)", fontWeight: 900, color: theme.text, margin: "0 0 4px", fontFamily: "'Playfair Display', Georgia, serif" }}>
              {mode === "login" ? "Welcome back 👋" : "Create your account"}
            </h2>
            <p style={{ color: theme.textMuted, fontSize: 14, margin: "0 0 22px", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5 }}>
              {mode === "login"
                ? "Sign in to book nurses and manage your care."
                : "Join 50,000+ families using NurtureCare."}
            </p>

            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                style={{
                  background: "rgba(255,107,138,0.12)",
                  border: "1px solid rgba(255,107,138,0.30)",
                  borderRadius: 10, padding: "12px 16px", marginBottom: 18,
                  color: "#FF6B8A", fontSize: 14, fontFamily: "'DM Sans', sans-serif",
                }}>
                ⚠️ {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit}>

              {/* Role selector — register only */}
              {mode === "register" && (
                <div style={{ marginBottom: 18 }}>
                  <label style={lbl}>I am registering as</label>
                  <div style={{ display: "flex", gap: 10 }}>
                    {[["patient", "🧑 Patient"], ["caregiver", "👩‍⚕️ Caregiver"]].map(([r, l]) => (
                      <button key={r} type="button" onClick={() => setRole(r)}
                        style={{
                          flex: 1, padding: "12px 8px", borderRadius: 12,
                          border: `2px solid ${role === r ? "#00A99D" : theme.border}`,
                          background: role === r ? "rgba(0,169,157,0.10)" : theme.bgSecondary,
                          color: role === r ? "#00A99D" : theme.textMuted,
                          fontSize: 14, fontWeight: 700, cursor: "pointer",
                          fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
                          minHeight: 48,
                        }}>
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Full name — register only */}
              {mode === "register" && (
                <div style={{ marginBottom: 14 }}>
                  <label style={lbl}>Full Name *</label>
                  <input type="text" placeholder="Your full name" required
                    value={form.name} onChange={set("name")} style={inp} />
                </div>
              )}

              <div style={{ marginBottom: 14 }}>
                <label style={lbl}>Email Address *</label>
                <input type="email" placeholder="you@email.com" required
                  autoComplete="email"
                  value={form.email} onChange={set("email")} style={inp} />
              </div>

              {/* Phone — register only */}
              {mode === "register" && (
                <div style={{ marginBottom: 14 }}>
                  <label style={lbl}>Phone Number *</label>
                  <input type="tel" placeholder="+91 xxxxxxxxxx" required
                    value={form.phone} onChange={set("phone")} style={inp} />
                </div>
              )}

              <div style={{ marginBottom: mode === "register" ? 14 : 24 }}>
                <label style={lbl}>Password *</label>
                <input type="password"
                  placeholder={mode === "register" ? "Min 8 characters" : "Enter your password"}
                  required minLength={8}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  value={form.password} onChange={set("password")} style={inp} />
              </div>

              {/* Confirm — register only */}
              {mode === "register" && (
                <div style={{ marginBottom: 24 }}>
                  <label style={lbl}>Confirm Password *</label>
                  <input type="password" placeholder="Re-enter password" required
                    autoComplete="new-password"
                    value={form.confirm} onChange={set("confirm")} style={inp} />
                </div>
              )}

              {/* Caregiver info note */}
              {mode === "register" && role === "caregiver" && (
                <div style={{
                  background: "rgba(0,169,157,0.08)",
                  border: "1px solid rgba(0,169,157,0.20)",
                  borderRadius: 12, padding: "12px 14px", marginBottom: 20,
                }}>
                  <p style={{ color: "#00A99D", fontSize: 13, fontFamily: "'DM Sans', sans-serif", margin: 0, lineHeight: 1.6 }}>
                    📋 After registration you'll complete your professional profile in the Caregiver Dashboard. Admin will verify before you can accept bookings.
                  </p>
                </div>
              )}

              <motion.button type="submit" disabled={loading} whileTap={{ scale: 0.97 }}
                style={{
                  width: "100%",
                  background: loading ? "#6B7C93" : "linear-gradient(135deg,#00A99D,#00CEC3)",
                  color: "#fff", border: "none", borderRadius: 14,
                  padding: "clamp(14px,3vw,16px)",
                  fontSize: 16, fontWeight: 800,
                  cursor: loading ? "not-allowed" : "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  boxShadow: "0 8px 24px rgba(0,169,157,0.32)",
                  minHeight: 52,
                }}>
                {loading ? "Please wait..." : mode === "login" ? "Sign In →" : "Create Account →"}
              </motion.button>
            </form>

            <p style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: theme.textMuted, fontFamily: "'DM Sans', sans-serif" }}>
              {mode === "login" ? "Don't have an account? " : "Already have an account? "}
              <span
                style={{ color: "#00A99D", fontWeight: 700, cursor: "pointer" }}
                onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
              >
                {mode === "login" ? "Sign up free" : "Sign in"}
              </span>
            </p>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}