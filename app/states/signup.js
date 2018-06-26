module.exports = {

  create: function () {

  	var self = this;

		var title = this.add.text(this.game.global.titlePlacement.x, this.game.global.titlePlacement.y, 'Signup', this.game.global.titleStyle);
    title.anchor.set(0.5);
    // title.alignIn(this.world, Phaser.CENTER);

		// arrow back for previous screen
		var arrowBack = this.arrowBack = this.add.image(50, 50, 'arrowBack');
		arrowBack.anchor.set(0.5,0.5);
		arrowBack.scale.setTo(0.6, 0.6);
		arrowBack.tint = this.game.global.primaryColorTint;
		arrowBack.inputEnabled = true;
		arrowBack.input.useHandCursor = true;

		arrowBack.events.onInputDown.add(function () {
			self.state.start('menu');
		}, this);

		this.nameInput = this.add.inputField(this.world.centerX - 140, this.world.centerY - 50, {
			font: '20px Arial',
		  width: 250,
      padding: 16,
			borderWidth: 3,
			borderColor: '#2cc0ff',
			borderRadius: 6,
      placeHolder: 'Name'
    });

		// this.nameInput.startFocus();

		this.passwordInput = this.add.inputField(this.world.centerX - 140, this.world.centerY + 25, {
			font: '20px Arial',
			width: 250,
			padding: 16,
			borderWidth: 3,
			borderColor: '#2cc0ff',
			borderRadius: 6,
			placeHolder: 'Password',
			type: PhaserInput.InputType.password
		});

		// Error message to display if no matching users were found after login
		var errorMessage = this.add.text(this.world.centerX, this.world.height * 0.9, 'Fill both fields please, they cannot be empty :)', {fill: "#ff3647"});
		errorMessage.anchor.set(0.5);
		errorMessage.visible = false;

		// login button and text
		var signupBtn = this.checkLoginBtn= this.add.sprite(this.world.centerX, this.world.centerY+140, 'button', 'blue_button04.png');
		signupBtn.anchor.set(0.5,0.5);
		signupBtn.inputEnabled = true;
		signupBtn.input.useHandCursor = true;

		var signupText = this.add.text(0,0,'Signup', this.game.global.buttonLabelStyle);
		signupText.anchor.set(0.5,0.5);

		signupBtn.addChild(signupText);

		signupBtn.events.onInputDown.add(function () {
			var name = this.nameInput.value;
			var password = this.passwordInput.value;

			console.log('name: ' + name + ', pass: ' + password);

			if(name && password){
				// create new calibration data for the current user
				var xhttp = new XMLHttpRequest();
				xhttp.open("POST", "https://duchennegame.herokuapp.com/api/users",true);
				xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
				var input = JSON.stringify({
					"name": name,
					"password": password,
				});

				// save user details in the global variables
				self.game.global.currentUser = user;

				// go to welcome screen with this user
				self.state.start('welcome');

				xhttp.send(input);
			} else {
				errorMessage.visible = true;

				// make text become not visible again after few seconds
				self.time.events.add(Phaser.Timer.SECOND * 3, function () {
					errorMessage.visible = false;
				}, this);
			}

		}, this);
  },

  startGame: function () {
    this.state.start('game');
  },

  // checkLogin: function(name, password) {
  //   console.table(name, password);
  // }

};
