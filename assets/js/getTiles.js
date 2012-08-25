function getTiles( name, callback){
	var TilesObj = false;
	
	$.getJSON("./assets/levels/tiles/"+name+".js",function (data){
		TilesObj = {};
		for(var i in data.layers){
			if(data.layers[i].type == "tilelayer"){
				TilesObj.data = data.layers[i].data;
				TilesObj.tilesSet = [];
				TilesObj.tileWidth = data.tilewidth;
				TilesObj.tileHeight = data.tileheight;
				
				TilesObj.width = data.width;
				TilesObj.height = data.height;
				TilesObj.src = "./assets/textures/"+data.tilesets[0].image.substring(data.tilesets[0].image.lastIndexOf("/")+1);
				TilesObj.image = new Image();
				TilesObj.image.src = TilesObj.src;
				TilesObj.x = 0;
				TilesObj.y = 0;
				TilesObj.render = function (ctx){
					for(var i in this.data){
						if(this.data[i] != 0){
							ctx.drawImage(this.image,this.image.width%(this.data[i]-1)*this.tileWidth,Math.floor(this.image.height/this.tileheight*this.data[i]),(i%this.width)*this.tileWidth,this.data[i]%this.height*this.tileheight);
						}
					};
				};
				TilesObj.tick = function (){};
			}
		};
		callback(TilesObj);
	});
};