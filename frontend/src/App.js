import "./responsive.css";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { AppProvider }         from "./context/AppContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { AuthProvider, useAuth }   from "./context/AuthContext";
import ProtectedRoute          from "./components/ProtectedRoute";
import Navbar                  from "./components/Navbar";
import Footer                  from "./components/Footer";
import LoginPage                from "./pages/LoginPage";
import HomePage                 from "./pages/HomePage";
import MyBookings               from "./pages/MyBookings";
import ProfilePage              from "./pages/ProfilePage";
import ServicesPage             from "./pages/ServicesPage";
import HowItWorksPage           from "./pages/HowItWorksPage";
import CaregiversPage           from "./pages/CaregiversPage";
import TestimonialsPage         from "./pages/TestimonialsPage";
import PricingPage              from "./pages/PricingPage";
import ContactPage              from "./pages/ContactPage";
import BookingPage              from "./pages/BookingPage";
import AboutPage                from "./pages/AboutPage";
import CareersPage              from "./pages/CareersPage";
import BlogPage                 from "./pages/BlogPage";
import HelpPage                 from "./pages/HelpPage";
import PrivacyPage              from "./pages/PrivacyPage";
import TermsPage                from "./pages/TermsPage";
import FeedbackPage             from "./pages/FeedbackPage";
import AdminDashboard           from "./pages/AdminDashboard";
import CaregiverDashboard       from "./pages/CaregiverDashboard";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0,0); }, [pathname]);
  return null;
}

// Role-based protected route
function RoleRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0B1D3A" }}>
      <div style={{ width: 40, height: 40, border: "3px solid rgba(0,169,157,0.2)", borderTopColor: "#00A99D", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

// Hide Navbar/Footer on dashboard pages
function Layout({ children }) {
  const { pathname } = useLocation();
  const isDashboard  = pathname.startsWith("/admin") || pathname === "/caregiver/dashboard" || pathname.startsWith("/caregiver/");
  const theme        = useTheme();
  return (
    <div style={{ background:theme.bg, minHeight:"100vh", transition:"background 0.3s" }}>
      {!isDashboard && <Navbar />}
      {children}
      {!isDashboard && <Footer />}
    </div>
  );
}

function AppShell() {
  const theme = useTheme();
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{background:${theme.bg};transition:background 0.3s}
        a{text-decoration:none;color:inherit}
        ::-webkit-scrollbar{width:6px}
        ::-webkit-scrollbar-track{background:#0B1D3A}
        ::-webkit-scrollbar-thumb{background:#00A99D;border-radius:3px}
        select option{background:${theme.bgCard};color:${theme.text}}
        @media(max-width:900px){.desktop-nav{display:none!important}}
        @media(max-width:768px){
          .hero-grid{grid-template-columns:1fr!important;padding:80px 20px 0!important;gap:32px!important;text-align:center}
          .hero-cta-buttons{justify-content:center!important}
          .hero-stats{justify-content:center!important}
          .hero-card-col{display:none!important}
          .stats-grid{grid-template-columns:repeat(2,1fr)!important;padding:24px 16px!important}
          .services-grid{grid-template-columns:repeat(2,1fr)!important}
          .pricing-grid{grid-template-columns:repeat(2,1fr)!important}
          .contact-grid{grid-template-columns:1fr!important}
          .service-detail-grid{grid-template-columns:1fr!important}
        }
        @media(max-width:600px){
          .services-grid{grid-template-columns:1fr!important}
          .pricing-grid{grid-template-columns:1fr!important}
          .caregivers-grid{grid-template-columns:1fr!important}
          .stats-bar{display:none!important}
        }
      `}</style>
      <BrowserRouter>
        <ScrollToTop />
        <Layout>
          <Routes>
            {/* Public */}
            <Route path="/"               element={<HomePage />} />
            <Route path="/login"          element={<LoginPage />} />
            <Route path="/services"       element={<ServicesPage />} />
            <Route path="/services/:slug" element={<ServicesPage />} />
            <Route path="/how-it-works"   element={<HowItWorksPage />} />
            <Route path="/caregivers"     element={<CaregiversPage />} />
            <Route path="/my-bookings"    element={<MyBookings />} />
            <Route path="/profile"        element={<ProfilePage />} />
            <Route path="/caregivers/:id" element={<CaregiversPage />} />
            <Route path="/testimonials"   element={<TestimonialsPage />} />
            <Route path="/pricing"        element={<PricingPage />} />
            <Route path="/contact"        element={<ContactPage />} />
            <Route path="/about"          element={<AboutPage />} />
            <Route path="/careers"        element={<CareersPage />} />
            <Route path="/blog"           element={<BlogPage />} />
            <Route path="/help"           element={<HelpPage />} />
            <Route path="/privacy"        element={<PrivacyPage />} />
            <Route path="/terms"          element={<TermsPage />} />
            <Route path="/feedback"       element={<FeedbackPage />} />
            {/* Patient protected */}
            <Route path="/book" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
            {/* Caregiver dashboard */}
            <Route path="/caregiver/dashboard" element={<RoleRoute allowedRoles={["caregiver","admin"]}><CaregiverDashboard /></RoleRoute>} />
            {/* Admin dashboard */}
            <Route path="/admin/dashboard" element={<RoleRoute allowedRoles={["admin"]}><AdminDashboard /></RoleRoute>} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <AppShell />
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}