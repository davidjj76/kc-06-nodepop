const mongoose = require('mongoose');

const connection = mongoose.connection;
mongoose.Promise = global.Promise;

connection.once('open', () => {
  console.log(`Process ${process.pid} connected to DB`);
});

connection.on('error', (err) => {
  console.error(`Process ${process.pid} get an error connecting DB:`, err);
  process.exit(1);
});

process.on('SIGINT', () => {
  connection.close(() => {
    console.log(`Process ${process.pid} disconnected from DB`);
    process.exit(0);
  });
});

mongoose.connect('mongodb://localhost/nodepop');
