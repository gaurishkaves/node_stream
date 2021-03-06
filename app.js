var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');
var videosRouter = require('./routes/videos');
var fileUploadRouter = require('./routes/fileupload');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
//app.use(fileUpload());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true, limit: '2000mb' }));
app.use(bodyParser.json({ limit: '2000mb' }));

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

app.use('/', indexRouter);
app.use('/videos', videosRouter);
app.use('/files', fileUploadRouter);

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
