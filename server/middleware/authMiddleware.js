const jwt = require("jsonwebtoken");
const { db } = require("../config/firebase");

/* ── Verify JWT and attach user to req ── */
async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided. Please log in." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded user info to request
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Session expired. Please log in again." });
    }
    return res.status(401).json({ error: "Invalid token." });
  }
}

/* ── Admin-only guard ── */
async function adminMiddleware(req, res, next) {
  try {
    // authMiddleware must run first
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated." });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required." });
    }

    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { authMiddleware, adminMiddleware };
