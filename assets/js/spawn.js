function Spawn(con,x,side){
	if(con !== undefined){
		var obj = new con({position:new Vector2(x,0),owner:side})
		obj.position.y = game.links.terrain.getHeight(x) - obj.height/2
		game.add(obj);
		obj.spawnSound.play();
	}
};