function Unit(options){
	Object2D.call(this, options);
	this.speed = 1;
}
Unit.prototype = new Object2D();

Unit.prototype.move = function() {
	this.position.x += this.speed;
	this.position.y = game.links.terrain.getHeight(this.position.x) - this.width/2;
};

Unit.prototype.tick = function() {
	this.move();
};