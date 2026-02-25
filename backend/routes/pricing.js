const express = require("express");
const router = express.Router();

const PLANS = [
  {
    id: "basic",
    name: "Basic",
    price: "₹999",
    period: "/day",
    highlight: false,
    tagline: "Essential care for recovery",
    features: ["8-hour nursing shift", "Vitals monitoring", "Medication reminders", "Daily health report", "WhatsApp updates"],
    notIncluded: ["ICU-trained nurse", "Doctor consultations", "Equipment included"],
  },
  {
    id: "premium",
    name: "Premium",
    price: "₹1,799",
    period: "/day",
    highlight: true,
    tagline: "Best for most families",
    features: ["12-hour nursing shift", "ICU-trained nurse", "Diet & nutrition plan", "Family health app", "Priority support", "Weekly doctor review"],
    notIncluded: ["24-hour care", "Equipment included"],
  },
  {
    id: "24x7",
    name: "24/7 Care",
    price: "₹2,999",
    period: "/day",
    highlight: false,
    tagline: "Complete round-the-clock care",
    features: ["Round-the-clock care", "2 nurses rotation", "Doctor consultations", "Equipment included", "Dedicated coordinator", "Emergency response", "Family health app"],
    notIncluded: [],
  },
];

router.get("/", (req, res) => res.json({ success: true, data: PLANS }));

module.exports = router;
