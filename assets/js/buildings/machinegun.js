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
	
	this.projectile = game.textures.get("crossScorpioParticle");
	this.projectileWidth = 93;
	this.projectileHeight = 35;

};
Machinegun.prototype = new Building();