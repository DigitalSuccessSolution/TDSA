// models/SiteData.js
const mongoose = require('mongoose');

const MentorSchema = new mongoose.Schema({
  name: String,
  designation: String,
  photo: String
});

const SiteDataSchema = new mongoose.Schema({
  mentors: [MentorSchema]
});

module.exports = mongoose.model('SiteData', SiteDataSchema);