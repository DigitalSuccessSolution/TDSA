const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    discountPercentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    expiryDate: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    usageCount: {
        type: Number,
        default: 0
    },
    usageLimit: {
        type: Number,
        default: null // null means unlimited
    },
    applicableCourse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        default: null // null means applicable to all courses
    }
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);
