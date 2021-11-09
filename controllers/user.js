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
  User.findOne({
    confirmationCode: req.params.confirmationCode,
  })
    .then((user) => {
      
      if (!user) {
        return res.status(404).send({ message: "Utilisateur non trouvé !." });
      }
      user.confirmationCode = null;
      user.account_status = true;
      Role.findOne({role_name: "CUSTOMER"})
      .then((role) => {
        if(!role) {
          return res.statut(404).send({ message : "Rôle introuvable !"})
        }
        user.role = [{
          _id: role._id,
          role_name: role.role_name
      }] 
      return res.status(200).send({ message : "Veuillez vous logger" })
      })
      .catch(err => res.status(500).send({ err }))
      
      user.save((err) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
      });
    })
    .catch((e) => console.log("error", e));
};

exports.login = (req, res, next) => {
  console.log(req.body)
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
              confirmationCode.generateRandomCode(25), {
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