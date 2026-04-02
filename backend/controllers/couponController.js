const Coupon = require('../models/Coupon');

// Create a new coupon (Admin)
exports.createCoupon = async (req, res) => {
    try {
        const { code, discountPercentage, expiryDate, usageLimit } = req.body;

        const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
        if (existingCoupon) {
            return res.status(400).json({ message: "Coupon code already exists" });
        }

        const coupon = new Coupon({
            code,
            discountPercentage,
            expiryDate,
            usageLimit,
            applicableCourse: req.body.applicableCourse || null
        });

        await coupon.save();
        res.status(201).json({ message: "Coupon created successfully", coupon });
    } catch (error) {
        res.status(500).json({ message: "Error creating coupon", error: error.message });
    }
};

// Get all coupons (Admin)
exports.getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.status(200).json(coupons);
    } catch (error) {
        res.status(500).json({ message: "Error fetching coupons", error: error.message });
    }
};

// Delete a coupon (Admin)
exports.deleteCoupon = async (req, res) => {
    try {
        await Coupon.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Coupon deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting coupon", error: error.message });
    }
};

// Validate a coupon (Public)
exports.validateCoupon = async (req, res) => {
    try {
        const { code, courseId } = req.body;
        const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

        if (!coupon) {
            return res.status(404).json({ message: "Invalid or inactive coupon code" });
        }

        // Check if coupon is for a specific course
        if (coupon.applicableCourse && coupon.applicableCourse.toString() !== courseId) {
            return res.status(400).json({ message: "This coupon is not valid for this course" });
        }

        if (new Date() > coupon.expiryDate) {
            coupon.isActive = false;
            await coupon.save();
            return res.status(400).json({ message: "Coupon has expired" });
        }

        if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
            return res.status(400).json({ message: "Coupon usage limit reached" });
        }

        res.status(200).json({
            message: "Coupon validated",
            discountPercentage: coupon.discountPercentage,
            code: coupon.code
        });
    } catch (error) {
        res.status(500).json({ message: "Error validating coupon", error: error.message });
    }
};
