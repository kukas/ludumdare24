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

	this.gradientHash = "";
	this.visibleMaskHash = "";
}

Lamp.prototype.getGradientCache = function () {
	if(this.gradientCache && this.gradientHash === this.distance + this.color.getRGBA() )
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

	this.gradientHash = this.distance + this.color.getRGBA();

	return this.gradientCache;
}

Lamp.prototype.getVisibleMaskCache = function () {
	if(this.visibleMaskCache && this.visibleMaskHash === this.distance + " " )
		return this.visibleMaskCache;
	// zavedení canvasu
	var d = this.distance*1.4;
	var size = d*2;
	this.visibleMaskCache = createCanvas(size, size);
	var ctx = this.visibleMaskCache.ctx;
	// vyrvoření gradientu
	var gradient = ctx.createRadialGradient(d,d, 0, d,d,d);
	gradient.addColorStop( 0, 'rgba(0,0,0,1)' );
	gradient.addColorStop( 1, 'rgba(0,0,0,0)' );

	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, size, size);

	this.visibleMaskHash = this.distance + " "

	return this.visibleMaskCache;
}

Lamp.prototype.getBounds = function() {
	return {
		topleft: new Vector2(this.position.x - this.distance, this.position.y - this.distance),
		bottomright: new Vector2(this.position.x + this.distance, this.position.y + this.distance)
	}
};

Lamp.prototype.mask = function (ctx) {
	var cache = this.getVisibleMaskCache();
	ctx.drawImage(cache.canvas, this.position.x-cache.width/2, this.position.y-cache.height/2);
}

Lamp.prototype.render = function (ctx) {
	var cache = this.getGradientCache();
	ctx.drawImage(cache.canvas, this.position.x-this.distance, this.position.y-this.distance);
}

function Lights(){
	this.cacheCanvas = createCanvas(game.width, game.height);
	this.castCache = createCanvas(game.width, game.height);
	this.lights = [];
}

Lights.prototype.render = function(gamectx) {
	var ctx = this.cacheCanvas.ctx;
	ctx.clearRect(0, 0, this.cacheCanvas.width, this.cacheCanvas.height);

	this.cast(ctx);

	gamectx.save();
	gamectx.globalCompositeOperation = "lighter";
	gamectx.drawImage(this.cacheCanvas.canvas, 0, 0);
	gamectx.restore();
};

