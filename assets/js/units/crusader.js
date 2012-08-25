function Crusader( options ){
	
	this.width = 64;
	this.height = 64;
	
	this.texture = game.textures.get("crusader", {scale:new Vector2(-1,1)});
	
	this.owner = options.owner !== undefined ? options.owner : false;
	
	this.speed = options.speed !== undefined ? options.speed : 0.5;
	
	Unit.call(this, options);
};
Crusader.prototype = new Unit();