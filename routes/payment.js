const express = require('express');
const router = express.Router();
const paymentCtrl = require('../controllers/payment');
const auth = require('../middlewares/auth')


router.post("/create-checkout-session", auth, paymentCtrl.createCheckoutSession)

module.exports = router ;
