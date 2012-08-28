function Golgota( options ){
	Building.call(this, options);
	
	this.maxHealth = 200;
	this.health = this.maxHealth;
	this.width = 96;
	this.height = 96;
	this.range = 48;
	
	this.maxQueue = 2;
	this.spawnPoint = options.owner == "player" ? this.position.x+this.width+32 : this.position.x-this.width-32;
	this.owner = options.owner !== undefined ? options.owner : "player";
	this.price = 200;
	
	this.texture = game.textures.get("golgota");
	var _this = this;
	this.actions = [
		{
			name:"Jesus",
			icon: "b_jezis",
			description: {
				name:  "Jesus",
				gold: 2000,
				description: "Ultimate unit. His cross is heavy, so he will be slow. But then... Nothing can stop him from his revenge.",
				quote: "Fuck it. Revenge time."
			},
			exec:function(){_this.tryProduce(Jesus,this.description.gold);},
		},
	];
};
Golgota.prototype = new Building();