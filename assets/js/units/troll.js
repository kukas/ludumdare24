function Troll(options){
	if(options.owner == "player"){
		this.speed = options.speed !== undefined ? options.speed : 2;
	}
	else{
		this.speed = options.speed !== undefined ? options.speed : -2;
	}

	Unit.call(this, options);
	
	this.width = 64;
	this.height = 64;
	this.range = 32;
	
	this.damage = 1;
	this.health = 10;
	this.maxHealth = 10;
	this.cadency = 3;
	
	if(options.owner == "player"){
		this.texture = game.textures.get("troll");
	}
	else{
		this.texture = game.textures.get("troll", {flip:"x"});
	}
	
	this.owner = options.owner !== undefined ? options.owner : false;
	
};
Troll.prototype = new Unit();