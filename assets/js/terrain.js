function Terrain(options){
	Object2D.call(this, options);

	this.simplex = new SimplexNoise();

	this.heightMap = [];

	this.borders = {
		player : game.players.player.controledGround,
		enemy : game.players.enemy.controledGround,
	};

	this.collidable = false;

	this.grassLevel = 20;
	this.flatBorder = 200;
	this.middleHeight = options.middleHeight === undefined ? this.height/2 : options.middleHeight;
	this.elevation = options.elevation === undefined ? 20 : options.elevation;
	this.zoom = options.zoom === undefined ? 200 : options.zoom;

	this.generateHeightMap( this.middleHeight, this.elevation, this.zoom )
}
Terrain.prototype = new Object2D();

Terrain.prototype.generateHeightMap = function(middleHeight, elevation, zoom) {
	var cache = createCanvas(this.width, this.height);
	cache.ctx.beginPath();
	cache.ctx.moveTo(0, this.height);
	for(var i = 0; i <= this.width; i++){
		if(i < this.flatBorder)
			var height = middleHeight + this.simplex.noise( this.flatBorder / zoom , 0 ) * elevation;
		else if(i > this.width-this.flatBorder)
			var height = middleHeight + this.simplex.noise( (this.width-this.flatBorder) / zoom , 0 ) * elevation;
		else
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

	// věci v půdě
	var amount = 10;
	var images = [game.textures.get("skull"), game.textures.get("anchor"), game.textures.get("skeleton")]
	for(var i = 0; i < amount;i++){
		cache.ctx.save();
		var x = this.width/amount*i
		var y = this.height - (this.heightMap[x]-this.grassLevel*3)*Math.random()
		cache.ctx.translate(x,y);
		cache.ctx.rotate(Math.PI*2*Math.random());
		var tex = images[ Math.floor( Math.random()*images.length ) ];
		cache.ctx.translate(-tex.width/2, -tex.height/2);
		cache.ctx.drawImage(tex.image, 0, 0)
		cache.ctx.restore();
	}

	this.heightMapImage = cache.canvas;
};

Terrain.prototype.render = function(ctx) {
	if(this.heightMapImage)
		ctx.drawImage(this.heightMapImage, this.position.x, this.position.y);
	//player
	ctx.beginPath();
	ctx.strokeStyle = game.players.player.color;
	ctx.lineWidth = 5;
	for(var i = 0; i <= this.borders["player"];i++){
		// ctx.fillRect(i,this.height-this.heightMap[i]-1,1,this.grassLevel/3)
		ctx.lineTo(i,this.height-this.heightMap[i]-1)
	};
	ctx.stroke();
	ctx.closePath();
	
	//enemy
	ctx.beginPath();
	ctx.strokeStyle = game.players.enemy.color;
	ctx.lineWidth = 5;
	for(var i = this.width; this.width - i <= this.borders["enemy"];i--){
		ctx.lineTo(i,this.height-this.heightMap[i]-1)
	};
	ctx.stroke();
	ctx.closePath();
};

Terrain.prototype.tick = function (){
	for(var i in game.children){
		if(game.children[i] instanceof Unit){
			if(game.children[i].owner == "player"){
				if(game.children[i].getDistance() > this.borders["player"])
					this.borders["player"]  = game.children[i].getDistance();
					game.players.player.controledGround = game.children[i].getDistance();
			}
			else{
				if(game.children[i].getDistance() > this.borders["enemy"])
					this.borders["enemy"]  = game.children[i].getDistance();
					game.players.enemy.controledGround = game.children[i].getDistance();
			}
			var soucet = this.borders["player"]+this.borders["enemy"];
			if(this.width < soucet){
				if(this.borders["player"] > this.borders["enemy"]){
					this.borders["enemy"]-=soucet - this.width;
					game.players.enemy.controledGround -=soucet - this.width;
				}
				else{
					this.borders["player"]-=soucet - this.width;
					game.players.enemy.controledGround -=soucet - this.width;
				}
			}
		}
	};
};

Terrain.prototype.setBorder = function(x, team) {
	this.borders[team] = x;
};

Terrain.prototype.getHeight = function(x) {
	if(0 <= x && x <= this.heightMap.length){
		return this.height - this.heightMap[Math.floor(x)];
	}
	else{
		return this.middleHeight;
	}
};