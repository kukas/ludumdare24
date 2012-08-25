function Level(){
	this.objects = [];
	this.links = {};

	this.textures_src = {
		soil: this.texturepath + "soil.png",
		skull: this.texturepath + "skull.png",
		kaple: this.texturepath + "rotunda.png",
		crusader: this.texturepath + "crusader.png",
		troll: this.texturepath + "troll.png",
		button: this.texturepath + "button.png",
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
	
	var unit = new Unit({
		position: new Vector2(0,0),
		width:180,
		height:180,
		speed:2,
		texture: game.textures.get("skull"),
		owner: "player",
	});
	unit.select = true;
	this.add( unit );
	
	var unit2 = new Unit({
		position: new Vector2(game.width,0),
		width:46,
		height:64,
		texture: game.textures.get("crusader", {animation:{frames:6, speed:7}, flip: "x"}),
		owner: "enemy",
		speed: -1,
	})
	this.add( unit2 );
};

var level = new Level();