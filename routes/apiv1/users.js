const express = require('express');

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
    .then(user => res.json({
      success: true,
      result: user,
    }))
  .catch(err => next(err));
});

module.exports = router;
