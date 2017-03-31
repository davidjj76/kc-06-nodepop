const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/nodepop');

mongoose.connection.on('connected', () => console.log('Connected to DB'));
mongoose.connection.on('error', (err) => {
  console.error('Error connecting DB:', err);
  process.exit(1);
});

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Disconnected from DB');
    process.exit(0);
  });
});
