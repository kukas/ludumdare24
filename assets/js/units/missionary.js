function Missionary( options ){
	if(options.owner == "player"){
		this.speed = options.speed !== undefined ? options.speed : 0.5;
	}
	else{
		this.speed = options.speed !== undefined ? options.speed : -0.5;
	}

	Unit.call(this, options);
	
	this.width = 46;
	this.height = 64;
	this.range = 23;
	
	this.damage = 1;
	this.health = 3;
	this.maxHealth = 3;
	this.cadency = 30;
	
	if(options.owner == "player"){
		this.texture = game.textures.get("missionary", {animation:{frames:4,speed:7}});
	}
	else{
		this.texture = game.textures.get("misssionary", {animation:{frames:4,speed:7},flip:"x"});
	}
	this.owner = options.owner !== undefined ? options.owner : false;
	
};
Missionary.prototype = new Unit();