const express = require('express');
const router = express.Router();
const orderCtrl = require('../controllers/order');
const auth = require('../middlewares/auth')

router.post('/register-order', auth, orderCtrl.RegisterOrder )

module.exports = router ;
