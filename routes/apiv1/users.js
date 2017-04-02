const express = require('express');
const MongoErrors = require('mongo-errors');
const createError = require('http-errors');
const HTTPStatus = require('http-status');

const User = require('../../models/User');
const createToken = require('../../lib/jwt').createToken;

const router = express.Router();

/* GET users list. */
router.get('/', (req, res, next) => {
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
        return next(new createError.Conflict('Email already exists.'));
      }
      return next(new createError.UnprocessableEntity('Invalid data.'));
    });
});

/* POST users (authenticate). */
router.post('/authenticate', (req, res, next) => {
  let foundUser;
  // get credentials
  const email = req.body.email;
  const password = req.body.password;
  // Find user by email
  User.findByEmail(email)
    .then((user) => {
      if (!user) {
        throw new createError.Unauthorized('Invalid credentials.');
      }
      foundUser = user;
      return user.comparePassword(password);
    })
    .then((isMatch) => {
      if (!isMatch) {
        throw new createError.Unauthorized('Invalid credentials.');
      }
      return createToken(foundUser._id);
    })
    .then(token => res.json({
      success: true,
      message: 'Enjoy your token!',
      token,
    }))
    .catch(err => next(err));
});

module.exports = router;
