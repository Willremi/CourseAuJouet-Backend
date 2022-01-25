const express = require('express');
const router = express.Router();
const paymentCtrl = require('../controllers/payment');

router.post("/webhook", paymentCtrl.checkoutSessionCompleted)

module.exports = router ;
