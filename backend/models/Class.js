// models/Class.js
const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
    subjectName: { type: String, required: true },
    classLink: { type: String, required: true },
    date: { type: Date, required: true },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Class', ClassSchema);