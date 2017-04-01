const express = require('express');
const bcrypt = require('bcrypt');
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
  bcrypt.hash(newUser.password, 10)
    .then((hash) => {
      newUser.password = hash;
      return newUser.register();
    })
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

module.exports = router;
