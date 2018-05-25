const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs  = require('express-handlebars');
const app = express();

const routes = require('./routes/index');
const users = require('./routes/user');
const sensor = require('./routes/sensor');

const db = require('./models');

const env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';

// view engine setup

app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  partialsDir: ['views/partials/']
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

// app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/sensor', sensor);

/// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            title: 'error'
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
    });
});

app.set('port', process.env.PORT || 3000);

//this is where we will store all the players in the client,
// which is connected to the server
var player_lst = [];

// A player “class”, which will be stored inside player list
var Player = function (startX, startY) {
  var x = startX;
  var y = startY;
};

//onNewplayer function is called whenever a server gets a message “new_player” from the client
function onNewPlayer (data, socketId) {
  //form a new player object
  var newPlayer = new Player(data.x, data.y);
  console.log("created new player with id " + socketId);

  player_lst.push(newPlayer);
  console.log("Updated list of players: ", player_lst);
}

db.sequelize.sync().then(function() {
  var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
  });

  // socketIO integration
  var io = require('socket.io').listen(server);

  // listen for a connection request from any client
  io.on('connection', function(socket){
    console.log('a user connected');
    //output a unique socket.id
    console.log("Unique socket id: " + socket.id);

    socket.on('disconnect', function(){
      console.log('user disconnected');
    });

    socket.on('sensor', function(value){
      console.log("value received from sensor is " + value.message);
      io.emit('sensor', value);
    });

    socket.on('pressure', function(value){
      console.log("value received from sensor is " + value.pressure);
      io.emit('pressure', value);
    });

    //Listen to the message “new_player’ from the client
    socket.on("new_player", function(data){
      console.log("new_player message received");
      onNewPlayer(data, socket.id);
    });

    socket.on('renewSocketConnection', function(value){
      console.log("value received from sensor is " + value.pressure);
    });
  });

  exports.server = server;
  exports.io = io;

});

module.exports = app;
