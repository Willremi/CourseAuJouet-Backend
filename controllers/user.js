const User = require('../models/user');
const Role = require('../models/role');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const confirmationCode = require('../middlewares/generateRandomCode');

const {
  sendConfirmationEmail, sendConfirmationResetPassword
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
        reset_password: "1234"
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
  
  User.findOne({
      confirmationCode: req.params.confirmationCode,
    })
    .then((user) => {
      console.log(user)
      if (!user) {
        return res.status(404).send({
          message: "Utilisateur non trouvé !."
        });
      }
      user.confirmationCode = null;
      user.account_status = true;
      Role.findOne({
          role_name: "CUSTOMER"
        })
        .then((role) => {
          console.log("etape fin :",user)
          if (!role) {
            return res.statut(404).send({
              message: "Rôle introuvable !"
            })
          }
          user.role = [{
            _id: role._id,
            role_name: role.role_name
          }]
          return res.status(200).send({
            message: "Veuillez vous logger"
          })
        })
        .catch(err => res.status(500).send({
          err
        }))

      user.save()
      .then((res) => console.log("OK"))
      .catch((err) => console.log(err));
       })
    .catch((err) => console.log("error", err));
};

exports.login = (req, res, next) => {
  
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

exports.sendEmailResetPassword = (req, res, next) => {
  
  const token = jwt.sign({
    email: req.body.email
  }, confirmationCode.generateRandomCode(25), {
    expiresIn: '24h'
  });
  User.findOne({
      email: req.body.email
    })
    .then((user) => {
      
      if (!user) {
        return res.status(401).json({
          error: 'Utilisateur non trouvé !'
        });
      }
      user.reset_password = token
      
      user.save()
        .then(() => {

          res.status(201).send({
            message: "Un E-mail de réinitialisation de mot de passe vous a été envoyé, vérifiez vos emails"
          })
          sendConfirmationResetPassword( user.email, user.reset_password)
        })
        .catch(error => res.status(400).json({
          error
        }));
      
    })
    .catch((err) => {
      res.status(500).json({
        err
      })

    })
}