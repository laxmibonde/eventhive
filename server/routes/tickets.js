const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const { db } = require("../config/firebase");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

/* ─────────────────────────────────────────
   GET /api/tickets/my — Get logged-in user's tickets
───────────────────────────────────────── */
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const snapshot = await db.collection("tickets")
      .where("userId", "==", req.user.uid)
      .orderBy("issuedAt", "desc")
      .get();

    const tickets = [];
    snapshot.forEach(doc => tickets.push({ id: doc.id, ...doc.data() }));

    res.json({ tickets, count: tickets.length });
  } catch (err) {
    // If index not built yet, return without ordering
    if (err.code === 9) {
      const snapshot = await db.collection("tickets")
        .where("userId", "==", req.user.uid)
        .get();
      const tickets = [];
      snapshot.forEach(doc => tickets.push({ id: doc.id, ...doc.data() }));
      return res.json({ tickets, count: tickets.length });
    }
    res.status(500).json({ error: err.message });
  }
});

/* ─────────────────────────────────────────
   GET /api/tickets/validate/:ticketId
   Admin: validate a QR code at event entry
───────────────────────────────────────── */
router.get("/validate/:ticketId", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { ticketId } = req.params;
    const doc = await db.collection("tickets").doc(ticketId).get();

    if (!doc.exists) {
      return res.status(404).json({ valid: false, message: "❌ Ticket not found. Invalid QR code." });
    }

    const ticket = doc.data();

    if (ticket.status === "cancelled") {
      return res.json({ valid: false, message: "❌ This ticket has been cancelled." });
    }

    if (ticket.checkedIn) {
      return res.json({
        valid: false,
        message: `⚠️ Already checked in at ${new Date(ticket.checkedInAt?.toDate?.() || ticket.checkedInAt).toLocaleTimeString("en-IN")}`,
        ticket: { ticketId, userName: ticket.userName, eventTitle: ticket.eventTitle },
      });
    }

    // Mark as checked in
    await db.collection("tickets").doc(ticketId).update({
      checkedIn: true,
      checkedInAt: new Date().toISOString(),
      status: "used",
    });

    res.json({
      valid: true,
      message: `✅ Valid! Welcome, ${ticket.userName}!`,
      ticket: {
        ticketId,
        userName: ticket.userName,
        userEmail: ticket.userEmail,
        eventTitle: ticket.eventTitle,
        eventDate: ticket.eventDate,
        eventVenue: ticket.eventVenue,
        paymentId: ticket.paymentId,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ─────────────────────────────────────────
   GET /api/tickets/:ticketId — Get single ticket
───────────────────────────────────────── */
router.get("/:ticketId", authMiddleware, async (req, res) => {
  try {
    const doc = await db.collection("tickets").doc(req.params.ticketId).get();
    if (!doc.exists) return res.status(404).json({ error: "Ticket not found." });

    const ticket = doc.data();
    // Users can only see their own tickets
    if (ticket.userId !== req.user.uid && req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied." });
    }

    res.json({ id: doc.id, ...ticket });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ─────────────────────────────────────────
   Email helper — send QR ticket via Nodemailer
───────────────────────────────────────── */
async function sendTicketEmail(toEmail, toName, ticketInfo) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("📧 Email not configured — skipping email send");
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Gmail App Password
    },
  });

  const { ticketId, eventTitle, eventDate, eventVenue, eventTime, qrCodeDataUrl } = ticketInfo;

  // Format date nicely
  const dateStr = new Date(eventDate).toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  });

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
    <body style="margin:0;padding:0;background:#050508;font-family:'Segoe UI',Arial,sans-serif;">
      <div style="max-width:600px;margin:0 auto;background:#0D0D14;border-radius:20px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.8);">
        
        <!-- Header -->
        <div style="background:linear-gradient(135deg,#FF6B35,#FF3CAC,#8B5CF6);padding:40px;text-align:center;">
          <div style="font-size:36px;margin-bottom:8px;">⬡</div>
          <div style="color:#fff;font-size:28px;font-weight:800;letter-spacing:-1px;">EventHive</div>
          <div style="color:rgba(255,255,255,0.8);font-size:14px;margin-top:4px;">Your Ticket is Confirmed! 🎉</div>
        </div>

        <!-- Body -->
        <div style="padding:40px;">
          <p style="color:#9CA3AF;font-size:16px;margin-bottom:8px;">Hey ${toName},</p>
          <h2 style="color:#fff;font-size:24px;font-weight:800;margin:0 0 24px;">You're in for <span style="color:#FF6B35;">${eventTitle}</span>!</h2>

          <!-- Event Info -->
          <div style="background:#1A1A2E;border-radius:16px;padding:24px;margin-bottom:28px;border:1px solid rgba(255,255,255,0.06);">
            <div style="display:flex;justify-content:space-between;margin-bottom:12px;">
              <span style="color:#6B7280;font-size:13px;">📅 Date</span>
              <span style="color:#E5E7EB;font-size:13px;font-weight:600;">${dateStr}</span>
            </div>
            <div style="display:flex;justify-content:space-between;margin-bottom:12px;">
              <span style="color:#6B7280;font-size:13px;">⏰ Time</span>
              <span style="color:#E5E7EB;font-size:13px;font-weight:600;">${eventTime}</span>
            </div>
            <div style="display:flex;justify-content:space-between;">
              <span style="color:#6B7280;font-size:13px;">📍 Venue</span>
              <span style="color:#E5E7EB;font-size:13px;font-weight:600;">${eventVenue}</span>
            </div>
          </div>

          <!-- QR Code -->
          <div style="text-align:center;margin-bottom:28px;">
            <p style="color:#9CA3AF;font-size:14px;margin-bottom:16px;">Show this QR code at the event entrance</p>
            <div style="display:inline-block;background:#fff;padding:16px;border-radius:16px;">
              <img src="${qrCodeDataUrl}" alt="QR Ticket" style="width:200px;height:200px;display:block;" />
            </div>
            <p style="color:#4B5563;font-size:12px;margin-top:12px;font-family:monospace;letter-spacing:2px;">${ticketId}</p>
          </div>

          <p style="color:#6B7280;font-size:13px;text-align:center;line-height:1.7;">
            Keep this email handy. Your QR code is your entry pass.<br>
            Have an amazing time! 🎪
          </p>
        </div>

        <!-- Footer -->
        <div style="background:#050508;padding:24px;text-align:center;border-top:1px solid rgba(255,255,255,0.05);">
          <p style="color:#374151;font-size:12px;margin:0;">© 2025 EventHive · India's #1 College Event Platform</p>
        </div>

      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"EventHive 🎪" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `🎟️ Your Ticket for ${eventTitle} — EventHive`,
    html,
  });

  console.log(`📧 Ticket email sent to ${toEmail}`);
}

module.exports = router;
module.exports.sendTicketEmail = sendTicketEmail;
