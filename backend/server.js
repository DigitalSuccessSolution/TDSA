console.log("---- STARTING BACKEND SERVER --");
// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

const app = express();

// ---------------- CLOUDINARY CONFIG ----------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ---------------- BODY PARSERS ----------------
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

// ---------------- EXEMPT PAYMENT CALLBACKS ----------------
// We define these before CORS so PayU can POST to them without CORS issues
// But we still need cors() for the initial AJAX call from the frontend
app.use("/api/payment", cors(), require("./routes/paymentRoutes"));
app.post(
  "/api/create-payment",
  cors(),
  require("./controllers/paymentController").createPayment,
);

// ---------------- CORS CONFIG ----------------
// Allow localhost, vercel app, and all tdsacad.com variants
app.use(
  cors({
    origin: function (origin, callback) {
      if (
        !origin || // Postman or server-to-server
        origin.endsWith("tdsacad.com") ||
        origin.endsWith("tdsa-lime.vercel.app") ||
        origin.includes("localhost") ||
        origin.includes("payu.in")
      ) {
        callback(null, true);
      } else {
        console.log("CORS blocked origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow cookies/auth headers
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// ---------------- ROUTES ----------------
app.use("/api/admin/faculty", require("./routes/adminFaculty"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/faculty", require("./routes/facultyRoutes"));
app.use("/api/courses", require("./routes/courseRoutes"));
app.use("/api/site", require("./routes/siteRoutes"));
app.use("/api/enrollments", require("./routes/enrollmentRoutes"));
app.use("/api/quizzes", require("./routes/quizRoutes"));
app.use("/api/student", require("./routes/studentPanel"));
app.use("/api/student/quiz", require("./routes/studentRoutes"));
app.use("/api/reviews", require("./routes/review"));
app.use("/api/certificate", require("./routes/certificateRoutes"));
app.use("/api/coupons", require("./routes/couponRoutes"));

// ---------------- GLOBAL ERROR HANDLER ----------------
app.use((err, req, res, next) => {
  console.error("SERVER ERROR STACK:", err.stack); // Full stack trace
  res
    .status(500)
    .json({ message: "Internal Server Error", error: err.message, stack: process.env.NODE_ENV === 'development' ? err.stack : undefined });
});

// ---------------- MONGODB CONNECTION ----------------
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");
    console.log("Database Name:", mongoose.connection.name);
  })
  .catch((err) => {
    console.error("MongoDB Connection Error Details:");
    console.error("Message:", err.message);
    console.error("Code:", err.code);
  });

// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} `);
});
