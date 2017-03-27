const path = require('path');
const readFile = require('fs-readfile-promise');

require('./config');
const Advertisement = require('../models/advertisement');

Advertisement.remove().exec()
  .then(() => readFile(path.join(__dirname, 'advertisements.json')))
  .then(buffer => Advertisement.insertMany(JSON.parse(buffer.toString())))
  .then(() => Advertisement.find().exec())
  .then(advertisements => console.log(advertisements))
  .catch(err => console.error(err));
