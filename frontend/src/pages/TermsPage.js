
import { motion } from "framer-motion";
import { COLORS } from "../constants";

const SECTIONS = [
  { title: "1. Acceptance of Terms", content: "By accessing or using NurtureCare's website, mobile application, or services, you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our services. These terms apply to all users, including patients, family members, and registered caregivers." },
  { title: "2. Services Provided", content: "NurtureCare is a technology platform that connects patients and their families with independent, licensed nursing professionals. We facilitate the booking process, but individual caregivers are independent service providers. NurtureCare does not directly employ caregivers as full-time employees for every engagement." },
  { title: "3. User Responsibilities", content: "You agree to: provide accurate, complete information when booking; use NurtureCare services only for lawful purposes; treat all caregivers with respect and dignity; ensure a safe working environment for visiting nurses; not share your account credentials with others; and promptly report any concerns about a caregiver's conduct to NurtureCare support." },
  { title: "4. Booking & Cancellation Policy", content: "Bookings are confirmed upon payment or booking confirmation. Cancellations made more than 2 hours before a scheduled visit are free of charge. Cancellations within 2 hours of a visit may incur a cancellation fee of up to ₹299. No-show cancellations will be charged in full. NurtureCare reserves the right to cancel bookings in exceptional circumstances." },
  { title: "5. Payment Terms", content: "All payments are due at the time of booking or upon completion of services, as specified. Our prices are inclusive of all applicable taxes. Payment is processed securely through our PCI-DSS compliant payment partners. Refunds for eligible cancellations are processed within 5–7 business days." },
  { title: "6. Limitation of Liability", content: "NurtureCare's liability is limited to the amount paid for the specific service in question. We are not liable for indirect, incidental, or consequential damages. We make no warranties about the suitability of specific caregivers for specific medical conditions beyond reasonable matching standards." },
  { title: "7. Intellectual Property", content: "All content on the NurtureCare platform — including text, images, logos, and software — is owned by NurtureCare and protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our written consent." },
  { title: "8. Governing Law", content: "These Terms shall be governed by the laws of India. Any disputes arising from these Terms or the use of NurtureCare services shall be subject to the exclusive jurisdiction of courts in Mumbai, Maharashtra, India. We encourage informal resolution of disputes before resorting to legal proceedings." },
];

export default function TermsPage() {
  return (
    <div style={{ background: COLORS.cream, minHeight: "100vh", paddingTop: 100 }}>
      <div style={{ background: COLORS.navy, padding: "80px 48px 96px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: 56, fontWeight: 900, color: COLORS.white, fontFamily: "'Playfair Display', Georgia, serif", margin: "0 0 16px" }}>
            Terms of Use
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans', sans-serif" }}>
            Last updated: February 2024
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            style={{ fontSize: 18, color: "rgba(255,255,255,0.65)", fontFamily: "'DM Sans', sans-serif", marginTop: 12 }}>
            Please read these terms carefully before using our services.
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
