function Unit(options){
	FieldObject.call(this, options);
	var _this = this;
	
	options = options !== undefined ? options : {};
	
	this.currentSpeed = this.speed;
	this.shouldBeSpeed = this.speed;

	this.waiting = false;
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
Unit.prototype = new FieldObject();

Unit.prototype.onCollision = function(obj) {
	if(obj.ghost)
		return;
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
		if( dist < (this.width + obj.width)/3-obj.speed && dist > 0 ){
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
	if(this.lastdeal <= this.cadency)
		this.lastdeal++;
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