const express = require('express');
const router = express.Router();
const productCtrl = require('../controllers/product');

router.get('/getallproduct', productCtrl.getAllProducts);
router.get('/getnewproduct', productCtrl.getNewProduct);
router.post('/addproduct', productCtrl.addNewProduct);
router.get('/getpopularproduct', productCtrl.getpopularproduct);

module.exports = router;
