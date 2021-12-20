const express = require('express');
const router = express.Router();
const productCtrl = require('../controllers/product');
const auth = require('../middlewares/auth')
const multer = require('../middlewares/multer-config')

router.get('/getallproduct', productCtrl.getAllProducts);
router.get('/getnewproduct', productCtrl.getNewProduct);
router.post('/addnewproduct', auth, multer, productCtrl.addNewProduct);
router.get('/getpopularproduct', productCtrl.getpopularproduct);

module.exports = router;
