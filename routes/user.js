const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const auth = require('../middlewares/auth');

router.post('/register', userCtrl.register);
router.post('/authenticate', userCtrl.login);
router.get('/confirm_register/:confirmationCode', userCtrl.verifyUser);
router.get('/getoneuser/:id', auth, userCtrl.getOneUser);
router.post('/reset-password', userCtrl.sendEmailResetPassword);
router.post('/valid-reset-password/:id', userCtrl.validResetPassword);
module.exports = router;