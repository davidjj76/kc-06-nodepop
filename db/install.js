const path = require('path');
const fs = require('fs');

require('./connection');
const Advertisement = require('../models/Advertisement');
const User = require('../models/User');

function bufferToJson(buffer) {
  return new Promise((resolve, reject) => {
    try {
      resolve(JSON.parse(buffer.toString()));
    } catch (err) {
      reject(err);
    }
  });
}

function readFilePromise(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    });
  });
}

Promise.all([
  Advertisement.delete(),
  User.delete(),
]).then(() => readFilePromise(path.join(__dirname, 'install.json')))
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
