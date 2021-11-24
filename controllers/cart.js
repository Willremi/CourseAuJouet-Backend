const User = require('../models/user');
const Store = require('../models/store');
const mongoose =require('mongoose')

exports.getAllProductInCart = (req, res, next) => {
    User.findOne({ _id: req.params.id})
    .then( user => {
        const cart = user.cart;
        return res.status(200).json({ cart })
    } )
    .catch( error => res.status(500).json({ error }))
}

exports.AddToCart = (req, res, next) => {
    const cart = []

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