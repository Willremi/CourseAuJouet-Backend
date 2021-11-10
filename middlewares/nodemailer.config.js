const nodemailer = require("nodemailer");
const config = require("../middlewares/mailer.config");

const user = config.user;
const pass = config.pass;

const transport = nodemailer.createTransport({
  service: "Hotmail",
  auth: {
    user: user,
    pass: pass,
  },
});

module.exports.sendConfirmationEmail = (name, email, confirmationCode) => {
    
    transport.sendMail({
      from: user,
      to: email,
      subject: "Please confirm your account",
      html: `<h1>Email Confirmation</h1>
          <h2>Hello ${name}</h2>
          <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
          <a href=http://localhost:3000/confirm/${confirmationCode}> Click here</a>
          </div>`,
    }).catch(err => console.log(err));
  };

  module.exports.sendConfirmationResetPassword = ( email, token) => {
    
    transport.sendMail({
      from: user,
      to: email,
      subject: "Password reset",
      html: `<h1>Password reset</h1>
          <h2>Hello</h2>
          <p>You have requested a password reset. Please click on the following link to be redirected to change your password.</p>
          <a href=http://localhost:3000/resetpassword/${token}> Click here</a>
          </div>`,
    }).catch(err => console.log(err));
  };