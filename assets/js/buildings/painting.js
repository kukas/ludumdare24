function Painting( options ){
	
	Building.call(this, options);
	
	this.maxHealth = 50;
	this.health = this.maxHealth;
	this.width = 96;
	this.height = 96;
	this.range = 48;
	
	this.maxQueue = 2;
	this.spawnPoint = options.owner == "player" ? this.position.x+this.width+32 : this.position.x-this.width-32;
	this.owner = options.owner !== undefined ? options.owner : "player";
	this.price = 50;
	
	this.texture = game.textures.get("painting");
	var _this = this;
	this.actions = [
		{
			name:"Baroco Cherub",
			icon: "b_andelicek",
			description: {
				name:  "Baroco Cherub",
				gold: 120,
				description: "This little annoying creature will explode if it hits enemy. It can hit multlipe enemies at once.",
				quote: "Hallelujah! Hallelujah!"
			},
			exec:function(){_this.tryProduce(Cherub,this.description.gold);},
		},
	];
};
Painting.prototype = new Building();