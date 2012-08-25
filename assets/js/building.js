function Building(options){
	Object2D.call(this, options);
	
	this.texture = options.texture !== undefined ? options.texture : false;
	
	this.actions = options.actions !== undefined ? options.actions : false;
	
	this.owner = options.owner !== undefined ? options.owner : false;
}
Building.prototype = new Object2D();