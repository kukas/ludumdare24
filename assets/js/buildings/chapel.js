function Chapel( options ){
	
	Building.call(this, options);
	
	this.maxHealth = 100;
	this.health = this.maxHealth;
	this.width = 128;
	this.height = 128;
	this.range = 64;
	
	this.tier = 0;
	this.nextTierPrice = 10;
	this.maxQueue = 5;
	this.spawnPoint = options.owner == "player" ? this.position.x+this.width+32 : this.position.x-this.width-32;
	this.owner = options.owner !== undefined ? options.owner : "player";
	this.price = 0;
	
	this.texture = game.textures.get("chapel0");
	var _this = this;
	this.actions = [
		{
			name:"Missionary",
			icon: "b_misionar",
			description:{
				name: "Missionary",
				gold: 10,
				description: "Fast moving infantry, not very effective in combat, but useful as scout.",
				quote: "Can we have a little talk about Jesus?"
			},
			exec:function(){_this.tryProduce(Missionary,this.description.gold);},
		},
		{
			name : "Priest",
			icon: "b_knez",
			description:{
				name: "Priest",
				gold: 10,
				description: "Your first real soldier. He can shoot pretty fast, good against biologist.",
				quote: "And now... punishment!"
			},
			exec : function (){_this.tryProduce(Priest,this.description.gold);}
		},
		{
			name : "Nun",
			icon: "b_jeptiska",
			description: {
				name: "Nun",
				gold: 10,
				description: "Slow, but strong archer. Effective against professor.",
				quote: "I like Jesus. He is so muscular."
			},
			exec : function (){_this.tryProduce(Nun,this.description.gold);}
		},
		{
			name : "Crusader",
			icon: "b_krizak",
			description: {
				name: "Crusader",
				gold: 10,
				description: "Holy warrior of Jesus. Slow and strong, like Jesus itself. Good against teachers.",
				quote: "To the holy land!"
			},
			exec : function (){_this.tryProduce(Crusader,this.description.gold);}
		},
		{
			name : "Upgrade",
			icon: "upgrade",
			description : {
				name: "Upgrade",
				gold: 10,
				description: "Upgrade your base to unlock more building options!",
				quote: " "
			},
			exec : function (){if(_this.tier<3){_this.tryProduce("Upgrade",this.description.gold);}},
		},
	];
	
	this.owner = options.owner !== undefined ? options.owner : "player";
	
	this.upgrade = function (){
		if(this.tier < 2){
			this.tier += 1;
			this.texture = game.textures.get("chapel"+this.tier);
			this.maxHealth = this.health+=100;
		}
		else if(this.tier == 2){
			this.tier += 1;
			this.texture = game.textures.get("chapel"+this.tier);
			this.maxHealth = this.health+=300;
		}
		if(this.tier == 2){
			this.position.x-=this.width/2;
			this.width = 256;
			this.height = 256;
			this.nextTierPrice = 300;
		}
		// if(this.owner == "player")
		// 	game.gui.links.BuildMenu.enableTier(this.tier);
	};
	
	this.onDie = function (){
		if(this.owner == "enemy"){
			game.loadLevel("mortal_combat");
			game.ai.active = false;
		}
		game.jukebox.play("gorilla");
	};
};
Chapel.prototype = new Building();
