
const express    = require("express");
const cors       = require("cors");
const bodyParser = require("body-parser");
const mongoose   = require("mongoose");
const bcrypt     = require("bcryptjs");
const jwt        = require("jsonwebtoken");
require("dotenv").config();

const app        = express();
const PORT       = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "nurturecare_secret_key_change_in_production";

app.use(cors());
app.use(bodyParser.json());

// ── MongoDB Atlas ──────────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Atlas connected"))
  .catch(err => console.error("❌ MongoDB error:", err.message));

mongoose.connection.on("disconnected", () => console.warn("⚠️  MongoDB disconnected"));
mongoose.connection.on("reconnected",  () => console.log("✅ MongoDB reconnected"));

const genId = (prefix) => `${prefix}${Date.now()}`;

// ══════════════════════════════════════════════════════════════════════════════
//  SCHEMAS
// ══════════════════════════════════════════════════════════════════════════════

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone:    { type: String, default: "" },
  password: { type: String, required: true },
  role:     { type: String, enum: ["patient", "caregiver", "admin"], default: "patient" },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const caregiverSchema = new mongoose.Schema({
  userId:          { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  caregiverId:     { type: String, unique: true },
  name:            { type: String, required: true },
  email:           { type: String, required: true },
  phone:           { type: String, default: "" },
  role:            { type: String, default: "Registered Nurse" },
  experience:      { type: String, default: "" },
  specializations: { type: [String], default: [] },
  languages:       { type: [String], default: [] },
  serviceAreas:    { type: [String], default: [] },
  bio:             { type: String, default: "" },
  licenseNumber:   { type: String, default: "" },
  idProof:         { type: String, default: "" },
  // Verification
  status:          { type: String, enum: ["pending", "verified", "rejected", "suspended"], default: "pending" },
  verificationNote:{ type: String, default: "" },
  verifiedAt:      { type: Date, default: null },
  verifiedBy:      { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  // Availability
  isAvailable:     { type: Boolean, default: true },
  availableDays:   { type: [String], default: ["Mon","Tue","Wed","Thu","Fri"] },
  availableHours:  { type: String, default: "9AM–6PM" },
  // Earnings & stats
  totalEarnings:   { type: Number, default: 0 },
  totalJobs:       { type: Number, default: 0 },
  rating:          { type: Number, default: 0 },
  reviews:         { type: Number, default: 0 },
}, { timestamps: true });

const bookingSchema = new mongoose.Schema({
  bookingId:    { type: String, unique: true, required: true },
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  caregiverId:  { type: mongoose.Schema.Types.ObjectId, ref: "Caregiver", default: null },
  patientName:  { type: String, required: true, trim: true },
  service:      { type: String, required: true },
  date:         { type: String, default: null },
  phone:        { type: String, required: true },
  address:      { type: String, default: "" },
  nurseId:      { type: String, default: null },
  nurseName:    { type: String, default: null },
  notes:        { type: String, default: "" },
  careNotes:    { type: String, default: "" },
  status:       { type: String, enum: ["pending","confirmed","accepted","rejected","in_progress","completed","cancelled"], default: "confirmed" },
  earnings:     { type: Number, default: 0 },
  // Complaint / dispute
  hasComplaint: { type: Boolean, default: false },
  complaint:    { type: String, default: "" },
  complaintStatus: { type: String, enum: ["none","open","resolved"], default: "none" },
}, { timestamps: true });

const contactSchema = new mongoose.Schema({
  contactId: { type: String, unique: true },
  name:      { type: String, required: true },
  email:     { type: String, required: true, lowercase: true },
  phone:     { type: String, default: "" },
  message:   { type: String, required: true },
  resolved:  { type: Boolean, default: false },
}, { timestamps: true });

const feedbackSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, lowercase: true },
  rating:   { type: Number, min: 1, max: 5, default: null },
  category: { type: String, default: "" },
  feedback: { type: String, required: true },
}, { timestamps: true });

const User      = mongoose.model("User",      userSchema);
const Caregiver = mongoose.model("Caregiver", caregiverSchema);
const Booking   = mongoose.model("Booking",   bookingSchema);
const Contact   = mongoose.model("Contact",   contactSchema);
const Feedback  = mongoose.model("Feedback",  feedbackSchema);

