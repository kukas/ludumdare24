function Object2D(){
	this.position = new Vector2();
	this.zIndex = 0;
	this.rotation = 0;
	
	this.width = 0;
	this.heigth = 0;

	this.parent = undefined;
	this.children = [];
	this.links = {};

	this.collidable = true;
	this.collisionType = "circle"; // "rectangle", "rotated-rectangle"
	this.boundingRadius = 0;

	this.vector = new Vector2();
};

Object2D.prototype.lookAt = function(vec) {
	tVec = new Vector2().sub(this.position, vec);
	this.rotation = Math.tan(tVec.y/tVec.x);
	console.log(this.rotation);
};

Object2D.prototype.computeBoundingRadius = function() {
	return this.boundingRadius = Math.sqrt(this.width*this.width + this.height*this.height)/2;
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
		return (Math.abs(this.position.x - obj.position.x) * 2 < (this.width + obj.width)) && 
			(Math.abs(this.position.y - obj.position.y) * 2 < (this.height + obj.height));
	}
	else if(this.collisionType == "rotated-rectangle"){
		return false;
	}
};

Object2D.prototype.add = function(obj, name) {
	this.children.push(obj);
	obj.parent = this;

	if(name)
		this.links[name] = obj;
};

Object2D.prototype.remove = function(obj){

};

Object2D.prototype.inObject = function(vec) {
	if(this.collisionType == "circle"){
		var dx = vec.x - this.position.x;
		var dy = vec.y - this.position.y;
		var minDistance = this.boundingRadius;
		return dx*dx + dy*dy < minDistance*minDistance;
	}
	else if(this.collisionType == "rectangle"){
		// http://gamedev.stackexchange.com/questions/586/what-is-the-fastest-way-to-work-out-2d-bounding-box-intersection
		return (Math.abs(this.position.x - vec.x) * 2 < this.width) && 
			(Math.abs(this.position.y - vec.y) * 2 < this.height);
	}
	else if(this.collisionType == "rotated-rectangle"){
		return false;
	}
};

Object2D.prototype.tick = function() {
};
Object2D.prototype.render = function() {
};

Object2D.prototype.tickChildren = function() {
	for (var i = 0, len = this.children.length; i < len; i++){
		this.children[i].tick();
		if(this.children[i].tickChildren)
			this.children[i].tickChildren();
	};
};
Object2D.prototype.renderChildren = function() {
	ctx.save();
	ctx.translate(this.x, this.y);
	for (var i = 0, len = this.children.length; i < len; i++){
		this.children[i].render(ctx);
		if(this.children[i].renderChildren)
			this.children[i].renderChildren(ctx);
	};
	ctx.restore();
};