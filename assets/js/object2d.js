function Object2D(){
	this.position = new Vector2();
	this.zIndex = 0;
	this.rotation = 0;
	
	this.width = 0;
	this.heigth = 0;

	this.parent = undefined;
	this.children = [];

	this.collidable = true;
	this.collisionType = "circle"; // "rectangle", "rotated-rectangle"
	this.boundingRadius = 0;

	this.vector = new Vector2();
};

Object2D.prototype.lookAt = function(vec) {
	// body...
};

Object2D.prototype.checkCollision = function(obj) {
	if(this.collisionType == "circle"){
		var dx = obj.position.x - this.position.x;
		var dy = obj.position.y - this.position.y;
		var minDistance = obj.boundingRadius+this.boundingRadius;
		return dx*dx + dy*dy < minDistance*minDistance;
	}
	else if(this.collisionType == "rectangle"){
		// http://gamedev.stackexchange.com/questions/586/what-is-the-fastest-way-to-work-out-2d-bounding-box-intersection
		return (Math.abs(a.x - b.x) * 2 < (a.width + b.width)) && 
			(Math.abs(a.y - b.y) * 2 < (a.height + b.height));
	}
	else if(this.collisionType == "rotated-rectangle"){
		return false;
	}
};

Object2D.prototype.add = function(obj) {
	// body...
};

Object2D.prototype.remove = function(obj){

};

Object2D.prototype.inObject = function(vec) {
	// body...
};

Object2D.prototype.tick = function() {
	this.tickChildren();
	return null;
};
Object2D.prototype.render = function() {
	this.renderChildren();
	return null;
};

Object2D.prototype.tickChildren = function() {
	return null;
};
Object2D.prototype.renderChildren = function() {
	return null;
};