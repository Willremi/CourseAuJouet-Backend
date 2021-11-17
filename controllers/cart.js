const User = require('../models/user');
// const ObjectID = require('mongoose').Types.ObjectId;

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

exports.getEditCart = (req, res) => {
    try {
        return User.findById(req.params.id,
            (err, docs) => {
                const product = docs.cart.find((produit) => produit._id.equals(req.body.productId));
                // console.log(product);
                
                if(!product) return res.status(404).send('Product Not Found');

                product.quantity = req.body.quantity;
                product.price = req.body.price;

                // return res.status(200).send(docs);
                
            //    return docs.save((err) => {
            //         if(!err) return res.status(200).send(docs);
            //         return res.status(500).send(err);
            //     })
                return docs.save((err)=> {
                    return res.status(500).send(err);
                })
            }

        )
        
        
    } catch (err) {
        return res.status(400).send(err);
    }
}