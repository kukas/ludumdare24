function Terese( options ){
	
	this.speed = options.speed !== undefined ? options.speed : 1;
	
	Unit.call(this, options);
	
	this.width = 34;
	this.height = 64;
	this.range = 200;
	
	this.damage = 6;
	this.maxHealth = 150;
	this.health = this.maxHealth;
	this.cadency = 10;
	this.price = 1000;
	
	this.spawnSound = game.jukebox.sounds["matherTerese"];
	
	this.texture = game.textures.get("terese", {
		totalFrames: 4,
		currentAnimation: "walking",
		animations:{
			walking: {
				start: 0,
				end: 2,
				speed: 7
			},
			attack: {
				start: 2,
				end: 4,
				speed: 10,
				cycle: false
			}
		}
	});
	
	this.projectile = game.textures.get("bulletParticle");
	this.projectileWidth = 6;
	this.projectileHeight = 4;

	if(options.owner == "enemy"){
		this.texture.flip = "x";
	}

	this.owner = options.owner !== undefined ? options.owner : "player";
};
Terese.prototype = new Unit();