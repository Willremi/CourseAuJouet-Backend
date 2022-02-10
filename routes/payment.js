const express = require('express');
const router = express.Router();
const paymentCtrl = require('../controllers/payment');
const auth = require('../middlewares/auth')


router.post("/create-checkout-session", auth, paymentCtrl.createCheckoutSession)
router.get("/stripe-get-checkout/:id", auth, paymentCtrl.getCheckoutSession)

module.exports = router ;
