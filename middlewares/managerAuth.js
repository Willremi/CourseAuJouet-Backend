const jwt = require('jsonwebtoken');
//verification du role de l'utilisateur
module.exports = (req, res, next) => {
    
    try{
        const token = req.headers.authorization.split(' ')[1];;
        const payload = jwt.decode(token , 'RANDOM_SECRET_TOKEN');
        const userRole = payload.role[0].role_name
        if(userRole !== "MANAGER" && userRole !== "ADMIN"){
            throw 'Role user non valable'
        }
        else {
            next();
        }
    } catch(error) {
        
        res.status(401).json({ message: 'Accès non autorisé'});
    }
}


