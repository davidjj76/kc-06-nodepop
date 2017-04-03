const express = require('express');
const createError = require('http-errors');

const Advertisement = require('../../models/Advertisement');
const verifyToken = require('../../lib/jwtAuth').verifyToken;

const router = express.Router();

// JWT Authentication (verify token)
router.use(verifyToken);

/* GET advertisements list */
router.get('/', (req, res, next) => {
  Advertisement.list()
    .then(advertisements => res.json({
      success: true,
      result: advertisements.map(advertisement => Object.assign(advertisement, {
        baseUri: `${req.protocol}://${req.headers.host}`,
      })),
    }))
    .catch(err => next(err));
});

/* GET tags list */
router.get('/tags', (req, res, next) => {
  const requestSort = req.query.sort;
  Advertisement.listTags(requestSort)
    .then(tags => res.json({
      success: true,
      result: tags,
    }))
    .catch(err => next(err));
});

module.exports = router;
