module.exports = {

  create: function () {
  	var self = this;

  	console.log('pressureEffort var: ' + this.game.global.pressureEffort + typeof this.game.global.pressureEffort);

  	console.log('currentUser calibrations: ', this.game.global.currentUserCalibration);

  	// get the current user calibrations

		// connect to API to retrieve last calibration of current user
		var xhr  = new XMLHttpRequest();
		xhr.open('GET', 'https://duckieduck.herokuapp.com/api/users/' + this.game.global.currentUser.id, true);
		xhr.onload = function () {
			var user = JSON.parse(xhr.responseText);
			if (xhr.readyState == 4 && xhr.status == "200") {
				// check if calibrations exists for this user
				console.log('taking calibration data of this user: ', user);
				if(user.calibrations.length){
					// the api returns the last calibration always as the first element of the array
					self.game.global.currentUserCalibration.min = user.calibrations[0].max_inhale;
					self.game.global.currentUserCalibration.max = user.calibrations[0].max_exhale;
				} else {
					alert('You have never done a calibration! Please go to the settings page (gear icon).');
				}
			} else {
				console.error(user);
			}
		};
		xhr.send(null);

		// add background
		var bg= this.add.sprite(0,0, 'background_menu');

		var title = this.add.text(this.game.global.titlePlacement.x, this.game.global.titlePlacement.y, 'Welcome', this.game.global.titleStyle);
		title.anchor.set(0.5);
		title.setText('Welcome, ' + this.game.global.currentUser.name + '!');

		// add text with explanation of the game
		var textExplanation =
			'In this game, you have to help Duckie Duck to collect as many coins\n' +
			'as possible! During the game, you will see some special yellow boxes.\n' +
			'Sometimes they give you back a heart, sometimes they make the coins\n' +
			'double their value for a limited time.\n\n' +
			'They say that Duckie Duck also likes music...';
		var gameInstructions = this.gameInstruction = this.add.text(this.camera.width * 0.5, this.camera.height * 0.55, textExplanation, this.game.global.bodyStyle);
		gameInstructions.anchor.set(0.5);
		console.log('gameInstructions: ', gameInstructions);

		// gear icon for settings
		var settings = this.settings = this.add.image(this.camera.width - 90, 50, 'gear');
		settings.scale.setTo(0.6, 0.6);
		settings.tint = this.game.global.primaryColorTint;
		settings.inputEnabled = true;
		settings.input.useHandCursor = true;

		settings.events.onInputDown.add(function () {
			// go to the settings page
			this.settingsPage();
		}, this);

		// leaderboard icon for rankings
		var leaderboard = this.leaderboard = this.add.image(this.camera.width - 160, 50, 'leaderboard');
		leaderboard.scale.setTo(0.6, 0.6);
		leaderboard.tint = this.game.global.primaryColorTint;
		leaderboard.inputEnabled = true;
		leaderboard.input.useHandCursor = true;

		leaderboard.events.onInputDown.add(function () {
			// go to the settings page
			this.leaderboardPage();
		}, this);

		// start button
		var startBtn = this.startBtn= this.add.sprite(this.camera.width * 0.5, this.camera.height * 0.85, 'button', 'blue_button04.png');
		startBtn.anchor.set(0.5,0.5);
		startBtn.inputEnabled = true;
		startBtn.input.useHandCursor = true;

		var startText = this.add.text(0,0,'Start', this.game.global.buttonLabelStyle);
		startText.anchor.set(0.5,0.5);

		startBtn.addChild(startText);

		startBtn.events.onInputDown.add(function () {
			// go to the game itself
			this.startGame();
		}, this);

  },

  startGame: function () {
    this.state.start('training_level');
  },

  settingsPage: function () {
		this.state.start('settings');
	},

	leaderboardPage: function () {
		this.state.start('ranking');
	}

};
