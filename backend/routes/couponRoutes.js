const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const { protect } = require('../middleware/auth');

// Public route to validate coupon
router.post('/validate', couponController.validateCoupon);

// Admin routes (Protected by user login for now, as no admin role exists yet)
router.post('/create', protect, couponController.createCoupon);
router.get('/all', protect, couponController.getAllCoupons);
router.delete('/:id', protect, couponController.deleteCoupon);

module.exports = router;
