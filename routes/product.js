const express = require('express');
const router = express.Router();
const productCtrl = require('../controllers/product');

router.get('/getnewproduct', productCtrl.getNewProduct);
router.patch('/addproduct', productCtrl.addNewProduct);

module.exports = router;