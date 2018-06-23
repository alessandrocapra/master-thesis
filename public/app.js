(function() {
	'use strict';

	var globals = typeof global === 'undefined' ? self : global;
	if (typeof globals.require === 'function') return;

	var modules = {};
	var cache = {};
	var aliases = {};
	var has = {}.hasOwnProperty;

	var expRe = /^\.\.?(\/|$)/;
	var expand = function(root, name) {
		var results = [], part;
		var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
		for (var i = 0, length = parts.length; i < length; i++) {
			part = parts[i];
			if (part === '..') {
				results.pop();
			} else if (part !== '.' && part !== '') {
				results.push(part);
			}
		}
		return results.join('/');
	};

	var dirname = function(path) {
		return path.split('/').slice(0, -1).join('/');
	};

	var localRequire = function(path) {
		return function expanded(name) {
			var absolute = expand(dirname(path), name);
			return globals.require(absolute, path);
		};
	};

	var initModule = function(name, definition) {
		var hot = hmr && hmr.createHot(name);
		var module = {id: name, exports: {}, hot: hot};
		cache[name] = module;
		definition(module.exports, localRequire(name), module);
		return module.exports;
	};

	var expandAlias = function(name) {
		return aliases[name] ? expandAlias(aliases[name]) : name;
	};

	var _resolve = function(name, dep) {
		return expandAlias(expand(dirname(name), dep));
	};

	var require = function(name, loaderPath) {
		if (loaderPath == null) loaderPath = '/';
		var path = expandAlias(name);

		if (has.call(cache, path)) return cache[path].exports;
		if (has.call(modules, path)) return initModule(path, modules[path]);

		throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
	};

	require.alias = function(from, to) {
		aliases[to] = from;
	};

	var extRe = /\.[^.\/]+$/;
	var indexRe = /\/index(\.[^\/]+)?$/;
	var addExtensions = function(bundle) {
		if (extRe.test(bundle)) {
			var alias = bundle.replace(extRe, '');
			if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
				aliases[alias] = bundle;
			}
		}

		if (indexRe.test(bundle)) {
			var iAlias = bundle.replace(indexRe, '');
			if (!has.call(aliases, iAlias)) {
				aliases[iAlias] = bundle;
			}
		}
	};

	require.register = require.define = function(bundle, fn) {
		if (bundle && typeof bundle === 'object') {
			for (var key in bundle) {
				if (has.call(bundle, key)) {
					require.register(key, bundle[key]);
				}
			}
		} else {
			modules[bundle] = fn;
			delete cache[bundle];
			addExtensions(bundle);
		}
	};

	require.list = function() {
		var list = [];
		for (var item in modules) {
			if (has.call(modules, item)) {
				list.push(item);
			}
		}
		return list;
	};

	var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
	require._cache = cache;
	require.hmr = hmr && hmr.wrap;
	require.brunch = true;
	globals.require = require;
})();

