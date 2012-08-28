function Level(){
	this.objects = [];
	this.links = {};

	this.textures_src = {
		"0": this.texturepath + "tutorial/0.png",
		"1": this.texturepath + "tutorial/1.png",
		"2": this.texturepath + "tutorial/2.jpg",
		"3": this.texturepath + "tutorial/3.png",
		"4": this.texturepath + "tutorial/4.png",
		"5": this.texturepath + "tutorial/5.png",
		"6": this.texturepath + "tutorial/6.png",
		"7": this.texturepath + "tutorial/7.jpg",
	};
	this.sounds_src = {
	};
}
Level.prototype = new Levels();

Level.prototype.afterLoad = function (){
	var _this = this;

	game.gui.switchGUI("slideshow")
	game.camera.set(0,0);

	var script = {
		0: {exec:function(){
			game.gui.links.slide.image = game.textures.get("0");
		}},
		25000: {exec:function(){
			game.gui.links.slide.image = game.textures.get("1");
		}},
		31000: {exec:function(){
			game.gui.links.slide.image = game.textures.get("2");
		}},
		36000: {exec:function(){
			game.gui.links.slide.image = game.textures.get("3");
		}},
		58000: {exec:function(){
			game.gui.links.slide.image = game.textures.get("4");
		}},
		78000: {exec:function(){
			game.gui.links.slide.image = game.textures.get("5");
		}},
		95000: {exec:function(){
			game.gui.links.slide.image = game.textures.get("6");
		}},
		104000: {exec:function(){
			game.gui.links.slide.image = game.textures.get("7");
		}},
		107000: {exec:function(){
			game.loadLevel("menu");
		}},
	}
	game.playScript(script);
};

var level = new Level();