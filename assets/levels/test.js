function Level(){
	this.objects = {};

	this.textures_src = {};
}
Level.prototype = new Levels();

Level.prototype.afterLoad = function (){
	game.gui.switchGUI("in_game");
};

var level = new Level();