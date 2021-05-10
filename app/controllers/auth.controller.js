const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const { body,validationResult } = require('express-validator/check');

exports.validate = (method) => {
    switch (method) {
        case 'signup': {
            return [ 
                body('username', 'Username is required').notEmpty(),
                body('email', 'Email is required').notEmpty(),
                body('email', 'Email is not correct').isEmail(),
                body('password', 'Password is required').notEmpty()                
            ]   
        }

        case 'signin': {
          return [ 
              body('email', 'Email is required').notEmpty(),
              body('email', 'Email is not correct').isEmail(),
              body('password', 'Password is required').notEmpty()                
          ]   
      }
    }
}

exports.signup = (req, res) => {

  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
  }

  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  });

  user.save(err => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    res.send({ message: "User was registered successfully!" });
  });
};

exports.signin = (req, res) => {

  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
  }

  User.findOne({
    email: req.body.email
  })
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        accessToken: token
      });
    });
};
