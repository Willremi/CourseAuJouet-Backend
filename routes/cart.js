const express = require('express');
const router = express.Router();
const cartCtrl = require('../controllers/cart');
const auth = require('../middlewares/auth')

router.get('/getcart/:id', cartCtrl.getAllProductInCart)
router.patch('/getcreatecart/:id', cartCtrl.getCreateCart)
router.patch('/geteditcart/:id', cartCtrl.getEditCart)
router.patch('/getremovecart/:id', cartCtrl.getRemoveCart)
module.exports = router ;