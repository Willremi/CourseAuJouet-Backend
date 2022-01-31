const Product = require('../models/product')
const fs = require('fs');
const { drive, shareFiles } = require('../middlewares/gDrive.config');

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

exports.addNewProduct = (req, res, next) => {
  var imagesArray = [];

  // ids des images du drive 
  var drivefilesId = [];

  // Données du dossier à créer pour le drive
  var folderMetadata = {
    'name': req.body.product_name,
    'mimeType': 'application/vnd.google-apps.folder'
  };
  // Création de dossier dans le drive
 drive.files.create({
    resource: folderMetadata,
    fields: { id: 'id', name: 'name' }
  })
  .then((response) => {
    let folderId = response.data.id
    // console.log("folderId", folderId);
    req.files.forEach(element => {
      imagesArray.push(`${req.protocol}://${req.get('host')}/images/${element.filename}`)

      // Uploader des images dans drive
      const fileMetadata = {
        name: element.originalname,
        parents: [folderId]
      }

      const media = {
        mimeType: element.mimetype,
        body: fs.createReadStream(element.path)
      }

      // drive.files.create({
      //   resource: fileMetadata,
      //   media: media,
      //   fields: { id: 'id', name: 'name' }
      // })
      // .then((response) => {
      //   let idFile = response.data.id;

      //   // Partage d'images vues par tous
      //   shareFiles(idFile)    
      // })
      // .catch(err => console.log(err))
      async function upload() {
        const result = await drive.files.create({
          resource: fileMetadata,
          media: media,
          fields: { id: 'id', name: 'name' }
        })
        // console.log(result.data);
        let idFiles = result.data.id
        
        // Partage d'images vues par tous
        shareFiles(idFiles)
        
      }
      upload()
    });
    
    const product = new Product({
      product_name: req.body.product_name,
      reference: req.body.reference,
      description: req.body.description,
      images: imagesArray,
      folderId: folderId,
      price: req.body.price.replace(/\./g, '').replace(',', ''),
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
          message: `Vous avez ajouté ${req.body.product_name} dans la catégorie ${req.body.category}`,
        });
      })
      .catch((error) => {
        if (error.errors.reference) {
          res.status(500).json({
            message: "La référence " + error.errors.reference.value + " est déjà utilisée sur un autre produit"
          })
        }
        else if (error.errors.product_name) {
          res.status(500).json({
            message: "Le nom du produit " + error.errors.product_name.value + " est déjà utilisé"
          })
        }
        else {
          res.status(500).json({
            message: "Une erreur du serveur est survenue, si le problème persite veuillez contacter l'administrateur du site"
          })
        }
      });
  })
  .catch(err => console.log(err))

 
  // drive.files.create({
  //   resource: folderMetadata, 
  //   fields: {id: 'id', name: 'name'}
  // }, function (err, file) {
  //   if(err) {
  //     console.error(err)
  //   } else {
  //     console.log('Folder Id : ', file.data.id);
  //     const folderId = file.data.id

  //     for(image of req.files) {
  //       let nom = image.filename
  //       let nomSlice = nom.slice(0, nom.length - 4)

  //       // uploader les images dans dossier
  //       const filemetadata = {
  //         name: nomSlice, 
  //         parents: [folderId]
  //       }

  //       const media = {
  //         mimeType: image.mimeType, 
  //         body: fs.createReadStream(image.path)
  //       }

  //       drive.files.create({
  //         resource: filemetadata, 
  //         media: media,
  //         fields: 'id'
  //       }, (err, file) => {
  //         if(err) throw err
  //         let fileId = file.data.fileId
  //         // Partager pour être vu par tous
  //         drive.permissions.create({
  //             fileId: fileId,
  //             requestBody: {
  //                 role: 'reader',
  //                 type: 'anyone'
  //             }
  //         })
  //         drive.files.get({
  //             fileId,
  //             fields: 'webViewLink'
  //         })
  //       })
  //     }
  //   }
  // })

};

exports.modifyProduct = (req, res, next) => {
  var imagesArray = [];
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
    req.files.forEach(element => {
      imagesArray.push(`${req.protocol}://${req.get('host')}/images/${element.filename}`)
    });
  }


  Product.findOneAndUpdate({ _id: req.body._id },
    {
      product_name: req.body.product_name,
      reference: req.body.reference,
      description: req.body.description,
      images: imagesArray,
      price: req.body.price,
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
  Product.findOne({ _id: req.body._id })
    .then((product) => res.status(200).json({ product }))
    .catch((error) => res.status(500).json({ error }))
}
