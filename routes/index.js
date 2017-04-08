const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => res.render('index', {
  title: 'Nodepop',
  apiServer: `${req.protocol}://${req.headers.host}/apiv1`,
  docsServer: `${req.protocol}://localhost:3001`,
}));

module.exports = router;
