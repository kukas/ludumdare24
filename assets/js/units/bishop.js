function Bishop( options ){
	
	this.speed = options.speed !== undefined ? options.speed : 0.4;
	
	Unit.call(this, options);
	
	this.width = 64;
	this.height = 75;
	this.range = 32;
	
	this.damage = 10;
	this.maxHealth = 50;
	this.health = this.maxHealth;
	this.cadency = 30;
	this.price = 400;
	
	this.spawnSound = game.jukebox.sounds["bishop"];
	
	this.texture = game.textures.get("bishop", {
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
				cycle: false
			}
		}
	});

	if(options.owner == "enemy"){
		this.texture.flip = "x";
	}

	this.owner = options.owner !== undefined ? options.owner : "player";
};
Bishop.prototype = new Unit();