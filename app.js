require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const userRoutes = require('./routes/user')
const cartRoute = require('./routes/cart')
const productRoute = require('./routes/product')
const searchRoute = require('./routes/search')
const carouselRoute = require('./routes/carousel');
const paymentRoute = require('./routes/payment');
const orderRoute  = require('./routes/order');
const webhookRoute = require('./routes/webhook');

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

mongoose.connect('mongodb+srv://ENDOR:tJMORaTVs92tSOrI@sopeckoko.tum3a.mongodb.net/LaCourseAuJouet?authSource=admin&replicaSet=atlas-rgbhto-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.urlencoded({ extended : true }));

app.use((req, res, next) => {
  if(req.originalUrl !== '/api/webhook'){
    express.json()(req, res, next)
  } else {
    next();
  }
})


app.use('/api', express.raw({type: 'application/json'}), webhookRoute);
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api', userRoutes);
app.use('/api', cartRoute);
app.use('/api', productRoute);
app.use('/api', searchRoute);
app.use('/api', carouselRoute);
app.use('/api', paymentRoute);
app.use('/api', orderRoute);

module.exports = app