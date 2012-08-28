function Teacher( options ){
	this.speed = options.speed !== undefined ? options.speed : 0.3;

	Unit.call(this, options);
	
	this.width = 46;
	this.height = 64;
	this.range = 200;
	
	this.damage = 1;
	this.maxHealth = 5;
	this.health = this.maxHealth;
	this.cadency = 30;
	this.price = 30;
	
	this.spawnSound = game.jukebox.sounds["teacher"];
	
	this.texture = game.textures.get("teacher", {
		totalFrames: 7,
		currentAnimation: "walking",
		animations:{
			walking: {
				start: 0,
				end: 5,
				speed: 7
			},
			attack: {
				start: 5,
				end: 7,
				speed: 10,
				cycle: true
			}
		}
	});
	
	this.projectile = game.textures.get("kridaParticle");
	this.projectileHeight = 15;
	this.projectileWidth = 5;
	
	if(options.owner == "enemy"){
		this.texture.flip = "x";
	}

	this.owner = options.owner !== undefined ? options.owner : false;
	
};
Teacher.prototype = new Unit();