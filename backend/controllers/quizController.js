const Quiz = require('../models/Quiz');
const StudentQuizResult = require('../models/StudentQuizResult');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// Helper to safely get Creator ID
const getCreatorId = (req) => {
    return (req.user && req.user.id) || 
           (req.user && req.user._id) || 
           (req.faculty && req.faculty.id) || 
           (req.faculty && req.faculty._id);
};

// 1. Get Faculty Quizzes
exports.getFacultyQuizzes = async (req, res) => {
    try {
        const creatorId = getCreatorId(req);
        if (!creatorId) return res.status(401).json({ message: "Unauthorized." });

        const quizzes = await Quiz.find({ createdBy: creatorId }).sort({ createdAt: -1 });
        res.json(quizzes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ==========================================
// 2. CREATE QUIZ (Updated for isFinalExam)
// ==========================================
exports.createQuiz = async (req, res) => {
    // ✅ Destructure isFinalExam
    const { title, description, instructions, courseId, questions, isFinalExam } = req.body;

    try {
        const creatorId = getCreatorId(req);
        if (!creatorId) return res.status(401).json({ message: "Unauthorized." });

        // Validation Logic
        for (const q of questions) {
            const correctCount = q.options.filter(opt => opt.isCorrect).length;
            
            if (q.type === 'radio' && correctCount !== 1) {
                return res.status(400).json({ message: `Single Choice Question "${q.questionText}" must have exactly ONE correct option.` });
            }
            if (q.type === 'checkbox' && correctCount < 1) {
                return res.status(400).json({ message: `Multiple Choice Question "${q.questionText}" must have AT LEAST ONE correct option.` });
            }
        }

        // Create Quiz Object
        const newQuiz = new Quiz({
            title, description, instructions, 
            courseId, 
            questions, 
            isFinalExam: isFinalExam || false, // ✅ Set Flag
            createdBy: creatorId
        });

        await newQuiz.save();

        // --- Email Logic (Kept same as provided) ---
        try {
            const course = await Course.findById(courseId).select('name subject title');
            if (course) {
                const enrollments = await Enrollment.find({ course: courseId }).populate('student', 'name email');
                const recipients = enrollments.map(enroll => enroll.student).filter(student => student && student.email);
                
                res.locals.recipients = recipients; 
                res.locals.course = course;        
                res.locals.updateType = `New ${isFinalExam ? "Final Exam" : "Quiz"} Alert: ${title}`; 
            }
        } catch (emailErr) {
            console.error("⚠️ Email setup failed inside Quiz Controller:", emailErr.message);
        }
        // ------------------------------------------

        res.status(201).json(newQuiz);

    } catch (err) {
        console.error("CreateQuiz Error:", err);
        res.status(500).json({ message: err.message });
    }
};

// 3. Update Quiz (Updated)
exports.updateQuiz = async (req, res) => {
    // ✅ Destructure isFinalExam
    const { title, description, instructions, courseId, questions, isFinalExam } = req.body;
    
    try {
        const creatorId = getCreatorId(req);
        if (!creatorId) return res.status(401).json({ message: "Unauthorized." });

        for (const q of questions) {
            const correctCount = q.options.filter(opt => opt.isCorrect).length;
            if (q.type === 'radio' && correctCount !== 1) return res.status(400).json({ message: `Radio Question "${q.questionText}" error: Must have exactly one correct option.` });
            if (q.type === 'checkbox' && correctCount < 1) return res.status(400).json({ message: `Checkbox Question "${q.questionText}" error: Must have at least one correct option.` });
        }

        const updatedQuiz = await Quiz.findOneAndUpdate(
            { _id: req.params.id, createdBy: creatorId }, 
            { title, description, instructions, courseId, questions, isFinalExam }, // ✅ Update Flag
            { new: true, runValidators: true }
        );
        
        if (!updatedQuiz) return res.status(404).json({ message: "Quiz not found or unauthorized." });
        res.json(updatedQuiz);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 4. Delete Quiz
exports.deleteQuiz = async (req, res) => {
    try {
        const creatorId = getCreatorId(req);
        const deletedQuiz = await Quiz.findOneAndDelete({ _id: req.params.id, createdBy: creatorId });
        if (!deletedQuiz) return res.status(404).json({ message: "Quiz not found." });
        res.json({ message: "Quiz deleted." });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get Quiz Results
exports.getQuizResults = async (req, res) => {
  try {
    const { resultId } = req.params;

    // 1. Fetch the result
    const result = await StudentQuizResult.findById(resultId)
      .populate('quiz')   // Populate quiz details if needed
      .populate('course'); // Populate course details if needed

    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

    // 2. Prepare the response structure exactly how Frontend expects it
    const responseData = {
      score: result.score,
      totalMarks: result.totalMarks,
      totalQuestions: result.totalQuestions,
      correctAnswers: result.correctAnswers,
      wrongAnswers: result.wrongAnswers,
      submittedFile: result.submittedFile,
      
      // 🔥 THE FIX: Map 'answers' from DB to 'detailedResults' for Frontend
      detailedResults: result.answers 
    };

    return res.status(200).json(responseData);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// =======================================================
// ✅ NEW: Student Submit Quiz (Handles File Upload)
// This is mainly for the Student Routes, but placed here for reference
// =======================================================
exports.submitStudentQuiz = async (req, res) => {
    try {
        const { quizId } = req.params;
        const studentId = req.user.id;
        
        // --- ✅ FIX: Handle JSON parsing from FormData ---
        let userResponses = [];
        
        // Case 1: Standard JSON Request (Normal Quiz)
        if (req.body.responses) {
            userResponses = req.body.responses;
        } 
        // Case 2: FormData Request (Final Exam with File)
        else if (req.body.answers) {
            try {
                // FormData sends objects as Strings, so we must parse it
                userResponses = JSON.parse(req.body.answers);
            } catch (error) {
                return res.status(400).json({ message: "Invalid answers format" });
            }
        } else {
            return res.status(400).json({ message: "No answers provided" });
        }

        // Handle File Upload
        let uploadedFileUrl = null;
        if (req.file) {
            uploadedFileUrl = req.file.path; // Cloudinary URL
        }

        const quiz = await Quiz.findById(quizId);
        if (!quiz) return res.status(404).json({ message: "Quiz not found" });

        // Calculate Score
        let score = 0;
        userResponses.forEach(resp => {
            const question = quiz.questions.id(resp.questionId);
            if (question) {
                if (question.type === 'radio') {
                    const selectedOptId = resp.selectedOptions[0];
                    const correctOpt = question.options.find(o => o.isCorrect);
                    if (correctOpt && correctOpt._id.toString() === selectedOptId) {
                        score += 1;
                    }
                }
                // Add Checkbox logic if needed
            }
        });

        // Save Result
        const newResult = new StudentQuizResult({
            student: studentId,
            quiz: quizId,
            score: score,
            totalQuestions: quiz.questions.length,
            answers: userResponses,
            submittedFile: uploadedFileUrl
        });

        await newResult.save();
        res.json({ message: "Submitted successfully", score, totalQuestions: quiz.questions.length });

    } catch (err) {
        console.error("Submit Error:", err);
        res.status(500).json({ message: err.message });
    }
};

exports.getQuizResultsForAdmin = async (req, res) => {
    try {
        const { quizId } = req.params;
        
        const results = await StudentQuizResult.find({ quiz: quizId })
            .populate('student', 'name email') // Student details
            .sort({ score: -1 }); // Highest score first

        res.json(results);
    } catch (err) {
        console.error("Admin Result Fetch Error:", err);
        res.status(500).json({ message: err.message });
    }
};

// 👇👇👇 YE FUNCTION ADD KAREIN (Ye Missing Tha) 👇👇👇

// ✅ ADMIN: Get Quizzes List by Course ID (For Dropdown)
exports.getQuizzesByCourseId = async (req, res) => {
    try {
        const { courseId } = req.params;
        // Sirf Title aur ID chahiye dropdown ke liye
        const quizzes = await Quiz.find({ courseId }).select('title _id');
        res.json(quizzes);
    } catch (err) {
        console.error("Error fetching quizzes for course:", err);
        res.status(500).json({ message: err.message });
    }
};
exports.submitQuiz = async (req, res) => {
    try {
        const { id } = req.params;
        const studentId = req.user._id; // Auth middleware se user ID

        // 1. Handle Input Data (FormData vs JSON)
        let responses = [];
        if (req.body.responses) {
            // Normal JSON request
            responses = req.body.responses;
        } else if (req.body.answers) {
            // FormData request (Final Exam with File)
            try {
                responses = JSON.parse(req.body.answers);
            } catch (e) {
                return res.status(400).json({ message: "Invalid answers format" });
            }
        }

        // 2. Fetch Quiz from DB
        const quiz = await Quiz.findById(id).populate('questions');
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        let score = 0;
        const totalQuestions = quiz.questions.length;
        const detailedResults = []; // ✅ YE ARRAY FRONTEND KO CHAHIYE

        // 3. Loop through Questions to Calculate Score & Details
        for (let question of quiz.questions) {
            // User ka answer dhundo
            const userResponse = responses.find(r => r.questionId === question._id.toString());
            
            // User ne jo options select kiye (IDs)
            const studentSelectedOptions = userResponse ? userResponse.selectedOptions : [];

            // Correct options (DB se)
            const correctOptions = question.options
                .filter(opt => opt.isCorrect === true)
                .map(opt => opt._id.toString());

            // 4. Check Correctness (Logic)
            // Array comparison: Check length match AND every item match
            const isCorrect = 
                studentSelectedOptions.length === correctOptions.length &&
                correctOptions.every(id => studentSelectedOptions.includes(id));

            if (isCorrect) {
                score++;
            }

            // 5. Build Detail Object for Frontend
            detailedResults.push({
                questionId: question._id,
                studentOptions: studentSelectedOptions, // User answers
                correctOptions: correctOptions,         // Correct answers
                isCorrect: isCorrect,
                explanation: question.explanation || "No explanation provided."
            });
        }

        // 6. Handle File Upload (If present)
        let fileUrl = null;
        if (req.file) {
            // Cloudinary or Local path logic here
            fileUrl = req.file.path; 
        }

        // 7. Save Result to Database (Optional but Recommended)
        const newResult = new StudentResult({
            student: studentId,
            quiz: id,
            score: score,
            totalQuestions: totalQuestions,
            answers: detailedResults, // Save breakdown in DB too
            fileUrl: fileUrl,
            passed: (score / totalQuestions) * 100 >= 50
        });

        await newResult.save();

        // 8. ✅ Send Response (Must match Frontend Requirement)
        res.status(200).json({
            message: "Submitted successfully",
            score: score,
            totalQuestions: totalQuestions,
            detailedResults: detailedResults, // <--- CRITICAL FOR FRONTEND UI
            fileUrl: fileUrl
        });

    } catch (error) {
        console.error("Submit Error:", error);
        res.status(500).json({ message: "Server Error while submitting quiz" });
    }
};