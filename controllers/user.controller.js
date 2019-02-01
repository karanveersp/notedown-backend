const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

const userController = {
  signUp: (req, res) => {
    const userData = { 
      email: req.body.email,
      password: req.body.password
    };
    const user = new User(userData);
    user.save()
      .then(result => {
        res.status(201).json({
          message: 'User created',
          result: result
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  },

  login: (req, res) => {
    const userData = {
      email: req.body.email,
      password: req.body.password
    };
    User.findOne({ email: userData.email })
      .then(foundUser => {
        if (!foundUser) {
          res.status(401).json({
            message: 'User not found'
          });
        }
        foundUser.comparePassword(userData.password)
          .then(isMatch => {
            if (!isMatch) {
              res.status(401).json({
                message: `Passwords don't match`
              });
            }
            // If we got here, the user is authenticated!
            const token = jwt.sign({ email: foundUser.email, userId: foundUser._id }, 'secret_key', { expiresIn: '1d' });
            res.status(200).json({
              token: token,
              userId: foundUser._id,
              expiresIn: 86400
            });
          })
          .catch(err => {
            res.status(401).json({
              message: 'Comparison error'
            });
          });
      })
      .catch(err => {
        res.status(401).json({
          message: 'Find error'
        });
      });
  }
}

module.exports = userController;