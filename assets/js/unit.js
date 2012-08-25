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
				_this.currentSpeed = _this.speed;
			}
		},
		{
			name: "Backward!",
			description: "Order the selected unit to MOVE!",
			exec: function(){
				_this.currentSpeed = -_this.speed;
			}
		},
	];
}
Unit.prototype = new Object2D();

Unit.prototype.move = function() {
	this.position.x += this.currentSpeed;
	this.position.y = game.links.terrain.getHeight(this.position.x) - this.height/2;
};

Unit.prototype.tick = function() {
	if(!this.waiting)
		this.move();
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

Unit.prototype.dealDamage = function ( obj ){
	this.waiting = true;
	if(this.lastdeal !== undefined){
		if(this.lastdeal >= this.cadency){
			obj.health-=this.damage;
			console.log("dealing damage");
			if(obj.health <= 0){console.log("died");
				this.currentSpeed = this.speed;
				game.remove(obj);
			}
			this.lastdeal = 0;
		}
		else{
			this.lastdeal++;
		}
	}
	else{
		obj.health-=this.damage;
		console.log("dealing damage");
		if(obj.health <= 0){console.log("died");
			this.currentSpeed = this.speed;
			game.remove(obj);
		}
		this.lastdeal = 0;
	}
};
Unit.prototype.waiting = false;
