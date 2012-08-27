function Galapags( options ){
	
	Building.call(this, options);
	
	this.maxHealth = 300;
	this.health = this.maxHealth;
	this.width = 96;
	this.height = 96;
	this.range = 48;
	
	this.nextTierPrice = 100;
	this.maxQueue = 1;
	this.spawnPoint = options.owner == "player" ? this.position.x+this.width+32 : this.position.x-this.width-32;
	this.owner = options.owner !== undefined ? options.owner : "player";
	this.price = 300;
	
	this.texture = game.textures.get("galapags");
	var _this = this;
	this.actions = [
		{
			name:"A. R. Wallace",
			description:"Recrutes Alfred Russel Wallace",
			exec:function(){_this.tryProduce(Gorilla,10);},
		},
	];
	
};
Galapags.prototype = new Building();