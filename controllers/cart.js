const User = require('../models/user');
const ObjectID = require('mongoose').Types.ObjectId;

exports.getCreateCart = async (req, res, next) => {
    try {
        User.findByIdAndUpdate(req.params.id,
            {
                $push: {
                    cart: {
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
    } catch (err) {
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

exports.getShowPanier = (req, res) => {

    try {
        User.findById(req.params.id,
            () => {
                // return res.status(200).json(docs)
                User.aggregate([
                    {
                        '$match': {
                            _id: ObjectID(req.params.id)
                        }
                    }, {
                        '$project': {
                            'firstname': 1,
                            'lastname': 1,
                            'email': 1
                        }
                    }, {
                        $lookup: {
                            'from': 'stores', 
                            'let': {
                              'product': '_id'
                            }, 
                            'pipeline': [
                              {
                                '$project': {
                                  'product.product_name': 1, 
                                  'product.price': 1, 
                                  'product.stock': 1, 
                                  'product.category': 1, 
                                  'product._id': 1, 
                                  '_id': 1
                                }
                              }
                            ], 
                            'as': 'panier'
                          }
                    }]).exec((err, data) => {
                        if (err) return res.status(400).send(err);
                        return res.status(200).send(data);
                    })
            }
        )

    } catch (err) {
        return res.status(400).send(err);
    }

}