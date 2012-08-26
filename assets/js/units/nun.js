function Nun( options ){
	this.speed = options.speed !== undefined ? options.speed : 0.2;

	Unit.call(this, options);
	
	this.width = 35;
	this.height = 64;
	this.range = 64;
	
	this.damage = 3;
	this.maxHealth = 6;
	this.health = this.maxHealth;
	this.cadency = 50;
	
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

	if(options.owner == "enemy"){
		this.texture.flip = "x";
	}

	this.owner = options.owner !== undefined ? options.owner : false;
	
};
Nun.prototype = new Unit();