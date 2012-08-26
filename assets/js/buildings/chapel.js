function Chapel( options ){
	
	Building.call(this, options);
	
	this.maxHealth = 100;
	this.health = this.maxHealth;
	this.width = 128;
	this.height = 128;
	this.range = 64;
	
	this.tier = 0;
	
	this.texture = game.textures.get("chapel0");
	_this = this;
	this.actions = [
		{
			name:"Missionary",
			description:"Recrutes missionary",
			exec:function(){Spawn(Missionary,new Vector2(200,0),_this.owner)},
		},
		{
			name : "Priest",
			description : "Recrutes priest",
			exec : function (){Spawn(Priest,new Vector2(200,0),_this.owner)}
		},
		{
			name : "Nun",
			description : "Recrutes Nun",
			exec : function (){_this.produce(Nun);}
		},
		{
			name : "Crusader",
			description : "Recrutes crusader",
			exec : function (){Spawn(Crusader,new Vector2(200,0),_this.owner)}
		},
		{
			name : "Upgrade",
			description : "Upgrades your base",
			exec : function (){_this.upgrade();},
		},
	];
	
	this.owner = options.owner !== undefined ? options.owner : false;
	
	this.upgrade = function (){
		if(this.tier < 2){
			this.tier += 1;
			this.texture = game.textures.get("chapel"+this.tier);
			this.maxHealth = this.health+=100;
		}
		if(this.tier == 2){
			this.tier += 1;
			this.texture = game.textures.get("chapel"+this.tier);
			this.maxHealth = this.health+=300;
		}
		else{
			console.log("IMPASSIBRU!!");
		}
	};
	
	this.onDie = function (){
		game.jukebox.play("gorilla");
	};
};
Chapel.prototype = new Building();
