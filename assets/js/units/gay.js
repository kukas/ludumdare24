function Gay(options){
	if(options.owner == "player"){
		this.speed = options.speed !== undefined ? options.speed : 0.8;
	}
	else{
		this.speed = options.speed !== undefined ? options.speed : -0.8;
	}

	Unit.call(this, options);
	
	this.width = 68;
	this.height = 90;
	this.range = 34;
		
	this.damage = 5;
	this.health = 30;
	this.maxHealth = 30;
	this.cadency = 20;
	
	if(options.owner == "player"){
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
					cycle: true
				}
			}
		});
	}
	else{
		this.texture = game.textures.get("gay", {
			flip:"x",
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
Gay.prototype = new Unit();