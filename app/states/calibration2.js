module.exports = {

  create: function () {

  	var self = this;
  	var pressure = this.pressure;
  	var averagePressure = this.averagePressure = 0;
  	var pressureCount = 0;
  	var updatedCircleDiameter = this.updatedCircleDiameter;

		this.socket = io();
		// this.socket = io.connect(window.location.hostname, { secure: true, reconnect: true, rejectUnauthorized : false } );
		// this.socket = io.connect();

		this.socket.on("connect", function () {
			console.log("client (game) connected to server");

			// receives the raw pressure number
			self.socket.on('p', function(data){
				var pressure = data.p;

				if(pressureCount < 50){
					averagePressure += pressure;
					pressureCount++;
				} else {
					averagePressure /= pressureCount;
					console.log("averagePressure: " + averagePressure);
					console.log("pressureCount: " + pressureCount);
				}

				self.updatedCircleDiameter = Phaser.Math.mapLinear(pressure, -2000, 1500, 30, 250);
			});
		});

		var title = this.add.text(this.game.global.titlePlacement.x, this.game.global.titlePlacement.y, 'Calibration', this.game.global.titleStyle);
		title.anchor.set(0.5);

		// draw an empty circle that is going to chane with pressure data
		this.largerCircle = new Phaser.Circle(this.world.centerX, this.world.centerY + 100, 100);
		this.graphics = this.add.graphics(0, 0);

  },
	
	update: function () {
  	var self = this;

  	// take average of last 50 values received and make a range around that value

		// when the measurement goes above it, update the maximum value received every time

		// once the values received go back into the previous average range, fire event that stops recording and switches to inhaling

  	// update circle diameter with mapped value
		this.largerCircle.diameter = this.updatedCircleDiameter;

		// draw updated figure on the invisible circle
		this.graphics.clear();
		this.graphics.beginFill(this.game.global.primaryColorTint, 0.5);
		this.graphics.drawCircle(this.world.centerX, this.world.centerY + 100, this.largerCircle.diameter);

		// var sprite = this.add.sprite(this.world.centerX, this.world.centerY + 100, this.graphics.generateTexture());
		// sprite.anchor.set(0.5);
	}
};
