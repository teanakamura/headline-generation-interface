var http = require('http');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var log4js = require('log4js');

var indexRouter = require('./routes/index');
var articlesRouter = require('./routes/articles');
var loggerRouter = require('./routes/logger');

var app = express();

// output system logs by log4js
log4js.configure('./server/log4js.config.json');
app.use(log4js.connectLogger(log4js.getLogger()));

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
app.use('/api/articles/', articlesRouter)
app.use('/api/logger/', loggerRouter)
app.use('/api/index/', indexRouter);
app.use(express.static(path.join(__dirname, '../dist/my-app')));
app.use('/*', express.static(path.join(__dirname, '../dist/my-app/index.html')));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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

var server = http.createServer(app)
server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'))
})

module.exports = app;
