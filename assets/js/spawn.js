function Spawn(con,x,side){
	if(con !== undefined){
		var obj = new con({position:new Vector2(x,game.links.terrain.getHeight(x)),owner:side})
		game.add(obj);
		obj.spawnSound.play();
	}
};