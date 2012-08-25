function Terrain(options){
	Object2D.call(this, options);

	this.simplex = new SimplexNoise();

	this.heightMap = [];

	this.borders = {
		player: 200,
		enemy: 50,
	};

	this.grassLevel = 20;
	this.middleHeight = options.middleHeight === undefined ? this.height/2 : options.middleHeight;
	this.elevation = options.elevation === undefined ? 20 : options.elevation;
	this.zoom = options.zoom === undefined ? 100 : options.zoom;

	this.generateHeightMap( this.middleHeight, this.elevation, this.zoom )
}
Terrain.prototype = new Object2D();

Terrain.prototype.generateHeightMap = function(middleHeight, elevation, zoom) {
	var cache = createCanvas(this.width, this.height);
	cache.ctx.beginPath();
	cache.ctx.moveTo(0, this.height);
	for(var i = 0; i <= this.width; i++){
		var height = middleHeight + this.simplex.noise( i / zoom , 0 ) * elevation;
		this.heightMap.push(height);
		cache.ctx.lineTo(i, this.height - height);
	}
	cache.ctx.lineTo(this.width, this.height);
	var pattern = cache.ctx.createPattern(this.texture.image, "repeat");
	cache.ctx.fillStyle = pattern;
	cache.ctx.fill();
	cache.ctx.closePath();

	cache.ctx.beginPath();
	for(var i = 0; i <= this.width; i++){
		cache.ctx.lineTo(i, this.height - this.heightMap[i]);
	}
	for(var i = this.width; i >= 0; i--){
		cache.ctx.lineTo(i, this.height - this.heightMap[i] + this.grassLevel);
	}
	cache.ctx.fillStyle = "#1F8C23";	
	cache.ctx.fill();
	cache.ctx.closePath();

	this.heightMapImage = cache.canvas;
};

Terrain.prototype.render = function(ctx) {
	if(this.heightMapImage)
		ctx.drawImage(this.heightMapImage, this.position.x, this.position.y);
	//player
	ctx.beginPath();
	ctx.fillStyle = game.player.color;
	for(var i = 0; i <= this.borders["player"];i++){
		ctx.fillRect(i,this.height-this.heightMap[i]-1,1,this.grassLevel/3)
	};
	ctx.fill();
	ctx.closePath();
	
	//enemy
	ctx.beginPath();
	ctx.fillStyle = game.enemy.color;
	for(var i = this.width; this.width - i <= this.borders["enemy"];i--){
		ctx.fillRect(i,this.height-this.heightMap[i]-1,1,this.grassLevel/3)
	};
	ctx.fill();
	ctx.closePath();
};

Terrain.prototype.tick = function (){
	for(){};
};

Terrain.prototype.setBorder = function(x, team) {
	this.borders[team] = x;
};

Terrain.prototype.getHeight = function(x) {
	return this.height - this.heightMap[x];
};