Lights.prototype.cast = function(lightctx) {
	var ctx = this.castCache.ctx;
	ctx.fillStyle = "rgb(0,0,0)"
	for (var i = 0, lightsLen = this.lights.length; i < lightsLen; i++){
		var light = this.lights[i];
		var lightBounds = light.getBounds();

		ctx.clearRect(0,0,this.castCache.width,this.castCache.height);

		ctx.save();
		light.render(ctx);
		ctx.globalCompositeOperation = "destination-out";

		var dx = (lightBounds.bottomright.x-lightBounds.topleft.x);
		var dy = (lightBounds.bottomright.y-lightBounds.topleft.y);
		var distance = Math.sqrt(dx*dx+dy*dy);
		
		for (var j = 0, len = game.children.length; j < len; j++){
			var object = game.children[j];
			// pokud je ve světle
			if(object.position.x < lightBounds.topleft.x || object.position.x > lightBounds.bottomright.x ||
				object.position.y < lightBounds.topleft.y || object.position.y > lightBounds.bottomright.y )
				continue;
			// pokud je neprůhledný
			if(!object.opaque)
				continue;

			// if( object.points ){
			// 	var polygon = new Polygon( object.points );
			// 	polygon.position = object.position;
			// }
			// else {
				// console.log("gen points")
				var polygon = new Polygon();
				polygon.rectangleToPoints( object );
				object.points = polygon.points;
				polygon.position = object.position;
			// }
			// pokud je světlo uvnitř objektu
			if(polygon.contains(light.position)){
				ctx.fillRect(lightBounds.topleft.x, lightBounds.topleft.y, lightBounds.bottomright.x-lightBounds.topleft.x, lightBounds.bottomright.y - lightBounds.topleft.y);
				break;
			}
			ctx.fillStyle = "rgba(0,0,0,"+(1-object.diffuse)+")";
			polygon.fill(ctx);
			ctx.fillStyle = "rgb(0,0,0)";
			polygon.cast(ctx, light.position, lightBounds, distance);
		};
		ctx.restore();
		lightctx.save();
		lightctx.globalCompositeOperation = "lighter";
		lightctx.drawImage(this.castCache.canvas, 0,0);
		lightctx.restore();
	};
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

function Polygon( points ){
	this.points = points === undefined ? [] : points;
	this.position = new Vector2();
}

Polygon.prototype.fill = function(ctx){
	ctx.beginPath();
	var pointA = new Vector2().add(this.points[0], this.position);
	ctx.moveTo(pointA.x, pointA.y);
	for(var i=1, len=this.points.length; i<len; i++){
		var pointB = new Vector2().add(this.points[i], this.position);
		
		ctx.lineTo(pointB.x, pointB.y);
	}
	ctx.fill();
	ctx.closePath();
}

Polygon.prototype.draw = function(ctx, pointA, pointB, translatedA, translatedB, origin, distance){
	var vzdalenyA = translatedA.setLength(distance).addSelf(origin);
	var vzdalenyB = translatedB.setLength(distance).addSelf(origin);

	ctx.beginPath();
	ctx.lineWidth = 1.2;
	ctx.moveTo(pointA.x, pointA.y);
	ctx.lineTo(pointB.x, pointB.y);
	ctx.lineTo(vzdalenyB.x, vzdalenyB.y);
	ctx.lineTo(vzdalenyA.x, vzdalenyA.y);
	ctx.fill();
	ctx.stroke();
	ctx.closePath();
}

Polygon.prototype.contains = function ( vector ) {
	var points = this.points;
	var i, j=points.length-1;
	var x = vector.x, y = vector.y;
	var oddNodes = false;

	for (i=0; i<points.length; i++) {
		var ix = points[i].x + this.position.x;
		var iy = points[i].y + this.position.y;
		var jx = points[j].x + this.position.x;
		var jy = points[j].y + this.position.y;
		if ((iy< y && jy>=y
			|| jy< y && iy>=y)
			&&  (ix<=x || jx<=x)) {

			if (ix+(y-iy)/(jy-iy)*(jx-ix)<x) {
				oddNodes=!oddNodes; 
			}
		}
		j=i; 
	}
	return oddNodes;
}

Polygon.prototype.cast = function(ctx, origin, bounds, distance) {
	var points = [];

	for(var i=0, len=this.points.length; i<len; i++){
		var pointA = new Vector2().add(this.points[i], this.position);
		var pointB = new Vector2().add(this.points[(i+1) % (this.points.length)], this.position);

		var originToA = new Vector2().sub(pointA, origin);
		var originToB = new Vector2().sub(pointB, origin);

		// magic: (zkopírovaní z illuminated.js)
		var aToB = new Vector2().sub(pointB, pointA);

		var normal = new Vector2(aToB.y, -aToB.x);
		if (normal.dot(originToA) < 0) {
			this.draw(ctx, pointA, pointB, originToA, originToB, origin, distance);
		}
	}
};

Polygon.prototype.rectangleToPoints = function(rectangle) {
	var angle = Math.atan(rectangle.height/rectangle.width);
	var doplnekAngle = Math.PI/2 - angle;
	// var newAngle = -rectangle.rotation + angle;
	// var sinAngle = Math.sin(newAngle);
	// var cosAngle = Math.cos(newAngle);
	var halfdiagonal = new Vector2(rectangle.height, rectangle.width).length()/2;
	// var corners = [-1,1];
	var newAngle = -rectangle.rotation - angle;
	for(var i = 1; i<5; i++){
		// var newAngle = -rectangle.rotation + angle*(i%2) + Math.PI/2*(i%2 + 1);
		var sinAngle = Math.sin(newAngle);
		var cosAngle = Math.cos(newAngle);
		this.points.push( new Vector2(
			-cosAngle*halfdiagonal,
			sinAngle*halfdiagonal
			) );
		if(i == 1 || i == 3)
			newAngle += angle*2;
		else
			newAngle += doplnekAngle*2;
	}
};