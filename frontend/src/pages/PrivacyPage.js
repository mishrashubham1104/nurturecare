
import { motion } from "framer-motion";
import { COLORS, fadeUp } from "../constants";

const SECTIONS = [
  { title: "1. Information We Collect", content: "We collect information you provide directly to us when creating an account, making a booking, or contacting us. This includes: your name, email address, phone number, home address, and health-related information about the patient requiring care. We also collect payment information (processed securely through our payment partners), device and usage data when you use our website or app, and location data to dispatch caregivers." },
  { title: "2. How We Use Your Information", content: "We use the information we collect to: provide, maintain, and improve our nursing care services; process bookings and match you with the most suitable caregiver; communicate with you about your bookings, account, and services; send health updates and reports to your registered family contacts; process payments; comply with legal obligations; and improve our platform's safety and functionality." },
  { title: "3. Sharing of Information", content: "We do not sell your personal data to third parties. We share information only with: caregivers assigned to your case (limited to what they need to provide care); our payment processors for billing; our technology service providers under strict confidentiality agreements; your treating doctor if you provide consent; and law enforcement when legally required." },
  { title: "4. Health Data Protection", content: "Medical and health information is treated with the highest level of confidentiality. All health records are encrypted at rest and in transit. Access is restricted to your assigned caregiver and your authorized contacts. We follow India's Digital Personal Data Protection Act, 2023 and applicable health data regulations. You have the right to request deletion of your health data at any time." },
  { title: "5. Data Security", content: "We implement industry-standard security measures including 256-bit AES encryption, secure HTTPS connections, two-factor authentication, regular security audits, and strict access controls. However, no internet transmission is 100% secure — we encourage you to use strong passwords and keep your account credentials confidential." },
  { title: "6. Your Rights", content: "You have the right to: access the personal data we hold about you; correct inaccurate data; request deletion of your data (subject to legal obligations); withdraw consent for data processing; receive a portable copy of your data; and lodge a complaint with India's Data Protection Board. To exercise any of these rights, email privacy@nurturecare.in." },
  { title: "7. Cookies", content: "We use essential cookies to enable core functionality (login sessions, booking flow) and analytics cookies (with your consent) to understand how you use our platform. You can manage cookie preferences in your browser settings. We do not use advertising or tracking cookies." },
  { title: "8. Contact Us", content: "If you have questions about this Privacy Policy or your personal data, contact our Data Protection Officer at: privacy@nurturecare.in | NurtureCare Privacy Team, 12th Floor, Lotus Tower, BKC, Mumbai – 400051. We respond to all privacy inquiries within 72 hours." },
];

export default function PrivacyPage() {
  return (
    <div style={{ background: COLORS.cream, minHeight: "100vh", paddingTop: 100 }}>
      <div style={{ background: COLORS.navy, padding: "80px 48px 96px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: 56, fontWeight: 900, color: COLORS.white, fontFamily: "'Playfair Display', Georgia, serif", margin: "0 0 16px" }}>
            Privacy Policy
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans', sans-serif" }}>
            Last updated: February 2024
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            style={{ fontSize: 18, color: "rgba(255,255,255,0.65)", fontFamily: "'DM Sans', sans-serif", marginTop: 12 }}>
            We are committed to protecting your privacy and the confidentiality of your health data.
          </motion.p>
        </div>
      </div>
      <div style={{ maxWidth: 860, margin: "-32px auto 0", padding: "0 24px 96px" }}>
        {SECTIONS.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
            style={{ background: COLORS.white, borderRadius: 16, padding: "28px 32px", marginBottom: 16, boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: COLORS.navy, margin: "0 0 12px", fontFamily: "'DM Sans', sans-serif" }}>{s.title}</h3>
            <p style={{ fontSize: 15, color: COLORS.slate, lineHeight: 1.8, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>{s.content}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
