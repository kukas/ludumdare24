function Game(){
	var _this = this;
	this.levelpath = "assets/levels/";
	this.canvas = document.createElement("canvas");
	this.canvas.innerHTML = "Your browser does not support Canvas. <br>Please download a modern browser to see the content."
	this.ctx = this.canvas.getContext("2d");

	this.width = 480;
	this.height = 300;
	this.scale = 1;
	// místo ticků je čas od startu tick smyčky.
	this.startTime = new Date().getTime();
	this.time = 0;

	this.eventhandler = new Eventhandler( this.canvas );
	this.gui = new GUI();
	this.textures = new Textures();
	this.jukebox = new Jukebox();

	this.eventhandler.addMouseControl(1, function(x,y){
		_this.gui.mousehandler(x,y,"onMouseDown");
	}, function(x,y){
		_this.gui.mousehandler(x,y,"onMouseUp");
	});
	this.eventhandler.addMouseControl(0, function(x,y){
		_this.gui.mousehandler(x,y,"onMouseMove");
	});

	this.objects = {};
	this.camera = {
		x: 0,
		y: 0,
		tX: function(x){
			return x + this.x;
		},
		tY: function(y){
			return y + this.y;
		}
	};
};

Game.prototype.render = function() {
	var _this = this;
	requestAnimationFrame(function(){
		_this.render();
	});
	stats.begin();
	this.tick();

	this.ctx.save();
	this.ctx.scale(this.scale, this.scale);

	this.ctx.clearRect(0, 0, this.width, this.height);

	this.gui.render(this.ctx);

	this.ctx.restore();

	stats.end();
};
Game.prototype.tick = function() {
	this.time = new Date().getTime() - this.startTime;

	this.eventhandler.loop();
	this.gui.tick();
};

Game.prototype.centerCanvas = function() {
	this.canvas.width = this.width * this.scale;
	this.canvas.height = this.height * this.scale;

	this.canvas.style.left = (window.innerWidth - this.width * this.scale)/2;
	this.canvas.style.top = (window.innerHeight - this.height * this.scale)/3;

	this.eventhandler.offset = $(this.canvas).offset();
	this.gui.width = this.width * this.scale;
	this.gui.height = this.height * this.scale;
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

	this.loadLevel("menu")

	this.disableInterpolation();
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
			} )
		} );
	});
};