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
			description:"Recrutes angel",
			exec:function(){_this.tryProduce(Angel,100);},
		},
	];
};
Altar.prototype = new Building();