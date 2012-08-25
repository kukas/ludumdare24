function Crusader( options ){
	if(options.owner == "player"){
		this.speed = options.speed !== undefined ? options.speed : 0.2;
	}
	else{
		this.speed = options.speed !== undefined ? options.speed : -0.2;
	}

	Unit.call(this, options);
	
	this.width = 46;
	this.height = 79;
	this.range = 23;
	
	this.damage = 6;
	this.health = 15;
	this.maxHealth = 15;
	this.cadency = 50;
	
	if(options.owner == "player"){
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
					cycle: true
				}
			}
		});
	}
	else{
		this.texture = game.textures.get("crusader", {
			flip: "x",

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
					cycle: true
				}
			}
		});
	}
	this.owner = options.owner !== undefined ? options.owner : false;
	
};
Crusader.prototype = new Unit();