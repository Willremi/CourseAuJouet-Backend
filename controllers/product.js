const Store = require('../models/store')


exports.getNewProduct = (req, res, next) => {

Store.findOne({_id:"617be8eee6779798daa3228f"})
.then((store) => {
    const product = store.product
    res.status(200).json({product})
})
.catch((err) => res.status(500).json({err}))
}
