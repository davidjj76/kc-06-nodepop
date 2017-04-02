const express = require('express');
const MongoErrors = require('mongo-errors');
const createError = require('http-errors');
const HTTPStatus = require('http-status');

const User = require('../../models/User');
const jwtAuth = require('../../lib/jwtAuth');
const m = require('../../lib/errorMessages');

const router = express.Router();

/* GET users list. */
router.get('/', jwtAuth.verifyToken, (req, res, next) => {
  User.list()
    .then(users => res.json({
      success: true,
      result: users,
    }))
    .catch(err => next(err));
});

/* POST users (register). */
router.post('/', (req, res, next) => {
  const newUser = new User(req.body);
  newUser.register()
    .then(user => res.status(HTTPStatus.CREATED).json({
      success: true,
      result: user,
    }))
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === MongoErrors.DuplicateKey) {
        // duplicate key (email)
        return next(new createError.Conflict(m[req.language].EMAIL_ALREADY_EXISTS));
      }
      return next(new createError.UnprocessableEntity(m[req.language].INVALID_DATA));
    });
});

/* POST users (authenticate). */
router.post('/authenticate', (req, res, next) => {
  // get credentials
  const email = req.body.email || '';
  const password = req.body.password || '';
  // Find user by email
  User.findByEmail(email)
    .then((user) => {
      if (!user) {
        throw new createError.Unauthorized(m[req.language].INVALID_CREDENTIALS);
      }
      return user.comparePassword(password);
    })
    .then((user) => {
      if (!user) {
        throw new createError.Unauthorized(m[req.language].INVALID_CREDENTIALS);
      }
      return jwtAuth.createToken(user._id);
    })
    .then(token => res.status(HTTPStatus.CREATED).json({
      success: true,
      result: { token },
    }))
    .catch(err => next(err));
});

module.exports = router;
