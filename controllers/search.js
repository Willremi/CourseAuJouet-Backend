const Product = require('../models/product')

exports.searchProduct = (req, res, next) => {
    Product.aggregate([
        {
          '$search': {
            'index': 'search_product', 
            'text': {
              'query': `${req.body.search}`, 
              'path': ['product_name', 'category', 'trademark']
            }
          }
        }
      ])
    .then((result) => {
        res.status(200).json({ result })
    })
    .catch((error) => res.status(404).json({ error }))

}