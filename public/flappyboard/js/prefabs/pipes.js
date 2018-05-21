var FlappyBoard = FlappyBoard || {};

FlappyBoard.Pipe = function (game, x, y, speed, coinsPool) {
	Phaser.Sprite.call(this, game, x, y, 'pipe');
	this.game = game;
	this.game.physics.arcade.enable(this);
	this.body.velocity.x = speed;
	this.giveScore = true;
	this.coinsPool = coinsPool;
	this.body.immovable = true;
	
};
	
FlappyBoard.Pipe.prototype = Object.create(Phaser.Sprite.prototype);
FlappyBoard.Pipe.prototype.constructor = FlappyBoard.Pipe;
	
FlappyBoard.Pipe.prototype.update = function() {
	if(this.x < -this.width){
		this.destroy();
	}
};
