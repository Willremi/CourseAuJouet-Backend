const express = require('express');
const router = express.Router();
const cartCtrl = require('../controllers/cart');
const auth = require('../middlewares/auth')

router.get('/getcart/:id', cartCtrl.getAllProductInCart)
router.post('/addtocart', cartCtrl.AddToCart)
module.exports = router ;