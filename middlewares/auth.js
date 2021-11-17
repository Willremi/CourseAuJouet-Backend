const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1];;
        const payload = jwt.decode(token , 'RANDOM_SECRET_TOKEN');
        //const user = User.findOne({id: payload.userId })
        //console.log(user);
        // on vérifie que le payload JWT renvoi bien un ID 
        // et que l'expiration n'est pas dépassée
        if (!payload.userId ) {
            throw 'user ID non valable';
        } else if ( Date.now() >= payload.exp * 1000 ) {
           throw 'Token de connection expiré'
        } else {
            next();
        }
    } catch(error) {
        res.status(401).json({ error: error | 'requête non authentifiée'});
    }
}

// || user.rememberMe !== payload.rememberMe 