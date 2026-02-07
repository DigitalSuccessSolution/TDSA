const express = require('express');
const router = express.Router();
const studentQuizController = require('../controllers/studentQuizController');
const { protect } = require('../middleware/auth');

// 1. Get Quizzes of a specific Course (Student ke liye)
router.get('/quizzes/:courseId', protect, studentQuizController.getQuizzesForStudent);

// 2. Submit Quiz Answer
router.post('/quizzes/:quizId/submit', protect, studentQuizController.submitQuiz);

module.exports = router;