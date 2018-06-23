module.exports = {

  create: function () {

  	var self = this;

		var title = this.add.text(this.world.centerX, 200, 'Login', {
      fill: 'white',
      font: '80px Arial'
    });
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

		// login button and text
		var checkLoginBtn = this.checkLoginBtn= this.add.sprite(this.world.centerX, this.world.centerY+140, 'button', 'blue_button04.png');
		checkLoginBtn.anchor.set(0.5,0.5);
		checkLoginBtn.inputEnabled = true;
		checkLoginBtn.input.useHandCursor = true;

		var chechLoginText = this.add.text(0,0,'Login', {align: "center"});
		chechLoginText.anchor.set(0.5,0.5);

		checkLoginBtn.addChild(chechLoginText);

		checkLoginBtn.events.onInputDown.add(function () {
			var name = this.nameInput.value;
			var password = this.passwordInput.value;

			console.log('name: ' + name + ', pass: ' + password);

			var xhr  = new XMLHttpRequest();
			xhr.open('GET', 'https://duchennegame.herokuapp.com/api/users', true);
			xhr.onload = function () {
				var users = JSON.parse(xhr.responseText);
				if (xhr.readyState == 4 && xhr.status == "200") {
					console.log(users);
					var userFound = false;

					users.forEach(function(user){
						if(user.name === name && user.password === password){
							self.state.start('game');
							// userFound = true;
						} else {
							console.log("User not found!");
						}
					});
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
