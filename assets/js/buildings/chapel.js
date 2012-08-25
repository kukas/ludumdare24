function Chapel( options ){
	
	Building.call(this, options);
	this.texture = game.textures.get("kaple");
	
	this.actions = options.actions !== undefined ? options.actions : false;
	
	this.owner = options.owner !== undefined ? options.owner : false;
	
	this.maxHealth = 100;
	this.health = this.maxHealth;
	this.width = 128;
	this.height = 128;
	this.range = 64;
};
Chapel.prototype = new Building();