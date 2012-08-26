function Background(options){
	Object2D.call(this, options);
	this.collidable = false;
	this.relative = true;
}
Background.prototype = new Object2D();
