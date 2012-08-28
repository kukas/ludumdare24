function Angel( options ){
	
	this.speed = options.speed !== undefined ? options.speed : 0.5;
	
	Unit.call(this, options);
	
	this.width = 59;
	this.height = 96;
	this.range = 300;
	
	this.damage = 8;
	this.maxHealth = 50;
	this.health = this.maxHealth;
	this.cadency = 30;
	this.price = 500;
	
	this.spawnSound = game.jukebox.sounds["angel"];
	
	this.texture = game.textures.get("angel", {
		totalFrames: 5,
		currentAnimation: "walking",
		animations:{
			walking: {
				start: 0,
				end: 4,
				speed: 7
			},
			attack: {
				start: 4,
				end: 5,
				speed: 10,
				cycle: false
			}
		}
	});
	
	this.projectile = this.projectile = game.textures.get("fireball",{
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
Angel.prototype = new Unit();