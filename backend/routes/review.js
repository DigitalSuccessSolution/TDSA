const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// --- 1. ADMIN ROUTES (MUST BE FIRST) ---
// Ye line sabse upar honi chahiye warna code 'admin' ko courseId samajh lega
router.get('/admin/all',   reviewController.getAllReviewsForAdmin);
router.delete('/admin/:reviewId',   reviewController.deleteReview);

// --- 2. PUBLIC & USER ROUTES ---
router.get('/', reviewController.getAllReviewsWithAvg); // For homepage stats

// Dynamic routes (:courseId) neeche aayenge
router.get('/:courseId', reviewController.getReviews);
router.post('/:courseId',  reviewController.createReview);

module.exports = router;