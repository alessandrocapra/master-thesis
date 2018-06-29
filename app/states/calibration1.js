module.exports = {

  create: function () {

  	var self = this;

		// add background
		var bg= this.add.sprite(0,0, 'background_menu');

		var title = this.add.text(this.game.global.titlePlacement.x, this.game.global.titlePlacement.y, 'Calibration', this.game.global.titleStyle);
		title.anchor.set(0.5);

		// add text with explanation of the game
		var gameInstructions = this.gameInstruction = this.add.text(this.world.centerX, this.world.height * 0.4, "In the next screen, you can blow out and in as many times\nyou like. Once satisfied, press the Done button to save the calibration.", this.game.global.bodyStyle);
		gameInstructions.anchor.setTo(0.5);

		// start button
		var startBtn = this.keyTouchBtn= this.add.sprite(this.world.width*0.5, this.world.height * 0.6, 'button', 'blue_button04.png');
		startBtn.anchor.set(0.5,0.5);
		startBtn.inputEnabled = true;
		startBtn.input.useHandCursor = true;

		var keyTouchText = this.add.text(0,0,'Start calibration', this.game.global.buttonLabelStyle);
		keyTouchText.anchor.set(0.5,0.5);

		startBtn.addChild(keyTouchText);

		startBtn.events.onInputDown.add(function () {
			// select this option
			this.state.start('calibration2');
		}, this);

  },
};
