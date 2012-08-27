function Game(){
	var _this = this;
	this.levelpath = "assets/levels/";
	this.canvas = document.createElement("canvas");
	this.canvas.innerHTML = "Your browser does not support Canvas. <br>Please download a modern browser to see the content."
	this.ctx = this.canvas.getContext("2d");

	this.width = 960;
	this.height = 500;
	this.scale = 1;

	this.playground = {
		width: 960*2,
		height: 500
	};

	this.leftShadow = this.ctx.createRadialGradient(this.height/2, this.height/2, 0, this.height/2, this.height/2, this.height);
	this.leftShadow.addColorStop(0.5, "rgba(0,0,0,0)");
	this.leftShadow.addColorStop(1, "rgba(0,0,0,1)");

	this.rightShadow = this.ctx.createRadialGradient(this.width - this.height/2, this.height/2, 0, this.width - this.height/2, this.height/2, this.height);
	this.rightShadow.addColorStop(0.5, "rgba(0,0,0,0)");
	this.rightShadow.addColorStop(1, "rgba(0,0,0,1)");

	this.ticks = 0;
	this.creationTime = new Date().getTime();

	// this.clearColor = "#BDFFFF";
	this.clearColor = new Color(0xBDFFFF);
	this.night = new Color(0x0, 0);

	this.eventhandler = new Eventhandler( this.canvas );
	this.gui = new GUI();
	this.textures = new Textures();
	this.jukebox = new Jukebox();

	this.lights = undefined;
	this.renderLights = true;

	this.children = [];
	this.camera = new Vector2();
	this.camera.tX = function(x){
			return x + this.x;
		};
	this.camera.tY = function(y){
			return y + this.y;
		};
		
	this.players = {
		player : {
			side:"creationist",
			color:"#93C6CC",
			resources:{gold:1000,spec:100},
			controledGround:100,
			},
		enemy : {
			side:"atheist",
			color:"#F0271D",
			resources:{gold:100,spec:100},
			controledGround:100,
			},
		};
		
		this.timedEvents = [];
};

Game.prototype = new Object2D();

Game.prototype.render = function() {
	var _this = this;
	requestAnimationFrame(function(){
		_this.render();
	});
	stats.begin();
	this.tick();

	this.ctx.fillStyle = this.clearColor.getRGB();
	this.ctx.fillRect(0, 0, this.width, this.height);

	this.ctx.save();
	this.ctx.scale(this.scale, this.scale);

	this.ctx.translate(-this.camera.x, -this.camera.y)

	this.renderChildren(this.ctx);

	this.ctx.restore();

	this.ctx.fillStyle = this.leftShadow;
	this.ctx.fillRect(0, 0, this.height/2, this.height);

	this.ctx.fillStyle = this.rightShadow;
	this.ctx.fillRect(this.width - this.height/2, 0, this.height/2, this.height);

	this.ctx.fillStyle = this.night.getRGBA();
	this.ctx.fillRect(0,0,this.width, this.height);

	this.gui.render(this.ctx);

	stats.end();
};
Game.prototype.tickChildren = function() {
	this.ticks++;

	this.eventhandler.loop();
	this.gui.tick();

	for (var i = 0, len = this.children.length; i < len; i++){
		this.children[i].tick();
		if(this.children[i].tickChildren)
			this.children[i].tickChildren();
	};
};

Game.prototype.tick = function() {
	this.tickChildren();
	this.updateResources();
	if(this.script)
		this.runScript( new Date().getTime() - this.creationTime );
	if(this.fade){
		this.night.alpha += 0.01;
		if(this.night.alpha >= 1){
			this.totalWin2();
			this.gui.links.xicht.links.xicht.image.alpha += 0.01;
			if(this.gui.links.xicht.links.xicht.image.alpha >= 1)
				this.totalWin3();
		}
	}
	if(this.timedEvents.length > 0){
		for(var i in this.timedEvents){
			this.timedEvents[i].toInit--;
			if(this.timedEvents[i].toInit <= 0){
				this.timedEvents[i].init();
				this.timedEvents.splice(i-1,1);
			}
		};
	}
};

Game.prototype.runScript = function(now) {
	for(var i in this.script){
		if(i < now && !this.script[i].done){
			this.script[i].exec();
			this.script[i].done = true;
		}
	}
};

