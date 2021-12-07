const Product = require('../models/product')

exports.searchProduct = (req, res, next) => {
  console.log("Raquete Front :", req.body)
  Product.aggregate([{
      '$search': {
        'index': 'Submit Search',
        'text': {
          'query': `${req.body.search}`,
          path: {
          'wildcard': '*'
        }
        }
      }
    }])
    .then((result) => {
      res.status(200).json({
        result
      })
    })
    .catch((error) => res.status(404).json({
      error
    }))
}

exports.autoCompleteSearch = (req, res, next) => {
  Product.aggregate([{
      "$search": {//aggregation pour faire une recherche dans la base de donneés
        'index': 'search_product',//Nom de l'index créer dans mongoDB (sur le site pas application)
        "autocomplete": {//autocompletion
          "path": 'product_name',//nom du champs
          "query": `${req.params.text}`,// élément recherché
          "fuzzy": {//Active la recherche floue. Recherche des chaînes similaires au ou aux termes recherchés.
            "maxEdits": 2,//Nombre maximal de modifications de caractère unique requises pour correspondre au terme de recherche spécifié. La valeur peut être 1ou 2.
            "prefixLength": 2,//Nombre de caractères au début de chaque terme dans le résultat qui doit correspondre exactement. La valeur par défaut est 0.
          }
        },
      }
    }])
    .then((suggestion) => {
      res.status(200).json({
        suggestion
      })
    })
    .catch((error) => res.status(500).json({
      error
    }))
}