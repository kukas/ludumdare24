function Trex( options ){

	this.speed = options.speed !== undefined ? options.speed : 0.2;
	
	Unit.call(this, options);
	
	this.width = 180;
	this.height = 96;
	this.range = 23;
	
	this.damage = 15;
	this.maxHealth = 200;
	this.health = this.maxHealth;
	this.cadency = 50;
	this.price = 1500;
	
	this.spawnSound = game.jukebox.sounds["trex"];
	
	this.texture = game.textures.get("trex", {
		totalFrames: 4,
		currentAnimation: "walking",
		animations:{
			walking: {
				start: 0,
				end: 4,
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

	if(options.owner == "enemy"){
		this.texture.flip = "x";
	}

	this.owner = options.owner !== undefined ? options.owner : "player";
	
};
Trex.prototype = new Unit();