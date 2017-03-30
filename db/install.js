const path = require('path');
const readFile = require('fs-readfile-promise');

require('./config');
const Advertisement = require('../models/Advertisement');
const User = require('../models/User');

readFile(path.join(__dirname, 'install.json'))
  .then((buffer) => {
    const installJSON = JSON.parse(buffer.toString());
    // Advertisements
    Advertisement.remove().exec()
      .then(Advertisement.insertMany(installJSON.advertisements))
      .then(response => console.log('Install advertisements:', response.result))
      .catch(err => console.error(err));
    // Users
    User.remove().exec()
      .then(User.insertMany(installJSON.users))
      .then(response => console.log('Install users:', response.result))
      .catch(err => console.error(err));
  })
  .catch(err => console.error(err));
