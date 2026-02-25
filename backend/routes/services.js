const express = require("express");
const router = express.Router();

const SERVICES = [
  {
    id: "post-surgery",
    icon: "🏥",
    title: "Post-Surgery Care",
    shortDesc: "Professional at-home recovery support after hospital discharge with wound care and medication management.",
    fullDesc: "Our post-surgery care program is designed to provide comprehensive support during your recovery period. Our trained nurses handle wound dressing, drain management, pain monitoring, physiotherapy exercises, medication administration, and coordination with your surgeon. We ensure you heal safely and comfortably at home.",
    features: ["Wound dressing & care", "Medication administration", "Pain management", "Vital signs monitoring", "Doctor coordination", "Physiotherapy exercises"],
    color: "#E8F6FF",
    price: "From ₹1,199/day",
    duration: "Available 8–24 hrs",
    rating: 4.9,
    reviews: 312,
  },
  {
    id: "elderly-care",
    icon: "👴",
    title: "Elderly Care",
    shortDesc: "Compassionate daily living assistance, companionship, and health monitoring for seniors.",
    fullDesc: "Our elderly care service provides holistic support for seniors who need help with daily activities. From personal hygiene and meal preparation to medication management and companionship, our caregivers treat every senior with the dignity and warmth they deserve.",
    features: ["Daily hygiene assistance", "Meal preparation", "Medication reminders", "Companionship", "Mobility support", "Family updates"],
    color: "#FFF0F5",
    price: "From ₹999/day",
    duration: "Available 8–24 hrs",
    rating: 4.8,
    reviews: 278,
  },
  {
    id: "icu-at-home",
    icon: "🧑‍⚕️",
    title: "ICU at Home",
    shortDesc: "Critical care services at home with trained ICU nurses and advanced medical equipment.",
    fullDesc: "Our ICU at Home service brings hospital-grade critical care to your doorstep. Led by ICU-specialist nurses, we manage ventilators, infusion pumps, cardiac monitors, and all critical care equipment. Ideal for post-ICU step-down care or chronic critical illness management.",
    features: ["ICU-trained nurses", "Ventilator management", "Cardiac monitoring", "IV therapy", "Tracheostomy care", "24/7 emergency response"],
    color: "#F0FFF4",
    price: "From ₹2,499/day",
    duration: "24-hr minimum",
    rating: 4.9,
    reviews: 189,
  },
  {
    id: "medication-management",
    icon: "💊",
    title: "Medication Management",
    shortDesc: "Timely administration, refill management, and side-effect monitoring by licensed nurses.",
    fullDesc: "Managing complex medication schedules can be overwhelming. Our licensed nurses ensure every dose is given at the right time, in the right amount, and monitor for any adverse reactions. We also coordinate with pharmacies for timely refills and maintain detailed medication logs.",
    features: ["Timely administration", "Refill coordination", "Side-effect monitoring", "Detailed logs", "Doctor liaison", "IV/IM injections"],
    color: "#FFFBEB",
    price: "From ₹599/visit",
    duration: "Flexible scheduling",
    rating: 4.7,
    reviews: 445,
  },
  {
    id: "physiotherapy",
    icon: "🩺",
    title: "Physiotherapy",
    shortDesc: "In-home physiotherapy sessions to restore mobility and accelerate rehabilitation.",
    fullDesc: "Our certified physiotherapists come to your home with all necessary equipment. We design personalized rehabilitation programs for stroke recovery, orthopedic surgeries, neurological conditions, and sports injuries. Track progress through our app with regular milestone reports.",
    features: ["Personalized programs", "Stroke rehabilitation", "Ortho recovery", "Neurological care", "Progress tracking", "Home exercise plans"],
    color: "#F5F0FF",
    price: "From ₹799/session",
    duration: "60-min sessions",
    rating: 4.8,
    reviews: 367,
  },
  {
    id: "dementia-care",
    icon: "🧠",
    title: "Dementia Care",
    shortDesc: "Specialized memory care with behavioral support and family guidance programs.",
    fullDesc: "Our dementia care specialists are trained in evidence-based approaches for Alzheimer's and other forms of dementia. We provide structured routines, cognitive stimulation activities, behavioral management, and emotional support—all while keeping families informed and involved in care decisions.",
    features: ["Cognitive stimulation", "Behavioral management", "Structured routines", "Family counseling", "Safety monitoring", "Emotional support"],
    color: "#FFF5F0",
    price: "From ₹1,299/day",
    duration: "Available 8–24 hrs",
    rating: 4.9,
    reviews: 203,
  },
];

router.get("/", (req, res) => res.json({ success: true, data: SERVICES }));

router.get("/:id", (req, res) => {
  const svc = SERVICES.find((s) => s.id === req.params.id);
  if (!svc) return res.status(404).json({ success: false, message: "Service not found" });
  res.json({ success: true, data: svc });
});

module.exports = router;
