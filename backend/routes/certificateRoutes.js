const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController');

// Route: POST /api/certificate/send
router.post('/send', certificateController.sendCertificate);

module.exports = router;