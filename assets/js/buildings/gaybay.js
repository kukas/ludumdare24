function GayBay( options ){
	
	Building.call(this, options);
	
	this.maxHealth = 50;
	this.health = this.maxHealth;
	this.width = 97;
	this.height = 96;
	this.range = 48;
	
	this.maxQueue = 2;
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
			icon: "b_gay",
			description: {
				name:  "GAY",
				gold: 10,
				description: "Fast unit that can destroy the toughes defense. Good against nuns and buildings.",
				quote: "Yeah, I have been very nasty."
			},
			exec:function(){_this.tryProduce(Gay,100);},
		},
		{
			name:"Heretic",
			icon: "b_heretic",
			description: {
				name:  "Heretic",
				gold: 10,
				description: "This one is quite slow, but can take lot of damage and deal it too. Effective against prophets.",
				quote: "Pssst. Wanna some weed?"
			},
			exec:function(){_this.tryProduce(Heretic,100);},
		},
	];
	
};
GayBay.prototype = new Building();