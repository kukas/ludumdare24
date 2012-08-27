function Bonfire( options ){
		
	Building.call(this, options);
	
	this.maxHealth = 30;
	this.health = this.maxHealth;
	this.width = 64;
	this.height = 128;
	this.range = 32;
	
	this.owner = options.owner !== undefined ? options.owner : "player";
	this.price = 20;
	this.maxQueue = 1;
	
	this.texture = game.textures.get("bonfire",{
		totalFrames: 3,
		currentAnimation: "being",
		animations:{
			being: {
				start: 0,
				end: 3,
				speed: 7
			},
		}
	});
};
Bonfire.prototype = new Building();