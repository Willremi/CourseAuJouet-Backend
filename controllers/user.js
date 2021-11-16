const User = require('../models/user');
const Role = require('../models/role');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const confirmationCode = require('../middlewares/confirmationCode');

const {
  sendConfirmationEmail
} = require('../middlewares/nodemailer.config');


exports.register = (req, res, next) => {
  const token = jwt.sign({
    email: req.body.email
  }, confirmationCode.generateRandomCode(25), {
    expiresIn: '15min'
  });
  
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        civility: req.body.civility,
        firstname: req.body.firstName,
        lastname: req.body.lastName,
        birthday_date: req.body.birthday_date,
        phone: req.body.phone,
        email: req.body.email,
        password: hash,
        registration_date: Date.now(),
        account_status: false,
        rememberMe: false,
        confirmationCode: token,
        
      });

      user.save()
        .then(() => {

          res.status(201).send({
            message: "Vous avez été enregistré, verifiez vos e-mail afin de confirmer votre inscription !"
          })
          sendConfirmationEmail(user.firstname, user.email, user.confirmationCode)
        })
        .catch(error => res.status(400).json({
          error
        }));
    })
    .catch(error => res.status(500).json({
      error
    }));
};


exports.verifyUser = (req, res, next) => {

  User.findOneAndUpdate( {confirmationCode: req.params.confirmationCode},
     {account_status : true,
      role: [{
        role_name: "CUSTOMER"
      }]
  })
  .then(() => {
    res.status(200).json({ message : "Veuillez vous logger"})
  })
  .catch( error => res.status(500).json({ error }))
}



exports.login = (req, res, next) => {
  const remember = req.params.rememberMe
  console.log(req.body);
  User.findOne({
      email: req.body.email
    })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          error: 'Utilisateur non trouvé !'
        });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({
              error: 'Mot de passe incorrect !'
            });
          }
          
          res.status(200).json({
            
            id_token: jwt.sign({
                userId: user._id,
                email: user.email,
                role: user.role,
                rememberMe: user.rememberMe
              },
              'RANDOM_TOKEN_SECRET' ,{
                expiresIn: '24h' 
              }
            )
          });
        })
        .catch(error => res.status(500).json({
          error
        }));
    })
    .catch(error => res.status(500).json({
      error
    }));
};

exports.test = (req, res, next) => {
  const stuff = [
    {
      _id: 'oeihfzeoi',
      title: 'Mon premier objet',
      description: 'Les infos de mon premier objet',
      imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
      price: 4900,
      userId: 'qsomihvqios',
    },
    {
      _id: 'oeihfzeomoihi',
      title: 'Mon deuxième objet',
      description: 'Les infos de mon deuxième objet',
      imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
      price: 2900,
      userId: 'qsomihvqios',
    },
  ];
  res.status(200).json(stuff);
}