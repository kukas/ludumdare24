function GUIObject(){
	this.creationTime = new Date().getTime();

	this.x = 0;
	this.y = 0;
	this.width = 0;
	this.height = 0;

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
GUIObject.prototype.get = function( name ) {
	return this.links[name];
};

GUIObject.prototype.tickChildren = function (){
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

	if(this[type] || (type == "onMouseMove" && (this.onMouseIn || this.onMouseOut)) ){
		if( x > this.x && x < this.x+this.width &&
			y > this.y && y < this.y+this.height){
			if(type != "onMouseMove")
				this[type]();
			else if(this.onMouseIn)
				this.onMouseIn();
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
		this.text = [];
		this.color = options.color === undefined ? "#FFF" : options.color;
		this.size = options.size === undefined ? 16 : options.size;
		this.lineSpacing = options.lineSpacing === undefined ? 1 : options.lineSpacing;
		this.font = options.font === undefined ? "Verdana" : options.font;
		this.weight = options.weight === undefined ? 400 : options.weight;
		this.shadow = options.shadow === undefined ? false : options.shadow;

		var ctx = document.createElement("canvas").getContext("2d");
		ctx.font = this.weight + " " + this.size + "px " + this.font;

		// zalamování textu
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
	Text.prototype.render = function(ctx) {
		ctx.font = this.weight + " " + this.size + "px " + this.font;
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
		ctx.globalAlpha = 1;
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
		in_game: {
			objects: function(){
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
						size: 26,
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
				_this.addControls()
				game.eventhandler.addMouseControl(1,function () {
					for(var j in game.selected){
						game.selected[j].selected = false;
					};
					for(var i in game.children){
						if( game.children[i].inObject(game.eventhandler.mouse) && game.children[i].collidable ){
							game.children[i].selected = true;
							game.selected = [ game.children[i] ];
							_this.guis.in_game.updateUnitControl(game.children[i], game.children[i].actions)

							game.children[i].onSelect()
						};
					};
				})
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

function ProgressBar(texture,maxValue, options){
		GUIObject.call(this);
		options = options === undefined ? {} : options;

		this.x = options.x === undefined ? 0 : options.x;
		this.y = options.y === undefined ? 0 : options.y;
		this.width = options.width === undefined ? 0 : options.width;
		this.height = options.height === undefined ? 0 : options.height;
			
		this.maxValue = maxValue === undefined ? 100 : maxValue;
		this.value = options.value === undefined ? 0 : options.value;
		this.texture = texture;
		
		this.render = function (ctx){
			ctx.drawImage(this.texture.image,this.x,this.y,this.width*this.value/this.maxValue,this.height);
		};
	};
