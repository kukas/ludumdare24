function Prophet( options ){
	if(options.owner == "player"){
		this.speed = options.speed !== undefined ? options.speed : 0.8;
	}
	else{
		this.speed = options.speed !== undefined ? options.speed : -0.8;
	}

	Unit.call(this, options);
	
	this.width = 74;
	this.height = 64;
	this.range = 37;
	
	this.damage = 5;
	this.health = 30;
	this.maxHealth = 30;
	this.cadency = 20;
	
	this.spawnSound = game.jukebox.sounds["prophet"];
	
	if(options.owner == "player"){
		this.texture = game.textures.get("prophet", {
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
		this.texture = game.textures.get("prophet", {
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
Prophet.prototype = new Unit();