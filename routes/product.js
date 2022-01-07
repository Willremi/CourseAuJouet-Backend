const express = require('express');
const router = express.Router();
const productCtrl = require('../controllers/product');
const auth = require('../middlewares/auth');
const managerAuth = require('../middlewares/managerAuth');
const multer = require('../middlewares/multer-config')

router.get('/getallproduct', auth, managerAuth, productCtrl.getAllProducts);
router.get('/getnewproduct', productCtrl.getNewProduct);
router.post('/addnewproduct', auth, managerAuth, multer, productCtrl.addNewProduct);
router.get('/getpopularproduct', productCtrl.getpopularproduct);

module.exports = router;
