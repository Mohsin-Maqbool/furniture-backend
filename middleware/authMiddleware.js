const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect Routes (must be logged in)
const protect = async (req, res, next) => {
  let token = null;

  // Check "Authorization: Bearer <token>"
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Admin Only Middleware
const adminOnly = (req, res, next) => {
  if (req.user?.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Admin access only" });
};

module.exports = { protect, adminOnly };
