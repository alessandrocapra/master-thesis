var FlappyBoard = FlappyBoard || {};

//setting game configuration and loading the assets for the loading screen
FlappyBoard.BootState = {
  init: function() {
    //loading screen will have a white background
    this.game.stage.backgroundColor = '#fff';
    
    //scaling options
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    
    //have the game centered horizontally
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    //physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE);  
	
	
  },
  preload: function() {
    //assets we'll use in the loading screen
    this.load.image('preloadbar', 'assets/images/bar.png');
	this.load.image('logo', 'assets/images/logo.png');
  },
  create: function() {
    this.state.start('PreloadState');
  }
};