function Gay(options){
	this.speed = options.speed !== undefined ? options.speed : 0.8;

	Unit.call(this, options);
	
	this.width = 68;
	this.height = 96;
	this.range = 34;
		
	this.damage = 5;
	this.maxHealth = 30;
	this.health = this.maxHealth;
	this.cadency = 20;
	this.prize = 300;
	
	this.spawnSound = game.jukebox.sounds["gay"];
	
	this.texture = game.textures.get("gay", {
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

	if(options.owner == "enemy"){
		this.texture.flip = "x";
	}

	this.owner = options.owner !== undefined ? options.owner : false;
	
};
Gay.prototype = new Unit();