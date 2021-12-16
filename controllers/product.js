const Product = require('../models/product')

exports.getAllProducts = (req, res, next) => {
  Product.find()
  .then((products) => res.status(200).json({ products }))
  .catch((error) => res.status(500).json({ error }))
}

exports.getNewProduct = (req, res, next) => {
  Product.aggregate([
    {
      $sort: {
        on_sale_date: 1,
      },
    },
    {
      $limit: 4,
    },
  ])
    .then((product) => {
      res.status(200).json({ product });
    })
    .catch((err) => res.status(500).json({ err }));
};

exports.addNewProduct = (req, res, next) => {
  const product = new Product({
    product_name: req.body.product_name,
    description: req.body.description,
    images: req.body.image,
    price: req.body.price,
    stock: req.body.stock,
    trademark: req.body.trademark,
    required_age: req.body.required_age,
    on_sale_date: req.body.on_sale_date,
    category: req.body.category,
    ordered: 0,
  });

  product
    .save()
    .then(() => {
      res.status(201).json({
        message: `Vous avez ajouté ${req.body.product_name} dans le rayon ${req.body.category}`,
      });
    })
    .catch((error) =>
      res.status(500).json({
        error,
      })
    );
};

exports.getpopularproduct = (req, res, next) => {
  const totalOrdered = [];
  const reducer = (previousValue, currentValue) => previousValue + currentValue;

  Product.find({ ordered: { $gt: 0 } })
    .then((product) => {
      console.log(product);
      product.map((ord) => {
        totalOrdered.push(ord.ordered);
      });
      const orderedAverage = Math.round(
        totalOrdered.reduce(reducer) / totalOrdered.length
      );
      

      Product.find({ ordered: { $gt: orderedAverage } })

        .then((popularProduct) => {

          res.status(201).json({ popularProduct });
        })

        .catch((err) => res.status(500).json({ err }));
    })
    .catch((err) => res.status(500).json({ err }));
};