// ══════════════════════════════════════════════════════════════════════════════
//  AUTH MIDDLEWARE
// ══════════════════════════════════════════════════════════════════════════════
const auth = (req, res, next) => {
  const h = req.headers.authorization;
  if (!h?.startsWith("Bearer ")) return res.status(401).json({ error: "No token. Please log in." });
  try { req.user = jwt.verify(h.split(" ")[1], JWT_SECRET); next(); }
  catch { res.status(401).json({ error: "Invalid or expired token." }); }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Admin access only." });
  next();
};

const caregiverOnly = (req, res, next) => {
  if (!["caregiver","admin"].includes(req.user.role)) return res.status(403).json({ error: "Caregiver access only." });
  next();
};

// ══════════════════════════════════════════════════════════════════════════════
//  STATIC DATA
// ══════════════════════════════════════════════════════════════════════════════
const SERVICES = [
  { id:1, icon:"🏥", title:"Post-Surgery Care",     slug:"post-surgery-care",    price:"₹999/day",    duration:"8–12 hrs",  desc:"Professional at-home recovery after hospital discharge.", features:["Wound dressing","Medication management","Vital signs monitoring","Doctor liaison","24/7 emergency contact"], color:"#E8F6FF" },
  { id:2, icon:"👴", title:"Elderly Care",          slug:"elderly-care",          price:"₹849/day",    duration:"12–24 hrs", desc:"Daily living assistance, companionship, and health monitoring.", features:["Daily living assistance","Companionship","Fall prevention","Health monitoring","Family communication"], color:"#FFF0F5" },
  { id:3, icon:"🧑‍⚕️",title:"ICU at Home",          slug:"icu-at-home",           price:"₹2,499/day",  duration:"24 hrs",    desc:"Critical care with trained ICU nurses and advanced equipment.", features:["ICU-trained nurses","Medical equipment","Continuous monitoring","Emergency response","Doctor consultation"], color:"#F0FFF4" },
  { id:4, icon:"💊", title:"Medication Management", slug:"medication-management", price:"₹499/day",    duration:"4–6 hrs",   desc:"Timely medication administration and side-effect monitoring.", features:["Medication scheduling","Dosage tracking","Side-effect monitoring","Prescription refills","Patient education"], color:"#FFFBEB" },
  { id:5, icon:"🩺", title:"Physiotherapy",         slug:"physiotherapy",         price:"₹799/session",duration:"1–2 hrs",   desc:"In-home physiotherapy to restore mobility and accelerate rehab.", features:["Mobility restoration","Pain management","Exercise programs","Progress tracking","Equipment provided"], color:"#F5F0FF" },
  { id:6, icon:"🧠", title:"Dementia Care",         slug:"dementia-care",         price:"₹1,199/day",  duration:"12–24 hrs", desc:"Specialized memory care with behavioral support.", features:["Memory activities","Behavioral support","Safety management","Family counseling","Care journaling"], color:"#FFF5F0" },
];
const TESTIMONIALS = [
  { id:1, name:"Meera Kapoor", city:"Mumbai",    stars:5, service:"Post-Surgery Care", text:"The nurse was incredibly compassionate. He recovered faster than expected!" },
  { id:2, name:"Suresh Patel", city:"Ahmedabad", stars:5, service:"Elderly Care",      text:"Booking was seamless. Real-time health updates kept our family informed." },
  { id:3, name:"Lakshmi Rao",  city:"Chennai",   stars:5, service:"ICU at Home",       text:"The caregiver made the post-surgery transition so smooth and reassuring." },
  { id:4, name:"Rahul Sharma", city:"Delhi",     stars:5, service:"Physiotherapy",     text:"Rajesh helped my mother walk again after her hip replacement!" },
  { id:5, name:"Kavitha Nair", city:"Bangalore", stars:5, service:"Dementia Care",     text:"Anita treats my mother-in-law like family. Patience and expertise unmatched." },
];
const PRICING = [
  { id:1, name:"Basic",     price:"₹999",   period:"/day", highlight:false, features:["8-hour nursing shift","Vitals monitoring","Medication reminders","Daily health report","Phone support"] },
  { id:2, name:"Premium",   price:"₹1,799", period:"/day", highlight:true,  features:["12-hour nursing shift","ICU-trained nurse","Diet & nutrition plan","Family health app","Priority 24/7 support","Weekly doctor consultation"] },
  { id:3, name:"24/7 Care", price:"₹2,999", period:"/day", highlight:false, features:["Round-the-clock care","2-nurse rotation","Doctor consultations","Medical equipment included","Dedicated care coordinator","Emergency ambulance"] },
];

