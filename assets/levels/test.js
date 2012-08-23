function Level(){
	this.objects = [];
	this.links = {};

	this.textures_src = {
		crate: this.texturepath + "crate.jpg",
	};
}
Level.prototype = new Levels();

Level.prototype.afterLoad = function (){
	var _this = this;

	// game.eventhandler.addKeyboardControl()
	game.gui.guis.in_game.controls = function(){
		game.eventhandler.addMouseControl(0, function(){
			game.lights.lights[0].position.copy( game.eventhandler.mouse )
		})
	}

	game.gui.switchGUI("in_game");

	this.lights = new Lights();

	this.lights.lights.push( new Lamp({
		position: new Vector2(150, 150),
		distance: 200
	}) );

	for(var i=20; i--;){
		var crate = new Object2D({
			position: new Vector2(Math.random()*game.width, Math.random()*game.height),
			width: Math.random()*48+16,
			height: Math.random()*48+16,
			texture: game.textures.get("crate")
		});
		this.add( crate )
	}
	
};

var level = new Level();