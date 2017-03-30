const express = require('express');

const router = express.Router();
const User = require('../../models/User');

/* GET users list. */
router.get('/', (req, res, next) => {
  User.find().exec()
    .then(users => res.json({
      success: true,
      result: users,
    }))
    .catch(err => next(err));
});

module.exports = router;
