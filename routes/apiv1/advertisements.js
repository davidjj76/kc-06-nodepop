const express = require('express');

const router = express.Router();
const Advertisement = require('../../models/Advertisement');
/* GET advertisements list */
router.get('/', (req, res, next) => {
  Advertisement.find().exec()
    .then(advertisements => res.json({
      success: true,
      result: advertisements,
    }))
    .catch(err => next(err));
});

/* GET tags list */
router.get('/tags', (req, res, next) => {
  const unwind = { $unwind: '$tags' };
  const group = {
    $group: {
      _id: '$tags',
      tag: { $first: '$tags' },
      advertisements: { $sum: 1 },
    },
  };
  const project = {
    $project: {
      _id: 0,
      tag: 1,
      advertisements: 1,
    },
  };
  const requestSort = req.query.sort;
  const sort = { $sort: {} };
  if (requestSort === 'advertisements' || requestSort === '-advertisements') {
    sort.$sort = { advertisements: requestSort.indexOf('-') === 0 ? -1 : 1 };
  }
  sort.$sort.tag = 1;

  Advertisement.aggregate([unwind, group, project, sort]).exec()
    .then(tags => res.json({
      success: true,
      result: tags,
    }))
    .catch(err => next(err));
});

module.exports = router;
