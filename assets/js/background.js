function Background(options){
	Object2D.call(this, options);
	this.collidable = false;
}
Background.prototype = new Object2D();

Background.prototype.tick = function() {
	this.rotation += 0.01;
};