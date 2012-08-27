function CrossScorpio( options ){
	
	Building.call(this, options);
	
	this.maxHealth = 30;
	this.health = this.maxHealth;
	this.damage = 1;
	this.cadency = 30;
	
	this.width = 96;
	this.height = 96;
	this.range = 250;
	
	this.owner = options.owner !== undefined ? options.owner : "player";
	this.price = 15;
	this.maxQueue = 1;
	
	this.texture = game.textures.get("crossscorpio",{
		totalFrames: 2,
		currentAnimation: "being",
		animations:{
			being: {
				start: 1,
				end: 2,
				speed: 7,
			},
			attack:{
				start:0,
				end:1,
				speed:7,
			},
		}
	});

};
CrossScorpio.prototype = new Building();