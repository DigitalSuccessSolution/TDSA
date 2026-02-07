const mongoose = require("mongoose");

const MentorSchema = new mongoose.Schema({
  name: String,
  designation: String,
  photo: String,
  facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Faculty",
    required: true,
  },
});

const ReviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: String,
  date: { type: Date, default: Date.now },
});

const ContentSchema = new mongoose.Schema({
  text: String,
});

// NEW: LectureLinkSchema to hold multiple links
const LectureLinkSchema = new mongoose.Schema({
  url: { type: String, required: true }, // लिंक का URL
  type: {
    type: String,
    enum: ["Live", "Recording", "Backup", "Other"],
    default: "Live",
  }, // लिंक का प्रकार
  addedAt: { type: Date, default: Date.now },
});

const LectureSchema = new mongoose.Schema({
  title: String,
  content: [ContentSchema], // UPDATED: Lecture Links अब एक एरे है
  lectureLinks: [LectureLinkSchema],
});

const ModuleSchema = new mongoose.Schema({
  title: String,
  lectures: [LectureSchema],
});

const CourseSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    duration: { type: String, required: true },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: true,
    },
    thumbnail: { type: String },
    demoVideo: {
      type: String,
      default: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
    brochure: { type: String },
    roadmapImage: { type: String }, // NEW: Roadmap Image
    skillsImages: [{ type: String }], // NEW: Multiple Skill Images
    reviews: [ReviewSchema],
    modules: [ModuleSchema],
    mentors: [MentorSchema],

    // Auto calculated
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// IMPORTANT: Yeh hook har save pe average rating update karega
CourseSchema.pre("save", function (next) {
  if (this.reviews && this.reviews.length > 0) {
    const sum = this.reviews.reduce((acc, r) => acc + r.rating, 0);
    this.averageRating = Number((sum / this.reviews.length).toFixed(1));
    this.totalReviews = this.reviews.length;
  } else {
    this.averageRating = 0;
    this.totalReviews = 0;
  }
  next();
});

module.exports = mongoose.model("Course", CourseSchema);
