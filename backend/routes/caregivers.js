const express = require("express");
const router = express.Router();

const CAREGIVERS = [
  { id: 1, name: "Dr. Priya Sharma", role: "ICU Specialist Nurse", exp: "12 yrs", rating: 4.9, reviews: 238, img: "👩‍⚕️", badge: "Top Rated", specialties: ["ICU Care", "Ventilator Mgmt", "Critical Care"], bio: "Dr. Priya is a highly experienced ICU nurse with 12 years in critical care. She has managed hundreds of complex cases and is known for her calm, professional demeanor.", available: true, languages: ["Hindi", "English", "Marathi"], city: "Mumbai" },
  { id: 2, name: "Rajesh Nair", role: "Physiotherapy Expert", exp: "8 yrs", rating: 4.8, reviews: 195, img: "🧑‍⚕️", badge: "Verified", specialties: ["Stroke Rehab", "Ortho Recovery", "Neurological Care"], bio: "Rajesh specializes in post-stroke and orthopedic rehabilitation. His personalized programs have helped 500+ patients regain mobility and independence.", available: true, languages: ["Hindi", "English", "Malayalam"], city: "Kochi" },
  { id: 3, name: "Anita Desai", role: "Elderly Care Specialist", exp: "10 yrs", rating: 5.0, reviews: 312, img: "👩‍⚕️", badge: "Expert", specialties: ["Dementia Care", "Geriatric Nursing", "Palliative Care"], bio: "Anita is a compassionate geriatric care specialist with a decade of experience. Her gentle approach and expertise in dementia care make her a family favorite.", available: true, languages: ["Hindi", "English", "Gujarati"], city: "Ahmedabad" },
  { id: 4, name: "Dr. Vikram Bose", role: "Post-Surgery Nurse", exp: "15 yrs", rating: 4.9, reviews: 407, img: "🧑‍⚕️", badge: "Top Rated", specialties: ["Post-Op Care", "Wound Management", "Oncology Nursing"], bio: "With 15 years in surgical nursing, Dr. Vikram brings hospital-grade expertise to your home. Expert in complex wound care, drains, and post-operative recovery management.", available: false, languages: ["Hindi", "English", "Bengali"], city: "Kolkata" },
  { id: 5, name: "Sunita Menon", role: "Pediatric Nurse", exp: "7 yrs", rating: 4.8, reviews: 156, img: "👩‍⚕️", badge: "Verified", specialties: ["Newborn Care", "Pediatric IV", "Child Nutrition"], bio: "Sunita is a dedicated pediatric nurse specialized in newborn care and child health monitoring. Parents love her patient, nurturing approach.", available: true, languages: ["Hindi", "English", "Tamil"], city: "Chennai" },
  { id: 6, name: "Arjun Mehta", role: "Diabetic Care Specialist", exp: "9 yrs", rating: 4.7, reviews: 289, img: "🧑‍⚕️", badge: "Verified", specialties: ["Insulin Management", "Foot Care", "Diet Counseling"], bio: "Arjun specializes in diabetic patient management including insulin protocols, foot ulcer care, and lifestyle coaching for better glycemic control.", available: true, languages: ["Hindi", "English"], city: "Delhi" },
];

router.get("/", (req, res) => res.json({ success: true, data: CAREGIVERS }));
router.get("/:id", (req, res) => {
  const cg = CAREGIVERS.find((c) => c.id === parseInt(req.params.id));
  if (!cg) return res.status(404).json({ success: false, message: "Caregiver not found" });
  res.json({ success: true, data: cg });
});

module.exports = router;
