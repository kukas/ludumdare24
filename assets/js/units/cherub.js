function Cherub( options ){
	
	this.speed = options.speed !== undefined ? options.speed : 1;
	
	Unit.call(this, options);
	
	this.width = 45;
	this.height = 65;
	this.range = 22;
	
	this.boomRange = 200;
	this.cadency = -1;
	
	this.damage = 20;
	this.maxHealth = 5;
	this.health = this.maxHealth;
	this.price = 120;
	
	this.spawnSound = game.jukebox.sounds["cherub"];
	
	this.texture = game.textures.get("cherub", {
		totalFrames: 2,
		currentAnimation: "walking",
		animations:{
			walking: {
				start: 0,
				end: 2,
				speed: 7
			},
			attack: {
				start: 1,
				end: 2,
				speed: 10,
				cycle: false
			}
		}
	});

	if(options.owner == "enemy"){
		this.texture.flip = "x";
	}

	this.owner = options.owner !== undefined ? options.owner : "player";
	
};
Cherub.prototype = new Unit();

Cherub.prototype.boom = function (){
	if(this.boomed)
		return;
	this.boomed = true;
	this.owner = "no one";
	var _this = this;
	var nuke = new Background({
		position: _this.position,
		width: 53*6,
		height: 64*6,
		zIndex: -5,
		texture: game.textures.get("holynuke", {
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
		if(game.children[i].health && Math.abs(this.position.x-game.children[i].position.x) <= this.boomRange && game.children[i] != this){
			game.children[i].dealDamage(this.damage,this);
		};
	};
	game.remove(this);
};