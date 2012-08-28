function Level(){
	this.objects = [];
	this.links = {};

	this.textures_src = {
		"2": this.texturepath + "tutorial/2.jpg",
		"3": this.texturepath + "tutorial/3.png",
		"4": this.texturepath + "tutorial/4.jpg",
		"5": this.texturepath + "tutorial/5.jpg",
		"6": this.texturepath + "tutorial/6.jpg",
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
			game.gui.links.slide.image = game.textures.get("2");
		}},
		3000: {exec:function(){
			game.gui.links.slide.image = game.textures.get("3");
		}},
		16000: {exec:function(){
			game.gui.links.slide.image = game.textures.get("4");
		}},
		24000: {exec:function(){
			game.gui.links.slide.image = game.textures.get("5");
		}},
		30000: {exec:function(){
			game.gui.links.slide.image = game.textures.get("6");
		}},
		34000: {exec:function(){
			game.gui.links.slide.image = game.textures.get("7");
		}},
		38000: {exec:function(){
			game.loadLevel("menu");
		}},
	}
	game.playScript(script);
};

var level = new Level();