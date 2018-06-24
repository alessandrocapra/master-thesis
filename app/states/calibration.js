module.exports = {

  create: function () {

  	var self = this;
  	var pressure = this.pressure;
  	var updatedCircleDiameter = this.updatedCircleDiameter;

		this.socket = io();
		// this.socket = io.connect(window.location.hostname, { secure: true, reconnect: true, rejectUnauthorized : false } );
		// this.socket = io.connect();

		this.socket.on("connect", function () {
			console.log("client (game) connected to server");

			// receives the raw pressure number
			self.socket.on('p', function(data){
				self.updatedCircleDiameter = Phaser.Math.mapLinear(data.p, -2000, 1500, 150, 300);
				console.log('mappedValue: ' + self.updatedCircleDiameter);
			});
		});

		var title = this.add.text(this.game.global.titlePlacement.x, this.game.global.titlePlacement.y, 'Calibration', this.game.global.titleStyle);
		title.anchor.set(0.5);

		// circle that changes in shape, according to breathing
		// var largerCircle = this.largerCircle = this.add.graphics(0, 0);
		// largerCircle.beginFill(this.game.global.primaryColorTint, 0.5);
		// largerCircle.drawCircle(this.world.centerX, this.world.centerY + 100, 150);
		var largerCircle = this.largerCircle = new Phaser.Circle(this.world.centerX, this.world.centerY + 100, 150);
		var graphics = this.graphics = this.add.graphics(0, 0);
		// largerCircle.beginFill(this.game.global.primaryColorTint, 0.5);
		// largerCircle.drawCircle(this.world.centerX, this.world.centerY + 100, 150);

		// basic circle, which stays in the middle
		var middleCircle = this.middleCircle = this.add.graphics(0, 0);
		middleCircle.beginFill(this.game.global.primaryColorTint, 1);
		middleCircle.drawCircle(this.world.centerX, this.world.centerY + 100, 100);

		// keyboard/touch button
		// var keyTouchBtn = this.keyTouchBtn= this.add.sprite(this.world.width*0.45, this.world.height * 0.6, 'button', 'blue_button04.png');
		// keyTouchBtn.anchor.set(0.5,0.5);
		// keyTouchBtn.alpha = 0.6;
		// keyTouchBtn.inputEnabled = true;
		// keyTouchBtn.input.useHandCursor = true;
		//
		// var keyTouchText = this.add.text(0,0,'Keyboard/Touch', this.optionsButtonStyle);
		// keyTouchText.anchor.set(0.5,0.5);
		//
		// keyTouchBtn.addChild(keyTouchText);
		//
		// keyTouchBtn.events.onInputDown.add(function () {
		// 	// select this option
		// 	self.game.global.inputDevice = 'keyboard_touch';
		// 	calibrationBtn.visible = false;
		// }, this);
		//
  },
	
	update: function () {
  	var self = this;

		this.largerCircle.diameter = this.updatedCircleDiameter;

		// draw update figure on it
		this.graphics.beginFill(this.game.global.primaryColorTint, 0.5);
		this.graphics.drawCircle(this.world.centerX, this.world.centerY + 100, this.largerCircle.diameter);
		setTimeout(function(){
			self.graphics.kill();
		},10);
	}
};
