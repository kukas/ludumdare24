function Building(options){
	Object2D.call(this, options);
	
	this.texture = options.texture !== undefined ? options.texture : false;
}
Building.prototype = new Object2D();