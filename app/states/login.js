module.exports = {

  create: function () {

  	var self = this;

		var title = this.add.text(this.game.global.titlePlacement.x, this.game.global.titlePlacement.y, 'Login', this.game.global.titleStyle);
    title.anchor.set(0.5);
    // title.alignIn(this.world, Phaser.CENTER);

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
		var errorMessage = this.add.text(this.world.centerX, this.world.height * 0.9, 'Name and/or password not correct, try again!', {fill: "#ff3647"});
		errorMessage.anchor.set(0.5);
		errorMessage.visible = false;

		// login button and text
		var checkLoginBtn = this.checkLoginBtn= this.add.sprite(this.world.centerX, this.world.centerY+140, 'button', 'blue_button04.png');
		checkLoginBtn.anchor.set(0.5,0.5);
		checkLoginBtn.inputEnabled = true;
		checkLoginBtn.input.useHandCursor = true;

		var chechLoginText = this.add.text(0,0,'Login', this.game.global.buttonLabelStyle);
		chechLoginText.anchor.set(0.5,0.5);

		checkLoginBtn.addChild(chechLoginText);

		checkLoginBtn.events.onInputDown.add(function () {
			var name = this.nameInput.value;
			var password = this.passwordInput.value;

			console.log('name: ' + name + ', pass: ' + password);

			// connect to API to retrieve all users and check it the data in the form matches
			var xhr  = new XMLHttpRequest();
			xhr.open('GET', 'https://duchennegame.herokuapp.com/api/users', true);
			xhr.onload = function () {
				var users = JSON.parse(xhr.responseText);
				if (xhr.readyState == 4 && xhr.status == "200") {
					var userFound = false;

					users.forEach(function(user){
						if(user.name === name && user.password === password){
							// save user details in the global variables
							self.game.global.currentUser = user;

							self.state.start('welcome');
							userFound = true;
						}
					});

					// if user has not been found / wrong password, display error message
					if(!userFound){
						errorMessage.visible = true;

						// make text become not visible again after few seconds
						self.time.events.add(Phaser.Timer.SECOND * 3, function () {
							errorMessage.visible = false;
						}, this);

					}
				} else {
					console.error(users);
				}
			};
			xhr.send(null);



			// var xhttp = new XMLHttpRequest();
			// xhttp.open("POST", "https://duchennegame.herokuapp.com/api/users",true);
			// xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
			// var input = JSON.stringify({
			// 	"name": name,
			// 	"password": password
			// });
			// xhttp.send(input);


		}, this);


    // this.input.onTap.add(this.startGame.bind(this));
  },

  startGame: function () {
    this.state.start('game');
  },

  // checkLogin: function(name, password) {
  //   console.table(name, password);
  // }

};
