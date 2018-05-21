var MrHop = MrHop || {};

MrHop.HomeState = {
  create: function() {

    this.themeSound2 = this.add.audio('theme2');
    this.themeSound2.loopFull();
    this.playSound = this.add.audio('playsound');

    this.homeScreen = this.game.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'background');
    this.homeScreen.tileScale.y = 1;

    var style = {font: '100px Yanone Kaffeesatz, sans-serif', fill: '#fff'};
    this.title = this.add.text(this.game.world.width/2 -300, this.game.height/2 - 150, 'RANDOM ENCOUNTERS', style);

    //var style = {font: '50px Arial', fill: '#fff'};
    var style = {font: '40px Orbitron, sans-serif', fill: '#fff'};
    this.startGame = this.add.text(this.game.width/2 - 235, this.game.height/2, 'Tap Here to Play Game', style);
    this.startGame.anchor.setTo = (0.5);
    this.startGame.angle = (2.5+Math.random()*5)*(Math.random()>0.5?1:-1);
    this.startGameTween = this.add.tween(this.startGame);
    this.startGameTween.to({angle: -this.startGame.angle},2000+Math.random()*2000,Phaser.Easing.Linear.None,true,0,1500,true);
    this.startGame.inputEnabled = true;

    this.startGame.events.onInputDown.add(function(){
      this.playSound.play();
      this.themeSound2.stop();

      this.state.start('GameState');
    }, this);

  }
};
