const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const createError = require('http-errors');
const HTTPStatus = require('http-status');

const isApi = require('./lib/utils').isApi;
const messages = require('./lib/messages');

const index = require('./routes/index');
const advertisementsAPI = require('./routes/apiv1/advertisements');
const usersAPI = require('./routes/apiv1/users');

const app = express();

require('./db/connection');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(messages);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/apiv1/advertisements', advertisementsAPI);
app.use('/apiv1/users', usersAPI);

// catch 404 and forward to error handler
app.use((req, res, next) => next(createError(HTTPStatus.NOT_FOUND, res.messages.NOT_FOUND)));

// error handler
app.use((err, req, res, next) => {
  res.status(err.status || HTTPStatus.INTERNAL_SERVER_ERROR);
  if (isApi(req)) {
    // API - return json
    return res.json({
      success: false,
      error: err.message,
    });
  }
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  return res.render('error');
});

module.exports = app;
