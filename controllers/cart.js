const User = require('../models/user');
// const ObjectID = require('mongoose').Types.ObjectId;

exports.getCreateCart = async (req, res, next) => {
    try {
        User.findByIdAndUpdate(req.params.id,
            {
                $push: {
                    cart: {
                        product_id: req.body.product_id,
                        quantity: req.body.quantity,
                        price: req.body.price
                    }
                }
            },
            { new: true },
            (err, docs) => {
                if (!err) return res.send(docs);
                else return res.status(400).send(err);
            })
    } catch(err) {
        return res.status(400).send(err);
    }
}

exports.getAllProductInCart = (req, res, next) => {
    User.findOne({ _id: req.params.id })
        .then(user => {
            const cart = user.cart;
            return res.status(200).json({ cart })
        })
        .catch(error => res.status(500).json({ error }))
}
