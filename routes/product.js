const express = require('express');
const router = express.Router();
const productCtrl = require('../controllers/product');

router.get('/getnewproduct', productCtrl.getNewProduct);
router.post('/addproduct', productCtrl.addNewProduct);

module.exports = router;
