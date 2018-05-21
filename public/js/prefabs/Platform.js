var MrHop = MrHop || {};

MrHop.Platform = function(game, floorPool, numTiles, x, y, speed, coinsPool, cactusPool, myCoins) {
    Phaser.Group.call(this, game);
    
    this.tileSize = 70;
    this.game = game;
    this.enableBody = true;
    this.floorPool = floorPool;
    this.coinsPool = coinsPool;
    this.cactusPool = cactusPool;
    this.myCoins = myCoins;

    this.prepare(numTiles, x, y, speed);
    
};

MrHop.Platform.prototype = Object.create(Phaser.Group.prototype);
MrHop.Platform.prototype.constructor = MrHop.Platform;

MrHop.Platform.prototype.prepare = function(numTiles, x, y, speed) {
    this.alive = true;
    
    var i = 0;
    while (i < numTiles){
        
        var floorTile = this.floorPool.getFirstExists(false);
        
        if(!floorTile) {
        floorTile = new Phaser.Sprite(this.game, x + i * this.tileSize, y, 'floor1');
        }
        else {
            floorTile.reset(x + i * this.tileSize, y);
        }
        this.add(floorTile);
        i++;                   
    }
    this.setAll('body.immovable', true);
    this.setAll('body.allowGravity', false);
    this.setAll('body.velocity.x', speed);
    
    this.addCoins(speed);
    this.addCactus(speed);
};

MrHop.Platform.prototype.kill = function(){
    this.alive = false;
    this.callAll('kill');
    
    var sprites = [];
    this.forEach(function(tile){
        sprites.push(tile);
    }, this);
    
    sprites.forEach(function(tile){
        this.floorPool.add(tile);
    }, this);
};

MrHop.Platform.prototype.addCoins = function(speed){
  var coinsY = 110 + Math.random() * 130;
  var numCoin = Math.floor((Math.random() * 2) + 1);
  var hasCoin;
  this.forEach(function(tile){
    //40% chance
    hasCoin = Math.random() <= 0.075;
    for (var i = 0; i < numCoin; i++){
    if(hasCoin) {
      var coin = this.coinsPool.getFirstExists(false);
      
      if(!coin) {
        coin = new Phaser.Sprite(this.game, tile.x, tile.y - coinsY  + (50 * i), 'coin');
        this.coinsPool.add(coin);
      }
      else {
        coin.reset(tile.x, tile.y - coinsY - (50 * i));
      }
      
      coin.body.velocity.x = speed;
      coin.body.allowGravity = false;
	}
    }
  }, this);
};
MrHop.Platform.prototype.addCactus = function(speed){
  var cactusY = 70;
  
  var hasCactus;
  this.forEach(function(tile){
    //40% chance
	if(this.myCoins > 2){
    hasCactus = Math.random() <= 0.15;
	}
    if(hasCactus) {
      var cactus = this.cactusPool.getFirstExists(false);
      
      if(!cactus) {
        cactus = new Phaser.Sprite(this.game, tile.x, tile.y - cactusY, 'cactus');
        this.cactusPool.add(cactus);
      }
      else {
        cactus.reset(tile.x, tile.y - cactusY);
      }
      
      cactus.body.velocity.x = speed;
      cactus.body.allowGravity = false;
	  cactus.body.immovable = true;
    }
  }, this);
};
