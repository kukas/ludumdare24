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

	game.gui.guis.in_game.controls = function(){
		game.eventhandler.addMouseControl(0, function(){
			game.lights.lights[0].position.copy( game.eventhandler.mouse );
			if( game.lights.lights[0].distance > 5 ) game.lights.lights[0].distance -= Math.random()*6;
		})
		game.eventhandler.addMouseControl(1, function(){
			game.lights.lights[0].distance = 10;
		}, function(){
			game.lights.lights[0].distance = 5;
		}, function(){
			game.lights.lights[0].position.copy( game.eventhandler.mouse );
			if( game.lights.lights[0].distance < 120 ) game.lights.lights[0].distance += Math.random()*6;
			if(game.ticks % 2 === 0) game.lights.lights[0].distance += Math.random()*6-3;
			game.links.particlesystem.emit( Particle, 2, {
				width: 4, height: 8,
				shrink: 0.995,
				fade: 0.01,
				life: 5000,
				position: new Vector2().copy(game.eventhandler.mouse),
			}, {
				color: [new Color(0xE01D1D), new Color(0xF79616), new Color(0xF7F416)],
				spin: {min:-0.1, max: 0.1},
				velocity: {
					x: {min: -0.7, max: 0.7},
					y: {min: -0.5, max: -1}
				}
				// life: {min: 2000, max: 4000}
			} )
		});
	}
	var psys = new ParticleSystem({zIndex:1});
	this.add( psys, "particlesystem" );

	game.gui.switchGUI("in_game");

	this.lights = new Lights();

	this.lights.lights.push( new Lamp({
		// position: new Vector2(175, 150),
		distance: 10
	}) );

	for(var i=10; i--;){
		var crate = new Object2D({
			// position: new Vector2(80+Math.floor(i/4)*64, 38+(i%4)*72),
			position: new Vector2(Math.random()*game.width, Math.random()*game.height),
			width: Math.sqrt(3)/2*100,
			height: 0.5*100,
			// rotation: 0,
			rotation: Math.random()*Math.PI*2,
			texture: game.textures.get("crate"),
			diffuse: 0.5,
		});
		crate.tick = function(){
			this.rotation += 0.002
		}
		this.add( crate )
	}
	
};

var level = new Level();