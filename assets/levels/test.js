function Level(){
	this.objects = [];
	this.links = {};

	this.textures_src = {
		soil: this.texturepath + "soil.png",
		skull: this.texturepath + "skull.png",
		kaple: this.texturepath + "rotunda.png",
		crusader: this.texturepath + "crusader.png",
		troll: this.texturepath + "troll.png",
	};
}
Level.prototype = new Levels();

Level.prototype.afterLoad = function (){
	var _this = this;

	game.gui.switchGUI("in_game");

	var terrain = new Terrain({
		width: game.width, 
		height: game.height,
		texture: game.textures.get("soil")
	});

	this.add( terrain, "terrain" );
	
	var building = new Building({
		position: new Vector2(100,terrain.getHeight(100)-game.textures.get("kaple").height/2),
		texture: game.textures.get("kaple"),
		width:game.textures.get("kaple").width,
		height:game.textures.get("kaple").height,
		actions:"hello, world!",
		owner: "player",
	});
	this.add(building);
	
	var unit = new Troll({
		position:new Vector2(0,terrain.getHeight(0)),
		owner: "player",
	});
	this.add( unit );
	
};

var level = new Level();