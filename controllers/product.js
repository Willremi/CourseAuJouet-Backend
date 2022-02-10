const Product = require('../models/product')
const fs = require('fs');
const productArchive = require('../models/productArchive');
exports.getAllProducts = (req, res, next) => {
  //
  Product.find()
    .then((products) => res.status(200).json({
      products
    }))
    .catch((error) => {

      res.status(500).json({
        message: "Une erreur est survenue lors de la récupération des produits, si le problème persite veuillez contacter l'administrateur du site"
      })
    })
}

exports.getNewProduct = async (req, res, next) => {
  Product.aggregate([{
    $sort: {
      on_sale_date: -1,
    },
  },
  {
    $limit: 4,
  },
  ])
    .then((product) => {
      res.status(200).json({
        product
      });
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({
        message: "Une erreur est survenue lors de la récupération des nouveaux produits, si le problème persite veuillez contacter l'administrateur du site"
      })
    });
};

exports.addNewProduct = async (req, res, next) => {
  var imagesArray = [];

  // ids des images du drive
  var drivefilesId = [];

  let folderId = await createFolder(req.body.product_name);
  console.log("folderId", folderId);

  const promises = [];
  req.files.forEach((element, index) => {
    imagesArray.push(
      `${req.protocol}://${req.get("host")}/images/${element.filename}`
    );
    promises.push(upload(element, folderId, drivefilesId));
  });

  Promise.all(promises).then((response) => {
    console.log("promises (driveFilesId) : ", response);
    const product = new Product({
      product_name: req.body.product_name,
      reference: req.body.reference,
      description: req.body.description,
      images: imagesArray,
      driveFilesId: response,
      folderId: folderId,
      price: req.body.price.replace(/\./g, "").replace(",", ""),
      stock: req.body.stock,
      trademark: req.body.trademark,
      required_age: req.body.required_age,
      on_sale_date: Date.now(),
      category: req.body.category,
      subcategory: req.body.subcategory,
      ordered: 0,
      status: req.body.status,
    });
    product
      .save()
      .then((response) => {
        // console.log(response);
        res.status(201).json({
          message: `Vous avez ajouté ${req.body.product_name} dans la catégorie ${req.body.category}`,
        });
      })
      .catch((error) => {
        console.log(error);
        if (error.errors.reference) {
          res.status(500).json({
            message:
              "La référence " +
              error.errors.reference.value +
              " est déjà utilisée sur un autre produit",
          });
        } else if (error.errors.product_name) {
          res.status(500).json({
            message:
              "Le nom du produit " +
              error.errors.product_name.value +
              " est déjà utilisé",
          });
        } else {
          res.status(500).json({
            message:
              "Une erreur du serveur est survenue, si le problème persite veuillez contacter l'administrateur du site",
          });
        }
      });
  });
};

exports.modifyProduct = async (req, res, next) => {
  var imagesArray = [];

  // ids des images du drive
  var drivefilesId = [];

  // si dossier existe
  let folderId = await folder(req.body.product_name)
  console.log("folderId", folderId);
  
  const promises = [];

  //gestion des images en BDD
  if (req.body.stockedImages) {
    if (Array.isArray(req.body.stockedImages)) {
      req.body.stockedImages.forEach(element => {
        imagesArray.push(element)
      })
    } else {
      imagesArray.push(req.body.stockedImages)
    }
  }

  //gestion des images upload
  if (req.files) {
    req.files.forEach((element, index) => {
      imagesArray.push(`${req.protocol}://${req.get('host')}/images/${element.filename}`)
      // promises.push(upload(element, folderId, drivefilesId))
    });
  }

  Product.findOneAndUpdate({ _id: req.body._id },
    {
      product_name: req.body.product_name,
      reference: req.body.reference,
      description: req.body.description,
      images: imagesArray,
      price: req.body.price.replace(/\./g, "").replace(",", ""),
      stock: req.body.stock,
      trademark: req.body.trademark,
      required_age: req.body.required_age,
      category: req.body.category,
      subcategory: req.body.subcategory,
      status: req.body.status
    })
    .then(() => {
      res.status(201).json({ message: `le produit "${req.body.product_name}" à été mis à jour` });

      //SUPPRESSION DES IMAGES EN BACK
      if (req.body.deletedImages) {
        if (Array.isArray(req.body.deletedImages)) {
          req.body.deletedImages.forEach(element => {
            const filename = element.split('/images/')[1];
            fs.unlink(`images/${filename}`, (err) => {
              if (err) throw err;
              console.log(`${filename} a été supprimé`);
            })
          })
        } else {
          const filename = req.body.deletedImages.split('/images/')[1];
          fs.unlink(`images/${filename}`, (err) => {
            if (err) throw err;
            console.log(`${filename} a été supprimé`);
          })
        }
      }
    })
    .catch((error) => {
      {
        if (error.keyValue.product_name) {
          res.status(401).json({ message: `Le nom ${error.keyValue.product_name} existe déjà` })
        }
        else if (error.keyValue.reference) {
          res.status(401).json({ message: `La reference ${error.keyValue.reference} existe déjà` })
        }
        else {
          res.status(500).json({ error })
        }
      }
    }
    )
};
    
