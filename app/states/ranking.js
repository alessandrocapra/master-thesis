module.exports = {

  create: function () {
  	var self = this;
  	var sortedUsers = [];
		var title = this.add.text(this.game.global.titlePlacement.x, this.game.global.titlePlacement.y, 'Ranking', this.game.global.titleStyle);
		title.anchor.set(0.5);

		// connect to API to retrieve all users and order them to display the ranking
		var xhr  = new XMLHttpRequest();
		xhr.open('GET', 'https://duchennegame.herokuapp.com/api/users', true);
		xhr.onload = function () {
			var users = JSON.parse(xhr.responseText);
			console.log("users from db: ", users);
			if (xhr.readyState == 4 && xhr.status == "200") {
					sortedUsers = users.sort(function(a,b) {return b.high_score - a.high_score;});
					console.log("sortedUsers: ", sortedUsers);

					// display the ranking, username and high_score
					for(var i = 0; i < sortedUsers.length; i++){
						console.log("sortedUser[i].name: " + sortedUsers[i].name);
						console.log("sortedUser[i].high_score: " + sortedUsers[i].high_score);
						self.add.text(100, self.game.global.titlePlacement.y + 100 * i+1, i+1, {fill: 'white'});
						self.add.text(200, self.game.global.titlePlacement.y + 100 * i+1, sortedUsers[i].name, {fill: 'white'});
						self.add.text(300, self.game.global.titlePlacement.y + 100 * i+1, sortedUsers[i].high_score, {fill: 'white'});
					}
			} else {
				console.error(users);
			}
		};
		xhr.send(null);

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
