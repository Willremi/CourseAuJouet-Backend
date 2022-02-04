const User = require('../models/user');
const Product = require('../models/product')

exports.getAllProductInCart = (req, res, next) => {
    User.findOne({
            _id: req.params.id
        })
        .then(user => {
            const cart = user.cart;
            return res.status(200).json({
                cart
            })
        })
        .catch(error => res.status(500).json({
            error
        }))
}

exports.AddToCart = (req, res, next) => {

    const cartArray = []
    Product.findOne({
            _id: req.body.Product._id
        })
        .then((product) => {
            cartArray.push(product)

            User.findOne({
                    _id: req.body.userId
                })
                .then((user) => {
                    if (!user) {
                        res.status(404).json({
                            message: "Utilisateur non trouvé !"
                        })
                    }
                    user.cart.map((RecupProductInCart) => {
                        cartArray.push(RecupProductInCart)
                    })
                    
                    User.updateOne({
                            _id: req.body.userId
                        }, {
                            cart: cartArray,
                            _id: req.body.userId
                        })
                        .then(() => {
                            res.status(201).json({
                                message: `Vous avez ajouté le produit dans votre panier`
                            })
                        })
                        .catch((error) => res.status(500).json({
                            error
                        }))
                })
                .catch((error) => res.status(500).json({
                    error
                }))
        })
        .catch((error) => res.status(500).json({
            error
        }))


}

exports.RemoveOneProduct = (req, res, next) => {
    const userCart = []
    User.findOne({
            _id: req.body.userId
        })
        .then((user) => {
            user.cart.map((cart) => {
                if (cart._id.valueOf() !== req.body.productId.valueOf()) {
                    userCart.push(cart)
                }

            })
            User.updateOne({
                    _id: req.body.userId
                }, {
                    cart: userCart,
                    _id: req.body.userId
                })
                .then(() => res.status(201).json({
                    message: "Produit supprimé du panier !"
                }))
                .catch((error) => res.status(500).json({
                    error
                }))
        })
        .catch((error) => res.status(500).json({
            error
        }))
}


