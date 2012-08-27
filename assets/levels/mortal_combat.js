function Level(){
	this.objects = [];
	this.links = {};

	this.textures_src = {
		skeleton: this.texturepath + "v_hline/skeleton.png",
		troll: this.texturepath + "troll.png",
		stickman: this.texturepath + "stickman.png",
		god: this.texturepath + "god.png",
	};
	this.sounds_src = {
		lets_end_it : this.soundpath+"mortal_combat/lets_end_it.wav",
		finish_him : this.soundpath+"mortal_combat/finish_him.wav",
		combo : this.soundpath+"mortal_combat/combo.wav",
		wound1 : this.soundpath+"mortal_combat/wound1.wav",
		wound2 : this.soundpath+"mortal_combat/wound2.wav",
	};
}
Level.prototype = new Levels();

Level.prototype.afterLoad = function (){
	var _this = this;

	var script = {
		0: {exec:function(){
			game.jukebox.play("lets_end_it");
		}},
		5000: {exec:function(){
			game.gui.links.tutorial.visible = true;
		}},
		6000: {exec:function(){
			game.links.god.playing = true;
		}},
		8000: {exec:function(){
			game.links.darwin.playing = true;
		}},
		15000: {exec:function(){
			game.gui.links.tutorial.visible = false;
		}},

	}
	game.playScript(script);

	// total win
	game.totalWinScript = {
		// After this terrible battle was fought the peace has come. Your enemies are forgotten now, but you still wake every morning with fear of possible return of that big old man… Was he defeated truly forever? Well, maybe once you will know.
		0: {exec:function(){
			game.gui.links.subtitles.changeText("After this terrible battle was fought the peace has come.")
		}},
		5000: {exec:function(){
			game.gui.links.subtitles.changeText("Your enemies are forgotten now,")
		}},
		8000: {exec:function(){
			game.gui.links.subtitles.changeText("but you still wake up every morning with fear of possible return of that big old man…")
		}},
		15000: {exec:function(){
			game.gui.links.subtitles.changeText("Was he defeated truly forever?")
		}},
		18000: {exec:function(){
			game.gui.links.subtitles.changeText("Well, maybe once you will know.")
		}},
		21000: {exec:function(){
			game.gui.links.subtitles.changeText("The end.")
		}},
		24000: {exec:function(){
			game.fade = false;
			game.gui.links.xicht.links.xicht.image.alpha = 0.1;
			game.gui.links.subtitles.y = 50;
			game.gui.links.subtitles.font = "Arial";
			game.gui.links.subtitles.text = [
			"Credits"," ","Programming: Jirka Balhar, Štěpán Marek, Martin Mach"," ",
			"Graphics: Martin Mach, Hynek Bečka"," ", "Game design: Hynek Bečka, Štěpán Marek, Jirka Balhar, Martin Mach"," ",
			"Dubbing: Hynek Bečka, Martin Mach, Jiří Zbytovský"," ",
			"SFX: Jiří Zbytovský"," ","Music: Jan Mesany"," ","Barista: Jan Mesany", " "," ", "Qaterknan (c) 2012"
			]
		}},
	}

	game.zem = game.height/4*3;

	game.gui.switchGUI("mortal_combat");

	var max = 17;
	for(var i=0;i<max;i++){
		var mrak = new Background({
			position: new Vector2(i*((game.width+96)/max), game.zem),
			width: 96,
			height: 50,
			zIndex: 10,
			texture: game.textures.get("cloud"+Math.floor(1+Math.random()*5))
		});
		mrak.speed = 1;
		mrak.tick = function(){
			if(this.position.x > game.width + this.width/2)
				this.position.x = -48;
			this.position.x += this.speed;
		}
		this.add( mrak );
	}

	for(var i=0;i<30;i++){
		var mrak = new Background({
			position: new Vector2(Math.random()*game.width,Math.random()*game.height),
			width: 96,
			height: 50,
			zIndex: -2,
			texture: game.textures.get("cloud"+Math.floor(1+Math.random()*5))
		});
		mrak.speed = 1+Math.random()*5;
		mrak.tick = function(){
			if(this.position.x > game.width + this.width/2)
				this.position.x = -48 - Math.random()*game.width
			this.position.x += this.speed;
		}
		this.add( mrak );
	}

	var options = {
			totalFrames: 10,
			currentAnimation: "standing",
			animations:{
				standing: {
					start: 0,
					end: 1,
					speed: 100
				},
				walking: {
					start: 0,
					end: 4,
					speed: 7
				},
				punch: {
					start: 4,
					end: 6,
					speed: 10,
					cycle: false
				},
				kick: {
					start: 6,
					end: 8,
					speed: 10,
					cycle: false
				},
				cover: {
					start: 8,
					end: 10,
					speed: 10,
					cycle: false
				},
			}
		}
	var god = new Fighter({
		position: new Vector2(200, game.zem - 150),
		texture: game.textures.get("stickman", options),
		name: "god"
	})

	this.add(god, "god");

	options.flip = "x";

	var darwin = new Fighter({
		position: new Vector2(game.width-200, game.zem - 150),
		texture: game.textures.get("stickman", options),
		name: "darwin"
	})
	darwin.AI = "standing";
	darwin.tick = function(){
		if(!this.playing)
			return
		this.ticks++;
		var AIlimit = 16;
		if(this.ticks % AIlimit == 0){

			var AIcommands = ["standing", "move", "back", "attack", "cover"];
			this.AI = AIcommands[ Math.floor(AIcommands.length*Math.random()) ]
			// console.log(this.AI);
			var dist = this.position.x - god.position.x;
			this.stop();
			this.uncover();
			if(dist < 200 && Math.random() > 0.1){
				if(this.health > 65){
					if(Math.random() > 0.4)
						this.AI = "attack";
					else
						this.AI = "cover";
				}
				else if(this.health > 35){
					this.AI = "attack";
				}
				else {
					if(Math.random() > 0.8)
						this.AI = "attack";
					else
						this.AI = "back";
				}
			}
			if(dist > 200 && Math.random() > 0.2){
				this.AI = "move";
			}
		}

		if(this.AI == "standing"){
			this.stop();
		}
		if(this.AI == "move"){
			this.go( new Vector2(-1, 0) );
		}
		if(this.AI == "back"){
			this.go( new Vector2(1, 0) );
		}
		if(this.AI == "attack"){
			if(this.ticks % AIlimit == 1){
				this.attack("kick");
			}
		}
		if(this.AI == "cover"){
			this.cover();
		}

		if(this.health < 25 && !this.finish_him_played){
			this.finish_him_played = true;
			console.log("finish_him", game.gui.links.finish_him)
			game.gui.links.finish_him.visible = true;
			game.jukebox.play("finish_him");
			game.playScript({
				2000: {exec:function(){
					game.gui.links.finish_him.visible = false;
				}}
			});
		}

		this.position.addSelf( this.velocity );
	}

	this.add(darwin, "darwin");

	var ps = new ParticleSystem({
		zIndex: 100
	});
	this.add(ps, "particlesystem");
};

var level = new Level();