function Gay(options){
	if(options.owner == "player"){
		this.speed = options.speed !== undefined ? options.speed : 0.8;
	}
	else{
		this.speed = options.speed !== undefined ? options.speed : -0.8;
	}

	Unit.call(this, options);
	
	this.width = 68;
	this.height = 90;
	this.range = 34;
		
	this.damage = 5;
	this.maxHealth = 30;
	this.health = this.maxHealth;
	this.cadency = 20;
	
	if(options.owner == "player"){
		this.texture = game.textures.get("gay", {animation:{frames:5,speed:7}});
	}
	else{
		this.texture = game.textures.get("gay", {animation:{frames:5,speed:7},flip:"x"});
	}
	this.owner = options.owner !== undefined ? options.owner : false;
	
};
Gay.prototype = new Unit();