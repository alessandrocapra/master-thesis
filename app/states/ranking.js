module.exports = {

  create: function () {
  	var self = this;
  	this.sortedUsers = [];

		// add background
		var bg= this.add.sprite(0,0, 'background_menu');

		var title = this.add.text(this.game.global.titlePlacement.x, this.game.global.titlePlacement.y, 'Ranking', this.game.global.titleStyle);
		title.anchor.set(0.5);

		this.getRankingFromDb();

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

  },

  startGame: function () {
    this.state.start('game');
  },

  settingsPage: function () {
		this.state.start('settings');
	},

	getRankingFromDb: function () {
  	var self = this;

		// connect to API to retrieve all users and order them to display the ranking
		var xhr  = new XMLHttpRequest();
		xhr.open('GET', 'https://duchennegame.herokuapp.com/api/users', true);
		xhr.onload = function () {
			var users = JSON.parse(xhr.responseText);
			console.log("users from db: ", users);
			if (xhr.readyState == 4 && xhr.status == "200") {
				self.sortedUsers = users.sort(function(a,b) {return b.high_score - a.high_score;});

				// display the ranking, username and high_score
				for(var i = 0; i < self.sortedUsers.length; i++){
					if(self.sortedUsers[i].id === self.game.global.currentUser.id){
						self.add.text(self.camera.x + 300, self.game.global.titlePlacement.y + 100 + 50 * i+1, i+1, self.game.global.currentPlayerRankingStyle);
						self.add.text(self.camera.x + 350, self.game.global.titlePlacement.y + 100 + 50 * i+1, self.sortedUsers[i].name, self.game.global.currentPlayerRankingStyle);
						self.add.text(self.camera.x + 450, self.game.global.titlePlacement.y + 100 + 50 * i+1, self.sortedUsers[i].high_score, self.game.global.currentPlayerRankingStyle);
					} else {
						self.add.text(self.camera.x + 300, self.game.global.titlePlacement.y + 100 + 50 * i+1, i+1, self.game.global.otherPlayersRankingStyle);
						self.add.text(self.camera.x + 350, self.game.global.titlePlacement.y + 100 + 50 * i+1, self.sortedUsers[i].name, self.game.global.otherPlayersRankingStyle);
						self.add.text(self.camera.x + 450, self.game.global.titlePlacement.y + 100 + 50 * i+1, self.sortedUsers[i].high_score, self.game.global.otherPlayersRankingStyle);
					}
				}
			} else {
				console.error(users);
			}
		};
		xhr.send(null);
	}

};
