var FlappyBoard = FlappyBoard || {};

FlappyBoard.game = new Phaser.Game(320,620, Phaser.AUTO);

FlappyBoard.game.state.add('BootState', FlappyBoard.BootState);
FlappyBoard.game.state.add('PreloadState', FlappyBoard.PreloadState);
FlappyBoard.game.state.add('HomeState', FlappyBoard.HomeState);
FlappyBoard.game.state.add('GameState', FlappyBoard.GameState);


FlappyBoard.game.state.start('BootState');