// server/middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, please login" });
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET || "academy2025supersecretkey123";
    const decoded = jwt.verify(token, JWT_SECRET);

    // Check if it's the simulated admin
    if (decoded.id === "admin_user_id") {
      req.user = {
        id: "admin_user_id",
        _id: "admin_user_id",
        role: "admin",
        name: "Administrator",
      };
      return next();
    }

    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) return res.status(401).json({ message: "User not found" });

    // Strong Security: Session ID check
    // Agar login/refresh hone par sessionId badal gaya hai, toh purana Access Token invalid ho jayega
    if (req.user.current_session_id !== decoded.sessionId) {
      return res.status(401).json({ message: "Session expired, please login again" });
    }

    next();
  } catch (err) {
    console.error("JWT ERROR:", err.message, "|", err.name);
    return res
      .status(401)
      .json({ message: "Token expired please Login Again" });
  }
};
