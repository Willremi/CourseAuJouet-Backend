const User = require('../models/user');
const Role = require('../models/role');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const confirmationCode = require('../middlewares/generateRandomCode');

const {
  sendConfirmationEmail,
  sendConfirmationResetPassword
} = require('../middlewares/nodemailer.config');

exports.register = (req, res, next) => {

  const token = jwt.sign({
    email: req.body.email
  }, confirmationCode.generateRandomCode(25), {
    expiresIn: '24h'
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
        reset_password: token
      });

      user.save()
        .then(() => {

          res.status(201).json({
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

  User.findOneAndUpdate({
      confirmationCode: req.params.confirmationCode
    }, {
      account_status: true,
      role: [{
        role_name: "CUSTOMER"
      }]
    })
    .then(() => {
      res.status(200).json({
        message: "Veuillez vous logger"
      })
    })
    .catch(error => res.status(500).json({
      error
    }))
}

exports.login = (req, res, next) => {
  const token = confirmationCode.generateRandomCode(25) // a mettre lorsque l'on saura comment le mettre dans auth.js
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
              'RANDOM_TOKEN_SECRET', {
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

exports.sendEmailResetPassword = (req, res, next) => {

  const token = jwt.sign({
    email: req.body.email
  }, confirmationCode.generateRandomCode(25), {
    expiresIn: '24h'
  });

  User.findOneAndUpdate({
      email: req.body.email
    }, {
      reset_password: token
    })
    .then((user) => {
      sendConfirmationResetPassword(user.email, token)
      res.status(200).json({
        message: "Un email vous a été envoyé"
      })
    })
    .catch(error => res.status(500).json({
      error
    }))
}

exports.validResetPassword = (req, res, next) => {
  console.log(req.params.id)
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      User.findOneAndUpdate({
          reset_password: req.params.id
        }, {
          password: hash,
          reset_password: hash
        })
        .then((user) => {
          if(!user){
            return res.status(404).json({ message: "Utilisateur inconnu !"})
          }
          res.status(200).json({
            message: "Mot de passe modifié"
          })
        })
        .catch(error => res.status(500).json({
          error
        }))
    })
    .catch(error => res.status(500).json({
      error
    }))

}