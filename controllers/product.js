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
        on_sale_date: -1,
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
  
  var imagesArray = [];
  req.files.forEach(element => {
    imagesArray.push(`${req.protocol}://${req.get('host')}/images/${element.filename}`)
  });
  
  const product = new Product({
    product_name: req.body.product_name,
    reference: req.body.reference,
    description: req.body.description,
    images : imagesArray,
    price: req.body.price,
    stock: req.body.stock,
    trademark: req.body.trademark,
    required_age: req.body.required_age,
    on_sale_date: Date.now(),
    category: req.body.category,
    subcategory: req.body.subcategory,
    ordered: 0,
    status: req.body.status
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

exports.modifyProduct = (req, res, next) => {
  console.log(req);
  // var imagesArray = [];
  // req.files.forEach(element => {
  //   imagesArray.push(`${req.protocol}://${req.get('host')}/images/${element.filename}`)
  // });
  Product.findOneAndUpdate({_id : req.body._id}, 
  {  product_name: req.body.product_name,
    reference: req.body.reference,
    description: req.body.description,
    // images : imagesArray,
    price: req.body.price,
    stock: req.body.stock,
    trademark: req.body.trademark,
    required_age: req.body.required_age,
    category: req.body.category,
    subcategory: req.body.subcategory,
    status: req.body.status})

    .then(() => {
      res.status(200).json({message : "le produit à été mis à jour"})
    })
    .catch( error => res.status(500).json( {error} ))
};

exports.getpopularproduct = (req, res, next) => {
  const totalOrdered = [];
  const reducer = (previousValue, currentValue) => previousValue + currentValue;

  Product.find({ ordered: { $gt: 0 } })
    .then((product) => {
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

exports.getOneProduct = (req, res, next) => {
  Product.findOne({_id: req.body._id})
    .then((product) => res.status(200).json({ product }))
    .catch((error) => res.status(500).json({ error }))
}