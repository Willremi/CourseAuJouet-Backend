const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const keys = require('./keys');

passport.use(
    new GoogleStrategy({
        //options pour la strat'
        callbackURL:'/api/auth/google/redirect',
        clientID: keys.google.clientID,
        clienSecret: keys.google.clientSecret
    }, () => {
        // callback
    })
)