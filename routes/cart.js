const express = require('express');
const router = express.Router();
const cartCtrl = require('../controllers/cart');
const auth = require('../middlewares/auth')

router.get('/getcart/:id',auth, cartCtrl.getAllProductInCart)
module.exports = router ;