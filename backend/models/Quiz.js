const mongoose = require('mongoose');

const OptionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    isCorrect: { type: Boolean, default: false }
}, { _id: true });

const QuestionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    questionDescription: { type: String, required: false, default: '' }, 
    type: { type: String, enum: ['radio', 'checkbox'], default: 'radio' },
    options: { 
        type: [OptionSchema], 
        required: true, 
        validate: [arrayMinLength, '{PATH} must have at least 2 options'] 
    }
});

function arrayMinLength(val) {
    return val.length >= 2;
}

const QuizSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: false },
    instructions: { type: String, default: "" }, 
    
    // ✅ NEW FIELD: Marks this quiz as a Final Exam
    isFinalExam: { type: Boolean, default: false },

    courseId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'FacultyCourse', 
        required: true 
    },
    
    questions: { type: [QuestionSchema], default: [] },
    
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Faculty', 
        required: true 
    }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', QuizSchema);