function Unit(options){
	Object2D.call(this, options);
	var _this = this;
	
	options = options !== undefined ? options : {};
	
	this.currentSpeed = this.speed;

	this.actions = [
		{
			name: "Stop!",
			description: "Stop the selected unit.",
			exec: function(){
				_this.currentSpeed = 0;
			}
		},
		{
			name: "Forward!",
			description: "Order the selected unit to MOVE!",
			exec: function(){
				_this.currentSpeed = this.speed;
			}
		},
		{
			name: "Backward!",
			description: "Order the selected unit to MOVE!",
			exec: function(){
				_this.currentSpeed = -this.speed;
			}
		},
	];
}
Unit.prototype = new Object2D();

Unit.prototype.move = function() {
	this.position.x += this.currentSpeed;
	this.position.y = game.links.terrain.getHeight(this.position.x) - this.width/2;
};

Unit.prototype.tick = function() {
	this.move();
	for(var i in game.children){
		if(this.rangeCollision(game.children[i]) !== undefined) console.log(this.rangeCollision(game.children[i]));
	};
};

Unit.prototype.getDistance = function (){
	if(this.owner){
	var distance;
		if(this.owner == "player")
			distance = this.position.x;
		if(this.owner == "enemy")
			distance = game.links.terrain.width - this.position.x;
		return distance;
	}
	else{
		return false;
	}
};