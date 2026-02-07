const Enrollment = require("../models/Enrollment");

// ==========================================
// 1. CREATE ENROLLMENT (Single Email Trigger)
// ==========================================
exports.createEnrollment = async (req, res, next) => {
  try {
    // 1. Get User ID from Token (Secure)
    // req.user is set by auth middleware
    if (!req.user || !req.user._id) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not identified." });
    }
    const studentId = req.user._id;

    const { courseId, phone, message } = req.body;

    // 2. Validation
    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    // 3. Duplicate Check
    const existingEnrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });
    if (existingEnrollment) {
      // 409 Conflict status code is more appropriate
      return res
        .status(409)
        .json({ message: "You are already enrolled in this course." });
    }

    // 4. Create Enrollment
    let enrollment = await Enrollment.create({
      student: studentId,
      course: courseId,
      phone: phone,
      message: message,
      status: "active",
      enrolledAt: Date.now(),
    });

    // 5. Populate Data for Email
    enrollment = await enrollment.populate([
      { path: "student", select: "name email" },
      { path: "course", select: "name subject title" },
    ]);

    // 6. Set Locals for Email Middleware
    res.locals.student = enrollment.student;
    res.locals.course = enrollment.course;

    res.status(201).json({
      message: "Enrollment Successful",
      data: enrollment,
    });
  } catch (error) {
    // Duplicate Key Error (Safety Net)
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ message: "You are already enrolled in this course." });
    }
    console.error("Enrollment Controller Error:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// ==========================================
// 2. GET MY ENROLLMENTS
// ==========================================
exports.getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate("course")
      .sort({ enrolledAt: -1 });

    const validEnrollments = enrollments.filter(
      (enroll) => enroll.course !== null
    );
    res.json(validEnrollments);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ==========================================
// 3. GET ALL ENROLLMENTS (Admin)
// ==========================================
exports.getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate("student", "name email")
      .populate("course", "subject")
      .sort({ enrolledAt: -1 });

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
exports.deleteEnrollment = async (req, res) => {
  try {
    const { id } = req.params;
    await Enrollment.findByIdAndDelete(id);
    res.json({ message: "Enrollment deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ DELETE ALL ENROLLMENTS
exports.deleteAllEnrollments = async (req, res) => {
  try {
    await Enrollment.deleteMany({}); // Empty object means delete everything
    res.json({ message: "All enrollments deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
