function Nun( options ){
	this.speed = options.speed !== undefined ? options.speed : 0.2;

	Unit.call(this, options);
	
	this.width = 35;
	this.height = 64;
	this.range = 300;
	
	this.damage = 3;
	this.maxHealth = 6;
	this.health = this.maxHealth;
	this.cadency = 50;
	this.price = 50;
	
	this.spawnSound = game.jukebox.sounds["nun"];
	
	this.texture = game.textures.get("nun", {
		totalFrames: 4,
		currentAnimation: "walking",
		animations:{
			walking: {
				start: 0,
				end: 3,
				speed: 7
			},
			attack: {
				start: 3,
				end: 4,
				speed: 10,
				cycle: true
			}
		}
	});
	
	this.projectile = game.textures.get("ruzenecParticle",{
		totalFrames:1,
		currentAnimation:"being",
		animations : {
			being : {
				start : 0,
				end : 1,
				speed : 10,
			},
		},
	});
	
	this.projectileWidth = 14;
	this.projectileHeight = 47;

	if(options.owner == "enemy"){
		this.texture.flip = "x";
	}

	this.owner = options.owner !== undefined ? options.owner : false;
	
};
Nun.prototype = new Unit();