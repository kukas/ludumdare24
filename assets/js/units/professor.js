function Professor( options ){
		if(options.owner == "player"){
		this.speed = options.speed !== undefined ? options.speed : 0.2;
	}
	else{
		this.speed = options.speed !== undefined ? options.speed : -0.2;
	}

	Unit.call(this, options);
	
	this.width = 64;
	this.height = 64;
	this.range = 32;
	
	this.damage = 6;
	this.health = 15;
	this.maxHealth = 15;
	this.cadency = 50;
	
	if(options.owner == "player"){
		this.texture = game.textures.get("professor", {
			totalFrames: 3,
			currentAnimation: "walking",
			animations:{
				walking: {
					start: 0,
					end: 2,
					speed: 7
				},
				attack: {
					start: 2,
					end: 3,
					speed: 10,
					cycle: true
				}
			}
		});
	}
	else{
		this.texture = game.textures.get("professor", {
			flip: "x",
			totalFrames: 3,
			currentAnimation: "walking",
			animations:{
				walking: {
					start: 0,
					end: 2,
					speed: 7
				},
				attack: {
					start: 2,
					end: 3,
					speed: 10,
					cycle: true
				}
			}
		});
	}
	this.owner = options.owner !== undefined ? options.owner : false;
};
Professor.prototype = new Unit();