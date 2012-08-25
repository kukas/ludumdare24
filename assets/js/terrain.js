function Terrain(options){
	Object2D.call(this, options);

	this.simplex = new SimplexNoise();

	this.heightMap = [];

	this.borders = {
		atheists: 0,
		creationists: 0
	};

	this.middleHeight = options.middleHeight === undefined ? this.height/2 : options.middleHeight;
	this.elevation = options.elevation === undefined ? 20 : options.elevation;
	this.zoom = options.zoom === undefined ? 100 : options.zoom;

	this.generateHeightMap( this.middleHeight, this.elevation, this.zoom )
}
Terrain.prototype = new Object2D();

Terrain.prototype.generateHeightMap = function(middleHeight, elevation, zoom) {
	var cache = createCanvas(this.width, this.height);
	for(var i = 0; i < this.width; i++){
		var height = middleHeight + this.simplex.noise( i / zoom , 0 ) * elevation;
		this.heightMap.push(height);
		cache.ctx.fillStyle = "#000";
		// cache.ctx.fillRect(i, 0, 1, 10);
		cache.ctx.fillRect(i, this.height - height, 1, height);
	}

	console.log(this.heightMap)
	this.heightMapImage = cache.canvas;
};

Terrain.prototype.render = function(ctx) {
	if(this.heightMapImage)
		ctx.drawImage(this.heightMapImage, this.position.x, this.position.y)
};

Terrain.prototype.setBorder = function(x, team) {
	this.borders[team] = x;
};