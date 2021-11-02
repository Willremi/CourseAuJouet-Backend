const express = require('express');
const mongoose = require('mongoose');
/* test git */
const app = express();
mongoose.connect('mongodb+srv://ENDOR:tJMORaTVs92tSOrI@sopeckoko.tum3a.mongodb.net/test?authSource=admin&replicaSet=atlas-rgbhto-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

module.exports = app