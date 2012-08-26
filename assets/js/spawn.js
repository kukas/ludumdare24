function Spawn(con,x,side){
	if(con !== undefined){
		var obj = new con({position:new Vector2(x,game.links.terrain.getHeight(x) - obj.height/2)});
		obj.owner = side;
		if(side == "enemy") obj.texture.flip = "x";
		game.add(obj);
		obj.spawnSound.play();
	}
};