// ══════════════════════════════════════════════════════════════════════════════
//  AUTH ROUTES
// ══════════════════════════════════════════════════════════════════════════════
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "name, email, password required" });
    if (password.length < 8) return res.status(400).json({ error: "Password must be ≥ 8 characters" });
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ error: "Account already exists with this email" });
    const hashed = await bcrypt.hash(password, 12);
    // Only allow patient/caregiver self-registration; admin only via DB
    const allowedRole = ["patient","caregiver"].includes(role) ? role : "patient";
    const user = await User.create({ name: name.trim(), email: email.toLowerCase(), password: hashed, phone: phone || "", role: allowedRole });
    const token = jwt.sign({ id: user._id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    console.log("✅ New user registered");
    res.status(201).json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role } });
  } catch (err) { res.status(500).json({ error: "Registration failed." }); }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "email and password required" });
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ error: "No account found with this email" });
    if (!user.isActive) return res.status(403).json({ error: "Account is suspended. Contact support." });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Incorrect password" });
    const token = jwt.sign({ id: user._id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    console.log("✅ User logged in");
    res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role } });
  } catch (err) { res.status(500).json({ error: "Login failed." }); }
});

app.get("/api/auth/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
  } catch { res.status(500).json({ error: "Failed to fetch profile." }); }
});

// ══════════════════════════════════════════════════════════════════════════════
//  STATIC DATA ROUTES
// ══════════════════════════════════════════════════════════════════════════════
app.get("/api/health", (req, res) => res.json({ status:"ok", db: mongoose.connection.readyState === 1 ? "connected":"disconnected" }));
app.get("/api/services",     (req, res) => res.json(SERVICES));
app.get("/api/testimonials", (req, res) => res.json(TESTIMONIALS));
app.get("/api/pricing",      (req, res) => res.json(PRICING));

// Public: list verified caregivers for patients to browse
app.get("/api/caregivers", async (req, res) => {
  try {
    const list = await Caregiver.find({ status: "verified" }).sort({ rating: -1 });
    res.json(list);
  } catch { res.status(500).json({ error: "Failed to fetch caregivers." }); }
});

// ══════════════════════════════════════════════════════════════════════════════
//  CAREGIVER ROUTES  (self-service for caregiver role)
// ══════════════════════════════════════════════════════════════════════════════

// POST /api/caregiver/register  — caregiver completes their profile after account creation
app.post("/api/caregiver/register", auth, caregiverOnly, async (req, res) => {
  try {
    const { role, experience, specializations, languages, serviceAreas, bio, licenseNumber, idProof } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    const existing = await Caregiver.findOne({ userId: req.user.id });
    if (existing) return res.status(409).json({ error: "Caregiver profile already exists" });
    const caregiverId = genId("CG");
    const cg = await Caregiver.create({
      userId: req.user.id, caregiverId,
      name: user.name, email: user.email, phone: user.phone,
      role: role || "Registered Nurse", experience: experience || "",
      specializations: specializations || [], languages: languages || [],
      serviceAreas: serviceAreas || [], bio: bio || "",
      licenseNumber: licenseNumber || "", idProof: idProof || "",
      status: "pending",
    });
    console.log("✅ Caregiver profile submitted | ID:", caregiverId);
    res.status(201).json({ success: true, message: "Profile submitted. Pending admin verification.", caregiver: cg });
  } catch (err) { res.status(500).json({ error: "Failed to submit profile: " + err.message }); }
});

