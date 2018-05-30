var config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 300 }
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var sensorValue;
var pressureText;
var player;
var star;
var platforms;
var bombs;
var gameOver;
var otherPlayers;
var blueScoreText;
var redScoreText;

var game = new Phaser.Game(config);

function preload() {
  this.load.image('sky', 'assets/sky.png');
  this.load.image('ground', 'assets/platform.png');
  this.load.image('star', 'assets/star.png');
  this.load.image('bomb', 'assets/bomb.png');
  this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}

function create() {
  var self = this;
  this.socket = io();
  // this.socket = io.connect(window.location.hostname, { secure: true, reconnect: true, rejectUnauthorized : false } );

  //listen to the “connect” message from the server. The server
  //automatically emit a “connect” message when the cleint connets.When
  //the client connects, call onsocketConnected.
  this.socket.on("connect", function () {
    console.log("client (game) connected to server");

    // receives data from the sensor, but processed by the server. The possible values are: left, right, turn.
    self.socket.on('sensor', function(data){
      console.log('data: ' + data.message);
      sensorValue = data.message;
    });

    // receives the raw pressure number
    self.socket.on('pressure', function(data){
      pressureText.setText('Pressure: ' + data.pressure + 'Pa');
    });
  });

  // array that holds all the external players
  otherPlayers = this.physics.add.group({
    bounceY: 0.2,
    collideWorldBounds: true
  });

  /*
  * Receives an updated list of all the players connected to the game.
  * - if the socketId is the same as the current client, a new player will be create that this user will control
  * - if the socketId is not of the current socket connection, another external player will be created.
  * */
  this.socket.on('currentPlayers', function (players) {
    Object.keys(players).forEach(function (id) {
      if (players[id].playerId === self.socket.id) {
        addPlayer(self, players[id]);
      } else {
        addOtherPlayers(self, players[id]);
      }
    });
  });

  /*
  * New player has connected to the game, creating another player on the screen
  * */
  this.socket.on('newPlayer', function (playerInfo) {
    addOtherPlayers(self, playerInfo);
  });

  /*
  * When an external player disconnects, remove it from the game.
  * */
  this.socket.on('disconnect', function (playerId) {
    otherPlayers.getChildren().forEach(function (otherPlayer) {
      if (playerId === otherPlayer.playerId) {
        otherPlayer.destroy();
      }
    });
  });

  this.socket.on('gameOver', function (socketId) {
    var socketPassed = socketId;
    self.physics.pause();

    // check if the player that lost is in the otherPlayers array
    if(otherPlayers){
      otherPlayers.getChildren().forEach(function (otherPlayer) {
        if (otherPlayer.playerId == socketPassed){
          otherPlayer.setTint(0x000000);
        }
        // Change with otherPlayers instance!
        otherPlayer.anims.play('turn');
      });
    }

    // ...or it is the current player
    if(player.playerId == socketId){
      player.setTint(0x000000);
    }
    player.anims.play('turn');
  });
  /*
  * Information coming from the server about a player movement. Update its position.
  * */
  this.socket.on('playerMoved', function (playerInfo) {
    console.log("playerMoved");

    otherPlayers.getChildren().forEach(function (otherPlayer) {
      if (playerInfo.playerId === otherPlayer.playerId) {
        console.log("Direction: " + playerInfo.direction);

        // playing the animation for the movement communicated by the server
        if(playerInfo.direction === 'left'){
          otherPlayer.anims.play('left', true);
        } else if(playerInfo.direction === 'right'){
          otherPlayer.anims.play('right', true);
        } else {
          otherPlayer.anims.play('turn');
        }

        otherPlayer.setPosition(playerInfo.x, playerInfo.y);
      }
    });
  });

  // variable that will be made true when a player is hit by a bomb
  gameOver = false;

  //  A simple background for the game
  this.add.image(400, 300, 'sky');

  //  The platforms group contains the ground and the 2 ledges we can jump on
  platforms = this.physics.add.staticGroup();

  //  Here we create the ground.
  //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
  platforms.create(400, 568, 'ground').setScale(2).refreshBody();

  //  Now let's create some ledges
  platforms.create(600, 400, 'ground');
  platforms.create(50, 250, 'ground');
  platforms.create(750, 220, 'ground');

  //  Our player animations, turning, walking left and walking right.
  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'turn',
    frames: [ { key: 'dude', frame: 4 } ],
    frameRate: 20
  });

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
  });

  /*
  * Socket event that receives information where to spawn the next star,
  * after it has sent an event when it has been collected.
  * */
  this.socket.on('starLocation', function (starLocation) {
    if (star) star.destroy();
    star = self.physics.add.image(starLocation.x, starLocation.y, 'star');
    self.physics.add.collider(star, platforms);
    star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.6));

    self.physics.add.overlap(player, star, function () {
      this.socket.emit('starCollected');
    }, null, self);
  });

  // Creating a group for all the bombs in the game
  bombs = this.physics.add.group();

  // Collisions between bombs and platforms
  this.physics.add.collider(bombs, platforms);

  // Socket event that receives infor from the server on where to spawn the next bomb
  this.socket.on('bombLocation', function (bombLocation) {
    console.log("bombLocation message received");
    var bomb = bombs.create(bombLocation.x, bombLocation.y, 'bomb');
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(bombLocation.velocityX, bombLocation.velocityY);
    bomb.allowGravity = false;

    // Checking the collision between player and bombs
    self.physics.add.collider(player, bombs, hitBomb, null, self);
  });

  // Score text
  blueScoreText = this.add.text(16, 16, '', { fontSize: '32px', fill: '#0000FF' });
  redScoreText = this.add.text(584, 16, '', { fontSize: '32px', fill: '#FF0000' });

  // Update event from the server with the new score
  this.socket.on('scoreUpdate', function (scores) {
    blueScoreText.setText('Blue: ' + scores.blue);
    redScoreText.setText('Red: ' + scores.red);
  });

  this.cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  if(player){
    if (this.cursors.left.isDown || sensorValue == "left")
    {
      player.setVelocityX(-160);
      player.anims.play('left', true);
    }
    else if (this.cursors.right.isDown || sensorValue == "right")
    {
      player.setVelocityX(160);
      player.anims.play('right', true);
    }
    else if(sensorValue == "turn")
    {
      player.setVelocityX(0);
      player.anims.play('turn');
    }
    else
    {
      player.setVelocityX(0);
      player.anims.play('turn');
    }

    if ((this.cursors.up.isDown || sensorValue == "up") && player.body.touching.down)
    {
      player.setVelocityY(-330);
    }

    // emit player movement
    var x = player.x;
    var y = player.y;

    if (player.oldPosition && (x !== player.oldPosition.x || y !== player.oldPosition.y)) {
      this.socket.emit('playerMovement', { x: player.x, y: player.y});
    }

    // save old position data
    player.oldPosition = {
      x: player.x,
      y: player.y,
    };
  }
}
function addPlayer(self, playerInfo) {
  player = self.physics.add.sprite(playerInfo.x, playerInfo.y, 'dude');
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);
  self.physics.add.collider(player, platforms);

  if (playerInfo.team === 'blue') {
    player.setTint(0x0000ff);
  } else {
    player.setTint(0xff0000);
  }

  player.playerId = playerInfo.playerId;
}
function addOtherPlayers(self, playerInfo) {
  var otherPlayer = self.add.sprite(playerInfo.x, playerInfo.y, 'dude');
  self.physics.add.collider(otherPlayer, platforms);
  if (playerInfo.team === 'blue') {
    otherPlayer.setTint(0x0000ff);
  } else {
    otherPlayer.setTint(0xff0000);
  }
  otherPlayer.playerId = playerInfo.playerId;
  otherPlayers.add(otherPlayer);
}

function hitBomb(player, bomb){
  console.log("Inside hitBomb");

  // send an event to server to communicate the end of current game, player has been hit
  // self.socket.id
  this.socket.emit('endGame', this.socket.id);
}
