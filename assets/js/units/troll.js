function Troll(options){
	this.speed = options.speed !== undefined ? options.speed : 2;
	
	Unit.call(this, options);
	
	this.width = 64;
	this.height = 64;
	
	this.texture = game.textures.get("troll", {scale:new Vector2(1,1)});
	
	this.owner = options.owner !== undefined ? options.owner : false;
	
		
	
	
};
Troll.prototype = new Unit();