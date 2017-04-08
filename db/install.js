const path = require('path');
const { readFile, bufferToJson } = require('../lib/utils').promises;

require('./connection');
const Advertisement = require('../models/Advertisement');
const User = require('../models/User');

Promise.all([
  Advertisement.delete(),
  User.delete(),
]).then(() => readFile(path.join(__dirname, 'install.json')))
  .then(bufferToJson)
  .then(json => Promise.all([
    User.insert(json.users),
    Advertisement.insert(json.advertisements),
  ]))
  .then((data) => {
    console.log('Installed DB');
    console.log('Users:', data[0].map(item => item.name));
    console.log('Advertisements:', data[1].map(item => item.name));
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error installing DB:', err);
    process.exit(1);
  });
