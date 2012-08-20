function Level(){

	this.objects = {};

	this.textures_src = {
		funky_background: this.texturepath + "background.png",
		funky_button: this.texturepath + "button.png",
		logo: this.texturepath + "logo.png",
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