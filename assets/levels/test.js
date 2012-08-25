function Level(){
	this.objects = [];
	this.links = {};

	this.textures_src = {
	};
}
Level.prototype = new Levels();

Level.prototype.afterLoad = function (){
	var _this = this;

	game.gui.switchGUI("in_game");

	var terrain = new Terrain({
		width: game.width, 
		height: game.height,
	});

	this.add( terrain, "terrain" );
};

var level = new Level();