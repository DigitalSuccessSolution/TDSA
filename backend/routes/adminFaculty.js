// routes/adminFaculty.js   ← YE FILE BANAA LE

const express = require('express');
const router = express.Router();
const Class = require('../models/Class');     // ← tera Class model ka path sahi kar dena
const Faculty = require('../models/Faculty'); // ← tera Faculty model

// ADMIN: Saare classes dikhao (koi login nahi chahiye)
router.get('/all-classes', async (req, res) => {
  try {
    const classes = await Class.find()
      .populate('faculty', 'name email')
      .sort({ date: -1 });
    res.json(classes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ADMIN: Koi bhi class delete karo
router.delete('/class/:id', async (req, res) => {
  try {
    const result = await Class.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Class not found' });
    res.json({ message: 'Class deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Delete failed' });
  }
});

module.exports = router;