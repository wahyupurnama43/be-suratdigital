const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../configs/env');

module.exports = function (req, res, next) {
  if ('authorization' in req.headers || 'Authorization' in req.headers) {
    try {
      const [_, accessToken] = (
        'authorization' in req.headers ? req.headers['authorization'] : req.headers['Authorization']
      ).split(' ');

      jwt.verify(accessToken, jwtSecret);

      return res.status(403).send({
        error: [{ code: 403, message: "You're already been authorized" }],
        message: "You're already been authorized",
        success: false,
      });
    } catch (err) {
      if (err.message != 'jwt expired') {
        return res.send({
          error: [{ code: 500, message: err.message }],
          message: err.message,
          success: false,
        });
      }
    }
  }

  return next();
};
