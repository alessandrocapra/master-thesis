!function(){"use strict";var e="undefined"==typeof global?self:global;if("function"!=typeof e.require){var t={},s={},i={},r={}.hasOwnProperty,n=/^\.\.?(\/|$)/,o=function(e,t){for(var s,i=[],r=(n.test(t)?e+"/"+t:t).split("/"),o=0,a=r.length;o<a;o++)s=r[o],".."===s?i.pop():"."!==s&&""!==s&&i.push(s);return i.join("/")},a=function(e){return e.split("/").slice(0,-1).join("/")},c=function(t){return function(s){var i=o(a(t),s);return e.require(i,t)}},l=function(e,t){var i=g&&g.createHot(e),r={id:e,exports:{},hot:i};return s[e]=r,t(r.exports,c(e),r),r.exports},d=function(e){return i[e]?d(i[e]):e},u=function(e,t){return d(o(a(e),t))},h=function(e,i){null==i&&(i="/");var n=d(e);if(r.call(s,n))return s[n].exports;if(r.call(t,n))return l(n,t[n]);throw new Error("Cannot find module '"+e+"' from '"+i+"'")};h.alias=function(e,t){i[t]=e};var f=/\.[^.\/]+$/,p=/\/index(\.[^\/]+)?$/,y=function(e){if(f.test(e)){var t=e.replace(f,"");r.call(i,t)&&i[t].replace(f,"")!==t+"/index"||(i[t]=e)}if(p.test(e)){var s=e.replace(p,"");r.call(i,s)||(i[s]=e)}};h.register=h.define=function(e,i){if(e&&"object"==typeof e)for(var n in e)r.call(e,n)&&h.register(n,e[n]);else t[e]=i,delete s[e],y(e)},h.list=function(){var e=[];for(var s in t)r.call(t,s)&&e.push(s);return e};var g=e._hmr&&new e._hmr(u,h,t,s);h._cache=s,h.hmr=g&&g.wrap,h.brunch=!0,e.require=h}}(),function(){"undefined"==typeof window?this:window;require.register("data/const.js",function(e,t,s){s.exports=Object.freeze({colors:Object.freeze({aqua:"#62f6ff",black:"#000",yellow:"#fed141",white:"#fff"}),fonts:Object.freeze({"default":"Futura, system-ui, sans-serif"}),hexColors:Object.freeze({darkGray:2236962,red:16720384,white:16777215})})}),require.register("initialize.js",function(e,t,s){window.game=new Phaser.Game({width:800,height:600,type:Phaser.AUTO,title:"☕️ Brunch with Phaser",url:"https://github.com/samme/brunch-phaser",version:"0.0.1",banner:{background:["#e54661","#ffa644","#998a2f","#2c594f","#002d40"]},loader:{path:"assets/"},physics:{"default":"arcade",arcade:{gravity:{y:300}}},callbacks:{postBoot:function(e){console.debug("game.config",e.config)}},scene:[t("scenes/boot"),t("scenes/default"),t("scenes/menu")]})}),require.register("scenes/boot.js",function(e,t,s){var i=t("data/const");s.exports={key:"boot",preload:function(){this.load.image("sky","sky.png"),this.load.image("ground","platform.png"),this.load.image("star","star.png"),this.load.image("bomb","bomb.png"),this.load.spritesheet("dude","dude.png",{frameWidth:32,frameHeight:48}),this.load.on("progress",this.onLoadProgress,this),this.load.on("complete",this.onLoadComplete,this),this.createProgressBar()},create:function(){this.registry.set("score",0),this.scene.start("menu")},extend:{progressBar:null,progressCompleteRect:null,progressRect:null,createProgressBar:function(){var e=Phaser.Geom.Rectangle,t=e.Clone(this.cameras.main);this.progressRect=new e(0,0,.5*t.width,50),e.CenterOn(this.progressRect,t.centerX,t.centerY),this.progressCompleteRect=e.Clone(this.progressRect),this.progressBar=this.add.graphics()},onLoadComplete:function(e,t,s){console.debug("complete",t),console.debug("failed",s),this.progressBar.destroy()},onLoadProgress:function(e){console.debug("progress",e),this.progressRect.width=e*this.progressCompleteRect.width,this.progressBar.clear().fillStyle(i.hexColors.darkGray).fillRectShape(this.progressCompleteRect).fillStyle(this.load.totalFailed?i.hexColors.red:i.hexColors.white).fillRectShape(this.progressRect)}}}}),require.register("scenes/default.js",function(e,t,s){var i,r,n,o,a,c,l,d,u,h;t("data/const");s.exports={key:"default",init:function(e){console.debug("init",this.scene.key,e,this),this.events.once("shutdown",this.shutdown,this),this.score=0},create:function(){var e=this;h=io(),h.on("connect",function(){console.log("client (game) connected to server"),h.on("sensor",function(e){console.log("data: "+e.message),i=e.message}),h.on("pressure",function(e){r.setText("Pressure: "+e.pressure+"Pa")})}),l=this.physics.add.group({bounceY:.2,collideWorldBounds:!0}),h.on("currentPlayers",function(t){Object.keys(t).forEach(function(s){t[s].playerId===h.id?e.addPlayer(e,t[s],function(){e.initializeColliders(e)}):e.addOtherPlayers(e,t[s])})}),h.on("newPlayer",function(t){e.addOtherPlayers(e,t)}),h.on("disconnect",function(e){l.getChildren().forEach(function(t){e===t.playerId&&t.destroy()})}),h.on("gameOver",function(t){var s=t;e.physics.pause(),l&&l.getChildren().forEach(function(e){e.playerId==s&&e.setTint(0),e.anims.play("turn")}),n.playerId==t&&n.setTint(0),n.anims.play("turn")}),h.on("playerMoved",function(e){console.log("playerMoved"),l.getChildren().forEach(function(t){e.playerId===t.playerId&&(console.log("Direction: "+e.direction),"left"===e.direction?t.anims.play("left",!0):"right"===e.direction?t.anims.play("right",!0):t.anims.play("turn"),t.setPosition(e.x,e.y))})}),this.add.image(400,300,"sky"),a=this.physics.add.staticGroup(),a.create(400,568,"ground").setScale(2).refreshBody(),a.create(600,400,"ground"),a.create(50,250,"ground"),a.create(750,220,"ground"),this.anims.create({key:"left",frames:this.anims.generateFrameNumbers("dude",{start:0,end:3}),frameRate:10,repeat:-1}),this.anims.create({key:"turn",frames:[{key:"dude",frame:4}],frameRate:20}),this.anims.create({key:"right",frames:this.anims.generateFrameNumbers("dude",{start:5,end:8}),frameRate:10,repeat:-1}),h.on("starLocation",function(t){o&&o.destroy(),o=e.physics.add.image(t.x,t.y,"star"),e.physics.add.collider(o,a),o.setBounceY(Phaser.Math.FloatBetween(.4,.6)),e.physics.add.overlap(n,o,function(){h.emit("starCollected")},null,e)}),c=this.physics.add.group(),this.physics.add.collider(c,a),h.on("bombLocation",function(e){console.log("bombLocation message received");var t=c.create(e.x,e.y,"bomb");t.setBounce(1),t.setCollideWorldBounds(!0),t.setVelocity(e.velocityX,e.velocityY),t.allowGravity=!1}),d=this.add.text(16,16,"",{fontSize:"32px",fill:"#0000FF"}),u=this.add.text(584,16,"",{fontSize:"32px",fill:"#FF0000"}),h.on("scoreUpdate",function(e){d.setText("Blue: "+e.blue),u.setText("Red: "+e.red)}),this.cursors=this.input.keyboard.createCursorKeys(),this.input.keyboard.once("keydown_Q",this.quit,this),this.input.keyboard.once("keydown_R",this.restart,this)},update:function(){if(n){this.cursors.left.isDown||"left"==i?(n.setVelocityX(-160),n.anims.play("left",!0)):this.cursors.right.isDown||"right"==i?(n.setVelocityX(160),n.anims.play("right",!0)):"turn"==i?(n.setVelocityX(0),n.anims.play("turn")):(n.setVelocityX(0),n.anims.play("turn")),(this.cursors.up.isDown||"up"==i)&&n.body.touching.down&&n.setVelocityY(-330);var e=n.x,t=n.y;!n.oldPosition||e===n.oldPosition.x&&t===n.oldPosition.y||h.emit("playerMovement",{x:n.x,y:n.y}),n.oldPosition={x:n.x,y:n.y}}},extend:{score:0,quit:function(){this.scene.start("menu")},restart:function(){this.scene.restart()},shutdown:function(){this.registry.set("score",this.score)},addPlayer:function(e,t,s){n=e.physics.add.sprite(t.x,t.y,"dude"),n.setBounce(.2),n.setCollideWorldBounds(!0),"blue"===t.team?n.setTint(255):n.setTint(16711680),n.playerId=t.playerId,s(e)},addOtherPlayers:function(e,t){var s=e.add.sprite(t.x,t.y,"dude");e.physics.add.collider(s,a),"blue"===t.team?s.setTint(255):s.setTint(16711680),s.playerId=t.playerId,l.add(s)},initializeColliders:function(e){e.physics.add.collider(n,a),e.physics.add.collider(n,c,e.hitBomb,null,e)},hitBomb:function(e,t){console.log("Inside hitBomb"),h.emit("endGame",h.id)}}}}),require.register("scenes/menu.js",function(e,t,s){var i=t("data/const");s.exports={key:"menu",init:function(e){console.debug("init",this.scene.key,e,this)},create:function(){var e=this;this.add.image(400,300,"sky").setAlpha(.5),this.startText=this.add.text(400,300,"START",{fill:"white",fontFamily:i.fonts["default"],fontSize:48}).setOrigin(.5).setShadow(0,1,i.colors.aqua,10),this.calibrationText=this.add.text(400,450,"Calibration",{fill:i.colors.aqua,fontFamily:i.fonts["default"],fontSize:30}).setOrigin(.5).setShadow(0,1,"black",5),this.startText.setInteractive(new Phaser.Geom.Rectangle(0,0,this.startText.width,this.startText.height),Phaser.Geom.Rectangle.Contains),this.calibrationText.setInteractive(new Phaser.Geom.Rectangle(0,0,this.calibrationText.width,this.calibrationText.height),Phaser.Geom.Rectangle.Contains),this.input.on("pointerover",function(e,t){t[0].setTint(16776960)}),this.input.on("pointerout",function(e,t){t[0].clearTint()}),this.startText.on("pointerdown",function(t){e.scene.start("default")})},extend:{}}}),require.register("___globals___",function(e,t,s){})}(),require("___globals___"),require("initialize");