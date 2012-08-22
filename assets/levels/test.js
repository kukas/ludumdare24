function Level(){
	this.objects = [];
	this.links = {};

	this.textures_src = {
		car: this.texturepath + "auto.png",
		rock: this.texturepath + "kamen.png",
	};
}
Level.prototype = new Levels();

Level.prototype.afterLoad = function (){
	var _this = this;

	game.gui.guis.in_game.controls = function(){
		// game.eventhandler.addKeyboardControl(32, undefined, undefined, function(){
		// 	game.links.player.move( new Vector2(1,0) );
		// })
		game.eventhandler.addMouseControl(0, function(){
			game.links.player.move( new Vector2( game.eventhandler.mouse.x - game.links.player.position.x ,game.eventhandler.mouse.y - game.links.player.position.y) );
		})
	}

	game.gui.switchGUI("in_game");

	var player = new Object2D( {
		x: 100,
		y: 100,
		width: 128,
		height: 64,
		texture: game.textures.get("car")
	} );

	player.tick = function(){
		// this.lookAt( game.eventhandler.mouse );
	}

	this.add( player, "player" );

	var rock = new Object2D( {
		x: 256,
		y: 128,
		width: 64,
		height: 64,
		texture: game.textures.get("rock")
	} );

	this.add( rock );
};

var level = new Level();