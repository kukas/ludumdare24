function Unit(options){
	Object2D.call(this, options);
	
	this.owner = options.owner !== undefined ? options.owner : false;
	
	this.speed = options.speed !== undefined ? options.speed : 1; 
}
Unit.prototype = new Object2D();

Unit.prototype.move = function() {
	this.position.x += this.speed;
	this.position.y = game.links.terrain.getHeight(this.position.x) - this.width/2;
};

Unit.prototype.tick = function() {
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