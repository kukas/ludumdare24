function Skull(options){
	
	this.speed = options.speed !== undefined ? options.speed : 2;
	
	Unit.call(this, options);
	
	this.width = 18;
	this.height = 18;
	
	this.range = 20;
	
	this.texture = game.textures.get("skull", {scale:new Vector2(1,1)});
	
	this.owner = options.owner !== undefined ? options.owner : false;
	
};
Skull.prototype = new Unit();