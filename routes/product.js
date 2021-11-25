const express = require('express');
const router = express.Router();
const productCtrl = require('../controllers/product');

router.get('/getnewproduct', productCtrl.getNewProduct);

module.exports = router;
