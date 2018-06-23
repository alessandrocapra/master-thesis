module.exports = {

  create: function () {
		var title = this.add.text(this.world.centerX, 200, 'Settings', {
			fill: 'white',
			font: '80px Arial'
		});
		title.anchor.set(0.5);



  },

  startGame: function () {
    this.state.start('game');
  },

  settingsPage: function () {
		this.state.start('settings');
	}

};