// GET /api/caregiver/profile
app.get("/api/caregiver/profile", auth, caregiverOnly, async (req, res) => {
  try {
    const cg = await Caregiver.findOne({ userId: req.user.id });
    if (!cg) return res.status(404).json({ error: "Profile not found. Please complete registration." });
    res.json(cg);
  } catch { res.status(500).json({ error: "Failed to fetch profile." }); }
});

// PATCH /api/caregiver/profile  — update own profile
app.patch("/api/caregiver/profile", auth, caregiverOnly, async (req, res) => {
  try {
    const allowed = ["role","experience","specializations","languages","serviceAreas","bio","isAvailable","availableDays","availableHours","phone"];
    const updates = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });
    const cg = await Caregiver.findOneAndUpdate({ userId: req.user.id }, updates, { new: true });
    if (!cg) return res.status(404).json({ error: "Profile not found" });
    res.json({ success: true, caregiver: cg });
  } catch { res.status(500).json({ error: "Failed to update profile." }); }
});

// PATCH /api/caregiver/availability  — toggle available/busy
app.patch("/api/caregiver/availability", auth, caregiverOnly, async (req, res) => {
  try {
    const { isAvailable, availableDays, availableHours } = req.body;
    const updates = {};
    if (isAvailable !== undefined) updates.isAvailable = isAvailable;
    if (availableDays)  updates.availableDays  = availableDays;
    if (availableHours) updates.availableHours = availableHours;
    const cg = await Caregiver.findOneAndUpdate({ userId: req.user.id }, updates, { new: true });
    if (!cg) return res.status(404).json({ error: "Profile not found" });
    res.json({ success: true, isAvailable: cg.isAvailable, availableDays: cg.availableDays });
  } catch { res.status(500).json({ error: "Failed to update availability." }); }
});

// GET /api/caregiver/requests  — service requests assigned to this caregiver
app.get("/api/caregiver/requests", auth, caregiverOnly, async (req, res) => {
  try {
    const cg = await Caregiver.findOne({ userId: req.user.id });
    if (!cg) return res.status(404).json({ error: "Caregiver profile not found" });
    const requests = await Booking.find({ caregiverId: cg._id }).sort({ createdAt: -1 });
    res.json({ total: requests.length, requests });
  } catch { res.status(500).json({ error: "Failed to fetch requests." }); }
});

// PATCH /api/caregiver/requests/:bookingId  — accept/reject/update status + care notes
app.patch("/api/caregiver/requests/:bookingId", auth, caregiverOnly, async (req, res) => {
  try {
    const { status, careNotes } = req.body;
    const validStatuses = ["accepted","rejected","in_progress","completed"];
    if (status && !validStatuses.includes(status)) return res.status(400).json({ error: `Invalid status. Use: ${validStatuses.join(", ")}` });
    const cg = await Caregiver.findOne({ userId: req.user.id });
    if (!cg) return res.status(404).json({ error: "Caregiver profile not found" });
    const updates = {};
    if (status)    updates.status    = status;
    if (careNotes) updates.careNotes = careNotes;
    const booking = await Booking.findOneAndUpdate({ bookingId: req.params.bookingId, caregiverId: cg._id }, updates, { new: true });
    if (!booking) return res.status(404).json({ error: "Booking not found or not assigned to you" });
    // Update earnings when completed
    if (status === "completed") {
      await Caregiver.findByIdAndUpdate(cg._id, { $inc: { totalEarnings: booking.earnings || 999, totalJobs: 1 } });
    }
    res.json({ success: true, booking });
  } catch { res.status(500).json({ error: "Failed to update request." }); }
});

// GET /api/caregiver/earnings
app.get("/api/caregiver/earnings", auth, caregiverOnly, async (req, res) => {
  try {
    const cg = await Caregiver.findOne({ userId: req.user.id });
    if (!cg) return res.status(404).json({ error: "Profile not found" });
    const completed = await Booking.find({ caregiverId: cg._id, status: "completed" }).sort({ createdAt: -1 });
    res.json({ totalEarnings: cg.totalEarnings, totalJobs: cg.totalJobs, rating: cg.rating, completedJobs: completed });
  } catch { res.status(500).json({ error: "Failed to fetch earnings." }); }
});

