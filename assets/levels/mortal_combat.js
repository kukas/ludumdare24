function Level(){
	this.objects = [];
	this.links = {};

	this.textures_src = {
		skeleton: this.texturepath + "v_hline/skeleton.png",
		troll: this.texturepath + "troll.png",
	};
	this.sounds_src = {
	};
}
Level.prototype = new Levels();

Level.prototype.afterLoad = function (){
	var _this = this;

	game.gui.switchGUI("mortal_combat");

	var slunce = new Background({
		position: new Vector2(game.width/2,game.width),
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

	var ps = new ParticleSystem();
	this.add(ps, "particlesystem");
};

var level = new Level();