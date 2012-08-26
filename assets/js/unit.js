function Unit(options){
	Object2D.call(this, options);
	var _this = this;
	
	options = options !== undefined ? options : {};
	
	this.currentSpeed = this.speed;
	this.shouldBeSpeed = this.speed;

	this.waiting = false;
	this.lastdeal = 0;
	this.ujdi = 0;

	this.actions = [
		{
			name: "Stop!",
			description: "Stop the selected unit.",
			exec: function(){
				var c = game.findCollisions(_this);
				if( c.length < 1 ){
					_this.shouldBeSpeed = 0;
				}
			}
		},
		{
			name: "Backward!",
			description: "Order the selected unit to MOVE!",
			exec: function(){
				_this.shouldBeSpeed = -_this.speed;
			}
		},
		{
			name: "Forward!",
			description: "Order the selected unit to MOVE!",
			exec: function(){
				_this.shouldBeSpeed = _this.speed;
			}
		},
	];
}
Unit.prototype = new Object2D();

Unit.prototype.onCollision = function(obj) {
	if(this.owner == obj.owner){
		if(this.shouldBeSpeed < 0 || obj.shouldBeSpeed < 0 || obj instanceof Building)
			return
		var direction = this.owner == "player" ? 1 : -1;
		var dist = direction*(obj.position.x - this.position.x);
		if( dist < (this.width + obj.width)/2-obj.speed-this.speed && dist > 0 ){
			// console.log( direction*(this.position.x - obj.position.x) )
			this.shouldBeSpeed = -this.speed;
			if(this.ujdi < 1)
				this.ujdi = Math.ceil( (this.width+(obj.width/obj.speed)*this.speed )/2/this.speed + Math.random() + 2);
			return
		}
	}
	if(obj instanceof Unit || obj instanceof Building){
		if( dist < (this.width + obj.width)/2-obj.speed && dist > 0 ){
			this.shouldBeSpeed = -this.speed;
			obj.shouldBeSpeed = -this.speed;
			if(this.ujdi < 1)
				this.ujdi = Math.ceil( (this.width+(obj.width/obj.speed)*this.speed )/2/this.speed + Math.random() + 2);
			if(obj.ujdi < 1)
				obj.ujdi = Math.ceil( (obj.width+(this.width/this.speed)*obj.speed )/2/obj.speed + Math.random() + 2);
			return
		}
		this.freeze();
		this.attack( obj );
	};
};

Unit.prototype.onSelect = function() {
	console.log(this.waiting, this.shouldBeSpeed, this.currentSpeed)
};

Unit.prototype.move = function() {
	if(this.waiting)
		var sp = this.shouldBeSpeed;
	else
		var sp = this.currentSpeed;

	var direction = this.owner == "player" ? 1 : -1;

	this.position.x += direction * sp;

	this.unfreeze();
	var c = game.findCollisions(this);
	if( c.length ){
		for(var i in c){
			this.onCollision(c[i]);
		}
	}

	this.position.x -= direction * sp;


	if(!this.waiting){
		this.texture.switchAnimation("walking");

		this.currentSpeed = this.shouldBeSpeed;

		if(this.owner == "player")
			this.position.x += this.currentSpeed;
		else
			this.position.x -= this.currentSpeed;

		this.position.y = game.links.terrain.getHeight(this.position.x) - this.height/2;
	}
};

Unit.prototype.tick = function() {
	if(this.ujdi > 0){
		this.ujdi--;
		this.shouldBeSpeed = -this.speed;
	}
	if(this.ujdi == 1){
		this.ujdi = 0;
		this.shouldBeSpeed = this.speed;
	}
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
		else
			distance = game.playground.width - this.position.x;
		return distance;
	}
	else{
		return false;
	}
};

Unit.prototype.freeze = function() {
	if(!this.waiting){
		this.waiting = true;
		this.currentSpeed = 0;
	}
};

Unit.prototype.unfreeze = function() {
	if(this.waiting){
		this.waiting = false;
		this.currentSpeed = this.shouldBeSpeed;
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
	if(this.health <= 0){
		murderer.unfreeze();
		murderer.lastdeal = 0;
		game.players[murderer.owner].resources.gold+=2*this.prize;
		game.remove(this);
	}
};
