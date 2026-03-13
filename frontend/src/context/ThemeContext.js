import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // --- Dark Mode Logic ---
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("NurtureCare_theme");
    return saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    localStorage.setItem("NurtureCare_theme", isDark ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggle = () => setIsDark(d => !d);

  // --- Responsive Logic ---
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- Theme Object Construction ---
  const theme = {
    isDark,
    isMobile,
    toggle,
    // Colors adapt based on isDark
    bg:          isDark ? "#0d1117" : "#F8F5F0",
    bgCard:      isDark ? "#161b22" : "#FFFFFF",
    bgSecondary: isDark ? "#1a2030" : "#F0EDE8",
    bgHero:      "#0B1D3A", // Fixed Navy as per your design
    text:        isDark ? "#e6edf3" : "#0B1D3A",
    textMuted:   isDark ? "#8b949e" : "#6B7C93",
    border:      isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
    teal:        "#00A99D",
    tealLight:   "#00CEC3",
    navy:        "#0B1D3A",
    gold:        "#F0A500",
    rose:        "#FF6B8A",
    shadow:      isDark ? "0 4px 24px rgba(0,0,0,0.5)" : "0 4px 24px rgba(0,0,0,0.08)",
    shadowLg:    isDark ? "0 16px 48px rgba(0,0,0,0.6)" : "0 16px 48px rgba(0,0,0,0.12)",
    
    // Pro-Tip: Add dynamic padding or sizes based on isMobile
    padding:     isMobile ? "15px" : "40px",
    container:   isMobile ? "95%" : "1200px"
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);