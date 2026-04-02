const express = require('express');
const router = express.Router();
const cors = require('cors');
const paymentController = require('../controllers/paymentController');

// Route to prepare payment request
router.post('/create', cors(), paymentController.createPayment);
router.post('/create-payment', cors(), paymentController.createPayment);

// Route to handle PayU response (Redirect URL)
// PayU sends a POST request with the payment data
router.post('/response', cors(), paymentController.paymentResponse);

// Webhook for PayU
router.post('/webhook', paymentController.payuWebhook);

module.exports = router;
