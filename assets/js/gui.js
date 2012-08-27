function GUIObject(){
	this.creationTime = new Date().getTime();

	this.x = 0;
	this.y = 0;
	this.width = 0;
	this.height = 0;

	this.ticks = 0;

	this.mouseIn = false;

	this.parent = false;
	this.children = [];
	this.links = {};
}
GUIObject.prototype.add = function( obj, name ) {
	obj.parent = this;
	this.children.push( obj );

	if(name){
		this.links[name] = obj;
	}
};


GUIObject.prototype.remove = function(obj){
	var search = this.children.indexOf(obj);
	if(search > -1){
		this.children.splice(search, 1);
	}

	for (var i = 0; i < this.links.length; i++) {
		if(this.links[i] == obj)
			delete this.links[i];
	};
};

GUIObject.prototype.get = function( name ) {
	return this.links[name];
};

GUIObject.prototype.tickChildren = function (){
	if(this.mouseIn && this.onMouseIn){
		this.onMouseIn();
	}
	for (var i in this.children){
		this.children[i].tick();
		if(this.children[i].tickChildren)
			this.children[i].tickChildren();
	};
};

GUIObject.prototype.renderChildren = function (ctx){
	ctx.save();
	ctx.translate(this.x, this.y);
	for (var i in this.children){
		this.children[i].render(ctx);
		if(this.children[i].renderChildren)
			this.children[i].renderChildren(ctx);
	};
	ctx.restore();
};
GUIObject.prototype.tick = function (){
};

GUIObject.prototype.render = function (ctx){
};
GUIObject.prototype.mousehandler = function(x,y,type) {
	this.mouseIn = false;
	if(this[type] || (type == "onMouseMove" && (this.onMouseIn || this.onMouseOut)) ){
		if( x > this.x && x < this.x+this.width &&
			y > this.y && y < this.y+this.height){
			if(type != "onMouseMove")
				this[type]();
			else if(this.onMouseIn){
				this.mouseIn = true;
				// this.onMouseIn();
			}
		}
		else if(this.onMouseOut){
			this.onMouseOut();
		}
	}
	for (var i = 0; i < this.children.length; i++){
		this.children[i].mousehandler(x-this.x,y-this.y,type);
	}
};

