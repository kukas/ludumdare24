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
		//mraky
		cloud1: this.texturepath + "clouds/mrak1.png",
		cloud2: this.texturepath + "clouds/mrak2.png",
		cloud3: this.texturepath + "clouds/mrak3.png",
		cloud4: this.texturepath + "clouds/mrak4.png",
		cloud5: this.texturepath + "clouds/mrak5.png",

		bionuke: this.texturepath + "bionuke.png",
		holynuke: this.texturepath + "holynuke.png",


		//Budovy
		chapel0: this.texturepath + "rotunda.png",
		chapel1: this.texturepath + "church.png",
		chapel2: this.texturepath + "monastery.png",
		chapel3: this.texturepath + "cathedral.png",
		dino: this.texturepath + "dino.png",
		school0: this.texturepath + "school.png",
		school1: this.texturepath + "grammar_school.png",
		school2: this.texturepath + "library.png",
		school3: this.texturepath + "academy.png",
		bonfire: this.texturepath + "hranice.png",
		crossscorpio: this.texturepath + "scorpio.png",
		galapags: this.texturepath + "galapagy.png",
		museum: this.texturepath + "muzeum.png",
		bookmine: this.texturepath + "bookmine.png",
		gaybay: this.texturepath + "gaybay.png",
		painting: this.texturepath + "painting.png",
		lab: this.texturepath + "lab.png",
		zpovednice: this.texturepath + "zpovednice.png",
		golgota: this.texturepath + "golgota.png",
		altar: this.texturepath + "altar.png",
		portal: this.texturepath + "portal.png",
		slum: this.texturepath + "slum.png",

		holyfire: this.texturepath + "holyfire.png",
		machinegun: this.texturepath + "machinegun.png",

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
		teacher: this.texturepath + "teacher.png",
		cherub: this.texturepath + "cherub.png",
		bishop: this.texturepath + "bishop.png",
		heretic: this.texturepath + "heretic.png",
		angel: this.texturepath + "angel.png",
		devil: this.texturepath + "devil.png",
		terese: this.texturepath + "tereza.png",
		wallace: this.texturepath + "wallace.png",
		trex: this.texturepath + "trex.png",
		jesus: this.texturepath + "jesus.png",
		
		//GUI
		button: this.texturepath + "button.jpg",
		button2: this.texturepath + "button2.jpg",
		button_off: this.texturepath + "button_off.jpg",

		upgrade: this.texturepath + "upgrade.png",

		layout: this.texturepath + "menu/background.png",
		layout_bg: this.texturepath + "menu/white_bg.png",
		// buttons
		b_stop: this.texturepath + "menu/stop.png",
		b_backward: this.texturepath + "menu/back.png",
		b_forward: this.texturepath + "menu/front.png",

		b_gold: this.texturepath + "menu/money.png",
		b_knowledge: this.texturepath + "menu/inteligence.png",
		b_faith: this.texturepath + "menu/faith.png",

		b_laboratory: this.texturepath + "menu/laboratory.png",
		b_gaybar: this.texturepath + "menu/geybar.png",
		b_portal: this.texturepath + "menu/devilgate.png",
		b_museum: this.texturepath + "menu/muzeum.png",
		b_galapags: this.texturepath + "menu/galapagy.png",
		b_machinegun: this.texturepath + "menu/kulomet.png",
		b_book: this.texturepath + "menu/book.png",

		b_holyfire: this.texturepath + "menu/hellfire.png",
		b_crossscorpion: this.texturepath + "menu/crossscorpion.png",
		b_bonfire: this.texturepath + "menu/bonfire.png",
		b_picture: this.texturepath + "menu/baroquepicture.png",
		b_confessor: this.texturepath + "menu/confessor.png",
		b_altar: this.texturepath + "menu/altar.png",
		b_slum: this.texturepath + "menu/slum.png",
		b_golgota: this.texturepath + "menu/golgota.png",
		// unit icons
		b_andelicek: this.texturepath + "unit_icons/andelicek.png",
		b_biskup: this.texturepath + "unit_icons/biskup.png",
		b_jezis: this.texturepath + "unit_icons/jezis.png",
		b_krizak: this.texturepath + "unit_icons/krizak.png",
		b_prorok: this.texturepath + "unit_icons/prorok.png",
		b_andel: this.texturepath + "unit_icons/andel.png",
		b_jeptiska: this.texturepath + "unit_icons/jeptiska.png",
		b_knez: this.texturepath + "unit_icons/knez.png",
		b_misionar: this.texturepath + "unit_icons/misionar.png",
		b_tereza: this.texturepath + "unit_icons/tereza.png",

		b_biolog: this.texturepath + "unit_icons2/biolog.png",
		b_dino: this.texturepath + "unit_icons2/dino.png",
		b_gorila: this.texturepath + "unit_icons2/gorila.png",
		b_knihovnice: this.texturepath + "unit_icons2/knihovnice.png",
		b_ucitel: this.texturepath + "unit_icons2/ucitel.png",
		b_dabel: this.texturepath + "unit_icons2/dabel.png",
		b_gay: this.texturepath + "unit_icons2/gay.png",
		b_heretic: this.texturepath + "unit_icons2/heretic.png",
		b_profesor: this.texturepath + "unit_icons2/profesor.png",
		b_wallace: this.texturepath + "unit_icons2/wallace.png",
		//Particles
		basicParticle : this.texturepath + "basicparticle.png",
		crossParticle : this.texturepath + "cross.png",
		bookParticle : this.texturepath + "book.png",
		ruzenecParticle : this.texturepath + "ruzenec.png",
		kridaParticle : this.texturepath + "krida.png",
		crossScorpioParticle : this.texturepath + "kriz.png",
		fireball : this.texturepath + "koule.png",
		sancWater : this.texturepath + "sancwater.png",
		litajici_zaba : this.texturepath + "litajici_zaba.png",
		bullet : this.texturepath + "bullet.png",
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
		cherub : this.soundpath + "zvuky/andelicek.wav",
		biologist : this.soundpath + "zvuky/biolog.wav",
		bishop : this.soundpath + "zvuky/biskup.wav",
		devil : this.soundpath + "zvuky/dabel.wav",
		heretic : this.soundpath + "zvuky/heretic.wav",
		jesus : this.soundpath + "zvuky/jezis.wav",
		trex : this.soundpath + "zvuky/trex.wav",
		teacher : this.soundpath + "zvuky/ucitel.wav",
		matherTerese : this.soundpath + "zvuky/matka_tereza.wav",
		wallace : this.soundpath + "zvuky/wallace.wav",

		// song : this.musicpath + "song.mp3",
	};

	if(jQuery.browser.mozilla){
		this.sounds_src.song = this.musicpath + "song.mp3";
	}
}
Level.prototype = new Levels();

