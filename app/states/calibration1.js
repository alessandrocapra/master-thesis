module.exports = {

  create: function () {

  	var self = this;

		var title = this.add.text(this.game.global.titlePlacement.x, this.game.global.titlePlacement.y, 'Calibration', this.game.global.titleStyle);
		title.anchor.set(0.5);

		// add text with explanation of the game
		var gameInstructions = this.gameInstruction = this.add.text(this.world.centerX, this.world.height * 0.4, "Explanation on how calibration works", {
			fill: "#FFF",
			font: '20px Arial'
		});

		// start button
		var startBtn = this.keyTouchBtn= this.add.sprite(this.world.width*0.45, this.world.height * 0.6, 'button', 'blue_button04.png');
		startBtn.anchor.set(0.5,0.5);
		startBtn.alpha = 0.6;
		startBtn.inputEnabled = true;
		startBtn.input.useHandCursor = true;

		var keyTouchText = this.add.text(0,0,'Start', this.game.global.buttonLabelStyle);
		keyTouchText.anchor.set(0.5,0.5);

		startBtn.addChild(keyTouchText);

		startBtn.events.onInputDown.add(function () {
			// select this option
			this.state.start('calibration2');
		}, this);

  },
};
