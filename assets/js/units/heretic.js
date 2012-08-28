function Heretic( options ){
	
	this.speed = options.speed !== undefined ? options.speed : 0.4;
	
	Unit.call(this, options);
	
	this.width = 53;
	this.height = 64;
	this.range = 26;
	
	this.damage = 8;
	this.maxHealth = 50;
	this.health = this.maxHealth;
	this.cadency = 40;
	this.price = 400;
	
	this.spawnSound = game.jukebox.sounds["heretic"];
	
	this.texture = game.textures.get("heretic", {
		totalFrames: 8,
		currentAnimation: "walking",
		animations:{
			walking: {
				start: 0,
				end: 6,
				speed: 7
			},
			attack: {
				start: 6,
				end: 8,
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
Heretic.prototype = new Unit();