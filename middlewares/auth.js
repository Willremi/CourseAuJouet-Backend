const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    
    try{
        const token = req.headers.authorization.split(' ')[1];;
        const payload = jwt.decode(token , 'RANDOM_SECRET_TOKEN');
        // console.log(payload)
        // on vérifie que le payload JWT renvoi bien un ID 
        if (!payload.userId ) {
            throw 'user ID non valable';
        } else {
            next();
        }
    } catch(error) {
        res.status(401).json({ error: 'requête non authentifiée'});
    }
}
