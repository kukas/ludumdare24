function Level(){

	this.objects = [];

	this.textures_src = {
		button : this.texturepath + "button.jpg",
	};

	this.sounds_src = {
		logo: this.soundpath+"logo.wav",
	};
}
Level.prototype = new Levels();

Level.prototype.afterLoad = function (){
	game.gui.switchGUI("main_menu");
};

var level = new Level();