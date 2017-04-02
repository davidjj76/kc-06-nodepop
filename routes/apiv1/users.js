const express = require('express');
const jwt = require('jsonwebtoken');
const MongoErrors = require('mongo-errors');
const createError = require('http-errors');
const HTTPStatus = require('http-status');

const router = express.Router();
const User = require('../../models/User');

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
        return next(createError(HTTPStatus.CONFLICT, 'Email already exists.'));
      }
      return next(createError(HTTPStatus.UNPROCESSABLE_ENTITY, 'Invalid data.'));
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
      // Valid credentials, create token
      return new Promise((resolve, reject) => {
        const payload = { user_id: foundUser._id };
        const secretKey = 'thisismysecret';
        const options = { expiresIn: '2d' };
        jwt.sign(payload, secretKey, options, (err, token) => {
          if (err) {
            return reject(err);
          }
          return resolve(token);
        });
      });
    })
    .then(token => res.json({
      success: true,
      message: 'Enjoy your token!',
      token,
    }))
    .catch(err => next(err));
});

module.exports = router;
