// FACULTY FEATURE - Controller
const Faculty = require("../models/Faculty");
const Class = require("../models/Class");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "facultysecret123";
const FacultyCourse = require("../models/FacultyCourse");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment"); // ✅ Import Enrollment
const { sendEmail } = require("../services/emailServices");
const { userTemplates, subjects } = require("../utils/emailTemplates");

// Helper: Get Faculty ID from request
const getFacultyId = (req) => {
  return (
    (req.user && req.user.id) ||
    (req.user && req.user._id) || 
    (req.faculty && req.faculty.id) ||
    (req.faculty && req.faculty._id)
  );
};

// Faculty Register
exports.registerFaculty = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exists = await Faculty.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Faculty already exists" });

    const faculty = await Faculty.create({ name, email, password });
    res.status(201).json({ message: "Faculty registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Faculty Login
exports.loginFaculty = async (req, res) => {
  const { email, password } = req.body;
  try {
    const faculty = await Faculty.findOne({ email });
    if (!faculty || !(await faculty.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: faculty._id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({
      token,
      faculty: { id: faculty._id, name: faculty.name, email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All Classes of Logged In Faculty
exports.getMyClasses = async (req, res) => {
  try {
    const classes = await Class.find({ faculty: req.faculty.id }).sort({
      date: -1,
    });
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All Faculties (For Admin Dropdown)
exports.getFaculty = async (req, res) => {
  try {
    const faculties = await Faculty.find().select("-password");
    res.json(faculties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Courses Assigned to Logged In Faculty - FULL COURSE DATA
exports.getMyAssignedCourses = async (req, res) => {
  try {
    const facultyId = getFacultyId(req);

    const assignments = await FacultyCourse.find({ facultyId }).select(
      "courseId courseSubject",
    );
    const courseIds = assignments.map((a) => a.courseId);

    const fullCourses = await Course.find({ _id: { $in: courseIds } })
      .select("subject modules") // modules mein _id automatically aayega
      .populate("modules.lectures", "_id title lectureLinks") // Lecture mein _id + title + links
      .lean();

    const classes = await Class.find({ faculty: facultyId })
      .sort({ date: 1 })
      .lean();

    const result = assignments.map((assignment) => {
      const courseDetail = fullCourses.find(
        (c) => c._id.toString() === assignment.courseId.toString(),
      ) || { modules: [] };

      const relatedClasses = classes.filter(
        (c) => c.subjectName === assignment.courseSubject,
      );

      return {
        courseId: assignment.courseId.toString(),
        subject: assignment.courseSubject,
        modules: courseDetail.modules.map((m) => ({
          _id: m._id.toString(),
          title: m.title,
          lectures: m.lectures.map((l) => ({
            _id: l._id.toString(),
            title: l.title,
            lectureLinks: l.lectureLinks || [],
          })),
        })),
        classes: relatedClasses,
      };
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error loading courses" });
  }
};

// Add New Class
exports.addClass = async (req, res) => {
  const { subjectName, classLink, date } = req.body;
  try {
    const newClass = await Class.create({
      subjectName,
      classLink,
      date,
      faculty: req.faculty.id,
    });
    res.status(201).json(newClass);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Class
exports.updateClass = async (req, res) => {
  if (!req.faculty || !req.faculty.id) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Faculty ID missing" });
  }

  try {
    const classId = req.params.id;
    const facultyId = req.faculty.id;
    const updated = await Class.findOneAndUpdate(
      { _id: classId, faculty: facultyId },
      req.body,
      { new: true, runValidators: true },
    );

    if (!updated) {
      return res
        .status(404)
        .json({ message: "Class not found or unauthorized to update" });
    }

    res.json(updated);
  } catch (err) {
    console.error("UPDATE CLASS ERROR:", err);
    if (err.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation Error: " + err.message });
    }
    res.status(500).json({ message: "Server Error: " + err.message });
  }
};

// Admin: Get All Faculty Assignments
exports.getFacultyWithCourses = async (req, res) => {
  try {
    const allFaculties = await Faculty.find().select("_id name email");
    const allAssignments = await FacultyCourse.find({});

    const facultyData = allFaculties.map((faculty) => {
      const assignments = allAssignments
        .filter(
          (assignment) =>
            assignment.facultyId.toString() === faculty._id.toString(),
        )
        .map((assignment) => ({
          courseId: assignment.courseId,
          subject: assignment.courseSubject,
        }));

      return {
        id: faculty._id,
        name: faculty.name,
        email: faculty.email,
        assignedCourses: assignments.length > 0 ? assignments : [],
      };
    });

    res.json(facultyData);
  } catch (err) {
    console.error("ADMIN GET FACULTY WITH COURSES ERROR:", err);
    res.status(500).json({
      message: "Failed to fetch faculty assignments",
      error: err.message,
    });
  }
};

// Get Current Logged In Faculty
exports.getCurrentFaculty = async (req, res) => {
  try {
    const id = getFacultyId(req);

    if (!id) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user ID found in request" });
    }

    const faculty = await Faculty.findById(id).select("-password");

    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    res.json({
      id: faculty._id,
      name: faculty.name,
      email: faculty.email,
    });
  } catch (err) {
    console.error("getCurrentFaculty Error:", err.message);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Delete Class
exports.deleteClass = async (req, res) => {
  try {
    const deleted = await Class.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Class not found" });
    res.json({ message: "Class deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Lecture Links (Specific)
exports.getLectureLinks = async (req, res) => {
  const { courseId, moduleId, lectureId } = req.params;
  const facultyId = getFacultyId(req);

  try {
    const assignment = await FacultyCourse.findOne({ facultyId, courseId });
    if (!assignment) {
      return res
        .status(403)
        .json({ message: "Unauthorized: You are not assigned to this course" });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const module = course.modules.id(moduleId);
    if (!module) return res.status(404).json({ message: "Module not found" });

    const lecture = module.lectures.id(lectureId);
    if (!lecture) return res.status(404).json({ message: "Lecture not found" });

    res.json({
      success: true,
      lectureTitle: lecture.title,
      links: lecture.lectureLinks || [],
    });
  } catch (err) {
    console.error("GET LECTURE LINKS ERROR:", err);
    res.status(500).json({ message: "Server error fetching links" });
  }
};

// Add Lecture Link
exports.addLectureLink = async (req, res) => {
  const { courseId, moduleId, lectureId } = req.params;
  const { url, type } = req.body;
  const facultyId = getFacultyId(req);

  if (!url || !url.startsWith("http")) {
    return res.status(400).json({ message: "Valid URL required" });
  }

  try {
    const assignment = await FacultyCourse.findOne({ facultyId, courseId });
    if (!assignment)
      return res.status(403).json({ message: "Not assigned to this course" });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const module = course.modules.id(moduleId);
    if (!module) return res.status(404).json({ message: "Module not found" });

    const lecture = module.lectures.id(lectureId);
    if (!lecture) return res.status(404).json({ message: "Lecture not found" });

    lecture.lectureLinks.push({
      url: url.trim(),
      type: type || "Live",
    });

    await course.save();

    // ✅ Set Locals for Email Middleware (Bulk Notification)
    try {
      const enrollments = await Enrollment.find({ course: courseId }).populate(
        "student",
        "name email",
      );
      const recipients = enrollments
        .map((e) => e.student)
        .filter((s) => s && s.email);
      res.locals.recipients = recipients;
      res.locals.course = course;
      res.locals.updateType = "Lecture Link Added";
    } catch (e) {
      console.error("Error setting up email recipients:", e);
    }

    res.json({
      success: true,
      message: "Link added!",
      lectureLinks: lecture.lectureLinks,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Lecture Link
exports.deleteLectureLink = async (req, res) => {
  const { courseId, moduleId, lectureId, linkId } = req.params;
  const facultyId = getFacultyId(req);

  try {
    const assignment = await FacultyCourse.findOne({ facultyId, courseId });
    if (!assignment) return res.status(403).json({ message: "Unauthorized" });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const module = course.modules.id(moduleId);
    if (!module) return res.status(404).json({ message: "Module not found" });

    const lecture = module.lectures.id(lectureId);
    if (!lecture) return res.status(404).json({ message: "Lecture not found" });

    const before = lecture.lectureLinks.length;
    lecture.lectureLinks.pull({ _id: linkId });

    if (lecture.lectureLinks.length === before) {
      return res.status(404).json({ message: "Link not found" });
    }

    await course.save();

    res.json({
      success: true,
      message: "Link deleted",
      lectureLinks: lecture.lectureLinks,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Faculty
exports.deleteFaculty = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: "Invalid ID" });

    const deletedFaculty = await Faculty.findByIdAndDelete(id);

    if (!deletedFaculty) {
      return res.status(404).json({ message: "Faculty not found in database" });
    }

    res.json({ message: "Faculty deleted successfully" });
  } catch (err) {
    console.error("Delete Faculty Error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const faculty = await Faculty.findOne({ email: email });

    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    // Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    faculty.resetPasswordOtp = otp;
    faculty.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

    await faculty.save();

    const htmlContent = userTemplates.forgot_password(faculty, { otp });
    const subject = subjects.forgot_password({ otp });

    await sendEmail(faculty.email, subject, htmlContent);

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const faculty = await Faculty.findOne({
      email: email,
      resetPasswordOtp: otp,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!faculty) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    res.status(200).json({ message: "OTP Verified" });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const faculty = await Faculty.findOne({
      email: email,
      resetPasswordOtp: otp,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!faculty) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    faculty.password = newPassword;
    faculty.resetPasswordOtp = undefined;
    faculty.resetPasswordExpires = undefined;

    await faculty.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
