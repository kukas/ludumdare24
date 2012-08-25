function Object2D( options ){
	var _this = this;

	options = options === undefined ? {} : options;

	this.creationTime = new Date().getTime();

	this.position = options.position === undefined ? new Vector2() : options.position;
	this.zIndex = options.zIndex === undefined ? 0 : options.zIndex;
	this.rotation = options.rotation === undefined ? 0 : options.rotation;
	
	this.width = options.width === undefined ? 0 : options.width;
	this.height = options.height === undefined ? 0 : options.height;

	this.parent = undefined;
	this.children = [];
	this.links = {};

	this.selected = false;

	this.texture = options.texture === undefined ? false : options.texture;

	this.collidable = options.collidable === undefined ? true : options.collidable;
	this.collisionType = "hitbox"; // "hitbox", "rotated-hitbox"
	this.boundingRadius = options.boundingRadius === undefined ? this.computeBoundingRadius() : options.boundingRadius;
	this.hitbox = options.hitbox === undefined ? {x: 0, y: 0, width: _this.width, height: _this.height} : options.hitbox;

	// světlo
	this.opaque = options.opaque === undefined ? true : options.opaque;
	this.diffuse =  options.diffuse === undefined ? 0.4 : options.diffuse; // jak moc se od jeho povrchu odráží světlo

	this.velocity = new Vector2();
};
// pohybové funkce
Object2D.prototype.lookAt = function(vec) {
	tVec = new Vector2().sub(this.position, vec);
	this.rotation = Math.atan(tVec.y/tVec.x);
	if(tVec.x < 0)
		this.rotation += Math.PI;
};

Object2D.prototype.move = function(vec) {
	this.position.addSelf(vec);
	var colls = game.findCollisions(this);
	if(colls.length)
		this.position.subSelf(vec);
};

// kolizní funkce
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
	else if(this.collisionType == "hitbox"){
		// http://gamedev.stackexchange.com/questions/586/what-is-the-fastest-way-to-work-out-2d-bounding-box-intersection
		return (Math.abs(this.position.x - obj.position.x) * 2 < (this.width + obj.width)) && 
			(Math.abs(this.position.y - obj.position.y) * 2 < (this.height + obj.height));
	}
	else if(this.collisionType == "rotated-hitbox"){
		return false;
	}
};

Object2D.prototype.inObject = function(vec) {
	if(this.collisionType == "circle"){
		var dx = vec.x - this.position.x;
		var dy = vec.y - this.position.y;
		var minDistance = this.boundingRadius;
		return dx*dx + dy*dy < minDistance*minDistance;
	}
	else if(this.collisionType == "hitbox"){
		// http://gamedev.stackexchange.com/questions/586/what-is-the-fastest-way-to-work-out-2d-bounding-box-intersection
		return (Math.abs(this.position.x - vec.x) * 2 < this.width) && 
			(Math.abs(this.position.y - vec.y) * 2 < this.height);
	}
	else if(this.collisionType == "rotated-hitbox"){
		return false;
	}
};

// funkce práce s dětmi
Object2D.prototype.add = function(obj, name) {
	this.children.push(obj);
	obj.parent = this;

	if(name)
		this.links[name] = obj;
};

Object2D.prototype.remove = function(obj){
	var search = this.children.indexOf(obj);
	if(search > -1){
		this.children.splice(search, 1);
	}

	for (var i = 0; i < this.links.length; i++) {
		if(this.links[i] == obj)
			delete this.links[i];
	};
};

Object2D.prototype.getSortedChildrenHash = function(){
	var hash = [];
	for (var i = 0, len = this.children.length; i < len; i++){
		hash.push(this.children[i].zIndex)
	};
	return hash.join("");
}

Object2D.prototype.sortChildren = function() {
	if( this.sortedChildrenHash !== this.getSortedChildrenHash() ){
		this.children.sort(function(a,b){
			return a.zIndex - b.zIndex;
		})
		this.sortedChildrenHash = this.getSortedChildrenHash();
		return this.children;
	}
	else {
		return this.children;
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
	if(this.children.length < 1)
		return;

	this.sortChildren();

	ctx.save();
	ctx.translate(this.position.x, this.position.y);
	for (var i = 0, len = this.children.length; i < len; i++){
		this.children[i].render(ctx);
		if(this.children[i].renderChildren)
			this.children[i].renderChildren(ctx);
	};
	ctx.restore();
};


Object2D.prototype.tick = function() {
};

Object2D.prototype.render = function(ctx) {
	ctx.save();
		ctx.translate(this.position.x, this.position.y);
		ctx.save();
			ctx.rotate(this.rotation)
			ctx.save();
				ctx.translate(-this.width/2, -this.height/2);
				if(this.texture){
					this.texture.draw(ctx, 0, 0 , this.width, this.height)
				}
				if(this.selected){
					ctx.beginPath();
					ctx.fillStyle = "rgba(219, 26, 26, 0.3)"
					ctx.strokeStyle = "rgba(219, 26, 26, 0.7)"
					ctx.rect(0,0,this.width, this.height)
					ctx.fill();
					ctx.stroke();
					ctx.closePath();
				}
			ctx.restore();
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
	else if(this.collisionType == "hitbox"){
		ctx.strokeRect( this.position.x - this.width/2, this.position.y - this.height/2, this.width, this.height );
	}
};

