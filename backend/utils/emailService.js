const nodemailer = require("nodemailer");

/* ─────────────────────────────────────────────────────────────
   Transporter — uses SMTP credentials from .env
   Supports Gmail (with App Password) or any SMTP provider.
───────────────────────────────────────────────────────────── */
const createTransporter = () =>
  nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",   // e.g. "gmail"
    auth: {
      user: process.env.EMAIL_USER,                  // admin@yourapp.com
      pass: process.env.EMAIL_PASS,                  // Gmail App Password
    },
  });

/* ─────────────────────────────────────────────────────────────
   Shared HTML wrapper for all emails
───────────────────────────────────────────────────────────── */
const wrap = (body) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { background:#f4f7fb; font-family:'Segoe UI',Arial,sans-serif; }
    .shell { max-width:600px; margin:32px auto; background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08); }
    .header { background:linear-gradient(135deg,#0B1D3A 0%,#0d2d4a 100%); padding:32px 40px; text-align:center; }
    .header .logo { font-size:28px; margin-bottom:6px; }
    .header h1 { color:#fff; font-size:22px; font-weight:700; letter-spacing:0.5px; }
    .header p  { color:rgba(255,255,255,0.55); font-size:13px; margin-top:4px; }
    .body { padding:36px 40px; }
    .badge { display:inline-block; padding:5px 14px; border-radius:20px; font-size:12px; font-weight:700; letter-spacing:0.5px; margin-bottom:20px; }
    .badge-new      { background:#E8F6FF; color:#0B7DD4; }
    .badge-approved { background:#E6FFF4; color:#0D8A4E; }
    .badge-rejected { background:#FFF0F0; color:#D03030; }
    h2 { font-size:20px; color:#0B1D3A; margin-bottom:12px; }
    p  { font-size:15px; color:#444; line-height:1.7; margin-bottom:12px; }
    .card { background:#F8FAFC; border:1px solid #E2E8F0; border-radius:12px; padding:20px 24px; margin:20px 0; }
    .card .row { display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #EEF1F5; font-size:14px; }
    .card .row:last-child { border-bottom:none; }
    .card .label { color:#6B7C93; font-weight:500; }
    .card .value { color:#0B1D3A; font-weight:700; max-width:60%; text-align:right; }
    .cta { display:inline-block; margin-top:8px; padding:13px 28px; background:linear-gradient(135deg,#00A99D,#00CEC3); color:#fff; text-decoration:none; border-radius:10px; font-weight:700; font-size:15px; }
    .note { background:#FFFBEB; border-left:3px solid #F59E0B; border-radius:0 8px 8px 0; padding:12px 16px; margin:16px 0; font-size:14px; color:#78350F; }
    .footer { background:#F8FAFC; padding:20px 40px; text-align:center; font-size:12px; color:#aaa; border-top:1px solid #E2E8F0; }
  </style>
</head>
<body>
  <div class="shell">
    <div class="header">
      <div class="logo">🩺</div>
      <h1>NurtureCare</h1>
      <p>Home Nursing Care Platform</p>
    </div>
    <div class="body">${body}</div>
    <div class="footer">
      © ${new Date().getFullYear()} NurtureCare · This is an automated message, please do not reply directly.
    </div>
  </div>
</body>
</html>`;

/* ─────────────────────────────────────────────────────────────
   1.  ADMIN NOTIFICATION — new caregiver registered
───────────────────────────────────────────────────────────── */
const sendAdminCaregiverNotification = async (caregiver) => {
  const transporter = createTransporter();

  const adminUrl = process.env.ADMIN_DASHBOARD_URL || "http://localhost:3000/admin";

  const html = wrap(`
    <span class="badge badge-new">🆕 New Caregiver Registration</span>
    <h2>A new caregiver has submitted their profile</h2>
    <p>Please review and verify their details in the admin dashboard.</p>

    <div class="card">
      <div class="row"><span class="label">Name</span>          <span class="value">${caregiver.name}</span></div>
      <div class="row"><span class="label">Email</span>         <span class="value">${caregiver.email}</span></div>
      <div class="row"><span class="label">Phone</span>         <span class="value">${caregiver.phone || "—"}</span></div>
      <div class="row"><span class="label">Role</span>          <span class="value">${caregiver.role}</span></div>
      <div class="row"><span class="label">Experience</span>    <span class="value">${caregiver.experience || "—"}</span></div>
      <div class="row"><span class="label">License No.</span>   <span class="value">${caregiver.licenseNumber || "—"}</span></div>
      <div class="row"><span class="label">Specializations</span><span class="value">${caregiver.specializations?.join(", ") || "—"}</span></div>
      <div class="row"><span class="label">Service Areas</span> <span class="value">${caregiver.serviceAreas?.join(", ") || "—"}</span></div>
      <div class="row"><span class="label">Caregiver ID</span>  <span class="value">${caregiver.caregiverId}</span></div>
      <div class="row"><span class="label">Submitted At</span>  <span class="value">${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST</span></div>
    </div>

    <div class="note">⏳ This profile is currently <strong>pending verification</strong>. Please log in to the admin dashboard to approve or reject.</div>

    <a href="${adminUrl}" class="cta">Go to Admin Dashboard →</a>
  `);

  await transporter.sendMail({
    from:    `"NurtureCare Admin" <${process.env.EMAIL_USER}>`,
    to:      process.env.ADMIN_EMAIL,
    subject: `🆕 New Caregiver Registration — ${caregiver.name} (${caregiver.caregiverId})`,
    html,
  });

  console.log(`📧 Admin notified of new caregiver: ${caregiver.name}`);
};

/* ─────────────────────────────────────────────────────────────
   2.  CAREGIVER APPROVED email
───────────────────────────────────────────────────────────── */
const sendCaregiverApprovedEmail = async (caregiver, note = "") => {
  const transporter = createTransporter();

  const html = wrap(`
    <span class="badge badge-approved">✅ Profile Verified</span>
    <h2>Congratulations, ${caregiver.name.split(" ")[0]}! Your profile is approved.</h2>
    <p>Your caregiver profile has been reviewed and <strong>verified</strong> by the NurtureCare admin team. You can now accept service requests from patients.</p>

    <div class="card">
      <div class="row"><span class="label">Caregiver ID</span> <span class="value">${caregiver.caregiverId}</span></div>
      <div class="row"><span class="label">Name</span>         <span class="value">${caregiver.name}</span></div>
      <div class="row"><span class="label">Role</span>         <span class="value">${caregiver.role}</span></div>
      <div class="row"><span class="label">Status</span>       <span class="value" style="color:#0D8A4E">✅ Verified</span></div>
      <div class="row"><span class="label">Verified On</span>  <span class="value">${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST</span></div>
    </div>

    ${note ? `<div class="note">📝 Note from admin: <em>${note}</em></div>` : ""}

    <p>Log in to your dashboard to manage your availability and start receiving bookings.</p>
    <a href="${process.env.ADMIN_DASHBOARD_URL?.replace("/admin", "/caregiver/dashboard") || "http://localhost:3000/caregiver/dashboard"}" class="cta">Go to My Dashboard →</a>
  `);

  await transporter.sendMail({
    from:    `"NurtureCare Team" <${process.env.EMAIL_USER}>`,
    to:      caregiver.email,
    subject: `✅ Your NurtureCare profile has been verified!`,
    html,
  });

  console.log(`📧 Approval email sent to caregiver: ${caregiver.email}`);
};

/* ─────────────────────────────────────────────────────────────
   3.  CAREGIVER REJECTED email
───────────────────────────────────────────────────────────── */
const sendCaregiverRejectedEmail = async (caregiver, note = "") => {
  const transporter = createTransporter();

  const html = wrap(`
    <span class="badge badge-rejected">❌ Profile Not Approved</span>
    <h2>Hi ${caregiver.name.split(" ")[0]}, your profile needs attention.</h2>
    <p>After reviewing your submitted profile, our admin team was unable to verify it at this time.</p>

    <div class="card">
      <div class="row"><span class="label">Caregiver ID</span> <span class="value">${caregiver.caregiverId}</span></div>
      <div class="row"><span class="label">Status</span>       <span class="value" style="color:#D03030">❌ Rejected</span></div>
      <div class="row"><span class="label">Reviewed On</span>  <span class="value">${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST</span></div>
    </div>

    ${note
      ? `<div class="note">📝 Reason: <em>${note}</em></div>`
      : `<div class="note">Please ensure your license number, ID proof, and specializations are accurate and up to date.</div>`
    }

    <p>You may update your profile and resubmit for review, or contact our support team for assistance.</p>
    <a href="mailto:${process.env.SUPPORT_EMAIL || process.env.ADMIN_EMAIL}" class="cta">Contact Support →</a>
  `);

  await transporter.sendMail({
    from:    `"NurtureCare Team" <${process.env.EMAIL_USER}>`,
    to:      caregiver.email,
    subject: `❌ NurtureCare — Profile verification update`,
    html,
  });

  console.log(`📧 Rejection email sent to caregiver: ${caregiver.email}`);
};

module.exports = {
  sendAdminCaregiverNotification,
  sendCaregiverApprovedEmail,
  sendCaregiverRejectedEmail,
};