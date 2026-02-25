const express = require("express");
const router = express.Router();

const TESTIMONIALS = [
  { id: 1, name: "Meera Kapoor", city: "Mumbai", text: "The nurse assigned to my father was incredibly compassionate. He recovered faster than expected. This service is a lifesaver!", stars: 5, service: "Post-Surgery Care", date: "December 2024" },
  { id: 2, name: "Suresh Patel", city: "Ahmedabad", text: "Booking was seamless. Real-time health updates kept our whole family informed. Highly professional team!", stars: 5, service: "Elderly Care", date: "January 2025" },
  { id: 3, name: "Lakshmi Rao", city: "Chennai", text: "Post-surgery, I was worried about managing at home. The caregiver made the transition so smooth and reassuring.", stars: 5, service: "Post-Surgery Care", date: "November 2024" },
  { id: 4, name: "Aryan Gupta", city: "Delhi", text: "ICU at Home service was outstanding. The nurse handled the ventilator with complete expertise. I'd recommend NurtureCare to everyone.", stars: 5, service: "ICU at Home", date: "February 2025" },
  { id: 5, name: "Divya Krishnan", city: "Bangalore", text: "The physiotherapy sessions at home saved us so many hospital trips. Rajesh sir is excellent and very motivating!", stars: 5, service: "Physiotherapy", date: "December 2024" },
];

router.get("/", (req, res) => res.json({ success: true, data: TESTIMONIALS }));

module.exports = router;
