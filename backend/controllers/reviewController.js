// --- IMPORTS ---
const Review = require("../models/Review");
const Course = require("../models/Course");

// --- ADMIN: GET ALL REVIEWS ---
// Aggragating reviews from all courses since they are currently embedded
exports.getAllReviewsForAdmin = async (req, res) => {
  try {
    const courses = await Course.find().select("subject reviews");
    let allReviews = [];

    courses.forEach((course) => {
      if (course.reviews) {
        course.reviews.forEach((rev) => {
          allReviews.push({
            _id: rev._id,
            course: { _id: course._id, subject: course.subject },
            user: { name: rev.name }, // Embedded reviews use 'name' instead of 'user' ref
            rating: rev.rating,
            comment: rev.comment,
            createdAt: rev.date || rev.createdAt,
          });
        });
      }
    });

    allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(allReviews);
  } catch (error) {
    console.error("Admin Get Reviews Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// --- ADMIN: UPDATE REVIEW ---
exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const course = await Course.findOne({ "reviews._id": reviewId });
    if (!course) return res.status(404).json({ error: "Review not found" });

    const review = course.reviews.id(reviewId);
    if (review) {
      review.rating = rating || review.rating;
      review.comment = comment || review.comment;
      await course.save(); // Course hook in models/Course.js will auto-recalculate rating
    }

    res.json({ message: "Review updated successfully.", review });
  } catch (error) {
    console.error("Update Review Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// --- ADMIN: DELETE REVIEW ---
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const course = await Course.findOne({ "reviews._id": reviewId });
    if (!course) return res.status(404).json({ error: "Review not found" });

    course.reviews = course.reviews.filter(
      (r) => r._id.toString() !== reviewId,
    );
    await course.save(); // Course hook in models/Course.js will auto-recalculate rating

    res.json({ message: "Review deleted successfully." });
  } catch (error) {
    console.error("Delete Review Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// --- USER: CREATE REVIEW ---
exports.createReview = async (req, res) => {
  // Keeping this for compatibility, but the main one is in courseRoutes.js
  res
    .status(400)
    .json({ error: "Use /api/courses/:id/review endpoint instead." });
};

// --- PUBLIC: GET REVIEWS FOR A COURSE ---
exports.getReviews = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).select(
      "reviews averageRating",
    );
    if (!course) return res.status(404).json({ error: "Course not found" });

    res.json({ reviews: course.reviews, averageRating: course.averageRating });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- PUBLIC: ALL REVIEWS AVG ---
exports.getAllReviewsWithAvg = async (req, res) => {
  try {
    const courses = await Course.find().select("_id averageRating");
    const result = courses.map((c) => ({
      courseId: c._id,
      averageRating: c.averageRating,
    }));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
