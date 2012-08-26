function Crusader( options ){

	this.speed = options.speed !== undefined ? options.speed : 0.2;
	
	Unit.call(this, options);
	
	this.width = 46;
	this.height = 79;
	this.range = 23;
	
	this.damage = 6;
	this.maxHealth = 15;
	this.health = this.maxHealth;
	this.cadency = 50;
	this.price = 100;
	
	this.spawnSound = game.jukebox.sounds["crusader"];
	
	this.texture = game.textures.get("crusader", {
		totalFrames: 7,
		currentAnimation: "walking",
		animations:{
			walking: {
				start: 0,
				end: 6,
				speed: 7
			},
			attack: {
				start: 5,
				end: 7,
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
Crusader.prototype = new Unit();