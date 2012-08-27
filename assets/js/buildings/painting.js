function Painting( options ){
	
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
	
	this.texture = game.textures.get("painting");
	var _this = this;
	this.actions = [
		{
			name:"Baroco Cherub",
			description:"Recrutes Cherub",
			exec:function(){_this.tryProduce(Cherub,120);},
		},
		{
			name:"* Bishop",
			description:"TRIAL",
			exec:function(){_this.tryProduce(Bishop,120);},
		},
	];
};
Painting.prototype = new Building();