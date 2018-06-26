module.exports = {

  create: function () {
  	var self = this;
  	var sortedUsers = [];
		var title = this.add.text(this.game.global.titlePlacement.x, this.game.global.titlePlacement.x, 'Ranking', this.game.global.titleStyle);
		title.anchor.set(0.5);

		// connect to API to retrieve all users and order them to display the ranking
		var xhr  = new XMLHttpRequest();
		xhr.open('GET', 'https://duchennegame.herokuapp.com/api/users', true);
		xhr.onload = function () {
			var users = JSON.parse(xhr.responseText);
			if (xhr.readyState == 4 && xhr.status == "200") {
					users.sort(function(a,b) {return a.high_score - b.high_score;});
					sortedUsers = users;
			} else {
				console.error(users);
			}
		};
		xhr.send(null);

		// display the ranking, username and high_score
		for(var i = 0; i < sortedUsers.length; i++){
			this.add.text(100, this.game.global.titlePlacement.y + 50 * i+1, sortedUsers[i].name, {fill: 'white'});
			this.add.text(200, this.game.global.titlePlacement.y + 50 * i+1, sortedUsers[i].high_score, {fill: 'white'});
		}

		// exit button
		var exitBtn = this.checkLoginBtn= this.add.sprite(this.world.centerX, this.world.height * 0.8, 'button', 'blue_button04.png');
		exitBtn.anchor.set(0.5,0.5);
		exitBtn.inputEnabled = true;
		exitBtn.input.useHandCursor = true;

		var exitText = this.add.text(0,0,'Exit', this.game.global.buttonLabelStyle);
		exitText.anchor.set(0.5,0.5);

		exitBtn.addChild(exitText);

		exitBtn.events.onInputDown.add(function () {
			self.state.start('welcome');
		});

  },

  startGame: function () {
    this.state.start('game');
  },

  settingsPage: function () {
		this.state.start('settings');
	}

};
