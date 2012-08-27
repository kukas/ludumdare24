function AI(){
	var _this = this;
	this.property = [];

	this.avaiableUnits = [];

	this.active = false;
	this.ticks = 0;
	this.difficultyRatio = 0;
	this.aiLimit = 10;
	this.actions = {
		nothing: function(){
			return;
		},
		produce: function(){
			// console.log(_this.property)
			if(_this.property[0])
				_this.property[0].actions[ Math.floor(_this.property[0].actions.length*Math.random()) ].exec();
		},
	};
}
AI.prototype.tick = function() {
	if(!this.active)
		return;

	this.ticks++;
	if(this.ticks % this.aiLimit){
		var action = this.chooseAction();
		// console.log(action)
	}
	else {
		var action = "nothing";
	}

	this.actions[ action ]();
};

AI.prototype.chooseAction = function() {
	var actionNames = Object.keys(this.actions);
	var actionLength = actionNames.length;
	return actionNames[Math.floor(actionLength*Math.random())];
};