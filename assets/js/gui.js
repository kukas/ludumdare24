function GUIObject(){
	this.x = 0;
	this.y = 0;
	this.width = 0;
	this.height = 0;

	this.parent = false;
	this.children = [];
}
GUIObject.prototype.add = function( obj ) {
	obj.parent = this;
	this.children.push( obj );
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
	this.tickChildren();
};

GUIObject.prototype.render = function (ctx){
	this.renderChildren(ctx);
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
	for (var i in this.children){
		this.children[i].mousehandler(x+this.x,y+this.y,type);
	}
};

function GUI(){
	var _this = this;

	function Button(x, y, options){
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

	};
	Button.prototype = new GUIObject();
	Button.prototype.render = function(ctx) {
		if(this.visible){
			ctx.fillStyle = this.color;
			ctx.fillRect(this.x, this.y, this.width, this.height);
		}
		this.renderChildren(ctx);
	};

	function Text(options){
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
	function Texture(options){
		this.x = options.x === undefined ? 0 : options.x;
		this.y = options.y === undefined ? 0 : options.y;
		this.width = options.width === undefined ? 0 : options.width;
		this.height = options.height === undefined ? 0 : options.height;

		this.image = options.image === undefined ? new Image() : options.image;
		this.clip = options.clip === undefined ? false : options.clip;
		this.repeat = options.repeat === undefined ? false : options.repeat;

		this.scale = options.scale === undefined ? 1 : options.scale;
	}
	Texture.prototype = new GUIObject();
	Texture.prototype.render = function(ctx){
		// if(this.clip)
		// 	ctx.drawImage(this.image, this.x, this.y, this.width, this.height, this.clip.x, this.clip.y, this.clip.width, this.clip.height);
		// else
		// 	ctx.drawImage(this.image, this.x, this.y, this.width, this.height);

		if(this.repeat){
			if(this.scale !== 1){
				ctx.save();
				ctx.scale(this.scale, this.scale);
			}
			ctx.fillStyle = ctx.createPattern(this.image, "repeat");
			ctx.fillRect(this.x, this.y, this.width, this.height);
			if(this.scale !== 1){
				ctx.restore();
			}
		}
		else {
			ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
		}
	}

	this.guis = {
		main_menu: {
			objects: function(){
				var objects = [];

				var img2 = new Image();
				img2.src = "assets/textures/background.png";
				// pozadí
				objects.push( new Texture({width: game.width, height: game.height, image: img2, repeat: true, scale: 4}) )

				var img = new Image();
				img.src = "assets/textures/button.png";
				// tlačítko
				var button = new Button(game.width/2-50,70, { width: 100, height: 50, visible: false,
					   onMouseDown: function(){
						this.children[0].image.src = "assets/textures/button2.png";
					}, onMouseUp: function(){
					   	console.log("starting the game...")
						this.children[0].image.src = "assets/textures/button.png";
					}, onMouseIn: function(){
						document.body.style.cursor = "pointer"
					}, onMouseOut: function(){
						this.children[0].image.src = "assets/textures/button.png";
						document.body.style.cursor = "default"
					} });
				button.add( new Texture({width:100, height:50, image: img}) )
				button.add( new Text({ value:"Start Game", color: "#000", weight: 700, size: 13, width: 100, height: 50, align: "center", valign: "center",
				shadow: { color: "#666", blur: 1 } }) );
				
				objects.push(button);

				return objects;
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

	if(this.guis[gui].preload)
		this.guis[gui].preload();

	var objects = this.guis[gui].objects();

	for(var i in objects){
		this.add( objects[i] );
	}

	if(this.guis[gui].controls)
		this.guis[gui].controls();

	if(this.guis[gui].afterload)
		this.guis[gui].afterload();
};
GUI.prototype.resetGUI = function() {
	this.children = [];
};