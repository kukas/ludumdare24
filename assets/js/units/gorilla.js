function Gorilla( options ){
		if(options.owner == "player"){
		this.speed = options.speed !== undefined ? options.speed : 0.5;
	}
	else{
		this.speed = options.speed !== undefined ? options.speed : -0.5;
	}

	Unit.call(this, options);
	
	this.width = 86;
	this.height = 64;
	this.range = 32;
	
	this.damage = 1;
	this.health = 3;
	this.maxHealth = 3;
	this.cadency = 30;
	
	this.spawnSound = game.jukebox.sounds["gorilla"];
	
	if(options.owner == "player"){
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
	}
	else{
		this.texture = game.textures.get("gorilla", {
			flip: "x",
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
					cycle: true
				}
			}
		});
	}
	this.owner = options.owner !== undefined ? options.owner : false;
};
Gorilla.prototype = new Unit();