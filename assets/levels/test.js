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
		nun: this.texturepath + "nun.png",
		priest: this.texturepath + "priest.png",
		button: this.texturepath + "button.jpg",
		button2: this.texturepath + "button2.jpg",
	};
	
	this.sounds_src = {
		gorilla : this.soundpath+"zvuky/opice.wav",
		missionary : this.soundpath + "zvuky/misionar.wav",
		professor : this.soundpath + "zvuky/profesor.wav",
		prophet : this.soundpath + "zvuky/prorok.wav",
		gay : this.soundpath + "zvuky/homosexual.wav",
		crusader : this.soundpath + "zvuky/krizak.wav",
		nun : this.soundpath + "zvuky/jeptiska.wav",
		priest : this.soundpath + "zvuky/knez.wav",
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
	crus1.spawnSound.play();
	this.add(crus1);
	
	var gay = new Gay({
		position: new Vector2(game.width,0),
		owner: "enemy",
		// speed: -1,
	})
	gay.spawnSound.play();
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