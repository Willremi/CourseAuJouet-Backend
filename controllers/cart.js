const User = require('../models/user');

exports.getAllProductInCart = (req, res, next) => {
    User.findOne({ _id: req.params.id})
    .then( user => {
        const cart = user.cart;
        return res.status(200).json({ cart })
    } )
    .catch( error => res.status(500).json({ error }))
}
