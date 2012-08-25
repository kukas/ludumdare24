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
	this.maxHealth = 3000;
	this.health = this.maxHealth;
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
					cycle: false
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
					start: 3,
					end: 5,
					speed: 10,
					cycle: false
				}
			}
		});
	}
	this.owner = options.owner !== undefined ? options.owner : false;
	
};
Gay.prototype = new Unit();