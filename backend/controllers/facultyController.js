// FACULTY FEATURE - Controller
const Faculty = require('../models/Faculty');
const Class = require('../models/Class');
const User = require('../models/Faculty');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'facultysecret123';
const FacultyCourse = require('../models/FacultyCourse');
const Course = require('../models/Course');   // <-- YEHI LINE ADD KARO
// Faculty Register
const getFacultyId = (req) => {
    return (req.user && req.user.id) || 
           (req.user && req.user._id) || 
           (req.faculty && req.faculty.id) || 
           (req.faculty && req.faculty._id);
};

exports.registerFaculty = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exists = await Faculty.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Faculty already exists' });

    const faculty = await Faculty.create({ name, email, password });
    res.status(201).json({ message: 'Faculty registered successfully' });
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
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: faculty._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, faculty: { id: faculty._id, name: faculty.name, email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All Classes of Logged In Faculty
exports.getMyClasses = async (req, res) => {
  try {
    const classes = await Class.find({ faculty: req.faculty.id }).sort({ date: -1 });
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// New: Get All Faculties (For Admin Dropdown)
exports.getFaculty = async (req, res) => {
  try {
    const faculties = await Faculty.find().select("-password");
    res.json(faculties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Courses Assigned to Logged In Faculty
exports.getMyAssignedCourses = async (req, res) => {
    try {
        // Find all unique courses assigned to this faculty
        const assignedCourses = await FacultyCourse.find({ facultyId: req.faculty.id }).select('courseId courseSubject');
        
        // Find all classes added by this faculty
        const facultyClasses = await Class.find({ faculty: req.faculty.id }).sort({ date: 1 });
        
        // Group classes by subject for easy access in frontend
        const classesByCourse = assignedCourses.map(ac => {
            const relatedClasses = facultyClasses.filter(fc => fc.subjectName === ac.courseSubject);
            return {
                courseId: ac.courseId,
                subject: ac.courseSubject,
                classes: relatedClasses
            };
        });

        res.json(classesByCourse);
    } catch (err) {
        console.error("GET ASSIGNED COURSES ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};
// Add New Class (Updated to use FacultyCourse subjectName)
exports.addClass = async (req, res) => {
  const { subjectName, classLink, date } = req.body; // subjectName is courseSubject
  try {
    const newClass = await Class.create({
      subjectName,
      classLink,
      date,
      faculty: req.faculty.id
    });
    res.status(201).json(newClass);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateClass = async (req, res) => {
    // 1. सुरक्षा जाँच (Security Check)
    if (!req.faculty || !req.faculty.id) {
        return res.status(401).json({ message: 'Unauthorized: Faculty ID missing' });
    }
    
    try {
        const classId = req.params.id;
        const facultyId = req.faculty.id;
        const updated = await Class.findOneAndUpdate(
            { _id: classId, faculty: facultyId }, 
            req.body, 
            { new: true, runValidators: true } 
        );

        if (!updated) {
            return res.status(404).json({ message: 'Class not found or unauthorized to update' });
        }
        
        res.json(updated);
        
    } catch (err) {
        console.error("UPDATE CLASS ERROR:", err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation Error: ' + err.message });
        }
        res.status(500).json({ message: 'Server Error: ' + err.message });
    }
};
exports.getFacultyWithCourses = async (req, res) => {
    try {
        // 1. सभी फैकल्टी को फ़ेच करें
        const allFaculties = await Faculty.find().select('_id name email');

        // 2. सभी Faculty-Course असाइनमेंट फ़ेच करें
        const allAssignments = await FacultyCourse.find({});

        // 3. असाइनमेंट को फैकल्टी ID के आधार पर ग्रुप करें
        const facultyData = allFaculties.map(faculty => {
            const assignments = allAssignments
                .filter(assignment => 
                    assignment.facultyId.toString() === faculty._id.toString()
                )
                .map(assignment => ({
                    courseId: assignment.courseId,
                    subject: assignment.courseSubject,
                }));

            return {
                id: faculty._id,
                name: faculty.name,
                email: faculty.email,
                assignedCourses: assignments.length > 0 ? assignments : []
            };
        });

        res.json(facultyData);
        
    } catch (err) {
        console.error("ADMIN GET FACULTY WITH COURSES ERROR:", err);
        res.status(500).json({ message: 'Failed to fetch faculty assignments', error: err.message });
    }
};


exports.getCurrentFaculty = async (req, res) => {
    try {
        const id = getFacultyId(req);

        // Debug log to see what's happening
        console.log("getCurrentFaculty - Request User/Faculty object:", req.user || req.faculty);
        console.log("getCurrentFaculty - Extracted ID:", id);
          
        if (!id) {
            return res.status(401).json({ message: 'Unauthorized: No user ID found in request' });
        }

        const faculty = await Faculty.findById(id).select('-password'); 
        
        if (!faculty) {
            return res.status(404).json({ message: 'Faculty not found' });
        }

        res.json({
            id: faculty._id,
            name: faculty.name,
            email: faculty.email,
            // Add other fields if needed
        });
    } catch (err) {
        console.error("getCurrentFaculty Error:", err.message);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};
// Delete Class
exports.deleteClass = async (req, res) => {
  try {
    const deleted = await Class.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Class not found' });
    res.json({ message: 'Class deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// ==================== ADD LECTURE LINK (IMPROVED) ====================
exports.addLectureLink = async (req, res) => {
  try {
    const { courseId, moduleId, lectureId } = req.params;
    const { title } = req.body; // Assuming link title is sent

    // Database Logic to save link goes here...

    // 🔥 BRIDGE TO MIDDLEWARE (Bulk Mode)
    const course = await Course.findById(courseId).select('name subject title');
    const enrollments = await Enrollment.find({ course: courseId }).populate('student', 'name email');

    const recipients = enrollments
        .map(enroll => enroll.student)
        .filter(student => student && student.email);

    res.locals.recipients = recipients;
    res.locals.course = course;
    res.locals.updateType = `New Material: ${title || "Lecture Link"}`;

    res.status(200).json({ message: "Link added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// DELETE LECTURE LINK
exports.deleteLectureLink = async (req, res) => {
    const { courseId, moduleId, lectureId, linkId } = req.params;
    const facultyId = getFacultyId(req);

    try {
        const assignment = await FacultyCourse.findOne({ facultyId, courseId });
        if (!assignment) return res.status(403).json({ message: 'Unauthorized' });

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        const module = course.modules.id(moduleId);
        if (!module) return res.status(404).json({ message: 'Module not found' });

        const lecture = module.lectures.id(lectureId);
        if (!lecture) return res.status(404).json({ message: 'Lecture not found' });

        const before = lecture.lectureLinks.length;
        lecture.lectureLinks.pull({ _id: linkId });

        if (lecture.lectureLinks.length === before) {
            return res.status(404).json({ message: 'Link not found' });
        }

        await course.save();

        res.json({ success: true, message: 'Link deleted', lectureLinks: lecture.lectureLinks });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// MOST IMPORTANT: Yeh function poora course data (modules + lectures + links) bhejega
// getMyAssignedCourses - FULL COURSE DATA WITH _id
exports.getMyAssignedCourses = async (req, res) => {
    try {
        const facultyId = getFacultyId(req);

        const assignments = await FacultyCourse.find({ facultyId }).select('courseId courseSubject');
        const courseIds = assignments.map(a => a.courseId);

        const fullCourses = await Course.find({ _id: { $in: courseIds } })
            .select('subject modules') // modules mein _id automatically aayega
            .populate('modules.lectures', '_id title lectureLinks') // Lecture mein _id + title + links
            .lean();

        const classes = await Class.find({ faculty: facultyId }).sort({ date: 1 }).lean();

        const result = assignments.map(assignment => {
            const courseDetail = fullCourses.find(c => c._id.toString() === assignment.courseId.toString()) || { modules: [] };

            const relatedClasses = classes.filter(c => c.subjectName === assignment.courseSubject);

            return {
                courseId: assignment.courseId.toString(), // String banao
                subject: assignment.courseSubject,
                modules: courseDetail.modules.map(m => ({
                    _id: m._id.toString(), // _id string banao
                    title: m.title,
                    lectures: m.lectures.map(l => ({
                        _id: l._id.toString(), // Lecture _id string
                        title: l.title,
                        lectureLinks: l.lectureLinks || []
                    }))
                })),
                classes: relatedClasses
            };
        });

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error loading courses' });
    }
};

exports.registerFaculty = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exists = await Faculty.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Faculty already exists' });

    const faculty = await Faculty.create({ name, email, password });
    res.status(201).json({ message: 'Faculty registered successfully' });
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
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: faculty._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, faculty: { id: faculty._id, name: faculty.name, email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All Classes of Logged In Faculty
exports.getMyClasses = async (req, res) => {
  try {
    const classes = await Class.find({ faculty: req.faculty.id }).sort({ date: -1 });
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// New: Get All Faculties (For Admin Dropdown)
exports.getFaculty = async (req, res) => {
  try {
    const faculties = await Faculty.find().select("-password");
    res.json(faculties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getLectureLinks = async (req, res) => {
    const { courseId, moduleId, lectureId } = req.params;
    const facultyId = getFacultyId(req);

    try {
        // 1. Check Faculty Assignment (Kya ye faculty is course ko padha raha hai?)
        const assignment = await FacultyCourse.findOne({ facultyId, courseId });
        if (!assignment) {
            return res.status(403).json({ message: 'Unauthorized: You are not assigned to this course' });
        }

        // 2. Find Course
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        // 3. Find Module
        const module = course.modules.id(moduleId);
        if (!module) return res.status(404).json({ message: 'Module not found' });

        // 4. Find Lecture
        const lecture = module.lectures.id(lectureId);
        if (!lecture) return res.status(404).json({ message: 'Lecture not found' });

        // 5. Return Links
        // Yahan hum sirf links return kar rahe hain jo us lecture me hain
        res.json({
            success: true,
            lectureTitle: lecture.title,
            links: lecture.lectureLinks || [] // Agar links nahi hain to empty array bhejega
        });

    } catch (err) {
        console.error("GET LECTURE LINKS ERROR:", err);
        res.status(500).json({ message: 'Server error fetching links' });
    }
};


// Add New Class (Updated to use FacultyCourse subjectName)
exports.addClass = async (req, res) => {
  const { subjectName, classLink, date } = req.body; // subjectName is courseSubject
  try {
    const newClass = await Class.create({
      subjectName,
      classLink,
      date,
      faculty: req.faculty.id
    });
    res.status(201).json(newClass);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.updateClass = async (req, res) => {
    // 1. सुरक्षा जाँच (Security Check)
    if (!req.faculty || !req.faculty.id) {
        return res.status(401).json({ message: 'Unauthorized: Faculty ID missing' });
    }
    
    try {
        const classId = req.params.id;
        const facultyId = req.faculty.id;
        const updated = await Class.findOneAndUpdate(
            { _id: classId, faculty: facultyId }, 
            req.body, 
            { new: true, runValidators: true } 
        );

        if (!updated) {
            return res.status(404).json({ message: 'Class not found or unauthorized to update' });
        }
        
        res.json(updated);
        
    } catch (err) {
        console.error("UPDATE CLASS ERROR:", err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation Error: ' + err.message });
        }
        res.status(500).json({ message: 'Server Error: ' + err.message });
    }
};
exports.getFacultyWithCourses = async (req, res) => {
    try {
        // 1. सभी फैकल्टी को फ़ेच करें
        const allFaculties = await Faculty.find().select('_id name email');

        // 2. सभी Faculty-Course असाइनमेंट फ़ेच करें
        const allAssignments = await FacultyCourse.find({});

        // 3. असाइनमेंट को फैकल्टी ID के आधार पर ग्रुप करें
        const facultyData = allFaculties.map(faculty => {
            const assignments = allAssignments
                .filter(assignment => 
                    assignment.facultyId.toString() === faculty._id.toString()
                )
                .map(assignment => ({
                    courseId: assignment.courseId,
                    subject: assignment.courseSubject,
                }));

            return {
                id: faculty._id,
                name: faculty.name,
                email: faculty.email,
                assignedCourses: assignments.length > 0 ? assignments : []
            };
        });

        res.json(facultyData);
        
    } catch (err) {
        console.error("ADMIN GET FACULTY WITH COURSES ERROR:", err);
        res.status(500).json({ message: 'Failed to fetch faculty assignments', error: err.message });
    }
};


exports.getCurrentFaculty = async (req, res) => {
    try {
        const id = getFacultyId(req);

        // Debug log to see what's happening
        console.log("getCurrentFaculty - Request User/Faculty object:", req.user || req.faculty);
        console.log("getCurrentFaculty - Extracted ID:", id);
          
        if (!id) {
            return res.status(401).json({ message: 'Unauthorized: No user ID found in request' });
        }

        const faculty = await Faculty.findById(id).select('-password'); 
        
        if (!faculty) {
            return res.status(404).json({ message: 'Faculty not found' });
        }

        res.json({
            id: faculty._id,
            name: faculty.name,
            email: faculty.email,
            // Add other fields if needed
        });
    } catch (err) {
        console.error("getCurrentFaculty Error:", err.message);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};
// Delete Class
exports.deleteClass = async (req, res) => {
  try {
    const deleted = await Class.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Class not found' });
    res.json({ message: 'Class deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// ==================== ADD LECTURE LINK (IMPROVED) ====================
exports.addLectureLink = async (req, res) => {
    const { courseId, moduleId, lectureId } = req.params;
    const { url, type } = req.body;
    const facultyId = getFacultyId(req);

    if (!url || !url.startsWith('http')) {
        return res.status(400).json({ message: 'Valid URL required' });
    }

    try {
        const assignment = await FacultyCourse.findOne({ facultyId, courseId });
        if (!assignment) return res.status(403).json({ message: 'Not assigned to this course' });

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        const module = course.modules.id(moduleId);
        if (!module) return res.status(404).json({ message: 'Module not found' });

        const lecture = module.lectures.id(lectureId);
        if (!lecture) return res.status(404).json({ message: 'Lecture not found' });

        lecture.lectureLinks.push({
            url: url.trim(),
            type: type || 'Live'
        });

        await course.save();

        res.json({
            success: true,
            message: 'Link added!',
            lectureLinks: lecture.lectureLinks
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// DELETE LECTURE LINK
exports.deleteLectureLink = async (req, res) => {
    const { courseId, moduleId, lectureId, linkId } = req.params;
    const facultyId = getFacultyId(req);

    try {
        const assignment = await FacultyCourse.findOne({ facultyId, courseId });
        if (!assignment) return res.status(403).json({ message: 'Unauthorized' });

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        const module = course.modules.id(moduleId);
        if (!module) return res.status(404).json({ message: 'Module not found' });

        const lecture = module.lectures.id(lectureId);
        if (!lecture) return res.status(404).json({ message: 'Lecture not found' });

        const before = lecture.lectureLinks.length;
        lecture.lectureLinks.pull({ _id: linkId });

        if (lecture.lectureLinks.length === before) {
            return res.status(404).json({ message: 'Link not found' });
        }

        await course.save();

        res.json({ success: true, message: 'Link deleted', lectureLinks: lecture.lectureLinks });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// MOST IMPORTANT: Yeh function poora course data (modules + lectures + links) bhejega
// getMyAssignedCourses - FULL COURSE DATA WITH _id
exports.getMyAssignedCourses = async (req, res) => {
    try {
        const facultyId = getFacultyId(req);

        const assignments = await FacultyCourse.find({ facultyId }).select('courseId courseSubject');
        const courseIds = assignments.map(a => a.courseId);

        const fullCourses = await Course.find({ _id: { $in: courseIds } })
            .select('subject modules') // modules mein _id automatically aayega
            .populate('modules.lectures', '_id title lectureLinks') // Lecture mein _id + title + links
            .lean();

        const classes = await Class.find({ faculty: facultyId }).sort({ date: 1 }).lean();

        const result = assignments.map(assignment => {
            const courseDetail = fullCourses.find(c => c._id.toString() === assignment.courseId.toString()) || { modules: [] };

            const relatedClasses = classes.filter(c => c.subjectName === assignment.courseSubject);

            return {
                courseId: assignment.courseId.toString(), // String banao
                subject: assignment.courseSubject,
                modules: courseDetail.modules.map(m => ({
                    _id: m._id.toString(), // _id string banao
                    title: m.title,
                    lectures: m.lectures.map(l => ({
                        _id: l._id.toString(), // Lecture _id string
                        title: l.title,
                        lectureLinks: l.lectureLinks || []
                    }))
                })),
                classes: relatedClasses
            };
        });

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error loading courses' });
    }
};

exports.deleteFaculty = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Check valid ID
        if (!id) return res.status(400).json({ message: "Invalid ID" });

        // 2. Delete User (Faculty)
        const deletedFaculty = await User.findByIdAndDelete(id);

        if (!deletedFaculty) {
            return res.status(404).json({ message: "Faculty not found in database" });
        }

        // (Optional) Remove this Faculty from all Courses mentors array
        // await Course.updateMany(
        //    { "mentors.facultyId": id },
        //    { $pull: { mentors: { facultyId: id } } }
        // );

        res.json({ message: "Faculty deleted successfully" });

    } catch (err) {
        console.error("Delete Faculty Error:", err);
        res.status(500).json({ message: err.message });
    }
};