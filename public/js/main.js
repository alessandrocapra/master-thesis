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

var game = new Phaser.Game(config);
var sensorValue;

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
  this.otherPlayers = this.physics.add.group({
    bounceY: 0.2,
    collideWorldBounds: true
  });

  this.socket.on('currentPlayers', function (players) {
    Object.keys(players).forEach(function (id) {
      if (players[id].playerId === self.socket.id) {
        addPlayer(self, players[id]);
      } else {
        addOtherPlayers(self, players[id]);
      }
    });
  });

  this.socket.on('newPlayer', function (playerInfo) {
    addOtherPlayers(self, playerInfo);
  });

  this.socket.on('disconnect', function (playerId) {
    self.otherPlayers.getChildren().forEach(function (otherPlayer) {
      if (playerId === otherPlayer.playerId) {
        otherPlayer.destroy();
      }
    });
  });

  this.socket.on('playerMoved', function (playerInfo) {
    console.log("playerMoved");

    self.otherPlayers.getChildren().forEach(function (otherPlayer) {
      if (playerInfo.playerId === otherPlayer.playerId) {
        console.log("Direction: " + playerInfo.direction);

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

  this.gameOver = false;

  //  A simple background for our game
  this.add.image(400, 300, 'sky');

  //  The platforms group contains the ground and the 2 ledges we can jump on
  this.platforms = this.physics.add.staticGroup();

  //  Here we create the ground.
  //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
  this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();

  //  Now let's create some ledges
  this.platforms.create(600, 400, 'ground');
  this.platforms.create(50, 250, 'ground');
  this.platforms.create(750, 220, 'ground');

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

  this.socket.on('starLocation', function (starLocation) {
    if (self.star) self.star.destroy();
    self.star = self.physics.add.image(starLocation.x, starLocation.y, 'star');
    self.physics.add.collider(self.star, self.platforms);
    self.star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.6));

    self.physics.add.overlap(self.player, self.star, function () {
      this.socket.emit('starCollected');
    }, null, self);
  });


  this.blueScoreText = this.add.text(16, 16, '', { fontSize: '32px', fill: '#0000FF' });
  this.redScoreText = this.add.text(584, 16, '', { fontSize: '32px', fill: '#FF0000' });

  this.socket.on('scoreUpdate', function (scores) {
    self.blueScoreText.setText('Blue: ' + scores.blue);
    self.redScoreText.setText('Red: ' + scores.red);
  });


  this.cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  if(this.player){
    if (this.cursors.left.isDown || sensorValue == "left")
    {
      this.player.setVelocityX(-160);
      this.player.anims.play('left', true);
    }
    else if (this.cursors.right.isDown || sensorValue == "right")
    {
      this.player.setVelocityX(160);
      this.player.anims.play('right', true);
    }
    else if(sensorValue == "turn")
    {
      this.player.setVelocityX(0);
      this.player.anims.play('turn');
    }
    else
    {
      this.player.setVelocityX(0);
      this.player.anims.play('turn');
    }

    if ((this.cursors.up.isDown || sensorValue == "up") && this.player.body.touching.down)
    {
      this.player.setVelocityY(-330);
    }

    // emit player movement
    var x = this.player.x;
    var y = this.player.y;

    if (this.player.oldPosition && (x !== this.player.oldPosition.x || y !== this.player.oldPosition.y)) {
      this.socket.emit('playerMovement', { x: this.player.x, y: this.player.y});
    }

    // save old position data
    this.player.oldPosition = {
      x: this.player.x,
      y: this.player.y,
    };
  }
}
function addPlayer(self, playerInfo) {
  self.player = self.physics.add.sprite(playerInfo.x, playerInfo.y, 'dude');
  self.player.setBounce(0.2);
  self.player.setCollideWorldBounds(true);
  self.physics.add.collider(self.player, self.platforms);
  if (playerInfo.team === 'blue') {
    self.player.setTint(0x0000ff);
  } else {
    self.player.setTint(0xff0000);
  }
}

// UPDATE THIS FUNCTION IN WEBSTORM
function addOtherPlayers(self, playerInfo) {
  var otherPlayer = self.add.sprite(playerInfo.x, playerInfo.y, 'dude');
  self.physics.add.collider(otherPlayer, self.platforms);
  if (playerInfo.team === 'blue') {
    otherPlayer.setTint(0x0000ff);
  } else {
    otherPlayer.setTint(0xff0000);
  }
  otherPlayer.playerId = playerInfo.playerId;
  self.otherPlayers.add(otherPlayer);
}
