const jwt = require('jsonwebtoken');

function checkAuth(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];

    jwt.verify(token, 'secret_key');

    next(); // if it doesn't fail, carry on!
  } catch (err) {
    console.log(error);
    res.status(401).json({
      message: 'Auth failed'
    });
  }
}

module.exports = checkAuth;