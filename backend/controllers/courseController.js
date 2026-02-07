const Course = require("../models/Course");
const FacultyCourse = require("../models/FacultyCourse");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

// ✅ Imports for Email
const { sendEmail } = require("../services/emailServices");
const { userTemplates } = require("../utils/emailTemplates");

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getFileBuffer = (file) => file.buffer;

// --- FIXED MENTOR LOGIC ---
const handleMentorsLogic = async (req, existingMentors = []) => {
  const mentors = [];
  const mentorsCount = parseInt(req.body.mentorsCount) || 0;
  const facultyCourses = [];

  // Safety: Ensure we have a file array even if undefined
  const files = req.files || [];

  // Logic to track removals
  const facultyCoursesToRemove = existingMentors
    .map((m) => m.facultyId)
    .filter((id) => id);

  for (let i = 0; i < mentorsCount; i++) {
    // Safe access keys
    const nameRaw = req.body[`mentorName_${i}`];
    const designationRaw = req.body[`mentorDesignation_${i}`];
    const facultyIdRaw = req.body[`mentorFacultyId_${i}`];

    // CRASH FIX: If name is missing (undefined), skip this index safely
    if (!nameRaw) continue;

    const name = nameRaw.trim();
    const designation = designationRaw ? designationRaw.trim() : "Mentor";
    const facultyId = facultyIdRaw;

    let photo = req.body[`mentorPhotoUrl_${i}`] || "";

    if (name && facultyId) {
      // Find photo in files safely
      const photoFile = files.find((f) => f.fieldname === `mentorPhoto_${i}`);

      if (photoFile) {
        try {
          photo = await uploadToCloudinary(getFileBuffer(photoFile));
        } catch (error) {
          console.error(`Error uploading photo for mentor ${i}:`, error);
        }
      }

      // If faculty is kept, remove from deletion list
      const removeIndex = facultyCoursesToRemove.findIndex(
        (id) => id && id.toString() === facultyId.toString()
      );
      if (removeIndex > -1) {
        facultyCoursesToRemove.splice(removeIndex, 1);
      }

      mentors.push({ name, designation, photo, facultyId });
      facultyCourses.push({ facultyId, courseSubject: req.body.subject });
    }
  }
  return { mentors, facultyCourses, facultyCoursesToRemove };
};

