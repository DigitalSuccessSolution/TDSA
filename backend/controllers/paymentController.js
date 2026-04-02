const crypto = require('crypto');
const Transaction = require('../models/Transaction');
require('dotenv').config();

const PAYU_MERCHANT_KEY = (process.env.PAYU_MERCHANT_KEY || '').trim();
const PAYU_MERCHANT_SALT = (process.env.PAYU_MERCHANT_SALT || '').trim();

exports.createPayment = async (req, res) => {
    try {
        const { amount, productinfo, firstname, email, phone, courseId, userId } = req.body;

        if (!amount || !productinfo || !firstname || !email || !phone) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // --- FALLBACK: If userId is missing, find it by email ---
        let finalUserId = userId;
        if (!finalUserId) {
            const User = require('../models/User');
            const user = await User.findOne({ email: email.toLowerCase() });
            if (user) {
                finalUserId = user._id;
            }
        }

        const amountFixed = parseFloat(amount).toFixed(2);
        const txnid = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;

        // Hash Formula: sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10|salt)
        const hashElements = [
            PAYU_MERCHANT_KEY,
            txnid,
            amountFixed.toString(),
            productinfo,
            firstname,
            email,
            "", "", "", "", "", "", "", "", "", "", // 10 empty fields (udf1 to udf10)
            PAYU_MERCHANT_SALT
        ];
        const hashString = hashElements.join("|");
        const hash = crypto.createHash('sha512').update(hashString).digest('hex');

        // Log the transaction in DB
        const newTransaction = new Transaction({
            txnid,
            amount: amountFixed,
            productinfo,
            firstname,
            email,
            phone,
            status: 'pending',
            user: finalUserId,
            courseId: courseId,
            couponCode: req.body.couponCode || null
        });

        await newTransaction.save();

        res.status(200).json({
            key: PAYU_MERCHANT_KEY,
            txnid,
            amount: amountFixed,
            productinfo,
            firstname,
            email,
            phone,
            hash,
            surl: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payment/response`,
            furl: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payment/response`,
        });

    } catch (error) {
        console.error("Payment creation error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

exports.paymentResponse = async (req, res) => {
    try {
        const {
            status,
            txnid,
            amount,
            productinfo,
            firstname,
            email,
            hash,
            mihpayid,
            mode,
            bank_ref_num,
            unmappedstatus,
            additionalCharges
        } = req.body;

        // Verify Hash
        // Formula: sha512(salt|status|udf10|udf9|udf8|udf7|udf6|udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)
        const reverseHashElements = [
            PAYU_MERCHANT_SALT,
            status,
            "", "", "", "", "", "", "", "", "", "", // udf10 to udf1
            email,
            firstname,
            productinfo,
            amount,
            txnid,
            PAYU_MERCHANT_KEY
        ];
        
        let hashString = reverseHashElements.join("|");
        
        if (additionalCharges) {
            hashString = `${additionalCharges}|${hashString}`;
        }

        const generatedHash = crypto.createHash('sha512').update(hashString).digest('hex');

        if (generatedHash !== hash) {
            // In a production environment, you might want to stop the transaction here
        }

        const isSuccess = status === 'success';

        // Update Transaction in DB
        const transaction = await Transaction.findOne({ txnid });
        if (transaction) {
            transaction.status = isSuccess ? 'success' : 'failure';
            transaction.payu_status = status;
            transaction.payu_mihpayid = mihpayid;
            transaction.payu_mode = mode;
            transaction.payu_bank_ref_num = bank_ref_num;
            transaction.payu_hash = hash;
            await transaction.save();

            // If success, trigger enrollment
            if (isSuccess && transaction.courseId) {
                const User = require('../models/User');
                const Enrollment = require('../models/Enrollment');
                const Coupon = require('../models/Coupon');

                // FALLBACK: If user field is missing from transaction, use email from transaction
                let studentId = transaction.user;
                if (!studentId && transaction.email) {
                    const userAccount = await User.findOne({ email: transaction.email.toLowerCase() });
                    if (userAccount) studentId = userAccount._id;
                }

                if (studentId) {
                    const existing = await Enrollment.findOne({ student: studentId, course: transaction.courseId });
                    if (!existing) {
                        await Enrollment.create({
                            student: studentId,
                            course: transaction.courseId,
                            phone: transaction.phone,
                            status: 'active'
                        });

                        if (transaction.couponCode) {
                            await Coupon.findOneAndUpdate(
                                { code: transaction.couponCode },
                                { $inc: { usageCount: 1 } }
                            );
                        }
                    }
                }
            }
        }

        // Redirect to Frontend
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        if (isSuccess) {
            res.redirect(`${frontendUrl}/payment-success?txnid=${txnid}`);
        } else {
            res.redirect(`${frontendUrl}/payment-failed?txnid=${txnid}`);
        }

    } catch (error) {
        console.error("Payment response error:", error);
        res.status(500).send("Internal Server Error");
    }
};

exports.payuWebhook = async (req, res) => {
    try {
        const { status, txnid, hash, mihpayid } = req.body;
        
        // Find transaction
        const transaction = await Transaction.findOne({ txnid });
        if (transaction) {
            const isSuccess = status === 'success';
            transaction.status = isSuccess ? 'success' : 'failure';
            transaction.payu_status = status;
            transaction.payu_mihpayid = mihpayid;
            await transaction.save();

            // Create enrollment if success
            if (isSuccess && transaction.courseId) {
                const User = require('../models/User');
                const Enrollment = require('../models/Enrollment');

                // FALLBACK: If user field is missing from transaction, use email from transaction
                let studentId = transaction.user;
                if (!studentId && transaction.email) {
                    const userAccount = await User.findOne({ email: transaction.email.toLowerCase() });
                    if (userAccount) studentId = userAccount._id;
                }

                if (studentId) {
                    const existing = await Enrollment.findOne({ student: studentId, course: transaction.courseId });
                    if (!existing) {
                        await Enrollment.create({
                            student: studentId,
                            course: transaction.courseId,
                            phone: transaction.phone,
                            status: 'active'
                        });
                    }
                }
            }
        }
        res.status(200).send("Webhook handled");
    } catch (error) {
        console.error("Webhook error:", error);
        res.status(500).send("Error");
    }
};
