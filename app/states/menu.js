module.exports = {

  create: function () {
    var title = this.add.text(0, 0, 'Duck Quest', {
      fill: 'white',
      font: '100px fantasy'
    });
    title.alignIn(this.world, Phaser.CENTER);

    // login button and text
    var loginButton = this.button = this.add.sprite(this.world.centerX, this.world.centerY+100, 'button', 'blue_button04.png');
		loginButton.anchor.set(0.5,0.5);
		loginButton.inputEnabled = true;
		loginButton.input.useHandCursor = true;

		var logintext = this.add.text(0,0,'Login', {align: "center"});
		logintext.anchor.set(0.5,0.5);

		loginButton.addChild(logintext);
		loginButton.events.onInputDown.add(this.loginPage.bind(this), this);

		// signup button and text
		var signupBtn = this.button = this.add.sprite(this.world.centerX, this.world.centerY+200, 'button', 'blue_button04.png');
		signupBtn.anchor.set(0.5,0.5);
		signupBtn.inputEnabled = true;
		signupBtn.input.useHandCursor = true;

		var signupText = this.add.text(0,0,'Signup', {align: "center"});
		signupText.anchor.set(0.5,0.5);

		signupBtn.addChild(signupText);
		signupBtn.events.onInputDown.add(this.signupPage.bind(this), this);

    // this.input.onTap.add(this.startGame.bind(this));

    // add login and sign in buttons
		// this.state.start('login');
  },

  startGame: function () {
    this.state.start('game');
  },

  loginPage: function () {
		this.state.start('login');
	},

	signupPage: function () {
		this.state.start('signup');
	}

};
