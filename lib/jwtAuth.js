const jwt = require('jsonwebtoken');
const createError = require('http-errors');

const User = require('../models/User');

const { secretKey, expiresIn } = require('../localConfig').jwt;

module.exports = {
  // Create token (return promise)
  createToken(userId) {
    return new Promise((resolve, reject) => {
      const payload = { userId };
      const options = { expiresIn };
      jwt.sign(payload, secretKey, options, (err, token) => {
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
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return next(new createError.Unauthorized(res.messages.TOKEN_EXPIRED));
        }
        return next(new createError.Unauthorized(res.messages.INVALID_TOKEN));
      }
      // checks if user exits
      User.findById(decoded.userId)
        .then((user) => {
          if (!user) {
            return next(new createError.Unauthorized(res.messages.INVALID_CREDENTIALS));
          }
          // attach userId to request object for use in future middlewares
          req.userId = decoded.userId;
          return next();
        })
        // eslint-disable-next-line no-shadow
        .catch(err => next(err));
    });
  },
};
