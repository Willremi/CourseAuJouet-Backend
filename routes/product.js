const express = require('express');
const router = express.Router();
const productCtrl = require('../controllers/product');
const auth = require('../middlewares/auth')
const multer = require('../middlewares/multer-config')

router.get('/getallproduct', productCtrl.getAllProducts);
router.get('/getoneproduct', productCtrl.getOneProduct);
router.get('/getnewproduct', productCtrl.getNewProduct);
router.post('/addnewproduct', auth, multer, productCtrl.addNewProduct);
router.post('/modifyproduct', auth, multer, productCtrl.modifyProduct);
router.get('/getpopularproduct', productCtrl.getpopularproduct);
router.put('/deleteoneimage', productCtrl.deleteOneStockedImage);

module.exports = router;
