function Wallace( options ){
	
	this.speed = options.speed !== undefined ? options.speed : 1;
	
	Unit.call(this, options);
	
	this.width = 64;
	this.height = 64;
	this.range = 500;
	
	this.damage = 6;
	this.maxHealth = 150;
	this.health = this.maxHealth;
	this.cadency = 10;
	this.price = 1000;
	
	this.spawnSound = game.jukebox.sounds["wallace"];
	
	this.texture = game.textures.get("wallace", {
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
	
	this.projectile = this.projectile = game.textures.get("litajici_zaba",{
		totalFrames:4,
		currentAnimation:"being",
		animations : {
			being : {
				start : 0,
				end : 4,
				speed : 10,
			},
		},
	});

	if(options.owner == "enemy"){
		this.texture.flip = "x";
	}

	this.owner = options.owner !== undefined ? options.owner : "player";
};
Wallace.prototype = new Unit();