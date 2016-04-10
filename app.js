/**
 * Module dependencies.
 */

var express = require('express'),
  routes = require('./routes'),
  path = require('path'),
  fs = require('fs');


var app = express();


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
//app.use(express.bodyParser());
app.use(express.bodyParser({
  uploadDir: './tmp'
}));
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

var server = require('http').createServer(app);
var io = require('socket.io')(server);
io.on('connection', function(socket) {
  socket.on('msg', function(data) {
    io.emit('msg', data);
  });
});
server.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
