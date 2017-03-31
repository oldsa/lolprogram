var express = require('express');
var path = require('path');
var logger = require('morgan');
var routes = require('./routes/index');
var app = express();

app.use(logger('dev'));
app.use('/', routes);
app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'));

module.exports = app;