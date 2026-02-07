const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { protectFaculty } = require('../middleware/authFaculty');
const { emailMiddleware } = require('../middleware/emailMiddleware');

// =================================== ===============================
// NOTE: Make sure function names match your quizController.js exactly
// ==================================================================

// 1. Get All Quizzes for Logged in Faculty
// (Check quizController.js: Is it 'getFacultyQuizzes' or 'getAllQuizzes'?)
router.get('/', protectFaculty, quizController.getFacultyQuizzes); 

// 2. Create a Quiz
router.post('/', emailMiddleware("notification"), protectFaculty, quizController.createQuiz);

// 3. Update a Quiz
router.put('/:id', protectFaculty, quizController.updateQuiz);

// 4. Delete a Quiz
router.delete('/:id', protectFaculty, quizController.deleteQuiz);

// 5. Get Quiz Results
router.get('/:quizId/results', protectFaculty, quizController.getQuizResults);

module.exports = router;