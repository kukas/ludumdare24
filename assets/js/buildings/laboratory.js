function Laboratory( options ){
	
	Building.call(this, options);
	
	this.maxHealth = 30;
	this.health = this.maxHealth;
	this.width = 96;
	this.height = 96;
	this.range = 48;
	
	this.maxQueue = 1;
	this.spawnPoint = options.owner == "player" ? this.position.x+this.width+32 : this.position.x-this.width-32;
	this.owner = options.owner !== undefined ? options.owner : "player";
	this.price = 60;
	
	this.texture = game.textures.get("lab");
	var _this = this;
	this.actions = [
		{
			name:"Biologist",
			icon: "b_biolog",
			description: {
				name:  "Biologist",
				gold: 10,
				description: "He is bringing poisoned explosion pack. On his own body. Navigate him into enemy lines and he will kill lot of them.",
				quote: "And now worms! More worms!"
			},
			exec:function(){_this.tryProduce(Biologist,this.description.gold);},
		},
	];
};
Laboratory.prototype = new Building();