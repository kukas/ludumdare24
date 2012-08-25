function Skull(options){
	
	this.speed = options.speed !== undefined ? options.speed : 2;
	
	Unit.call(this, options);
	
	this.width = 18;
	this.height = 18;
	
	this.range = 20;
	
	if(options.owner == "player"){
		this.texture = game.textures.get("skull");
	}
	else{
		this.texture = game.textures.get("skull", {flip:"x"});
	}
	
	this.owner = options.owner !== undefined ? options.owner : false;
	
};
Skull.prototype = new Unit();