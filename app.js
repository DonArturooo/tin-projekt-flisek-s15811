var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
const roomRouter = require('./routes/roomRouter');
const clientRouter = require('./routes/clientRouter');
const reservationRouter = require('./routes/reservationRouter');
const roomApiRouter = require('./routes/api/RoomApiRouter');
const clientApiRouter = require('./routes/api/ClientApiRouter');
const reservationApiRouter = require('./routes/api/ReservationApiRouter');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
const session = require('express-session');
app.use(session({
    secret: 'my_secret_password',
    resave: false
}));

app.use((req, res, next) => {
  const loggedUser = req.session.loggedUser;
  res.locals.loggedUser = loggedUser;
  if(!res.locals.loginError) {
      res.locals.loginError = undefined;
  }
  next();
});

app.use('/', indexRouter);
app.use('/rooms', roomRouter);
app.use('/clients', clientRouter);
app.use('/reservation', reservationRouter);
app.use('/api/rooms', roomApiRouter);
app.use('/api/clients', clientApiRouter);
app.use('/api/reservation', reservationApiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
