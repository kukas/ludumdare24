function GayBay( options ){
	
	Building.call(this, options);
	
	this.maxHealth = 50;
	this.health = this.maxHealth;
	this.width = 97;
	this.height = 96;
	this.range = 48;
	
	this.maxQueue = 1;
	this.spawnPoint = options.owner == "player" ? this.position.x+this.width+32 : this.position.x-this.width-32;
	this.owner = options.owner !== undefined ? options.owner : "player";
	this.price = 120;
	
	this.texture = game.textures.get("gaybay",{
		totalFrames:2,
		currentAnimation:"being",
		animations:{
			being:{
				start:0,
				end:2,
				speed:15,
			},
		},
	});
	var _this = this;
	this.actions = [
		{
			name:"GAY",
			description:"Recrutes Gay",
			exec:function(){_this.tryProduce(Gay,100);},
		},
		{
			name:"Heretic",
			description:"Recrutes heretic",
			exec:function(){_this.tryProduce(Gay,100);},
		},
	];
	
};
GayBay.prototype = new Building();