function Building(options){
	Object2D.call(this, options);

	this.zIndex = -1;

	this.proces = 0;
	this.toProces = false;
	
	this.procesQueue = [];
}
Building.prototype = new Object2D();

Building.prototype.dealDamage = function (dmg, murderer){
	murderer = murderer === undefined ? this : murderer;
	this.health -= dmg;
	// třísky
	var vlevo = (this.position.x > murderer.position.x) ? 1 : 0;
	game.links.particlesystem.emit(Particle, 10, {
		position: new Vector2().copy(this.position),
		gravity: new Vector2(0,0.1),
		width: 5, height: 5,
		shrink: 0.98,
		spin: 0.1,
		// fade: 0.017,
	}, {
		color: [new Color(0xFF8C3B), new Color(0xFFCB3B), new Color(0xFFF83B)],
		velocity: {
			x: {min: -2, max: 2},
			y: {min: -2, max: -1.5}
		},
		rotation: { min: 0, max: Math.PI }
	});

	this.die(murderer);
};

Building.prototype.die = function( murderer ) {
	// console.log(murderer)
	murderer.unfreeze();
	if(this.health <= 0){
		this.onDie !== undefined ? this.onDie() : false;
		game.remove(this);
	}
};

Building.prototype.produce = function (){
	var _this = this;
	if(this.procesQueue.length > 0){
		this.proces++;
		if(this.toProces < this.proces){
			this.procesQueue[0][0]();
			this.procesQueue.splice(0,1);
			this.toProces = this.procesQueue[0] !== undefined ? this.procesQueue[0][1] : false;
			this.proces = 0;
		}
	}
};

Building.prototype.initProduction = function (callback,cena){
	
	if(this.procesQueue.length < this.maxQueue){
		if(this.toProces == false){
			this.toProces = cena;
		}
		this.procesQueue[this.procesQueue.length] = [callback,cena];
	}
	else{return false;}
};

Building.prototype.tick = function (){
		this.produce();
};

Building.prototype.tryProduce = function (Constructor,prize){
	var _this = this;
	if(Constructor != "Upgrade"){
		if(!this.initProduction(function (){
			Spawn(Constructor,_this.spawnPoint,_this.owner);
			},prize)){
			console.log("IMPASSIBRU!!")
		}
	}
	else{
		if(!this.initProduction(function (){
			_this.upgrade();
			},prize)){
			console.log("IMPASSIBRU!!")
		}
	};
};
