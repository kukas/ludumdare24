function Level(){
	this.objects = [];
	this.links = {};

	this.textures_src = {
		soil: this.texturepath + "soil.png",
		skull: this.texturepath + "skull.png",
	};
}
Level.prototype = new Levels();

Level.prototype.afterLoad = function (){
	var _this = this;

	game.gui.guis.in_game.controls = function(){
		game.eventhandler.addMouseControl(3, function(){
			console.log("ahoj")
		})
	}
	game.gui.switchGUI("in_game");

	var terrain = new Terrain({
		width: game.width, 
		height: game.height,
		texture: game.textures.get("soil")
	});

	this.add( terrain, "terrain" );
	var unit = new Unit({
		position: new Vector2(0,0),
		width:18,
		height:18,
		texture: game.textures.get("skull")
	})
	this.add( unit );
};

var level = new Level();