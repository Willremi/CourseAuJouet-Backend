const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

router.post('/register', userCtrl.register);
router.post('/authenticate', userCtrl.login);
router.get('/confirm_register/:confirmationCode', userCtrl.verifyUser);


module.exports = router ;