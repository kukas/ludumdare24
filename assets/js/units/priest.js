function Priest( options ){
	this.speed = options.speed !== undefined ? options.speed : 0.3;

	Unit.call(this, options);
	
	this.width = 46;
	this.height = 64;
	this.range = 200;
	
	this.damage = 1;
	this.maxHealth = 5;
	this.health = this.maxHealth;
	this.cadency = 20;
	this.price = 30;
	
	this.spawnSound = game.jukebox.sounds["priest"];
	
	this.texture = game.textures.get("priest", {
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
Priest.prototype = new Unit();