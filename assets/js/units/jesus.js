function Jesus( options ){

	this.speed = options.speed !== undefined ? options.speed : 0.2;
	
	Unit.call(this, options);
	
	this.width = 46;
	this.height = 79;
	this.range = 23;
	
	this.damage = 20;
	this.maxHealth = 300;
	this.health = this.maxHealth;
	this.cadency = 50;
	this.price = 2000;
	
	this.spawnSound = game.jukebox.sounds["jesus"];
	
	this.texture = game.textures.get("jesus", {
		totalFrames: 10,
		currentAnimation: "walking",
		animations:{
			walking: {
				start: 0,
				end: 9,
				speed: 7
			},
			attack: {
				start: 9,
				end: 10,
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
Jesus.prototype = new Unit();