const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const passport = require('passport')

router.post('/register', userCtrl.register);
router.post('/authenticate', userCtrl.login);
router.get('/confirm_register/:confirmationCode', userCtrl.verifyUser);
router.post('/reset-password', userCtrl.sendEmailResetPassword);
router.post('/valid-reset-password/:id', userCtrl.validResetPassword);

//third auth 
router.get('/auth/google', passport.authenticate('google', {
    scope:['profile']
}))

//third loggout
router.get('/auth/google/logout', userCtrl.logoutWithGoogle)

module.exports = router;