// ══════════════════════════════════════════════════════════════════════════════
//  PATIENT BOOKING ROUTES
// ══════════════════════════════════════════════════════════════════════════════
app.post("/api/bookings", auth, async (req, res) => {
  try {
    const { patientName, service, date, phone, address, nurseId, nurseName, notes } = req.body;
    if (!patientName || !service || !phone) return res.status(400).json({ error: "patientName, service and phone are required" });
    const bookingId = genId("BK");
    // If nurseId is provided, try to link caregiver
    let caregiverId = null;
    if (nurseId) {
      const cg = await Caregiver.findOne({ caregiverId: nurseId, status: "verified" });
      if (cg) caregiverId = cg._id;
    }
    const booking = await Booking.create({ bookingId, userId: req.user.id, caregiverId, patientName: patientName.trim(), service, date: date||null, phone: phone.trim(), address: address||"", nurseId: nurseId||null, nurseName: nurseName||null, notes: notes||"", status: "confirmed" });
    console.log("✅ Booking saved | ID:", bookingId);
    res.status(201).json({ success: true, message: `Booking confirmed! ID: ${bookingId}`, booking: { id: booking.bookingId, patientName: booking.patientName, service: booking.service, status: booking.status, createdAt: booking.createdAt } });
  } catch (err) { res.status(500).json({ error: "Failed to save booking." }); }
});

app.get("/api/bookings", auth, async (req, res) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;
    const filter = req.user.role === "admin" ? {} : { userId: req.user.id };
    if (status) filter.status = status;
    const [bookings, total] = await Promise.all([
      Booking.find(filter).sort({ createdAt: -1 }).skip((page-1)*limit).limit(parseInt(limit)),
      Booking.countDocuments(filter),
    ]);
    res.json({ total, page: parseInt(page), bookings });
  } catch { res.status(500).json({ error: "Failed to fetch bookings." }); }
});

app.get("/api/bookings/:bookingId", auth, async (req, res) => {
  try {
    const filter = { bookingId: req.params.bookingId };
    if (req.user.role !== "admin") filter.userId = req.user.id;
    const booking = await Booking.findOne(filter);
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json(booking);
  } catch { res.status(500).json({ error: "Failed to fetch booking." }); }
});

app.patch("/api/bookings/:bookingId/status", auth, async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ["pending","confirmed","accepted","rejected","in_progress","completed","cancelled"];
    if (!valid.includes(status)) return res.status(400).json({ error: "Invalid status" });
    const filter = { bookingId: req.params.bookingId };
    if (req.user.role !== "admin") filter.userId = req.user.id;
    const booking = await Booking.findOneAndUpdate(filter, { status }, { new: true });
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json({ success: true, booking });
  } catch { res.status(500).json({ error: "Failed to update booking." }); }
});

// POST /api/bookings/:bookingId/complaint
app.post("/api/bookings/:bookingId/complaint", auth, async (req, res) => {
  try {
    const { complaint } = req.body;
    if (!complaint) return res.status(400).json({ error: "complaint text required" });
    const booking = await Booking.findOneAndUpdate(
      { bookingId: req.params.bookingId, userId: req.user.id },
      { hasComplaint: true, complaint, complaintStatus: "open" },
      { new: true }
    );
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json({ success: true, message: "Complaint filed. Our team will review it within 24 hours." });
  } catch { res.status(500).json({ error: "Failed to file complaint." }); }
});

// ══════════════════════════════════════════════════════════════════════════════
//  ADMIN ROUTES
// ══════════════════════════════════════════════════════════════════════════════

