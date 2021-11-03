const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const authRoutes = require('./routes/auth')

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

mongoose.connect('mongodb+srv://ENDOR:tJMORaTVs92tSOrI@sopeckoko.tum3a.mongodb.net/test?authSource=admin&replicaSet=atlas-rgbhto-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true',
{ useNewUrlParser: true,
  useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
  
  app.use(bodyParser.json());
  

app.use('/api/authenticate', authRoutes);


module.exports = app