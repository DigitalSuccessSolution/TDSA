const mongoose = require("mongoose");

const studentQuizResultSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Ya 'Student' jo bhi apka model name hai
    required: true,
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  score: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  totalQuestions: { type: Number, required: true }, // Extra utility field
  correctAnswers: { type: Number, required: true },
  wrongAnswers: { type: Number, required: true },

  // NEW: Certificate Number (Unique)
  certificateNumber: { type: String, unique: true, sparse: true },

  // Detailed Analysis
  answers: [
    {
      questionId: String,
      selectedOptionIds: [String], // Frontend se 'selectedOptions' aayega, hum isme map karenge
      isCorrect: Boolean,
    },
  ],

  // 🔥 IMPORTANT: File Upload ke liye ye field zaroori hai
  submittedFile: {
    type: String,
    default: null,
  },

  attemptedAt: { type: Date, default: Date.now },
});

// Note: Unique index removed to allow multiple attempts as per requirement.

module.exports = mongoose.model("StudentQuizResult", studentQuizResultSchema);
