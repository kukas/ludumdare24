function Troll(options){
	this.speed = options.speed !== undefined ? options.speed : 2;

	Unit.call(this, options);
	
	this.width = 64;
	this.height = 64;
	this.range = 32;
	
	this.damage = 1;
	this.health = 10;
	this.maxHealth = 10;
	this.cadency = 3;
	
	this.texture = game.textures.get("troll");

	if(options.owner == "enemy"){
		this.texture.flip = "x";
	}
	
	this.owner = options.owner !== undefined ? options.owner : false;
	
};
Troll.prototype = new Unit();