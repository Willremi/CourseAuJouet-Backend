const express = require('express');
const router = express.Router();
const orderCtrl = require('../controllers/order');
const auth = require('../middlewares/auth')

router.post('/register-order', auth, orderCtrl.createOrder )
router.get('/get-one-order/:id', auth, orderCtrl.getOneOrder)
module.exports = router ;
