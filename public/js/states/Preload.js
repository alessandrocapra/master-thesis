var MrHop = MrHop || {};

//loading the game assets
MrHop.PreloadState = {
  preload: function() {
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 128, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);
    this.load.setPreloadSprite(this.preloadBar);

    this.logo = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
    this.logo.anchor.setTo(0.5);

    //load game assets
    this.load.image('floor', 'assets/images/floor.png');
    this.load.image('floor1', 'assets/images/floor1.png');
    this.load.image('hurt', 'assets/images/p2_hurt.png');
    this.load.image('background', 'assets/images/mf_bg.png');
    this.load.image('background1', 'assets/images/bg_desert.png');
    this.load.image('coin', 'assets/images/coinGold.png');
    this.load.image('cactus', 'assets/images/cactus.png');
    this.load.image('star', 'assets/images/star.png');
    this.load.image('water', 'assets/images/liquidWaterTop.png');
    this.load.image('slime1', 'assets/images/slimeWalk1.png');
    this.load.spritesheet('player', 'assets/images/knightrun.png', 80,98,6,0,2);
    this.load.spritesheet('player1', 'assets/images/p2_walk.png', 80,94,9,0,0);
    this.load.spritesheet('player2', 'assets/images/p1_walk.png', 80,94,9,0,0);
    this.load.spritesheet('slime', 'assets/images/slime.png', 52,26,3,0,0);
    this.load.spritesheet('bird', 'assets/images/birdWalk.png', 75,36,3,0,0);
    this.load.spritesheet('fish', 'assets/images/fishSwim.png', 66,42,3,0,0);
    this.load.spritesheet('splash', 'assets/images/splash.png', 62,32,8,0,0);
    this.load.spritesheet('button', 'assets/images/button.png', 267,52);
    this.load.audio('coinsound', ['assets/audio/Collect_Point_01.mp3', 'assets/audio/Collect_Point_01.ogg']);
    this.load.audio('musicsound', ['assets/audio/greenhill.mp3', 'assets/audio/greenhill.ogg']);
    this.load.audio('jumpsound', ['assets/audio/jumpsound.mp3', 'assets/audio/jumpsound.ogg']);
    this.load.audio('losesound', ['assets/audio/Jingle_Lose_00.mp3', 'assets/audio/Jingle_Lose_00.ogg']);
    this.load.audio('hitsound', ['assets/audio/Hit_03.mp3', 'assets/audio/Hit_03.ogg']);
    this.load.audio('hitenemysound', ['assets/audio/Hit_01.mp3', 'assets/audio/Hit_01.ogg']);
    this.load.audio('playsound', ['assets/audio/Menu_Navigate_03.mp3', 'assets/audio/Menu_Navigate_03.ogg']);
    this.load.audio('hitstarsound', ['assets/audio/Jingle_Achievement_00.mp3', 'assets/audio/Jingle_Achievement_00.ogg']);
    this.load.audio('hitstarsound1', ['assets/audio/06-power-up.mp3', 'assets/audio/06-power-up.ogg']);
    this.load.audio('hitenemysound', ['assets/audio/Hit_00.mp3', 'assets/audio/Hit_00.ogg']);
    this.load.audio('theme', ['assets/audio/Dimensions.mp3', 'assets/audio/Dimensions.ogg']);
    this.load.audio('splash', ['assets/audio/splash.mp3', 'assets/audio/splash.ogg']);
    this.load.audio('theme1', ['assets/audio/14-bury-my-shell-at-wounded-knee.mp3', 'assets/audio/14-bury-my-shell-at-wounded-knee.ogg']);
    this.load.audio('theme2', ['assets/audio/08-sewer-surfin-.mp3', 'assets/audio/08-sewer-surfin-.ogg']);
    this.load.audio('theme3', ['assets/audio/05-boss-battle.mp3', 'assets/audio/05-boss-battle.ogg']);
    this.game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
  },
  create: function() {
    this.state.start('HomeState');
  }
};
