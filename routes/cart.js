const express = require('express');
const router = express.Router();
const cartCtrl = require('../controllers/cart');
const auth = require('../middlewares/auth')


router.post('/addtocart', cartCtrl.AddToCart);
router.get('/getcart/:id',auth, cartCtrl.getAllProductInCart);
router.post('/addproductincart', auth, cartCtrl.AddToCart);
router.patch('/removeproduct', auth, cartCtrl.RemoveOneProduct)
module.exports = router ;
