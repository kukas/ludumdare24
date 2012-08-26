function Chapel( options ){
	
	Building.call(this, options);
	
	this.maxHealth = 100;
	this.health = this.maxHealth;
	this.width = 128;
	this.height = 128;
	this.range = 64;
	
	this.tier = 0;
	this.maxQueue = 5;
	
	this.texture = game.textures.get("chapel0");
	_this = this;
	this.actions = [
		{
			name:"Missionary",
			description:"Recrutes missionary",
			exec:function(){if(!_this.initProduction(function () {Spawn(Missionary,new Vector2(_this.position.x+_this.width+32,_this.position.y),_this.owner)},30)){console.log("IMPASSIBRU!!");}},
		},
		{
			name : "Priest",
			description : "Recrutes priest",
			exec : function (){if(!_this.initProduction(function () {Spawn(Priest,new Vector2(_this.position.x+_this.width+32,_this.position.y),_this.owner)},90)){console.log("IMPASSIBRU!!");}}
		},
		{
			name : "Nun",
			description : "Recrutes Nun",
			exec : function (){if(!_this.initProduction(function () {Spawn(Nun,new Vector2(_this.position.x+_this.width+32,_this.position.y),_this.owner)},150)){console.log("IMPASSIBRU!!");}}
		},
		{
			name : "Crusader",
			description : "Recrutes crusader",
			exec : function (){if(!_this.initProduction(function () {Spawn(Crusader,new Vector2(_this.position.x+_this.width+32,_this.position.y),_this.owner)},300)){console.log("IMPASSIBRU!!");}}
		},
		{
			name : "Upgrade",
			description : "Upgrades your base",
			exec : function (){if(_this.tier<3){_this.initProduction(function () {_this.upgrade();},300);}else{console.log("IMPASSIBRU!!")}},
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
