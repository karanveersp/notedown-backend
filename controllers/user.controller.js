const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

const userController = {
  /**
   * POST /signup handler.
   * Expects: { email: ..., password: ...} in req
   * Sends: { message: 'User created', tkoen: ..., userId: ..., expiresIn: ...} in res
   */
  signUp: (req, res) => {
    const userData = { 
      email: req.body.email,
      password: req.body.password
    };
    const user = new User(userData);
    user.save()
      .then(result => {
        // If we got here, the user is authenticated!
        const token = jwt.sign({ email: userData.email, userId: result._id }, 'secret_key', { expiresIn: '1h' });
        res.status(201).json({
          message: 'User created',
          token: token,
          userId: result._id,
          expiresIn: 3600
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  },

  /**
   * POST /login handler
   * Expects: { email: ..., password: ... } body in req.
   * Sends: { token: ..., userId: ..., expiresIn: ...} in res.
   */
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
            const token = jwt.sign({ email: foundUser.email, userId: foundUser._id }, 'secret_key', { expiresIn: '1h' });
            res.status(200).json({
              token: token,
              userId: foundUser._id,
              expiresIn: 3600
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