// GET /api/admin/stats
app.get("/api/admin/stats", auth, adminOnly, async (req, res) => {
  try {
    const [totalUsers, totalCaregivers, pendingCaregivers, verifiedCaregivers,
           totalBookings, confirmedBookings, completedBookings, cancelledBookings,
           totalContacts, openComplaints, totalFeedback, ratingAgg] = await Promise.all([
      User.countDocuments({ role: "patient" }),
      Caregiver.countDocuments(),
      Caregiver.countDocuments({ status: "pending" }),
      Caregiver.countDocuments({ status: "verified" }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: "confirmed" }),
      Booking.countDocuments({ status: "completed" }),
      Booking.countDocuments({ status: "cancelled" }),
      Contact.countDocuments({ resolved: false }),
      Booking.countDocuments({ complaintStatus: "open" }),
      Feedback.countDocuments(),
      Feedback.aggregate([{ $group: { _id: null, avg: { $avg: "$rating" } } }]),
    ]);
    const recentBookings   = await Booking.find().sort({ createdAt: -1 }).limit(5);
    const recentCaregivers = await Caregiver.find({ status: "pending" }).sort({ createdAt: -1 }).limit(5);
    res.json({
      users:      { total: totalUsers },
      caregivers: { total: totalCaregivers, pending: pendingCaregivers, verified: verifiedCaregivers },
      bookings:   { total: totalBookings, confirmed: confirmedBookings, completed: completedBookings, cancelled: cancelledBookings },
      contacts:   { pending: totalContacts },
      complaints: { open: openComplaints },
      feedback:   { total: totalFeedback, avgRating: ratingAgg[0]?.avg?.toFixed(1) || "N/A" },
      recentBookings, recentCaregivers,
    });
  } catch (err) { res.status(500).json({ error: "Failed to fetch stats." }); }
});

// GET /api/admin/users
app.get("/api/admin/users", auth, adminOnly, async (req, res) => {
  try {
    const { role, search, limit = 20, page = 1 } = req.query;
    const filter = {};
    if (role)   filter.role = role;
    if (search) filter.$or  = [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }];
    const [users, total] = await Promise.all([
      User.find(filter).select("-password").sort({ createdAt: -1 }).skip((page-1)*limit).limit(parseInt(limit)),
      User.countDocuments(filter),
    ]);
    res.json({ total, page: parseInt(page), users });
  } catch { res.status(500).json({ error: "Failed to fetch users." }); }
});

// PATCH /api/admin/users/:userId  — activate/suspend
app.patch("/api/admin/users/:userId", auth, adminOnly, async (req, res) => {
  try {
    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(req.params.userId, { isActive }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ success: true, user });
  } catch { res.status(500).json({ error: "Failed to update user." }); }
});

// GET /api/admin/caregivers  — all caregivers (any status)
app.get("/api/admin/caregivers", auth, adminOnly, async (req, res) => {
  try {
    const { status, search, limit = 20, page = 1 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (search) filter.$or = [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }];
    const [caregivers, total] = await Promise.all([
      Caregiver.find(filter).sort({ createdAt: -1 }).skip((page-1)*limit).limit(parseInt(limit)),
      Caregiver.countDocuments(filter),
    ]);
    res.json({ total, page: parseInt(page), caregivers });
  } catch { res.status(500).json({ error: "Failed to fetch caregivers." }); }
});

// PATCH /api/admin/caregivers/:caregiverId/verify  — verify / reject / suspend
app.patch("/api/admin/caregivers/:caregiverId/verify", auth, adminOnly, async (req, res) => {
  try {
    const { status, verificationNote } = req.body;
    const valid = ["verified","rejected","suspended"];
    if (!valid.includes(status)) return res.status(400).json({ error: `status must be: ${valid.join(", ")}` });
    const cg = await Caregiver.findByIdAndUpdate(
      req.params.caregiverId,
      { status, verificationNote: verificationNote||"", verifiedAt: new Date(), verifiedBy: req.user.id },
      { new: true }
    );
    if (!cg) return res.status(404).json({ error: "Caregiver not found" });
    res.json({ success: true, caregiver: cg });
  } catch { res.status(500).json({ error: "Failed to update caregiver." }); }
});

