const jsonwebtoken = require('jsonwebtoken');
const createError = require('http-errors');

const jwtConfig = require('../localConfig').jwt;

module.exports = {
  // Create token (return promise)
  createToken(userId) {
    return new Promise((resolve, reject) => {
      const payload = { userId };
      const options = { expiresIn: jwtConfig.expiresIn };
      jsonwebtoken.sign(payload, jwtConfig.secretKey, options, (err, token) => {
        if (err) {
          return reject(err);
        }
        return resolve(token);
      });
    });
  },
  // Authentication middleware (verifyToken)
  verifyToken(req, res, next) {
    // get token
    const token = req.body.token || req.query.token || req.get('x-access-token');
    if (!token) {
      return next(new createError.Unauthorized('No token provided.'));
    }
    // verify token
    jsonwebtoken.verify(token, jwtConfig.secretKey, (err, decoded) => {
      console.log(err);
      if (err && err.name === 'TokenExpiredError') {
        return next(new createError.Unauthorized('Token expired.'));
      }
      if (err) {
        return next(new createError.Unauthorized('Invalid token.'));
      }
      // attach userId to request object for use in future middlewares
      req.userId = decoded.userId;
      next();
    });
  },
};
