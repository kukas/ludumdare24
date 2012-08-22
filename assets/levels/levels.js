function Levels(){
	this.texturepath = "./assets/textures/";
	this.soundpath = "./assets/sounds/";
	this.musicpath = "./assets/music/";

	this.textures_src = {};
	this.sounds_src = {};

	this.objects = [];
	this.links = {};
}

Levels.prototype.afterLoad = function (){
	
};

Levels.prototype.add = function(obj, name) {
	this.objects.push(obj);
	obj.parent = game;
	if(name){
		this.links[name] = obj;
	}
};