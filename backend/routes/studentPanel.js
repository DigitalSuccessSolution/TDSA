const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
// 1. Controller Import (Path aur File name check karein)
const studentQuizController = require("../controllers/studentQuizController");

// 2. Auth Middleware Import (Path check karein - usually authMiddleware.js hota hai)
const { protect } = require("../middleware/auth");

// --- SAFETY CHECK (Debugging) ---
if (
  !studentQuizController.getQuizzesForStudent ||
  !studentQuizController.submitQuiz
) {
  console.error(
    "❌ ERROR: Controller functions not found! Check studentQuizController.js exports."
  );
}

// --- ROUTES ---

// 1. Get Quizzes for a Course
// (Controller me function ka naam 'getQuizzesForStudent' hai)
router.get(
  "/quizzes/:courseId",
  protect,
  studentQuizController.getQuizzesForStudent
);

// 2. Submit Quiz
// (Controller me function ka naam 'submitQuiz' hai)
router.post(
  "/quizzes/:quizId/submit",
  protect,
  upload.single("answerSheet"), // <--- YE MISSING HOGA TO ERROR AAYEGA
  studentQuizController.submitQuiz
);
router.get("/quiz/:quizId", protect, studentQuizController.getQuizForAttempt);
// 3. Get History (Optional - agar controller me ye function hai to hi uncomment karein)
if (studentQuizController.getAttemptHistory) {
  router.get(
    "/quizzes/:quizId/attempts",
    protect,
    studentQuizController.getAttemptHistory
  );
}

module.exports = router;