function GUI(){
	GUIObject.call(this);
	var _this = this;

	this.activeGUI = false;

	function Button(x, y, options){
		GUIObject.call(this);

		this.x = x === undefined ? 0 : x;
		this.y = y === undefined ? 0 : y;
		this.width = options.width === undefined ? 60 : options.width;
		this.height = options.height === undefined ? 30 : options.height;
		this.color = options.color === undefined ? "#000" : options.color;
		this.visible = options.visible === undefined ? true : options.visible;

		this.onMouseDown = options.onMouseDown;
		this.onMouseUp = options.onMouseUp;
		this.onMouseIn = options.onMouseIn;
		this.onMouseOut = options.onMouseOut;
		this.mouseIn = false;

		return this;
	};
	Button.prototype = new GUIObject();
	Button.prototype.render = function(ctx) {
		if(this.visible){
			ctx.fillStyle = this.color;
			ctx.fillRect(this.x, this.y, this.width, this.height);
		}
	};

	function Text(options){
		GUIObject.call(this);

		this.x = options.x === undefined ? 0 : options.x;
		this.y = options.y === undefined ? 0 : options.y;

		this.value = options.value;
		this.text = options.text === undefined ? [] : options.text;
		this.color = options.color === undefined ? "#FFF" : options.color;
		this.blink = options.blink === undefined ? false : options.blink;
		this.size = options.size === undefined ? 16 : options.size;
		this.lineSpacing = options.lineSpacing === undefined ? 1 : options.lineSpacing;
		this.font = options.font === undefined ? "Verdana" : options.font;
		this.weight = options.weight === undefined ? 400 : options.weight;
		this.shadow = options.shadow === undefined ? false : options.shadow;

		this.visible = options.visible === undefined ? true : options.visible;

		var ctx = document.createElement("canvas").getContext("2d");
		ctx.font = this.weight + " " + this.size + "px " + this.font;

		// zalamování textu
		if(this.text.length < 1){
			if(options.width){
				this.width = options.width;

				var pole_slov = this.value.split(" ");
				var last_slovo = 0;
				while(last_slovo < pole_slov.length){
					var pokus_radek = pole_slov[last_slovo];
					novy_radek = pokus_radek;
					for(var i = last_slovo+1; i < pole_slov.length; i++){
						pokus_radek += " " + pole_slov[i];
						if(ctx.measureText(pokus_radek).width > this.width){
							break;
						}
						novy_radek = pokus_radek;
					}
					last_slovo = i;
					this.text.push(novy_radek);
				}
			}
			else {
				this.width = ctx.measureText(this.value).width;
				this.text.push(this.value);
			}
		}
		else {
			if(options.width){
				this.width = options.width;
			}
			else {
				this.width = ctx.measureText(this.text[0]).width;
			}
		}
		// var m_size = this.size;
		
		this.textHeight = this.text.length * this.size + (this.text.length - 1) * this.lineSpacing;
		this.height = options.height === undefined ? this.textHeight : options.height;

		this.align = options.align === undefined ? "left" : options.align;
		if(options.valign){
			this.valign = options.valign;
			if(this.valign == "center"){
				// poněkud zvláštní hack: this.size není přesná výška řádku, zatímco šířka dvou E za sebou je...
				// pokud tedy chci umístit text PŘESNĚ doprostřed, musím zahladit tento rozdíl.
				var ee_size = ctx.measureText("ee").width;
				this.y += (this.height-this.textHeight)/2 - (ee_size - this.size)/2;
			}
			else if(this.valign == "bottom")
				this.y += this.height-this.textHeight;
		}
	}
	Text.prototype = new GUIObject();
	Text.prototype.changeText = function(text) {
		this.value = text;
		this.text = [];

		this.text.push(this.value);
	};
	Text.prototype.render = function(ctx) {
		if(!this.visible)
			return
		ctx.font = this.weight + " " + this.size + "px " + this.font;

		if(this.blink){
			if(game.ticks % 10 > 0 && game.ticks % 10 < 5) 
				ctx.fillStyle = this.color;
			else
				ctx.fillStyle = this.blink;
		}
		else
			ctx.fillStyle = this.color;

		var spacing = 0;
		for(var i = 0; i < this.text.length; i++){
			var x = this.x;
			var y = this.y + (i+1) * (this.size) + i * spacing;
			if(this.align == "center")
				x += (this.width - ctx.measureText(this.text[i]).width)/2;
			if(this.align == "right")
				x += this.width - ctx.measureText(this.text[i]).width;

			if(this.shadow){
				ctx.shadowBlur = this.shadow.blur || 0;
				ctx.shadowColor = this.shadow.color || "rgba(0, 0, 0, 0)";
				ctx.shadowOffsetX = this.shadow.offsetX || 0;
				ctx.shadowOffsetY = this.shadow.offsetY || 0;
			}
			ctx.fillText(this.text[i], x, y );
			if(this.shadow){
				ctx.shadowBlur = 0;
				ctx.shadowColor = "rgba(0, 0, 0, 0)";
				ctx.shadowOffsetX = 0;
				ctx.shadowOffsetY = 0;
			}

			spacing = this.lineSpacing;
		}
	};
	function Texture(image, options){
		GUIObject.call(this);
		options = options === undefined ? {} : options;

		this.x = options.x === undefined ? 0 : options.x;
		this.y = options.y === undefined ? 0 : options.y;
		this.width = options.width === undefined ? 0 : options.width;
		this.height = options.height === undefined ? 0 : options.height;

		this.image = image;
		this.repeat = options.repeat === undefined ? false : options.repeat;

		this.scale = options.scale === undefined ? 1 : options.scale;
		this.opacity = options.opacity === undefined ? 1 : options.opacity;
	}
	Texture.prototype = new GUIObject();
	Texture.prototype.render = function(ctx){
		ctx.save();
		ctx.globalAlpha = this.opacity;
		if(this.repeat){
			if(this.scale !== 1){
				ctx.save();
				ctx.scale(this.scale, this.scale);
			}
			ctx.fillStyle = ctx.createPattern(this.image.image, "repeat");
			ctx.fillRect(this.x, this.y, this.width, this.height);
			if(this.scale !== 1){
				ctx.restore();
			}
		}
		else {
			this.image.draw(ctx, this.x, this.y, this.width, this.height);
		}
		ctx.restore();
	}
	
	this.guis = {
		loading_screen: {
			objects: function(){
				// var objects = [];
				// pozadí
				// var pozadi = new Button(0, 0, {width: game.width, height: game.height, color: "#000" });
				// _this.add( pozadi );

				// loading text
				_this.add( new Text({y:-40,width: game.width, height: game.height, size: 32, value: "loading...", align:"center", valign:"center", color: "#000" }) );


				// loading bar (maximum: 100px)
				_this.add( new Button(game.width/2-50, game.height/2-5, {width: 0, height: 10, color: "#16C739" }), "loading_bar" );

				// return objects;
			},
			setPercentage: function(_perc){
				perc = _perc > 100 ? 100 : _perc;
				_this.get("loading_bar").width = perc;
			}
		},
		logo: {
			objects: function(){
				logo = new Texture(game.textures.get("logo"), {x: (game.width-354)/2, y: (game.height-270)/2, width: 354, height: 270, opacity: 0});
				logo.tick = function(){
					var time = new Date().getTime() - this.creationTime;

					if(this.opacity < 1 && time < 2000){
						this.opacity += 0.02;
					}
					else if(time > 2000){
						this.opacity -= 0.02;
					}

					if(this.opacity < 0){
						this.opacity = 0;
						_this.switchGUI("main_menu");
					}
				}
				_this.add( logo );
			},
			controls: function(){
				// přeskočí úvodní animaci
				game.eventhandler.addKeyboardControl(27, undefined, function(){
					game.gui.children[0].opacity = -1;
				});
				game.eventhandler.addMouseControl(1, undefined, function(){
					game.gui.children[0].opacity = -1;
				});
			},
			afterload: function(){
				game.jukebox.play("logo");
			}
		},
		main_menu: {
			objects: function(){
			},
			controls: function(){
				_this.addControls();
			}
		},
		mortal_combat: {
			objects: function(){
				var healthbarPlayer = new Button( game.width/2 + 30, 10, {
					width: 300,
					height: 10
				} );
				healthbarPlayer.add( new Button(0,0,{
					width: 100,
					height: 10,
					color: "#0F0"
				}), "hp" )

				healthbarPlayer.set = function(perc){
					perc = perc > 0 ? perc : 0;

					this.links.hp.width = perc*300;

					if(perc < 0.5)
						this.links.hp.color = "#FADE25";

					if(perc < 0.2)
						this.links.hp.color = "#E01414";
				}
				healthbarPlayer.set(1);

				_this.add(healthbarPlayer, "hp_player");

				var healthbarEnemy = new Button( game.width/2 - 30 - 300, 10, {
					width: 300,
					height: 10
				} );
				healthbarEnemy.add( new Button(0,0,{
					width: 100,
					height: 10,
					color: "#0F0"
				}), "hp" );

				healthbarEnemy.set = function(perc){
					perc = perc > 0 ? perc : 0;

					this.links.hp.width = perc*300;
					this.links.hp.x = this.width - this.links.hp.width;

					if(perc < 0.5)
						this.links.hp.color = "#FADE25";

					if(perc < 0.2)
						this.links.hp.color = "#E01414";
				}
				healthbarEnemy.set(1);

				_this.add(healthbarEnemy, "hp_enemy");


				var nameGod = new Text( {
					x: 10, 
					y: 30,
					value: "GOD",
					color: "#000",
					font: "PlainBlackNormal",
					size: 50,
				} );

				_this.add(nameGod);

				var nameDar = new Text( {
					x: 0, 
					y: 30,
					width: game.width-10,
					value: "DARWIN",
					color: "#000",
					font: "CarbonTypeRegular",
					align: "right",
					size: 50,
				} );

				_this.add(nameDar);

				var finish_him = new Text( {
					y: game.height/2-50,
					width: game.width-10,
					value: "FINISH HIM",
					color: "#000",
					font: "akashiregular",
					visible: false,
					align: "center",
					blink: "#F00",
					size: 130,
				} );

				_this.add(finish_him, "finish_him");

				var xicht = new Button( game.width/2 - 75*2,20, {
					width: 75*4,
					height:95*4,
					visible: false,
				} );
				xicht.tick = function(){
					this.ticks += 1;
					this.y += Math.sin(this.ticks/20)/5;
				}
				_this.add(xicht, "xicht");

				var xichtTex = new Texture( game.textures.get("god") );
				xichtTex.width = 75*4;
				xichtTex.height = 95*4;
				xichtTex.image.alpha = 0;
				console.log(xichtTex)

				xicht.add(xichtTex, "xicht");

				var subs = new Text( {
					y: game.height-60,
					width: game.width,
					value: " ",
					color: "#FFF",
					font: "akashiregular",
					visible: false,
					align: "center",
					size: 20,
				} );

				_this.add(subs, "subtitles");

				var tut = new Text( {
					y: 20,
					// x: game.width - 150,
					width: game.width,
					text: ["Use A to cover yourself and S, D to fight!","Move using your arrow keys!"],
					color: "#F00",
					font: "akashiregular",
					visible: false,
					align: "center",
					size: 20,
				} );

				_this.add(tut, "tutorial");
			},
			controls: function(){
				game.eventhandler.resetControls();

				_this.addControls();

				game.eventhandler.addKeyboardControl(" ", function(){
					game.links.god.jump( new Vector2(0, -10) );
				})
				// left
				game.eventhandler.addKeyboardControl(39, function(){
					game.links.god.go( new Vector2(3, 0) );
				}, function(){
					game.links.god.stop();
				});
				// right
				game.eventhandler.addKeyboardControl(37, function(){
					game.links.god.go( new Vector2(-3, 0) );
				}, function(){
					game.links.god.stop();
				});
				game.eventhandler.addKeyboardControl("A", function(){
					game.links.god.cover();
				}, function(){
					game.links.god.uncover();
				});
				game.eventhandler.addKeyboardControl("S", function(){
					game.links.god.attack("kick");
				});
				game.eventhandler.addKeyboardControl("D", function(){
					game.links.god.attack("punch");
				});
				// game.eventhandler.addKeyboardControl("A", undefined, undefined, left)

				// game.eventhandler.addKeyboardControl(39, undefined, undefined, right)
				// game.eventhandler.addKeyboardControl("D", undefined, undefined, right)

			}
		},
		in_game: {
			objects: function(){
				var mapLeft = new Button(0, 0, {
					width:40,
					visible: false,
					height: game.height,
					onMouseIn: function(){
						if(game.camera.x > 0)
							game.camera.x -= 2;
					}
				})
				_this.add(mapLeft);
				var mapRight = new Button(game.width-40, 0, {
					width:40,visible: false,
					height: game.height,
					onMouseIn: function(){
						if(game.camera.x < game.playground.width-game.width)
							game.camera.x += 2;
					}
				})
				_this.add(mapRight);

				var enterMortality = new Button(game.width/2 - 130, 10, {
					width: 260,
					height: 30,
					onMouseUp: function(){
						game.loadLevel("mortal_combat");
					}
				});
				enterMortality.add( new Text({
					width: 260,
					y: 3,
					color: "#F00",
					font: "Arial",
					size: 20,
					value: "ENTER THE BRUTALITY",
					align: "center",
				}) );
				_this.add(enterMortality);


				var layout = new Button(game.width/2 - 250, game.height - 200, {
					width: 500,
					height: 200,
					visible: false
				});
				// layout.add( new Text({value:"ASDF"}) );
				_this.add(layout, "layout");

				var unitControl = new Button(10, 10, {
					width: 1,
					height: 1,
					visible: false,
				});
				layout.add( unitControl, "unitControl" );
				
				var Gold = new Button (5,0,{
					width : 100,
					height : 20,
					visible : false,
				});
				
				Gold.add(new Text({
					x:22,
					color: "#000",
					font: "PlainBlackNormal",
					size: 20,
					value: game.players.player.resources.gold,
					align: "center",
				}), "goldtext");
				
				var goldtexture = new Texture(game.textures.get("gold"));
				goldtexture.width = 20;
				goldtexture.height = 20;
				Gold.add(goldtexture);
				
				var Spec = new Button(5,30,{
					width : 100,
					height : 20,
					visible : false,
				});
				
				var specId = game.players.player.side == "creationist" ? "faith" : "knowledge";
				
				var spectexture = new Texture(game.textures.get(specId));
				spectexture.width = 20;
				spectexture.height = 20;
				Spec.add(spectexture);
				
				Spec.add(new Text({
					x:22,
					color: "#000",
					font: "PlainBlackNormal",
					size: 20,
					value: game.players.player.resources.spec,
					align: "center",
				}),"spectext");
				
				var Res = new Button(50,300,{
					width : 100,
					height : 55,
					visible : false,
				});
				
				var restexture = new Texture(game.textures.get("button2"));
				restexture.width = Res.width;
				restexture.height = Res.height;
				Res.add(restexture);
				
				Res.add(Spec, "spec");
				Res.add(Gold, "gold");
				_this.add(Res, "resources")
				
				var BuildMenu = new Button(40,360,{
					width:130,
					height:50,
					visible:false,
				});
				
				function MakeTextures(){
					for(var i = 0; i < 4;i++){
						var buttonTexture = new Texture(game.textures.get("button"));
						buttonTexture.width = BuildMenu.children[i].width;
						buttonTexture.height = BuildMenu.children[i].height;
						BuildMenu.children[i].add(buttonTexture);
					};
					for(var j = 4; j < BuildMenu.children.length;j++){
						var buttonTexture = new Texture(game.textures.get("button_off"));
						buttonTexture.width = 120;
						buttonTexture.height = 40;
						BuildMenu.children[j].add(buttonTexture);
					};
				};
				if(game.players.player.side == "creationist"){
					var holyfire = new Button(270,0,{
					width:190,
					height:40,
					visible:false,
					onMouseUp:function (){if(!game.links.base.build(Bookmine)){console.log("not enough resources");};},
					});
					BuildMenu.add(holyfire);
					
					var Samostril = new Button(270,45,{
					width:190,
					height:40,
					visible:false,
					onMouseUp:function (){if(!game.links.base.build(CrossScorpio)){console.log("not enough resources");};},
					});
					BuildMenu.add(Samostril);
					
					var Hranice = new Button(270,90,{
					width:190,
					height:40,
					visible:false,
					onMouseUp:function (){if(!game.links.base.build(Bonfire)){console.log("not enough resources");};},
					});
					BuildMenu.add(Hranice);
					
					var painting = new Button(10,0,{
					width:120,
					height:40,
					visible:false,
					onMouseUp:function (){if(!game.links.base.build(Bonfire)){console.log("not enough resources");};},
					});
					BuildMenu.add(painting);
					
					var confessory = new Button(10,45,{
					width:120,
					height:40,
					visible:false,
					onMouseUp:function (){if(game.links.base.tier >= 1){if(!game.links.base.build(Bonfire)){console.log("not enough resources");};}},
					});
					BuildMenu.add(confessory);
					
					var altar = new Button(10,90,{
					width:120,
					height:40,
					visible:false,
					onMouseUp:function (){if(game.links.base.tier >= 2){if(!game.links.base.build(Bonfire)){console.log("not enough resources");};}},
					});
					BuildMenu.add(altar);
					
					var slum = new Button(140,0,{
					width:120,
					height:40,
					visible:false,
					onMouseUp:function (){if(game.links.base.tier >= 3){if(!game.links.base.build(Bonfire)){console.log("not enough resources");};}},
					});
					BuildMenu.add(slum);
					
					var golgota = new Button(140,45,{
					width:120,
					height:40,
					visible:false,
					onMouseUp:function (){if(game.links.base.tier >= 3){if(!game.links.base.build(Bonfire)){console.log("not enough resources");};}},
					});
					BuildMenu.add(golgota);
					
					MakeTextures();
					
					holyfire.add(new Text({
					x:35,
					y:10,
					color: "#000",
					font: "PlainBlackNormal",
					size: 14,
					value: "Build Holy fire mine!",
					align: "center",
					}));
					
					Samostril.add(new Text({
					x:35,
					y:10,
					color: "#000",
					font: "PlainBlackNormal",
					size: 14,
					value: "Build Cross Scorpio!",
					align: "center",
					}));
					
					Hranice.add(new Text({
					x:55,
					y:10,
					color: "#000",
					font: "PlainBlackNormal",
					size: 14,
					value: "Build bonfire!",
					align: "center",
					}));
					
					painting.add(new Text({
					x:22,
					y:10,
					color: "#000",
					font: "PlainBlackNormal",
					size: 14,
					value: "Build Painting!",
					align: "center",
					}));
					
					confessory.add(new Text({
					x:13,
					y:10,
					color: "#FFF",
					font: "PlainBlackNormal",
					size: 14,
					value: "Build confessory!",
					align: "center",
					}));
					
					altar.add(new Text({
					x:25,
					y:10,
					color: "#FFF",
					font: "PlainBlackNormal",
					size: 14,
					value: "Build Altar!",
					align: "center",
					}));
					
					slum.add(new Text({
					x:27,
					y:10,
					color: "#FFF",
					font: "PlainBlackNormal",
					size: 14,
					value: "Build slum!",
					align: "center",
					}));
					
					golgota.add(new Text({
					x:20,
					y:10,
					color: "#FFF",
					font: "PlainBlackNormal",
					size: 14,
					value: "Build Golgota!",
					align: "center",
					}));
					
				}
				else{
					var book = new Button(270,0,{
					width:190,
					height:40,
					visible:false,
					onMouseUp:function (){if(!game.links.base.build(Galapags)){console.log("not enough resources");};},
					});
					BuildMenu.add(book);
					
					var machinegun = new Button(270,45,{
					width:190,
					height:40,
					visible:false,
					onMouseUp:function (){if(!game.links.base.build(Galapags)){console.log("not enough resources");};},
					});
					BuildMenu.add(machinegun);
					
					var bookpile = new Button(270,90,{
					width:190,
					height:40,
					visible:false,
					onMouseUp:function (){if(!game.links.base.build(Galapags)){console.log("not enough resources");};},
					});
					BuildMenu.add(bookpile);
					
					var laboratory = new Button(10,0,{
					width:120,
					height:40,
					visible:false,
					onMouseUp:function (){if(!game.links.base.build(Galapags)){console.log("not enough resources");};},
					});
					BuildMenu.add(laboratory);
					
					var gaybar = new Button(10,45,{
					width:120,
					height:40,
					visible:false,
					onMouseUp:function (){if(game.links.base.tier >= 1){if(!game.links.base.build(Galapags)){console.log("not enough resources");};}},
					});
					BuildMenu.add(gaybar);
					
					var portal = new Button(10,90,{
					width:120,
					height:40,
					visible:false,
					onMouseUp:function (){if(game.links.base.tier >= 2){if(!game.links.base.build(Galapags)){console.log("not enough resources");};}},
					});
					BuildMenu.add(portal);
					
					var museum = new Button(140,0,{
					width:120,
					height:40,
					visible:false,
					onMouseUp:function (){if(game.links.base.tier >= 3){if(!game.links.base.build(Museum)){console.log("not enough resources");};}},
					});
					BuildMenu.add(museum);
					
					var galapags = new Button(140,45,{
					width:120,
					height:40,
					visible:false,
					onMouseUp:function (){if(game.links.base.tier >= 3){if(!game.links.base.build(Galapags)){console.log("not enough resources");};}},
					});
					BuildMenu.add(galapags);
					
					MakeTextures();
					
					book.add(new Text({
					x:30,
					y:10,
					color: "#000",
					font: "PlainBlackNormal",
					size: 14,
					value: "Build Explosive book!",
					align: "center",
					}));
					
					machinegun.add(new Text({
					x:0,
					y:10,
					color: "#000",
					font: "PlainBlackNormal",
					size: 14,
					value: "Build build primitive machine gun!",
					align: "center",
					}));
					
					bookpile.add(new Text({
					x:37,
					y:10,
					color: "#000",
					font: "PlainBlackNormal",
					size: 14,
					value: "Build Pile of books!",
					align: "center",
					}));
					
					laboratory.add(new Text({
					x:22,
					y:10,
					color: "#000",
					font: "PlainBlackNormal",
					size: 14,
					value: "Build laboratory!",
					align: "center",
					}));
					
					gaybar.add(new Text({
					x:22,
					y:10,
					color: "#FFF",
					font: "PlainBlackNormal",
					size: 14,
					value: "Build Gay Bay!",
					align: "center",
					}));
					
					portal.add(new Text({
					x:0,
					y:10,
					color: "#FFF",
					font: "PlainBlackNormal",
					size: 14,
					value: "Build demonic portal!",
					align: "center",
					}));
					
					museum.add(new Text({
					x:22,
					y:10,
					color: "#FFF",
					font: "PlainBlackNormal",
					size: 14,
					value: "Build museum!",
					align: "center",
					}));
					
					galapags.add(new Text({
					x:22,
					y:10,
					color: "#FFF",
					font: "PlainBlackNormal",
					size: 14,
					value: "Build Galapags!",
					align: "center",
					}));
				}
				BuildMenu.enableTier = function (n){
					if(n < 3){
						this.children[n+3].children[0] = new this.onTexture(game.textures.get("button"));
						this.children[n+3].children[0].width = 120;
						this.children[n+3].children[0].height = 40;
						
						this.children[n+3].children[1].color = "#000";
					}
					if(n == 3){
						this.children[n+3].children[0] = new this.onTexture(game.textures.get("button"));
						this.children[n+3].children[0].width = 120;
						this.children[n+3].children[0].height = 40;
						
						this.children[n+3].children[1].color = "#000";
						
						this.children[n+4].children[0] = new this.onTexture(game.textures.get("button"));
						this.children[n+4].children[0].width = 120;
						this.children[n+4].children[0].height = 40;
						
						this.children[n+4].children[1].color = "#000";
					}
				};
				BuildMenu.onTexture = Texture;
				
				_this.add(BuildMenu, "BuildMenu");
			},
			updateUnitControl: function(t, actions){
				game.gui.links.layout.links.unitControl.children = [];

				for(var i in actions){
					var button = new Button(i * 130, 0, {
						width: 120,
						height: 40,
						visible: false,
						onMouseUp: actions[i].exec
					});
					// obrázek
					var texture = new Texture(game.textures.get("button"));
					texture.width = 120;
					texture.height = 40;

					button.add( texture );
					// text
					var text = new Text({
						y: 4,
						color: "#000",
						font: "PlainBlackNormal",
						size: actions[i].name > 10 ? 26 : 16,
						value: actions[i].name,
						align: "center",
					});
					text.width = 120;
					text.height = 40;

					button.add( text );

					_this.links.layout.links.unitControl.add( button );
				}
			},
			controls: function(){
				game.eventhandler.resetControls();

				_this.addControls();

				game.eventhandler.addMouseControl(1,function () {
					game.unselectAll();
					for(var i in game.children){
						if( game.children[i].inObject(game.eventhandler.mouse.projected) && game.children[i].collidable ){
							game.children[i].selected = true;
							game.selected = [ game.children[i] ];
							if(!game.children[i].ghost)
								_this.guis.in_game.updateUnitControl(game.children[i], game.children[i].actions)

							game.children[i].onSelect()
						};
					};
				});
				game.eventhandler.addMouseControl(3,function(){
					game.unselectAll();
				});

				var left = function(){
					if(game.camera.x > 0)
							game.camera.x -= 4;
				}
				var right = function(){
					if(game.camera.x < game.playground.width-game.width)
						game.camera.x += 4;
				}

				game.eventhandler.addKeyboardControl(37, undefined, undefined, left)
				game.eventhandler.addKeyboardControl("A", undefined, undefined, left)

				game.eventhandler.addKeyboardControl(39, undefined, undefined, right)
				game.eventhandler.addKeyboardControl("D", undefined, undefined, right)

			}
		}
	}
	
}
GUI.prototype = new GUIObject();

GUI.prototype.switchGUI = function(gui) {
	this.resetGUI();
	if(!this.guis[gui]){
		console.log("game.GUI: gui "+gui+" does not exist.")
		return
	}

	this.activeGUI = gui;

	if(this.guis[gui].preload)
		this.guis[gui].preload();

	if(this.guis[gui].objects)
		this.guis[gui].objects();

	if(this.guis[gui].controls){
		game.eventhandler.resetControls();
		this.guis[gui].controls();
	}

	if(this.guis[gui].afterload)
		this.guis[gui].afterload();
};
GUI.prototype.resetGUI = function() {
	this.children = [];
	this.links = {};
};
GUI.prototype.tick = function (){
	this.tickChildren();
};

GUI.prototype.render = function (ctx){
	this.renderChildren(ctx);
};

GUI.prototype.addControls = function() {
	var _this = this;
	game.eventhandler.addMouseControl(1, function(x,y){
		_this.mousehandler(x,y,"onMouseDown");
	}, function(x,y){
		_this.mousehandler(x,y,"onMouseUp");
	});
	game.eventhandler.addMouseControl(0, function(x,y){
		_this.mousehandler(x,y,"onMouseMove");
	});
};
