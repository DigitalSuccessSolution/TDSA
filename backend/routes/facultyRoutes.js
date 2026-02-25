const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");
const { protectFaculty } = require("../middleware/authFaculty");
const { emailMiddleware } = require("../middleware/emailMiddleware");
const facultyController = require("../controllers/facultyController");
// ✅ Import Cloudinary Config
const { upload } = require("../utils/uploadToCloudinary");

router.get("/me", protectFaculty, facultyController.getCurrentFaculty);
router.get("/assignments", facultyController.getFacultyWithCourses);
router.post("/register", facultyController.registerFaculty);
router.post("/login", facultyController.loginFaculty);
router.post("/forgot-password", facultyController.forgotPassword);
router.post("/verify-otp", facultyController.verifyOtp);
router.post("/reset-password", facultyController.resetPassword);
router.get("/", facultyController.getFaculty);
router.get("/courses", protectFaculty, facultyController.getMyAssignedCourses);

// Class Routes
router.post("/classes", protectFaculty, facultyController.addClass);
router.put("/classes/:id", protectFaculty, facultyController.updateClass);
router.delete("/classes/:id", protectFaculty, facultyController.deleteClass);

// Lecture Links
router.get(
  "/courses/:courseId/modules/:moduleId/lectures/:lectureId/link",
  protectFaculty,
  facultyController.getLectureLinks,
);
router.post(
  "/courses/:courseId/modules/:moduleId/lectures/:lectureId/link",
  emailMiddleware("lecture_link_notification"), // ✅ Added Email Notification
  protectFaculty,
  facultyController.addLectureLink,
);
router.delete(
  "/courses/:courseId/modules/:moduleId/lectures/:lectureId/link/:linkId",
  protectFaculty,
  facultyController.deleteLectureLink,
);

// --- QUIZ ROUTES ---

// GET /api/faculty/quizzes
router.get("/quizzes", protectFaculty, quizController.getFacultyQuizzes);

// POST /api/faculty/quizzes
router.post(
  "/quizzes",
  emailMiddleware("quiz_notification"), // ✅ Updated Template
  protectFaculty,
  quizController.createQuiz,
);

// PUT /api/faculty/quizzes/:id
router.put("/quizzes/:id", protectFaculty, quizController.updateQuiz);

// DELETE /api/faculty/quizzes/:id
router.delete("/quizzes/:id", protectFaculty, quizController.deleteQuiz);

// GET Results
router.get(
  "/quizzes/:quizId/results",
  protectFaculty,
  quizController.getQuizResults,
);
router.delete("/:id", facultyController.deleteFaculty);

// -----------------------------------------------------
// ✅ NOTE FOR STUDENT ROUTE (For reference):
// Use 'upload.single("answerSheet")' to handle file
// router.post("/student/submit-quiz", protectStudent, upload.single("answerSheet"), quizController.submitStudentQuiz);
// -----------------------------------------------------

module.exports = router;
