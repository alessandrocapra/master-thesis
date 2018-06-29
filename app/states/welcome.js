module.exports = {

  create: function () {
  	var self = this;

  	// get the current user only if the global vars are empty
		if(Object.keys(this.game.global.currentUser).length === 0){
			// connect to API to retrieve last calibration of current user
			var xhr  = new XMLHttpRequest();
			xhr.open('GET', 'https://duchennegame.herokuapp.com/api/users/' + this.game.global.currentUser.id, true);
			xhr.onload = function () {
				var user = JSON.parse(xhr.responseText);
				if (xhr.readyState == 4 && xhr.status == "200") {
					// check if calibrations exists for this user
					if(user.calibrations.length){
						// the api returns the last calibration always as the first element of the array
						self.game.global.currentUserCalibration.min = user.calibrations[0].max_inhale;
						self.game.global.currentUserCalibration.max = user.calibrations[0].max_exhale;
					} else {
						console.log('You should do a calibration to use the breathing');
					}
				} else {
					console.error(user);
				}
			};
			xhr.send(null);
		}

		// add background
		var bg= this.add.sprite(0,0, 'background_menu');

		var title = this.add.text(this.game.global.titlePlacement.x, this.game.global.titlePlacement.y, 'Welcome', this.game.global.titleStyle);
		title.anchor.set(0.5);
		title.setText('Welcome, ' + this.game.global.currentUser.name + '!');

		// add text with explanation of the game
		var gameInstructions = this.gameInstruction = this.add.text(this.camera.width * 0.5, this.camera.height * 0.4, "Here goes some explanation on how the game works!", this.game.global.bodyStyle);
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
