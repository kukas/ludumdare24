function Level(){

	this.objects = [];

	this.textures_src = {
		logo : this.texturepath + "logo.png",
		button : this.texturepath + "button.jpg",
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