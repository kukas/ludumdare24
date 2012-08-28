function Level(){

	this.objects = [];

	this.textures_src = {
		logo : this.texturepath + "logo.png",
		button_creationists: this.texturepath + "creationists.png",
		button_evolucionists: this.texturepath + "evolucionists.png",
		button_tut: this.texturepath + "tut.png",
	};

	this.sounds_src = {
		logo: this.soundpath+"logo.wav",
	};
}
Level.prototype = new Levels();

Level.prototype.afterLoad = function (){
	game.gui.switchGUI("logo");
};

var level = new Level();