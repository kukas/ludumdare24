function Librarian( options ){
	
	this.speed = options.speed !== undefined ? options.speed : 0.2;
	
	Unit.call(this, options);
	
	this.width = 64;
	this.height = 84;
	this.range = 300;
	
	this.damage = 3;
	this.maxHealth = 6;
	this.health = this.maxHealth;
	this.cadency = 50;
	this.prize = 50;
	
	this.spawnSound = game.jukebox.sounds["librarian"];
	
	this.texture = game.textures.get("librarian", {
		totalFrames: 7,
		currentAnimation: "walking",
		animations:{
			walking: {
				start: 0,
				end: 6,
				speed: 7
			},
			attack: {
				start: 6,
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
Librarian.prototype = new Unit();