Level.prototype.afterLoad = function (){
	var _this = this;
	// game.jukebox.play("song");
	game.buildingCreationist = [
		{
			icon: "b_holyfire",
			canBuild: true,
			description: {
				name: "Holy flame",
				spec: 10,
				description: "When someone unclean would step on mark of holy fire, he will be destroyed by a holy nuke. Simple.",
				quote: " "
			},
			exec: function(){
				if(!game.links.base.build(Holyfire)){
					console.log("not enough resources");
				}
			}
		},
		{
			icon: "b_crossscorpion",
			canBuild: true,
			description: {
				name: "Cross Scorpion",
				spec: 15,
				description: "It throws huge crosses. Yep. All unbelievers will know the pain if you will build this turret.",
				quote: " "
			},
			exec: function(){
				if(!game.links.base.build(CrossScorpio)){
					console.log("not enough resources");
				}
			}
		},
		{
			icon: "b_bonfire",
			canBuild: true,
			description: {
				name: "Bonfire",
				spec: 20,
				description: "With this “building” you can slow enemies movement.",
				quote: " "
			},
			exec: function(){
				if(!game.links.base.build(Bonfire)){
					console.log("not enough resources");
				}
			}
		},
		{
			icon: "b_picture",
			canBuild: true,
			description: {
				name: "Baroque paint",
				spec: 50,
				description: "This magical paint is guarded by two golden cherubs. With the power of faith they can come to life and explode in enemies lines.",
				quote: " "
			},
			exec: function(){
				if(!game.links.base.build(Painting)){
					console.log("not enough resources");
				}
			}
		},
		{
			icon: "b_confessor",
			canBuild: false,
			description: {
				name: "Confessory",
				spec: 100,
				description: "This is where bishops and prophets are trained. Their training is hard, but at the end you have powerful units.",
				quote: " "
			},
			exec: function(){
				if(!game.links.base.build(Confessor)){
					console.log("not enough resources");
				}
			}
		},
		{
			icon: "b_altar",
			canBuild: false,
			description: {
				name: "Altar",
				spec: 100,
				description: "On the holy altar the angels are summoned. From the very haven they came to defend all faithful.",
				quote: " "
			},
			exec: function(){
				if(!game.links.base.build(Altar)){
					console.log("not enough resources");
				}
			}
		},
		{
			icon: "b_slum",
			canBuild: false,
			description: {
				name: "Slum",
				spec: 120,
				description: "Mother Teresa works here. Here she makes hers bullets, prepare to battles and stuff.",
				quote: " "
			},
			exec: function(){
				if(!game.links.base.build(Slum)){
					console.log("not enough resources");
				}
			}
		},
		{
			icon: "b_golgota",
			canBuild: false,
			description: {
				name: "Golgota",
				spec: 200,
				description: "This is place where Jesus died and also place where his cross stayed. Now he came back. With cross. And it is super effective against all sinners.",
				quote: " "
			},
			exec: function(){
				if(!game.links.base.build(Golgota)){
					console.log("not enough resources");
				}
			}
		},
	];
	

	game.buildingAtheists = [
		{ 
			icon: "b_book",
			canBuild: true,
			description: {
				name: "Explosive book",
				spec: 10,
				description: "Classic explosive mine.",
				quote: " "
			},
			exec: function(){
				if(!game.links.base.build(Bookmine)){
					console.log("not enough resources");
				}
			}
		},
		{ 
			icon: "b_machinegun",
			canBuild: true,
			description: {
				name: "Machinegun",
				spec: 15,
				description: "Classic defensive turret.",
				quote: " "
			},
			exec: function(){
				if(!game.links.base.build(Machinegun)){
					console.log("not enough resources");
				}
			}
		},
		{ 
			icon: "b_dino",
			canBuild: true,
			description: {
				name: "Dino bones",
				spec: 20,
				description: "Use it to block your enemies. Than you can shoot at them, while they are trying to prove this is actually dragon, not the dino.",
				quote: " "
			},
			exec: function(){
				if(!game.links.base.build(Dino)){
					console.log("not enough resources");
				}
			}
		},
		{ 
			icon: "b_laboratory",
			canBuild: true,
			description: {
				name: "Laboratory",
				spec: 50,
				description: "If you are going to need some explosive and poisoned stuff, use this building.",
				quote: " "
			},
			exec: function(){
				if(!game.links.base.build(Laboratory)){
					console.log("not enough resources");
				}
			}
		},
		{ 
			icon: "b_gaybar",
			canBuild: false,
			description: {
				name: "Gay bar",
				spec: 100,
				description: "Wohoo! Here you can have lot of fun. And of course, this is the place where you can find almost best warriors in your realm, gays and heretics.",
				quote: " "
			},
			exec: function(){
				if(!game.links.base.build(GayBay)){
					console.log("not enough resources");
				}
			}
		},
		{ 
			icon: "b_portal",
			canBuild: false,
			description: {
				name: "Portal",
				spec: 100,
				description: "Muhuhuha! Unholy powers have come to your help! From this wound in reality marches legions of daemons!",
				quote: " "
			},
			exec: function(){
				if(!game.links.base.build(Portal)){
					console.log("not enough resources");
				}
			}
		},
		{ 
			icon: "b_museum",
			canBuild: false,
			description: {
				name: "Museum",
				spec: 200,
				description: "This mighty building can show the world the most fearsome creature that ever was! T-REX! All should be terrified by his wrath!",
				quote: " "
			},
			exec: function(){
				if(!game.links.base.build(Museum)){
					console.log("not enough resources");
				}
			}
		},
		{ 
			icon: "b_galapags",
			canBuild: false,
			description: {
				name: "Galapagos islands",
				spec: 120,
				description: "Good place to find some real scientist. Like Wallace. A man with flying frogs.",
				quote: " "
			},
			exec: function(){
				if(!game.links.base.build(Galapags)){
					console.log("not enough resources");
				}
			}
		},
	];

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
		// this.rotation += 0.01;
		var sinus = Math.sin(this.rotation/2);
		var sinus3 = sinus*sinus*sinus;
		game.clearColor.r = 100 + (1-Math.abs( sinus3 ))*89;
		game.clearColor.g = 100 + (1-Math.abs( sinus3 ))*155;
		// je to přičtený, protože to zlobilo
		game.night.alpha = Math.abs(sinus3 *0.7)+0.01;
	}
	slunce.relative = true;
	this.add( slunce, "slunce" );
	console.log(this.links);

	for(var i=0;i<10;i++){
		var mrak = new Background({
			position: new Vector2(Math.random()*game.playground.width,Math.random()*game.height/3),
			// position: new Vector2(10,10),
			width: 96,
			height: 50,
			zIndex: -2,
			texture: game.textures.get("cloud"+Math.floor(1+Math.random()*5))
		});
		mrak.speed = Math.random()*0.5
		mrak.tick = function(){
			if(this.position.x > game.playground.width + this.width/2)
				this.position.x = -48 - Math.random()*game.playground.width
			this.position.x += this.speed;
		}
		this.add( mrak );
	}

	var terrain = new Terrain({
		width: game.playground.width, 
		height: game.playground.height,
		zIndex: -2,
		texture: game.textures.get("soil")
	});

	this.add( terrain, "terrain" );
	if(game.players.player.side == "creationist"){
		var building = new Chapel({
			position: new Vector2(200,terrain.getHeight(200)-game.textures.get("chapel0").height/2),
			owner: "player",
		});
		this.add(building, "base");
	
		var building2 = new School({
			position: new Vector2(game.playground.width-200,terrain.getHeight(game.playground.width-200)-game.textures.get("school0").height/2),
			owner: "enemy",
		});
		building2.selectable = false;
		this.add(building2);
		game.ai.property.push(building2);
		
		game.ai.buildings = [Bookmine,Bookmine,Dino,Laboratory,GayBay,Portal,Museum,Galapags];
		game.ai.availableUnits = [Gorilla,Teacher,Librarian,Professor];
	}
	else{
		var building = new Chapel({
			position: new Vector2(game.playground.width-200,terrain.getHeight(200)-game.textures.get("chapel0").height/2),
			owner: "enemy",
		});
		building.selectable = false;
		this.add(building);
	
		var building2 = new School({
			position: new Vector2(200,terrain.getHeight(game.playground.width-200)-game.textures.get("chapel0").height/2),
			owner: "player",
		});
		this.add(building2, "base");
		game.ai.property.push(building);
		game.ai.buildings = [Holyfire,CrossScorpio,Bonfire,Painting,Confessor,Altar,Slum,Golgota];
		game.ai.availableUnits = [Missionary,Priest,Nun,Crusader];
	}

	//var miss = new Missionary({position:new Vector2(1000,terrain.getHeight(1000)),owner:"player"});
	//this.add(miss);
	
	var ps = new ParticleSystem();
	this.add(ps, "particlesystem");
	
	zlomekP = 0;
	zlomekE = 0;
	
	game.ai.active = true;
	console.log(game.ai)
};

var level = new Level();