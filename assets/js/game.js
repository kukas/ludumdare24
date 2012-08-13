function Game(){
	this.canvas = document.createElement("canvas");
	this.canvas.innerHTML = "Your browser does not support Canvas. <br>Please download a modern browser to see the content."
	this.ctx = this.canvas.getContext("2d");

	this.width = 480;
	this.height = 300;
	this.scale = 1;
	// místo ticků je čas od startu tick smyčky.
	this.startTime = new Date().getTime();
	this.time = 0;

	this.eventhandler = new Eventhandler();

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

	this.ctx.fillText(this.time, 2, 10);

	this.ctx.restore();

	stats.end();
};
Game.prototype.tick = function() {
	this.time = new Date().getTime() - this.startTime;
};

Game.prototype.centerCanvas = function() {
	this.canvas.width = this.width * this.scale;
	this.canvas.height = this.height * this.scale;

	this.canvas.style.left = (window.innerWidth - this.width * this.scale)/2;
	this.canvas.style.top = (window.innerHeight - this.height * this.scale)/3;
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

	this.disableInterpolation();
	this.render();
};