Game.prototype.centerCanvas = function() {
	this.canvas.width = this.width * this.scale;
	this.canvas.height = this.height * this.scale;

	this.canvas.style.left = (window.innerWidth - this.width * this.scale)/2 + "px";
	this.canvas.style.top = (window.innerHeight - this.height * this.scale)/3 + "px";

	this.eventhandler.offset = $(this.canvas).offset();
	this.gui.width = this.width * this.scale;
	this.gui.height = this.height * this.scale;

	this.disableInterpolation();
};

// Vypne interpolaci ctx.scale(); = dodá retro atmosféru
Game.prototype.disableInterpolation = function() {
	this.ctx.webkitImageSmoothingEnabled = this.ctx.mozImageSmoothingEnabled = false;
};

Game.prototype.init = function() {
	var _this = this;

	$("body").append( game.canvas );

	this.centerCanvas();
	$(window).resize(function() {
	  _this.centerCanvas();
	});

	this.loadLevel("test")

	this.render();
};

Game.prototype.loadLevel = function(name) {
	var _this = this;
	if(this.level_loading){
		console.log("Already loading level!");
		return;
	}
	this.gui.switchGUI("loading_screen");
	this.level_loading = true;
	// díky jQuery! :)
	$.getScript(this.levelpath + name + ".js", function(){
		_this.level = level;

		// informovat uživatele
		_this.gui.guis.loading_screen.setPercentage(20);

		_this.textures.loadTextures( _this.level.textures_src, function(){

			_this.gui.guis.loading_screen.setPercentage(40);

			_this.jukebox.loadSounds( _this.level.sounds_src, function(){
				_this.gui.guis.loading_screen.setPercentage(60);

				_this.level.afterLoad();
				_this.level_loading = false;

				_this.lights = _this.level.lights;
				_this.children = _this.level.objects;
				_this.links = _this.level.links;
			} )
		} );
	});
};

Game.prototype.findCollisions = function(obj){
	var collisions = [];
	for (var i = 0, len = this.children.length; i < len; i++){
		if(this.children[i] != obj){
			if( obj.checkCollision( this.children[i] ) )
				collisions.push( this.children[i] )
		}
	};
	return collisions;
}

Game.prototype.add = function(obj, name) {
	this.children.push(obj);
	obj.parent = this;

	if(name)
		this.links[name] = obj;
};

Game.prototype.setPlayer = function (id){
	if(id == "creationist"){
		this.player = {side:"creationist",color:"#93C6CC"};
		this.enemy = {side:"atheist",color:"#F0271D"};
	}
	else{
		this.player = {side:"atheist",color:"#F0271D"};
		this.enemy = {side:"creationist",color:"#93C6CC"};
	}
};

Game.prototype.updateResources = function (){
	if(game.gui.links.resources){
		//Inicializace
		var playerResources = game.players.player.resources;
		var enemyResources = game.players.enemy.resources;
		var playerGround =  game.players.player.controledGround;
		var enemyGround =  game.players.enemy.controledGround;
		//Zvětšování
		zlomekP += Math.sqrt(playerGround)/800;
		zlomekE += Math.sqrt(playerGround)/800;
		if(Math.round(zlomekP) >= 1){
			playerResources.spec += Math.round(zlomekP);
			zlomekP = 0;
		}
		if(Math.round(zlomekE) >= 1){
			enemyResources.spec += Math.round(zlomekE);
			zlomekE = 0;
		}
		//Aktualizace
		game.gui.links.resources.links.gold.links.goldtext.text[0] = playerResources.gold;
		game.gui.links.resources.links.spec.links.spectext.text[0] = playerResources.spec;
	}
};

Game.prototype.unselectAll = function() {
	if(game.eventhandler.mouse.projected.y < game.links.terrain.middleHeight+game.links.terrain.elevation){
		game.gui.links.layout.links.unitControl.children = [];
		for(var j in game.selected){
			game.selected[j].selected = false;
		};
	}
};

Game.prototype.totalWin = function(winner) {
	this.gui.remove(this.gui.links.hp_enemy);
	this.gui.remove(this.gui.links.hp_player);
	this.fade = true;
	this.winner = winner;
};
Game.prototype.totalWin2 = function() {
	this.gui.links.subtitles.visible = true;
};

Game.prototype.totalWin3 = function() {
	if(this.script == this.totalWinScript)
		return
	this.playScript(this.totalWinScript)
};

Game.prototype.playScript = function(script) {
	this.script = script;
	this.creationTime = new Date().getTime();
};

Game.prototype.setTimeout = function (fce,mills){
	this.timedEvents.push({
		init : fce,
		toInit : mills,
	});
};