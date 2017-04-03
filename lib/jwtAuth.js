const jwt = require('jsonwebtoken');
const createError = require('http-errors');

const jwtConfig = require('../localConfig').jwt;

module.exports = {
  // Create token (return promise)
  createToken(userId) {
    return new Promise((resolve, reject) => {
      const payload = { userId };
      const options = { expiresIn: jwtConfig.expiresIn };
      jwt.sign(payload, jwtConfig.secretKey, options, (err, token) => {
        if (err) {
          return reject(err);
        }
        return resolve(token);
      });
    });
  },
  // Authentication middleware (verify Token)
  verifyToken(req, res, next) {
    // get token
    const token = req.body.token || req.query.token || req.get('x-access-token');
    if (!token) {
      return next(new createError.Unauthorized(res.messages.NO_TOKEN_PROVIDED));
    }
    // verify token
    jwt.verify(token, jwtConfig.secretKey, (err, decoded) => {
      if (err && err.name === 'TokenExpiredError') {
        return next(new createError.Unauthorized(res.messages.TOKEN_EXPIRED));
      }
      if (err) {
        return next(new createError.Unauthorized(res.messages.INVALID_TOKEN));
      }
      // attach userId to request object for use in future middlewares
      req.userId = decoded.userId;
      return next();
    });
  },
};
