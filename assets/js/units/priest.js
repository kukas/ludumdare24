function Priest( options ){
	if(options.owner == "player"){
		this.speed = options.speed !== undefined ? options.speed : 0.3;
	}
	else{
		this.speed = options.speed !== undefined ? options.speed : -0.3;
	}

	Unit.call(this, options);
	
	this.width = 46;
	this.height = 64;
	this.range = 46;
	
	this.damage = 1;
	this.maxHealth = 5;
	this.health = this.maxHealth;
	this.cadency = 20;
	
	this.spawnSound = game.jukebox.sounds["priest"];
	
	if(options.owner == "player"){
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
	}
	else{
		this.texture = game.textures.get("priest", {
			flip: "x",
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
	}
	this.owner = options.owner !== undefined ? options.owner : false;
	
};
Priest.prototype = new Unit();