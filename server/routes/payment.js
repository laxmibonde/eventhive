const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const { admin, db } = require("../config/firebase");
const { authMiddleware } = require("../middleware/authMiddleware");

// Initialize Razorpay with test keys
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* ─────────────────────────────────────────
   POST /api/payment/create-order
   Creates a Razorpay order before checkout
   Body: { eventId }
───────────────────────────────────────── */
router.post("/create-order", authMiddleware, async (req, res) => {
  try {
    const { eventId } = req.body;
    if (!eventId) return res.status(400).json({ error: "Event ID is required." });

    // Fetch event
    const eventDoc = await db.collection("events").doc(eventId).get();
    let event;
    if (eventDoc.exists) {
      event = { id: eventDoc.id, ...eventDoc.data() };
    } else {
      // Fallback: event might not be in DB yet (seed data scenario)
      return res.status(404).json({ error: "Event not found." });
    }

    // Check capacity
    if (event.registered >= event.capacity) {
      return res.status(400).json({ error: "Sorry, this event is fully booked!" });
    }

    // Check if user already registered
    const existingTicket = await db.collection("tickets")
      .where("userId", "==", req.user.uid)
      .where("eventId", "==", eventId)
      .get();

    if (!existingTicket.empty) {
      return res.status(400).json({ error: "You have already registered for this event." });
    }

    // Free events — skip Razorpay
    if (event.price === 0) {
      return res.json({
        free: true,
        eventId,
        eventTitle: event.title,
        message: "Free event — proceed directly to registration.",
      });
    }

    // Create Razorpay order (amount in paise)
    const order = await razorpay.orders.create({
      amount: event.price * 100, // paise
      currency: "INR",
      receipt: `eventhive_${eventId}_${req.user.uid}_${Date.now()}`,
      notes: {
        eventId,
        eventTitle: event.title,
        userId: req.user.uid,
        userEmail: req.user.email,
      },
    });

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      eventTitle: event.title,
      eventId,
    });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ─────────────────────────────────────────
   POST /api/payment/verify
   Verifies Razorpay payment signature & issues ticket
   Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, eventId }
───────────────────────────────────────── */
router.post("/verify", authMiddleware, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, eventId } = req.body;

    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: "Payment verification failed. Invalid signature." });
    }

    // Payment verified — create ticket
    const ticketResult = await createTicket(req.user, eventId, {
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });

    res.json({
      message: "Payment verified! Your ticket has been issued.",
      ticket: ticketResult,
    });
  } catch (err) {
    console.error("Verify payment error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ─────────────────────────────────────────
   POST /api/payment/free-register
   Register for a free event (no payment needed)
   Body: { eventId }
───────────────────────────────────────── */
router.post("/free-register", authMiddleware, async (req, res) => {
  try {
    const { eventId } = req.body;
    if (!eventId) return res.status(400).json({ error: "Event ID required." });

    // Fetch event and validate it's free
    const eventDoc = await db.collection("events").doc(eventId).get();
    if (!eventDoc.exists) return res.status(404).json({ error: "Event not found." });

    const event = { id: eventDoc.id, ...eventDoc.data() };
    if (event.price !== 0) {
      return res.status(400).json({ error: "This event requires payment." });
    }

    if (event.registered >= event.capacity) {
      return res.status(400).json({ error: "This event is fully booked!" });
    }

    // Check duplicate
    const existing = await db.collection("tickets")
      .where("userId", "==", req.user.uid)
      .where("eventId", "==", eventId)
      .get();
    if (!existing.empty) {
      return res.status(400).json({ error: "You are already registered for this event." });
    }

    const ticketResult = await createTicket(req.user, eventId, { paymentId: "FREE", orderId: null });

    res.json({
      message: "Registered successfully! Your free ticket is ready.",
      ticket: ticketResult,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── Helper: Create ticket in Firestore + increment event count ── */
async function createTicket(user, eventId, paymentInfo) {
  const { v4: uuidv4 } = require("uuid");
  const QRCode = require("qrcode");
  const { sendTicketEmail } = require("./tickets");

  // Generate unique ticket ID
  const ticketId = `TKT-${Date.now()}-${uuidv4().slice(0, 8).toUpperCase()}`;

  // Generate QR code as base64 data URL
  const qrData = JSON.stringify({
    ticketId,
    eventId,
    userId: user.uid,
    userEmail: user.email,
    issuedAt: new Date().toISOString(),
  });
  const qrCodeDataUrl = await QRCode.toDataURL(qrData, { width: 300, margin: 2 });

  // Get event details
  const eventDoc = await db.collection("events").doc(eventId).get();
  const event = { id: eventDoc.id, ...eventDoc.data() };

  const ticketData = {
    ticketId,
    userId: user.uid,
    userEmail: user.email,
    userName: user.name,
    eventId,
    eventTitle: event.title,
    eventDate: event.startDate,
    eventEndDate: event.endDate,
    eventVenue: event.venue,
    eventTime: event.time,
    eventPrice: event.price,
    eventAccent: event.accent || "#FF6B35",
    paymentId: paymentInfo.paymentId,
    orderId: paymentInfo.orderId || null,
    qrCode: qrCodeDataUrl,
    qrData,
    status: "active", // active | used | cancelled
    checkedIn: false,
    checkedInAt: null,
    issuedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  // Save ticket to Firestore
  await db.collection("tickets").doc(ticketId).set(ticketData);

  // Increment event registered count (atomic)
  await db.collection("events").doc(eventId).update({
    registered: admin.firestore.FieldValue.increment(1),
  });

  // Send email ticket (non-blocking)
  sendTicketEmail(user.email, user.name, {
    ticketId,
    eventTitle: event.title,
    eventDate: event.startDate,
    eventVenue: event.venue,
    eventTime: event.time,
    qrCodeDataUrl,
  }).catch(err => console.warn("Email send failed (non-critical):", err.message));

  return {
    ticketId,
    eventTitle: event.title,
    eventDate: event.startDate,
    eventVenue: event.venue,
    qrCode: qrCodeDataUrl,
  };
}

module.exports = router;
