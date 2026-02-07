// routes/siteRoutes.js
const express = require('express');
const router = express.Router();

// Ab mentors course ke saath save ho rahe hain, yeh route optional hai
router.get('/mentors', async (req, res) => {
  res.json([]); 
});

module.exports = router;