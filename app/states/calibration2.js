module.exports = {

  create: function () {

  	var self = this;
  	var pressure = this.pressure;
  	this.averagePressure = 0;
  	this.pressureCount = 0;
  	this.numMeasurements = 50;
  	this.updatedCircleDiameter = 0;

		this.socket = io();
		// this.socket = io.connect(window.location.hostname, { secure: true, reconnect: true, rejectUnauthorized : false } );
		// this.socket = io.connect();

		this.socket.on("connect", function () {
			console.log("client (game) connected to server");

			// receives the raw pressure number
			self.socket.on('p', function(data){
				self.pressure = parseFloat(data.p);
				// console.log("pressure received: " + parseFloat(pressure));

				// take 50 measurements to have an idea of the average value received
				if(self.pressureCount < self.numMeasurements){
					self.averagePressure += self.pressure;
					self.pressureCount++;
				}

				if(self.pressureCount === self.numMeasurements){
					self.averagePressure /= self.pressureCount;
					// this allows to enter this code only once
					self.pressureCount++;
				}

				self.updatedCircleDiameter = Phaser.Math.mapLinear(self.pressure, -2000, 1500, 30, 250);
			});
		});

		var title = this.add.text(this.game.global.titlePlacement.x, this.game.global.titlePlacement.y, 'Calibration', this.game.global.titleStyle);
		title.anchor.set(0.5);

		this.maxText = this.add.text(100, 500, 'max: 0', {fill: 'white'});
		this.minText = this.add.text(300, 500, 'min: 0', {fill: 'white'});

		// draw an empty circle that is going to chane with pressure data
		this.largerCircle = new Phaser.Circle(this.world.centerX, this.world.centerY + 100, 100);
		this.graphics = this.add.graphics(0, 0);

		// circles for max and min breathing achieved
		this.maxCircle = this.add.graphics(0, 0);
		this.minCircle = this.add.graphics(0, 0);

  },
	
	update: function () {
  	var self = this;

  	// console.log(this.pressureCount);
  	// check if average measure has already been taken
		if(this.pressureCount >= this.numMeasurements){
			console.log("> 50");
			console.log("actual pressure: " + this.pressure + ", average: " + this.averagePressure);
			// if measured pressure is outside the range, keep updating the max value
			if(this.pressure > (this.averagePressure + 20) || this.pressure < (this.averagePressure - 20)){
				console.log("outside average range");
				// if the current measurement is greater than the one before, update the max value
				if(this.pressure > this.game.global.currentUserCalibration.max){
					console.log("update max");
					this.game.global.currentUserCalibration.max = this.pressure;
					this.maxText.setText('max: ' + this.game.global.currentUserCalibration.max);

					// draw the updated max circle
					this.maxCircle.clear();
					this.maxCircle.lineStyle(5, 0x0000ff, 1);
					this.maxCircle.drawCircle(this.world.centerX, this.world.centerY + 100, Phaser.Math.mapLinear(this.game.global.currentUserCalibration.max, -2000, 1500, 30, 250));

				} else if(this.pressure < this.game.global.currentUserCalibration.min){
					console.log("update min");
					this.game.global.currentUserCalibration.min = this.pressure;
					this.minText.setText('min: ' + this.game.global.currentUserCalibration.min);

					// draw the updated min circle
					this.minCircle.clear();
					this.minCircle.lineStyle(5, 0x00ccff, 1);
					this.minCircle.drawCircle(this.world.centerX, this.world.centerY + 100, Phaser.Math.mapLinear(this.game.global.currentUserCalibration.min, -2000, 1500, 30, 250));
				}
			}
		}

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
