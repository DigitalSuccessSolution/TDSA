// models/FacultyCourse.js
const mongoose = require('mongoose');

const FacultyCourseSchema = new mongoose.Schema({
    facultyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Faculty',
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    courseSubject: {
        type: String,
        required: true
    }
}, { timestamps: true });

// Critical Index for Fast Lookup (faculty + course)
FacultyCourseSchema.index({ facultyId: 1, courseId: 1 });

module.exports = mongoose.model('FacultyCourse', FacultyCourseSchema);