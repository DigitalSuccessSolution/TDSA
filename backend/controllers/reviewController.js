// --- IMPORTS ---
// Dhyan de: Yahan curly brackets {} nahi hone chahiye
const Review = require('../models/Review'); 
const Course = require('../models/Course'); 

// --- DEBUGGING BLOCK (Server start hone par print karega) ---
console.log("Check Review Model:", Review); 
// Agar ye '{}' ya 'undefined' print kare, to 'models/Review.js' me galti hai.
// Agar ye 'Model { Review }' jaisa kuch print kare, to sab sahi hai.

if (!Review || typeof Review.find !== 'function') {
  console.error("CRITICAL ERROR: Review model is not loaded correctly. Check models/Review.js export.");
}

// --- ADMIN: GET ALL REVIEWS ---
exports.getAllReviewsForAdmin = async (req, res) => {
  try {
    console.log("Admin requesting all reviews...");

    // Ye line ab fail nahi honi chahiye agar import sahi hai
    const reviews = await Review.find()
      .populate('user', 'name email')
      .populate('course', 'subject')
      .sort({ createdAt: -1 });
    
    console.log(`Reviews fetched successfully: ${reviews.length}`);
    res.json(reviews);

  } catch (error) {
    console.error('Admin Get Reviews Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// --- ADMIN: DELETE REVIEW ---
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);
    
    if (!review) return res.status(404).json({ error: 'Review not found' });

    const courseId = review.course; 

    await Review.findByIdAndDelete(reviewId);

    if (courseId) {
        // Safe check agar Course model load nahi hua (rare case)
        if (Course && typeof Course.findByIdAndUpdate === 'function') {
            await Course.findByIdAndUpdate(courseId, { $pull: { reviews: reviewId } });
            await calculateCourseRating(courseId);
        }
    }

    res.json({ message: 'Review deleted successfully.' });
  } catch (error) {
    console.error('Delete Review Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// --- USER: CREATE REVIEW ---
exports.createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const courseId = req.params.courseId;
    const userId = req.user.id;

    if (!courseId) return res.status(400).json({ error: 'Course ID is required.' });

    const existing = await Review.findOne({ user: userId, course: courseId });
    if (existing) return res.status(400).json({ error: 'Already reviewed.' });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found.' });

    const review = new Review({
      user: userId,
      course: courseId,
      rating,
      comment
    });
    await review.save();

    await Course.findByIdAndUpdate(courseId, { $push: { reviews: review._id } });
    await calculateCourseRating(courseId);

    const populatedReview = await Review.findById(review._id).populate('user', 'name email');
    res.status(201).json({ message: 'Review added!', review: populatedReview });

  } catch (error) {
    console.error('Create Review Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// --- PUBLIC: GET REVIEWS FOR A COURSE ---
exports.getReviews = async (req, res) => {
  try {
    const { courseId } = req.params;
    const reviews = await Review.find({ course: courseId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
      
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    const avg = reviews.length ? (total / reviews.length).toFixed(1) : 0;

    res.json({ reviews, averageRating: parseFloat(avg) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- PUBLIC: ALL REVIEWS AVG ---
exports.getAllReviewsWithAvg = async (req, res) => {
    try {
      const reviews = await Review.find().select('course rating');
      const courseMap = {};
  
      reviews.forEach(r => {
        if (!r.course) return;
        if (!courseMap[r.course]) courseMap[r.course] = { sum: 0, count: 0 };
        courseMap[r.course].sum += r.rating;
        courseMap[r.course].count += 1;
      });
  
      const result = Object.keys(courseMap).map(cId => ({
        courseId: cId,
        averageRating: parseFloat((courseMap[cId].sum / courseMap[cId].count).toFixed(1))
      }));
  
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

// Helper
const calculateCourseRating = async (courseId) => {
    const reviews = await Review.find({ course: courseId });
    let avg = 0;
    if (reviews.length > 0) {
        const total = reviews.reduce((sum, r) => sum + r.rating, 0);
        avg = (total / reviews.length).toFixed(1);
    }
    await Course.findByIdAndUpdate(courseId, { rating: parseFloat(avg) });
};