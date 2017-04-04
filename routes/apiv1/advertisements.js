const express = require('express');

const Advertisement = require('../../models/Advertisement');
const verifyToken = require('../../lib/jwtAuth').verifyToken;

const router = express.Router();

// JWT Authentication (verify token)
router.use(verifyToken);

/* GET advertisements list */
router.get('/', (req, res, next) => {
  const tags = req.query.tags || '';
  const forSale = req.query.forSale || null;
  const name = req.query.name || '';
  const price = req.query.price || '';

  const filter = {};
  if (tags) filter.tags = { $in: tags.split(',') };
  if (forSale !== null) {
    if (forSale === 'true') filter.forSale = true;
    if (forSale === 'false') filter.forSale = false;
  }
  if (name) filter.name = new RegExp(`^${name}`, 'i');
  if (price) filter.price = price;
  console.log(filter);

  Advertisement.list(filter, 0, 0, 'sort')
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
