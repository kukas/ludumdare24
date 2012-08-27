function FieldObject( options ){
	Object2D.call(this, options);
	this.lastdeal = 0;
	this.boomRange = -1;
};
FieldObject.prototype = new Object2D();

FieldObject.prototype.tryAim = function() {
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
	this.attack( collided[min] );
};

FieldObject.prototype.getDistance = function (){
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

FieldObject.prototype.attack = function( obj ) {
	if(!obj.ghost){
		if(this.boomRange > 0){
			this.boom();
			return false;
		}
		else{
			if(obj.owner == this.owner)
				return
			if(this.lastdeal >= this.cadency){
				this.texture.switchAnimation("attack");
				obj.dealDamage(this.damage, this);
				this.lastdeal = 0;
			}
		}
	}
};

FieldObject.prototype.dealDamage = function (dmg, murderer){
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
	if(murderer == this){
		this.die();
		return
	}
	this.die(murderer);
};

FieldObject.prototype.die = function( murderer ) {
	if(this.health <= 0){
		if(murderer !== undefined && game.players[murderer.owner] !== undefined){
			murderer.lastdeal = 0;
			game.players[murderer.owner].resources.gold+=2*this.price;
		}
		game.remove(this);
	}
};
