module.exports = {

  create: function () {
		var title = this.add.text(this.game.global.titlePlacement.x, this.game.global.titlePlacement.y, 'Welcome', this.game.global.titleStyle);
		title.anchor.set(0.5);

		title.setText('Welcome, ' + this.game.global.currentUser.name + '!');

		// add text with explanation of the game
		var gameInstructions = this.gameInstruction = this.add.text(this.world.centerX, this.world.height * 0.4, "Here goes some explanation on how the game works!", {
			fill: "#FFF",
			font: '20px Arial'
		});
		gameInstructions.anchor.set(0.5);

		// gear icon for settings
		var settings = this.settings = this.add.image(this.world.width - 90, 50, 'gear');
		settings.scale.setTo(0.6, 0.6);
		settings.tint = this.game.global.primaryColorTint;
		settings.inputEnabled = true;
		settings.input.useHandCursor = true;

		settings.events.onInputDown.add(function () {
			// go to the settings page
			this.settingsPage();
		}, this);

		// leaderboard icon for rankings
		var leaderboard = this.leaderboard = this.add.image(this.world.width - 160, 50, 'leaderboard');
		leaderboard.scale.setTo(0.6, 0.6);
		leaderboard.tint = this.game.global.primaryColorTint;
		leaderboard.inputEnabled = true;
		leaderboard.input.useHandCursor = true;

		leaderboard.events.onInputDown.add(function () {
			// go to the settings page
			this.leaderboardPage();
		}, this);

		// start button
		var startBtn = this.startBtn= this.add.sprite(this.world.centerX, this.world.height * 0.85, 'button', 'blue_button04.png');
		startBtn.anchor.set(0.5,0.5);
		startBtn.inputEnabled = true;
		startBtn.input.useHandCursor = true;

		var startText = this.add.text(0,0,'Login', this.game.global.buttonLabelStyle);
		startText.anchor.set(0.5,0.5);

		startBtn.addChild(startText);

		startBtn.events.onInputDown.add(function () {
			// go to the game itself
			this.startGame();
		}, this);

  },

  startGame: function () {
    this.state.start('game');
  },

  settingsPage: function () {
		this.state.start('settings');
	},

	leaderboardPage: function () {
		this.state.start('ranking');
	}

};
