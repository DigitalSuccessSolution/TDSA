// server/routes/authRoutes.js
const express = require('express');
const { register, login } = require('../controllers/authController');
const { emailMiddleware } = require('../middleware/emailMiddleware');

const router = express.Router();

router.post('/register',emailMiddleware("registration"), register);
router.post('/login', login);

module.exports = router;