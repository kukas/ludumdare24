function Portal( options ){
	
	Building.call(this, options);
	
	this.maxHealth = 50;
	this.health = this.maxHealth;
	this.width = 96;
	this.height = 96;
	this.range = 48;
	
	this.maxQueue = 2;
	this.spawnPoint = options.owner == "player" ? this.position.x+this.width+32 : this.position.x-this.width-32;
	this.owner = options.owner !== undefined ? options.owner : "player";
	this.price = 10;
	
	this.texture = game.textures.get("portal");
	var _this = this;
	this.actions = [
		{
			name:"Devil",
			icon: "b_dabel",
			description: {
				name: "Devil",
				gold: 10,
				description: "Devil can destroy almost everyone, with his evil smile and fire balls. Balanced and effective unit.",
				quote: "I came here to kill and fuck bitches. I am almost done with killing."
			},
			exec:function(){_this.tryProduce(Devil,100);},
		},
	];
};
Portal.prototype = new Building();