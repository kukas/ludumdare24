function Object2D( options ){
	options = options === undefined ? {} : options;

	this.position = new Vector2( options.x, options.y );
	this.zIndex = options.zIndex === undefined ? 0 : options.zIndex;
	this.rotation = options.rotation === undefined ? 0 : options.rotation;
	
	this.width = options.width === undefined ? 0 : options.width;
	this.height = options.height === undefined ? 0 : options.height;

	this.parent = undefined;
	this.children = [];
	this.links = {};

	this.texture = options.texture === undefined ? false : options.texture;

	this.collidable = options.collidable === undefined ? true : options.collidable;
	this.collisionType = "circle"; // "rectangle", "rotated-rectangle"
	this.boundingRadius = options.boundingRadius === undefined ? this.computeBoundingRadius() : options.boundingRadius;

	this.vector = new Vector2();
};

Object2D.prototype.lookAt = function(vec) {
	tVec = new Vector2().sub(this.position, vec);
	this.rotation = Math.atan(tVec.y/tVec.x);
	if(tVec.x < 0)
		this.rotation += Math.PI;
};

Object2D.prototype.computeBoundingRadius = function() {
	return this.boundingRadius = Math.sqrt(this.width*this.width + this.height*this.height)/2;
};

Object2D.prototype.checkCollision = function(obj) {
	if(this.collisionType == "circle"){
		var dx = obj.position.x - this.position.x;
		var dy = obj.position.y - this.position.y;
		var minDistance = obj.boundingRadius+this.boundingRadius;
		if(dx*dx + dy*dy < minDistance*minDistance){
			return new Vector2( obj.position.x/this.position.x * minDistance, obj.position.y/this.position.y * minDistance )
		}
		return false;
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

Object2D.prototype.move = function(vec) {
	this.position.addSelf(vec);
	var colls = game.findCollisions(this);
	if(colls.length)
		this.position.subSelf(vec);
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
Object2D.prototype.render = function(ctx) {
	ctx.save();
		ctx.translate(this.position.x, this.position.y);
		ctx.save();
			ctx.rotate(this.rotation)
			ctx.translate(-this.width/2, -this.height/2);
			if(this.texture){
				this.texture.draw(ctx, 0, 0 , this.width, this.height)
			}
		ctx.restore();
	ctx.restore();
	
	ctx.lineWidth = 1;
	ctx.strokeStyle = "#FF00FF";
	if(this.collisionType == "circle"){
		ctx.beginPath();
			ctx.arc(this.position.x, this.position.y, this.boundingRadius, 0, Math.PI*2, false );
			ctx.stroke();
		ctx.closePath();
	}
	else if(this.collisionType == "rectangle"){
		ctx.strokeRect( this.position.x - this.width/2, this.position.y - this.height/2, this.width, this.height );
	}
};

Object2D.prototype.tickChildren = function() {
	for (var i = 0, len = this.children.length; i < len; i++){
		this.children[i].tick();
		if(this.children[i].tickChildren)
			this.children[i].tickChildren();
	};
};
Object2D.prototype.renderChildren = function(ctx) {
	ctx.save();
	ctx.translate(this.position.x, this.position.y);
	for (var i = 0, len = this.children.length; i < len; i++){
		this.children[i].render(ctx);
		if(this.children[i].renderChildren)
			this.children[i].renderChildren(ctx);
	};
	ctx.restore();
};