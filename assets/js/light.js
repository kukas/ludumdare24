// celé jsem to vykradl odsud: https://github.com/gre/illuminated.js
function createCanvas(w, h){
	var canvas = document.createElement("canvas");
	canvas.width = w;
	canvas.height = h;
	var ctx = canvas.getContext("2d");
	return {canvas: canvas, ctx: ctx, width: w, height: h};
}
function Lamp(options){
	this.position = options.position === undefined ? new Vector2() : options.position;
	this.distance = options.distance === undefined ? 100 : options.distance;
	this.color = options.color === undefined ? new Color(0xF2BF8E, 0.8) : options.color;

	this.gradientCache = undefined;
	this.visibleMaskCache = undefined;
}
Lamp.prototype.getGradientCache = function () {
	if(this.gradientCache)
		return this.gradientCache;
	// zavedení canvasu
	var size = this.distance*2;
	this.gradientCache = createCanvas(size, size);
	var ctx = this.gradientCache.ctx;
	// vytvoření gradientu
	var gradient = ctx.createRadialGradient(this.distance, this.distance, 0, this.distance, this.distance, this.distance);
	gradient.addColorStop( 0, this.color.getRGBA() );
	gradient.addColorStop( 1, this.color.getRGBA(0) );

	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, size, size);

	return this.gradientCache;
}

Lamp.prototype.getBounds = function() {
	return {
		topleft: new Vector2(this.position.x - this.distance, this.position.y - this.distance),
		bottomright: new Vector2(this.position.x + this.distance, this.position.y + this.distance)
	}
};

Lamp.prototype.getVisibleMaskCache = function () {
	if(this.visibleMaskCache)
		return this.visibleMaskCache;
	// zavedení canvasu
	var d = this.distance*1.4;
	var size = d*2;

	this.visibleMaskCache = createCanvas(size, size);
	var ctx = this.visibleMaskCache.ctx;

	var gradient = ctx.createRadialGradient(d,d, 0, d,d,d);
	gradient.addColorStop( 0, 'rgba(0,0,0,1)' );
	gradient.addColorStop( 1, 'rgba(0,0,0,0)' );

	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, size, size);

	return this.visibleMaskCache;
}

Lamp.prototype.mask = function (ctx) {
	var cache = this.getVisibleMaskCache();
	ctx.drawImage(cache.canvas, this.position.x-cache.width/2, this.position.y-cache.height/2);
}

Lamp.prototype.render = function (ctx) {
	var cache = this.getGradientCache();
	ctx.drawImage(cache.canvas, this.position.x-this.distance, this.position.y-this.distance);
	ctx.fillStyle = "#000";
	ctx.fillRect(this.position.x, this.position.y, 2,2)
}

function Lights(){
	this.cacheCanvas = createCanvas(game.width, game.height);
	this.lights = [];
}

Lights.prototype.render = function(gamectx) {
	if(!this.cacheCanvas)
		this.cacheCanvas = createCanvas(game.width, game.height);
	var ctx = this.cacheCanvas.ctx;
	ctx.clearRect(0, 0, this.cacheCanvas.width, this.cacheCanvas.height);

	ctx.save();
	this.renderLights(ctx)
	ctx.globalCompositeOperation = "destination-out";
	this.cast(ctx);
	ctx.restore();

	gamectx.save();
	gamectx.globalCompositeOperation = "lighter";
	gamectx.drawImage(this.cacheCanvas.canvas, 0, 0);
	gamectx.restore();
};

Lights.prototype.cast = function(ctx) {
	ctx.fillStyle = "rgb(0,0,0)"
	for (var i = 0, lightsLen = this.lights.length; i < lightsLen; i++){
		console.log(len)
		var light = this.lights[i];
		var lightBounds = light.getBounds();
		for (var j = 0, len = game.children.length; j < len; j++){
			var object = game.children[j];
			if(!object.opaque)
				continue;
			if(object.inObject(light.position)){
				ctx.fillRect(lightBounds.topleft.x, lightBounds.topleft.y, lightBounds.bottomright.x-lightBounds.topleft.x, lightBounds.bottomright.y - lightBounds.topleft.y);
			}
			var polygon = new Polygon();
			polygon.rectangleToPoints( object );
			polygon.cast(ctx, light.position, lightBounds);
		};
	};
};

function Polygon(){
	this.points = [];
}
Polygon.prototype.cast = function(ctx, origin, bounds) {
	var distance = ((bounds.bottomright.x-bounds.topleft.x)+(bounds.bottomright.y-bounds.topleft.y))/2;
	for(var i=0; i<this.points.length-1; i++){
		var pointA = this.points[i];
		var pointB = this.points[i+1];

		var translatedA = new Vector2().sub(pointA, origin);
		var vzdalenyA = translatedA.setLength(distance).addSelf(origin);

		var translatedB = new Vector2().sub(pointB, origin);
		var vzdalenyB = translatedB.setLength(distance).addSelf(origin);

		ctx.beginPath();
		ctx.moveTo(pointA.x, pointA.y);
		ctx.lineTo(pointB.x, pointB.y);
		ctx.lineTo(vzdalenyB.x, vzdalenyB.y);
		ctx.lineTo(vzdalenyA.x, vzdalenyA.y);
		ctx.fill();
		ctx.closePath();
	}
};

Polygon.prototype.rectangleToPoints = function(rectangle) {
	// var angle = Math.atan(rectangle.height/rectangle.width);
	// var newAngle = angle + rectangle.rotation;
	// var sinAngle = Math.sin(newAngle);
	// var cosAngle = Math.cos(newAngle);
	// var halfdiagonal = new Vector2(rectangle.height, rectangle.width).length()/2;
	var corners = [-1,1];
	for(var i = 0; i < 2; i++){
		var column = corners[i];
		for(var j = 0; j < 2; j++){
			var row = corners[j];
			
			var corner = new Vector2( column * rectangle.width/2, row * rectangle.height/2 );
			// this.points.push( new Vector2(
			// 	sinAngle*
			// 	) )
			this.points.push(corner.addSelf(rectangle.position))
		}
	}
};

Lights.prototype.renderLights = function(ctx) {
	for (var i = 0, len = this.lights.length; i < len; i++){
		this.lights[i].render(ctx)
	};
};

Lights.prototype.renderMask = function(ctx) {
	this.computeDarkMask();
	ctx.drawImage(this.darkMaskCache, 0, 0);
};

Lights.prototype.computeDarkMask = function() {
	this.darkMaskCache = document.createElement("canvas");
	this.darkMaskCache.width = game.width;
	this.darkMaskCache.height = game.height;

	var ctx = this.darkMaskCache.getContext("2d");

	ctx.save();

	ctx.fillStyle = "rgba(0,0,0,0.9)"; // barva stínu
	ctx.fillRect(0, 0, game.width, game.height);
	ctx.globalCompositeOperation = "destination-out";
	for (var i = 0, len = this.lights.length; i < len; i++){
		this.lights[i].mask(ctx);
	};

	ctx.restore();
};