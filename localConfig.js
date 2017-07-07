module.exports = {
  database: { uri: process.env.DATABASE_URI || 'mongodb://localhost:27017/nodepop' },
  jwt: {
    secretKey: process.env.JWT_SECRET_KEY || 'thisismysecret',
    expiresIn: '2d',
  },
  languages: [
    'en',
    'es',
  ],
};
