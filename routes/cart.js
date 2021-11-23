const express = require('express');
const router = express.Router();
const cartCtrl = require('../controllers/cart');
const auth = require('../middlewares/auth')

router.get('/getcart/:id', cartCtrl.getAllProductInCart)
router.patch('/getshowpanier/:id', cartCtrl.getShowPanier)
module.exports = router ;