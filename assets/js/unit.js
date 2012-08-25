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
	this.texture.switchAnimation("walking");

	this.position.x += this.currentSpeed;
	this.position.y = game.links.terrain.getHeight(this.position.x) - this.height/2;
};

Unit.prototype.tick = function() {
	if(!this.waitQueue)
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
	this.waitQueue = true;
	this.lastdeal = this.lastdeal === undefined ? 0 : this.lastdeal;
	if(this.lastdeal !== undefined){
		if(this.lastdeal >= this.cadency){
			var vlevo = (this.position.x > obj.position.x) ? 1 : 0;
			console.log(vlevo)
			// krev
			game.links.particlesystem.emit(Particle, 20, {
				position: new Vector2().copy(obj.position),
				gravity: new Vector2(0,0.1),
				width: 5, height: 5,
				spin: 0.1,
				fade: 0.017,
			}, {
				color: [new Color(0xFF0000), new Color(0xF23B16), new Color(0xB50000)],
				velocity: {
					x: {min: -2*vlevo, max: 2*(1-vlevo)},
					y: {min: -2, max: -1.5}
				},
				rotation: { min: 0, max: Math.PI }
			});

			this.texture.switchAnimation("attack");

			obj.health-=this.damage;
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
};
Unit.prototype.waitQueue = false;
