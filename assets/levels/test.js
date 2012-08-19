function Level(){

	this.objects = {};

	this.textures_src = {
		
	};

	// this.sounds_src = {
	// 	solarFields: this.musicpath+"Circles_Of_Motion.mp3",
	// };
}
Level.prototype = new Levels();

Level.prototype.afterLoad = function (){
	
};

var level = new Level();