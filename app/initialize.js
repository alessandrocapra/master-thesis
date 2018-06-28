var game = window.GAME = new Phaser.Game({
  // See <https://photonstorm.github.io/phaser-ce/global.html#GameConfig>
  // antialias:               true,
  // backgroundColor:         0x000000,
  // disableVisibilityChange: false,
  // enableDebug:             true,
  height:                  630,
  renderer:                Phaser.AUTO,
  // resolution:              1,
  // scaleMode:               Phaser.ScaleManager.NO_SCALE,
  // transparent:             false,
  width:                   800,
});

game.global = {
	// global vars to store important data that goes throughout scenes
  inputDevice: 'keyboard_touch',
  currentUser: {},
	currentUserCalibration: {
  	min: 0,
		max: 0
	},
	pressureEffort: 0.8,

	// general styling
	primaryColorHex: "#2cb2ed",
	primaryColorTint: "0x2cb2ed",

  // title styling and placement
  titlePlacement: {
    x: 400,
    y: 170
  },
  titleStyle: {
		fill: 'white',
		font: '60px Arial'
	},

	// button label styling
	buttonLabelStyle : {
		font: "20px Arial",
		align: "center"
  },

	// ranking styling
	otherPlayersRankingStyle :{
		font: '22px Arial',
  	fill: 'white',
	},
	currentPlayerRankingStyle : {
		font: '22px Arial',
		fill: "#2cb2ed",
		fontWeight: 'bold'
	}
};

game.state.add('boot', require('states/boot'));
game.state.add('menu', require('states/menu'));
game.state.add('login', require('states/login'));
game.state.add('signup', require('states/signup'));
game.state.add('welcome', require('states/welcome'));
game.state.add('ranking', require('states/ranking'));
game.state.add('settings', require('states/settings'));
game.state.add('calibration1', require('states/calibration1'));
game.state.add('calibration2', require('states/calibration2'));
game.state.add('training_level', require('states/training_level'));
game.state.add('game', require('states/game'));

game.state.start('boot');
