const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/nodepop');

mongoose.connection.on('connected', () => {
  console.log(`Process ${process.pid} connected to DB`);
});
mongoose.connection.on('error', (err) => {
  console.error(`Process ${process.pid} get an error connecting DB:`, err);
  process.exit(1);
});

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log(`Process ${process.pid} disconnected from DB`);
    process.exit(0);
  });
});
