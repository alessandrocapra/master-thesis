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
    self.otherPlayers.getChildren().forEach(function (otherPlayer) {
      if (playerInfo.playerId === otherPlayer.playerId) {
        otherPlayer.setPosition(playerInfo.x, playerInfo.y);
      }
    });
  });

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

    if (this.cursors.up.isDown || sensorValue == "up" && this.player.body.touching.down)
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
}

function addOtherPlayers(self, playerInfo) {
  var otherPlayer = self.add.sprite(playerInfo.x, playerInfo.y, 'dude');

  otherPlayer.playerId = playerInfo.playerId;
  self.otherPlayers.add(otherPlayer);
}
