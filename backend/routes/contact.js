const express = require("express");
const router = express.Router();

const messages = [];

router.post("/", (req, res) => {
  const { name, email, phone, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "Name, email, and message are required." });
  }
  const entry = { id: Date.now(), name, email, phone, message, createdAt: new Date().toISOString() };
  messages.push(entry);
  res.status(201).json({ success: true, message: "Thank you! We'll get back to you within 24 hours." });
});

router.get("/", (req, res) => res.json({ success: true, data: messages }));

module.exports = router;
