module.exports = {

  create: function () {

  	var self = this;

		var title = this.add.text(this.game.global.titlePlacement.x, this.game.global.titlePlacement.y, 'Settings', this.game.global.titleStyle);
		title.anchor.set(0.5);

		// Input device label
		var deviceLabel = this.add.text(this.world.centerX*0.25, this.world.height * 0.6, 'Input device', {
			fill: 'white',
			font: '20px Arial'
		});
		deviceLabel.anchor.set(0.5);

		// keyboard/touch button
		var keyTouchBtn = this.keyTouchBtn= this.add.sprite(this.world.width*0.45, this.world.height * 0.6, 'button', 'blue_button04.png');
		keyTouchBtn.anchor.set(0.5,0.5);
		keyTouchBtn.alpha = 0.6;
		keyTouchBtn.inputEnabled = true;
		keyTouchBtn.input.useHandCursor = true;

		var keyTouchText = this.add.text(0,0,'Keyboard/Touch', this.game.global.buttonLabelStyle);
		keyTouchText.anchor.set(0.5,0.5);

		keyTouchBtn.addChild(keyTouchText);

		keyTouchBtn.events.onInputDown.add(function () {
			// select this option
			self.game.global.inputDevice = 'keyboard_touch';
			calibrationBtn.visible = false;
		}, this);

		// breathing button
		var breathingBtn = this.breathingBtn= this.add.sprite(this.world.width*0.75, this.world.height * 0.6, 'button', 'blue_button04.png');
		breathingBtn.anchor.set(0.5,0.5);
		breathingBtn.alpha = 0.6;
		breathingBtn.inputEnabled = true;
		breathingBtn.input.useHandCursor = true;

		var breathingText = this.add.text(0,0,'Breath', this.game.global.buttonLabelStyle);
		breathingText.anchor.set(0.5,0.5);

		breathingBtn.addChild(breathingText);

		breathingBtn.events.onInputDown.add(function () {
			// select this option
			self.game.global.inputDevice = 'breath';
			calibrationBtn.visible = true;
		}, this);

		// calibration button
		var calibrationBtn = this.calibrationBtn= this.add.sprite(this.world.width*0.75, this.world.height * 0.7, 'button', 'blue_button04.png');
		calibrationBtn.anchor.set(0.5,0.5);
		calibrationBtn.inputEnabled = true;
		calibrationBtn.input.useHandCursor = true;
		calibrationBtn.visible = false;

		var calibrationText = this.add.text(0,0,'Calibration', this.game.global.buttonLabelStyle);
		calibrationText.anchor.set(0.5,0.5);

		calibrationBtn.addChild(calibrationText);

		calibrationBtn.events.onInputDown.add(function () {
			this.state.start('calibration1');
		}, this);

  },

	update: function(){
		// check which option is currently selected from the global variables
		this.checkCurrentInputDevice(this.keyTouchBtn, this.breathingBtn);
	},

  startGame: function () {
    this.state.start('game');
  },

  settingsPage: function () {
		this.state.start('settings');
	},
	
	checkCurrentInputDevice: function (keyboardBtn, breathBtn) {
		if(keyboardBtn.alive && breathBtn.alive){
			if(this.game.global.inputDevice === 'keyboard_touch'){
				keyboardBtn.alpha = 1;
				breathBtn.alpha = 0.6;
			} else if(this.game.global.inputDevice === 'breath'){
				keyboardBtn.alpha = 0.6;
				breathBtn.alpha = 1;
			}
		}
	}

};
