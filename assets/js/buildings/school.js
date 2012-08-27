function School( options ){
	
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
	this.price = 100;
	
	this.texture = game.textures.get("school0");
	var _this = this;
	this.actions = [
		{
			name:"Gorilla",
			icon:"b_gorila",
			description: {
				name:  "Gorilla",
				gold: 10,
				description: "Stupid animal which can run very fast, but will be killed in first bigger fight.",
				quote: "Oook? Oook?! Oooooooooook!"
			},
			exec:function(){_this.tryProduce(Gorilla,this.description.gold);},
		},
		{
			name : "Teacher",
			icon:"b_ucitel",
			description: {
				name:  "Teacher",
				gold: 10,
				description: "This one is good against cherubs. He has very good rate of fire.",
				quote: "Free knowledge to everyone!"
			},
			exec : function (){_this.tryProduce(Teacher,this.description.gold)}
		},
		{
			name : "Librarian",
			icon:"b_knihovnice",
			description: {
				name:  "Librarian",
				gold: 10,
				description: "Not very fast, but when she hits she hits hard. Good against crusader.",
				quote: "Burning books? Die bitch!"
			},
			exec : function (){_this.tryProduce(Librarian,this.description.gold);}
		},
		{
			name : "Professor",
			icon:"b_profesor",
			description: {
				name:  "Professor",
				gold: 10,
				description: "Bringer of knowledge. It takes a while to bring it, but then everyone will die. Effective against priests.",
				quote: "Die morons!"
			},
			exec : function (){_this.tryProduce(Professor,this.description.gold);}
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
			exec : function (){if(_this.tier<3){_this.tryProduce("Upgrade")}},
		},
	];
	
	this.upgrade = function (){
		if(this.tier < 2){
			this.tier += 1;
			this.texture = game.textures.get("school"+this.tier);
			this.maxHealth = this.health+=100;
		}
		else if(this.tier == 2){
			this.tier += 1;
			this.texture = game.textures.get("school"+this.tier);
			this.maxHealth = this.health+=300;
		}
		if(this.tier == 2){
			this.position.x-=this.width/2;
			this.width = 256;
			this.height = 256;
			this.nextTierPrice = 10;
		}
		if(this.owner == "player")
			game.gui.links.layout.links.actions.enableTier(this.tier);
	};
	
	this.onDie = function (){
		if(this.owner == "enemy"){
			game.loadLevel("mortal_combat");
			game.ai.active = false
		}
		game.jukebox.play("gorilla");
	};
};
School.prototype = new Building();
