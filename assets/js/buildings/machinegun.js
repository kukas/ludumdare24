function Machinegun( options ){
	
	Building.call(this, options);
	
	this.maxHealth = 30;
	this.health = this.maxHealth;
	this.damage = 1;
	this.cadency = 30;
	
	this.width = 96;
	this.height = 64;
	this.range = 250;
	
	this.owner = options.owner !== undefined ? options.owner : "player";
	this.price = 15;
	this.maxQueue = 1;
	
	this.texture = game.textures.get("machinegun",{
		totalFrames: 4,
		currentAnimation: "being",
		animations:{
			being: {
				start: 0,
				end: 1,
				speed: 1000,
			},
			attack:{
				start:1,
				end:4,
				speed:6,
			},
		}
	});

	if(this.owner == "player"){
		this.texture.flip = "x";
	}
	
	this.projectile = game.textures.get("bulletParticle");
	this.projectileWidth = 6;
	this.projectileHeight = 4;

};
Machinegun.prototype = new Building();