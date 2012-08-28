function CrossScorpio( options ){
	
	Building.call(this, options);
	
	this.maxHealth = 15;
	this.health = this.maxHealth;
	this.damage = 1;
	this.cadency = 60;
	
	this.width = 96;
	this.height = 96;
	this.range = 250;
	
	this.owner = options.owner !== undefined ? options.owner : "player";
	this.price = 15;
	this.maxQueue = 1;
	
	this.texture = game.textures.get("crossscorpio",{
		totalFrames: 2,
		currentAnimation: "being",
		animations:{
			being: {
				start: 1,
				end: 2,
				speed: 7,
			},
			attack:{
				start:0,
				end:1,
				speed:7,
			},
		}
	});

	if(options.owner == "enemy"){
		this.texture.flip = "x";
	}
	
	this.projectile = game.textures.get("crossScorpioParticle");
	this.projectileWidth = 93;
	this.projectileHeight = 35;

};
CrossScorpio.prototype = new Building();