require('./config');
const Advertisement = require('../models/advertisement');

const advertisements = require('./advertisements.json');

Advertisement.remove().exec()
  .then(() => {
    console.log('Advertisements removed!!!');
    return Advertisement.insertMany(advertisements);
  })
  .then(() => console.log('Advertisements inserted!!!'))
  .catch(err => console.error(err));
