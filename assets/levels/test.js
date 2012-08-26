function Level(){
	this.objects = [];
	this.links = {};

	this.textures_src = {
		// hlína
		soil: this.texturepath + "soil.png",
		skull: this.texturepath + "v_hline/skull.png",
		anchor: this.texturepath + "v_hline/anchor.png",
		skeleton: this.texturepath + "v_hline/skeleton.png",
		//background
		nebesa: this.texturepath + "nebesa.png",
		mraky: this.texturepath + "mraky.png",

		bionuke: this.texturepath + "bionuke.png",

		//Budovy
		chapel0: this.texturepath + "rotunda.png",
		chapel1: this.texturepath + "church.png",
		chapel2: this.texturepath + "monastery.png",
		chapel3: this.texturepath + "cathedral.png",
		school0: this.texturepath + "school.png",
		school1: this.texturepath + "grammar school.png",
		school2: this.texturepath + "library.png",
		school3: this.texturepath + "academy.png",
		bonfire: this.texturepath + "hranice.png",
		crossscorpio: this.texturepath + "scorpio.png",
		//Jednotky
		crusader: this.texturepath + "crusader.png",
		troll: this.texturepath + "troll.png",
		gay: this.texturepath + "gay.png",
		gorilla: this.texturepath + "gorilla.png",
		prophet: this.texturepath + "prophet.png",
		professor: this.texturepath + "professor.png",
		missionary: this.texturepath + "missionary.png",
		nun: this.texturepath + "nun.png",
		priest: this.texturepath + "priest.png",
		librarian: this.texturepath + "librarian.png",
		biologist: this.texturepath + "biologist.png",
		//GUI
		button: this.texturepath + "button.jpg",
		button2: this.texturepath + "button2.jpg",
		//Particles
		crossParticle : this.texturepath + "cross.png",
		bookParticle : this.texturepath + "book.png",
		//Zdroje
		gold : this.texturepath + "gold.png",
		faith : this.texturepath + "faith.png",
		knowledge : this.texturepath + "knowledge.png",
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
		biologist : this.soundpath + "zvuky/biolog.wav",
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

	var slunce = new Background({
		position: new Vector2(game.width/2,game.width/3),
		width: 260,
		height: 720,
		zIndex: -10,
		texture: game.textures.get("nebesa")
	});
	slunce.tick = function(){
		this.rotation += 0.0005;
		var sinus = Math.sin(this.rotation/2);
		var sinus3 = sinus*sinus*sinus;
		game.clearColor.r = 100 + (1-Math.abs( sinus3 ))*89;
		game.clearColor.g = 100 + (1-Math.abs( sinus3 ))*155;
		// je to přičtený, protože to zlobilo
		game.night.alpha = Math.abs(sinus3 *0.7)+0.01;
	}
	slunce.relative = true;
	// slunce.rendering = false;
	this.add( slunce, "slunce" );

	// var mraky = new Background({
	// 	position: new Vector2(480,480),
	// 	width: 960,
	// 	height: 960,
	// 	texture: game.textures.get("mraky")
	// });
	// mraky.tick = function(){
	// 	this.rotation += 0.01;
	// }
	// this.add( mraky );

	/*var nuke = new Background({
		position: new Vector2(480,170),
		width: 53*3,
		height: 64*3,
		zIndex: -3,
		texture: game.textures.get("bionuke", {
			totalFrames: 12,
			currentAnimation: "explosion",
			animations:{
				explosion: {
					start: 0,
					end: 12,
					speed: 7
				}
			}
		})
	});
	this.add( nuke );*/

	var terrain = new Terrain({
		width: game.playground.width, 
		height: game.playground.height,
		zIndex: -2,
		texture: game.textures.get("soil")
	});

	this.add( terrain, "terrain" );
	if(game.players.player.side == "creationist"){
		var building = new Chapel({
			position: new Vector2(150,terrain.getHeight(150)-game.textures.get("chapel0").height/2),
			owner: "player",
		});
		this.add(building, "base");
	
		var building2 = new School({
			position: new Vector2(game.playground.width-150,terrain.getHeight(game.playground.width-150)-game.textures.get("chapel0").height/2),
			owner: "enemy",
		});
		this.add(building2);
	}
	else{
		var building = new Chapel({
			position: new Vector2(game.playground.width-150,terrain.getHeight(150)-game.textures.get("chapel0").height/2),
			owner: "enemy",
		});
		this.add(building);
	
		var building2 = new School({
			position: new Vector2(150,terrain.getHeight(game.playground.width-150)-game.textures.get("chapel0").height/2),
			owner: "player",
		});
		this.add(building2, "base");
	}

	var ps = new ParticleSystem();
	this.add(ps, "particlesystem");
	
	zlomekP = 0;
	zlomekE = 0;
	
};

var level = new Level();