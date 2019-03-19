const jwt = require('jsonwebtoken');

function checkAuth(req, res, next) {
  let decoded;
  try {
    const token = req.headers.authorization.split(' ')[1];

    decoded = jwt.verify(token, 'secret_key');
    req.userId = decoded.userId;
    next(); // if it doesn't fail, carry on!
  } catch (err) {
    console.log(err);
    res.status(401).json({
      message: 'Auth failed'
    });
  }
}

module.exports = checkAuth;