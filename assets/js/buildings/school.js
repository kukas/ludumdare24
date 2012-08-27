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
			description:"Recrutes gorilla",
			exec:function(){_this.tryProduce(Gorilla,10);},
		},
		{
			name : "Teacher",
			description : "Recrutes Teacher",
			exec : function (){_this.tryProduce(Missionary,30)}
		},
		{
			name : "Librarian",
			description : "Recrutes Librarian",
			exec : function (){_this.tryProduce(Librarian,50);}
		},
		{
			name : "Professor",
			description : "Recrutes professor",
			exec : function (){_this.tryProduce(Professor,100);}
		},
		{
			name : "Upgrade",
			description : "Upgrades your base",
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
		game.gui.links.BuildMenu.enableTier(this.tier);
	};
	
	this.onDie = function (){
		game.jukebox.play("gorilla");
	};
};
School.prototype = new Building();
