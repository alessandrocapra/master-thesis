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
				self.updatedCircleDiameter = Phaser.Math.mapLinear(data.p, -2000, 1500, 30, 250);
			});
		});

		var title = this.add.text(this.game.global.titlePlacement.x, this.game.global.titlePlacement.y, 'Calibration', this.game.global.titleStyle);
		title.anchor.set(0.5);

		// draw an empty circle that is going to chane with pressure data
		this.largerCircle = new Phaser.Circle(this.world.centerX, this.world.centerY + 100, 100);
		this.graphics = this.add.graphics(0, 0);

		// basic circle, which stays in the middle
		// var middleCircle = this.middleCircle = this.add.graphics(0, 0);
		// middleCircle.beginFill(this.game.global.primaryColorTint, 1);
		// middleCircle.drawCircle(this.world.centerX, this.world.centerY + 100, 50);

  },
	
	update: function () {
  	var self = this;

  	// update circle diameter with mapped value
		this.largerCircle.diameter = this.updatedCircleDiameter;

		// draw update figure on the invisible circle
		this.graphics.clear();

		// this.graphics.visible = true;
		this.graphics.beginFill(this.game.global.primaryColorTint, 0.5);
		this.graphics.drawCircle(this.world.centerX, this.world.centerY + 100, this.largerCircle.diameter);

		var sprite = this.add.sprite(this.world.centerX, this.world.centerY + 100, this.graphics.generateTexture());
		sprite.anchor.set(0.5);

		// setTimeout(function(){
		// 	self.graphics.visible = false;
		// },100);
	},

	// tweenTint: function(obj, startColor, endColor, time = 250, delay = 0, callback = null) {
	// 	// check if is valid object
	// 	if (obj) {
	// 		// create a step object
	// 		let colorBlend = {
	// 			step: 0
	// 		};
	//
	// 		// create a tween to increment that step from 0 to 100.
	// 		let colorTween = this.game.add.tween(colorBlend).to({ step: 100 }, time, Phaser.Easing.Linear.None, delay);
	//
	// 		// add an anonomous function with lexical scope to change the tint, calling Phaser.Colour.interpolateColor
	// 		colorTween.onUpdateCallback(() => {
	// 			obj.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend.step);
	// 		});
	//
	// 		// set object to the starting colour
	// 		obj.tint = startColor;
	//
	// 		// if you passed a callback, add it to the tween on complete
	// 		if (callback) {
	// 			colorTween.onComplete.add(callback, this);
	// 		}
	//
	// 		// finally, start the tween
	// 		colorTween.start();
	// 	}
	// }
};
