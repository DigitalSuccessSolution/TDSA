// controllers/studentQuizController.js

const Quiz = require("../models/Quiz");
const StudentQuizResult = require("../models/StudentQuizResult");
const mongoose = require("mongoose");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

// 1. GET QUIZZES FOR STUDENT (With Attempt Status & Score)
exports.getQuizzesForStudent = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid Course ID format" });
    }

    // A. Fetch Quizzes created by Faculty for this Course
    const quizzes = await Quiz.find({ courseId: courseId })
      .select("-questions.options.isCorrect") // Answers hide karo
      .sort({ createdAt: -1 });

    // B. Check Student's Past Attempts
    const attempts = await StudentQuizResult.find({
      student: studentId,
      course: courseId,
    }).sort({ attemptedAt: -1 });

    // C. Merge Data
    const quizzesWithStatus = quizzes.map((q) => {
      const quizAttempts = attempts.filter(
        (a) => a.quiz.toString() === q._id.toString()
      );
      const attemptsCount = quizAttempts.length;

      // Best Attempt logic
      const bestAttempt = quizAttempts.reduce((best, current) => {
        return best === null || current.score > best.score ? current : best;
      }, null);

      return {
        _id: q._id,
        title: q.title,
        description: q.description,
        courseId: q.courseId,
        isFinalExam: q.isFinalExam || false, // ✅ Added isFinalExam Flag
        questions: q.questions,
        attemptsCount: attemptsCount,
        attempted: attemptsCount > 0,
        canAttempt: attemptsCount < 2,
        score: bestAttempt ? bestAttempt.score : null,
        totalMarks: bestAttempt ? bestAttempt.totalMarks : q.questions.length,
      };
    });

    res.json(quizzesWithStatus);
  } catch (err) {
    console.error("❌ Error fetching quizzes:", err);
    res.status(500).json({ message: err.message });
  }
};

// 2. SUBMIT QUIZ & CALCULATE SCORE (✅ FIXED VALIDATION ERRORS)
exports.submitQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const studentId = req.user.id;

    // --- 1. Parsing Logic ---
    let rawUserResponses = [];
    if (req.body.responses) {
      rawUserResponses = req.body.responses;
    } else if (req.body.answers) {
      try {
        rawUserResponses = JSON.parse(req.body.answers);
      } catch (error) {
        return res
          .status(400)
          .json({ message: "Invalid answers format inside FormData" });
      }
    }

    // --- 2. File Upload Logic ---
    let uploadedFileUrl = null;
    if (req.file) {
      if (req.file.buffer) {
        uploadedFileUrl = await uploadToCloudinary(req.file.buffer);
      } else {
        uploadedFileUrl = req.file.path;
      }
    }

    // --- 3. Fetch Quiz ---
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    // --- 4. Calculate Score ---
    let score = 0;
    let correctAnswersCount = 0;
    const formattedAnswers = []; // This will become 'detailedResults'

    rawUserResponses.forEach((resp) => {
      const question = quiz.questions.id(resp.questionId);
      if (question) {
        let isAnswerCorrect = false;

        // A. Radio Logic
        if (question.type === "radio") {
          const selectedOptId = resp.selectedOptions[0];
          const correctOpt = question.options.find((o) => o.isCorrect);

          if (
            correctOpt &&
            selectedOptId &&
            correctOpt._id.toString() === selectedOptId
          ) {
            isAnswerCorrect = true;
          }
        }
        // B. Checkbox Logic
        else if (question.type === "checkbox") {
          const correctOptionIds = question.options
            .filter((o) => o.isCorrect)
            .map((o) => o._id.toString());
          const selectedIds = resp.selectedOptions;
          const isExactMatch =
            selectedIds.length === correctOptionIds.length &&
            selectedIds.every((id) => correctOptionIds.includes(id));

          if (isExactMatch) isAnswerCorrect = true;
        }

        // Update Counters
        if (isAnswerCorrect) {
          score += 1;
          correctAnswersCount += 1;
        }

        // Push to formatted array
        formattedAnswers.push({
          questionId: resp.questionId,
          selectedOptionIds: resp.selectedOptions,
          isCorrect: isAnswerCorrect,
        });
      }
    });

    const totalQuestions = quiz.questions.length;
    const wrongAnswersCount = totalQuestions - correctAnswersCount;

    // --- 5. Save Result ---
    const newResult = new StudentQuizResult({
      student: studentId,
      quiz: quizId,
      course: quiz.courseId,
      score: score,
      totalMarks: totalQuestions,
      totalQuestions: totalQuestions,
      correctAnswers: correctAnswersCount,
      wrongAnswers: wrongAnswersCount,
      answers: formattedAnswers,
      submittedFile: uploadedFileUrl,
    });

    await newResult.save();

    // --- ✅ THE FIX IS HERE ---
    // We explicitly send 'formattedAnswers' as 'detailedResults'
    res.json({
      message: "Submitted successfully",
      score: score,
      totalQuestions: totalQuestions,
      correctAnswers: correctAnswersCount,
      wrongAnswers: wrongAnswersCount,

      // 🔥 This is what the frontend was missing!
      detailedResults: formattedAnswers,

      fileUrl: uploadedFileUrl,
    });
  } catch (err) {
    console.error("❌ Error submitting quiz:", err);
    res.status(500).json({ message: err.message, error: err });
  }
};

// 3. GET ATTEMPT STATUS
exports.getQuizAttemptStatus = async (req, res) => {
  try {
    const { id: quizId } = req.params;
    const studentId = req.user.id;

    const attempts = await StudentQuizResult.find({
      quiz: quizId,
      student: studentId,
    })
      .sort({ score: -1 })
      .limit(2);

    const attemptsCount = attempts.length;
    const maxAttempts = 2;
    const canAttempt = attemptsCount < maxAttempts;

    let bestScore = 0;
    let totalMarks = 0;

    if (attemptsCount > 0) {
      const quiz = await Quiz.findById(quizId).select("questions");
      if (quiz) {
        totalMarks = quiz.questions.length;
      }
      bestScore = attempts[0].score;
    }

    res.json({
      canAttempt,
      attemptsCount,
      bestScore,
      totalMarks,
    });
  } catch (error) {
    console.error("Error fetching quiz attempt status:", error);
    res.status(500).json({ message: "Server error while checking status." });
  }
};

// 4. GET ATTEMPT HISTORY
exports.getAttemptHistory = async (req, res) => {
  try {
    const { quizId } = req.params;
    const studentId = req.user._id;

    const history = await StudentQuizResult.find({
      quiz: quizId,
      student: studentId,
    }).sort({ attemptedAt: -1 });

    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 5. GET SINGLE QUIZ (For Attempt)
exports.getQuizForAttempt = async (req, res) => {
  try {
    const { quizId } = req.params;
    const quiz = await Quiz.findById(quizId).select(
      "-questions.options.isCorrect"
    );

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.json(quiz);
  } catch (err) {
    console.error("Fetch Single Quiz Error:", err);
    res.status(500).json({ message: err.message });
  }
};
