const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const Course = require('../models/Course');
const Class = require('../models/Class');
const {
    getAllCourses,
    createCourse,
    updateCourse,
    deleteCourse
} = require('../controllers/courseController');
// ❌ emailMiddleware hata diya kyunki ab controller handle karega
const quizController = require('../controllers/quizController');
// Course CRUD routes
router.get('/', getAllCourses);

// 👇 Yahan se middleware hata diya gaya hai
router.post('/', upload.any(), createCourse);

router.put('/:id', upload.any(), updateCourse);
router.delete('/:id', deleteCourse);
// Add these routes
router.get('/quizzes/:courseId', quizController.getQuizzesByCourseId); // Get quizzes for a dropdown
router.get('/results/:quizId', quizController.getQuizResultsForAdmin); // Get students results
router.get('/:courseId/quizzes', quizController.getQuizzesByCourseId);
// STUDENT: Add review
router.post('/:id/review', async (req, res) => {
    try {
        const { name, rating, comment } = req.body;
        if (!name || !rating) return res.status(400).json({ message: "Name and rating required" });

        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: "Course not found" });

        course.reviews.push({
            name: name.trim(),
            rating: Number(rating),
            comment: comment?.trim() || ""
        });

        await course.save();

        res.json({
            message: "Review added!",
            averageRating: course.averageRating,
            total: course.totalReviews,
            reviews: course.reviews
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ADMIN: Delete single review
router.delete('/:courseId/reviews/:reviewId', async (req, res) => {
    try {
        const { courseId, reviewId } = req.params;

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: "Course not found" });

        const initialLength = course.reviews.length;
        course.reviews = course.reviews.filter(r => r._id.toString() !== reviewId);

        if (course.reviews.length === initialLength) {
            return res.status(404).json({ message: "Review not found" });
        }

        await course.save();

        res.json({
            message: "Review deleted successfully",
            averageRating: course.averageRating,
            totalReviews: course.totalReviews,
            reviews: course.reviews
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ADMIN: Get all classes
router.get('/admin/all-classes', async (req, res) => {
    try {
        const classes = await Class.find().populate('faculty', 'name email').sort({ date: -1 });
        res.json(classes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ADMIN: Delete class by ID
router.delete('/admin/class/:id', async (req, res) => {
    try {
        await Class.findByIdAndDelete(req.params.id);
        res.json({ message: "Class deleted by Admin" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;