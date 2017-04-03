module.exports = {
  database: { uri: 'mongodb://localhost:27017/nodepop' },
  jwt: {
    secretKey: 'thisismysecret',
    expiresIn: '2d',
  },
  languages: [
    'en',
    'es',
  ],
};
