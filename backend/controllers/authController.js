// server/controllers/authController.js
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto"); // NEW: Random string generate karne ke liye

const JWT_SECRET = process.env.JWT_SECRET || "academy2025supersecretkey123";

// generateToken ab 'sessionId' bhi lega
const generateToken = (id, sessionId) => {
  return jwt.sign({ id, sessionId }, JWT_SECRET, {
    // NEW: sessionId payload me daala
    expiresIn: "365d",
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password are required" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    // 1. Naya random Session ID create karein
    const newSessionId = crypto.randomBytes(16).toString("hex"); // NEW

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      current_session_id: newSessionId, // NEW: DB me save kiya
    });

    // 2. Token generation me session ID pass karein
    const token = generateToken(user._id, newSessionId); // NEW

    res.status(201).json({
      message: "Registration successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // --- YAHAN MAIN MAGIC HAI ---

    // 1. Login karte waqt naya Session ID banayein
    const newSessionId = crypto.randomBytes(16).toString("hex"); // NEW

    // 2. Purana session ID database me replace kar dein
    // Isse agar wo pehle phone pe login tha, to wahan ka session invalid ho jayega
    user.current_session_id = newSessionId; // NEW
    await user.save(); // NEW

    // 3. Naye session ID ke sath token banayein
    const token = generateToken(user._id, newSessionId); // NEW

    res.json({
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
