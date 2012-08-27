function Museum( options ){
	
	Building.call(this, options);
	
	this.maxHealth = 150;
	this.health = this.maxHealth;
	this.width = 128;
	this.height = 128;
	this.range = 64;
	
	this.nextTierPrice = 100;
	this.maxQueue = 1;
	this.spawnPoint = options.owner == "player" ? this.position.x+this.width+32 : this.position.x-this.width-32;
	this.owner = options.owner !== undefined ? options.owner : "player";
	this.price = 100;
	
	this.texture = game.textures.get("museum",{
		totalFrames: 2,
		currentAnimation: "being",
		animations:{
			being: {
				start: 0,
				end: 1,
				speed: 7,
			},
			destroyed:{
				start:1,
				end:2,
				speed:7,
			},
		}
	});
	var _this = this;
	this.actions = [
		{
			name:"T-REX",
			icon: "b_dino",
			description: {
				name:  "T-REX",
				gold: 10,
				description: "Slow dinosaur. He smashes the buildings, he eats the people. Truly, almost nothing can kill this ultimate killer.",
				quote: "Raaaaaaar!"
			},
			exec:function(){_this.tryProduce(Gorilla,10);},
		},
	];
};
Museum.prototype = new Building();