var socket; // define a global variable called socket
// socket = io.connect(); // send a connection request to the server
socket = io.connect(window.location.hostname, { secure: true, reconnect: true, rejectUnauthorized : false } );

// this variable will hold the updated value that comes from the Feather Huzzah (up, down, left, right for instance)
let sensorValue;

//  Listen to the “connect” message from the server.
//   The server automatically emit a “connect” message when the client connects.
//  When the client connects, call onsocketConnected.
socket.on("connect", onsocketConnected);

// this function is fired when we connect
function onsocketConnected () {
  console.log("client (game) connected to server");

  socket.on('sensor', function (data) {
    console.log(data);
    sensorValue = data.message;
  });

  socket.on('pressure', function(data){
    sensorValue = data.pressure;
  });
}

var MrHop = MrHop || {};

MrHop.GameState = {

  init: function() {

    this.floorPool = this.add.group();

    this.platformPool = this.add.group();

    this.coinsPool = this.add.group();
    this.coinsPool.enableBody = true;

    this.cactusPool = this.add.group();
    this.cactusPool.enableBody = true;

    this.game.physics.arcade.gravity.y = 800;

    this.maxJumpDistance = 150;

    this.cursors = this.game.input.keyboard.createCursorKeys();

    this.myCoins = 0;

    this.levelSpeed = 400;

    this.invincibility = false;

    this.hurt = false;

    this.underwater = false;

    this.slimed = false;

    this.fishing = false;

    this.birdie = false;

    this.cactusPatch = false;

  },
  create: function() {
    this.background = this.add.tileSprite(0, 0, this.game.world.width, this.game.world.height + 90, 'background1');
    this.background.tileScale.y = 1;
    this.background.autoScroll(-this.levelSpeed/2, 0);
    this.game.world.sendToBack(this.background);

    this.player = this.add.sprite(200, 200, 'player1');
    this.player.anchor.setTo(0.5);
    this.player.animations.add('running', [1,2,3,4,5,6], 10, true);
    this.player.animations.add('jumping', [7], true);
    this.game.physics.arcade.enable(this.player);
    this.player.body.setSize(58,83, 10, 11);


    this.water = this.add.tileSprite(0, this.game.world.height -60, this.game.world.width, 60, 'water');
    this.water.autoScroll(-this.levelSpeed/4, 0);

    this.currentPlatform = new MrHop.Platform(this.game, this.floorPool, 10, 100, 300, -this.levelSpeed, this.coinsPool, this.cactusPool, this.myCoins);
    this.platformPool.add(this.currentPlatform);

    this.slimePool = this.add.group();
    this.slimePool.enableBody = true;


    this.slimeCreator = this.game.time.events.loop(Phaser.Timer.SECOND * 5 + Math.random() * 16, this.createSlime, this);


    this.birdPool = this.add.group();
    this.birdPool.enableBody = true;
    //this.birdPool.allowGravity = false;
    this.birdCreator = this.game.time.events.loop(Phaser.Timer.SECOND * 10 + Math.random() * 31, this.createBird, this);

    this.fishPool = this.add.group();
    this.fishPool.enableBody = true;
    this.fishCreator = this.game.time.events.loop(Phaser.Timer.SECOND * 4 + Math.random() * 7, this.createFish, this);

    this.starPool = this.add.group();
    this.starPool.enableBody = true;
    this.starCreator = this.game.time.events.loop(Phaser.Timer.SECOND * 3 + Math.random() * 10, this.createStar, this);

    this.coinSound = this.add.audio('coinsound');
    this.musicSound = this.add.audio('musicsound');
    this.jumpSound = this.add.audio('jumpsound');
    this.loseSound = this.add.audio('losesound');
    this.hitSound = this.add.audio('hitsound');
    this.hitEnemySound = this.add.audio('hitenemysound');
    this.hitStarSound = this.add.audio('hitstarsound1');
    this.hitEnemySound = this.add.audio('hitenemysound');
    this.themeSound = this.add.audio('theme');
    this.themeSound1 = this.add.audio('theme1');
    this.themeSound2 = this.add.audio('theme3');
    this.splashSound = this.add.audio('splash');
    this.loadLevel();

    var style = {font: '60px Arial', fill: '#fff'};
    this.coinsCountLabel = this.add.text(10, 20, '0', style);

    //this.game.time.advancedTiming = true;
  },
  update: function() {
    this.game.physics.arcade.overlap(this.player, this.coinsPool, this.collectCoin, null, this);
    this.game.physics.arcade.collide(this.player, this.cactusPool, this.hitCactus, null, this);
    this.game.physics.arcade.collide(this.player, this.slimePool, this.hitEnemy, null, this);
    this.game.physics.arcade.collide(this.player, this.birdPool, this.hitBird, null, this);
    this.game.physics.arcade.collide(this.player, this.fishPool, this.hitFish, null, this);
    this.game.physics.arcade.collide(this.player, this.starPool, this.hitStar, null, this);

    if(this.player.alive && !this.hurt){
      this.platformPool.forEachAlive(function(platform, index){
        this.game.physics.arcade.collide(this.player, platform);

        if(platform.length && platform.children[platform.length-1].right < 0) {
          platform.kill();
        }

      }, this);

      this.slimePool.forEachAlive(function(element){
        if(element.y >= this.game.height || element.x <= this.game.width -1100){
          element.kill();
        }
      }, this);
      this.fishPool.forEachAlive(function(element){
        if(element.y >= this.game.height){
          element.kill();
        }
      }, this);
      this.birdPool.forEachAlive(function(element){
        if(element.x <= -this.game.width){
          element.kill();
        }
      }, this);
      this.starPool.forEachAlive(function(element){
        if(element.x <= -this.game.width){
          element.kill();
        }
      }, this);

      this.coinsPool.forEachAlive(function(coin){
        if(coin.right <= 0) {
          coin.kill();
        }
      }, this);
      this.cactusPool.forEachAlive(function(cactus){
        if(cactus.right <= 0) {
          cactus.kill();
        }
      }, this);

      this.player.body.position.x = this.player.body.position.x;
      if(this.player.body.touching.down){
        this.player.body.velocity.x = this.levelSpeed;
        this.player.play('running');
      }
      else{
        this.player.body.velocity.x = 0;

      }

      if(this.cursors.up.isDown || this.game.input.activePointer.isDown || sensorValue === "up"){
        this.playerJump();
        this.player.play('jumping');
      }
      else if(this.cursors.up.isUp || this.game.input.activePointer.isUp){
        this.isJumping = false;
      }

      if(this.currentPlatform.length && this.currentPlatform.children[this.currentPlatform.length-1].right < this.game.world.width) {
        this.createPlatform();
      }
      if(this.player.top >= this.game.world.height){
        this.splash = this.add.sprite(this.player.x, this.player.y - 90, 'splash');
        this.splash.animations.add('splashing', [1,2,3,4,5,6, 7], 10, false);
        this.splash.play('splashing');
        this.splashSound.play();
        this.gameOver();
        this.underwater = true;
      }
      if(this.player.left <= 0){
        this.gameOver();
      }
    }
    this.platformPool.forEachAlive(function(platform, index){
      this.game.physics.arcade.collide(this.slimePool, platform);


    }, this);

  },
  playerJump: function(){
    if(this.player.body.touching.down) {
      this.startJumpY = this.player.y;
      this.isJumping = true;
      this.jumpPeaked = false;
      this.player.body.velocity.y = -300;
      this.jumpSound.play();
    }
    else if(this.isJumping && !this.jumpPeaked) {
      var distanceJumped = this.startJumpY - this.player.y;

      if(distanceJumped <= this.maxJumpDistance) {
        this.player.body.velocity.y = -300;
        //this.jumpSound.play();
      }
      else {
        this.jumpPeaked = true;
      }
    }
  },
  loadLevel: function() {
    //this.musicSound.loopFull();
    //this.createSlime();
    this.themeSound1.loopFull();
    this.createPlatform();
  },
  createPlatform: function() {
    var nextPlatformData = this.generateRandomPlatform();

    if(nextPlatformData){

      this.currentPlatform = this.platformPool.getFirstDead();

      if(!this.currentPlatform) {
        this.currentPlatform = new MrHop.Platform(this.game, this.floorPool, nextPlatformData.numTiles, this.game.world.width + nextPlatformData.seperation, nextPlatformData.y, -this.levelSpeed, this.coinsPool, this.cactusPool, this.myCoins);
      }
      else {
        this.currentPlatform.prepare(nextPlatformData.numTiles, this.game.world.width + nextPlatformData.seperation, nextPlatformData.y, -this.levelSpeed);
      }
      this.platformPool.add(this.currentPlatform);
    }
  },
  generateRandomPlatform: function() {
    var data = {};
    var minSeperation = 60;
    var maxSeperation = 100;

    if(this.myCoins > 20){
      minSeperation = 120;
      maxSeperation = 200;
    }
    data.seperation = minSeperation + Math.random() * (maxSeperation - minSeperation);

    var minDifY = -20;
    var maxDifY = 20;

    if(this.myCoins > 20){
      minDifY = -40;
      maxDifY = 40;
    }
    if(this.myCoins > 40){
      minDifY = -80;
      maxDifY = 80;
    }
    if(this.myCoins > 60){
      minDifY = -160;
      maxDifY = 160;
    }

    data.y = this.currentPlatform.children[0].y + minDifY + Math.random() * (maxDifY - minDifY);
    data.y = Math.max(150, data.y);
    data.y = Math.min(this.game.world.height - 50, data.y);

    var minTiles = 8;
    var maxTiles = 8;

    if(this.myCoins > 20){
      minTiles = 6;
      maxTiles = 6;
    }

    if(this.myCoins > 40){
      minTiles = 3;
      maxTiles = 6;
    }
    data.numTiles = minTiles + Math.random() * (maxTiles - minTiles);

    return data;
  },
  createSlime: function() {
    var numSlime = Math.floor((Math.random() * 3) + 1);
    for (var i = 0; i < numSlime; i++){
      if(this.player.alive){
        this.slime = this.slimePool.getFirstExists(false);


        if(!this.slime) {

          this.slime = new Phaser.Sprite(this.game, 0, 0, 'slime');
          this.slimePool.add(this.slime);
          this.slime.animations.add('slimeWalk', [0,1], 3, true);
          this.slime.animations.add('slimeDead', [2], true);
          this.slime.play('slimeWalk');
        }

        this.slime.reset(this.game.width - 300 + (100 * i), 0);
        //this.slime.reset(Math.floor((Math.random() * 496) + 600), 0);
        this.slime.body.velocity.x = -350;
        this.slime.play('slimeWalk');
        this.slime.scale.setTo(1,1);
        this.slime.body.immovable = false;
        this.slime.body.bounce.set(-0.12);
        //this.slime.body.gravity.y = 1200;

      }
    }
  },
  hitEnemy: function(player, slime) {
    if(slime.body.touching.up){
      this.hitEnemySound.play();
      this.player.body.velocity.y = -300;
      slime.play('slimeDead');
      this.game.time.events.add(Phaser.Timer.SECOND * 1, this.killEnemy, this);
    }
    else if(!this.invincibility && !this.hurt){
      this.hitSound.play();
      this.player.loadTexture('hurt');
      this.player.body.velocity.y = 0;
      this.player.body.velocity.x = -300;
      slime.body.velocity.y = 100;
      slime.body.velocity.x = -200;
      this.hurt = true;
      this.levelSpeed = 0;
      slime.body.immovable = true;
      this.slimed = true;

      this.game.time.events.add(1000, this.gameOver, this);
    }
    else{
      this.hitEnemySound.play();
      slime.body.velocity.y = 100;
      slime.body.velocity.x = -200;
      slime.scale.setTo(-1,-1);
      slime.body.immovable = true;
      //slime.kill();
    }
  },
  killEnemy: function() {
    this.slime.kill();
  },
  createBird: function() {
    if(this.player.alive){
      this.bird = this.birdPool.getFirstExists(false);


      if(!this.bird) {
        this.bird = new Phaser.Sprite(this.game, 0, 0, 'bird');
        this.birdPool.add(this.bird);
        this.bird.animations.add('birdFly', [0,1], 3, true);
        this.bird.animations.add('birdDead', [2], true);
        this.bird.play('birdFly');
      }
      this.bird.reset(this.game.width, 50 + Math.random() * 200);
      this.bird.body.velocity.x = -575;
      this.bird.body.allowGravity = false;
      this.bird.play('birdFly');
    }
  },
  hitBird: function(player, bird) {
    if(bird.body.touching.up){
      this.hitEnemySound.play();
      this.player.body.velocity.y = -300;
      this.bird.body.allowGravity = true;
      bird.play('birdDead');
      this.game.time.events.add(Phaser.Timer.SECOND * 1, this.killBird, this);
    }
    else if(!this.invincibility && !this.hurt){
      this.hitSound.play();
      bird.play('birdDead');
      this.bird.body.allowGravity = true;
      this.bird.body.velocity.y = -300;
      this.player.body.velocity.y = 0;
      this.player.loadTexture('hurt');
      this.hurt = true;
      this.levelSpeed = 0;
      this.birdie = true;
      //this.bird.body.gravity.y = 1200;

      this.game.time.events.add(1000, this.gameOver, this);
    }
    else{
      this.hitEnemySound.play();
      bird.play('birdDead');
      this.bird.body.allowGravity = true;
      this.bird.body.velocity.y = -350;
      this.bird.body.velocity.x = 100;
      //this.bird.body.gravity.y = 1200;
      //bird.kill();
    }
    if(bird.body.touching.down){
      this.hitEnemySound.play();
      this.bird.body.velocity.y = -350;
      this.bird.body.velocity.x = -300;
      //this.bird.body.gravity.y = 1200;
      bird.play('birdDead');
      this.game.time.events.add(Phaser.Timer.SECOND * 1, this.killBird, this);
    }

  },
  killBird: function() {
    this.bird.kill();
  },
  createFish: function() {
    //var numSlime = Math.floor((Math.random() * 3) + 2);
    for (var i = 0; i < 1; i++){
      if(this.player.alive && this.player.y > 300){
        this.fish = this.fishPool.getFirstExists(false);


        if(!this.fish) {
          this.fish = new Phaser.Sprite(this.game, 0, 0, 'fish');
          this.fishPool.add(this.fish);
          this.fish.animations.add('fishSwim', [0,1], 3, true);
          this.fish.animations.add('fishDead', [2], true);
          this.fish.play('fishSwim');
        }
        this.fish.reset(Math.floor((Math.random() * 396) + 600), this.game.height -100);
        this.fish.body.velocity.y = -775;
        this.fish.body.velocity.x = -675;
        this.fish.angle  = 10;
        this.fish.play('fishSwim');
      }
    }
  },
  hitFish: function(player, fish) {
    if(fish.body.touching.top){
      this.hitEnemySound.play();
      this.player.body.velocity.y = -300;
      //this.player.body.velocity.x = 0;
      fish.play('fishDead');
      this.game.time.events.add(Phaser.Timer.SECOND * 1, this.killFish, this);
    }
    else if(!this.invincibility && !this.hurt){
      this.hitSound.play();
      fish.play('birdDead');
      this.fish.body.allowGravity = true;
      this.fish.body.velocity.y = -300;
      this.player.loadTexture('hurt');
      this.hurt = true;
      this.levelSpeed = 0;
      this.fishing = true;

      this.game.time.events.add(1000, this.gameOver, this);
    }
    else{
      this.hitEnemySound.play();
      fish.play('fishDead');
      this.fish.body.velocity.y = 100;
      this.fish.body.velocity.x = 200;
      //bird.kill();

    }
  },
  killFish: function() {
    this.fish.kill();
  },
  createStar: function() {
    if(this.player.alive && !this.invincibility){
      this.star = this.starPool.getFirstExists(false);

      if(!this.star) {
        this.star = new Phaser.Sprite(this.game, 0, 0, 'star');
        this.starPool.add(this.star);
      }
      this.star.reset(this.game.width, 50 + Math.random() * 200);
      this.star.body.velocity.y = 0;
      this.star.body.velocity.x = -675;
      this.star.body.allowGravity = false;
    }
  },
  hitStar: function(player, star) {
    this.hitStarSound.play();
    this.playerInvincible();
    star.kill();
  },
  playerInvincible: function() {
    this.invincibility = true;
    if (this.player.key === 'player1'){
      this.player.loadTexture('player2', 0, false);
      //this.themeSound2.play();
      //this.themeSound1.stop();
      this.game.time.events.add(8000, this.toggleInvincible, this);
    }
  },
  toggleInvincible: function(){
    this.invincibility = false;
    //this.themeSound2.stop();
    //this.themeSound1.loopFull();
    if (!this.invinciblity){
      this.player.loadTexture('player1', 0, false);
    }
  },
  hitCactus: function(){
    if (!this.hurt){
      this.hitSound.play();
      this.player.loadTexture('hurt');
      this.player.body.velocity.y = -100;
      this.hurt = true;
      this.levelSpeed = 0;
      this.cactusPatch = true;

      this.game.time.events.add(1000, this.gameOver, this);
    }
  },
  collectCoin: function(player, coin) {
    coin.kill();
    this.myCoins++;
    this.coinSound.play();
    this.coinsCountLabel.text = this.myCoins;
    //this.player.tint = Math.random() * 0xffffff;

  },
  gameOver: function() {
    if(this.player.alive){
      this.player.kill();

      navigator.vibrate(1000);

      this.updateHighscore();

      this.overlay = this.add.bitmapData(this.game.width, this.game.height);
      this.overlay.ctx.fillStyle = '#000';
      this.overlay.ctx.fillRect(0, 0, this.game.width, this.game.height);

      this.panel = this.add.sprite(0, 0, this.overlay);
      this.panel.alpha = 0.55;

      var gameOverPanel = this.add.tween(this.panel);
      gameOverPanel.to({y: 0}, 500);

      gameOverPanel.onComplete.add(function(){
        this.background.stopScroll();

        if (this.underwater){
          var style = {font: '70px Orbitron, sans-serif', fill: '#fff'};
          this.add.text(this.game.width/2, this.game.height/2 - 200,'Dying for a Drink?', style).anchor.setTo(0.5);
        }

        if (this.slimed){
          var style = {font: '65px Orbitron, sans-serif', fill: '#fff'};
          this.add.text(this.game.width/2, this.game.height/2 - 200,'Those Slimey Boogers!', style).anchor.setTo(0.5);
        }

        if (this.fishing){
          var style = {font: '55px Orbitron, sans-serif', fill: '#fff'};
          this.add.text(this.game.width/2, this.game.height/2 - 200,'Swimming with the Fishies...', style).anchor.setTo(0.5);
        }

        if (this.birdie){
          var style = {font: '70px Orbitron, sans-serif', fill: '#fff'};
          this.add.text(this.game.width/2, this.game.height/2 - 200,'Birdie, Birdie, Birdie', style).anchor.setTo(0.5);
        }

        if (this.cactusPatch){
          var style = {font: '70px Orbitron, sans-serif', fill: '#fff'};
          this.add.text(this.game.width/2, this.game.height/2 - 200,'Out of Nowhere!', style).anchor.setTo(0.5);
        }

        var style = {font: '70px Yanone Kaffeesatz, sans-serif', fill: '#fff'};
        this.add.text(this.game.width/2, this.game.height/2 - 80,'GAME OVER', style).anchor.setTo(0.5);

        style = {font: '60px Yanone Kaffeesatz, sans-serif', fill: '#fff'};
        this.add.text(this.game.width/2, this.game.height/2 + 25,'Highscore: ' + this.highScore, style).anchor.setTo(0.5);

        this.add.text(this.game.width/2, this.game.height/2 + 120,'Your Score: ' + this.myCoins, style).anchor.setTo(0.5);

        var style = {font: '30px Yanone Kaffeesatz, sans-serif', fill: '#fff'};
        this.add.text(this.game.width/2, this.game.height/2 + 180, 'Tap to Play Again', style).anchor.setTo(0.5);

        this.game.input.onDown.add(this.restart, this);

      }, this);

      gameOverPanel.start();
      //this.musicSound.stop();
      this.themeSound1.stop();
      //this.themeSound2.stop();
      this.loseSound.play();

    }
  },
  restart: function() {
    this.game.state.start('GameState');
  },
  updateHighscore: function(){
    this.highScore = +localStorage.getItem('highScore');
    if(this.highScore < this.myCoins){
      this.highScore = this.myCoins;

      localStorage.setItem('highScore', this.highScore);
    }
  },
  render: function(){
    //this.game.debug.body(this.player);{
    //this.game.debug.text(this.game.time.fps, 2, 14, "#00ff00");
    //this.game.debug.spriteBounds(this.platformPool);
    //this.game.debug.pixel(100, 100, 'red', 4);
    //this.game.physics.arcade.skipQuadTree = false;
    //this.game.debug.bodyInfo(this.platformPool, 32, 32);
    //this.game.debug.body(this.platformPool);
  }
};
