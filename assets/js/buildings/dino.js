function Dino( options ){
		
	Building.call(this, options);
	
	this.maxHealth = 30;
	this.health = this.maxHealth;
	this.width = 128;
	this.height = 128;
	this.range = 64;
	
	this.owner = options.owner !== undefined ? options.owner : "player";
	this.price = 20;
	this.maxQueue = 1;
	
	this.texture = game.textures.get("dino",{
		totalFrames: 2,
		currentAnimation: "being",
		animations:{
			being: {
				start: 0,
				end: 1,
				speed: 1000
			},
		}
	});
};
Dino.prototype = new Building();