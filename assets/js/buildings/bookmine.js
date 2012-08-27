function Bookmine( options ){
		
	Building.call(this, options);
	
	this.maxHealth = 30;
	this.health = this.maxHealth;
	this.width = 64;
	this.height = 64;
	this.range = 32;
	
	this.boomRange = 120;
	this.damage = 5;
	this.cadency = -1;
	
	this.owner = options.owner !== undefined ? options.owner : "player";
	this.price = 20;
	this.maxQueue = 1;
	
	this.texture = game.textures.get("bookmine",{
		totalFrames: 1,
		currentAnimation: "being",
		animations:{
			being: {
				start: 0,
				end: 1,
				speed: 7,
			},
		}
	});
};
Bookmine.prototype = new Building();

Bookmine.prototype.boom = function (){
	this.owner = "no one";
	var _this = this;
	var nuke = new Background({
		position: _this.position,
		width: 53*3,
		height: 64*3,
		zIndex: -3,
		texture: game.textures.get("bionuke", {
			totalFrames: 12,
			currentAnimation: "explosion",
			animations:{
				explosion: {
					start: 0,
					end: 12,
					speed: 7,
					cycle : false,
				}
			}
		})
	});
	nuke.tick = function (){
		if(this.texture.ended) game.remove(this);
	};
	game.add(nuke);
	for(var i in game.children){
		if((game.children[i].health !== undefined)&&(Math.abs(this.position.x-game.children[i].position.x) <= this.boomRange)&&(game.children[i] != this)){
			game.children[i].dealDamage(this.damage,this);
		};
	};
	game.remove(this);
};