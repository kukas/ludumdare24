function Building(options){
	Object2D.call(this, options);

	this.zIndex = -1;

	this.proces = 0;
	this.toProces = false;

	this.ghost = false;
	
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

Building.prototype.initProduction = function (callback,_cena){
	var cena = _cena*10;
	if(this.procesQueue.length < this.maxQueue){
		if(this.toProces == false){
			this.toProces = cena;
		}
		this.procesQueue[this.procesQueue.length] = [callback,cena];
		return true;
	}
	else{
		return false;
	}
};

Building.prototype.tick = function (){
		this.produce();
};
Building.prototype.onSelect = function (){
};

Building.prototype.tryProduce = function (Constructor,price){
	var _this = this;
	if(typeof(Constructor) != "string"){
		if(game.players[_this.owner].resources.gold - price < 0){
			console.log("Not enough resources.");
		}
		else{
			if(!this.initProduction(function (){
				Spawn(Constructor,_this.spawnPoint,_this.owner);
				},price)){ //<-- zde se balancuje čas výroby
					console.log("The queue is full.");
			}
			else{
				game.players[_this.owner].resources.gold -= price;
			}
		}
	}
	else if(Constructor == "Upgrade"){
		if(!this.initProduction(function (){
			_this.upgrade();
			},this.nextTierPrize)){
			console.log("IMPASSIBRU!!");
		}
	}
	else {
		this.initProduction(function (){
			_this.ghost = false;
			}, price)
	}
};

Building.prototype.build = function(Constructor, price){
	var _this = this;
	var building = new Constructor({});
	building.ghost = true;
	building.selected = true;
	building.owner = this.owner;
	game.eventhandler.addMouseControl(0,function(){
		if(building.ghost && !building.building){
			var x = game.eventhandler.mouse.x;
			if(x < building.width/2)
				x = building.width/2;
			else if(x > game.width-building.width/2)
				x = game.width-building.width/2;
			building.position.x = game.camera.tX(x);
			building.position.y = game.links.terrain.getHeight(building.position.x) - building.height/2;

			if(game.links.terrain.getOwner(building.position.x) == building.owner && game.findCollisions(building).length < 1){
				building.selectColor.setHex("#44DB44");
				building.ghostAlpha = 0.8;
			}
			else {
				building.selectColor.setHex("#FF0000");
				building.ghostAlpha = 0.5;
			}
		}
	});
	game.eventhandler.addMouseControl(1,function(){
		if(game.links.terrain.getOwner(building.position.x) == building.owner && game.findCollisions(building).length < 1){
			// samotné postavení
			building.ghost = true;
			building.building = true;

			building.selected = false;
			building.selectColor.setHex("#0000FF");
			building.spawnPoint = building.owner == "player" ? building.position.x+building.width+32 : building.position.x-building.width-32;
			
			building.afterPlacement();

			building.tryProduce("Self", price);

		}
		else {
			game.remove(building)
		}
	});
	game.eventhandler.addMouseControl(3,function(){
		if(building.ghost){
			game.remove(building)
		}
	});
	game.add( building, "ghost" )
}

Building.prototype.afterPlacement = function() {
	game.unselectAll();
	game.gui.guis.in_game.controls();
};