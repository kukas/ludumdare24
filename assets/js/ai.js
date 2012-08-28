function AI(){
	var _this = this;
	this.property = [];

	this.availableUnits = [];
	this.buildings = [];

	this.active = true;
	this.ticks = 0;
	this.difficultyRatio = 0;
	this.aiLimit = 10;
	this.actions = {
		nothing: function(){
			return;
		},
		produce: function(){
			if(_this.property[0]){
				var uu = _this.availableUnits[Math.floor(Math.random()*_this.availableUnits.length)];
				var price = new uu({}).price;
				_this.property[0].tryProduce(uu,price);
			}
		},
		build : function (){
			var id = Math.round(Math.random()*(3+_this.property[0].tier));
				var building = new _this.buildings[id]({});
				building.owner = "enemy";
				building.position.x = Math.random()*game.players.enemy.controledGround;
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
					if(_this.buildings[id] == GayBay){
						_this.availableUnits.push(Gay,Heretic);
					}
					if(_this.buildings[id] == Laboratory){
						_this.availableUnits.push(Biologist);
					}
					if(_this.buildings[id] == Portal){
						_this.availableUnits.push(Devil);
					}
					if(_this.buildings[id] == Galapags){
						_this.availableUnits.push(Wallace);
					}
					if(_this.buildings[id] == Museum){
						_this.availableUnits.push(Trex);
					}
					if(_this.buildings[id] == Painting){
						_this.availableUnits.push(Cherub);
					}
					if(_this.buildings[id] == Confessor){
						_this.availableUnits.push(Bishop,Prophet);
					}
					if(_this.buildings[id] == Altar){
						_this.availableUnits.push(Angel);
					}
					if(_this.buildings[id] == Slum){
						_this.availableUnits.push(Terese);
					}
					if(_this.buildings[id] == Golgota){
						_this.availableUnits.push(Jesus);
					}
				}
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