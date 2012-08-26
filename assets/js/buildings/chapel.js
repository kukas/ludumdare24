function Chapel( options ){
	
	Building.call(this, options);
	
	this.maxHealth = 100;
	this.health = this.maxHealth;
	this.width = 128;
	this.height = 128;
	this.range = 64;
	
	this.tier = 0;
	this.maxQueue = 5;
	this.spawnPoint = options.owner == "player" ? this.position.x+this.width+32 : this.position.x-this.width-32;
	this.owner = options.owner !== undefined ? options.owner : "player";
	
	this.texture = game.textures.get("chapel0");
	var _this = this;
	this.actions = [
		{
			name:"Missionary",
			description:"Recrutes missionary",
			exec:function(){_this.tryProduce(Missionary,10);},
		},
		{
			name : "Priest",
			description : "Recrutes priest",
			exec : function (){_this.tryProduce(Priest,30);}
		},
		{
			name : "Nun",
			description : "Recrutes Nun",
			exec : function (){_this.tryProduce(Nun,50);}
		},
		{
			name : "Crusader",
			description : "Recrutes crusader",
			exec : function (){_this.tryProduce(Crusader,100);}
		},
		{
			name : "Upgrade",
			description : "Upgrades your base",
			exec : function (){if(_this.tier<3){_this.tryProduce("Upgrade",100);}},
		},
		{
			name:"BUILD!",
			description:"Recrutes missionary",
			exec:function(){
				_this.build(Chapel, 100)
			},
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
			
		}
	};
	
	this.onDie = function (){
		game.jukebox.play("gorilla");
	};
};
Chapel.prototype = new Building();
