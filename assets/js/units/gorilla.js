function Gorilla( options ){
	this.speed = options.speed !== undefined ? options.speed : 0.5;

	Unit.call(this, options);
	
	this.width = 86;
	this.height = 64;
	this.range = 32;
	
	this.damage = 1;
	this.maxHealth = 3;
	this.health = this.maxHealth;
	this.cadency = 30;
	
	this.spawnSound = game.jukebox.sounds["gorilla"];
	
	this.texture = game.textures.get("gorilla", {
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
Gorilla.prototype = new Unit();