function Levels(){
	this.texturepath = "./assets/textures/";
	this.soundpath = "./assets/sounds/";
	this.musicpath = "./assets/music/";

	this.textures_src = {};
	this.sounds_src = {};
}

Levels.prototype.afterLoad = function (){
	
};

Levels.prototype.add = function(obj, name) {
	if(name === undefined){
		var last = Object.keys(this.objects).length;
		while( this.objects[last] !== undefined ){
			last++;
		}
		this.objects[ last ] = obj;
	}
	else{
		this.objects[ name ] = obj;
	}
};