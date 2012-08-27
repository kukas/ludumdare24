function Galapags( options ){
	
	Building.call(this, options);
	
	this.maxHealth = 100;
	this.health = this.maxHealth;
	this.width = 96;
	this.height = 96;
	this.range = 48;
	
	this.maxQueue = 1;
	this.spawnPoint = options.owner == "player" ? this.position.x+this.width+32 : this.position.x-this.width-32;
	this.owner = options.owner !== undefined ? options.owner : "player";
	this.price = 120;
	
	this.texture = game.textures.get("galapags");
	var _this = this;
	this.actions = [
		{
			name:"A. R. Wallace",
			icon: "b_wallace",
			description: {
				name:  "A. R. Wallace",
				gold: 1000,
				description: "This hero runs pretty fast and his flying frogs are dangerous too. He has even chance to stop walking doom - Jesus.",
				quote: "I have since wandered among men of many races and many religions. And killed them all."
			},
			exec:function(){_this.tryProduce(Wallace,this.description.gold);},
		},
	];
	
};
Galapags.prototype = new Building();