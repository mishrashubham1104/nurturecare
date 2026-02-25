const express = require("express");
const router = express.Router();

const bookings = [];

router.post("/", (req, res) => {
  const { patientName, service, date, phone, nurseId, plan } = req.body;
  if (!patientName || !phone) {
    return res.status(400).json({ success: false, message: "Patient name and phone are required." });
  }
  const booking = {
    id: `BK${Date.now()}`,
    patientName, service, date, phone,
    nurseId: nurseId || null,
    plan: plan || null,
    status: "Confirmed",
    createdAt: new Date().toISOString(),
  };
  bookings.push(booking);
  res.status(201).json({ success: true, message: "Booking confirmed! Our team will contact you shortly.", data: booking });
});

router.get("/", (req, res) => res.json({ success: true, data: bookings }));

module.exports = router;
