function Slum( options ){
	
	Building.call(this, options);
	
	this.maxHealth = 300;
	this.health = this.maxHealth;
	this.width = 96;
	this.height = 96;
	this.range = 48;
	
	this.maxQueue = 1;
	this.spawnPoint = options.owner == "player" ? this.position.x+this.width+32 : this.position.x-this.width-32;
	this.owner = options.owner !== undefined ? options.owner : "player";
	this.price = 3;
	
	this.texture = game.textures.get("slum");
	var _this = this;
	this.actions = [
		{ // UPDATE
			name:"Mother Teresa",
			icon: "b_tereza",
			description: {
				name:  "Mother Teresa",
				gold: 10,
				description: "Fast moving hero who fight with machinegun. She is only one who can hope to stop T-Rex.",
				quote: "Be faithful in small things, like bullets because it is in them that your strength lies."
			},
			exec:function(){_this.tryProduce(Gorilla,10);},
		},
	];
	
};
Slum.prototype = new Building();