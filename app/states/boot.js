module.exports = {

  init: function () {
  	var self = this;

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

		// load Google Fonts
		WebFontConfig = {

			//  'active' means all requested fonts have finished loading
			//  We set a 1 second delay before calling 'createText'.
			//  For some reason if we don't the browser cannot render the text the first time it's created.
			// active: function() { self.time.events.add(Phaser.Timer.SECOND, null, self); },

			//  The Google Fonts we want to load (specify as many as you like in the array)
			google: {
				families: ['Open Sans', 'Patua One']
			}

		};
  },

  preload: function () {

		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.setScreenSize = true;
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;
		this.forceSingleUpdate = true;

		//  Load the Google WebFont Loader script
		this.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

		// load UI elements
		this.load.atlasJSONHash('button', 'assets/sprites/button.png', 'assets/sprites/button.json');
		this.load.image('gear', 'assets/sprites/gear.png');
		this.load.image('leaderboard', 'assets/sprites/leaderboardsComplex.png');
		this.load.image('arrowBack', 'assets/sprites/arrowLeft.png');
		this.load.image('bar', 'assets/sprites/bar.png');

		// load general assets
    this.load.setPreloadSprite(this.bar);
    this.load.image('background', 'assets/sprites/bg_desert.png');
    this.load.image('background_menu', 'assets/sprites/forest_bg.png');
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
		this.load.tilemap('tilemap_training', 'assets/tilemaps/training_level.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.image('tiles', 'assets/tilemaps/tiles_spritesheet.png');
		this.load.image('bee_tiles', 'assets/sprites/bee.png');


		// load song
		this.load.audio('song', ['assets/audio/song.mp3', 'assets/audio/song.ogg']);
		this.load.audio('beethoven', 'assets/audio/beethoven_crossfade_v4.mp3');
  },

  create: function () {
    this.state.start('menu');
  },
  
  shutdown: function () {
    this.whitePixel.destroy();
    this.whitePixel = null;
  }

};
