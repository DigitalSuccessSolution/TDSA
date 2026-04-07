// server/controllers/authController.js
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto"); // NEW: Random string generate karne ke liye

const { sendEmail } = require("../services/emailServices");
const { userTemplates, subjects } = require("../utils/emailTemplates");
const JWT_SECRET = process.env.JWT_SECRET || "academy2025supersecretkey123";

// Access Token (1 hour)
const generateAccessToken = (id, sessionId) => {
  return jwt.sign({ id, sessionId }, JWT_SECRET, {
    expiresIn: "1h",
  });
};

// Refresh Token (30 days)
const generateRefreshToken = (id, sessionId) => {
  return jwt.sign({ id, sessionId }, JWT_SECRET, {
    expiresIn: "30d",
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
    const accessToken = generateAccessToken(user._id, newSessionId);
    const refreshToken = generateRefreshToken(user._id, newSessionId);

    // Save refresh token in DB
    user.refresh_token = refreshToken;
    await user.save();

    res.status(201).json({
      message: "Registration successful!",
      accessToken,
      token: accessToken, // Backward compatibility
      refreshToken,
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

    // 3. Tokens banayein
    const accessToken = generateAccessToken(user._id, newSessionId);
    const refreshToken = generateRefreshToken(user._id, newSessionId);

    // 4. DB me update karein
    user.current_session_id = newSessionId;
    user.refresh_token = refreshToken;
    await user.save();

    res.json({
      message: "Login successful!",
      accessToken,
      token: accessToken, // Backward compatibility
      refreshToken,
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

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    user.resetPasswordOtp = otp;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

    await user.save();

    const htmlContent = userTemplates.forgot_password(user, { otp });
    const subject = subjects.forgot_password({ otp });

    await sendEmail(user.email, subject, htmlContent);

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({
      email: email.toLowerCase(),
      resetPasswordOtp: otp,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    res.status(200).json({ message: "OTP Verified" });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase(),
      resetPasswordOtp: otp,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.password = newPassword;
    user.resetPasswordOtp = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (email === adminEmail && password === adminPassword) {
      const accessToken = generateAccessToken('admin_user_id', 'admin_session');
      const refreshToken = generateRefreshToken('admin_user_id', 'admin_session');
      return res.json({
        message: "Admin Login successful!",
        accessToken,
        token: accessToken, // Backward compatibility
        refreshToken,
        user: {
          id: 'admin_user_id',
          name: 'Administrator',
          email: adminEmail,
          role: 'admin'
        }
      });
    } else {
      return res.status(401).json({ message: "Invalid Admin Credentials" });
    }
  } catch (error) {
    console.error("Admin Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    // Verify Refresh Token
    const decoded = jwt.verify(refreshToken, JWT_SECRET);
    
    // Check if user exists and token matches DB
    const user = await User.findById(decoded.id);
    if (!user || user.refresh_token !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // Generate NEW tokens (Token Rotation)
    const newSessionId = crypto.randomBytes(16).toString("hex");
    const newAccessToken = generateAccessToken(user._id, newSessionId);
    const newRefreshToken = generateRefreshToken(user._id, newSessionId);

    // Update DB
    user.current_session_id = newSessionId;
    user.refresh_token = newRefreshToken;
    await user.save();

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error("Refresh Token Error:", error);
    res.status(401).json({ message: "Invalid or expired refresh token" });
  }
};

exports.logout = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      user.refresh_token = null;
      user.current_session_id = null;
      await user.save();
    }
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