exports.deleteProduct = (req, res) => {
  const productToArchive = new productArchive({
    product_name: req.body.product_name,
    reference: req.body.reference,
    description: req.body.description,
    images: req.body.images,
    price: req.body.price,
    stock: req.body.stock,
    trademark: req.body.trademark,
    required_age: req.body.required_age,
    on_sale_date: req.body.on_sale_date,
    category: req.body.category,
    subcategory: req.body.subcategory,
    ordered: req.body.ordered,
    status: req.body.status,
    previousId: req.body._id
  });

  productToArchive.save()
  .then(() => {
    Product.findByIdAndDelete(req.body._id)
    .then(() => {
      res.status(201).json({
        message: `Vous avez supprimé ${req.body.product_name}`,
      });
    })
    .catch((error) =>{
      res.status(404).json({message: error})
    })
  })
  .catch((error) => {
    res.status(404).json({message : error})
  })
}

exports.deleteManyProducts = (req, res) => {
  let ProductToDeleteArray = [] // Array pour push les ID et effacer tous les produits en une req
  const productsToDelete = req.body
  productsToDelete.forEach(element => {
    const productToArchive = new productArchive({
      product_name: element.product_name,
      reference: element.reference,
      description: element.description,
      images: element.images,
      price: element.price,
      stock: element.stock,
      trademark: element.trademark,
      required_age: element.required_age,
      on_sale_date: element.on_sale_date,
      category: element.category,
      subcategory: element.subcategory,
      ordered: element.ordered,
      status: element.status,
      previousId: element._id
    });
    productToArchive.save()
    ProductToDeleteArray.push(element._id)
  })
  Product.deleteMany({_id:{$in: ProductToDeleteArray}} )
  .then(() => {
    res.status(201).json({
      message: "Les articles ont été supprimés",
    });
  })
  .catch((error) =>{
    res.status(404).json({message: error})
  })
}


exports.getpopularproduct = (req, res, next) => {
  const totalOrdered = [];
  const reducer = (previousValue, currentValue) => previousValue + currentValue;

  Product.find({
    ordered: {
      $gt: 0
    }
  })
    .then((product) => {
      product.map((ord) => {
        totalOrdered.push(ord.ordered);
      });
      const orderedAverage = Math.round(
        totalOrdered.reduce(reducer) / totalOrdered.length
      );


      Product.find({
        ordered: {
          $gt: orderedAverage
        }
      })

        .then((popularProduct) => {

          res.status(200).json({
            popularProduct
          });
        })

        .catch((err) => {
          console.log(err)
          res.status(500).json({
            message: "Une erreur est survenue lors de la récupération des nouveaux produits, si le problème persite veuillez contacter l'administrateur du site"
          })
        });
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({
        message: "Une erreur est survenue lors de la récupération des produits populaires, si le problème persite veuillez contacter l'administrateur du site"
      })
    });
};

exports.getOneProduct = (req, res, next) => {
  Product.findOne({_id: req.params.id})
    .then((product) => res.status(200).json({ product }))
    .catch((error) => res.status(500).json({ error }))
}