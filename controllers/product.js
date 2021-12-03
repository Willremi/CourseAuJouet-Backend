const Store = require('../models/store')
const idStore = "617be8eee6779798daa3228f"

exports.getNewProduct = (req, res, next) => {

Store.findOne({_id:"617be8eee6779798daa3228f"})
.then((store) => {
    const product = store.product
    res.status(200).json({product})
})
.catch((err) => res.status(500).json({err}))
}

exports.addNewProduct = (req, res, next) => {
    console.log(req.body)
    Store.findOneAndUpdate({_id: idStore}, { $push:{
        product:[{
            product_name: req.body.product_name,
            description: req.body.description,
            images: req.body.image,
            price: req.body.price,
            stock: req.body.stock,
            trademark: req.body.trademark,
            required_age: req.body.required_age,
            on_sale_date: req.body.on_sale_date,
            category: req.body.category,
        }]
    }})
    .then(() => {
        res.status(201).json({ message: "Produit ajouté !"})
    })
    .catch(( error ) => res.status(500).json({ error }))
}

