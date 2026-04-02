const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    txnid: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    productinfo: { type: String, required: true },
    firstname: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    status: { type: String, enum: ['pending', 'success', 'failure'], default: 'pending' },
    payu_status: { type: String },
    payu_mihpayid: { type: String },
    payu_mode: { type: String },
    payu_bank_ref_num: { type: String },
    payu_hash: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    couponCode: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
