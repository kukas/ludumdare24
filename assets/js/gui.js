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

		if(options.texture){
			this.add(options.texture);
		}

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

		this.value = options.value === undefined ? " " : options.value;
		this.text = options.text === undefined ? [] : options.text;
		this.color = options.color === undefined ? "#FFF" : options.color;
		this.blink = options.blink === undefined ? false : options.blink;
		this.size = options.size === undefined ? 16 : options.size;
		this.lineSpacing = options.lineSpacing === undefined ? 1 : options.lineSpacing;
		this.font = options.font === undefined ? "Verdana" : options.font;
		this.style = options.style === undefined ? "normal" : options.style;
		this.weight = options.weight === undefined ? 400 : options.weight;
		this.shadow = options.shadow === undefined ? false : options.shadow;

		this.visible = options.visible === undefined ? true : options.visible;

		var ctx = document.createElement("canvas").getContext("2d");
		ctx.font = this.style + " " + this.weight + " " + this.size + "px " + this.font;

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

		var ctx = document.createElement("canvas").getContext("2d");
		ctx.font = this.style + " " + this.weight + " " + this.size + "px " + this.font;

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
	};
	Text.prototype.render = function(ctx) {
		if(!this.visible)
			return
		ctx.font = this.style + " " + this.weight + " " + this.size + "px " + this.font;

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
		this.width = options.width === undefined ? image.width : options.width;
		this.height = options.height === undefined ? image.height : options.height;

		this.image = image;
		this.repeat = options.repeat === undefined ? false : options.repeat;

		this.scale = options.scale === undefined ? 1 : options.scale;
	}
	Texture.prototype = new GUIObject();
	Texture.prototype.render = function(ctx){
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
				var play1 = new Button(500,300,{
					width:400,
					height:70,
					visible:false,
					onMouseUp:function (){game.setPlayer("creationist");game.loadLevel("test");},
					});
					
					var texture = new Texture(game.textures.get("button"));
					texture.width = play1.width;
					texture.height = play1.height;
					
					play1.add(texture);
					
					play1.add(new Text({
					x: 0, 
					y: 0,
					value: "Play for creationists",
					color: "#000",
					font: "PlainBlackNormal",
					size: 50,
					}));
					
					_this.add(play1);
					
					var play2 = new Button(500,400,{
					width:400,
					height:70,
					visible:false,
					onMouseUp:function (){game.setPlayer("atheist");game.loadLevel("test");},
					});
					
					var texture2 = new Texture(game.textures.get("button"));
					texture2.width = play1.width;
					texture2.height = play1.height;
					
					play2.add(texture2);
					
					play2.add(new Text({
					x: 0, 
					y: 0,
					value: "Play for atheists",
					color: "#000",
					font: "PlainBlackNormal",
					size: 50,
					}));
					
					_this.add(play2);
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

				// var enterMortality = new Button(game.width/2 - 130, 10, {
				// 	width: 260,
				// 	height: 30,
				// 	onMouseUp: function(){
				// 		game.loadLevel("mortal_combat");
				// 	}
				// });
				// enterMortality.add( new Text({
				// 	width: 260,
				// 	y: 3,
				// 	color: "#F00",
				// 	font: "Arial",
				// 	size: 20,
				// 	value: "ENTER THE BRUTALITY",
				// 	align: "center",
				// }) );
				// _this.add(enterMortality);

				// LAYOUT --------------------------
				var layout = new Button( game.width/2 - 673/2, game.height - 100, {
					width: 673,
					height: 63,
					visible: false
				} )
				layout.add(new Texture(game.textures.get("layout_bg"),{x:-143}))
				layout.add(new Texture(game.textures.get("layout")))
				_this.add(layout, "layout");
				// OVLÁDACÍ TLAČÍTKA --------------------------
				var forward = new Button( 102, 63/2 - 41/2, {
					width: 41,
					height: 41,
					visible: false,
					color: "rgba(255,255,255,0.2)",
					onMouseDown: function(){
						for(var i in game.selected){
							if(game.selected[i] instanceof Unit){
								game.selected[i].forward();
							}
						}
					},
					onMouseIn: function(){
						this.visible = true;
					},
					onMouseOut: function(){
						this.visible = false;
					}
				} )
				forward.add(new Texture(game.textures.get("b_forward"),{x:41/2-20/2}))
				layout.add(forward, "forward");

				var stop = new Button( 61, 63/2 - 41/2, {
					width: 41,
					height: 41,
					visible: false,
					color: "rgba(255,255,255,0.2)",
					onMouseDown: function(){
						for(var i in game.selected){
							if(game.selected[i] instanceof Unit){
								game.selected[i].stop();
							}
						}
					},
					onMouseIn: function(){
						this.visible = true;
					},
					onMouseOut: function(){
						this.visible = false;
					}
				} )
				stop.add(new Texture(game.textures.get("b_stop"),{y:41/2-28/2,x:41/2-28/2}))
				layout.add(stop, "stop");

				var backward = new Button( 20, 63/2 - 41/2, {
					width: 41,
					height: 41,
					visible: false,
					color: "rgba(255,255,255,0.2)",
					onMouseDown: function(){
						for(var i in game.selected){
							if(game.selected[i] instanceof Unit){
								game.selected[i].backward();
							}
						}
					},
					onMouseIn: function(){
						this.visible = true;
					},
					onMouseOut: function(){
						this.visible = false;
					}
				} )
				backward.add(new Texture(game.textures.get("b_backward"),{x:41/2-28/2}))
				layout.add(backward, "backward");

				// RESOURCES --------------------------
				var gold = new Button( 160, 5, {
					width: 100,
					height: 25,
					visible: false,
					color: "rgba(255,255,255,0.2)",
					onMouseIn: function(){
						this.visible = true;
					},
					onMouseOut: function(){
						this.visible = false;
					}
				} )
				gold.add(new Texture(game.textures.get("b_gold")));
				gold.add(new Text({
					x: 27,
					value:"1000",
					size:20
				}), "text")
				layout.add(gold, "gold");

				var spec = new Button( 160, 34, {
					width: 100,
					height: 25,
					visible: false,
					color: "rgba(255,255,255,0.2)",
					onMouseIn: function(){
						this.visible = true;
					},
					onMouseOut: function(){
						this.visible = false;
					}
				} );
				spec.add(new Texture(game.textures.get("b_faith"),{height:25, width:18}))
				spec.add(new Text({
					x: 27,
					value:"1000",
					size:20
				}), "text")
				layout.add(spec, "spec");
				// actions -------------------------------
				var actions = new Button( 270, 6, {
					width: 370,
					height: 50,
					visible: false,
					color: "rgba(255,255,255,0.2)",
				} )
				layout.add(actions, "actions");

				var hoverText = new Button(0,-100, {
					width: 673,
					height: 100,
					visible: false,
					color: "rgba(255,255,255,0.8)"
				});
				var name = new Text({
					y: 0,
					width: 673,
					value: " ",
					font: "Arial",
					color: "#000",
					size: 18,
				});
				hoverText.add(name, "name");

				var price = new Text({
					y: 0,
					x: 200,
					width: 673,
					value: " ",
					font: "Arial",
					color: "#000",
					size: 18,
				});
				hoverText.add(price, "price");

				var description = new Text({
					y: 40,
					width: 673,
					value: " ",
					font: "Arial",
					color: "#000",
					size: 18,
				});
				hoverText.add(description, "description");

				var quote = new Text({
					y: 80,
					width: 673,
					value: " ",
					font: "Arial",
					color: "#000",
					style: "italic",
					size: 18,
				});
				hoverText.add(quote, "quote");

				hoverText.change = function(desc){
					this.visible = true;
					this.links.name.changeText(desc.name);
					var price = "price: "
					var specName = game.players.player.side == "atheist" ? "knowledge" : "faith";
					if(desc.gold)
						this.links.price.changeText(price + desc.gold + " gold");
					else if(desc.spec)
						this.links.price.changeText(price + desc.spec + " " + specName);
					this.links.description.changeText(desc.description);
					this.links.quote.changeText(desc.quote);
				}
				hoverText.hide = function(){
					this.visible = false;
					this.links.name.changeText(" ");
					this.links.price.changeText(" ");
					this.links.description.changeText(" ");
					this.links.quote.changeText(" ");
				}
				layout.add(hoverText, "hoverText");
				var spacing = 49;
				if(game.players.player.side == "creationist"){
					_this.guis.in_game.updateActions(game.buildingCreationist);
				}
				else{
					_this.guis.in_game.updateActions(game.buildingAtheists);
				}

				actions.enableTier = function (n){
					if(game.players.player.side == "creationist")
						var buildings = game.buildingCreationist;
					else
						var buildings = game.buildingAtheists;

					if(n < 3){
						buildings[n+3].canBuild = true;
					}
					if(n == 3){
						buildings[n+3].canBuild = true;
						buildings[n+4].canBuild = true;
					}
				};
				actions.onTexture = Texture;
				
				// _this.add(BuildMenu, "BuildMenu");
			},
			updateActions: function(actions){
				if(actions == game.buildingCreationist || actions == game.buildingAtheists)
					game.gui.links.layout.links.actions.buildBuildings = true;
					
				game.gui.links.layout.links.actions.children = [];

				for(var i in actions){
					var spacing = 49;
					var button = new Button(i*spacing, 1, {
						width: 47,
						height: 47,
						visible: false,
						color: "rgba(255,255,255,0.6)",
						onMouseUp: actions[i].exec,
						onMouseIn: function(){
							this.visible = true;
							game.gui.links.layout.links.hoverText.change(this.description);
						},
						onMouseOut: function(){
							game.gui.links.layout.links.hoverText.hide();
							this.visible = false;
						},
					});
					if(actions[i].canBuild === false){
						button.onMouseUp = undefined;
						button.onMouseIn = undefined;
					}
					button.description = actions[i].description;
					// obrázek
					var texture = new Texture( game.textures.get(actions[i].icon) );
					texture.x = 47/2 - texture.width/2;
					texture.y = 47/2 - texture.height/2;

					button.add( texture );

					game.gui.links.layout.links.actions.add( button );
				}
			},
			controls: function(){
				game.eventhandler.resetControls();

				_this.addControls();

				game.eventhandler.addMouseControl(1,function () {
					if(game.eventhandler.mouse.y > game.links.terrain.middleHeight+game.links.terrain.elevation)
						return;

					game.unselectAll();
					if(game.players.player.side == "creationist"){
						_this.guis.in_game.updateActions(game.buildingCreationist);
					}
					else{
						_this.guis.in_game.updateActions(game.buildingAtheists);
					}
					for(var i in game.children){
						if( game.children[i].inObject(game.eventhandler.mouse.projected) && game.children[i].collidable ){
							game.children[i].selected = true;
							game.selected = [ game.children[i] ];
							if(!game.children[i].ghost)
								_this.guis.in_game.updateActions(game.children[i].actions)

							game.children[i].onSelect()
						};
					};
				});
				game.eventhandler.addMouseControl(3,function(){
					game.unselectAll();
					if(game.players.player.side == "creationist"){
						_this.guis.in_game.updateActions(game.buildingCreationist);
					}
					else{
						_this.guis.in_game.updateActions(game.buildingAtheists);
					}
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
