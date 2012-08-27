function Altar( options ){
	
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
	
	this.texture = game.textures.get("altar");
	var _this = this;
	this.actions = [
		{
			name:"Angel",
			icon: "b_andel",
			description: {
				name:  "Angel",
				gold: 10,
				description: "Very balanced and effective unit. Good for everything. He can shoot fire balls. Holy fire balls.",
				quote: "Glorious doom to the unbelivers."
			},
			exec:function(){_this.tryProduce(Angel,100);},
		},
	];
};
Altar.prototype = new Building();