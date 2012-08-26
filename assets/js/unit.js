function Unit(options){
	Object2D.call(this, options);
	var _this = this;
	
	options = options !== undefined ? options : {};
	
	this.currentSpeed = this.speed;

	this.waiting = false;
	this.lastdeal = 0;

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

Unit.prototype.onCollision = function(obj) {
	// if(this.owner == obj.owner)
	// 	return
	if(obj instanceof Unit || obj instanceof Building){
		this.freeze();
		this.attack( obj );
	};
};

Unit.prototype.move = function() {
	var sp = this.lastSpeed || this.currentSpeed;
	this.position.x += sp;

	this.unfreeze();
	var c = game.findCollisions(this);
	if( c.length ){
		for(var i in c){
			this.onCollision(c[i]);
		}
	}

	this.position.x -= sp;

	if(!this.waiting){
		this.texture.switchAnimation("walking");
		this.position.x += this.currentSpeed;
		this.position.y = game.links.terrain.getHeight(this.position.x) - this.height/2;
	}
};

Unit.prototype.tick = function() {
	this.move();
	if(this.range > this.width/2)
		this.tryAim();
};

Unit.prototype.tryAim = function() {
	var collided = [];
	for(var i in game.children){
		if(this.rangeCollision(game.children[i]) &&
			game.children[i].owner != this.owner &&
			(game.children[i] instanceof Unit || game.children[i] instanceof Building))
			collided.push(game.children[i]);
		
	}
	if(!collided.length)
		return false;
	var min = 0;
	for(var i=0;i<collided.length;i++){
		if( Math.abs(this.position.x - collided[min].position.x) > Math.abs(this.position.x - collided[i].position.x) )
			min = i;
	}
	this.freeze();
	this.attack( collided[min] );
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

Unit.prototype.freeze = function() {
	if(!this.waiting){
		this.waiting = true;
		this.lastSpeed = this.currentSpeed;
		this.currentSpeed = 0;
	}
};

Unit.prototype.unfreeze = function() {
	if(this.waiting){
		this.waiting = false;
		this.currentSpeed = this.lastSpeed;
	}
};

Unit.prototype.attack = function( obj ) {
	if(obj.owner == this.owner)
		return
	if(this.lastdeal >= this.cadency){
		this.texture.switchAnimation("attack");
		obj.dealDamage(this.damage, this);
		
		this.lastdeal = 0;
	}
	else{
		this.lastdeal++;
	}
};

Unit.prototype.dealDamage = function (dmg, murderer){
	murderer = murderer === undefined ? this : murderer;
	this.health -= dmg;
	// krev
	var vlevo = (this.position.x < murderer.position.x) ? 1 : 0;
	game.links.particlesystem.emit(Particle, 20, {
		position: new Vector2().copy(this.position),
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

	this.die(murderer);
};

Unit.prototype.die = function( murderer ) {
	murderer.unfreeze();
	if(this.health <= 0){
		game.remove(this);
	}
};
