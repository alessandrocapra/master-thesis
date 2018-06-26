!function(){"use strict";var t="undefined"==typeof global?self:global;if("function"!=typeof t.require){var e={},s={},i={},a={}.hasOwnProperty,r=/^\.\.?(\/|$)/,n=function(t,e){for(var s,i=[],a=(r.test(e)?t+"/"+e:e).split("/"),n=0,o=a.length;n<o;n++)s=a[n],".."===s?i.pop():"."!==s&&""!==s&&i.push(s);return i.join("/")},o=function(t){return t.split("/").slice(0,-1).join("/")},h=function(e){return function(s){var i=n(o(e),s);return t.require(i,e)}},l=function(t,e){var i=b&&b.createHot(t),a={id:t,exports:{},hot:i};return s[t]=a,e(a.exports,h(t),a),a.exports},d=function(t){return i[t]?d(i[t]):t},c=function(t,e){return d(n(o(t),e))},u=function(t,i){null==i&&(i="/");var r=d(t);if(a.call(s,r))return s[r].exports;if(a.call(e,r))return l(r,e[r]);throw new Error("Cannot find module '"+t+"' from '"+i+"'")};u.alias=function(t,e){i[e]=t};var g=/\.[^.\/]+$/,p=/\/index(\.[^\/]+)?$/,m=function(t){if(g.test(t)){var e=t.replace(g,"");a.call(i,e)&&i[e].replace(g,"")!==e+"/index"||(i[e]=t)}if(p.test(t)){var s=t.replace(p,"");a.call(i,s)||(i[s]=t)}};u.register=u.define=function(t,i){if(t&&"object"==typeof t)for(var r in t)a.call(t,r)&&u.register(r,t[r]);else e[t]=i,delete s[t],m(t)},u.list=function(){var t=[];for(var s in e)a.call(e,s)&&t.push(s);return t};var b=t._hmr&&new t._hmr(c,u,e,s);u._cache=s,u.hmr=b&&b.wrap,u.brunch=!0,t.require=u}}(),function(){"undefined"==typeof window?this:window;require.register("initialize.js",function(t,e,s){var i=window.GAME=new Phaser.Game({height:630,renderer:Phaser.AUTO,width:800});i.global={inputDevice:"keyboard_touch",currentUser:{},currentUserCalibration:{min:0,max:0},primaryColorHex:"#2cb2ed",primaryColorTint:"0x2cb2ed",titlePlacement:{x:400,y:170},titleStyle:{fill:"white",font:"60px Arial"},buttonLabelStyle:{font:"20px Arial",align:"center"}},i.state.add("boot",e("states/boot")),i.state.add("game",e("states/game")),i.state.add("menu",e("states/menu")),i.state.add("login",e("states/login")),i.state.add("signup",e("states/signup")),i.state.add("welcome",e("states/welcome")),i.state.add("settings",e("states/settings")),i.state.add("ranking",e("states/ranking")),i.state.add("calibration1",e("states/calibration1")),i.state.add("calibration2",e("states/calibration2")),i.state.start("boot")}),require.register("states/boot.js",function(t,e,s){s.exports={init:function(){this.input.maxPointers=1,this.game.renderer.renderSession.roundPixels=!0,this.tweens.frameBased=!0,this.whitePixel=this.add.bitmapData(1,1),this.whitePixel.fill(255,255,255),this.bar=this.whitePixel.addToWorld(),this.bar.width=100,this.bar.height=10,this.bar.alignIn(this.world.bounds,Phaser.CENTER),this.add.plugin(PhaserInput.Plugin)},preload:function(){this.scale.scaleMode=Phaser.ScaleManager.SHOW_ALL,this.scale.setScreenSize=!0,this.scale.pageAlignHorizontally=!0,this.scale.pageAlignVertically=!0,this.forceSingleUpdate=!0,this.load.atlasJSONHash("button","assets/sprites/button.png","assets/sprites/button.json"),this.load.image("gear","assets/sprites/gear.png"),this.load.image("leaderboard","assets/sprites/leaderboardsComplex.png"),this.load.image("arrowBack","assets/sprites/arrowLeft.png"),this.load.setPreloadSprite(this.bar),this.load.image("background","assets/sprites/bg_desert.png"),this.load.spritesheet("duck","assets/sprites/chick.png",16,18),this.load.spritesheet("coin","assets/sprites/coin.png",32,32),this.load.image("heartFull","assets/sprites/hud_heartFull.png"),this.load.image("heartEmpty","assets/sprites/hud_heartEmpty.png"),this.load.image("overlay","assets/sprites/overlay.png"),this.load.image("pauseButton","assets/sprites/pause_button.png"),this.load.image("mouth","assets/sprites/mouth.png"),this.load.image("nose","assets/sprites/nose.png"),this.load.spritesheet("bee","assets/sprites/bee.png",56,48),this.load.tilemap("tilemap","assets/tilemaps/fast_exhalations_dolphin.json",null,Phaser.Tilemap.TILED_JSON),this.load.image("tiles","assets/tilemaps/tiles_spritesheet.png"),this.load.image("bee_tiles","assets/sprites/bee.png"),this.load.audio("song",["assets/audio/song.mp3","assets/audio/song.ogg"])},create:function(){this.state.start("menu")},shutdown:function(){this.whitePixel.destroy(),this.whitePixel=null}}}),require.register("states/calibration1.js",function(t,e,s){s.exports={create:function(){var t=this.add.text(this.game.global.titlePlacement.x,this.game.global.titlePlacement.y,"Calibration",this.game.global.titleStyle);t.anchor.set(.5);var e=this.gameInstruction=this.add.text(this.world.centerX,.4*this.world.height,"Explanation on how calibration works",{fill:"#FFF",font:"20px Arial"});e.anchor.setTo(.5);var s=this.keyTouchBtn=this.add.sprite(.45*this.world.width,.6*this.world.height,"button","blue_button04.png");s.anchor.set(.5,.5),s.alpha=.6,s.inputEnabled=!0,s.input.useHandCursor=!0;var i=this.add.text(0,0,"Start",this.game.global.buttonLabelStyle);i.anchor.set(.5,.5),s.addChild(i),s.events.onInputDown.add(function(){this.state.start("calibration2")},this)}}}),require.register("states/calibration2.js",function(t,e,s){s.exports={create:function(){var t=this;this.pressure;this.averagePressure=0,this.pressureCount=0,this.numMeasurements=50,this.updatedCircleDiameter=0,this.game.global.currentUserCalibration.min=0,this.game.global.currentUserCalibration.max=0,this.socket=io(),this.socket.on("connect",function(){console.log("client (game) connected to server"),t.socket.on("p",function(e){t.pressure=parseFloat(e.p),t.pressureCount<t.numMeasurements&&(console.log("self.averagePressure prima: "+t.averagePressure),t.averagePressure+=t.pressure,console.log("self.averagePressure dopo: "+t.averagePressure),t.pressureCount++),t.pressureCount===t.numMeasurements&&(t.averagePressure/=t.pressureCount,console.log("self.averagePressure divisione: "+t.averagePressure),t.pressureCount++),t.updatedCircleDiameter=Phaser.Math.mapLinear(t.pressure,-2e3,1500,30,250)})});var e=this.add.text(this.game.global.titlePlacement.x,this.game.global.titlePlacement.y,"Calibration",this.game.global.titleStyle);e.anchor.set(.5),this.largerCircle=new Phaser.Circle(this.world.centerX,this.world.centerY,100),this.graphics=this.add.graphics(0,0),this.maxCircle=this.add.graphics(0,0),this.minCircle=this.add.graphics(0,0);var s=this.keyTouchBtn=this.add.sprite(.45*this.world.width,.8*this.world.height,"button","blue_button04.png");s.anchor.set(.5,.5),s.alpha=.6,s.inputEnabled=!0,s.input.useHandCursor=!0;var i=this.add.text(0,0,"Start",this.game.global.buttonLabelStyle);i.anchor.set(.5,.5),s.addChild(i),s.events.onInputDown.add(function(){t.saveDataToDb(),t.goToWelcomeState()},this)},update:function(){this.pressureCount>=this.numMeasurements&&(console.log("> 50"),console.log("actual pressure: "+this.pressure+", average: "+this.averagePressure),(this.pressure>this.averagePressure+20||this.pressure<this.averagePressure-20)&&(console.log("outside average range"),this.pressure>this.game.global.currentUserCalibration.max?(console.log("update max"),this.game.global.currentUserCalibration.max=this.pressure,this.maxCircle.clear(),this.maxCircle.lineStyle(5,255,1),this.maxCircle.drawCircle(this.world.centerX,this.world.centerY,Phaser.Math.mapLinear(this.game.global.currentUserCalibration.max,-2e3,1500,30,250))):this.pressure<this.game.global.currentUserCalibration.min&&(console.log("update min"),this.game.global.currentUserCalibration.min=this.pressure,this.minCircle.clear(),this.minCircle.lineStyle(5,52479,1),this.minCircle.drawCircle(this.world.centerX,this.world.centerY,Phaser.Math.mapLinear(this.game.global.currentUserCalibration.min,-2e3,1500,30,250))))),this.largerCircle.diameter=this.updatedCircleDiameter,this.graphics.clear(),this.graphics.beginFill(this.game.global.primaryColorTint,.5),this.graphics.drawCircle(this.world.centerX,this.world.centerY,this.largerCircle.diameter)},saveDataToDb:function(){var t=new XMLHttpRequest;t.open("POST","https://duchennegame.herokuapp.com/api/calibrations",!0),t.setRequestHeader("Content-Type","application/json;charset=UTF-8");var e=JSON.stringify({userId:this.game.global.currentUser.id,max_inhale:this.game.global.currentUserCalibration.min,max_exhale:this.game.global.currentUserCalibration.max});t.send(e)},goToWelcomeState:function(){this.state.start("welcome")}}}),require.register("states/game.js",function(t,e,s){s.exports={create:function(){var t=this.world,e=this;this.speed=3;this.pressure=0,this.percentageEffort=.8,this.socket=io(),this.socket.on("connect",function(){console.log("client (game) connected to server"),e.socket.on("p",function(t){e.pressure=parseFloat(t.p)})}),this.time.events.add(7.8*Phaser.Timer.SECOND,function(){e.music=e.sound.play("song")},this),this.score=0,this.health=60,this.coinValue=10,this.gameOver=!1,this.physics.startSystem(Phaser.Physics.ARCADE),this.physics.arcade.gravity.y=500,this.enableCollision=!0;var s=this.background=this.add.tileSprite(0,0,t.width,t.height,"background");s.fixedToCamera=!0,this.map=this.game.add.tilemap("tilemap"),this.map.addTilesetImage("tiles_spritesheet","tiles"),this.map.addTilesetImage("Enemy","bee_tiles");var i=(this.scenarioLayer=this.map.createLayer("Scenario"),this.foregroundLayer=this.map.createLayer("Foreground"),this.groundLayer=this.map.createLayer("Ground")),a=this.underwaterLayer=this.map.createLayer("Underwater");a.alpha=.7;this.specialBoxesLayer=this.map.createLayer("SpecialBoxes");this.map.setCollisionBetween(1,200,!0,"Scenario"),this.map.setCollisionBetween(1,200,!0,"Foreground"),this.map.setCollisionBetween(1,200,!0,"Underwater"),this.map.setCollisionBetween(1,200,!0,"SpecialBoxes"),this.enemies=this.add.group(),this.enemies.enableBody=!0,this.map.createFromObjects("Enemies",157,"bee",0,!0,!1,this.enemies),this.enemies.callAll("animations.add","animations","fly",[0,2],10,!0),this.enemies.callAll("animations.play","animations","fly"),this.enemies.callAll("animations.add","animations","dead",[1],10,!0),this.enemies.setAll("body.allowGravity",!1),this.enemies.forEach(function(t){e.add.tween(t.scale).to({x:1.2,y:1.2},480,Phaser.Easing.Back.InOut,!0,0,!1)}),this.coins=this.add.group(),this.coins.enableBody=!0,this.map.createFromObjects("Coins",161,"coin",0,!0,!1,this.coins),this.coins.callAll("animations.add","animations","spin",[0,1,2,3,4,5],10,!0),this.coins.callAll("animations.play","animations","spin"),this.coins.setAll("body.allowGravity",!1),this.style={font:"bold 24px Arial",fill:"#000"},this.scoreText=this.add.text(400,40,"score: 0",this.style),this.scoreText.anchor.setTo(.5,.5),this.scoreText.fixedToCamera=!0,this.infoText=this.add.text(this.world.centerX,.3*this.world.height,"Special boxes"),this.infoText.anchor.setTo(.5,.5),this.infoText.visible=!1,this.infoText.fixedToCamera=!0;var r=this.mouth=this.add.sprite(.4*this.camera.width,.4*this.world.height,"mouth");r.scale.setTo(.1,.1),r.anchor.setTo(.5,.5),r.fixedToCamera=!0;var n=this.nose=this.add.sprite(.4*this.camera.width,.52*this.world.height,"nose");n.scale.setTo(.1,.1),n.anchor.setTo(.5,.5),n.fixedToCamera=!0,this.mouthText=this.add.text(.56*this.camera.width,.4*this.world.height,"Jump and fly",{align:"left",boundsAlignH:"left",boundsAlignV:"middle"}),this.mouthText.anchor.setTo(.5,.5),this.mouthText.fixedToCamera=!0,this.noseText=this.add.text(.58*this.camera.width,.52*this.world.height,"Go under water",{align:"left",boundsAlignH:"left",boundsAlignV:"middle"}),this.noseText.anchor.setTo(.5,.5),this.noseText.fixedToCamera=!0,this.time.events.add(5*Phaser.Timer.SECOND,function(){this.switchAlphaInstructions([this.mouth,this.nose,this.mouthText,this.noseText])},this),this.hearts=this.add.group();for(var o=0;o<6;o++)this.hearts.create(50+45*o,40,"heartFull");this.hearts.forEach(function(t){t.anchor.setTo(.5,.5),t.scale.setTo(.7,.7)}),this.hearts.fixedToCamera=!0,this.overlayBackground=this.add.sprite(0,0,"overlay"),this.overlayBackground.x=.5*this.camera.width,this.overlayBackground.y=.5*this.camera.height,this.overlayBackground.anchor.set(.5,.5),this.overlayText=this.add.text(0,0,"Text goes here",{align:"center",font:"bold 24px Arial",fill:"#fff"}),this.overlayText.anchor.set(.5,.5),this.overlayBackground.addChild(this.overlayText),this.overlayBackground.fixedToCamera=!0,this.overlayBackground.visible=!1,this.overlayText.visible=!1,this.okBtn=this.add.sprite(.5*this.camera.width,.6*this.camera.height,"button","blue_button04.png"),this.okBtn.anchor.set(.5),this.okBtn.inputEnabled=!0,this.okBtn.input.useHandCursor=!0,this.okBtn.visible=!1,this.okBtnText=this.add.text(0,0,"Ja",{align:"center"}),this.okBtnText.anchor.set(.5),this.okBtn.addChild(this.okBtnText),this.okBtn.fixedToCamera=!0,this.okBtn.events.onInputUp.add(function(){e.switchAlphaInstructions([e.mouth,e.nose,e.mouthText,e.noseText]),e.state.restart()}),this.pauseButton=this.add.image(this.camera.width-40,40,"pauseButton"),this.pauseButton.scale.setTo(.1,.1),this.pauseButton.anchor.setTo(.5,.5),this.pauseButton.inputEnabled=!0,this.pauseButton.fixedToCamera=!0,this.pauseButton.events.onInputUp.add(function(){console.log("button pressed!"),e.stopTheCamera?(e.music.resume(),e.paused=!1,e.physics.arcade.isPaused=!e.physics.arcade.isPaused,e.overlayBackground.visible=!1,e.stopTheCamera=!1):e.stopTheCamera=!0});var h=this.duck=this.add.sprite(80,t.centerY+50,"duck");h.anchor.setTo(.5,.5),this.physics.arcade.enable(h),h.body.collideWorldBounds=!0,h.scale.set(2),h.animations.add("walk",null,5,!0),h.animations.play("walk"),h.body.allowDrag=!0,h.body.drag.set(0,100),h.body.maxVelocity.set(200,400),this.camera.follow(h),this.camera.deadzone=new Phaser.Rectangle(0,0,100,400),i.resizeWorld();var l=this.cursors=this.input.keyboard.createCursorKeys();l.down.onDown.add(function(){e.duck.body.y>e.world.centerY-35&&e.duck.body.y<e.world.height-70&&(e.duck.body.velocity.y=600)}),l.up.onDown.add(function(){e.duck.body.y<=e.world.centerY+50&&e.duck.body.y>100&&(e.duck.body.velocity.y=-600)})},update:function(){console.log("\n----------------------------"),console.log("pressure: "+this.pressure),console.log("maxInhale: "+this.game.global.currentUserCalibration.min),console.log("maxExhale: "+this.game.global.currentUserCalibration.max),console.log("----------------------------\n");if(this.gameOver?(this.physics.arcade.isPaused=!0,this.paused=!0,this.music.stop(),this.displayOverlay("gameOver")):this.stopTheCamera?(this.paused=!0,this.physics.arcade.isPaused=!0,this.music.pause(),this.overlayBackground.visible=!0):this.background.tilePosition.x-=this.speed,this.physics.arcade.collide(this.duck,[this.scenarioLayer,this.foregroundLayer,this.underwaterLayer,this.enemies],this.duckCollision,this.duckProcessCallback,this),this.physics.arcade.collide(this.duck,this.specialBoxesLayer,this.hitSpecialBoxes,null,this),this.duck.y>this.world.centerY+60?this.duck.alpha=.3:this.duck.alpha=1,this.physics.arcade.overlap(this.duck,this.coins,this.collectCoin,null,this),this.duck.body.velocity.x=60*this.speed,this.duck.body.y>this.world.centerY+50)this.physics.arcade.gravity.y=-800;else if(this.duck.body.y<this.world.centerY+20&&this.duck.body.y>=this.world.centerY+25)this.physics.arcade.gravity.thisy=0;else if(this.duck.body.y<this.world.centerY+20)this.physics.arcade.gravity.y=1e3;else{this.physics.arcade.gravity.y=-120;const t=200*Math.abs(this.duck.body.velocity.y)/400+50;this.cursors.down.isDown||this.duck.body.drag.set(0,t)}this.pressure<this.game.global.currentUserCalibration.min*this.percentageEffort&&this.duck.body.y>this.world.centerY-35&&this.duck.body.y<this.world.height-70&&(this.duck.body.velocity.y=600),this.pressure>this.game.global.currentUserCalibration.max*this.percentageEffort&&(console.log("Inside controlling up with breath"),console.log("---- therefore "+this.pressure+" > "+.2*this.game.global.currentUserCalibration.max),this.duck.body.y<=this.world.centerY+50&&this.duck.body.y>100&&(console.log("-------- inside the -600 thingy"),this.duck.body.velocity.y=-600)),this.cursors.up.isDown||this.pressure>this.game.global.currentUserCalibration.max*this.percentageEffort?this.duck.body.acceleration.y=-600:this.cursors.down.isDown||this.pressure<this.game.global.currentUserCalibration.min*this.percentageEffort?this.duck.body.acceleration.y=600:this.duck.body.acceleration.y=0},restart:function(){this.state.restart()},quit:function(){this.state.start("menu")},duckProcessCallback:function(t,e){return this.enableCollision},duckCollision:function(t,e){if("bee"===e.key&&(e.animations.play("dead",10,!0),e.body.allowGravity=!0),t.body.blocked.down||t.body.blocked.up)console.log("Collision from above/below");else{this.health-=10,this.enableCollision=!1,this.duck.tint=16724787,this.add.tween(this.duck).to({angle:1440},1e3,Phaser.Easing.Linear.None,!0),this.add.tween(this.duck.scale).to({x:3,y:3},500,Phaser.Easing.Linear.None,!0).yoyo(!0);for(var s=this.hearts.length-1;s>0;s--){var i=this.hearts.getAt(s);if("heartFull"===i.key){i.loadTexture("heartEmpty");break}}0===this.health&&(this.gameOver=!0),this.time.events.add(3*Phaser.Timer.SECOND,this.resetPlayer,this)}},resetPlayer:function(){this.duck.tint=16777215,this.enableCollision=!0},collectCoin:function(t,e){this.score+=this.coinValue,this.scoreText.setText("score: "+this.score),e.kill()},hitSpecialBoxes:function(t,e){var s=this;this.map.removeTile(e.x,e.y,this.specialBoxesLayer);var i=this.rnd.between(0,100);if(i>50)for(var a=0;a<this.hearts.length;a++){var r=this.hearts.getAt(a);if("heartEmpty"===r.key){r.loadTexture("heartFull"),this.health+=10,this.showAndRemoveText(this.infoText,"One heart recovered!");break}a===this.hearts.length-1&&this.showAndRemoveText(this.infoText,"Already had max health!")}else this.coinValue=20,this.time.events.add(5*Phaser.Timer.SECOND,function(){s.coinValue=10},this),this.showAndRemoveText(this.infoText,"All coins are double value for 5 seconds!"),this.coins.forEach(function(t){s.add.tween(t.scale).to({x:1.5,y:1.5},500,Phaser.Easing.Quadratic.InOut,!0)}),this.time.events.add(5*Phaser.Timer.SECOND,function(){this.coins.forEach(function(t){s.add.tween(t.scale).to({x:1,y:1},500,Phaser.Easing.Quadratic.InOut,!0)})},this)},togglePause:function(t){},showAndRemoveText:function(t,e){t.setText(e),t.visible=!0,this.time.events.add(5*Phaser.Timer.SECOND,function(){t.visible=!1},this)},switchAlphaInstructions:function(t){for(var e=0;e<t.length;e++)this.add.tween(t[e]).to({alpha:0},500,"Linear",!0)},displayOverlay:function(t){this.overlayBackground.visible=!0,this.overlayText.visible=!0,"pause"===t||("gameOver"===t?(this.overlayText.setText("Well done! Play again?"),this.okBtn.visible=!0):"gameEnd"===t||console.log("You are not supposed to be here..."))}}}),require.register("states/login.js",function(t,e,s){s.exports={create:function(){var t=this,e=this.add.text(this.game.global.titlePlacement.x,this.game.global.titlePlacement.y,"Login",this.game.global.titleStyle);e.anchor.set(.5);var s=this.arrowBack=this.add.image(50,50,"arrowBack");s.anchor.set(.5,.5),s.scale.setTo(.6,.6),s.tint=this.game.global.primaryColorTint,s.inputEnabled=!0,s.input.useHandCursor=!0,s.events.onInputDown.add(function(){t.state.start("menu")},this),this.nameInput=this.add.inputField(this.world.centerX-140,this.world.centerY-50,{font:"20px Arial",width:250,padding:16,borderWidth:3,borderColor:"#2cc0ff",borderRadius:6,placeHolder:"Name"}),this.passwordInput=this.add.inputField(this.world.centerX-140,this.world.centerY+25,{font:"20px Arial",width:250,padding:16,borderWidth:3,borderColor:"#2cc0ff",borderRadius:6,placeHolder:"Password",type:PhaserInput.InputType.password});var i=this.add.text(this.world.centerX,.9*this.world.height,"Name and/or password not correct, try again!",{fill:"#ff3647"});i.anchor.set(.5),i.visible=!1;var a=this.checkLoginBtn=this.add.sprite(this.world.centerX,this.world.centerY+140,"button","blue_button04.png");a.anchor.set(.5,.5),a.inputEnabled=!0,a.input.useHandCursor=!0;var r=this.add.text(0,0,"Login",this.game.global.buttonLabelStyle);r.anchor.set(.5,.5),a.addChild(r),a.events.onInputDown.add(function(){var e=this.nameInput.value,s=this.passwordInput.value;console.log("name: "+e+", pass: "+s);var a=new XMLHttpRequest;a.open("GET","https://duchennegame.herokuapp.com/api/users",!0),a.onload=function(){var r=JSON.parse(a.responseText);if(4==a.readyState&&"200"==a.status){var n=!1;r.forEach(function(i){i.name===e&&i.password===s&&(t.game.global.currentUser=i,t.state.start("welcome"),n=!0)}),n||(i.visible=!0,t.time.events.add(3*Phaser.Timer.SECOND,function(){i.visible=!1},this))}else console.error(r)},a.send(null)},this)},startGame:function(){this.state.start("game")}}}),require.register("states/menu.js",function(t,e,s){s.exports={create:function(){var t=this.add.text(0,0,"Duck Quest",{fill:"white",font:"100px fantasy"});t.alignIn(this.world,Phaser.CENTER);var e=this.button=this.add.sprite(this.world.centerX,this.world.centerY+100,"button","blue_button04.png");e.anchor.set(.5,.5),e.inputEnabled=!0,e.input.useHandCursor=!0;var s=this.add.text(0,0,"Login",{align:"center"});s.anchor.set(.5,.5),e.addChild(s),e.events.onInputDown.add(this.loginPage.bind(this),this);var i=this.button=this.add.sprite(this.world.centerX,this.world.centerY+200,"button","blue_button04.png");i.anchor.set(.5,.5),i.inputEnabled=!0,i.input.useHandCursor=!0;var a=this.add.text(0,0,"Signup",{align:"center"});a.anchor.set(.5,.5),i.addChild(a),i.events.onInputDown.add(this.signupPage.bind(this),this)},startGame:function(){this.state.start("game")},loginPage:function(){this.state.start("login")},signupPage:function(){this.state.start("signup")}}}),require.register("states/ranking.js",function(t,e,s){s.exports={create:function(){var t=this,e=[],s=this.add.text(this.game.global.titlePlacement.x,this.game.global.titlePlacement.y,"Ranking",this.game.global.titleStyle);s.anchor.set(.5);var i=new XMLHttpRequest;i.open("GET","https://duchennegame.herokuapp.com/api/users",!0),i.onload=function(){var s=JSON.parse(i.responseText);if(console.log("users from db: ",s),4==i.readyState&&"200"==i.status){e=s.sort(function(t,e){return e.high_score-t.high_score}),console.log("sortedUsers: ",e);for(var a=0;a<e.length;a++)console.log("sortedUser[i].name: "+e[a].name),console.log("sortedUser[i].high_score: "+e[a].high_score),t.add.text(100,t.game.global.titlePlacement.y+100+50*a+1,a+1,{fill:"white"}).anchor.setTo(.5),t.add.text(150,t.game.global.titlePlacement.y+100+50*a+1,e[a].name,{fill:"white"}).anchor.setTo(.5),t.add.text(250,t.game.global.titlePlacement.y+100+50*a+1,e[a].high_score,{fill:"white"}).anchor.setTo(.5)}else console.error(s)},i.send(null);var a=this.checkLoginBtn=this.add.sprite(this.world.centerX,.8*this.world.height,"button","blue_button04.png");a.anchor.set(.5,.5),a.inputEnabled=!0,a.input.useHandCursor=!0;var r=this.add.text(0,0,"Exit",this.game.global.buttonLabelStyle);r.anchor.set(.5,.5),a.addChild(r),a.events.onInputDown.add(function(){t.state.start("welcome")})},startGame:function(){this.state.start("game")},settingsPage:function(){this.state.start("settings")}}}),require.register("states/settings.js",function(t,e,s){s.exports={create:function(){var t=this,e=this.add.text(this.game.global.titlePlacement.x,this.game.global.titlePlacement.y,"Settings",this.game.global.titleStyle);e.anchor.set(.5);var s=this.arrowBack=this.add.image(50,50,"arrowBack");s.anchor.set(.5,.5),s.scale.setTo(.6,.6),s.tint=this.game.global.primaryColorTint,s.inputEnabled=!0,s.input.useHandCursor=!0,s.events.onInputDown.add(function(){t.state.start("welcome")},this);var i=this.add.text(.25*this.world.centerX,.6*this.world.height,"Input device",{fill:"white",font:"20px Arial"});i.anchor.set(.5);var a=this.keyTouchBtn=this.add.sprite(.45*this.world.width,.6*this.world.height,"button","blue_button04.png");a.anchor.set(.5,.5),a.alpha=.6,a.inputEnabled=!0,a.input.useHandCursor=!0;var r=this.add.text(0,0,"Keyboard/Touch",this.game.global.buttonLabelStyle);r.anchor.set(.5,.5),a.addChild(r),a.events.onInputDown.add(function(){t.game.global.inputDevice="keyboard_touch",h.visible=!1},this);var n=this.breathingBtn=this.add.sprite(.75*this.world.width,.6*this.world.height,"button","blue_button04.png");n.anchor.set(.5,.5),n.alpha=.6,n.inputEnabled=!0,n.input.useHandCursor=!0;var o=this.add.text(0,0,"Breath",this.game.global.buttonLabelStyle);o.anchor.set(.5,.5),n.addChild(o),n.events.onInputDown.add(function(){t.game.global.inputDevice="breath",h.visible=!0},this);var h=this.calibrationBtn=this.add.sprite(.75*this.world.width,.7*this.world.height,"button","blue_button04.png");h.anchor.set(.5,.5),h.inputEnabled=!0,h.input.useHandCursor=!0,h.visible=!1;var l=this.add.text(0,0,"Calibration",this.game.global.buttonLabelStyle);l.anchor.set(.5,.5),h.addChild(l),h.events.onInputDown.add(function(){this.state.start("calibration1")},this)},update:function(){this.checkCurrentInputDevice(this.keyTouchBtn,this.breathingBtn)},startGame:function(){this.state.start("game")},settingsPage:function(){this.state.start("settings")},checkCurrentInputDevice:function(t,e){t.alive&&e.alive&&("keyboard_touch"===this.game.global.inputDevice?(t.alpha=1,e.alpha=.6):"breath"===this.game.global.inputDevice&&(t.alpha=.6,e.alpha=1))}}}),require.register("states/signup.js",function(t,e,s){s.exports={create:function(){var t=this,e=this.add.text(this.game.global.titlePlacement.x,this.game.global.titlePlacement.y,"Signup",this.game.global.titleStyle);e.anchor.set(.5);var s=this.arrowBack=this.add.image(50,50,"arrowBack");s.anchor.set(.5,.5),s.scale.setTo(.6,.6),s.tint=this.game.global.primaryColorTint,s.inputEnabled=!0,s.input.useHandCursor=!0,s.events.onInputDown.add(function(){t.state.start("menu")},this),this.nameInput=this.add.inputField(this.world.centerX-140,this.world.centerY-50,{font:"20px Arial",width:250,padding:16,borderWidth:3,borderColor:"#2cc0ff",borderRadius:6,placeHolder:"Name"}),this.passwordInput=this.add.inputField(this.world.centerX-140,this.world.centerY+25,{font:"20px Arial",width:250,padding:16,borderWidth:3,borderColor:"#2cc0ff",borderRadius:6,placeHolder:"Password",type:PhaserInput.InputType.password});var i=this.errorMessage=this.add.text(this.world.centerX,.9*this.world.height,"Fill both fields please, they cannot be empty :)",{fill:"#ff3647"});i.anchor.set(.5),i.visible=!1;var a=this.checkLoginBtn=this.add.sprite(this.world.centerX,this.world.centerY+140,"button","blue_button04.png");a.anchor.set(.5,.5),a.inputEnabled=!0,a.input.useHandCursor=!0;var r=this.add.text(0,0,"Signup",this.game.global.buttonLabelStyle);r.anchor.set(.5,.5),a.addChild(r),a.events.onInputDown.add(function(){var e=this.nameInput.value,s=this.passwordInput.value;console.log("name: "+e+", pass: "+s),t.saveNewUser(e,s)},this)},startGame:function(){this.state.start("game")},saveNewUser:function(t,e){var s=this;if(t&&e){var i=new XMLHttpRequest;i.open("POST","https://duchennegame.herokuapp.com/api/users",!0),i.setRequestHeader("Content-Type","application/json;charset=UTF-8");var a=JSON.stringify({name:t,password:e});i.send(a),i.onreadystatechange=function(){i.readyState==XMLHttpRequest.DONE&&200==i.status&&(console.log(i.responseText),s.retrieveNewUser(t))}}else s.errorMessage.visible=!0,s.time.events.add(3*Phaser.Timer.SECOND,function(){s.errorMessage.visible=!1},this)},retrieveNewUser:function(t){var e=this,s=new XMLHttpRequest;s.open("GET","https://duchennegame.herokuapp.com/api/users",!0),s.onload=function(){var i=JSON.parse(s.responseText);if(4==s.readyState&&"200"==s.status){var a=!1;i.forEach(function(s){s.name===t&&(e.game.global.currentUser=s,e.state.start("welcome"),a=!0)}),a||(e.errorMessage.setText("Problem in retrieving the current user"),e.errorMessage.visible=!0,e.time.events.add(3*Phaser.Timer.SECOND,function(){e.errorMessage.visible=!1},e))}else console.error(i)},s.send(null)}}}),require.register("states/welcome.js",function(t,e,s){s.exports={create:function(){var t=this,e=new XMLHttpRequest;e.open("GET","https://duchennegame.herokuapp.com/api/users/"+this.game.global.currentUser.id,!0),e.onload=function(){var s=JSON.parse(e.responseText);4==e.readyState&&"200"==e.status?s.calibrations.length?(t.game.global.currentUserCalibration.min=s.calibrations[0].max_inhale,t.game.global.currentUserCalibration.max=s.calibrations[0].max_exhale):console.log("You should do a calibration to use the breathing"):console.error(s)},e.send(null);var s=this.add.text(this.game.global.titlePlacement.x,this.game.global.titlePlacement.y,"Welcome",this.game.global.titleStyle);s.anchor.set(.5),s.setText("Welcome, "+this.game.global.currentUser.name+"!");var i=this.gameInstruction=this.add.text(this.world.centerX,.4*this.world.height,"Here goes some explanation on how the game works!",{fill:"#FFF",font:"20px Arial"});i.anchor.set(.5);var a=this.settings=this.add.image(this.world.width-90,50,"gear");a.scale.setTo(.6,.6),a.tint=this.game.global.primaryColorTint,a.inputEnabled=!0,a.input.useHandCursor=!0,a.events.onInputDown.add(function(){this.settingsPage()},this);var r=this.leaderboard=this.add.image(this.world.width-160,50,"leaderboard");r.scale.setTo(.6,.6),r.tint=this.game.global.primaryColorTint,r.inputEnabled=!0,r.input.useHandCursor=!0,r.events.onInputDown.add(function(){this.leaderboardPage()},this);var n=this.startBtn=this.add.sprite(this.world.centerX,.85*this.world.height,"button","blue_button04.png");n.anchor.set(.5,.5),n.inputEnabled=!0,n.input.useHandCursor=!0;var o=this.add.text(0,0,"Start",this.game.global.buttonLabelStyle);o.anchor.set(.5,.5),n.addChild(o),n.events.onInputDown.add(function(){this.startGame()},this)},startGame:function(){this.state.start("game")},settingsPage:function(){this.state.start("settings")},leaderboardPage:function(){this.state.start("ranking")}}}),require.register("___globals___",function(t,e,s){})}(),require("___globals___"),require("initialize");