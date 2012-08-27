function Confessor( options ){
	
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
	
	this.texture = game.textures.get("zpovednice");
	var _this = this;
	this.actions = [
		{
			name:"Bishop",
			icon: "b_biskup",
			description: {
				name: "Bishop",
				gold: 100,
				description: "Strong and tough unit. He is best againts homosexuals.",
				quote: "God bless you."
			},
			exec:function(){_this.tryProduce(Bishop,this.description.gold);},
		},
		{
			name:"Prophet",
			icon: "b_prorok",
			description: {
				name:  "Prophet",
				gold: 100,
				description: "Fast moving infantry with solid attack speed. He can break through defensive buildings very fast. Effective against librarian.",
				quote: "The end is near! Here, take this pamphlet."
			},
			exec:function(){_this.tryProduce(Prophet,this.description.gold);},
		},
	];
};
Confessor.prototype = new Building();