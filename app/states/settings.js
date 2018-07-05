module.exports = {

  create: function () {

  	var self = this;

		// add background
		var bg= this.add.sprite(0,0, 'background_menu');

		var title = this.add.text(this.game.global.titlePlacement.x, this.game.global.titlePlacement.y, 'Settings', this.game.global.titleStyle);
		title.anchor.set(0.5);

		// arrow back for previous screen
		var arrowBack = this.arrowBack = this.add.image(50, 50, 'arrowBack');
		arrowBack.anchor.set(0.5,0.5);
		arrowBack.scale.setTo(0.6, 0.6);
		arrowBack.tint = this.game.global.primaryColorTint;
		arrowBack.inputEnabled = true;
		arrowBack.input.useHandCursor = true;

		arrowBack.events.onInputDown.add(function () {
			self.state.start('welcome');
		}, this);


		// Input device label
		var deviceLabel = this.add.text(this.camera.width*0.125, this.camera.height * 0.6 -100, 'Input device', this.game.global.bodyStyle);
		deviceLabel.anchor.set(0.5);

		// keyboard/touch button
		var keyTouchBtn = this.keyTouchBtn= this.add.sprite(this.camera.width*0.45, this.camera.height * 0.6 - 100, 'button', 'blue_button04.png');
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
		var breathingBtn = this.breathingBtn= this.add.sprite(this.camera.width*0.75, this.camera.height * 0.6 - 100, 'button', 'blue_button04.png');
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
		var calibrationBtn = this.calibrationBtn = this.add.sprite(this.camera.width*0.75, this.camera.height * 0.7 - 100, 'button', 'blue_button04.png');
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

		// input of threshold at which the user has to blow to perform an action
		this.thresholdInput = this.add.inputField(this.camera.width * 0.635, this.camera.height * 0.85 - 100, {
			font: this.game.global.bodyStyle.font,
			width: 150,
			padding: 16,
			borderWidth: 3,
			borderColor: '#2cc0ff',
			borderRadius: 6,
			min: '10',
			max: '100',
			placeHolder: 'Threshold'
		});
		// set text either at 80 (default) or to the value already specified before (if returning ot the screen)
		this.game.global.pressureEffort !== null ? this.thresholdInput.setText('' + this.game.global.pressureEffort * 100) : this.thresholdInput.setText('80');

		// threshold label
		var thresholdLabel = this.thresholdLabel = this.add.text(this.camera.width * 0.75, this.camera.height * 0.82 - 100, 'Threshold (5-100)', this.game.global.bodyStyle);
		thresholdLabel.anchor.set(0.5);

		// save button
		var saveBtn = this.saveBtn = this.add.sprite(this.camera.width*0.5, this.camera.height * 0.9, 'button', 'blue_button04.png');
		saveBtn.anchor.set(0.5,0.5);
		saveBtn.inputEnabled = true;
		saveBtn.input.useHandCursor = true;

		var saveText = this.add.text(0,0,'Save', this.game.global.buttonLabelStyle);
		saveText.anchor.set(0.5,0.5);

		saveBtn.addChild(saveText);

		saveBtn.events.onInputDown.add(this.checkInputAndSave, this);

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

				this.calibrationBtn.visible = false;
				this.calibrationBtn.inputEnabled = false;

				this.thresholdInput.inputEnabled = false;
				this.thresholdInput.alpha = 0;
				this.thresholdLabel.alpha = 0;
			} else if(this.game.global.inputDevice === 'breath'){
				keyboardBtn.alpha = 0.6;
				breathBtn.alpha = 1;

				this.calibrationBtn.visible = true;
				this.calibrationBtn.inputEnabled = true;

				this.thresholdInput.inputEnabled = true;
				this.thresholdInput.alpha = 1;
				this.thresholdLabel.alpha = 1;
			}
		}
	},

	checkInputAndSave: function () {
		// check if threshold input is only an integer
		var regexInteger = /^[0-9]+$/;

		if(regexInteger.test(this.thresholdInput.value) && (this.thresholdInput.value < 100 || this.thresholdInput.value > 5) && this.game.global.inputDevice === 'breath'){
			// setting the global var to a value between 0 and 1 (e.g. 80 / 100 = 0.8)
			this.game.global.pressureEffort = parseInt(this.thresholdInput.value) / 100;
			this.state.start('welcome');
		} else if(this.game.global.inputDevice === 'keyboard_touch'){
			this.game.global.pressureEffort = null;
			this.state.start('welcome');
		} else {
			// input not correct, inform of error
			this.thresholdInput.startFocus();
			var errorMsg = this.add.text(this.camera.width * 0.5, this.camera.height * 0.8, 'Only integer values between 5 and 100 are valid for threshold', this.game.global.bodyStyleError);
			errorMsg.anchor.set(0.5);

			// make text become not visible again after few seconds
			this.time.events.add(Phaser.Timer.SECOND * 3, function () {
				errorMsg.destroy();
			}, this);
		}
	}

};
