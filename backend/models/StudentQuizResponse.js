const mongoose = require('mongoose');

const studentQuizResponseSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  answers: [{
    questionId: String,
    selectedIndex: Number,
    isCorrect: Boolean
  }],
  score: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  attemptedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StudentQuizResponse', studentQuizResponseSchema);