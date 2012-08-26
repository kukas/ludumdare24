function Professor( options ){
	this.speed = options.speed !== undefined ? options.speed : 1;

	Unit.call(this, options);
	
	this.width = 64;
	this.height = 64;
	this.range = 32;
	
	this.damage = 6;
	this.maxHealth = 15;
	this.health = this.maxHealth;
	this.cadency = 50;
	this.price = 100;
	
	this.spawnSound = game.jukebox.sounds["professor"];
	
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

	if(options.owner == "enemy"){
		this.texture.flip = "x";
	}
	
	this.owner = options.owner !== undefined ? options.owner : false;
};
Professor.prototype = new Unit();