(function() {
	var global = typeof window === 'undefined' ? this : window;
	var __makeRelativeRequire = function(require, mappings, pref) {
		var none = {};
		var tryReq = function(name, pref) {
			var val;
			try {
				val = require(pref + '/node_modules/' + name);
				return val;
			} catch (e) {
				if (e.toString().indexOf('Cannot find module') === -1) {
					throw e;
				}

				if (pref.indexOf('node_modules') !== -1) {
					var s = pref.split('/');
					var i = s.lastIndexOf('node_modules');
					var newPref = s.slice(0, i).join('/');
					return tryReq(name, newPref);
				}
			}
			return none;
		};
		return function(name) {
			if (name in mappings) name = mappings[name];
			if (!name) return;
			if (name[0] !== '.' && pref) {
				var val = tryReq(name, pref);
				if (val !== none) return val;
			}
			return require(name);
		}
	};
	require.register("initialize.js", function(exports, require, module) {
		'use strict';

		var game = window.GAME = new Phaser.Game({
			// See <https://photonstorm.github.io/phaser-ce/global.html#GameConfig>
			// antialias:               true,
			// backgroundColor:         0x000000,
			// disableVisibilityChange: false,
			// enableDebug:             true,
			height: 630,
			renderer: Phaser.AUTO,
			// resolution:              1,
			// scaleMode:               Phaser.ScaleManager.NO_SCALE,
			// transparent:             false,
			width: 800
		});

		game.state.add('boot', require('states/boot'));
		game.state.add('game', require('states/game'));
		game.state.add('menu', require('states/menu'));
		game.state.add('login', require('states/login'));

		game.state.start('boot');
	});

	require.register("states/boot.js", function(exports, require, module) {
		'use strict';

		module.exports = {

			init: function init() {
				this.input.maxPointers = 1;
				this.game.renderer.renderSession.roundPixels = true;
				this.tweens.frameBased = true;

				this.whitePixel = this.add.bitmapData(1, 1);
				this.whitePixel.fill(255, 255, 255);

				this.bar = this.whitePixel.addToWorld();
				this.bar.width = 100;
				this.bar.height = 10;
				this.bar.alignIn(this.world.bounds, Phaser.CENTER);

				// importing plugin to handle input boxes
				this.add.plugin(PhaserInput.Plugin);
			},

			preload: function preload() {

				this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
				this.scale.setScreenSize = true;
				this.scale.pageAlignHorizontally = true;
				this.scale.pageAlignVertically = true;
				this.forceSingleUpdate = true;

				// load UI elements
				this.load.atlasJSONHash('button', 'assets/sprites/button.png', 'assets/sprites/button.json');

				// load general assets
				this.load.setPreloadSprite(this.bar);
				this.load.image('background', 'assets/sprites/bg_desert.png');
				this.load.spritesheet('duck', 'assets/sprites/chick.png', 16, 18);
				this.load.spritesheet('coin', 'assets/sprites/coin.png', 32, 32);
				this.load.image('heartFull', 'assets/sprites/hud_heartFull.png');
				this.load.image('heartEmpty', 'assets/sprites/hud_heartEmpty.png');
				this.load.image('overlay', 'assets/sprites/overlay.png');
				this.load.image('pauseButton', 'assets/sprites/pause_button.png');
				// this.load.image('arrowUp', 'assets/sprites/arrow.png');
				this.load.image('mouth', 'assets/sprites/mouth.png');
				this.load.image('nose', 'assets/sprites/nose.png');

				// loading bee animation
				this.load.spritesheet('bee', 'assets/sprites/bee.png', 56, 48);

				// loading tileset
				// this.load.tilemap('tilemap', 'assets/tilemaps/level2.json', null, Phaser.Tilemap.TILED_JSON);
				this.load.tilemap('tilemap', 'assets/tilemaps/fast_exhalations_dolphin.json', null, Phaser.Tilemap.TILED_JSON);
				this.load.image('tiles', 'assets/tilemaps/tiles_spritesheet.png');
				this.load.image('bee_tiles', 'assets/sprites/bee.png');

				// load song
				this.load.audio('song', ['assets/audio/song.mp3', 'assets/audio/song.ogg']);
			},

			create: function create() {
				this.state.start('menu');
			},

			shutdown: function shutdown() {
				this.whitePixel.destroy();
				this.whitePixel = null;
			}

		};
	});

	require.register("states/game.js", function(exports, require, module) {
		'use strict';

		module.exports = {

			create: function create() {
				var _this = this;

				var world = this.world;
				// keep reference of Scene scope
				var self = this;
				// set the velocity to which the level moves
				var speed = this.speed = 3;

				// delay the music start
				this.time.events.add(Phaser.Timer.SECOND * 7.8, function () {
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

				var background = this.background = this.add.tileSprite(0, 0, world.width, world.height, 'background');
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
				this.enemies.callAll('animations.add', 'animations', 'fly', [0, 2], 10, true);
				this.enemies.callAll('animations.play', 'animations', 'fly');
				this.enemies.callAll('animations.add', 'animations', 'dead', [1], 10, true);
				this.enemies.setAll('body.allowGravity', false);

				// make enemies pulse to rhythm
				this.enemies.forEach(function (bee) {
					self.add.tween(bee.scale).to({ x: 1.2, y: 1.2 }, 480, Phaser.Easing.Back.InOut, true, 0, false);
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
				this.style = { font: "bold 24px Arial", fill: "#000" };
				this.scoreText = this.add.text(400, 40, "score: 0", this.style);
				this.scoreText.anchor.setTo(0.5, 0.5);
				// fix to camera
				this.scoreText.fixedToCamera = true;

				// info text for special boxes
				this.infoText = this.add.text(this.world.centerX, this.world.height * 0.3, 'Special boxes');
				this.infoText.anchor.setTo(0.5, 0.5);
				this.infoText.visible = false;
				// fix to camera
				this.infoText.fixedToCamera = true;

				/*
			*
			* Initial instructions when the game starts
			*
			* */

				// arrows for instructions at the beginning
				// var arrowUp = this.arrowUp = this.add.sprite(this.world.centerX*0.6, this.world.height*0.4, 'arrowUp');
				// arrowUp.scale.setTo(0.05,0.05);
				// arrowUp.anchor.setTo(.5,.5);
				// arrowUp.fixedToCamera = true;
				//
				// var arrowDown = this.arrowDown = this.add.sprite(this.world.centerX*0.6, this.world.height*0.5, 'arrowUp')
				// arrowDown.scale.setTo(0.05,0.05);
				// arrowDown.anchor.setTo(.5,.5);
				// // flip it horizontally
				// arrowDown.scale.y *= -1;
				// arrowDown.fixedToCamera = true;


				var mouth = this.mouth = this.add.sprite(this.camera.width * 0.4, this.world.height * 0.4, 'mouth');
				mouth.scale.setTo(0.1, 0.1);
				mouth.anchor.setTo(0.5, 0.5);
				mouth.fixedToCamera = true;

				var nose = this.nose = this.add.sprite(this.camera.width * 0.4, this.world.height * 0.52, 'nose');
				nose.scale.setTo(0.1, 0.1);
				nose.anchor.setTo(0.5, 0.5);
				// flip it horizontally
				// arrowDown.scale.y *= -1;
				nose.fixedToCamera = true;

				// add text for the arrows explanation
				this.mouthText = this.add.text(this.camera.width * 0.56, this.world.height * 0.4, 'Jump and fly', { align: "left", boundsAlignH: "left", boundsAlignV: "middle" });
				this.mouthText.anchor.setTo(0.5, 0.5);
				// fix to camera
				this.mouthText.fixedToCamera = true;

				this.noseText = this.add.text(this.camera.width * 0.58, this.world.height * 0.52, 'Go under water', { align: "left", boundsAlignH: "left", boundsAlignV: "middle" });
				this.noseText.anchor.setTo(0.5, 0.5);
				// fix to camera
				this.noseText.fixedToCamera = true;

				// destroy the icons and text after 5 seconds
				this.time.events.add(Phaser.Timer.SECOND * 5, function () {
					// debugger;
					// tween to make instructions nicely disappear
					this.switchAlphaInstructions([this.mouth, this.nose, this.mouthText, this.noseText]);
				}, this);

				// hearts for health
				this.hearts = this.add.group();
				for (var i = 0; i < 6; i++) {
					this.hearts.create(50 + i * 45, 40, 'heartFull');
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

				this.overlayText = this.add.text(0, 0, 'Text goes here', { align: "center", font: "bold 24px Arial", fill: "#fff" });
				this.overlayText.anchor.set(0.5, 0.5);

				// add the text as child of the background container
				this.overlayBackground.addChild(this.overlayText);
				// this.overlayText.fixedToCamera = true;

				this.overlayBackground.fixedToCamera = true;
				this.overlayBackground.visible = false;
				this.overlayText.visible = false;

				// OK button for restarting the game
				this.okBtn = this.add.sprite(this.camera.width * 0.5, this.camera.height * 0.6, 'button', 'blue_button04.png');
				this.okBtn.anchor.set(0.5);
				// this.overlayBackground.addChild(this.okBtn);
				this.okBtn.inputEnabled = true;
				this.okBtn.input.useHandCursor = true;
				this.okBtn.visible = false;

				this.okBtnText = this.add.text(0, 0, 'Ja', { align: "center" });
				this.okBtnText.anchor.set(0.5);
				this.okBtn.addChild(this.okBtnText);
				this.okBtn.fixedToCamera = true;

				this.okBtn.events.onInputUp.add(function () {
					// setting instructions back to visible
					self.switchAlphaInstructions([self.mouth, self.nose, self.mouthText, self.noseText]);

					self.state.restart();
				});

				// Create pause button
				this.pauseButton = this.add.image(this.camera.width - 40, 40, 'pauseButton');
				this.pauseButton.scale.setTo(0.1, 0.1);
				this.pauseButton.anchor.setTo(0.5, 0.5);
				this.pauseButton.inputEnabled = true;
				// fix to camera
				this.pauseButton.fixedToCamera = true;

				this.pauseButton.events.onInputUp.add(function () {
					// When the pause button is pressed, we pause the game
					console.log('button pressed!');

					// stop camera
					if (!self.stopTheCamera) {
						self.stopTheCamera = true;
					} else {
						self.music.resume();
						self.paused = false;
						self.physics.arcade.isPaused = !self.physics.arcade.isPaused;
						self.overlayBackground.visible = false;

						self.stopTheCamera = false;
					}
				});

				// define duck and its properties
				var duck = this.duck = this.add.sprite(80, world.centerY + 50, 'duck');
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

				groundLayer.resizeWorld();

				var cursors = this.cursors = this.input.keyboard.createCursorKeys();

				cursors.down.onDown.add(function () {
					if (_this.duck.body.y > _this.world.centerY - 35 && _this.duck.body.y < _this.world.height - 70) _this.duck.body.velocity.y = 600;
				});

				cursors.up.onDown.add(function () {
					if (_this.duck.body.y <= _this.world.centerY + 50 && _this.duck.body.y > 100) _this.duck.body.velocity.y = -600;
				});
			},

			update: function update() {

				var self = this;

				// if(this.duck.x > this.world.width * 0.05){
				// this.state.start('menu');
				// }

				/*
			*
			* MOVEMENT OF ELEMENTS
			*
			* */

				if (this.gameOver) {
					// stop the whole scene
					this.physics.arcade.isPaused = true;
					this.paused = true;

					// stop the music, perhaps play another sound
					this.music.stop();

					// display message for game over
					this.displayOverlay('gameOver');
				} else if (this.stopTheCamera) {
					this.paused = true;
					this.physics.arcade.isPaused = true;
					this.music.pause();

					this.overlayBackground.visible = true;
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

				// overlap with water
				// easier to check if duck is under a specific Y, instead of using overlap
				this.duck.y > this.world.centerY + 60 ? this.duck.alpha = 0.3 : this.duck.alpha = 1;

				// overlap with coins
				this.physics.arcade.overlap(this.duck, this.coins, this.collectCoin, null, this);

				/*
			*
			* CONTROLS
			*
			* */

				this.duck.body.velocity.x = this.speed * 60;

				// Underwater gravity (boyancy)
				if (this.duck.body.y > this.world.centerY + 50) {
					this.physics.arcade.gravity.y = -800;

					// This 'gap' prevents the infinite bobbing
				} else if (this.duck.body.y < this.world.centerY + 20 && this.duck.body.y >= this.world.centerY + 25) {
					this.physics.arcade.gravity.thisy = 0;

					// Above water gravity
				} else if (this.duck.body.y < this.world.centerY + 20) {
					this.physics.arcade.gravity.y = 1000;

					// Surface tension
					// As the player passes through this area, the drag is more the faster they are going
					// This is the key to slowing the player down and preventing them from popping
					// out of the water, then back in, over and over.
				} else {

					// Have a slight amount of gravity so that if they end up resting in this area
					// they will gradually rise to the surface
					this.physics.arcade.gravity.y = -120;

					// Caludlate the drag using the velocity
					// Faster the velocity, higher the drag
					var drag = Math.abs(this.duck.body.velocity.y) * 200 / 400 + 50;

					// Don't do this if they are trying to swim down
					if (!this.cursors.down.isDown) this.duck.body.drag.set(0, drag);
				}

				// This bit gives the player a little boost if they press and hold the cursor key rather than just tap
				if (this.cursors.up.isDown) {
					this.duck.body.acceleration.y = -600;
				} else if (this.cursors.down.isDown) {
					this.duck.body.acceleration.y = 600;
				} else {
					this.duck.body.acceleration.y = 0;
				}
			},

			restart: function restart() {
				this.state.restart();
			},

			quit: function quit() {
				this.state.start('menu');
			},

			duckProcessCallback: function duckProcessCallback(player, tile) {
				// disable physics, so player can avoid getting stuck
				return this.enableCollision;
			},

			duckCollision: function duckCollision(player, object) {

				// special actions if the object hit is a bee
				if (object.key === 'bee') {
					// object.destroy();

					// spin and fall
					object.animations.play('dead', 10, true);
					object.body.allowGravity = true;
				}

				// do not count collisions on top/bottom of platforms as damaging for health
				if (player.body.blocked.down || player.body.blocked.up) {
					console.log("Collision from above/below");
				} else {
					this.health -= 10;
					this.enableCollision = false;

					this.duck.tint = 0xFF3333;
					this.add.tween(this.duck).to({ angle: 1440 }, 1000, Phaser.Easing.Linear.None, true);
					this.add.tween(this.duck.scale).to({ x: 3, y: 3 }, 500, Phaser.Easing.Linear.None, true).yoyo(true);

					// update hearts count and display
					for (var i = this.hearts.length - 1; i > 0; i--) {
						var currentHeart = this.hearts.getAt(i);

						if (currentHeart.key === 'heartFull') {
							currentHeart.loadTexture('heartEmpty');
							break;
						}
					}

					if (this.health === 0) {
						this.gameOver = true;
					}

					// set timer to put the collisions back to normal after a while
					this.time.events.add(Phaser.Timer.SECOND * 3, this.resetPlayer, this);
				}
			},

			resetPlayer: function resetPlayer() {
				// this.duck.alpha = 1;
				this.duck.tint = 0xFFFFFF;
				this.enableCollision = true;
			},

			collectCoin: function collectCoin(player, coin) {
				this.score += this.coinValue;
				this.scoreText.setText('score: ' + this.score);
				coin.kill();
			},

			hitSpecialBoxes: function hitSpecialBoxes(player, box) {
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

				var choice = this.rnd.between(0, 100);
				if (choice > 50) {
					// get additional heart, if one has been lost already
					for (var i = 0; i < this.hearts.length; i++) {
						var currentHeart = this.hearts.getAt(i);

						if (currentHeart.key === 'heartEmpty') {
							currentHeart.loadTexture('heartFull');

							// update health value as well
							this.health += 10;

							this.showAndRemoveText(this.infoText, 'One heart recovered!');

							break;
						}

						if (i === this.hearts.length - 1) {
							this.showAndRemoveText(this.infoText, 'Already had max health!');
						}
					}
				} else {
					// double amount of points for 5 seconds
					this.coinValue = 20;

					// set timer to put the collisions back to normal after a while
					this.time.events.add(Phaser.Timer.SECOND * 5, function () {
						self.coinValue = 10;
					}, this);

					this.showAndRemoveText(this.infoText, 'All coins are double value for 5 seconds!');

					this.coins.forEach(function (coin) {
						self.add.tween(coin.scale).to({ x: 1.5, y: 1.5 }, 500, Phaser.Easing.Quadratic.InOut, true);
					});

					// destroy it after 3 seconds
					this.time.events.add(Phaser.Timer.SECOND * 5, function () {
						this.coins.forEach(function (coin) {
							self.add.tween(coin.scale).to({ x: 1, y: 1 }, 500, Phaser.Easing.Quadratic.InOut, true);
						});
					}, this);
				}
			},

			togglePause: function togglePause(isPaused) {},

			showAndRemoveText: function showAndRemoveText(text, message) {

				//display info text
				text.setText(message);
				text.visible = true;

				// destroy it after 5 seconds
				this.time.events.add(Phaser.Timer.SECOND * 5, function () {
					text.visible = false;
				}, this);
			},

			switchAlphaInstructions: function switchAlphaInstructions(arrayElements) {
				// if alpha is 0, switch it on. If it's one, do the tween in a for loop for the array

				for (var i = 0; i < arrayElements.length; i++) {

					this.add.tween(arrayElements[i]).to({ alpha: 0 }, 500, "Linear", true);
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

			displayOverlay: function displayOverlay(gameState) {
				this.overlayBackground.visible = true;
				this.overlayText.visible = true;

				// gamestate can have values "pause", "gameOver", "gameEnd"
				if (gameState === 'pause') {} else if (gameState === 'gameOver') {
					// this.overlayText.inputEnabled = true;
					this.overlayText.setText('Well done! Play again?');
					this.okBtn.visible = true;
				} else if (gameState === 'gameEnd') {} else {
					console.log('You are not supposed to be here...');
				}
			}

		};
	});

	require.register("states/login.js", function(exports, require, module) {
		'use strict';

		module.exports = {

			create: function create() {

				var title = this.add.text(this.world.centerX, 200, 'Login', {
					fill: 'white',
					font: '80px Arial'
				});
				title.anchor.set(0.5);
				// title.alignIn(this.world, Phaser.CENTER);

				this.nameInput = this.add.inputField(this.world.centerX - 140, this.world.centerY - 50, {
					font: '20px Arial',
					width: 250,
					padding: 16,
					borderWidth: 3,
					borderColor: '#2cc0ff',
					borderRadius: 6,
					placeHolder: 'Name'
				});

				this.passwordInput = this.add.inputField(this.world.centerX - 140, this.world.centerY + 25, {
					font: '20px Arial',
					width: 250,
					padding: 16,
					borderWidth: 3,
					borderColor: '#2cc0ff',
					borderRadius: 6,
					placeHolder: 'Password',
					type: PhaserInput.InputType.password
				});

				var xhr = new XMLHttpRequest();
				xhr.open('GET', 'https://duchennegame.herokuapp.com/api/users', true);
				xhr.onload = function () {
					var users = JSON.parse(xhr.responseText);
					if (xhr.readyState == 4 && xhr.status == "200") {
						console.table(users);
					} else {
						console.error(users);
					}
				};
				xhr.send(null);

				// login button and text
				var checkLoginBtn = this.checkLoginBtn = this.add.sprite(this.world.centerX, this.world.centerY + 140, 'button', 'blue_button04.png');
				checkLoginBtn.anchor.set(0.5, 0.5);
				checkLoginBtn.inputEnabled = true;
				checkLoginBtn.input.useHandCursor = true;

				var chechLoginText = this.add.text(0, 0, 'Login', { align: "center" });
				chechLoginText.anchor.set(0.5, 0.5);

				checkLoginBtn.addChild(chechLoginText);

				// debugger;
				checkLoginBtn.events.onInputDown.add(this.checkLogin(this.nameInput.value, this.passwordInput.value), this);

				// this.input.onTap.add(this.startGame.bind(this));
			},

			startGame: function startGame() {
				this.state.start('game');
			},

			checkLogin: function checkLogin(name, password) {
				console.table(name, password);
			}

		};
	});

	require.register("states/menu.js", function(exports, require, module) {
		'use strict';

		module.exports = {

			create: function create() {
				var title = this.add.text(0, 0, 'Duck Quest', {
					fill: 'white',
					font: '100px fantasy'
				});
				title.alignIn(this.world, Phaser.CENTER);

				// login button and text
				var loginButton = this.button = this.add.sprite(this.world.centerX, this.world.centerY + 100, 'button', 'blue_button04.png');
				loginButton.anchor.set(0.5, 0.5);
				loginButton.inputEnabled = true;
				loginButton.input.useHandCursor = true;

				var logintext = this.add.text(0, 0, 'Login', { align: "center" });
				logintext.anchor.set(0.5, 0.5);

				loginButton.addChild(logintext);
				loginButton.events.onInputDown.add(this.loginPage, this);

				// this.input.onTap.add(this.startGame.bind(this));

				// add login and sign in buttons
				// this.state.start('login');
			},

			startGame: function startGame() {
				this.state.start('game');
			},

			loginPage: function loginPage() {
				this.state.start('login');
			}

		};
	});

	require.register("___globals___", function(exports, require, module) {

	});})();require('___globals___');

require('initialize');
//# sourceMappingURL=app.js.map