// server/routes/authRoutes.js
const express = require("express");
const {
  register,
  login,
  forgotPassword,
  verifyOtp,
  resetPassword,
} = require("../controllers/authController");
const { emailMiddleware } = require("../middleware/emailMiddleware");

const router = express.Router();

router.post("/register", emailMiddleware("registration"), register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

module.exports = router;
