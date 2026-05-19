const express = require("express");
const router = express.Router();
const { Parser } = require("json2csv");
const { admin, db } = require("../config/firebase");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

// All admin routes require auth + admin role
router.use(authMiddleware, adminMiddleware);

/* ─────────────────────────────────────────
   GET /api/admin/stats — Dashboard stats
───────────────────────────────────────── */
router.get("/stats", async (req, res) => {
  try {
    // Run all queries in parallel
    const [ticketsSnap, eventsSnap, usersSnap] = await Promise.all([
      db.collection("tickets").get(),
      db.collection("events").get(),
      db.collection("users").get(),
    ]);

    let totalRevenue = 0;
    let totalCheckedIn = 0;
    const revenueByEvent = {};
    const registrationsByDay = {};

    ticketsSnap.forEach(doc => {
      const t = doc.data();
      const price = t.eventPrice || 0;
      totalRevenue += price;
      if (t.checkedIn) totalCheckedIn++;

      // Revenue by event
      if (!revenueByEvent[t.eventTitle]) revenueByEvent[t.eventTitle] = 0;
      revenueByEvent[t.eventTitle] += price;

      // Registrations by day
      if (t.issuedAt) {
        const day = new Date(t.issuedAt?.toDate?.() || t.issuedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
        registrationsByDay[day] = (registrationsByDay[day] || 0) + 1;
      }
    });

    // Top 5 events by revenue
    const topEvents = Object.entries(revenueByEvent)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, revenue]) => ({ name, revenue }));

    // Event capacity stats
    const eventStats = [];
    eventsSnap.forEach(doc => {
      const e = doc.data();
      eventStats.push({
        id: doc.id,
        title: e.title,
        category: e.category,
        registered: e.registered || 0,
        capacity: e.capacity || 0,
        fillPercent: Math.round(((e.registered || 0) / (e.capacity || 1)) * 100),
        price: e.price,
        revenue: (e.registered || 0) * (e.price || 0),
      });
    });

    res.json({
      overview: {
        totalTickets: ticketsSnap.size,
        totalRevenue,
        totalEvents: eventsSnap.size,
        totalUsers: usersSnap.size,
        totalCheckedIn,
        checkInRate: ticketsSnap.size > 0
          ? Math.round((totalCheckedIn / ticketsSnap.size) * 100)
          : 0,
      },
      topEvents,
      eventStats: eventStats.sort((a, b) => b.registered - a.registered),
      registrationsByDay,
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ─────────────────────────────────────────
   GET /api/admin/registrations — All registrations
   Query: eventId (optional filter)
───────────────────────────────────────── */
router.get("/registrations", async (req, res) => {
  try {
    const { eventId, page = 1, limit = 50 } = req.query;

    let query = db.collection("tickets");
    if (eventId) {
      query = query.where("eventId", "==", eventId);
    }

    const snapshot = await query.get();
    const tickets = [];
    snapshot.forEach(doc => {
      const t = doc.data();
      tickets.push({
        ticketId: t.ticketId,
        userName: t.userName,
        userEmail: t.userEmail,
        eventTitle: t.eventTitle,
        eventDate: t.eventDate,
        eventVenue: t.eventVenue,
        paymentId: t.paymentId,
        amount: t.eventPrice,
        checkedIn: t.checkedIn,
        checkedInAt: t.checkedInAt,
        status: t.status,
        issuedAt: t.issuedAt,
      });
    });

    // Sort by issuedAt desc
    tickets.sort((a, b) => {
      const da = a.issuedAt?.toDate?.() || new Date(a.issuedAt || 0);
      const db_ = b.issuedAt?.toDate?.() || new Date(b.issuedAt || 0);
      return db_ - da;
    });

    // Paginate
    const startIdx = (page - 1) * limit;
    const paginated = tickets.slice(startIdx, startIdx + Number(limit));

    res.json({
      registrations: paginated,
      total: tickets.length,
      page: Number(page),
      totalPages: Math.ceil(tickets.length / limit),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ─────────────────────────────────────────
   GET /api/admin/export-csv — Export attendees as CSV
   Query: eventId (optional)
───────────────────────────────────────── */
router.get("/export-csv", async (req, res) => {
  try {
    const { eventId } = req.query;

    let query = db.collection("tickets");
    if (eventId) query = query.where("eventId", "==", eventId);

    const snapshot = await query.get();
    const rows = [];
    snapshot.forEach(doc => {
      const t = doc.data();
      rows.push({
        "Ticket ID": t.ticketId,
        "Name": t.userName,
        "Email": t.userEmail,
        "Event": t.eventTitle,
        "Date": t.eventDate,
        "Venue": t.eventVenue,
        "Amount Paid (₹)": t.eventPrice || 0,
        "Payment ID": t.paymentId,
        "Checked In": t.checkedIn ? "Yes" : "No",
        "Checked In At": t.checkedInAt || "-",
        "Status": t.status,
      });
    });

    if (rows.length === 0) {
      return res.status(404).json({ error: "No registrations found." });
    }

    const parser = new Parser();
    const csv = parser.parse(rows);

    const filename = eventId ? `event_${eventId}_attendees.csv` : `all_registrations_${Date.now()}.csv`;

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ─────────────────────────────────────────
   POST /api/admin/scan-qr — Validate a QR at checkin
   Body: { qrData } — the raw JSON string from QR scan
───────────────────────────────────────── */
router.post("/scan-qr", async (req, res) => {
  try {
    const { qrData } = req.body;
    if (!qrData) return res.status(400).json({ error: "QR data required." });

    let parsed;
    try {
      parsed = JSON.parse(qrData);
    } catch {
      return res.status(400).json({ valid: false, message: "❌ Invalid QR code format." });
    }

    const { ticketId } = parsed;
    if (!ticketId) return res.status(400).json({ valid: false, message: "❌ Malformed QR code." });

    const doc = await db.collection("tickets").doc(ticketId).get();
    if (!doc.exists) {
      return res.status(404).json({ valid: false, message: "❌ Ticket not found." });
    }

    const ticket = doc.data();

    if (ticket.status === "cancelled") {
      return res.json({ valid: false, message: "❌ This ticket has been cancelled." });
    }

    if (ticket.checkedIn) {
      return res.json({
        valid: false,
        message: `⚠️ Already checked in at ${ticket.checkedInAt}`,
        ticket: { ticketId, userName: ticket.userName, eventTitle: ticket.eventTitle },
      });
    }

    await db.collection("tickets").doc(ticketId).update({
      checkedIn: true,
      checkedInAt: new Date().toISOString(),
      status: "used",
      scannedBy: req.user.uid,
    });

    res.json({
      valid: true,
      message: `✅ Entry granted! Welcome, ${ticket.userName}!`,
      ticket: {
        ticketId,
        userName: ticket.userName,
        userEmail: ticket.userEmail,
        eventTitle: ticket.eventTitle,
        eventDate: ticket.eventDate,
        eventVenue: ticket.eventVenue,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ─────────────────────────────────────────
   GET /api/admin/users — List all users
───────────────────────────────────────── */
router.get("/users", async (req, res) => {
  try {
    const snapshot = await db.collection("users").orderBy("createdAt", "desc").get();
    const users = [];
    snapshot.forEach(doc => {
      const { uid, name, email, role, createdAt } = doc.data();
      users.push({ uid, name, email, role, createdAt });
    });
    res.json({ users, total: users.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ─────────────────────────────────────────
   PATCH /api/admin/users/:uid/role — Change user role
   Body: { role: "admin" | "user" }
───────────────────────────────────────── */
router.patch("/users/:uid/role", async (req, res) => {
  try {
    const { uid } = req.params;
    const { role } = req.body;

    if (!["admin", "user"].includes(role)) {
      return res.status(400).json({ error: "Role must be 'admin' or 'user'." });
    }

    await db.collection("users").doc(uid).update({ role });
    res.json({ message: `User role updated to ${role}.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
