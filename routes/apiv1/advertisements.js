const express = require('express');
const createError = require('http-errors');

const Advertisement = require('../../models/Advertisement');
const { verifyToken } = require('../../lib/jwtAuth');

const router = express.Router();

// JWT Authentication (verify token)
router.use(verifyToken);

/* GET advertisements list */
router.get('/', (req, res, next) => {
  const tags = req.query.tags || '';
  const forSale = req.query.forSale || null;
  const name = req.query.name || '';
  const price = req.query.price || '';
  const skip = parseInt(req.query.skip, 10);
  const limit = parseInt(req.query.limit, 10);

  const filter = {};

  // Tags filter (at least match one tag from query)
  if (tags) filter.tags = { $in: tags.split(',') };

  // For Sale filter (accepts true or false)
  if (forSale !== null) {
    if (forSale === 'true') filter.forSale = true;
    if (forSale === 'false') filter.forSale = false;
  }

  // Name filter (name starts with, no case sensitive)
  if (name) filter.name = new RegExp(`^${name}`, 'i');

  // Price filter (price between min and max)
  const priceLimits = price.split('-');
  if (priceLimits.length === 1) {
    if (priceLimits[0] !== '') { filter.price = priceLimits[0]; }
  } else {
    filter.price = {};
    if (priceLimits[0] !== '') { filter.price.$gte = priceLimits[0]; }
    if (priceLimits[1] !== '') { filter.price.$lte = priceLimits[1]; }
  }

  // Query sorting
  const sort = req.query.sort;

  // TODO: implement includeTotal

  Advertisement.list(filter, skip, limit, sort)
    .then(advertisements => res.json({
      success: true,
      result: advertisements.map(advertisement => Object.assign(advertisement, {
        baseUri: `${req.protocol}://${req.headers.host}`,
      })),
    }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new createError.BadRequest(res.messages.CAST_ERROR));
      }
      return next(err);
    });
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
