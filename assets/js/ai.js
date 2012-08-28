function AI(){
	var _this = this;
	this.property = [];

	this.availableUnits = [];
	this.buildings = [];
	
	this.getCounter = function (toWhat){
		
		if(toWhat == Missionary) return false;
		if(toWhat == Gorilla) return false;
		if(toWhat == Priest) return Biologist;
		if(toWhat == Teacher) return Cherub;
		if(toWhat == Nun) return Professor;
		if(toWhat == Librarian) return Crusader;
		if(toWhat == Crusader) return Teacher;
		if(toWhat == Professor) return Priest;
		if(toWhat == Cherub) return false;
		if(toWhat == Biologist) return fasle;
		if(toWhat == Prophet) return Librarian;
		if(toWhat == Gay) return nun;
		if(toWhat == Bishop) return Gay;
		if(toWhat == Heretic) return Prophet;
		if(toWhat == Angel) return false;
		if(toWhat == Devil) return false;
		if(toWhat == Terese) return Trex;
		if(toWhat == Wallace) return Jesus;
		if(toWhat == Jesus) return false;
		if(toWhat == Trex) return false;
	
	};
	
	this.active = false;
	this.ticks = 0;
	this.difficultyRatio = 0;
	this.aiLimit = 10;
	this.actions = {
		nothing: function(){
			return;
		},
		produce: function(){
			if(_this.property[0]){
				if(_this.getCounter(_this.threaths[0])){
					_this.tryProduce(_this.getCounter(_this.threaths[0]));
				}
				else{
					_this.property[0].actions[ Math.floor(_this.property[0].actions.length*Math.random()) ].exec();
				}
			}
		},
		build : function (){
			var id = Math.round(Math.random()*(3+_this.property[0].tier));
				var building = new _this.buildings[id]({});
				building.owner = "enemy";
				building.position.x = _this.property[0].position.x-_this.property[0].width/2-building.width/2;
				building.position.y = game.links.terrain.getHeight(building.position.x)-building.height/2;
				if(game.links.terrain.getOwner(building.position.x) == building.owner && game.findCollisions(building).length < 1){
					// samotné postavení
					building.ghost = true;
					building.building = true;

					building.spawnPoint = building.owner == "player" ? building.position.x+building.width+32 : building.position.x-building.width-32;
			
					building.afterPlacement();
					game.players[building.owner].resources.spec -= building.price;
					
					building.tryProduce("Self", building.price);
					game.add(building);
				}
		},
		makeApe : function (){
			_this.property[0].actions[0].exec();
		},
	};
}
AI.prototype.tick = function() {
	if(!this.active)
		return;

	this.ticks++;
	if(this.ticks % this.aiLimit){
		var action = this.chooseAction();
	}
	else {
		var action = "nothing";
	}

	this.actions[ action ]();
};

AI.prototype.chooseAction = function() {
	var actionNames = Object.keys(this.actions);
	var actionLength = actionNames.length;
	this.actions.build();
	return actionNames[Math.floor(actionLength*Math.random())];
};

AI.prototype.tierPossible = function (id){
	if(id < 4) return true;
	if(id < 5 && _this.property[0].tier > 0) return true;
	if(id < 6 && _this.property[0].tier > 1) return true;
	if(id < 7 && _this.property[0].tier > 2) return true;
	return false;
	
};

AI.prototype.getThreath = function (){
	var threaths =[];
	for(var i in game.children){
		if(game.children[i] instanceof Unit && game.children[i].owner != "enemy"){
			if(threaths.length > 0){
				for(var j in threaths){
					if(threaths[j].position.x > game.children[i]) continue;
					else{
						threaths.splice(j,0,game.children[i]);
					};
				};
			}
			else{
				threaths.push(game.children[i])
			}
		}
	};
};

AI.prototype.tryProduce = function (un){
	this.property[0].tryProduce(un);
};