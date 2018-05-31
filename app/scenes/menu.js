var CONST = require('data/const');

module.exports = {

  key: 'menu',

  init: function (data) {
    console.debug('init', this.scene.key, data, this);
  },

  create: function () {
    var self = this;

    this.add.image(400, 300, 'sky')
      .setAlpha(0.5);

    this.startText = this.add.text(400, 300, 'START', {
      fill: 'white',
      fontFamily: CONST.fonts.default,
      fontSize: 48
    })
      .setOrigin(0.5)
      .setShadow(0, 1, CONST.colors.aqua, 10);

    this.calibrationText = this.add.text(400, 450, 'Calibration', {
      fill: CONST.colors.aqua,
      fontFamily: CONST.fonts.default,
      fontSize: 30
    })
      .setOrigin(0.5)
      .setShadow(0, 1, 'black', 5);

    // this.input.once('pointerdown', this.start, this);

    // make the two texts clickable
		this.startText.setInteractive(new Phaser.Geom.Rectangle(0, 0, this.startText.width, this.startText.height), Phaser.Geom.Rectangle.Contains);
		this.calibrationText.setInteractive(new Phaser.Geom.Rectangle(0, 0, this.calibrationText.width, this.calibrationText.height), Phaser.Geom.Rectangle.Contains);

		// highlighting selected text
		this.input.on('pointerover', function (event, gameObjects) {
			gameObjects[0].setTint(0xffff00);
		});

		this.input.on('pointerout', function (event, gameObjects) {
			gameObjects[0].clearTint();
		});

		// click event on start
		this.startText.on('pointerdown', function (pointer) {
			self.scene.start('default');
		});
  },

  extend: {

    // declare other functions here

    // start: function () {
    //   this.scene.start('default');
    // }

  }

};
