export const COLORS = {
  navy: "#0B1D3A", teal: "#00A99D", tealLight: "#00CEC3",
  cream: "#F8F5F0", white: "#FFFFFF", slate: "#6B7C93",
  gold: "#F0A500", rose: "#FF6B8A",
};
export const API_BASE = "http://localhost:5000/api";
export const fadeUp = { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } };
export const stagger = { show: { transition: { staggerChildren: 0.12 } } };
export const STATS = [
  { value: "50,000+", label: "Patients Served" },
  { value: "1,200+", label: "Verified Nurses" },
  { value: "35+", label: "Cities Covered" },
  { value: "4.9★", label: "Average Rating" },
];