// GET /api/admin/bookings  — all bookings
app.get("/api/admin/bookings", auth, adminOnly, async (req, res) => {
  try {
    const { status, hasComplaint, limit = 20, page = 1 } = req.query;
    const filter = {};
    if (status)       filter.status       = status;
    if (hasComplaint) filter.hasComplaint = hasComplaint === "true";
    const [bookings, total] = await Promise.all([
      Booking.find(filter).sort({ createdAt: -1 }).skip((page-1)*limit).limit(parseInt(limit)),
      Booking.countDocuments(filter),
    ]);
    res.json({ total, page: parseInt(page), bookings });
  } catch { res.status(500).json({ error: "Failed to fetch bookings." }); }
});

// PATCH /api/admin/bookings/:bookingId/assign  — assign caregiver to booking
app.patch("/api/admin/bookings/:bookingId/assign", auth, adminOnly, async (req, res) => {
  try {
    const { caregiverId } = req.body;
    const cg = await Caregiver.findById(caregiverId);
    if (!cg) return res.status(404).json({ error: "Caregiver not found" });
    const booking = await Booking.findOneAndUpdate(
      { bookingId: req.params.bookingId },
      { caregiverId: cg._id, nurseName: cg.name, status: "confirmed" },
      { new: true }
    );
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json({ success: true, booking });
  } catch { res.status(500).json({ error: "Failed to assign caregiver." }); }
});

// PATCH /api/admin/complaints/:bookingId/resolve
app.patch("/api/admin/complaints/:bookingId/resolve", auth, adminOnly, async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { bookingId: req.params.bookingId },
      { complaintStatus: "resolved" },
      { new: true }
    );
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json({ success: true, message: "Complaint resolved.", booking });
  } catch { res.status(500).json({ error: "Failed to resolve complaint." }); }
});

// GET /api/admin/complaints
app.get("/api/admin/complaints", auth, adminOnly, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { hasComplaint: true };
    if (status) filter.complaintStatus = status;
    const complaints = await Booking.find(filter).sort({ createdAt: -1 });
    res.json({ total: complaints.length, complaints });
  } catch { res.status(500).json({ error: "Failed to fetch complaints." }); }
});

// GET /api/admin/contacts
app.get("/api/admin/contacts", auth, adminOnly, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ total: contacts.length, contacts });
  } catch { res.status(500).json({ error: "Failed to fetch contacts." }); }
});

// PATCH /api/admin/contacts/:contactId/resolve
app.patch("/api/admin/contacts/:contactId/resolve", auth, adminOnly, async (req, res) => {
  try {
    const c = await Contact.findByIdAndUpdate(req.params.contactId, { resolved: true }, { new: true });
    if (!c) return res.status(404).json({ error: "Contact not found" });
    res.json({ success: true });
  } catch { res.status(500).json({ error: "Failed to resolve." }); }
});

// ══════════════════════════════════════════════════════════════════════════════
//  PUBLIC ROUTES
// ══════════════════════════════════════════════════════════════════════════════
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ error: "name, email and message required" });
    const c = await Contact.create({ contactId: genId("CT"), name: name.trim(), email: email.toLowerCase(), phone: phone||"", message: message.trim() });
    res.status(201).json({ success: true, message: "Thank you! We'll reach out within 1 hour." });
  } catch { res.status(500).json({ error: "Failed to save contact." }); }
});

app.post("/api/feedback", async (req, res) => {
  try {
    const { name, email, rating, category, feedback } = req.body;
    if (!name || !email || !feedback) return res.status(400).json({ error: "name, email and feedback required" });
    await Feedback.create({ name, email, rating: rating||null, category: category||"", feedback });
    res.status(201).json({ success: true, message: "Feedback received. Thank you!" });
  } catch { res.status(500).json({ error: "Failed to save feedback." }); }
});

app.get("/api/feedback", async (req, res) => {
  try {
    const f = await Feedback.find().sort({ createdAt: -1 });
    res.json({ total: f.length, feedbacks: f });
  } catch { res.status(500).json({ error: "Failed." }); }
});

// ── Start ──────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 NurtureCare API  →  http://localhost:${PORT}`);
  console.log(`🗄️  Database     : MongoDB Atlas`);
  console.log(`🔐 Auth         : JWT (patient / caregiver / admin)`);
  console.log(`📦 Environment  : ${process.env.NODE_ENV || "development"}\n`);
});
