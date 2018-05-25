var socket; // define a global variable called socket
// socket = io.connect(); // send a connection request to the server
socket = io.connect(window.location.hostname, { secure: true, reconnect: true, rejectUnauthorized : false } );

let sensorValue;
let pressureText = 0;

socket.on("connect", onsocketConnected);

var canvasWidth = window.innerWidth * window.devicePixelRatio;
var canvasHeight = window.innerHeight * window.devicePixelRatio;

var config = {
  type: Phaser.AUTO,
  // width and height should match the device's screen size
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

var player;
var stars;
var bombs;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;

var game = new Phaser.Game(config);

function preload ()
{
  this.load.image('sky', 'img/assets/sky.png');
  this.load.image('ground', 'img/assets/platform.png');
  this.load.image('star', 'img/assets/star.png');
  this.load.image('bomb', 'img/assets/bomb.png');
  this.load.spritesheet('dude', 'img/assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}

function create ()
{

  //listen to the “connect” message from the server. The server
  //automatically emit a “connect” message when the cleint connets.When
  //the client connects, call onsocketConnected.

  let pressureText;

  //  A simple background for our game
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

  //  Input Events
  cursors = this.input.keyboard.createCursorKeys();

  //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
  stars = this.physics.add.group({
    key: 'star',
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 }
  });

  stars.children.iterate(function (child) {
    //  Give each star a slightly different bounce
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  });

  bombs = this.physics.add.group();

  //  The score
  scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

  // text displaying pressure from arduino
  pressureText = this.add.text(300, 16, 'pressure: 0Pa', { fontSize: '32px', fill: '#000' });

  //  Collide the player and the stars with the platforms
  this.physics.add.collider(player, platforms);
  this.physics.add.collider(stars, platforms);
  this.physics.add.collider(bombs, platforms);

  //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
  this.physics.add.overlap(player, stars, collectStar, null, this);

  this.physics.add.collider(player, bombs, hitBomb, null, this);
}

function onsocketConnected () {
  console.log("client (game) connected to server");

  createPlayer();

  // send to the server a "new_player" message so that the server knows
  // a new player object has been created
  socket.emit('new_player', {x: 100, y: 0});

  socket.on('sensor', function(data){
    console.log('data: ' + data.message);
    sensorValue = data.message;
  });

  socket.on('pressure', function(data){
    pressureText.setText('Pressure: ' + data.pressure + 'Pa');
  });
}

function createPlayer(){
  console.log("createPlayer()");

  // The player and its settings
  player = game.physics.add.sprite(100, 450, 'dude');

  //  Player physics properties. Give the little guy a slight bounce.
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);
}

function update ()
{
  if (gameOver)
  {
    return;
  }

  if (cursors.left.isDown || sensorValue == "left")
  {
    player.setVelocityX(-160);
    player.anims.play('left', true);
    // sensorValue = "";
  }
  else if (cursors.right.isDown || sensorValue == "right")
  {
    player.setVelocityX(160);
    player.anims.play('right', true);
    // sensorValue = "";
  }
  else if(sensorValue == "turn")
  {
    player.setVelocityX(0);
    player.anims.play('turn');
  }

  if (cursors.up.isDown || sensorValue == "up" && player.body.touching.down)
  {
    player.setVelocityY(-330);
    // sensorValue = "";
  }
}

function collectStar (player, star)
{
  star.disableBody(true, true);

  //  Add and update the score
  score += 10;
  scoreText.setText('Score: ' + score);

  if (stars.countActive(true) === 0)
  {
    //  A new batch of stars to collect
    stars.children.iterate(function (child) {

      child.enableBody(true, child.x, 0, true, true);

    });

    var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

    var bomb = bombs.create(x, 16, 'bomb');
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    bomb.allowGravity = false;

  }
}

function hitBomb (player, bomb)
{
  this.physics.pause();

  player.setTint(0xff0000);

  player.anims.play('turn');

  gameOver = true;
}
