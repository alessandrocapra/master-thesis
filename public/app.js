!function(){"use strict";var t="undefined"==typeof global?self:global;if("function"!=typeof t.require){var e={},s={},i={},a={}.hasOwnProperty,o=/^\.\.?(\/|$)/,n=function(t,e){for(var s,i=[],a=(o.test(e)?t+"/"+e:e).split("/"),n=0,r=a.length;n<r;n++)s=a[n],".."===s?i.pop():"."!==s&&""!==s&&i.push(s);return i.join("/")},r=function(t){return t.split("/").slice(0,-1).join("/")},h=function(e){return function(s){var i=n(r(e),s);return t.require(i,e)}},d=function(t,e){var i=y&&y.createHot(t),a={id:t,exports:{},hot:i};return s[t]=a,e(a.exports,h(t),a),a.exports},l=function(t){return i[t]?l(i[t]):t},c=function(t,e){return l(n(r(t),e))},u=function(t,i){null==i&&(i="/");var o=l(t);if(a.call(s,o))return s[o].exports;if(a.call(e,o))return d(o,e[o]);throw new Error("Cannot find module '"+t+"' from '"+i+"'")};u.alias=function(t,e){i[e]=t};var p=/\.[^.\/]+$/,m=/\/index(\.[^\/]+)?$/,g=function(t){if(p.test(t)){var e=t.replace(p,"");a.call(i,e)&&i[e].replace(p,"")!==e+"/index"||(i[e]=t)}if(m.test(t)){var s=t.replace(m,"");a.call(i,s)||(i[s]=t)}};u.register=u.define=function(t,i){if(t&&"object"==typeof t)for(var o in t)a.call(t,o)&&u.register(o,t[o]);else e[t]=i,delete s[t],g(t)},u.list=function(){var t=[];for(var s in e)a.call(e,s)&&t.push(s);return t};var y=t._hmr&&new t._hmr(c,u,e,s);u._cache=s,u.hmr=y&&y.wrap,u.brunch=!0,t.require=u}}(),function(){"undefined"==typeof window?this:window;require.register("initialize.js",function(t,e,s){var i=window.GAME=new Phaser.Game({height:630,renderer:Phaser.AUTO,width:800});i.state.add("boot",e("states/boot")),i.state.add("game",e("states/game")),i.state.add("menu",e("states/menu")),i.state.add("login",e("states/login")),i.state.start("boot")}),require.register("states/boot.js",function(t,e,s){s.exports={init:function(){this.input.maxPointers=1,this.game.renderer.renderSession.roundPixels=!0,this.tweens.frameBased=!0,this.whitePixel=this.add.bitmapData(1,1),this.whitePixel.fill(255,255,255),this.bar=this.whitePixel.addToWorld(),this.bar.width=100,this.bar.height=10,this.bar.alignIn(this.world.bounds,Phaser.CENTER),this.add.plugin(PhaserInput.Plugin)},preload:function(){this.scale.scaleMode=Phaser.ScaleManager.SHOW_ALL,this.scale.setScreenSize=!0,this.scale.pageAlignHorizontally=!0,this.scale.pageAlignVertically=!0,this.forceSingleUpdate=!0,this.load.atlasJSONHash("button","assets/sprites/button.png","assets/sprites/button.json"),this.load.setPreloadSprite(this.bar),this.load.image("background","assets/sprites/bg_desert.png"),this.load.spritesheet("duck","assets/sprites/chick.png",16,18),this.load.spritesheet("coin","assets/sprites/coin.png",32,32),this.load.image("heartFull","assets/sprites/hud_heartFull.png"),this.load.image("heartEmpty","assets/sprites/hud_heartEmpty.png"),this.load.image("overlay","assets/sprites/overlay.png"),this.load.image("pauseButton","assets/sprites/pause_button.png"),this.load.image("mouth","assets/sprites/mouth.png"),this.load.image("nose","assets/sprites/nose.png"),this.load.spritesheet("bee","assets/sprites/bee.png",56,48),this.load.tilemap("tilemap","assets/tilemaps/fast_exhalations_dolphin.json",null,Phaser.Tilemap.TILED_JSON),this.load.image("tiles","assets/tilemaps/tiles_spritesheet.png"),this.load.image("bee_tiles","assets/sprites/bee.png"),this.load.audio("song",["assets/audio/song.mp3","assets/audio/song.ogg"])},create:function(){this.state.start("menu")},shutdown:function(){this.whitePixel.destroy(),this.whitePixel=null}}}),require.register("states/game.js",function(t,e,s){s.exports={create:function(){var t=this.world,e=this;this.speed=3;this.time.events.add(7.8*Phaser.Timer.SECOND,function(){e.music=e.sound.play("song")},this),this.score=0,this.health=60,this.coinValue=10,this.gameOver=!1,this.physics.startSystem(Phaser.Physics.ARCADE),this.physics.arcade.gravity.y=500,this.enableCollision=!0;var s=this.background=this.add.tileSprite(0,0,t.width,t.height,"background");s.fixedToCamera=!0,this.map=this.game.add.tilemap("tilemap"),this.map.addTilesetImage("tiles_spritesheet","tiles"),this.map.addTilesetImage("Enemy","bee_tiles");var i=(this.scenarioLayer=this.map.createLayer("Scenario"),this.foregroundLayer=this.map.createLayer("Foreground"),this.groundLayer=this.map.createLayer("Ground")),a=this.underwaterLayer=this.map.createLayer("Underwater");a.alpha=.7;this.specialBoxesLayer=this.map.createLayer("SpecialBoxes");this.map.setCollisionBetween(1,200,!0,"Scenario"),this.map.setCollisionBetween(1,200,!0,"Foreground"),this.map.setCollisionBetween(1,200,!0,"Underwater"),this.map.setCollisionBetween(1,200,!0,"SpecialBoxes"),this.enemies=this.add.group(),this.enemies.enableBody=!0,this.map.createFromObjects("Enemies",157,"bee",0,!0,!1,this.enemies),this.enemies.callAll("animations.add","animations","fly",[0,2],10,!0),this.enemies.callAll("animations.play","animations","fly"),this.enemies.callAll("animations.add","animations","dead",[1],10,!0),this.enemies.setAll("body.allowGravity",!1),this.enemies.forEach(function(t){e.add.tween(t.scale).to({x:1.2,y:1.2},480,Phaser.Easing.Back.InOut,!0,0,!1)}),this.coins=this.add.group(),this.coins.enableBody=!0,this.map.createFromObjects("Coins",161,"coin",0,!0,!1,this.coins),this.coins.callAll("animations.add","animations","spin",[0,1,2,3,4,5],10,!0),this.coins.callAll("animations.play","animations","spin"),this.coins.setAll("body.allowGravity",!1),this.style={font:"bold 24px Arial",fill:"#000"},this.scoreText=this.add.text(400,40,"score: 0",this.style),this.scoreText.anchor.setTo(.5,.5),this.scoreText.fixedToCamera=!0,this.infoText=this.add.text(this.world.centerX,.3*this.world.height,"Special boxes"),this.infoText.anchor.setTo(.5,.5),this.infoText.visible=!1,this.infoText.fixedToCamera=!0;var o=this.mouth=this.add.sprite(.4*this.camera.width,.4*this.world.height,"mouth");o.scale.setTo(.1,.1),o.anchor.setTo(.5,.5),o.fixedToCamera=!0;var n=this.nose=this.add.sprite(.4*this.camera.width,.52*this.world.height,"nose");n.scale.setTo(.1,.1),n.anchor.setTo(.5,.5),n.fixedToCamera=!0,this.mouthText=this.add.text(.56*this.camera.width,.4*this.world.height,"Jump and fly",{align:"left",boundsAlignH:"left",boundsAlignV:"middle"}),this.mouthText.anchor.setTo(.5,.5),this.mouthText.fixedToCamera=!0,this.noseText=this.add.text(.58*this.camera.width,.52*this.world.height,"Go under water",{align:"left",boundsAlignH:"left",boundsAlignV:"middle"}),this.noseText.anchor.setTo(.5,.5),this.noseText.fixedToCamera=!0,this.time.events.add(5*Phaser.Timer.SECOND,function(){this.switchAlphaInstructions([this.mouth,this.nose,this.mouthText,this.noseText])},this),this.hearts=this.add.group();for(var r=0;r<6;r++)this.hearts.create(50+45*r,40,"heartFull");this.hearts.forEach(function(t){t.anchor.setTo(.5,.5),t.scale.setTo(.7,.7)}),this.hearts.fixedToCamera=!0,this.overlayBackground=this.add.sprite(0,0,"overlay"),this.overlayBackground.x=.5*this.camera.width,this.overlayBackground.y=.5*this.camera.height,this.overlayBackground.anchor.set(.5,.5),this.overlayText=this.add.text(0,0,"Text goes here",{align:"center",font:"bold 24px Arial",fill:"#fff"}),this.overlayText.anchor.set(.5,.5),this.overlayBackground.addChild(this.overlayText),this.overlayBackground.fixedToCamera=!0,this.overlayBackground.visible=!1,this.overlayText.visible=!1,this.okBtn=this.add.sprite(.5*this.camera.width,.6*this.camera.height,"button","blue_button04.png"),this.okBtn.anchor.set(.5),this.okBtn.inputEnabled=!0,this.okBtn.input.useHandCursor=!0,this.okBtn.visible=!1,this.okBtnText=this.add.text(0,0,"Ja",{align:"center"}),this.okBtnText.anchor.set(.5),this.okBtn.addChild(this.okBtnText),this.okBtn.fixedToCamera=!0,this.okBtn.events.onInputUp.add(function(){e.switchAlphaInstructions([e.mouth,e.nose,e.mouthText,e.noseText]),e.state.restart()}),this.pauseButton=this.add.image(this.camera.width-40,40,"pauseButton"),this.pauseButton.scale.setTo(.1,.1),this.pauseButton.anchor.setTo(.5,.5),this.pauseButton.inputEnabled=!0,this.pauseButton.fixedToCamera=!0,this.pauseButton.events.onInputUp.add(function(){console.log("button pressed!"),e.stopTheCamera?(e.music.resume(),e.paused=!1,e.physics.arcade.isPaused=!e.physics.arcade.isPaused,e.overlayBackground.visible=!1,e.stopTheCamera=!1):e.stopTheCamera=!0});var h=this.duck=this.add.sprite(80,t.centerY+50,"duck");h.anchor.setTo(.5,.5),this.physics.arcade.enable(h),h.body.collideWorldBounds=!0,h.scale.set(2),h.animations.add("walk",null,5,!0),h.animations.play("walk"),h.body.allowDrag=!0,h.body.drag.set(0,100),h.body.maxVelocity.set(200,400),this.camera.follow(h),this.camera.deadzone=new Phaser.Rectangle(0,0,100,400),i.resizeWorld();var d=this.cursors=this.input.keyboard.createCursorKeys();d.down.onDown.add(function(){e.duck.body.y>e.world.centerY-35&&e.duck.body.y<e.world.height-70&&(e.duck.body.velocity.y=600)}),d.up.onDown.add(function(){e.duck.body.y<=e.world.centerY+50&&e.duck.body.y>100&&(e.duck.body.velocity.y=-600)})},update:function(){if(this.gameOver?(this.physics.arcade.isPaused=!0,this.paused=!0,this.music.stop(),this.displayOverlay("gameOver")):this.stopTheCamera?(this.paused=!0,this.physics.arcade.isPaused=!0,this.music.pause(),this.overlayBackground.visible=!0):this.background.tilePosition.x-=this.speed,this.physics.arcade.collide(this.duck,[this.scenarioLayer,this.foregroundLayer,this.underwaterLayer,this.enemies],this.duckCollision,this.duckProcessCallback,this),this.physics.arcade.collide(this.duck,this.specialBoxesLayer,this.hitSpecialBoxes,null,this),this.duck.y>this.world.centerY+60?this.duck.alpha=.3:this.duck.alpha=1,this.physics.arcade.overlap(this.duck,this.coins,this.collectCoin,null,this),this.duck.body.velocity.x=60*this.speed,this.duck.body.y>this.world.centerY+50)this.physics.arcade.gravity.y=-800;else if(this.duck.body.y<this.world.centerY+20&&this.duck.body.y>=this.world.centerY+25)this.physics.arcade.gravity.thisy=0;else if(this.duck.body.y<this.world.centerY+20)this.physics.arcade.gravity.y=1e3;else{this.physics.arcade.gravity.y=-120;const t=200*Math.abs(this.duck.body.velocity.y)/400+50;this.cursors.down.isDown||this.duck.body.drag.set(0,t)}this.cursors.up.isDown?this.duck.body.acceleration.y=-600:this.cursors.down.isDown?this.duck.body.acceleration.y=600:this.duck.body.acceleration.y=0},restart:function(){this.state.restart()},quit:function(){this.state.start("menu")},duckProcessCallback:function(t,e){return this.enableCollision},duckCollision:function(t,e){if("bee"===e.key&&(e.animations.play("dead",10,!0),e.body.allowGravity=!0),t.body.blocked.down||t.body.blocked.up)console.log("Collision from above/below");else{this.health-=10,this.enableCollision=!1,this.duck.tint=16724787,this.add.tween(this.duck).to({angle:1440},1e3,Phaser.Easing.Linear.None,!0),this.add.tween(this.duck.scale).to({x:3,y:3},500,Phaser.Easing.Linear.None,!0).yoyo(!0);for(var s=this.hearts.length-1;s>0;s--){var i=this.hearts.getAt(s);if("heartFull"===i.key){i.loadTexture("heartEmpty");break}}0===this.health&&(this.gameOver=!0),this.time.events.add(3*Phaser.Timer.SECOND,this.resetPlayer,this)}},resetPlayer:function(){this.duck.tint=16777215,this.enableCollision=!0},collectCoin:function(t,e){this.score+=this.coinValue,this.scoreText.setText("score: "+this.score),e.kill()},hitSpecialBoxes:function(t,e){var s=this;this.map.removeTile(e.x,e.y,this.specialBoxesLayer);var i=this.rnd.between(0,100);if(i>50)for(var a=0;a<this.hearts.length;a++){var o=this.hearts.getAt(a);if("heartEmpty"===o.key){o.loadTexture("heartFull"),this.health+=10,this.showAndRemoveText(this.infoText,"One heart recovered!");break}a===this.hearts.length-1&&this.showAndRemoveText(this.infoText,"Already had max health!")}else this.coinValue=20,this.time.events.add(5*Phaser.Timer.SECOND,function(){s.coinValue=10},this),this.showAndRemoveText(this.infoText,"All coins are double value for 5 seconds!"),this.coins.forEach(function(t){s.add.tween(t.scale).to({x:1.5,y:1.5},500,Phaser.Easing.Quadratic.InOut,!0)}),this.time.events.add(5*Phaser.Timer.SECOND,function(){this.coins.forEach(function(t){s.add.tween(t.scale).to({x:1,y:1},500,Phaser.Easing.Quadratic.InOut,!0)})},this)},togglePause:function(t){},showAndRemoveText:function(t,e){t.setText(e),t.visible=!0,this.time.events.add(5*Phaser.Timer.SECOND,function(){t.visible=!1},this)},switchAlphaInstructions:function(t){for(var e=0;e<t.length;e++)this.add.tween(t[e]).to({alpha:0},500,"Linear",!0)},displayOverlay:function(t){this.overlayBackground.visible=!0,this.overlayText.visible=!0,"pause"===t||("gameOver"===t?(this.overlayText.setText("Well done! Play again?"),this.okBtn.visible=!0):"gameEnd"===t||console.log("You are not supposed to be here..."))}}}),require.register("states/login.js",function(t,e,s){s.exports={create:function(){var t=this,e=this.add.text(this.world.centerX,200,"Login",{fill:"white",font:"80px Arial"});e.anchor.set(.5),this.nameInput=this.add.inputField(this.world.centerX-140,this.world.centerY-50,{font:"20px Arial",width:250,padding:16,borderWidth:3,borderColor:"#2cc0ff",borderRadius:6,placeHolder:"Name"}),this.passwordInput=this.add.inputField(this.world.centerX-140,this.world.centerY+25,{font:"20px Arial",width:250,padding:16,borderWidth:3,borderColor:"#2cc0ff",borderRadius:6,placeHolder:"Password",type:PhaserInput.InputType.password});var s=this.checkLoginBtn=this.add.sprite(this.world.centerX,this.world.centerY+140,"button","blue_button04.png");s.anchor.set(.5,.5),s.inputEnabled=!0,s.input.useHandCursor=!0;var i=this.add.text(0,0,"Login",{align:"center"});i.anchor.set(.5,.5),s.addChild(i),s.events.onInputDown.add(function(){var e=this.nameInput.value,s=this.passwordInput.value;console.log("name: "+e+", pass: "+s);var i=new XMLHttpRequest;i.open("GET","https://duchennegame.herokuapp.com/api/users",!0),i.onload=function(){var a=JSON.parse(i.responseText);if(4==i.readyState&&"200"==i.status){console.log(a);a.forEach(function(i){i.name===e&&i.password===s?t.state.start("game"):console.log("User not found!")})}else console.error(a)},i.send(null)},this)},startGame:function(){this.state.start("game")}}}),require.register("states/menu.js",function(t,e,s){s.exports={create:function(){var t=this.add.text(0,0,"Duck Quest",{fill:"white",font:"100px fantasy"});t.alignIn(this.world,Phaser.CENTER);var e=this.button=this.add.sprite(this.world.centerX,this.world.centerY+100,"button","blue_button04.png");e.anchor.set(.5,.5),e.inputEnabled=!0,e.input.useHandCursor=!0;var s=this.add.text(0,0,"Login",{align:"center"});s.anchor.set(.5,.5),e.addChild(s),e.events.onInputDown.add(this.loginPage.bind(this),this)},startGame:function(){this.state.start("game")},loginPage:function(){this.state.start("login")}}}),require.register("___globals___",function(t,e,s){})}(),require("___globals___"),require("initialize");