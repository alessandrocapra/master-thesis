module.exports = {

  create: function () {

  	// add background
		var bg= this.add.sprite(0,0, 'background_menu');

		// add duck and move it around
		var duck = this.add.sprite(-50,250,'duck');
		duck.anchor.setTo(0.5, 0.5);
		duck.scale.set(2);
		duck.animations.add('walk', null, 5, true);
		duck.animations.play('walk');

		// add tween to move the duck a bit around
		var moveForwardTween = this.add.tween(duck).to( { x: 150 }, 3000, Phaser.Easing.Linear.None);
		var jumpTween = this.add.tween(duck).to( { x: [200, 350], y:[200, 280] }, 3000, "Sine.easeInOut");
		// moveForwardTween.start();
		jumpTween.start();


    var title = this.add.text(this.camera.width * 0.5, -200, 'Duck Quest', {
      fill: 'white',
      font: '100px IM Fell English SC'
    });
    title.anchor.set(0.5);
		this.add.tween(title).to( { y: this.camera.height * 0.5 }, 2000, Phaser.Easing.Bounce.Out, true);

    // login button and text
    var loginButton = this.button = this.add.sprite(this.world.centerX, this.world.centerY+100, 'button', 'blue_button04.png');
		loginButton.anchor.set(0.5,0.5);
		loginButton.inputEnabled = true;
		loginButton.input.useHandCursor = true;

		var logintext = this.add.text(0,0,'Login', this.game.global.buttonLabelStyle);
		logintext.anchor.set(0.5,0.5);

		loginButton.addChild(logintext);
		loginButton.events.onInputDown.add(this.loginPage.bind(this), this);

		// signup button and text
		var signupBtn = this.button = this.add.sprite(this.world.centerX, this.world.centerY+170, 'button', 'blue_button04.png');
		signupBtn.anchor.set(0.5,0.5);
		signupBtn.inputEnabled = true;
		signupBtn.input.useHandCursor = true;

		var signupText = this.add.text(0,0,'Signup', this.game.global.buttonLabelStyle);
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
	},

	createText: function () {

	}

};
