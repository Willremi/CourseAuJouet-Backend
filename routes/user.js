const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

router.post('/register', userCtrl.register);
router.post('/authenticate', userCtrl.login);
router.get('/confirm_register/:confirmationCode', userCtrl.verifyUser);
router.post('/reset-password', userCtrl.sendEmailResetPassword);
router.post('/valid-reset-password/:id', userCtrl.validResetPassword);
router.post('/auth/google', userCtrl.googleAuth)
router.post('/auth/facebook', userCtrl.facebookAuth)


module.exports = router;