function Game(){
	var _this = this;
	this.levelpath = "assets/levels/";
	this.canvas = document.createElement("canvas");
	this.canvas.innerHTML = "Your browser does not support Canvas. <br>Please download a modern browser to see the content."
	this.ctx = this.canvas.getContext("2d");

	this.width = 960;
	this.height = 400;
	this.scale = 1;

	this.ticks = 0;

	this.clearColor = "#BDFFFF";

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
		
	this.player = {side:"creationist",color:"#93C6CC"};
	this.enemy = {side:"atheist",color:"#F0271D"};
};

Game.prototype = new Object2D();

Game.prototype.render = function() {
	var _this = this;
	requestAnimationFrame(function(){
		_this.render();
	});
	stats.begin();
	this.tick();

	this.ctx.fillStyle = this.clearColor;
	this.ctx.fillRect(0, 0, this.width, this.height);

	this.ctx.save();
	this.ctx.scale(this.scale, this.scale);

	this.ctx.translate(-this.camera.x, -this.camera.y)

	this.renderChildren(this.ctx);
	
	if(this.lights && this.renderLights)
		this.lights.render(this.ctx);

	if(this.lights && this.renderLights)
		this.lights.renderMask(this.ctx);
	

	this.gui.render(this.ctx);

	this.ctx.restore();

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
	this.fightControl();
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

Game.prototype.fightControl = function (){
	for(var i in this.children){
		for(var j in this.children){
			if(this.children[i].rangeCollision(this.children[j])) this.children[i].dealDamage(this.children[j]);
		};
	};	
};