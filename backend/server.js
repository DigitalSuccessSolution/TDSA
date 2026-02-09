// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const app = express();

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const allowedOrigins = [
  "http://localhost:5173", "https://tdsa-lime.vercel.app",
  "http://localhost:5174", "https://tdsacad.com", "http://tdsacad.com", "https://www.tdsacad.com", "http://www.tdsacad.com"
];
app.use(
  cors({
    origin: function (origin, callback) {
      // origin null ho sakta hai (Postman ya server-to-server requests ke liye)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log('CORS blocked origin:', origin);  // Debug log added
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],  // Explicit methods
    allowedHeaders: ['Content-Type', 'Authorization']  // Explicit headers
  })
);
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// =================== YE TEENO ROUTES ADD KAR DO ===================
app.use('/api/admin/faculty', require('./routes/adminFaculty'));
app.use('/api/auth', require('./routes/auth'));           // NAYA: Register & Login
app.use('/api/faculty', require('./routes/facultyRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/site', require('./routes/siteRoutes'));
app.use('/api/enrollments', require('./routes/enrollmentRoutes'));
app.use('/api/quizzes', require('./routes/quizRoutes'));
app.use('/api/student', require('./routes/studentPanel'));
app.use('/api/student/quiz', require('./routes/studentRoutes'));
app.use('/api/reviews', require('./routes/review'));
app.use('/api/certificate', require('./routes/certificateRoutes'));
// Global Error Handler 
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/curriculum')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server chal raha hai port ${PORT} pe`);
});