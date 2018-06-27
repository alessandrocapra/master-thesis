module.exports = {

  create: function () {

  	var world = this.world;
  	// keep reference of Scene scope
  	var self = this;
    // set the velocity to which the level moves
		var speed = this.speed = 3;

		// vars for controlling the game through breathing
		this.pressure = 0;
		this.percentageEffort = 0.8;

		// var to control whether the ranking has been already retrieved
		this.rankingRetrieved = false;
		this.scoreUpdated = false;

		this.socket = io();
		this.socket.on("connect", function () {
			console.log("client (game) connected to server");

			// receives the raw pressure number
			self.socket.on('p', function(data){
				self.pressure = parseFloat(data.p);
				// console.log('pressure: ' + self.pressure);
			});
		});

		// delay the music start
		this.time.events.add(Phaser.Timer.SECOND * 7.8, function(){
			self.music = self.sound.play('song');
		}, this);

		this.score = 0;
		this.health = 60;
		this.coinValue = 10;
		this.gameOver = false;

    // start the arcade physics system
		this.physics.startSystem(Phaser.Physics.ARCADE);
		this.physics.arcade.gravity.y = 500;
		this.enableCollision = true;

		var background = this.background = this.add.tileSprite(0,0, world.width, world.height, 'background');
		background.fixedToCamera = true;

    // tileset creation
		this.map = this.game.add.tilemap('tilemap');
		this.map.addTilesetImage('tiles_spritesheet', 'tiles');
		this.map.addTilesetImage('Enemy', 'bee_tiles');

		// Import the tileset layers
		var scenarioLayer = this.scenarioLayer = this.map.createLayer('Scenario');
		var foregroundLayer = this.foregroundLayer = this.map.createLayer('Foreground');
		var groundLayer = this.groundLayer = this.map.createLayer('Ground');
		var underwaterLayer = this.underwaterLayer = this.map.createLayer('Underwater');
		underwaterLayer.alpha = 0.7;
		var specialBoxesLayer = this.specialBoxesLayer = this.map.createLayer('SpecialBoxes');

		this.map.setCollisionBetween(1, 200, true, 'Scenario');
		this.map.setCollisionBetween(1, 200, true, 'Foreground');
		this.map.setCollisionBetween(1, 200, true, 'Underwater');
		this.map.setCollisionBetween(1, 200, true, 'SpecialBoxes');
		// this.map.setCollisionBetween(1, 200, true, 'Ground');

		// Import enemies as objects
		this.enemies = this.add.group();
		this.enemies.enableBody = true;

		// load enemies from tiled map
		this.map.createFromObjects('Enemies', 157, 'bee', 0, true, false, this.enemies);
		// create animation for all children of enemies group
		this.enemies.callAll('animations.add', 'animations', 'fly', [0,2], 10, true);
		this.enemies.callAll('animations.play', 'animations', 'fly');
		this.enemies.callAll('animations.add', 'animations', 'dead', [1], 10, true);
		this.enemies.setAll('body.allowGravity', false);

		// make enemies pulse to rhythm
		this.enemies.forEach(function (bee) {
			self.add.tween(bee.scale).to( {x:1.2, y: 1.2}, 480, Phaser.Easing.Back.InOut, true, 0, false);
		});

		// Import coins
		this.coins = this.add.group();
		this.coins.enableBody = true;
		// load coins from tiled map
		this.map.createFromObjects('Coins', 161, 'coin', 0, true, false, this.coins);
		// create animation for all children of coins group
		this.coins.callAll('animations.add', 'animations', 'spin', [0, 1, 2, 3, 4, 5], 10, true);
		this.coins.callAll('animations.play', 'animations', 'spin');
		this.coins.setAll('body.allowGravity', false);

		// Score text
		this.style = { font: "bold 24px Arial", fill: "#000"};
		this.scoreText = this.add.text(400, 40, "score: 0", this.style);
		this.scoreText.anchor.setTo(0.5, 0.5);
		// fix to camera
		this.scoreText.fixedToCamera = true;

		// info text for special boxes
		this.infoText = this.add.text(this.world.centerX, this.world.height*0.3, 'Special boxes');
		this.infoText.anchor.setTo(0.5, 0.5);
		this.infoText.visible = false;
		// fix to camera
		this.infoText.fixedToCamera = true;

		/*
		*
		* Initial instructions when the game starts
		*
		* */
		var mouth = this.mouth = this.add.sprite(this.camera.width*0.4, this.world.height*0.4, 'mouth');
		mouth.scale.setTo(0.1,0.1);
		mouth.anchor.setTo(0.5,0.5);
		mouth.fixedToCamera = true;

		var nose = this.nose = this.add.sprite(this.camera.width*0.4, this.world.height*0.52, 'nose');
		nose.scale.setTo(0.1,0.1);
		nose.anchor.setTo(0.5,0.5);
		// flip it horizontally
		// arrowDown.scale.y *= -1;
		nose.fixedToCamera = true;

		// add text for the arrows explanation
		this.mouthText = this.add.text(this.camera.width * 0.56, this.world.height*0.4, 'Jump and fly', {align: "left", boundsAlignH: "left", boundsAlignV: "middle"});
		this.mouthText.anchor.setTo(0.5, 0.5);
		// fix to camera
		this.mouthText.fixedToCamera = true;

		this.noseText = this.add.text(this.camera.width * 0.58, this.world.height*0.52, 'Go under water', {align: "left", boundsAlignH: "left", boundsAlignV: "middle"});
		this.noseText.anchor.setTo(0.5, 0.5);
		// fix to camera
		this.noseText.fixedToCamera = true;

		// destroy the icons and text after 5 seconds
		this.time.events.add(Phaser.Timer.SECOND * 5, function(){
			// debugger;
			// tween to make instructions nicely disappear
			this.switchAlphaInstructions([this.mouth, this.nose, this.mouthText, this.noseText]);
		}, this);

		// hearts for health
		this.hearts = this.add.group();
		for(var i=0; i < 6; i++){
			this.hearts.create(50 + i*45, 40, 'heartFull')
		}
		// change anchor and scale for all hearts
		this.hearts.forEach(function (heart) {
			heart.anchor.setTo(0.5, 0.5);
			heart.scale.setTo(0.7, 0.7);
		});
		// fix to camera
		this.hearts.fixedToCamera = true;

		// load overlay screen and hide it
		this.overlayBackground = this.add.sprite(0, 0, 'overlay');
		this.overlayBackground.x = this.camera.width * 0.5;
		this.overlayBackground.y = this.camera.height * 0.5;
		this.overlayBackground.anchor.set(0.5, 0.5);

		this.overlayText = this.add.text(this.camera.width * 0.5, 100, 'Text goes here' , { align: "center", font: "bold 28px Arial", fill: "#fff"});
		this.overlayText.anchor.set(0.5, 0.5);

		// add the text as child of the background container
		// this.overlayBackground.addChild(this.overlayText);
		this.overlayText.fixedToCamera = true;

		this.overlayBackground.fixedToCamera = true;
		this.overlayBackground.visible = false;
		this.overlayText.visible = false;

		// OK button for restarting the game
		this.okBtn = this.add.sprite(this.camera.width * 0.65, this.camera.height * 0.6, 'button','blue_button04.png');
		this.okBtn.anchor.set(0.5);
		// this.overlayBackground.addChild(this.okBtn);
		this.okBtn.inputEnabled = true;
		this.okBtn.input.useHandCursor = true;
		this.okBtn.visible = false;

		this.okBtnText = this.add.text(0,0,'Ja', this.game.global.buttonLabelStyle);
		this.okBtnText.anchor.set(0.5);
		this.okBtn.addChild(this.okBtnText);
		this.okBtn.fixedToCamera = true;

		this.okBtn.events.onInputUp.add(function(){
			// setting instructions back to visible
			self.switchAlphaInstructions([self.mouth, self.nose, self.mouthText, self.noseText]);

			self.state.restart();
		});

		// Menu button to go back to welcome after the game ended / player lost
		this.backToMenuBtn = this.add.sprite(this.camera.width * 0.35, this.camera.height * 0.6, 'button','blue_button04.png');
		this.backToMenuBtn.anchor.set(0.5);
		// this.overlayBackground.addChild(this.okBtn);
		this.backToMenuBtn.inputEnabled = true;
		this.backToMenuBtn.input.useHandCursor = true;
		this.backToMenuBtn.visible = false;

		this.backToMenuText = this.add.text(0,0,'Back to Menu', this.game.global.buttonLabelStyle);
		this.backToMenuText.anchor.set(0.5);
		this.backToMenuBtn.addChild(this.backToMenuText);
		this.backToMenuBtn.fixedToCamera = true;

		this.backToMenuBtn.events.onInputUp.add(function(){
			self.state.start('welcome');
		});

		// Create pause button
		this.pauseButton = this.add.image(this.camera.width - 40, 40, 'pauseButton');
		this.pauseButton.scale.setTo(0.1,0.1);
		this.pauseButton.anchor.setTo(0.5, 0.5);
		this.pauseButton.inputEnabled = true;
		// fix to camera
		this.pauseButton.fixedToCamera = true;

		this.pauseButton.events.onInputUp.add(function () {
			// When the pause button is pressed, we pause the game

			// stop camera
			if(!self.stopTheCamera){
				self.stopTheCamera = true;
			} else {
				self.music.resume();
				self.paused = false;
				self.physics.arcade.isPaused = (!self.physics.arcade.isPaused);
				self.overlayBackground.visible = false;

				self.stopTheCamera = false;
			}
		});

		// define duck and its properties
		var duck = this.duck = this.add.sprite(80, world.centerY+50, 'duck');
		duck.anchor.setTo(0.5, 0.5);
		this.physics.arcade.enable(duck);
		duck.body.collideWorldBounds = true;
		duck.scale.set(2);
		duck.animations.add('walk', null, 5, true);
		duck.animations.play('walk');

		duck.body.allowDrag = true;
		duck.body.drag.set(0, 100);
		duck.body.maxVelocity.set(200, 400);

		this.camera.follow(duck);
		this.camera.deadzone = new Phaser.Rectangle(0, 0, 100, 400);

		// create an invisible wall at the end of the level to know when the player reaches the end
		console.log('world width: ' + this.world.width);
		var endGameWall = this.endGameWall = this.add.sprite(this.world.width, 0);
		endGameWall.width = 100;
		endGameWall.height = this.world.height;
		endGameWall.tint = '0xFF0000';
		this.physics.arcade.enable(endGameWall);

		var endGameRect = this.add.graphics(0,0);

		groundLayer.resizeWorld();

		// update position of invisible wall after world resizing
		endGameWall.x = this.world.width * 0.02;
		console.log('endGameWall.x: ' + endGameWall.x);
		console.log('endGameWall.y: ' + endGameWall.y);
		console.log('endGameWall.width: ' + endGameWall.width);
		console.log('endGameWall.height: ' + endGameWall.height);

		endGameRect.beginFill(0xFF0000);
		endGameRect.drawRect(endGameWall.x, endGameWall.y, endGameWall.width, endGameWall.height);

		var cursors = this.cursors = this.input.keyboard.createCursorKeys();

		// controlling with up and down keys
		cursors.down.onDown.add(function() {
			if(self.duck.body.y > self.world.centerY - 35 && self.duck.body.y < self.world.height - 70 )
				self.duck.body.velocity.y = 600;
		});
		cursors.up.onDown.add(function() {
			if( self.duck.body.y <= self.world.centerY + 50 && self.duck.body.y > 100 )
				self.duck.body.velocity.y = -600;
		});
  },

  update: function () {

		// console.log('\n----------------------------');
		// console.log('pressure: ' + this.pressure);
		// console.log('maxInhale: ' + this.game.global.currentUserCalibration.min);
		// console.log('maxExhale: ' + this.game.global.currentUserCalibration.max);
		// console.log('----------------------------\n');

  	var self = this;

  	/*
  	*
  	* MOVEMENT OF ELEMENTS
  	*
  	* */

		if(this.gameOver){
			this.stopEverything();

			// display message for game over
			this.displayOverlay('gameOver');

		} else if(this.stopTheCamera) {
			this.paused = true;
			this.physics.arcade.isPaused = true;
			this.music.pause();

			// this.overlayBackground.visible = true;
			this.displayOverlay('pause');
		} else {
			// make the background scroll
			this.background.tilePosition.x -= this.speed;
		}

		/*
		*
		* COLLISIONS
		*
		* */

		this.physics.arcade.collide(this.duck, [this.scenarioLayer, this.foregroundLayer, this.underwaterLayer, this.enemies], this.duckCollision, this.duckProcessCallback, this);
		this.physics.arcade.collide(this.duck, this.specialBoxesLayer, this.hitSpecialBoxes, null, this);
		this.physics.arcade.collide(this.duck, this.endGameWall, this.endGame, null, this);

		// overlap with water
		// easier to check if duck is under a specific Y, instead of using overlap
		this.duck.y >	 this.world.centerY+60 ? this.duck.alpha = 0.3 : this.duck.alpha = 1;

		// overlap with coins
		this.physics.arcade.overlap(this.duck, this.coins, this.collectCoin, null, this);


		/*
		*
		* CONTROLS
		*
		* */

		this.duck.body.velocity.x = this.speed*60;

		// Underwater gravity (boyancy)
		if( this.duck.body.y > this.world.centerY + 50){
			this.physics.arcade.gravity.y = -800;

			// This 'gap' prevents the infinite bobbing
		}else if( this.duck.body.y < this.world.centerY + 20 && this.duck.body.y >= this.world.centerY + 25 ){
			this.physics.arcade.gravity.thisy = 0;

			// Above water gravity
		}else if( this.duck.body.y < this.world.centerY + 20 ){
			this.physics.arcade.gravity.y = 1000;

			// Surface tension
			// As the player passes through this area, the drag is more the faster they are going
			// This is the key to slowing the player down and preventing them from popping
			// out of the water, then back in, over and over.
		}else{

			// Have a slight amount of gravity so that if they end up resting in this area
			// they will gradually rise to the surface
			this.physics.arcade.gravity.y = -120;

			// Caludlate the drag using the velocity
			// Faster the velocity, higher the drag
			const drag = (( Math.abs(this.duck.body.velocity.y) * 200 ) / 400) + 50;

			// Don't do this if they are trying to swim down
			if( !this.cursors.down.isDown )
				this.duck.body.drag.set(0, drag);
		}

		// controlling with breath
		if(this.pressure < this.game.global.currentUserCalibration.min * this.percentageEffort){
			if(this.duck.body.y > this.world.centerY - 35 && this.duck.body.y < this.world.height - 70)
				this.duck.body.velocity.y = 600;
		}

		if(this.pressure > this.game.global.currentUserCalibration.max * this.percentageEffort){
			console.log('Inside controlling up with breath');
			console.log('---- therefore ' + this.pressure + ' > ' + this.game.global.currentUserCalibration.max * 0.2);
			if(this.duck.body.y <= this.world.centerY + 50 && this.duck.body.y > 100) {
				console.log('-------- inside the -600 thingy');
				this.duck.body.velocity.y = -600;
			}
		}

		// This bit gives the player a little boost if they press and hold the cursor key rather than just tap
		if( this.cursors.up.isDown || this.pressure > this.game.global.currentUserCalibration.max * this.percentageEffort){
			this.duck.body.acceleration.y = -600;
		}else if( this.cursors.down.isDown || this.pressure < this.game.global.currentUserCalibration.min * this.percentageEffort){
			this.duck.body.acceleration.y = 600;
		}else{
			this.duck.body.acceleration.y = 0;
		}
  },

  restart: function () {
    this.state.restart();
  },

  quit: function () {
    this.state.start('menu');
  },

	duckProcessCallback: function(player, tile){
		// disable physics, so player can avoid getting stuck
		return this.enableCollision;
	},

	duckCollision: function (player, object) {

  	// special actions if the object hit is a bee
  	if(object.key === 'bee'){
  		// object.destroy();

  		// spin and fall
			object.animations.play('dead', 10, true);
			object.body.allowGravity = true;

		}

		// do not count collisions on top/bottom of platforms as damaging for health
  	if(player.body.blocked.down || player.body.blocked.up){
  		console.log("Collision from above/below");
		} else {
			this.health -= 10;
			this.enableCollision = false;

			this.duck.tint = 0xFF3333;
			this.add.tween(this.duck).to( { angle: 1440 }, 1000, Phaser.Easing.Linear.None, true);
			this.add.tween(this.duck.scale).to( { x: 3, y: 3 }, 500, Phaser.Easing.Linear.None, true).yoyo(true);

			// update hearts count and display
			for(var i = this.hearts.length-1; i > 0; i--){
				var currentHeart = this.hearts.getAt(i);

				if(currentHeart.key === 'heartFull'){
					currentHeart.loadTexture('heartEmpty');
					break;
				}
			}

			if(this.health === 0){
				this.gameOver = true;
			}

			// set timer to put the collisions back to normal after a while
			this.time.events.add(Phaser.Timer.SECOND * 3, this.resetPlayer, this);
		}
	},

	resetPlayer: function (){
		// this.duck.alpha = 1;
		this.duck.tint = 0xFFFFFF;
		this.enableCollision = true;
	},
	
	collectCoin: function (player, coin) {
		this.score += this.coinValue;
		this.scoreText.setText('score: ' + this.score);
  	coin.kill();
	},

	hitSpecialBoxes: function(player, box){
		/*
		*
		* Randomly, the boxes could mean:
		* - player gets additional heart
		* - for the next 5 seconds, all coins give double amount of points
		*
		* */

		var self = this;

		// remove the element from the screen
		this.map.removeTile(box.x, box.y, this.specialBoxesLayer);

		var choice = this.rnd.between(0,100);
		if(choice > 50){
			// get additional heart, if one has been lost already
			for(var i = 0; i < this.hearts.length; i++){
				var currentHeart = this.hearts.getAt(i);

				if(currentHeart.key === 'heartEmpty'){
					currentHeart.loadTexture('heartFull');

					// update health value as well
					this.health += 10;

					this.showAndRemoveText(this.infoText, 'One heart recovered!');

					break;
				}

				if(i === this.hearts.length-1){
					this.showAndRemoveText(this.infoText,'Already had max health!');
				}
			}
		} else {
			// double amount of points for 5 seconds
			this.coinValue = 20;

			// set timer to put the collisions back to normal after a while
			this.time.events.add(Phaser.Timer.SECOND * 5, function(){
				self.coinValue = 10;
			}, this);

			this.showAndRemoveText(this.infoText,'All coins are double value for 5 seconds!');

			this.coins.forEach(function(coin){
				self.add.tween(coin.scale).to( { x: 1.5, y: 1.5}, 500, Phaser.Easing.Quadratic.InOut, true);
			});

			// destroy it after 3 seconds
			this.time.events.add(Phaser.Timer.SECOND * 5, function(){
				this.coins.forEach(function(coin){
					self.add.tween(coin.scale).to( { x: 1, y: 1 }, 500, Phaser.Easing.Quadratic.InOut, true);
				});
			}, this);
		}

	},

	togglePause: function (isPaused) {

	},

	showAndRemoveText: function (text, message) {

  	//display info text
		text.setText(message);
		text.visible = true;

		// destroy it after 5 seconds
		this.time.events.add(Phaser.Timer.SECOND * 5, function(){
			text.visible=false;
		}, this);
	},

	switchAlphaInstructions: function(arrayElements){
		// if alpha is 0, switch it on. If it's one, do the tween in a for loop for the array

		for(var i = 0; i < arrayElements.length; i++){

			this.add.tween(arrayElements[i]).to( { alpha: 0 }, 500, "Linear", true);
			// if(arrayElements[i].alpha === 0){
			// 	arrayElements[i].alpha = 1;
			// } else {
			// 	arrayElements[i].alpha = 0;
			// 	this.add.tween(arrayElements[i]).to( { alpha: 0 }, 500, "Linear", true);
			// 	tween.onComplete.add(function(){
			// 		arrayElements[i].kill();
			// 	}, this)
			// }
		}
	},

	displayOverlay: function(gameState){
		this.overlayBackground.visible = true;
		this.overlayText.visible = true;

  	// gamestate can have values "pause", "gameOver", "gameEnd"
		if(gameState === 'pause'){
			this.overlayText.setText('Game paused, click the pause button to resume.');
		} else if(gameState === 'gameOver' || gameState === 'gameEnd'){
			// this.overlayText.inputEnabled = true;
			this.overlayText.setText('Well done! Play again?');
			this.okBtn.visible = true;
			this.backToMenuBtn.visible = true;

			this.saveScoreOnDb();

		} else {
			console.log('You are not supposed to be here...');
		}
	},

	getRankingFromDb: function () {
		var self = this;

		console.log('Inside the getRankingFromDb function');

		if(!this.rankingRetrieved){
			// make sure this request is done only once
			self.rankingRetrieved = true;

			// connect to API to retrieve all users and order them to display the ranking
			var xhr  = new XMLHttpRequest();
			xhr.open('GET', 'https://duchennegame.herokuapp.com/api/users', true);
			xhr.onload = function () {
				var users = JSON.parse(xhr.responseText);

				if (xhr.readyState == 4 && xhr.status == "200") {
					console.log('Correctly retrieved data of users for ranking');
					users = users.sort(function(a,b) {return b.high_score - a.high_score;});
					var userAlreadyDisplayed = false;

					// display the ranking, username and high_score
					for(var i = 0; i < users.length; i++){
						// display the first 5 high ranked users
						if(i <= 4){
							if(users[i].id === self.game.global.currentUser.id){
								userAlreadyDisplayed = true;

								self.add.text(self.camera.x + 300, self.camera.height * 0.3 + 50 * i+1, i+1, self.game.global.currentPlayerRankingStyle).anchor.setTo(0.5);
								self.add.text(self.camera.x + 350, self.camera.height * 0.3 + 50 * i+1, users[i].name, self.game.global.currentPlayerRankingStyle).anchor.setTo(0.5);
								self.add.text(self.camera.x + 450, self.camera.height * 0.3 + 50 * i+1, users[i].high_score, self.game.global.currentPlayerRankingStyle).anchor.setTo(0.5);
							} else {
								self.add.text(self.camera.x + 300, self.camera.height * 0.3 + 50 * i + 1, i + 1, self.game.global.otherPlayersRankingStyle).anchor.setTo(0.5);
								self.add.text(self.camera.x + 350, self.camera.height * 0.3 + 50 * i + 1, users[i].name, self.game.global.otherPlayersRankingStyle).anchor.setTo(0.5);
								self.add.text(self.camera.x + 450, self.camera.height * 0.3 + 50 * i + 1, users[i].high_score, self.game.global.otherPlayersRankingStyle).anchor.setTo(0.5);
							}
						} else {
							if(users[i].id === self.game.global.currentUser.id && !userAlreadyDisplayed){
								self.add.text(self.camera.x + 300, self.camera.height * 0.6, i+1, self.game.global.currentPlayerRankingStyle).anchor.setTo(0.5);
								self.add.text(self.camera.x + 350, self.camera.height * 0.6, users[i].name, self.game.global.currentPlayerRankingStyle).anchor.setTo(0.5);
								self.add.text(self.camera.x + 450, self.camera.height * 0.6, users[i].high_score, self.game.global.currentPlayerRankingStyle).anchor.setTo(0.5);
							}
						}
					}
				} else {
					console.error(users);
				}
			};
			xhr.send(null);
		}
	},

	saveScoreOnDb: function () {
		var self = this;

		if(!this.scoreUpdated && this.score > this.game.global.currentUser.high_score){
			// do this just once
			this.scoreUpdated = true;

			// save current score on Db
			var xhttp = new XMLHttpRequest();
			xhttp.open("PUT", "https://duchennegame.herokuapp.com/api/users/" + this.game.global.currentUser.id, true);
			xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
			var input = JSON.stringify({
				'high_score': self.score
			});
			xhttp.send(input);

			xhttp.onreadystatechange = function() {//Call a function when the state changes.
				if(xhttp.readyState == XMLHttpRequest.DONE && xhttp.status == 200) {
					// Once the user has been inserted, call the function that gets all users
					console.log('Score saved, now calling the ranking function');
					self.getRankingFromDb();
				}
			};
		}
	},

	stopEverything: function(){
		// stop the whole scene
		this.physics.arcade.isPaused = true;
		this.paused = true;

		// stop the music, perhaps play another sound
		this.music.stop();
	},

	endGame: function () {
  	console.log('collision with the endWall!');
  	this.stopEverything();
		this.displayOverlay('gameEnd');
	}

};
