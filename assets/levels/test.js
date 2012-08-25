function Level(){
	this.objects = [];
	this.links = {};

	this.textures_src = {
		soil: this.texturepath + "soil.png",
		skull: this.texturepath + "skull.png",
		kaple: this.texturepath + "rotunda.png",
		crusader: this.texturepath + "crusader.png",
		troll: this.texturepath + "troll.png",
		gay: this.texturepath + "gay.png",
		gorilla: this.texturepath + "gorilla.png",
		prophet: this.texturepath + "prophet.png",
		professor: this.texturepath + "professor.png",
		missionary: this.texturepath + "missionary.png",
		button: this.texturepath + "button.jpg",
		button2: this.texturepath + "button2.jpg",
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
	
	var building = new Chapel({
		position: new Vector2(100,terrain.getHeight(100)-game.textures.get("kaple").height/2),
		actions:"hello, world!",
		owner: "player",
	});
	this.add(building);
	
	var crus1 = new Crusader({
		position: new Vector2(300,0),
		owner:"player",
	});
	this.add(crus1);
	
	var gay = new Gay({
		position: new Vector2(game.width,0),
		owner: "enemy",
		// speed: -1,
	})

	this.add( gay );


	var ps = new ParticleSystem();
	ps.tick = function(){
		ps.emit(Particle, 2, {
			position: new Vector2(90,120)
		}, {
			velocity: {
				x: {min: -1, max: 1},
				y: {min: -1, max: 1}
			}
		})
	}
	this.add(ps)

};

var level = new Level();