exports.createCourse = async (req, res) => {
  try {
    let thumbnail = "";
    let brochure = "";

    const files = req.files || [];

    // Upload thumbnail
    const thumbnailFile = files.find((f) => f.fieldname === "thumbnail");
    if (thumbnailFile) {
      thumbnail = await uploadToCloudinary(getFileBuffer(thumbnailFile));
    }

    // Upload brochure
    const brochureFile = files.find((f) => f.fieldname === "brochure");
    if (brochureFile) {
      brochure = await uploadToCloudinary(getFileBuffer(brochureFile));
    }

    // NEW: Upload Roadmap Image
    let roadmapImage = "";
    const roadmapFile = files.find((f) => f.fieldname === "roadmapImage");
    if (roadmapFile) {
      roadmapImage = await uploadToCloudinary(getFileBuffer(roadmapFile));
    }

    // NEW: Upload Skills Images
    const skillsImages = [];
    const skillsFiles = files.filter((f) => f.fieldname === "skillsImages");
    for (const file of skillsFiles) {
      try {
        const url = await uploadToCloudinary(getFileBuffer(file));
        skillsImages.push(url);
      } catch (error) {
        console.error("Error uploading skill image:", error);
      }
    }

    // Handle mentors with fixed logic
    const { mentors, facultyCourses } = await handleMentorsLogic(req);

    // Parse modules & reviews safely
    let modules = [];
    let reviews = [];
    try {
      if (req.body.modules) modules = JSON.parse(req.body.modules);
      if (req.body.reviews) reviews = JSON.parse(req.body.reviews);
    } catch (e) {
      console.log("JSON parse error:", e.message);
    }

    const course = new Course({
      subject: req.body.subject,
      description: req.body.description,
      duration: req.body.duration,
      level: req.body.level || "Beginner",
      demoVideo: req.body.demoVideo || "",
      thumbnail,
      brochure,
      roadmapImage, // NEW
      skillsImages, // NEW
      modules,
      reviews,
      mentors,
    });

    // 1. Save Course First
    const savedCourse = await course.save();

    // 2. Handle Faculty Assignments
    const courseAssignments = facultyCourses.map((fc) => ({
      ...fc,
      courseId: savedCourse._id,
    }));
    if (courseAssignments.length > 0) {
      await FacultyCourse.insertMany(courseAssignments);
    }

    // ---------------------------------------------------------
    // ✅ NEW EMAIL LOGIC (Send Alert to Admin/Creator)
    // ---------------------------------------------------------
    try {
      // Agar user logged in hai (req.user exist karta hai)
      if (req.user && req.user.email) {
        // Course ka naam ab 'savedCourse' se milega jo 100% correct hoga
        const courseName =
          savedCourse.subject || savedCourse.title || "New Course";

        const emailContent = userTemplates.notification(
          { name: req.user.name },
          {
            type: "Course Created Successfully",
            courseName: courseName, // ✅ Fixed: Course Name ab dikhega
          }
        );

        await sendEmail(req.user.email, "Course Created - TDSA", emailContent);
        console.log(`Email sent to admin: ${req.user.email}`);
      }
    } catch (emailErr) {
      console.error("Email sending failed:", emailErr.message);
      // Email fail hone par bhi course create ho chuka hai, so we don't throw error
    }
    // ---------------------------------------------------------

    res.status(201).json(savedCourse);
  } catch (err) {
    console.error("CREATE ERROR:", err);
    res
      .status(500)
      .json({ message: "Failed to create course", error: err.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const courseToUpdate = await Course.findById(courseId);
    if (!courseToUpdate)
      return res.status(404).json({ message: "Course not found" });

    const updates = { ...req.body };
    const files = req.files || [];

    // Handle thumbnail
    const thumbnailFile = files.find((f) => f.fieldname === "thumbnail");
    if (thumbnailFile) {
      updates.thumbnail = await uploadToCloudinary(
        getFileBuffer(thumbnailFile)
      );
    }

    // Handle brochure
    const brochureFile = files.find((f) => f.fieldname === "brochure");
    if (brochureFile) {
      updates.brochure = await uploadToCloudinary(getFileBuffer(brochureFile));
    }

    // NEW: Handle Roadmap Image
    const roadmapFile = files.find((f) => f.fieldname === "roadmapImage");
    if (roadmapFile) {
      updates.roadmapImage = await uploadToCloudinary(
        getFileBuffer(roadmapFile)
      );
    }

    // NEW: Handle Skills Images
    // 1. Get existing images from body (if sent as JSON or filtered out from simple update)
    // IMPORTANT: If we want to append, we need existing. If replace, we assume body has current list.
    // For simplicity: We will APPEND new uploaded files to the list provided in body.skillsImages (if any)
    // OR if existing skillsImages are not sent, we might lose them if we blindly set.
    // Safest: updates.skillsImages = [ ...existingFromReqBody, ...newlyUploaded ]

    let currentSkills = [];
    if (updates.skillsImages) {
      // If sent as string/JSON
      if (typeof updates.skillsImages === "string") {
        try {
          currentSkills = JSON.parse(updates.skillsImages);
        } catch (e) {
          currentSkills = [updates.skillsImages];
        }
      } else if (Array.isArray(updates.skillsImages)) {
        currentSkills = updates.skillsImages;
      }
    } else {
      // If not sent, maybe keep existing?
      // Usually updates object overrwrites. Let's assume frontend sends the "final list of URLs" to keep.
      // If frontend didn't send 'skillsImages' field at all, we shouldn't overwrite it unless we want to clear.
      // But updates = { ...req.body }.
    }

    const newSkillsImages = [];
    const skillsFiles = files.filter((f) => f.fieldname === "skillsImages");
    for (const file of skillsFiles) {
      try {
        const url = await uploadToCloudinary(getFileBuffer(file));
        newSkillsImages.push(url);
      } catch (error) {
        console.error("Error uploading skill image during update:", error);
      }
    }

    if (newSkillsImages.length > 0) {
      // Parse existing if it's there, else default to empty or what's in updates
      // If 'skillsImages' is in req.body, it's there.
      // We append.
      if (!updates.skillsImages)
        updates.skillsImages = courseToUpdate.skillsImages || [];
      else if (typeof updates.skillsImages === "string") {
        try {
          updates.skillsImages = JSON.parse(updates.skillsImages);
        } catch (e) {}
      }

      if (!Array.isArray(updates.skillsImages)) updates.skillsImages = [];

      updates.skillsImages = [...updates.skillsImages, ...newSkillsImages];
    }
    // If no new files and no skillsImages in body, we might not want to touch it?
    // But `updates` has `...req.body`. If req.body doesn't have it, it won't trigger update unless we explicitly set it.
    // So logic above is fine.

    // Handle mentors logic
    if (req.body.mentorsCount !== undefined) {
      const { mentors, facultyCourses } = await handleMentorsLogic(
        req,
        courseToUpdate.mentors
      );
      updates.mentors = mentors;

      // Reset and update assignments
      await FacultyCourse.deleteMany({ courseId: courseId });
      if (facultyCourses.length > 0) {
        const newAssignments = facultyCourses.map((fc) => ({
          ...fc,
          courseId,
        }));
        await FacultyCourse.insertMany(newAssignments);
      }
    }

    // Parse JSON fields
    if (updates.modules && typeof updates.modules === "string")
      updates.modules = JSON.parse(updates.modules);
    if (updates.reviews && typeof updates.reviews === "string")
      updates.reviews = JSON.parse(updates.reviews);

    const course = await Course.findByIdAndUpdate(courseId, updates, {
      new: true,
    });
    res.json(course);
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    await FacultyCourse.deleteMany({ courseId: req.params.id });
    res.json({ message: "Course deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
