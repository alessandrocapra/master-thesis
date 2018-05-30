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

db.sequelize.sync().then(function() {
  let server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
  });

  // socketIO integration
  let io = require('socket.io').listen(server);

  // storing all connected players
  let players = {};

  let star = {
    x: Math.floor(Math.random() * 700) + 50,
    y: Math.floor(Math.random() * 500) + 50
  };

  let bomb = {
    x: Math.floor(Math.random() * 700) + 50,
    y: Math.floor(Math.random() * 400) + 50
  };

  let scores = {
    blue: 0,
    red: 0
  };

  // listen for a connection request from any client
  io.on('connection', function(socket){
    console.log('a user connected');

    // create a new player and add it to our players object
    players[socket.id] = {
      rotation: 0,
      x: Math.floor(Math.random() * 700) + 50,
      y: Math.floor(Math.random() * 400) + 50,
      playerId: socket.id,
      team: (Math.floor(Math.random() * 2) == 0) ? 'red' : 'blue'
    };

    // send the players object to the new player
    socket.emit('currentPlayers', players);

    // send the star object to the new player
    socket.emit('starLocation', star);
    // send the current scores
    socket.emit('scoreUpdate', scores);

    // update all other players of the new player
    socket.broadcast.emit('newPlayer', players[socket.id]);

    socket.on('disconnect', function () {
      console.log('user disconnected');

      // remove this player from our players object
      delete players[socket.id];
      // emit a message to all players to remove this player
      io.emit('disconnect', socket.id);
    });

    // when a player moves, update the player data
    socket.on('playerMovement', function (movementData) {
      let direction;

      if(players[socket.id].x < movementData.x){
        direction = "right";
      } else if(players[socket.id].x > movementData.x) {
        direction = "left";
      } else {
        direction = "turn";
      }

      players[socket.id].x = movementData.x;
      players[socket.id].y = movementData.y;
      players[socket.id].direction = direction;

      // emit a message to all players about the player that moved
      socket.broadcast.emit('playerMoved', players[socket.id]);
    });

    socket.on('starCollected', function () {
      if (players[socket.id].team === 'red') {
        scores.red += 10;
      } else {
        scores.blue += 10;
      }
      star.x = Math.floor(Math.random() * 700) + 50;
      star.y = Math.floor(Math.random() * 400) + 50;
      io.emit('starLocation', star);
      io.emit('scoreUpdate', scores);

      // spawn a new bomb every 7 stars that have been collected
      if (scores.red + scores.blue > 0 && ((scores.red + scores.blue) % 70 == 0)) {
        bomb.x = Math.floor(Math.random()*(800-0+1)+0);
        // generate the y coordinate betewen 400 and 600
        // bomb.y = Math.floor(Math.random()*(200-0+1)+0);
        bomb.y = 16;

        bomb.velocityX = Math.floor(Math.random()*200) + 1; // this will get a number between 1 and 200
        bomb.velocityX *= Math.floor(Math.random()*2) == 1 ? 1 : -1; // this will add minus sign in 50% of cases
        bomb.velocityY = 20;
        io.emit('bombLocation', bomb);
      }
    });

    socket.on('endGame', function (socketId) {
      io.emit('gameOver', socketId);
    });

    socket.on('sensor', function(value){
      console.log("value received from sensor is " + value.message);
      io.emit('sensor', value);
    });

    socket.on('pressure', function(value){
      console.log("value received from sensor is " + value.pressure);
      io.emit('pressure', value);
    });

    socket.on('renewSocketConnection', function(value){
      console.log("value received from sensor is " + value.pressure);
    });
  });

  exports.server = server;
  exports.io = io;

});

module.exports = app;

