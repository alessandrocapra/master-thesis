var MrHop = MrHop || {};

MrHop.game = new Phaser.Game(950, 600, Phaser.AUTO);

MrHop.game.state.add('BootState', MrHop.BootState);
MrHop.game.state.add('PreloadState', MrHop.PreloadState);
MrHop.game.state.add('GameState', MrHop.GameState);
MrHop.game.state.add('HomeState', MrHop.HomeState);

MrHop.game.state.start('BootState');
