function Level(){
	this.objects = [];
	this.links = {};

	this.textures_src = {
		soil: this.texturepath + "soil.png",
		skull: this.texturepath + "skull.png",
		chapel0: this.texturepath + "rotunda.png",
		chapel1: this.texturepath + "church.png",
		chapel2: this.texturepath + "monastery.png",
		chapel3: this.texturepath + "cathedral.png",
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
		librarian : this.soundpath + "zvuky/knihovnice.wav",
		angel : this.soundpath + "zvuky/andel.wav",
		barocoangel : this.soundpath + "zvuky/andelicek.wav",
		biolog : this.soundpath + "zvuky/biolog.wav",
		bishop : this.soundpath + "zvuky/biskup.wav",
		devil : this.soundpath + "zvuky/dabel.wav",
		heretic : this.soundpath + "zvuky/heretic.wav",
		jesus : this.soundpath + "zvuky/jezis.wav",
		trex : this.soundpath + "zvuky/trex.wav",
		teacher : this.soundpath + "zvuky/ucitel.wav",
		matherTerese : this.soundpath + "zvuky/matka_tereza.wav",
		wallace : this.soundpath + "zvuky/wallace.wav",
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
		position: new Vector2(100,terrain.getHeight(100)-game.textures.get("chapel0").height/2),
		owner: "player",
	});
	this.add(building);
	
	var crus1 = new Crusader({
		position: new Vector2(300,0),
		owner:"player",
	});
	this.add(crus1);
	
	var gay = new Gay({
		position: new Vector2(game.width-500,0),
		owner: "enemy",
		// speed: -1,
	})

	this.add( gay );

	var gay = new Gay({
		position: new Vector2(game.width-400,0),
		owner: "enemy",
		// speed: -1,
	})
	this.add( gay );

	var ps = new ParticleSystem();
	this.add(ps, "particlesystem")

};

var level = new Level();