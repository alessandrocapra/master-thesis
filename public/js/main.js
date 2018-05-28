let sensorValue;
let pressureText;

var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};
game = new Phaser.Game(config);

function preload ()
{
  this.load.image('sky', 'assets/sky.png');
  this.load.image('ground', 'assets/platform.png');
  this.load.image('star', 'assets/star.png');
  this.load.image('bomb', 'assets/bomb.png');
  this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}

function create ()
{
  var self = this;
  this.otherPlayers = this.physics.add.group({
    bounceY: 0.2,
    collideWorldBounds: true
  });

  this.socket = io();
  this.socket.on('currentPlayers', function (players) {

    console.log("--------------------------------------------------------------------");
    console.log("Received currentPlayers on the client, receiving list of all players");
    console.log("--------------------------------------------------------------------");

    Object.keys(players).forEach(function (id) {
      if (players[id].playerId === self.socket.id) {
        addPlayer(self, players[id]);
      } else {
        addOtherPlayers(self, players[id]);
      }
    });

    displayConnectedUsers(self);
  });

  this.socket.on('newPlayer', function (playerInfo) {

    console.log("---------------------------------------------------");
    console.log("Received info about the new player joining the game");
    console.log("---------------------------------------------------");

    addOtherPlayers(self, playerInfo);

    displayConnectedUsers(self);
  });

  this.socket.on('disconnect', function (playerId) {
    self.otherPlayers.getChildren().forEach(function (otherPlayer) {
      if (playerId === otherPlayer.playerId) {
        otherPlayer.destroy();
      }
    });
  });

  this.socket.on('playerMoved', function (playerInfo) {
    console.log("-----------------------------------------");
    console.log("Receive playerMoved message on the client");
    console.log("-----------------------------------------");

    self.otherPlayers.getChildren().forEach(function (otherPlayer) {
      if (playerInfo.playerId === otherPlayer.playerId) {

        // check which animation to play for the movement
        // if(playerInfo.x < otherPlayer.x) {
        //   otherPlayer.setVelocityX(-160);
        //   otherPlayer.anims.play('left', true);
        // } else if (playerInfo.x > otherPlayer.x) {
        //   otherPlayer.setVelocityX(160);
        //   otherPlayer.anims.play('right', true);
        // } else {
        //   otherPlayer.setVelocityX(0);
        //   otherPlayer.anims.play('turn');
        // }
        otherPlayer.setPosition(playerInfo.x, playerInfo.y);

        console.log("player with id " + playerInfo.playerId + " (received from server)");
        console.log("p.x:" + playerInfo.x + " - p.y: " + playerInfo.y);
      }
    });
  });

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

  //  Input Events
  this.cursors = this.input.keyboard.createCursorKeys();

  //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
  this.stars = this.physics.add.group({
    key: 'star',
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 }
  });

  this.stars.children.iterate(function (child) {

    //  Give each star a slightly different bounce
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

  });

  this.bombs = this.physics.add.group();

  //  Collide the player and the stars with the platforms
  this.physics.add.collider(this.stars, this.platforms);
  this.physics.add.collider(this.bombs, this.platforms);
}

function update ()
{
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

    /*
    * TODO: add a parameter to set the animation to play? Other players look like they are always turning left
    * TODO: fix lag on Y axis when other player moves
    *
    * */

    if (this.player.oldPosition && (x !== this.player.oldPosition.x || y !== this.player.oldPosition.y)) {
      this.socket.emit('playerMovement', { x: this.player.x, y: this.player.y});
      // console.log("playerMovement (on the client)");
      // console.log("--> p.x:" + x + " - p.y: " + y);
      // console.log("--> oP.x:" + this.player.oldPosition.x + " - oP.y:" + this.player.oldPosition.y);
    }

    // save old position data
    this.player.oldPosition = {
      x: this.player.x,
      y: this.player.y,
    };
  }

}

function addPlayer(self, playerInfo) {
  console.log("----------------------------------");
  console.log("Added player playing in the client");
  console.log("----------------------------------");

  self.player = self.physics.add.sprite(playerInfo.x, playerInfo.y, 'dude');

  //  Player physics properties. Give the little guy a slight bounce.
  self.player.setBounce(0.2);
  self.player.setCollideWorldBounds(true);
  self.physics.add.collider(self.player, self.platforms);

  //  Our player animations, turning, walking left and walking right.
  self.anims.create({
    key: 'left',
    frames: self.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });

  self.anims.create({
    key: 'turn',
    frames: [ { key: 'dude', frame: 4 } ],
    frameRate: 20
  });

  self.anims.create({
    key: 'right',
    frames: self.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
  });
}

function addOtherPlayers(self, playerInfo) {
  console.log("-------------------------------------");
  console.log("Added new opponent on the client side");
  console.log("-------------------------------------");

  const otherPlayer = self.add.sprite(playerInfo.x, playerInfo.y, 'dude');
  otherPlayer.playerId = playerInfo.playerId;
  self.otherPlayers.add(otherPlayer);

  displayConnectedUsers(self);
}

function displayConnectedUsers(self){
  console.log("All players on client:");
  console.log("----------------------");
  self.otherPlayers.getChildren().forEach(function (player) {
    console.log("ID: " + player.playerId + "x: " + player.x + ", y: " + player.y);
  });
  console.log("----------------------");
}
