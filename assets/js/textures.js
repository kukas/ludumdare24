function Texture(image, options){
	var _this = this;
	options = options === undefined ? {} : options;

	this.image = image;

	this.creationTime = new Date().getTime();

	this.width = this.image.width;
	this.height = this.image.height;

	this.flip = options.flip === undefined ? false : options.flip;

	this.clip = options.clip === undefined ? {x: 0, y: 0, width: _this.width, height: _this.height} : options.clip;
	
	this.scale = options.scale === undefined ? new Vector2(1,1) : options.scale;
	
	this.animated = !!options.animation;
	if(this.animated){
		this.frame = 0;
		this.frames = options.animation.frames;
		this.frameWidth = this.width/this.frames;

		this.speed = options.animation.speed;
		this.cycle = options.animation.cycle === undefined ? true : options.animation.cycle;
	}
}
Texture.prototype.draw = function(ctx, x, y, width, height) {
	width = width === undefined ? this.width : width;
	height = height === undefined ? this.height : height;
	ctx.save();
	var addX = addY = 0;
	if(this.flip){
		if(this.flip == "x"){
			ctx.scale(-1,1);
			var addX = -this.frameWidth/2;
			ctx.translate(addX, 0);
		}
		else if(this.flip == "y"){
			ctx.scale(1,-1);
			var addY = -this.height/2;
			ctx.translate(0, addY);
		}
	}
	
	if(this.animated){
		ctx.drawImage(this.image, 
			Math.floor(this.frame)*this.frameWidth,0,
			this.width/this.frames,this.height,
			x + addX,y + addY,
			width,height
			);
		if(this.frame + 1/this.speed < this.frames){
			this.frame += 1/this.speed;
		}
		else if(this.cycle){
			this.frame = 0;
		}

	}
	else {
		ctx.drawImage(this.image, this.clip.x, this.clip.y, this.clip.width, this.clip.height, 0, 0, width, height);
	}
	ctx.restore();
};

function Textures(){
	this.textures = {};
}
Textures.prototype.get = function(name, options) {
	return new Texture( this.textures[name], options );
};
Textures.prototype.loadTextures = function(src_object, callback) {
	var _this = this;
	this.textures_src = src_object;

	this.texturesToLoad = Object.keys(this.textures_src).length;

	if(this.texturesToLoad <= 0){
		callback();
		return;
	}

	for(var name in this.textures_src){
		(function(name, callback){
			var image = new Image();

			image.onload = function(){
				_this.textures[name] = image;
				if( --_this.texturesToLoad <= 0 )
					callback();
			}

			image.src = _this.textures_src[name] + "?_="+Math.random();
		}(name, callback))
	};
};