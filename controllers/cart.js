const User = require('../models/user');
const ObjectID = require('mongoose').Types.ObjectId;
const Store = require('../models/store')
const mongoose =require('mongoose')

exports.getAllProductInCart = (req, res, next) => {
    User.findOne({ _id: req.params.id })
        .then(user => {
            const cart = user.cart;
            return res.status(200).json({ cart })
        })
        .catch(error => res.status(500).json({ error }))
}

exports.AddToCart = (req, res, next) => {
    const cart = []

//     User.findOne({ _id: req.body.userid })
//         .then((user) => {
//             user.cart.map((inCart) => {
//                 cart.push(inCart)
//             })
//             Store.findOne()
//                 .then(store => {
//                     store.product.map((toArray) => {
//                         if (toArray._id.valueOf() === req.body.id.valueOf()) {
//                             return cart.push(toArray)
//                         }
//                     })

//                     User.findOneAndUpdate({ _id: req.body.userid },
//                         {
//                             cart: cart
//                         })
//                         .then(() => {
//                             res.status(200).json({ message: "Le produit a été ajouté dans le panier" })
//                         })
//                         .catch(error => res.status(500).json({ error }))
//                 })
//                 .catch(error => res.status(500).json({ error }))
//         })
//         .catch(error => res.status(500).json({ error }))
// }



// exports.getShowPanier = (req, res) => {

//     try {
//         User.findById(req.params.id,
//             () => {
//                 // return res.status(200).json(docs)
//                 User.aggregate([
//                     {
//                         '$match': {
//                             _id: ObjectID(req.params.id)
//                         }
//                     }, {
//                         '$project': {
//                             'firstname': 1,
//                             'lastname': 1,
//                             'email': 1
//                         }
//                     }, {
//                         $lookup: {
//                             'from': 'stores',
//                             'as': 'panier',
//                             'let': {
//                               'product': '_id'
//                             },
//                             'pipeline': [
//                               {
//                                 '$project': {
//                                   'product.product_name': 1,
//                                   'product.price': 1,
//                                   'product._id': 1,
//                                   '_id': 1
//                                 }
//                               }
//                             ],
//                           },
//                     }, {
//                         '$unwind': {
//                           'path': '$panier'
//                         }
//                       }, {
//                         '$unwind': {
//                           'path': '$panier.product'
//                         }
//                       }, {
//                         $match: {
//                             'panier.product._id': ObjectID(req.body.productId)
//                         }
//                     }
//                 ]).exec((err, data) => {
//                         if (err) return res.status(400).send(err);
//                         return res.status(200).send(data);
//                     })
//             }
//         )

//     } catch (err) {
//         return res.status(400).send(err);
//     }

// }
    User.findOne({_id: req.body.userid})
    .then((user) => {
        user.cart.map((inCart) => {
            cart.push(inCart)
        })
        Store.findOne()
    .then(store => {
        store.product.map((toArray) => {
            if(toArray._id.valueOf() === req.body.id.valueOf()){
               return cart.push(toArray)   
        }
    })  
        
        User.findOneAndUpdate( {_id: req.body.userid},
            {
             cart: cart
         })
         .then(() => {
           res.status(200).json({ message : "Le produit a été ajouté dans le panier"})
         })
         .catch( error => res.status(500).json({ error }))
    })
    .catch( error => res.status(500).json({error}))
    })
    .catch(error => res.status(500).json({ error }))
}

exports.RemoveOneProduct = (req, res, next) => {
    const userCart = []
    User.findOne({_id: req.body.userId})
    .then((user) => {
        user.cart.map((cart) => {
            if(cart._id.valueOf() !== req.body.productId.valueOf()){
                userCart.push(cart)
            }
        
        })
        User.updateOne({_id: req.body.userId}, {cart: userCart, _id: req.body.userId})
        .then(() => res.status(200).json({ message: "Produit supprimé du panier !"}))
        .catch((error) => res.status(500).json({ error }))
    })
    .catch((error) => res.status(500).json({ error }))

    
}
