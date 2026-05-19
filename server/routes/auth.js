const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { admin, db, auth } = require("../config/firebase");
const { authMiddleware } = require("../middleware/authMiddleware");

const JWT_EXPIRES = "7d";

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

/* ─────────────────────────────────────────
   POST /api/auth/signup
   Body: { name, email, password }
───────────────────────────────────────── */
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email and password are required." });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters." });
    }

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      displayName: name,
      email,
      password,
    });

    // Determine role — admin email gets admin role
    const role = email === process.env.ADMIN_EMAIL ? "admin" : "user";

    // Store user profile in Firestore
    await db.collection("users").doc(userRecord.uid).set({
      uid: userRecord.uid,
      name,
      email,
      role,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const token = signToken({ uid: userRecord.uid, email, name, role });

    res.status(201).json({
      message: "Account created successfully!",
      token,
      user: { uid: userRecord.uid, name, email, role },
    });
  } catch (err) {
    // Firebase error codes
    if (err.code === "auth/email-already-exists") {
      return res.status(409).json({ error: "This email is already registered." });
    }
    if (err.code === "auth/invalid-email") {
      return res.status(400).json({ error: "Invalid email address." });
    }
    console.error("Signup error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ─────────────────────────────────────────
   POST /api/auth/login
   Body: { email, password }
───────────────────────────────────────── */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    // Firebase Admin SDK doesn't support password verification directly.
    // We use the Firebase REST API for email/password sign-in.
    const fetch = (await import("node-fetch")).default;
    const firebaseApiKey = process.env.FIREBASE_WEB_API_KEY;

    // If FIREBASE_WEB_API_KEY is set, use proper Firebase REST auth
    if (firebaseApiKey) {
      const firebaseRes = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseApiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, returnSecureToken: true }),
        }
      );
      const firebaseData = await firebaseRes.json();

      if (firebaseData.error) {
        const msg = firebaseData.error.message;
        if (msg.includes("EMAIL_NOT_FOUND") || msg.includes("INVALID_PASSWORD") || msg.includes("INVALID_LOGIN_CREDENTIALS")) {
          return res.status(401).json({ error: "Invalid email or password." });
        }
        return res.status(400).json({ error: msg });
      }

      // Fetch user profile from Firestore
      const userDoc = await db.collection("users").doc(firebaseData.localId).get();
      const userData = userDoc.exists ? userDoc.data() : {};

      const role = userData.role || (email === process.env.ADMIN_EMAIL ? "admin" : "user");
      const name = userData.name || firebaseData.displayName || email.split("@")[0];

      const token = signToken({ uid: firebaseData.localId, email, name, role });

      return res.json({
        message: "Login successful!",
        token,
        user: { uid: firebaseData.localId, email, name, role },
      });
    }

    // Fallback: look up user by email (no password check — only for dev/demo)
    // In production, always set FIREBASE_WEB_API_KEY
    const userRecord = await auth.getUserByEmail(email).catch(() => null);
    if (!userRecord) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const userDoc = await db.collection("users").doc(userRecord.uid).get();
    const userData = userDoc.exists ? userDoc.data() : {};
    const role = userData.role || (email === process.env.ADMIN_EMAIL ? "admin" : "user");
    const name = userData.name || userRecord.displayName || email.split("@")[0];

    const token = signToken({ uid: userRecord.uid, email, name, role });

    res.json({
      message: "Login successful!",
      token,
      user: { uid: userRecord.uid, email, name, role },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed. Please try again." });
  }
});

/* ─────────────────────────────────────────
   POST /api/auth/google
   Body: { idToken } — Firebase Google ID token from frontend
───────────────────────────────────────── */
router.post("/google", async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ error: "ID token required." });

    // Verify the Google ID token via Firebase Admin
    const decoded = await auth.verifyIdToken(idToken);
    const { uid, email, name: displayName } = decoded;

    // Upsert user in Firestore
    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    let role = "user";
    let name = displayName || email.split("@")[0];

    if (userDoc.exists) {
      role = userDoc.data().role || "user";
      name = userDoc.data().name || name;
    } else {
      role = email === process.env.ADMIN_EMAIL ? "admin" : "user";
      await userRef.set({
        uid,
        name,
        email,
        role,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    const token = signToken({ uid, email, name, role });

    res.json({
      message: "Google login successful!",
      token,
      user: { uid, email, name, role },
    });
  } catch (err) {
    console.error("Google auth error:", err);
    res.status(401).json({ error: "Google authentication failed." });
  }
});

/* ─────────────────────────────────────────
   GET /api/auth/me — Get current user profile
───────────────────────────────────────── */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const userDoc = await db.collection("users").doc(req.user.uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found." });
    }
    const data = userDoc.data();
    // Don't send sensitive fields
    const { uid, name, email, role, createdAt } = data;
    res.json({ uid, name, email, role, createdAt });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
