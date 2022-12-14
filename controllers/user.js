const User = require('../models/user');
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
        email: req.body.email.toLowerCase(),
        password: hash,
        registration_date: Date.now(),
        account_status: false,
        rememberMe: false,
        confirmationCode: token,
        reset_password: token
      });
      
      user.save()
        .then((user) => {
          res.status(201).json({
            message: "Votre inscription a bien été prise en compte, veuillez verifier vos e-mail afin de finaliser votre inscription !"
          })
          sendConfirmationEmail(user.firstname, user.email.toLowerCase(), user.confirmationCode)
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
    res.status(200).json({ message : "Merci de vous êtes inscrit sur notre site, vous pouvez à présent vous connecter a votre compte"})
  })
  .catch( () => res.status(500).json({ message:"Votre code de confirmation est expiré" }))
}



exports.login = (req, res, next) => {
  
  const remember = req.body.rememberMe
  User.findOne({email: req.body.email})
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: 'Utilisateur non trouvé !'
        });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({
              message: 'Mot de passe incorrect !'
            });
          }
          
          res.status(200).json({

            id_token: jwt.sign({
              userId: user._id,
              civility: user.civility,
              firstname: user.firstname,
              lastname: user.lastname,
              birthday_date: user.birthday_date,
              phone: user.phone,
              email: user.email,
              role: user.role,
              rememberMe: remember
            },
              'RANDOM_TOKEN_SECRET', {
              expiresIn: `${remember ? '30d' : '1h'}`
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
    email: req.body.email.toLowerCase()
  }, confirmationCode.generateRandomCode(25), {
    expiresIn: '24h'
  });

  User.findOneAndUpdate({
      email: req.body.email.toLowerCase()
    }, {
      reset_password: token
    })
    .then((user) => {
      sendConfirmationResetPassword(user.email.toLowerCase(), token)
      res.status(200).json({
        message: "Un email vous a été envoyé"
      })
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({
      message: "Une erreur s'est produite, si le problème persite contactez l'administrateur du site"
    })})
}

exports.validResetPassword = (req, res, next) => {
  
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

exports.editProfil = (req, res, next) => {

  // mettre à jour les infos user

  const { civility, firstName, lastName, birthday_date, phone, email } = req.body;
  
  User.findOneAndUpdate({ _id: req.params.id }, {
    civility: civility,
    firstname: firstName,
    lastname: lastName,
    birthday_date: birthday_date,
    phone: phone,
    email: email.toLowerCase(),
  },

  ).then(() => {
    res.status(201).json({ message: "votre modification a bien été prise en compte" })
  }).catch(error => {
    if (error.codeName === 'DuplicateKey') {
      res.status(400).json({
        message: "Un utilisateur avec cet adresse électronique s'est déjà inscrit. Veuillez utiliser un autre email..."
      })
    } else {
      res.status(500).json({
        message: "Une erreur est survenu, si le problème persiste. Contactez l'administrateur du site"
      })

    }
  });

}

exports.getOneUser = (req, res, next) => {
  User.findOne({ _id: req.params.id})
  .then((user) => {
    if(!user){
      res.status(404).json({ message : "Utilisateur non connecté/inscrit"})
    }
    else {
      res.status(200).json({ user })
    }
  })
  .catch(() => res.status(500).json({ message : "une erreur est survenue"}))
}
exports.googleAuth = (req, res) => {
  
  const token = jwt.sign({
    email: req.body.email.toLowerCase()
  }, confirmationCode.generateRandomCode(25), {
    expiresIn: '24h'
  });


  User.findOne({email: req.body.email})
    .then( (user) => {
      if (user){
        return res.status(200).json({

          id_token: jwt.sign({
              userId: user._id,
              email: user.email,
              role: user.role,
            },'RANDOM_TOKEN_SECRET',
            {expiresIn: '1h'}
            )
        })
      } else {
        const user = new User({
          civility: "Man",
          firstname: req.body.givenName,
          lastname: req.body.familyName,
          email: req.body.email,
          registration_date: Date.now(),  
          account_status: true,
          googleId: req.body.googleId,
          confirmationCode: token,
          reset_password: token,
          role: [{role_name: "CUSTOMER"}]
          })
          user.save()
          .then(user => {
            res.status(200).json({
              id_token: jwt.sign({
                userId: user._id,
                email: user.email,
                role: user.role,
              },'RANDOM_TOKEN_SECRET',
              {expiresIn: '1h'}
              )
            })
          })
          .catch(error => res.status(400).json({message: error}))
      }
    }).catch(error => res.status(404).json({message: error}))
}

exports.facebookAuth = (req, res) =>{

  const token = jwt.sign({
    email: req.body.email.toLowerCase()
  }, confirmationCode.generateRandomCode(25), {
    expiresIn: '24h'
  });

  console.log(req.body);
  User.findOne({email: req.body.email})
    .then( user => {
      if (user){
        return res.status(200).json({

          id_token: jwt.sign({
              userId: user._id,
              email: user.email,
              role: user.role,
            },'RANDOM_TOKEN_SECRET',
            {expiresIn: '1h'}
            )
        })
      } else {
        const [firstname,lastname] = req.body.name?.split(' ')
        const user = new User({
          civility: "Man",
          firstname: firstname,
          lastname: lastname,
          email: req.body.email,
          registration_date: Date.now(),
          account_status: true,
          confirmationCode: token,
          reset_password: token,
          facebookId: req.body.facebookId,
          role: [{role_name: "CUSTOMER"}]
          })
          user.save()
          .then(user => {
            res.status(200).json({
              id_token: jwt.sign({
                userId: user._id,
                email: user.email,
                role: user.role,
              },'RANDOM_TOKEN_SECRET',
              {expiresIn: '1h'}
              )
            })
          })
          .catch(error => res.status(400).json({message: error}))
      }
    })
    .catch(error => res.status(400).json({message: error}))

}
exports.editProfil = (req, res, next) => {

  // mettre à jour les infos user

  const { civility, firstName, lastName, birthday_date, phone, email } = req.body;
  
  User.findOneAndUpdate({ _id: req.params.id }, {
    civility: civility,
    firstname: firstName,
    lastname: lastName,
    birthday_date: birthday_date,
    phone: phone,
    email: email.toLowerCase(),
  },

  ).then(() => {
    res.status(201).json({ message: "votre modification a bien été prise en compte" })
  }).catch(error => {
    if (error.codeName === 'DuplicateKey') {
      res.status(400).json({
        message: "Un utilisateur avec cet adresse électronique s'est déjà inscrit. Veuillez utiliser un autre email..."
      })
    } else {
      res.status(500).json({
        message: "Une erreur est survenu, si le problème persiste. Contactez l'administrateur du site"
      })

    }
  });
}

exports.changePassword = async (req, res) =>  {
  //req.body est un tableau: [0] = userId et [1] = form de changement de MDP
  const newPassword = await bcrypt.hash(req.body[1].password, 10);
  User.findById( req.body[0] )
  .then( user => {
    if(!user){
      return res.status(401).json({message: 'utilisateur non trouvé'})
    }
    bcrypt.compare(req.body[1].oldPassword,user.password)
    .then(valid => {
      if (!valid) {
        return res.status(401).json({message: "Le mot de passe est incorrect"})
      } else {
        User.findByIdAndUpdate(req.body[0], {
          password: newPassword
        })
        .then(res.status(200).json({message: "Le mot de passe mis à jour"}))                   
      }
    }).catch(error => res.status(400).json({message: error}))
  }).catch(error => res.status(400).json({message: error}))
}
