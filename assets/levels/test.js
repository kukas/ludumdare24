<<<<<<< HEAD
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

=======
function Level(){
	this.objects = [];
	this.links = {};

	this.textures_src = {
		soil: this.texturepath + "soil.png",
		skull: this.texturepath + "skull.png",
		kaple: this.texturepath + "rotunda.png",
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
	});
	this.add(building);
	
	var unit = new Unit({
		position: new Vector2(0,0),
		width:18,
		height:18,
		texture: game.textures.get("skull")
	})
	this.add( unit );
};

>>>>>>> 01376d6f8324ea35d8af3f9da2dc1878ea6e9cd5
var level = new Level();